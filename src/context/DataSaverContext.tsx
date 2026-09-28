/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DataSaverContextType {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
  setDataSaver: (enabled: boolean) => void;
  estimatedDataSavedMB: number;
  connectionType: string;
  isOnline: boolean;
  getOptimizedMediaUrl: (url: string, type?: 'image' | 'video', customWidth?: number) => string;
  shouldAutoplay: boolean;
  preloadStrategy: 'none' | 'metadata' | 'auto';
}

const DATA_SAVER_STORAGE_KEY = 'dj_emma_data_saver_v2';
const DATA_SAVED_COUNTER_KEY = 'dj_emma_estimated_saved_mb_v2';

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

export function DataSaverProvider({ children }: { children: ReactNode }) {
  // Check if browser requested saveData or if mobile connection
  const [isDataSaver, setIsDataSaverState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DATA_SAVER_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      // Auto-enable Data Saver on mobile or when browser signals Save-Data
      if (typeof navigator !== 'undefined') {
        const conn = (navigator as any).connection;
        if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.effectiveType === 'slow-2g')) {
          return true;
        }
        // Default to Data Saver ON for fast access and minimal cellular data usage
        const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
        return isMobile;
      }
    } catch {
      // Default to true for minimal data
      return true;
    }
    return true;
  });

  const [estimatedDataSavedMB, setEstimatedDataSavedMB] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DATA_SAVED_COUNTER_KEY);
      return saved ? parseFloat(saved) : 18.5; // Initial baseline savings
    } catch {
      return 18.5;
    }
  });

  const [connectionType, setConnectionType] = useState<string>('4G Fast');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor network connection status and speed
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updateConnection = () => {
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.effectiveType) {
          setConnectionType(conn.effectiveType.toUpperCase());
        }
      }
    };

    updateConnection();
    const conn = (navigator as any).connection;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  // Increment estimated savings over session when data saver is on
  useEffect(() => {
    if (!isDataSaver) return;

    const interval = setInterval(() => {
      setEstimatedDataSavedMB((prev) => {
        const next = parseFloat((prev + 0.4).toFixed(1));
        try {
          localStorage.setItem(DATA_SAVED_COUNTER_KEY, String(next));
        } catch {}
        return next;
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [isDataSaver]);

  const toggleDataSaver = () => {
    setIsDataSaverState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DATA_SAVER_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const setDataSaver = (enabled: boolean) => {
    setIsDataSaverState(enabled);
    try {
      localStorage.setItem(DATA_SAVER_STORAGE_KEY, String(enabled));
    } catch {}
  };

  /**
   * Transforms Cloudinary URLs to ultra-low or eco data compression
   */
  const getOptimizedMediaUrl = (url: string, type: 'image' | 'video' = 'image', customWidth?: number): string => {
    if (!url || typeof url !== 'string') return '';

    try {
      if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        if (type === 'video') {
          // Video transformation
          const trans = isDataSaver
            ? 'w_480,h_270,c_limit,q_auto:eco'
            : 'w_640,h_360,c_limit,q_auto:eco';

          if (url.includes('/video/upload/w_') || url.includes('/video/upload/h_') || url.includes('/video/upload/q_')) {
            return url.replace(/\/video\/upload\/[^/]+\//, `/video/upload/${trans}/`);
          }
          return url.replace('/video/upload/', `/video/upload/${trans}/`);
        } else {
          // Image transformation
          const width = customWidth || (isDataSaver ? 480 : 720);
          const quality = isDataSaver ? 'q_auto:low' : 'q_auto:eco';
          const trans = `f_auto,${quality},w_${width},c_limit`;

          if (url.includes('/image/upload/f_auto') || url.includes('/image/upload/w_')) {
            return url.replace(/\/image\/upload\/[^/]+\//, `/image/upload/${trans}/`);
          }
          return url.replace('/image/upload/', `/image/upload/${trans}/`);
        }
      }
    } catch {
      return url;
    }

    return url;
  };

  return (
    <DataSaverContext.Provider
      value={{
        isDataSaver,
        toggleDataSaver,
        setDataSaver,
        estimatedDataSavedMB,
        connectionType,
        isOnline,
        getOptimizedMediaUrl,
        shouldAutoplay: !isDataSaver,
        preloadStrategy: isDataSaver ? 'none' : 'metadata'
      }}
    >
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver() {
  const context = useContext(DataSaverContext);
  if (!context) {
    throw new Error('useDataSaver must be used within a DataSaverProvider');
  }
  return context;
}
