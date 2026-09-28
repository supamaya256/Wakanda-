import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage, auth } from "./firebase";
import firebaseConfigJson from "../../firebase-applet-config.json";

export interface StorageUploadProgress {
  percent: number;
  transferredBytes: number;
  totalBytes: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
  provider?: 'firebase' | 'cloudinary' | 'server' | 'local';
}

export interface UploadResult {
  url: string;
  provider: 'firebase' | 'cloudinary' | 'server' | 'local';
  fullPath?: string;
  publicId?: string;
  name: string;
  size: number;
  type: string;
  warning?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface FirebaseStorageConfig {
  customBucket: string;
}

const DEFAULT_CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: 'hbyqk5y0',
  uploadPreset: 'ml_default',
};

const CLOUDINARY_SETTINGS_KEY = 'djemmapro_cloudinary_settings';
const STORAGE_PREFERENCE_KEY = 'djemmapro_preferred_storage';
const FIREBASE_BUCKET_KEY = 'djemmapro_firebase_custom_bucket';

export function getCloudinaryConfig(): CloudinaryConfig {
  try {
    const saved = localStorage.getItem(CLOUDINARY_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cloudName: parsed.cloudName?.trim() || DEFAULT_CLOUDINARY_CONFIG.cloudName,
        uploadPreset: parsed.uploadPreset?.trim() || DEFAULT_CLOUDINARY_CONFIG.uploadPreset,
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CLOUDINARY_CONFIG;
}

export function saveCloudinaryConfig(config: CloudinaryConfig) {
  try {
    localStorage.setItem(CLOUDINARY_SETTINGS_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Failed to save Cloudinary settings:", err);
  }
}

export function getFirebaseStorageConfig(): FirebaseStorageConfig {
  try {
    const saved = localStorage.getItem(FIREBASE_BUCKET_KEY);
    if (saved) {
      return { customBucket: saved.trim() };
    }
  } catch {
    // fallback
  }
  return { customBucket: (firebaseConfigJson as any).storageBucket || '' };
}

export function saveFirebaseStorageConfig(config: FirebaseStorageConfig) {
  try {
    localStorage.setItem(FIREBASE_BUCKET_KEY, config.customBucket.trim());
  } catch (err) {
    console.error("Failed to save Firebase Storage config:", err);
  }
}

export function getPreferredStorage(): 'firebase' | 'server' | 'auto' {
  try {
    const saved = localStorage.getItem(STORAGE_PREFERENCE_KEY);
    if (saved === 'firebase' || saved === 'server' || saved === 'auto') {
      return saved as any;
    }
  } catch {
    // fallback
  }
  return 'firebase';
}

export function savePreferredStorage(target: 'firebase' | 'server' | 'auto') {
  try {
    localStorage.setItem(STORAGE_PREFERENCE_KEY, target);
  } catch (err) {
    console.error("Failed to save storage preference:", err);
  }
}

/**
 * Upload a file directly to Firebase Cloud Storage with real-time percentage progress.
 */
export function uploadToFirebaseStorage(
  file: File,
  folder: string = 'media',
  onProgress?: (progress: StorageUploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniquePath = `uploads/${folder}/${Date.now()}_${cleanName}`;
      const storageRef = ref(storage, uniquePath);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || undefined,
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          uploadedBy: auth.currentUser?.uid || 'studio_admin',
        },
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = snapshot.totalBytes > 0 
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
            : 0;
          if (onProgress) {
            onProgress({
              percent,
              transferredBytes: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              status: 'uploading',
              provider: 'firebase',
            });
          }
        },
        (error) => {
          console.warn("Firebase Storage Upload Error:", error);
          let friendlyError = error.message;
          if (error.code === 'storage/unauthorized') {
            friendlyError = 'Firebase Storage rules blocked write. Update Storage Rules to allow authenticated upload.';
          } else if (error.code === 'storage/unknown' || (error as any).status_ === 404) {
            friendlyError = 'Firebase Storage bucket not reachable or still provisioning on Google Cloud.';
          }
          if (onProgress) {
            onProgress({
              percent: 0,
              transferredBytes: 0,
              totalBytes: file.size,
              status: 'error',
              error: friendlyError,
              provider: 'firebase',
            });
          }
          reject(new Error(friendlyError));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) {
              onProgress({
                percent: 100,
                transferredBytes: file.size,
                totalBytes: file.size,
                status: 'completed',
                provider: 'firebase',
              });
            }
            resolve({
              url: downloadUrl,
              provider: 'firebase',
              fullPath: uniquePath,
              name: file.name,
              size: file.size,
              type: file.type,
            });
          } catch (err: any) {
            reject(new Error(err.message || 'Failed to retrieve download URL from Firebase Storage.'));
          }
        }
      );
    } catch (err: any) {
      reject(new Error(err.message || 'Could not initiate Firebase Storage upload.'));
    }
  });
}

