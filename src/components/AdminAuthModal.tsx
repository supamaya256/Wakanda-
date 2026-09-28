import { useEffect, useState } from 'react';
import { Shield, Lock, AlertCircle, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAdminAuth, MASTER_ADMIN_EMAIL } from '../context/AdminAuthContext';

export default function AdminAuthModal() {
  const {
    isAuthModalOpen,
    authModalReason,
    closeAuthModal,
    unlockAdminSession,
    isAdmin,
  } = useAdminAuth();

  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const handleEscape = () => {
      if (isAuthModalOpen) closeAuthModal();
    };
    window.addEventListener('app:escape', handleEscape);
    return () => window.removeEventListener('app:escape', handleEscape);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleUnlockAdmin = async () => {
    try {
      setIsUnlocking(true);
      await unlockAdminSession();
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#141414] border-2 border-[#E50914]/80 shadow-[0_0_50px_rgba(229,9,20,0.35)] overflow-hidden text-white z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header Glow Banner */}
        <div className="bg-gradient-to-r from-[#B81D24] via-[#E50914] to-[#B81D24] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-red-200">
                SECURITY VERIFICATION
              </span>
              <h2 className="text-base font-black tracking-tight text-white leading-tight">
                ADMIN ACCESS REQUIRED
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Reason Alert Box */}
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-red-200 mb-0.5">Admin Authorization</p>
              <p className="text-zinc-300 leading-relaxed">
                {authModalReason || 'Only the website administrator can upload or delete content.'}
              </p>
            </div>
          </div>

          {/* Master Admin Info Badge */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center text-[#E50914] font-bold">
                A
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Authorized Admin UID</div>
                <div className="font-bold text-zinc-200 font-mono text-[11px]">6mDkYNmfNbOJ6gC9RrnU6YBRcwC2</div>
                <div className="text-[10px] text-zinc-400 font-mono">{MASTER_ADMIN_EMAIL}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold font-mono">
              EXCLUSIVE
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Instant Unlock Button for Admin */}
            <button
              type="button"
              onClick={handleUnlockAdmin}
              disabled={isUnlocking}
              className="w-full py-3 px-4 rounded-xl bg-[#E50914] hover:bg-red-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isUnlocking ? 'Unlocking Studio...' : `Unlock Admin Mode (${MASTER_ADMIN_EMAIL})`}</span>
            </button>

            <button
              type="button"
              onClick={closeAuthModal}
              className="w-full py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel / Back to Music
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

