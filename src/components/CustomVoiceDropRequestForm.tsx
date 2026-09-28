import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sliders,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Send,
  Download,
  RotateCcw,
  Volume2,
  Clock,
  DollarSign,
  Radio,
  FileText,
  User,
  Zap,
  Phone,
  ShieldCheck,
  Flame,
  Globe2,
  Smile,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export interface VoiceDropRequest {
  id: string;
  createdAt: string;
  djName: string;
  pronunciation?: string;
  voiceType: string;
  voiceTypeLabel: string;
  style: string;
  styleLabel: string;
  script: string;
  effects: string[];
  tempoGenre: string;
  deliverySpeed: 'standard' | 'rush';
  contactChannel: string;
  contactNumber: string;
  priceUgx: string;
  priceUsd: string;
  notes?: string;
  status: 'pending_review' | 'in_production' | 'ready';
}

const VOICE_TYPES = [
  {
    id: 'deep-male',
    label: 'Deep Radio Male',
    badge: 'Most Popular',
    tone: 'Bassy, resonant, authoritative broadcast voice',
    sample: '"You are now tuned to the master himself..."',
    icon: Volume2,
  },
  {
    id: 'energetic-hypeman',
    label: 'Club Hype MC',
    badge: 'High Energy',
    tone: 'Screaming festival crowd booster, high octane',
    sample: '"Make some noise! Put your hands in the air!"',
    icon: Flame,
  },
  {
    id: 'sexy-female',
    label: 'Smooth Seductive Female',
    badge: 'Silky Smooth',
    tone: 'Warm, intimate, late-night club intro & outro',
    sample: '"Nobody does it better... DJ Emma Pro FX..."',
    icon: Smile,
  },
  {
    id: 'jamaican-ragga',
    label: 'Dancehall / Ragga Toasting',
    badge: 'Kingston Sound',
    tone: 'Patois flavor, heavy riddim hype, soundsystem culture',
    sample: '"Bruk out, pull up selecta! Badman tune!"',
    icon: Zap,
  },
  {
    id: 'uk-grime',
    label: 'British / UK Drill MC',
    badge: 'Urban Drill',
    tone: 'Crisp London cadence, punchy baritone delivery',
    sample: '"Turn the bass up proper, no games here..."',
    icon: Radio,
  },
  {
    id: 'scifi-robotic',
    label: 'Futuristic Cyborg Vocoder',
    badge: 'Sci-Fi FX',
    tone: 'Pitch-corrected robotic synth vocal with glitch mod',
    sample: '"System online. Bass overload activated."',
    icon: Sparkles,
  },
  {
    id: 'ateso-african',
    label: 'Ateso / Native African Hype',
    badge: 'Soroti Roots',
    tone: 'East African pride, Soroti city warrior chant',
    sample: '"Yoga yoga! DJ Emma, Edeke keda ijo!"',
    icon: Globe2,
  },
];

const STYLES = [
  {
    id: 'heavy-sub-bass',
    label: 'Heavy Sub-Bass & Glitch Drop',
    desc: 'Deep 808 sub sweep, stutter pitch drop, and explosion impact',
    intensity: 'Maximum Impact',
    accent: '#E50914',
  },
  {
    id: 'stadium-echo',
    label: 'Big Room Arena Reverb & Echo',
    desc: 'Wide stereo spatial reverb wash, ping-pong delays, huge hall ambience',
    intensity: 'Spacious & Cinematic',
    accent: '#8b5cf6',
  },
  {
    id: 'laser-siren',
    label: 'Laser Siren & Airhorn Stutter',
    desc: 'Classic dancehall airhorns, laser gun sweeps, high-frequency stutter',
    intensity: 'High Hype Club',
    accent: '#06b6d4',
  },
  {
    id: 'dry-clean',
    label: '100% Clean & Dry Vocal (No FX)',
    desc: 'Unprocessed broadcast WAV vocal ready for your own DJ software FX racks',
    intensity: 'Studio Master Raw',
    accent: '#10b981',
  },
  {
    id: 'trailer-cinema',
    label: 'Cinematic Movie Trailer FX',
    desc: 'Hans Zimmer style brass impacts, reverse cymbals, epic riser buildup',
    intensity: 'Blockbuster Cinema',
    accent: '#f59e0b',
  },
  {
    id: 'amapiano-logdrum',
    label: 'Afrobeats & Amapiano Chopped Stabs',
    desc: 'Bouncy percussion rolls, log-drum pitch bend, rhythmic vocal stutter',
    intensity: 'Groove & Vibe',
    accent: '#ec4899',
  },
];

