import React from 'react';
import { Scale, ShieldCheck, ArrowLeft, Disc3, Music2, FileCheck } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface TermsPageProps {
  onBackToHome?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 p-2 rounded-lg hover:bg-zinc-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      )}

      <div className="border-b border-zinc-800 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>LEGAL TERMS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          Terms & Conditions
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Effective Date: January 1, 2026 • Last Updated: March 2026
        </p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed text-zinc-300">
        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-red-500" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the <strong className="text-white">DJ EMMA PRO FX</strong> platform, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using this website.
          </p>
        </section>

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-red-500" />
            2. Audio & Video Content Usage
          </h2>
          <p>
            The mixtapes, remixes, mashups, and voice drops streamed on this website are provided strictly for promotional entertainment, cultural discovery, and personal listening purposes.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-300">
            <li>
              <strong className="text-white">Streaming:</strong> Visitors are permitted to stream promotional audio and video content for free without creating an account.
            </li>
            <li>
              <strong className="text-white">Authorized Downloads:</strong> Direct downloads are provided solely for tracks and mixes owned by DJ EMMA PRO FX or authorized for free promotional distribution. Commercial re-distribution or resale without written consent is strictly prohibited.
            </li>
            <li>
              <strong className="text-white">Artist & Producer Rights:</strong> Original song copyrights remain the exclusive property of their respective recording artists, composers, and publishers.
            </li>
          </ul>
        </section>

        {/* AdSlot */}
        <AdSlot slotId="terms-mid" format="horizontal" />

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-red-500" />
            3. DJ Bookings & Event Contracts
          </h2>
          <p>
            Event bookings submitted through this platform constitute an inquiry. A booking is confirmed only upon receipt of written confirmation and any agreed performance deposit directly with DJ EMMA PRO FX management.
          </p>
        </section>

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            4. Disclaimer & Limitation of Liability
          </h2>
          <p>
            The website and its streaming services are provided on an "as is" and "as available" basis without warranties of any kind. DJ EMMA PRO FX shall not be liable for any temporary downtime, streaming interruptions, or data network fees incurred while streaming media.
          </p>
        </section>
      </div>
    </div>
  );
};