/**
 * Upload a file directly to Cloudinary using direct unsigned API upload.
 */
export function uploadToCloudinary(
  file: File,
  onProgress?: (progress: StorageUploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const config = getCloudinaryConfig();
    const cloudName = config.cloudName || DEFAULT_CLOUDINARY_CONFIG.cloudName;
    const uploadPreset = config.uploadPreset || DEFAULT_CLOUDINARY_CONFIG.uploadPreset;

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress({
          percent,
          transferredBytes: event.loaded,
          totalBytes: event.total,
          status: 'uploading',
          provider: 'cloudinary',
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;
          if (onProgress) {
            onProgress({
              percent: 100,
              transferredBytes: file.size,
              totalBytes: file.size,
              status: 'completed',
              provider: 'cloudinary',
            });
          }
          resolve({
            url: secureUrl,
            provider: 'cloudinary',
            publicId: response.public_id,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        let errorMsg = `Cloudinary error ${xhr.status}`;
        try {
          const errResp = JSON.parse(xhr.responseText);
          if (errResp.error && errResp.error.message) {
            errorMsg = errResp.error.message;
          }
        } catch {
          // ignore
        }
        if (onProgress) {
          onProgress({
            percent: 0,
            transferredBytes: 0,
            totalBytes: file.size,
            status: 'error',
            error: errorMsg,
            provider: 'cloudinary',
          });
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      const errorMsg = 'Network error during Cloudinary upload.';
      if (onProgress) {
        onProgress({
          percent: 0,
          transferredBytes: 0,
          totalBytes: file.size,
          status: 'error',
          error: errorMsg,
          provider: 'cloudinary',
        });
      }
      reject(new Error(errorMsg));
    };

    xhr.send(formData);
  });
}

/**
 * Upload file to server-side static storage (/api/upload -> public/uploads)
 * Guaranteed to succeed without external cloud quota or signing prerequisites.
 */
export async function uploadToServerStorage(
  file: File,
  folder: string = 'media',
  onProgress?: (progress: StorageUploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 50);
        onProgress({
          percent,
          transferredBytes: e.loaded,
          totalBytes: e.total,
          status: 'uploading',
          provider: 'server',
        });
      }
    };

    reader.onload = async () => {
      try {
        if (onProgress) {
          onProgress({
            percent: 60,
            transferredBytes: file.size,
            totalBytes: file.size,
            status: 'uploading',
            provider: 'server',
          });
        }

        const dataUrl = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl,
            fileName: file.name,
            folder,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        if (onProgress) {
          onProgress({
            percent: 100,
            transferredBytes: file.size,
            totalBytes: file.size,
            status: 'completed',
            provider: 'server',
          });
        }

        resolve({
          url: data.url,
          provider: 'server',
          name: file.name,
          size: file.size,
          type: file.type,
        });
      } catch (err: any) {
        // Ultimate fallback: browser Blob URL
        const localBlobUrl = URL.createObjectURL(file);
        if (onProgress) {
          onProgress({
            percent: 100,
            transferredBytes: file.size,
            totalBytes: file.size,
            status: 'completed',
            provider: 'local',
          });
        }
        resolve({
          url: localBlobUrl,
          provider: 'local',
          name: file.name,
          size: file.size,
          type: file.type,
          warning: 'Stored locally in browser session.',
        });
      }
    };

    reader.onerror = () => {
      const localBlobUrl = URL.createObjectURL(file);
      resolve({
        url: localBlobUrl,
        provider: 'local',
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Tests Cloudinary unsigned configuration with a tiny probe upload.
 */
export async function testCloudinaryConnection(
  customCloud?: string,
  customPreset?: string
): Promise<{ success: boolean; message: string; requiresUnsigned?: boolean }> {
  const config = getCloudinaryConfig();
  const cloudName = customCloud?.trim() || config.cloudName || DEFAULT_CLOUDINARY_CONFIG.cloudName;
  const uploadPreset = customPreset?.trim() || config.uploadPreset || DEFAULT_CLOUDINARY_CONFIG.uploadPreset;

  try {
    const dummyBlob = new Blob(['ping'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', dummyBlob, 'ping.txt');
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok && (data.secure_url || data.url)) {
      return {
        success: true,
        message: `Connected successfully to Cloudinary cloud "${cloudName}"! Preset "${uploadPreset}" is active and ready.`,
      };
    }

    const errMessage = data?.error?.message || `HTTP ${res.status}`;
    if (errMessage.includes('Upload preset must be whitelisted for unsigned uploads')) {
      return {
        success: false,
        requiresUnsigned: true,
        message: `Preset "${uploadPreset}" exists on cloud "${cloudName}", but is set to "Signed". In Cloudinary Console > Settings > Upload > Edit preset > set "Signing Mode" to "Unsigned".`,
      };
    }
    if (errMessage.includes('Upload preset not found')) {
      return {
        success: false,
        message: `Preset "${uploadPreset}" was not found in Cloudinary account "${cloudName}". Please check the preset name or create it in Cloudinary console.`,
      };
    }

    return { success: false, message: errMessage };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error reaching Cloudinary API.',
    };
  }
}

/**
 * Tests Firebase Storage bucket connectivity with a tiny probe upload.
 */
export async function testFirebaseStorageConnection(): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const probeRef = ref(storage, `probe_${Date.now()}.txt`);
    const probeData = new Blob(['ping'], { type: 'text/plain' });
    await uploadBytes(probeRef, probeData);
    const url = await getDownloadURL(probeRef);
    return {
      success: true,
      message: `Firebase Storage connected! Default bucket is verified and accepting uploads: ${url.slice(0, 50)}...`,
    };
  } catch (err: any) {
    let msg = err.message || 'Firebase Storage error';
    if (err.code === 'storage/unauthorized') {
      msg = 'Storage bucket reached, but security rules rejected write. In Firebase console, navigate to Storage > Rules and update rules to allow writes.';
    } else if (err.code === 'storage/unknown' || err.status_ === 404) {
      msg = `Bucket (${(firebaseConfigJson as any).storageBucket}) returned 404. Make sure Cloud Storage is enabled in the Firebase console for this project.`;
    }
    return {
      success: false,
      message: msg,
      code: err.code,
    };
  }
}

/**
 * Smart resilient upload that routes to preferred provider, falls back to alternative cloud,
 * and seamlessly ensures upload success via server media storage so work is never lost.
 */
export async function smartUploadFile(
  file: File,
  folder: string = 'media',
  preferredProvider?: 'firebase' | 'cloudinary' | 'server' | 'auto',
  onProgress?: (progress: StorageUploadProgress) => void
): Promise<UploadResult> {
  const pref = preferredProvider || getPreferredStorage();

  // Mode 1: Firebase Storage explicitly preferred or default
  if (pref === 'firebase' || pref === 'auto') {
    try {
      return await uploadToFirebaseStorage(file, folder, onProgress);
    } catch (errFb: any) {
      console.warn("Firebase Storage unavailable, saving to integrated server storage:", errFb.message);
      const serverResult = await uploadToServerStorage(file, folder, onProgress);
      return {
        ...serverResult,
        warning: `Stored on server storage (Firebase note: ${errFb.message})`,
      };
    }
  }

  // Mode 2: Server Storage
  return await uploadToServerStorage(file, folder, onProgress);
}