const SCRIPT_TEMPLATES = [
  {
    title: 'Certified Boss In The Mix',
    script: 'You are now rocking with the certified number one — [DJ Name]! Keep it locked!',
  },
  {
    title: 'Turn Up The Bass Alert',
    script: 'Attention all party people! [DJ Name] is on the deck! Maximum volume required!',
  },
  {
    title: 'Kingston Dancehall Shutdown',
    script: 'Pull up dat riddim! Nobody touches di sound when [DJ Name] steps in! Dangerous!',
  },
  {
    title: 'Soroti City Worldwide Anthem',
    script: 'Soroti to the world! Exclusive audio master engineered by [DJ Name] Pro FX!',
  },
  {
    title: 'Late Night Smooth Vibe',
    script: 'Dim the lights, turn up the heat. You are listening to the sweet sounds of [DJ Name].',
  },
  {
    title: 'Custom Words / Blank Slate',
    script: '',
  },
];

const EXTRA_EFFECTS = [
  'Sub-bass 808 Drop',
  'Airhorn Blast',
  'Laser Gun Sweep',
  'Vinyl Scratch Rewind',
  'Telephone / Megaphone Filter',
  'Echo Reverb Tail',
  'Audio Stutter / Chopper',
];

interface CustomVoiceDropRequestFormProps {
  onSuccessClose?: () => void;
}

