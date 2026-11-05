import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings2, X, Check } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
}

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true
    analytics: true,
    advertising: true,
  });

  useEffect(() => {
    try {
      const consent = localStorage.getItem('dj_emma_cookie_consent');
      if (!consent) {
        setIsOpen(true);
      } else {
        const saved = JSON.parse(consent);
        if (saved && typeof saved === 'object') {
          setPreferences((prev) => ({ ...prev, ...saved }));
        }
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('dj_emma_cookie_consent', JSON.stringify(prefs));
    } catch {
      // Ignore localStorage errors
    }
    setPreferences(prefs);
    setIsOpen(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      advertising: true,
    });
  };

  const handleEssentialOnly = () => {
    saveConsent({
      essential: true,
      analytics: false,
      advertising: false,
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Bottom Sticky Banner */}
      <div
        role="region"
        aria-label="Cookie and Privacy Consent"
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 p-4 md:p-5 rounded-2xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl shadow-2xl text-zinc-100 animate-in fade-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 text-red-500 shrink-0 border border-red-600/20">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Privacy & Cookie Preferences
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                GDPR & AdSense Ready
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              We use cookies to maintain your playback progress, enhance your browsing experience, and serve personalized or non-personalized ads through Google AdSense partners.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Accept All
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative text-zinc-100">
            <button
              onClick={() => setShowPreferences(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close preferences"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-base font-bold text-white">Cookie Consent Settings</h2>
            </div>

            <p className="text-xs text-zinc-400 mb-5">
              Customize how cookies and third-party data collection work on DJ EMMA PRO. You can modify these preferences at any time.
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="pr-3">
                  <p className="text-xs font-semibold text-white">Strictly Necessary Cookies</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Required for audio playback state, volume levels, and website security.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono bg-zinc-800 px-2 py-0.5 rounded">Always On</span>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="pr-3">
                  <p className="text-xs font-semibold text-white">Performance & Analytics</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Helps us understand mix play counts and improve streaming server speed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Advertising */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="pr-3">
                  <p className="text-xs font-semibold text-white">Advertising & Google AdSense</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Allows Google and certified advertising partners to display relevant ads that keep mixes free.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.advertising}
                  onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-900/30 transition cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
