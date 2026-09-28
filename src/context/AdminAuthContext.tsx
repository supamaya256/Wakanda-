import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdminAuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  adminUid: string | null;
  adminName: string;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  requireAdmin: (action: () => void, actionName?: string) => boolean;
  unlockAdminSession: () => Promise<void>;
  // Kept for backwards compatibility but they do nothing now
  login: () => { success: boolean; error?: string };
  logout: () => void;
  quickLoginAsOwner: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const MASTER_ADMIN_UID = '6mDkYNmfNbOJ6gC9RrnU6YBRcwC2';
export const MASTER_ADMIN_EMAIL = 'supamaya256@gmail.com';
export const MASTER_ADMIN_NAME = 'DJ EMMA PRO FX (Super Admin)';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, signInWithDemo } = useAuth();
  
  // Real Firebase-backed admin check locked to UID or master admin email: supamaya256@gmail.com
  const isAdmin = Boolean(
    user && (user.uid === MASTER_ADMIN_UID || user.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())
  );
  const adminEmail = isAdmin ? user?.email : null;
  const adminUid = isAdmin ? user?.uid : null;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState(
    'Only the designated administrator (UID: 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2) can view upload options and manage content.'
  );

  const unlockAdminSession = async () => {
    await signInWithDemo(MASTER_ADMIN_EMAIL, MASTER_ADMIN_NAME);
    setIsAuthModalOpen(false);
  };

  const login = () => {
    if (isAdmin) return { success: true };
    return { success: false, error: 'Only admin UID 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2 can view upload features.' };
  };

  const quickLoginAsOwner = () => {
    // Disabled fake login
  };

  const logout = () => {
    // Admin logout is now handled by Firebase clientLogout
  };

  const openAuthModal = (reason?: string) => {
    if (reason) {
      setAuthModalReason(reason);
    } else {
      setAuthModalReason('Only the designated administrator (UID: 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2) can view upload options and manage content.');
    }
    // Only show modal if they are actually NOT admin, to explain why it's blocked.
    // If they are admin, they shouldn't see this anyway.
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const requireAdmin = (action: () => void, actionName?: string): boolean => {
    if (isAdmin) {
      action();
      return true;
    }
    openAuthModal(
      actionName
        ? `Administrator credentials required to ${actionName}.`
        : 'Only administrator UID 6mDkYNmfNbOJ6gC9RrnU6YBRcwC2 can view upload options on this website.'
    );
    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        adminEmail,
        adminUid,
        adminName: MASTER_ADMIN_NAME,
        login,
        logout,
        quickLoginAsOwner,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        requireAdmin,
        unlockAdminSession
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