export default function CustomVoiceDropRequestForm({ onSuccessClose }: CustomVoiceDropRequestFormProps) {
  // Form input states
  const [djName, setDjName] = useState('DJ EMMA PRO FX');
  const [pronunciation, setPronunciation] = useState('Dee-Jay Emma Pro Ef-Ex');
  const [voiceType, setVoiceType] = useState('deep-male');
  const [style, setStyle] = useState('heavy-sub-bass');
  const [script, setScript] = useState(
    'You are now rocking with the certified number one — DJ EMMA PRO FX! Keep it locked!'
  );
  const [selectedEffects, setSelectedEffects] = useState<string[]>([
    'Sub-bass 808 Drop',
    'Echo Reverb Tail',
  ]);
  const [tempoGenre, setTempoGenre] = useState('Afrobeats / Club Dancehall');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'rush'>('standard');
  const [contactChannel, setContactChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactNumber, setContactNumber] = useState('+256 780 527 361');
  const [notes, setNotes] = useState('');

  // Confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState<VoiceDropRequest | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Past requests from localStorage
  const [pastRequests, setPastRequests] = useState<VoiceDropRequest[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dj_emma_custom_drop_requests');
      if (saved) {
        setPastRequests(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update script whenever djName changes if using standard pattern
  const handleDjNameChange = (name: string) => {
    setDjName(name);
  };

  const handleSelectTemplate = (templateScript: string) => {
    if (!templateScript) {
      setScript('');
      return;
    }
    const filled = templateScript.replace(/\[DJ Name\]/g, djName || 'DJ Name');
    setScript(filled);
  };

  const toggleEffect = (effect: string) => {
    const list = Array.isArray(selectedEffects) ? selectedEffects : [];
    if (list.includes(effect)) {
      setSelectedEffects(list.filter((e) => e !== effect));
    } else {
      setSelectedEffects([...list, effect]);
    }
  };

  // Calculated Pricing
  const basePriceUgx = 15000;
  const rushFeeUgx = deliverySpeed === 'rush' ? 10000 : 0;
  const totalUgx = basePriceUgx + rushFeeUgx;
  const totalUsd = deliverySpeed === 'rush' ? 8 : 5;

  const currentVoiceObj = VOICE_TYPES.find((v) => v.id === voiceType) || VOICE_TYPES[0];
  const currentStyleObj = STYLES.find((s) => s.id === style) || STYLES[0];

  // Character & word count
  const safeScript = script || '';
  const charCount = safeScript.length;
  const wordCount = safeScript.trim() ? safeScript.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.max(2, Math.round(wordCount * 0.45));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `DROP-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const newRequest: VoiceDropRequest = {
      id: orderId,
      createdAt: new Date().toISOString(),
      djName: djName.trim() || 'My DJ Name',
      pronunciation: pronunciation.trim(),
      voiceType,
      voiceTypeLabel: currentVoiceObj.label,
      style,
      styleLabel: currentStyleObj.label,
      script: script.trim(),
      effects: selectedEffects,
      tempoGenre,
      deliverySpeed,
      contactChannel,
      contactNumber: contactNumber.trim(),
      priceUgx: `${totalUgx.toLocaleString()} UGX`,
      priceUsd: `$${totalUsd} USD`,
      notes: notes.trim(),
      status: 'pending_review',
    };

    setTimeout(() => {
      setConfirmedOrder(newRequest);
      setIsSubmitting(false);

      // Save to localStorage
      try {
        const updated = [newRequest, ...pastRequests.slice(0, 19)];
        setPastRequests(updated);
        localStorage.setItem('dj_emma_custom_drop_requests', JSON.stringify(updated));
      } catch {
        // storage fallback
      }
    }, 450);
  };

  const generateOrderSummaryText = (order: VoiceDropRequest) => {
    return (
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎤 DJ EMMA PRO FX • CUSTOM VOICE DROP REQUEST\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Order Tracking ID: #${order.id}\n` +
      `Created: ${new Date(order.createdAt).toLocaleString()}\n\n` +
      `👤 Stage / DJ Name: ${order.djName}\n` +
      (order.pronunciation ? `🗣️ Pronunciation: ${order.pronunciation}\n` : '') +
      `🎙️ Voice Type: ${order.voiceTypeLabel}\n` +
      `🎛️ Audio FX & Style: ${order.styleLabel}\n` +
      `📜 Custom Script:\n"${order.script}"\n\n` +
      `⚡ Sound FX Included: ${order.effects.length > 0 ? order.effects.join(', ') : 'Dry vocal only'}\n` +
      `🎵 Target Genre / Tempo: ${order.tempoGenre}\n` +
      `⏱️ Delivery Tier: ${order.deliverySpeed === 'rush' ? 'VIP Express Rush (4-6 Hours)' : 'Standard Studio (24-48 Hours)'}\n` +
      `💰 Production Fee: ${order.priceUgx} (${order.priceUsd})\n` +
      `📱 Contact / Delivery To: ${order.contactNumber} (${order.contactChannel.toUpperCase()})\n` +
      (order.notes ? `📝 Special Notes: ${order.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Status: Production Ready • Studio Master (320kbps MP3 + 24-bit WAV)`
    );
  };

  const handleCopySummary = () => {
    if (!confirmedOrder) return;
    const text = generateOrderSummaryText(confirmedOrder);
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!confirmedOrder) return;
    const text = generateOrderSummaryText(confirmedOrder);
    const url = `https://wa.me/256780527361?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadReceipt = () => {
    if (!confirmedOrder) return;
    const text = generateOrderSummaryText(confirmedOrder);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DJ_Emma_Drop_Request_${confirmedOrder.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ========================================================
  // RENDER SUMMARY CONFIRMATION SCREEN
  // ========================================================
  if (confirmedOrder) {
    return (
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-5 sm:p-8 text-white shadow-2xl animate-in fade-in duration-300">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Request Confirmed & Queued
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  #{confirmedOrder.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Voice Drop Order Summary
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Your custom voice drop details have been compiled for Studio Master engineering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                setScript('You are now rocking with the certified number one — ' + djName + '! Keep it locked!');
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Create Another Drop</span>
            </button>
          </div>
        </div>

        {/* Highlighted Script Preview Box */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-2 border-[#E50914]/50 shadow-inner">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase font-bold text-[#E50914] flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              Master Vocal Script
            </span>
            <span className="font-mono text-zinc-400">
              Est. ~{estimatedSeconds}s audio duration
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white tracking-wide italic font-serif leading-relaxed">
            "{confirmedOrder.script}"
          </div>
          {confirmedOrder.pronunciation && (
            <div className="mt-2 text-xs text-zinc-400 font-mono">
              🗣️ Pronunciation: <span className="text-zinc-200">{confirmedOrder.pronunciation}</span>
            </div>
          )}
        </div>

        {/* Structured Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
              DJ / Stage Name
            </span>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{confirmedOrder.djName}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
              Selected Voice Type
            </span>
            <div className="text-sm font-black text-cyan-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{confirmedOrder.voiceTypeLabel}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
              Audio FX & Style
            </span>
            <div className="text-sm font-black text-purple-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>{confirmedOrder.styleLabel}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
              Total Production Fee
            </span>
            <div className="text-base font-black text-emerald-400 flex items-center gap-1">
              <span>{confirmedOrder.priceUgx}</span>
              <span className="text-xs text-zinc-400 font-normal">({confirmedOrder.priceUsd})</span>
            </div>
          </div>
        </div>

        {/* Secondary Specs: Effects, Delivery, Contact */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mt-3.5 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-zinc-400 font-medium">Included Sound FX:</span>
            <div className="flex flex-wrap gap-1.5">
              {confirmedOrder.effects.length > 0 ? (
                confirmedOrder.effects.map((fx) => (
                  <span
                    key={fx}
                    className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[11px]"
                  >
                    {fx}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500">None (Pure Raw Vocal)</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400 font-medium">Delivery Speed:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {confirmedOrder.deliverySpeed === 'rush' ? 'VIP Express Rush (4-6 Hours)' : 'Standard Studio Turnaround (24-48 Hours)'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
            <span className="text-zinc-400 font-medium">Delivery To:</span>
            <span className="font-mono font-bold text-zinc-200">
              {confirmedOrder.contactNumber} ({confirmedOrder.contactChannel.toUpperCase()})
            </span>
          </div>

          {confirmedOrder.notes && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
              <span className="text-zinc-400 font-medium">Special Notes:</span>
              <span className="text-zinc-300 italic">{confirmedOrder.notes}</span>
            </div>
          )}
        </div>

        {/* Action Button Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Order via WhatsApp (+256 780 527 361)</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              title="Copy Summary to Clipboard"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              title="Download Confirmation TXT File"
            >
              <Download className="w-4 h-4" />
              <span>Save Ticket</span>
            </button>
          </div>
        </div>

        {/* Quality Guarantee Notice */}
        <div className="mt-5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
          <span>
            Mastering includes 2 free revisions. Files are delivered in 24-bit 48kHz WAV and 320kbps MP3 via WhatsApp or Email.
          </span>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER INTERACTIVE REQUEST FORM
  // ========================================================
  return (
    <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 sm:p-8 text-white shadow-2xl relative">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-mono font-bold uppercase tracking-wider">
              Studio Suite • Custom Production
            </span>
            <span className="text-xs text-zinc-500 font-mono">15,000 UGX ($5 USD)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2.5">
            <Mic className="w-6 h-6 text-[#E50914]" />
            <span>Request Custom Voice Drop</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Configure your personalized DJ drop or radio tag. Select your preferred voice talent, sound effects mastering style, and customized script with real-time audio review.
          </p>
        </div>

        {pastRequests.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="self-start md:self-auto px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Past Orders ({pastRequests.length})</span>
          </button>
        )}
      </div>

      {/* Past Requests Collapsible Drawer */}
      {showHistory && pastRequests.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 mb-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Your Previously Generated Drop Requests
            </span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-xs text-zinc-500 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {pastRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{req.djName}</div>
                  <div className="text-[11px] text-zinc-400 italic truncate max-w-[220px]">
                    "{req.script}"
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {req.voiceTypeLabel} • {req.priceUgx}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmedOrder(req)}
                  className="px-2.5 py-1 rounded bg-[#E50914] text-white text-[11px] font-bold shrink-0 hover:bg-[#b80710] cursor-pointer"
                >
                  View Summary
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* ========================================================
            SECTION 1: DJ IDENTITY & PRONUNCIATION
           ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              DJ / Stage Identity & Name
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Stage / DJ / Artist Name <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={djName}
                  onChange={(e) => handleDjNameChange(e.target.value)}
                  placeholder="e.g. DJ EMMA PRO FX, SELECTA BRIAN, MC KEV"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-[#E50914] text-sm text-white font-semibold placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Pronunciation Guide (Optional but Recommended)
              </label>
              <input
                type="text"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                placeholder="e.g. 'Dee-Jay Emma Pro Ef-Ex' or 'Ah-tee-soh'"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-[#E50914] text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: VOICE TYPE SELECTION
           ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Select Voice Type
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Selected: <strong className="text-white">{currentVoiceObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {VOICE_TYPES.map((voice) => {
              const Icon = voice.icon;
              const isSelected = voiceType === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() => setVoiceType(voice.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#E50914]/15 border-[#E50914] shadow-lg shadow-[#E50914]/10'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {voice.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">
                      {voice.label}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      {voice.tone}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-zinc-500 italic">
                    {voice.sample}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SECTION 3: AUDIO FX & MASTERING STYLE
           ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Select Mastering Style & Audio FX
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Selected: <strong className="text-white">{currentStyleObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STYLES.map((st) => {
              const isSelected = style === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setStyle(st.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-zinc-900 border-[#E50914] shadow-md ring-1 ring-[#E50914]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                      {st.intensity}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {st.label}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Optional Individual FX Stems */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Select Additional Specific Sound FX Elements to Mix in:
            </label>
            <div className="flex flex-wrap gap-2">
              {EXTRA_EFFECTS.map((fx) => {
                const active = Array.isArray(selectedEffects) && selectedEffects.includes(fx);
                return (
                  <button
                    type="button"
                    key={fx}
                    onClick={() => toggleEffect(fx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#E50914] text-white font-bold shadow'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                    <span>{fx}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 4: SCRIPT SELECTION & CUSTOM SCRIPT
           ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Drop Script & Custom Words
              </h3>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              <span>{wordCount} words</span> • <span>~{estimatedSeconds}s audio</span>
            </div>
          </div>

          {/* Quick Script Preset Chips */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Choose a Preset Script or Custom Type Below:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SCRIPT_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectTemplate(tmpl.script)}
                  className="text-left p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-[#E50914]/60 text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-white group-hover:text-[#E50914] flex items-center justify-between">
                    <span>{tmpl.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                  </div>
                  {tmpl.script ? (
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {tmpl.script.replace(/\[DJ Name\]/g, djName || 'DJ Name')}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Clear text box to write completely original script
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Script Text Area */}
          <div className="relative mt-2">
            <textarea
              required
              rows={3}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter exact words for voice talent to speak... (e.g. 'You are now live with DJ Emma Pro FX, lock it off!')"
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-[#E50914] text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors font-medium leading-relaxed resize-y"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-500">
              <span>Tip: Keep under 20 words for maximum impact in DJ sets.</span>
              <span className="font-mono">{charCount} characters</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 5: DELIVERY DETAILS & TURNAROUND
           ======================================================== */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold text-xs flex items-center justify-center">
              5
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Turnaround & Delivery Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Speed selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Turnaround Speed
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    deliverySpeed === 'standard'
                      ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Standard Studio</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">24 – 48 Hours</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">15,000 UGX ($5)</div>
                </div>

                <div
                  onClick={() => setDeliverySpeed('rush')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    deliverySpeed === 'rush'
                      ? 'bg-zinc-900 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>VIP Rush Delivery</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">4 – 6 Hours Fast</div>
                  <div className="text-xs font-bold text-amber-400 mt-1">25,000 UGX ($8)</div>
                </div>
              </div>
            </div>

            {/* Contact Delivery Channel */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Delivery Channel & WhatsApp Number
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setContactChannel('whatsapp')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    contactChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  WhatsApp Audio
                </button>
                <button
                  type="button"
                  onClick={() => setContactChannel('email')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    contactChannel === 'email'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  Email Master (WAV)
                </button>
              </div>

              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder={contactChannel === 'whatsapp' ? '+256 780 527 361' : 'yourname@gmail.com'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-[#E50914] text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Extra Production Notes / Song Reference (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Add extra delay on the last word, tune for 130 BPM Afrobeats tempo"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* ========================================================
            LIVE ORDER SUMMARY BAR & SUBMIT BUTTON
           ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="text-xs font-mono uppercase text-zinc-400">
              Live Total Studio Cost
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">
                {totalUgx.toLocaleString()} UGX
              </span>
              <span className="text-sm font-bold text-zinc-400">
                (${totalUsd} USD)
              </span>
              {deliverySpeed === 'rush' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  VIP Rush Included
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Includes 320kbps MP3 + 24-bit WAV Master • 2 Free Revisions
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white font-black text-sm tracking-wide shadow-lg shadow-[#E50914]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating Order...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Drop Request & Review Summary</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
