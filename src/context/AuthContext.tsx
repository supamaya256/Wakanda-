import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import firebaseConfigJson from '../../firebase-applet-config.json';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isDemo?: boolean;
}

export type AuthUser = (User & Partial<AppUser>) | AppUser;

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  signInWithDemo: (email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  unauthorizedDomain: boolean;
  setUnauthorizedDomain: (val: boolean) => void;
  currentDomain: string;
  firebaseConsoleAuthUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseProjectId = firebaseConfigJson.projectId || 'gen-lang-client-0041135756';
  const firebaseConsoleAuthUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`;

  useEffect(() => {
    // Check if there is an existing demo session saved in localStorage
    let savedDemoUser: AppUser | null = null;
    try {
      const stored = localStorage.getItem('djemmapro_demo_user');
      if (stored) {
        savedDemoUser = JSON.parse(stored);
      }
    } catch {
      // storage unavailable
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          localStorage.removeItem('djemmapro_demo_user');
        } catch {
          // ignore
        }
        
        // Connect Auth to Firestore: Save/Update user profile
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || 'Guest User',
              email: currentUser.email,
              createdAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      } else if (savedDemoUser) {
        setUser(savedDemoUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Check for redirect result if returning from a redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          try {
            localStorage.removeItem('djemmapro_demo_user');
          } catch {
            // ignore
          }
        }
      })
      .catch((error) => {
        if (
          error?.code === 'auth/unauthorized-domain' ||
          error?.message?.includes('auth/unauthorized-domain') ||
          error?.message?.includes('unauthorized-domain')
        ) {
          setUnauthorizedDomain(true);
        }
        console.error("Redirect sign-in error:", error);
      });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      try {
        localStorage.removeItem('djemmapro_demo_user');
      } catch {
        // ignore
      }
      setUnauthorizedDomain(false);
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/popup-closed-by-user' ||
        error?.message?.includes('popup-blocked')
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error("Error signing in with redirect:", redirectErr);
          throw redirectErr;
        }
      }
      if (
        error?.code === 'auth/unauthorized-domain' ||
        error?.message?.includes('auth/unauthorized-domain') ||
        error?.message?.includes('unauthorized-domain')
      ) {
        setUnauthorizedDomain(true);
      }
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      try {
        localStorage.removeItem('djemmapro_demo_user');
      } catch {
        // ignore
      }
      return res;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<UserCredential> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName?.trim()) {
        try {
          await updateProfile(res.user, { displayName: displayName.trim() });
        } catch (e) {
          console.warn("Could not update profile displayName:", e);
        }
      }
      // Save profile to Firestore
      try {
        const userRef = doc(db, 'users', res.user.uid);
        await setDoc(userRef, {
          name: displayName?.trim() || email.split('@')[0],
          email: email.trim(),
          createdAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn("Could not create user document in Firestore:", e);
      }
      try {
        localStorage.removeItem('djemmapro_demo_user');
      } catch {
        // ignore
      }
      return res;
    } catch (error) {
      console.error("Error creating account with email:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error("Error sending password reset:", error);
      throw error;
    }
  };

  const signInWithDemo = async (
    customEmail: string = 'supamaya256@gmail.com',
    customName: string = 'DJ EMMA PRO FX (Super Admin)'
  ) => {
    const isMasterAdminEmail = customEmail.trim().toLowerCase() === 'supamaya256@gmail.com';
    const demoUser: AppUser = {
      uid: isMasterAdminEmail ? '6mDkYNmfNbOJ6gC9RrnU6YBRcwC2' : 'studio_' + Math.random().toString(36).substring(2, 9),
      email: customEmail,
      displayName: customName || (isMasterAdminEmail ? 'DJ EMMA PRO FX (Super Admin)' : 'Studio Guest User'),
      photoURL: null,
      isDemo: true,
    };
    try {
      localStorage.setItem('djemmapro_demo_user', JSON.stringify(demoUser));
    } catch {
      // storage unavailable
    }
    setUser(demoUser);
    setUnauthorizedDomain(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('djemmapro_demo_user');
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signInWithDemo,
        logout,
        unauthorizedDomain,
        setUnauthorizedDomain,
        currentDomain,
        firebaseConsoleAuthUrl,
      }}
    >
      {loading ? (
        <div className="fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-[99999]">
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-[#E50914] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bebas text-[#E50914] text-base font-black tracking-wider">FX</span>
            </div>
          </div>
          <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase font-mono">
            DJ EMMA PRO FX
          </span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

