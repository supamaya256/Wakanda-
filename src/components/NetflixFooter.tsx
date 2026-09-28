import { Globe, MessageSquare, Phone, Film, Send, Youtube, UploadCloud, Instagram, Twitter, Music, Facebook, Ghost, MessageCircle, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NetflixFooterProps {
  onOpenAtesoMovies?: () => void;
  onOpenStudioManager?: () => void;
}

export default function NetflixFooter({ onOpenAtesoMovies, onOpenStudioManager }: NetflixFooterProps) {
  const { isAdmin } = useAdminAuth();
  const { t, toggleLanguage, currentLanguageInfo } = useLanguage();

  return (
    <footer className="mt-20 pb-28 pt-12 border-t border-zinc-800/80 bg-[#141414] text-zinc-500 text-xs select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Contact Questions Header */}
        <p className="mb-6 text-sm text-zinc-400">
          Questions? Call{' '}
          <a href="tel:+256780527361" className="text-zinc-300 hover:underline">
            +256 780 527 361
          </a>{' '}
          or chat directly on{' '}
          <a
            href="https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E50914] font-bold hover:underline"
          >
            WhatsApp Studio
          </a>
        </p>

        {/* Social Media Links */}
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <a
            href="https://www.instagram.com/deejayemmap?stkn=MTl1dWdweTFyamQwdw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/djemmaproo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="Twitter / X"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100084323655178"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="Facebook"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@djdropsuganda?_r=1&_d=f2f96e8mceg6e4&sec_uid=MS4wLjABAAAAdJz4eHEHWnsaRNKj9_FT5fmSJX1kUwfnucZ9GYAJP77lKxRNU-ZAQsp79Wq-vjTQ&share_author_id=7322652932151034886&sharer_language=en&source=h5_m&u_code=ec37b1j8l97ldk&timestamp=1789667877&user_id=7322652932151034886&sec_user_id=MS4wLjABAAAAdJz4eHEHWnsaRNKj9_FT5fmSJX1kUwfnucZ9GYAJP77lKxRNU-ZAQsp79Wq-vjTQ&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7682726107221591828&share_link_id=fa31fc4f-5734-49b7-8063-4ad8f2bdd5a0&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="TikTok"
          >
            <Music className="w-6 h-6" />
          </a>
          <a
            href="https://youtube.com/@djemmapro7231?si=iKgwrQvCurZhDQob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="YouTube"
          >
            <Youtube className="w-6 h-6" />
          </a>
          <a
            href="https://www.snapchat.com/add/emmapro257687?share_id=HskB4TeN5bg&locale=en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="Snapchat"
          >
            <Ghost className="w-6 h-6" />
          </a>
          <a
            href="https://profile.imo.im/profileshare/shr.AAAAAAAAAAAAAAAAAAAAAKgSW7_KbozgNaMYLq3fuOpQBrWahQ4HuAza-Rr7tBxY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
            title="IMO"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>

        {/* 4-column Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-[11px]">
          <ul className="space-y-3">
            <li>
              <button
                type="button"
                onClick={onOpenAtesoMovies}
                className="text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer text-left"
              >
                <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Watch Ateso Movies</span>
              </button>
            </li>
            <li><a href="#mixes" className="hover:underline">Nonstop Mixtapes</a></li>
            <li><a href="#top10" className="hover:underline">Top 10 Video Shows</a></li>
            <li><a href="#drops" className="hover:underline">Custom Voice Drops</a></li>
            <li><a href="#portal" className="hover:underline">Track Order Progress</a></li>
          </ul>

          <ul className="space-y-3">
            <li><a href="#logos" className="hover:underline">3D Animated Logos</a></li>
            <li>
              <a
                href="https://t.me/atesomoviesbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2AABEE] hover:underline flex items-center gap-1 font-semibold"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Telegram Movies Box</span>
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/@deejayemmapro?si=KMUHYGKOcAvRAWGd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Youtube className="w-3.5 h-3.5 shrink-0" />
                <span>Subscribe on YouTube</span>
              </a>
            </li>
            <li><a href="https://wa.me/256780527361" target="_blank" rel="noopener noreferrer" className="hover:underline">VIP Client Concierge</a></li>
          </ul>

          <ul className="space-y-3">
            <li>
              <button
                type="button"
                onClick={onOpenStudioManager}
                className="font-bold hover:underline flex items-center gap-1.5 cursor-pointer text-left transition-colors"
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="text-emerald-400">Admin Dashboard (Upload/Delete)</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-[#E50914]" />
                    <span className="text-zinc-300 hover:text-white">Visitor Dashboard (Media Hub)</span>
                  </>
                )}
              </button>
            </li>
            <li><a href="#" className="hover:underline">Terms of Production</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Audio Bitrate Specs (320K)</a></li>
          </ul>

          <ul className="space-y-3">
            <li><a href="https://wa.me/256780527361" target="_blank" rel="noopener noreferrer" className="hover:underline">Soroti City Studio</a></li>
            <li><a href="https://wa.me/256780527361" target="_blank" rel="noopener noreferrer" className="hover:underline">Kampala Sound Branch</a></li>
            <li><a href="#drops" className="hover:underline">Corporate Jingle Production</a></li>
            <li><a href="tel:+256780527361" className="hover:underline">Contact DJ Emma Pro</a></li>
          </ul>
        </div>

        {/* Language selector button */}
        <div className="mb-6">
          <button 
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 px-3 py-1.5 rounded text-zinc-300 hover:text-white text-xs cursor-pointer transition-colors"
            title="Toggle between English and Ateso"
          >
            <Globe className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{currentLanguageInfo.flag} {currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</span>
            <span className="text-[10px] text-zinc-500">⇄ Quick Switch</span>
          </button>
        </div>

        {/* Brand Copyright */}
        <p className="text-[11px] text-zinc-600">
          DJ EMMA PRO FX UGANDA • Cinematic DJ Branding, Watch Ateso Movies, Nonstop Audio Streaming & 3D Visual Effects.
        </p>
      </div>
    </footer>
  );
}
