import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Headphones, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  UserCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginScreenProps {
  onClose?: () => void;
  isFirstVisit?: boolean;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export default function LoginScreen({ onClose, isFirstVisit = false, initialMode = 'signin' }: LoginScreenProps) {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithDemo,
    unauthorizedDomain,
    currentDomain,
    firebaseConsoleAuthUrl,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainNotice, setShowDomainNotice] = useState(unauthorizedDomain);
  const [copiedDomain, setCopiedDomain] = useState(false);

  useEffect(() => {
    if (unauthorizedDomain) {
      setShowDomainNotice(true);
    }
  }, [unauthorizedDomain]);

  useEffect(() => {
    const handleEscape = () => {
      if (onClose) onClose();
    };
    window.addEventListener('app:escape', handleEscape);
    return () => window.removeEventListener('app:escape', handleEscape);
  }, [onClose]);

  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(currentDomain || window.location.hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
      return 'This email address is already registered. Please switch to Sign In.';
    }
    if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }
    if (code === 'auth/weak-password' || message.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/user-not-found' || message.includes('user-not-found')) {
      return 'No account found with this email. Please switch to Create Account.';
    }
    if (
      code === 'auth/wrong-password' || 
      code === 'auth/invalid-credential' || 
      message.includes('wrong-password') || 
      message.includes('invalid-credential')
    ) {
      return 'Incorrect email or password. Please verify your credentials and try again.';
    }
    if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
      return 'Too many failed sign-in attempts. Please try again in a few moments or reset your password.';
    }
    if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    return message || 'Authentication failed. Please check your information and try again.';
  };

  const handleInstantDemoLogin = async (isAdmin: boolean) => {
    setIsLoading(true);
    setError('');
    try {
      if (isAdmin) {
        await signInWithDemo('supamaya256@gmail.com', 'DJ EMMA PRO FX (Super Admin)');
      } else {
        await signInWithDemo('guest@djemmapro.com', 'Studio Fan');
      }
      if (onClose) onClose();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your account email address.');
        return;
      }
      setIsLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage(`Password reset link sent to ${email.trim()}. Please check your inbox and spam folder.`);
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please ensure both passwords are identical.');
        return;
      }

      setIsLoading(true);
      try {
        await signUpWithEmail(email.trim(), password, displayName.trim());
        if (onClose) onClose();
      } catch (err: any) {
        if (
          err.code === 'auth/unauthorized-domain' ||
          err.message?.includes('unauthorized-domain')
        ) {
          setShowDomainNotice(true);
          setError('');
        } else {
          setError(getFriendlyErrorMessage(err));
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // mode === 'signin'
    setIsLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      if (onClose) onClose();
    } catch (err: any) {
      if (
        err.code === 'auth/unauthorized-domain' ||
        err.message?.includes('unauthorized-domain')
      ) {
        setShowDomainNotice(true);
        setError('');
      } else {
        setError(getFriendlyErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithGoogle();
      if (onClose) onClose();
    } catch (err: any) {
      if (
        err.code === 'auth/unauthorized-domain' ||
        err.message?.includes('unauthorized-domain') ||
        err.message?.includes('auth/unauthorized-domain')
      ) {
        setShowDomainNotice(true);
        setError('');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Google sign-in popup was blocked by your browser. Please allow popups or open the app in a new tab.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please tap the Google button again to continue.');
      } else {
        setError(getFriendlyErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md text-white flex flex-col items-center justify-center p-4 selection:bg-[#E50914] selection:text-white animate-in fade-in duration-300 overflow-y-auto">
      {onClose && (
        <button 
          onClick={onClose}
          aria-label="Close sign in"
          className="absolute top-5 right-5 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer z-50 border border-zinc-800"
          title="Continue as Guest"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Ambient background glow */}
      <div 
        className="absolute inset-0 z-0 opacity-25 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 15%, #E50914 0%, transparent 60%), radial-gradient(circle at 85% 85%, #E50914 0%, transparent 50%)',
          filter: 'blur(110px)'
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="z-10 w-full max-w-md bg-[#121212]/95 backdrop-blur-xl border border-zinc-800/80 p-5 sm:p-7 rounded-2xl shadow-2xl relative overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* In-Card Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Close sign in"
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 border border-zinc-700/60"
            title="Close and explore site"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top DJ Emma Picture & Branding */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-2.5 group">
            {/* Glowing Studio Ring */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#E50914] via-amber-500 to-[#E50914] rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
            
            {/* DJ Emma Picture */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/90 shadow-2xl shadow-red-950/80 bg-zinc-900 ring-2 ring-red-600/50">
              <img 
                src="https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png"
                alt="DJ EMMA PRO FX"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
            
            {/* Verified DJ Pro Badge */}
            <div className="absolute bottom-0 right-0 bg-[#E50914] text-white p-1 rounded-full border-2 border-[#121212] shadow-lg flex items-center justify-center" title="DJ EMMA PRO FX - Official Verified Creator">
              <CheckCircle2 className="w-3.5 h-3.5 fill-white text-[#E50914]" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              DJ EMMA <span className="text-[#E50914]">PRO FX</span>
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Firebase & Cloud Storage Connected</span>
          </div>
        </div>

        {/* MODE SWITCHER TABS (Sign In / Create Account) */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 mb-4 select-none">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* DOMAIN AUTHORIZATION NOTICE PANEL (FOR GOOGLE AUTH) */}
        <AnimatePresence>
          {showDomainNotice && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-left space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-amber-300">
                      Email & Password is Fully Enabled
                    </p>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      You can log in directly using Email & Password below without domain authorization restrictions!
                    </p>
                  </div>
                </div>

                {/* Instant Admin Bypass */}
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin(true)}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-gradient-to-r from-red-600 to-[#E50914] hover:from-red-700 hover:to-red-600 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Super Admin Login (supamaya256@gmail.com)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR MESSAGE ALERT */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/15 border border-red-500/50 text-red-400 p-3 rounded-xl mb-4 text-xs flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1">{error}</div>
          </motion.div>
        )}

        {/* SUCCESS MESSAGE ALERT */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl mb-4 text-xs flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </motion.div>
        )}

        {/* EMAIL & PASSWORD AUTHENTICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span>Your Name / DJ Nickname</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400 text-xs font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Password</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 pr-10 text-white text-sm focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-all placeholder:text-zinc-600"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Confirm Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-all placeholder:text-zinc-600"
                required
                minLength={6}
              />
            </div>
          )}

          {mode === 'forgot' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400">Remember your password?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="text-red-400 hover:underline font-semibold cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-red-950/60 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : mode === 'signin' ? (
              <span>Sign In with Email</span>
            ) : mode === 'signup' ? (
              <span>Create Account</span>
            ) : (
              <span>Send Password Reset Email</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-3 flex items-center justify-between">
          <span className="w-1/3 border-b border-zinc-800"></span>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold px-2">
            Or connect with
          </span>
          <span className="w-1/3 border-b border-zinc-800"></span>
        </div>

        {/* GOOGLE SIGN IN BUTTON */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm border border-zinc-200"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* 1-Click Guest & Skip Options */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-3 bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-600/60 shadow-sm"
            >
              <span>Explore Website Freely (Skip Sign In)</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleInstantDemoLogin(false)}
            disabled={isLoading}
            className="w-full py-1.5 px-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-800/80"
          >
            <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Continue as Guest Fan</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
