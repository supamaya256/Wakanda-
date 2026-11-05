import React, { useState } from 'react';
import { Calendar, Phone, Mail, Send, CheckCircle2, MessageSquare, MapPin, Sparkles, Clock, Music, Disc, DollarSign, ShieldCheck } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BOOKING_PACKAGES = [
  {
    id: 'live-gig',
    title: 'Club & Festival Performance',
    tag: 'Popular',
    desc: 'High-energy headline DJ set, live turntable scratch battles, club anthems, and MC collaboration.',
    turnaround: 'Book in advance',
    whatsappText: 'Hello DJ Emma Pro FX, I would like to book you for a Live Club or Festival Gig.'
  },
  {
    id: 'wedding-private',
    title: 'Wedding & Private Events',
    tag: 'VIP Service',
    desc: 'Tailored wedding sound, traditional & contemporary playlist curation, crystal-clear audio coordination.',
    turnaround: 'Book in advance',
    whatsappText: 'Hello DJ Emma Pro FX, I would like to book you for a Wedding or Private Event.'
  },
  {
    id: 'custom-mixtape',
    title: 'Custom Nonstop Mixtape',
    tag: 'Studio Master',
    desc: 'Dedicated nonstop DJ mix with your selected tracklist, custom intro voice drop, and 320kbps fidelity.',
    turnaround: '2-4 Days Delivery',
    whatsappText: 'Hello DJ Emma Pro FX, I would like to order a Custom Nonstop Mixtape.'
  },
  {
    id: 'voice-drops-logos',
    title: 'Voice Drops & 3D Logo Suite',
    tag: 'Audio-Visual',
    desc: 'Bassy hypeman vocal drops, Jamaican patois shouts, radio station IDs, and 4K animated video logos.',
    turnaround: '24-48 Hours Delivery',
    whatsappText: 'Hello DJ Emma Pro FX, I would like to order Voice Drops and a 3D Logo Reveal.'
  }
];

export default function BookMeSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(BOOKING_PACKAGES[0].title);
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const bookingData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service,
      eventDate: eventDate.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await addDoc(collection(db, 'studio_inquiries'), {
        ...bookingData,
        projectType: service,
        message: `Booking Request: Date: ${eventDate || 'Flexible'}. Notes: ${notes}`
      });
    } catch (err) {
      console.warn('Booking saved offline:', err);
    }

    // Format WhatsApp message
    const msg = 
      `🎧 *DJ EMMA PRO FX • BOOKING INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Name: ${name}\n` +
      `📱 Phone: ${phone || 'Not provided'}\n` +
      `✉️ Email: ${email || 'Not provided'}\n` +
      `🎛️ Package: ${service}\n` +
      `📅 Event Date / Timeline: ${eventDate || 'Flexible'}\n` +
      `📝 Requirements: ${notes || 'None'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Sent via DJ Emma Pro FX Official Dashboard`;

    const waUrl = `https://wa.me/256780527361?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 8000);
  };

  return (
    <section id="book-me" className="relative my-14 sm:my-20 px-4 sm:px-8 lg:px-12 select-none scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-[#E50914] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
          BOOK ME
        </span>
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Gigs, Live Events & Studio Production
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
            <span>BOOK DJ EMMA PRO FX</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Available for nightclub residencies, concerts, festival stages, wedding ceremonies, private events, custom nonstop mixtapes, and commercial audio branding.
          </p>
        </div>

        {/* Instant WhatsApp Action */}
        <a
          href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20I%20would%20like%20to%20book%20you%20for%20an%20event%20or%20studio%20project"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Phone className="w-4 h-4 fill-white" />
          <span>Quick WhatsApp Booking</span>
        </a>
      </div>

      {/* 4 Booking Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {BOOKING_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#E50914] transition-all duration-300 flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300">
                  {pkg.tag}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{pkg.turnaround}</span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-[#E50914] transition-colors mb-2">
                {pkg.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {pkg.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800">
              <a
                href={`https://wa.me/256780527361?text=${encodeURIComponent(pkg.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-[#E50914] text-zinc-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Book This Service</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact & Interactive Booking Form Box */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-[#121216] to-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">
                Direct Contact & Headquarters
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Let's Make Your Event Unforgettable
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Connect directly with DJ Emma Pro FX for immediate confirmations, technical riders, custom tracklists, or studio quote negotiations.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/50 border border-zinc-800">
                <Phone className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Call / WhatsApp Hotline</div>
                  <a href="tel:+256780527361" className="text-zinc-400 hover:text-white font-mono text-xs block mt-0.5">
                    +256 780 527 361
                  </a>
                  <span className="text-[10px] text-emerald-400 font-bold">Available 24/7 for urgent bookings</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/50 border border-zinc-800">
                <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Official Studio Email</div>
                  <a href="mailto:supamaya256@gmail.com" className="text-zinc-400 hover:text-white font-mono text-xs block mt-0.5">
                    supamaya256@gmail.com
                  </a>
                  <span className="text-[10px] text-zinc-500">Corporate bookings & brand sponsorships</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/50 border border-zinc-800">
                <MapPin className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Studio Locations</div>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Soroti City (Main Studio) • Kampala Sound Branch, Uganda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Booking Form */}
          <div className="lg:col-span-7 bg-black/70 border border-zinc-800/80 p-5 sm:p-7 rounded-2xl shadow-xl">
            <h4 className="text-base font-black text-white flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#E50914]" />
              <span>Send Booking Request / Reservation</span>
            </h4>

            {isSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you! Your booking inquiry has been recorded and WhatsApp opened to confirm with DJ Emma Pro.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Name / Stage Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Okello / MC Ricky"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +256 780 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Booking Package</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  >
                    {BOOKING_PACKAGES.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Event Date / Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. 25th Dec 2026 / Next Weekend"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Event Details / Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Venue location, expected crowd, genre preferences, or custom mixtape instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
