import React from 'react';
import { Mail, Phone, MessageSquare, ShieldCheck, Youtube, Instagram, Twitter, Facebook, Music, Disc3, Shield, Lock } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface NetflixFooterProps {
  onNavigate?: (view: 'home' | 'audios' | 'videos' | 'about' | 'book' | 'privacy' | 'terms' | 'contact') => void;
  onOpenStudioManager?: () => void;
}

export default function NetflixFooter({ onNavigate, onOpenStudioManager }: NetflixFooterProps) {
  const { isAdmin, openAuthModal } = useAdminAuth();

  return (
    <footer className="mt-20 pb-28 pt-12 border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Banner & Quick Contact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-lg tracking-wider uppercase">
                DJ EMMA <span className="text-red-600">PRO</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
                Official Platform
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">
              Top-tier DJ entertainment, master studio nonstops, video mixes, and event bookings across East Africa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+256780527361"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>+256 780 527 361</span>
            </a>

            <a
              href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold border border-emerald-600/40 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Hotline</span>
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap items-center gap-4 my-8">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Follow DJ Emma:</span>
          <a
            href="https://youtube.com/@djemmapro7231?si=iKgwrQvCurZhDQob"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition"
            title="Official YouTube Channel"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/deejayemmap?stkn=MTl1dWdweTFyamQwdw=="
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-pink-500 hover:bg-zinc-800 transition"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/djemmaproo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-sky-400 hover:bg-zinc-800 transition"
            title="Twitter / X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100084323655178"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-blue-500 hover:bg-zinc-800 transition"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@djdropsuganda"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="TikTok"
          >
            <Music className="w-4 h-4" />
          </a>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-zinc-900 text-xs">
          {/* Main Content */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Music Content</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Homepage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('audios')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Audio Mixes & Nonstops
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('videos')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Video Shows & Broadcasts
                </button>
              </li>
              <li>
                <a href="#mixes" className="hover:text-red-500 transition">
                  Street Anthem Series
                </a>
              </li>
            </ul>
          </div>

          {/* Bookings & Shows */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Bookings & Shows</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('book')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Book DJ Emma Pro
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('about')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  DJ Biography & Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <a href="mailto:supamaya256@gmail.com" className="hover:text-red-500 transition">
                  Licensing & Collaborations
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy (Google AdSense Required) */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Legal & Policies</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('privacy')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('terms')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('dj_emma_cookie_consent');
                    window.location.reload();
                  }}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Cookie Settings & Consent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="hover:text-red-500 transition cursor-pointer text-left"
                >
                  Copyright & DMCA Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Management */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Studio Operations</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-zinc-500">Soroti City & Kampala, UG</span>
              </li>
              <li>
                <span className="text-zinc-500">Wakanda Deejays Network</span>
              </li>
              <li>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={onOpenStudioManager}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal()}
                    className="text-zinc-600 hover:text-zinc-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin Management</span>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & AdSense Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} DJ EMMA PRO FX. All Rights Reserved. Mastered in Uganda.</p>
          <p className="text-center md:text-right">
            Google AdSense Partner • Optimized for fast mobile streaming & spatial audio
          </p>
        </div>
      </div>
    </footer>
  );
}
