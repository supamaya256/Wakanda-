import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, Clock, ShieldCheck, ArrowLeft, Disc3 } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface ContactPageProps {
  onBackToHome?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('DJ Booking Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const whatsappMessage =
      `🎧 *DJ EMMA PRO • WEBSITE CONTACT MESSAGE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Name: ${name}\n` +
      `✉️ Email: ${email || 'Not provided'}\n` +
      `📱 Phone: ${phone || 'Not provided'}\n` +
      `📌 Subject: ${subject}\n` +
      `💬 Message: ${message || 'No additional notes'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Sent via DJ Emma Pro FX Website`;

    const waUrl = `https://wa.me/256780527361?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 8000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto">
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
          <Mail className="w-3.5 h-3.5" />
          <span>DIRECT CONTACT & BOOKINGS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          Contact <span className="text-red-600">DJ EMMA PRO</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-2xl leading-relaxed">
          Get in touch directly for club bookings, wedding entertainment, festival appearances, radio guest sets, custom nonstop mixtapes, and studio production.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%2C%20I%20would%20like%20to%20book%20you%20for%20an%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl bg-zinc-950 border border-emerald-900/40 hover:border-emerald-600 transition group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-mono">Instant Response</p>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Chat on WhatsApp
                </h3>
                <p className="text-xs text-emerald-500 font-medium">+256 780 527 361</p>
              </div>
            </div>
          </a>

          {/* Direct Phone */}
          <a
            href="tel:+256780527361"
            className="block p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-red-600 transition group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-600/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-mono">Direct Booking Hotline</p>
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition">
                  Call Management
                </h3>
                <p className="text-xs text-zinc-300 font-medium">+256 780 527 361</p>
              </div>
            </div>
          </a>

          {/* Official Email */}
          <a
            href="mailto:supamaya256@gmail.com"
            className="block p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-white transition">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-mono">Official Email</p>
                <h3 className="text-base font-bold text-white">supamaya256@gmail.com</h3>
                <p className="text-xs text-zinc-500">Business & Licensing</p>
              </div>
            </div>
          </a>

          {/* Studio Locations */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">Soroti City Studio Base</p>
                <p className="text-[11px] text-zinc-500">Eastern Uganda Region HQ</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">Kampala Operations</p>
                <p className="text-[11px] text-zinc-500">Available for East Africa & Worldwide Tours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Booking Form */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">Send an Inquiry or Booking Message</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Fill out this quick form to send your message directly to DJ Emma Pro FX on WhatsApp or email without signing in.
          </p>

          {isSent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Thank you! Your inquiry was sent to DJ Emma Pro FX. We will respond promptly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Okello"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+256 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Inquiry Type
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                >
                  <option value="Club & Festival Performance">Club & Festival Performance</option>
                  <option value="Wedding & Private Event">Wedding & Private Event</option>
                  <option value="Radio / Media Appearance">Radio / Media Appearance</option>
                  <option value="Custom Mixtape Commission">Custom Mixtape Commission</option>
                  <option value="General Question / Feedback">General Question / Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Message / Event Details
              </label>
              <textarea
                rows={4}
                placeholder="Include event date, venue location, specific music requests, or other details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to DJ Emma Pro</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom AdSlot */}
      <AdSlot slotId="contact-bottom" format="horizontal" className="mt-12" />
    </div>
  );
};
