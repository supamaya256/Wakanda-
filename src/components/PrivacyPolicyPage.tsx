import React from 'react';
import { ShieldCheck, Lock, Eye, Cookie, FileText, ArrowLeft, Mail } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface PrivacyPolicyPageProps {
  onBackToHome?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 p-2 rounded-lg hover:bg-zinc-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>LEGAL & COMPLIANCE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          Privacy Policy
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Effective Date: January 1, 2026 • Last Updated: March 2026
        </p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed text-zinc-300">
        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            1. Introduction & Overview
          </h2>
          <p>
            Welcome to <strong className="text-white">DJ EMMA PRO FX</strong> ("we," "our," or "the website"), available at our official streaming domain. We are committed to protecting your personal privacy while you stream audio mixes, watch video showcases, and explore DJ booking information.
          </p>
          <p className="mt-2">
            This Privacy Policy explains the types of information we collect, how it is used, how cookies and Google AdSense are utilized to keep the platform free, and your rights regarding your personal data.
          </p>
        </section>

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-red-500" />
            2. Information We Collect
          </h2>
          <p>We believe in data minimization. We do not require visitors to register an account or provide payment card numbers to stream promotional audio mixes.</p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-300">
            <li>
              <strong className="text-white">Technical & Usage Data:</strong> IP address (anonymized), browser type, operating system, pages visited, playback duration, and device category.
            </li>
            <li>
              <strong className="text-white">Local Storage & Preferences:</strong> Audio playback position (to allow you to resume listening), volume settings, and cookie consent preferences.
            </li>
            <li>
              <strong className="text-white">Voluntary Contact Details:</strong> If you contact DJ Emma Pro for bookings via our booking form or WhatsApp, we receive the name, email, phone number, and event details you explicitly provide.
            </li>
          </ul>
        </section>

        {/* AdSense Placement */}
        <AdSlot slotId="privacy-in-article" format="in-article" />

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            3. Google AdSense & Third-Party Advertising
          </h2>
          <p>
            We use Google AdSense and Google-certified third-party advertising vendors to display advertisements when you visit our website.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-300">
            <li>
              Google uses cookies (including the DoubleClick cookie) to serve ads to users based on their visits to this and other sites on the internet.
            </li>
            <li>
              Third-party vendors and ad networks may also place and read cookies on your browser, or use web beacons to collect information in the course of ads being served.
            </li>
            <li>
              <strong className="text-white">Personalized vs Non-Personalized Ads:</strong> Depending on your location and cookie consent choices, ads may be tailored to your interests or served non-personalized based on page context.
            </li>
            <li>
              <strong className="text-white">Opting Out:</strong> You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                Google Ads Settings
              </a>{' '}
              or through the Network Advertising Initiative opt-out page at{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            4. Cookie Consent & User Controls
          </h2>
          <p>
            Our website implements a consent banner allowing you to accept or configure cookie categories (Strictly Necessary, Analytics, and Advertising). You can change your preferences at any time by clearing your browser cookies or clicking the cookie settings link in our website footer.
          </p>
        </section>

        <section className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-500" />
            5. Contact Information
          </h2>
          <p>
            If you have questions, feedback, or data privacy requests, you can contact DJ EMMA PRO directly:
          </p>
          <div className="mt-3 p-4 bg-zinc-900 rounded-xl text-xs font-mono space-y-1">
            <p>DJ EMMA PRO FX Management</p>
            <p>Email: <a href="mailto:supamaya256@gmail.com" className="text-red-400 hover:underline">supamaya256@gmail.com</a></p>
            <p>WhatsApp / Call: <a href="https://wa.me/256780527361" className="text-red-400 hover:underline">+256 780 527 361</a></p>
            <p>Locations: Soroti City & Kampala, Uganda</p>
          </div>
        </section>
      </div>
    </div>
  );
};
