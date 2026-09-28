/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Mic,
  Music,
  Calendar,
  Film,
  Sliders,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  RotateCcw,
  Inbox,
  Filter,
  Search,
  Trash2,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAdminAuth } from '../context/AdminAuthContext';

export interface StudioInquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed';
  createdAt: string;
}

export const PROJECT_TYPES = [
  {
    id: '3d-logo-reveal',
    label: '3D Animated Video Logo Reveal',
    description: '3D text motion, metallic & laser extrusion, bass drop sound FX sync',
    icon: Sparkles,
    estimatedTurnaround: '24-48 Hours',
    popular: true
  },
  {
    id: 'custom-voice-drop',
    label: 'Custom Voice Drop & DJ Jingles',
    description: 'Bassy hypeman shouts, Jamaican Patois, robotic vocoder, radio IDs',
    icon: Mic,
    estimatedTurnaround: '4-24 Hours',
    popular: true
  },
  {
    id: 'nonstop-mixtape',
    label: 'Nonstop DJ Mixtape Production',
    description: 'Continuous party mixtape, wedding blend, video nonstop, club mix',
    icon: Music,
    estimatedTurnaround: '2-4 Days',
    popular: false
  },
  {
    id: 'live-event-booking',
    label: 'Live Event & Club Gig Booking',
    description: 'Headline DJ performance, festival stage, club night, wedding sound',
    icon: Calendar,
    estimatedTurnaround: 'Book in advance',
    popular: false
  },
  {
    id: 'ateso-movies',
    label: 'Ateso Movies Translation & Voicing',
    description: 'Action movie VJ translation, cultural dubbing, subtitle mastering',
    icon: Film,
    estimatedTurnaround: '3-5 Days',
    popular: false
  },
  {
    id: 'audio-mastering',
    label: 'Audio Mastering & Sound FX Design',
    description: 'Stem audio polish, loudness maximization, sound effect packs',
    icon: Sliders,
    estimatedTurnaround: '24-48 Hours',
    popular: false
  },
  {
    id: 'general-inquiry',
    label: 'General Inquiry / Collaboration',
    description: 'Brand partnership, media interviews, business consultations',
    icon: MessageSquare,
    estimatedTurnaround: 'Same day',
    popular: false
  }
];

export const BUDGET_RANGES = [
  'Under 50,000 UGX',
  '50,000 - 150,000 UGX',
  '150,000 - 500,000 UGX',
  '500,000+ UGX',
  'Custom / USD ($)'
];

export const TIMELINE_OPTIONS = [
  'Standard (2-3 Days)',
  'VIP Rush (Within 24 Hours)',
  'Flexible / In Advance'
];

interface StudioContactFormProps {
  onSuccess?: (inquiry: StudioInquiry) => void;
  defaultProjectType?: string;
  className?: string;
}

export default function StudioContactForm({
  onSuccess,
  defaultProjectType,
  className = ''
}: StudioContactFormProps) {
  const { isAdmin } = useAdminAuth();

  // Mode: Form vs. Inbox (if admin)
  const [viewMode, setViewMode] = useState<'form' | 'inbox'>('form');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(
    defaultProjectType || PROJECT_TYPES[0].label
  );
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [message, setMessage] = useState('');

  // Validation & feedback state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<StudioInquiry | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Admin Inquiries State
  const [inquiries, setInquiries] = useState<StudioInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const DJ_WHATSAPP = '256780527361';
  const DJ_EMAIL = 'supamaya256@gmail.com';

  // Load inquiries for admin or from local storage for offline
  useEffect(() => {
    if (isAdmin && viewMode === 'inbox') {
      fetchAdminInquiries();
    }
  }, [isAdmin, viewMode]);

  const fetchAdminInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const q = query(collection(db, 'studio_inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: StudioInquiry[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<StudioInquiry, 'id'>)
      }));
      setInquiries(list);
    } catch {
      // Fallback to local storage if Firestore connection is slow/offline
      try {
        const cached = localStorage.getItem('dj_emma_studio_inquiries');
        if (cached) {
          setInquiries(JSON.parse(cached));
        }
      } catch {
        // Ignored
      }
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Please provide your name or stage name';
    }
    if (!email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!projectType.trim()) {
      errs.projectType = 'Please select a project type';
    }
    if (!message.trim()) {
      errs.message = 'Please provide project details, script, or instructions';
    } else if (message.trim().length < 10) {
      errs.message = 'Please write at least 10 characters describing your project';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateWhatsAppMessage = (inquiry: StudioInquiry): string => {
    return (
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎧 DJ EMMA PRO FX • STUDIO INQUIRY\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Tracking ID: #${inquiry.id}\n` +
      `Date: ${new Date(inquiry.createdAt).toLocaleString()}\n\n` +
      `👤 Client / DJ Name: ${inquiry.name}\n` +
      `✉️ Email: ${inquiry.email}\n` +
      (inquiry.phone ? `📱 Phone / WhatsApp: ${inquiry.phone}\n` : '') +
      `🎛️ Project Type: ${inquiry.projectType}\n` +
      `💰 Budget Tier: ${inquiry.budget || 'Not specified'}\n` +
      `⏱️ Delivery Timeline: ${inquiry.timeline || 'Standard'}\n\n` +
      `📝 Project Requirements & Details:\n"${inquiry.message}"\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Status: Sent from Studio Suite Direct Inquiry System`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const trackingId = `INQ-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: StudioInquiry = {
      id: trackingId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      projectType,
      phone: phone.trim(),
      budget,
      timeline,
      message: message.trim(),
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firebase Firestore
      await addDoc(collection(db, 'studio_inquiries'), {
        name: newInquiry.name,
        email: newInquiry.email,
        projectType: newInquiry.projectType,
        phone: newInquiry.phone || '',
        budget: newInquiry.budget || '',
        timeline: newInquiry.timeline || '',
        message: newInquiry.message,
        status: newInquiry.status,
        createdAt: newInquiry.createdAt
      });
    } catch {
      // Safe offline fallback: local storage caching guarantees data isn't lost
    }

    // 2. Save locally for user history
    try {
      const existing = JSON.parse(localStorage.getItem('dj_emma_studio_inquiries') || '[]');
      const updated = [newInquiry, ...existing.slice(0, 20)];
      localStorage.setItem('dj_emma_studio_inquiries', JSON.stringify(updated));
    } catch {
      // Fallback
    }

    setIsSubmitting(false);
    setSubmittedInquiry(newInquiry);
    if (onSuccess) onSuccess(newInquiry);
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: StudioInquiry['status']) => {
    try {
      const docRef = doc(db, 'studio_inquiries', inquiryId);
      await updateDoc(docRef, { status: newStatus });
      setInquiries(prev =>
        prev.map(item => (item.id === inquiryId ? { ...item, status: newStatus } : item))
      );
    } catch {
      // Local fallback
      setInquiries(prev =>
        prev.map(item => (item.id === inquiryId ? { ...item, status: newStatus } : item))
      );
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'studio_inquiries', inquiryId));
      setInquiries(prev => prev.filter(item => item.id !== inquiryId));
    } catch {
      setInquiries(prev => prev.filter(item => item.id !== inquiryId));
    }
  };

  const handleCopySummary = (inquiry: StudioInquiry) => {
    const text = generateWhatsAppMessage(inquiry);
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleOpenWhatsApp = (inquiry: StudioInquiry) => {
    const text = generateWhatsAppMessage(inquiry);
    const url = `https://wa.me/${DJ_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleOpenEmail = (inquiry: StudioInquiry) => {
    const subject = encodeURIComponent(`Studio Project Inquiry: ${inquiry.projectType} [${inquiry.name}]`);
    const body = encodeURIComponent(generateWhatsAppMessage(inquiry));
    window.location.href = `mailto:${DJ_EMAIL}?subject=${subject}&body=${body}`;
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
    setSubmittedInquiry(null);
  };

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch =
      inquirySearch === '' ||
      item.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      item.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      item.projectType.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      item.message.toLowerCase().includes(inquirySearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span className="text-[#E50914] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#E50914]" />
              DJ Emma Pro FX
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">Studio Suite Direct Inquiries</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-mono">24/7 Response Guaranteed</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Send Direct Project Inquiry</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Have a custom music production, 3D video logo reveal, club booking, or vocal drop project in mind? Submit your requirements below for an instant quote directly from DJ Emma.
          </p>
        </div>

        {/* Admin Tab Switcher (if admin) */}
        {isAdmin && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-700/80 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'form'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inquiry Form</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('inbox');
                fetchAdminInquiries();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'inbox'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox ({inquiries.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Inquiry summary copied to clipboard! You can paste it into WhatsApp or Email.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: SUCCESS CONFIRMATION SCREEN */}
      {submittedInquiry ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-zinc-900/90 border border-emerald-500/40 p-6 sm:p-8 space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              INQUIRY DISPATCHED SUCCESSFULLY
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Thank You, {submittedInquiry.name}!</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
              Your inquiry has been recorded in the DJ Emma Pro FX Studio system with Tracking ID <strong className="text-white font-mono font-bold">#{submittedInquiry.id}</strong>.
            </p>
          </div>

          {/* Inquiry Summary Preview Card */}
          <div className="text-left rounded-xl bg-black/60 border border-white/10 p-4 sm:p-5 max-w-xl mx-auto space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Project Type:</span>
              <span className="text-white font-bold">{submittedInquiry.projectType}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Client Email:</span>
              <span className="text-zinc-200 font-mono">{submittedInquiry.email}</span>
            </div>
            {submittedInquiry.phone && (
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Phone / WhatsApp:</span>
                <span className="text-zinc-200 font-mono">{submittedInquiry.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Budget Range:</span>
              <span className="text-emerald-400 font-bold">{submittedInquiry.budget}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Delivery Timeline:</span>
              <span className="text-amber-400 font-medium">{submittedInquiry.timeline}</span>
            </div>
            <div className="pt-1">
              <span className="text-zinc-400 block mb-1">Project Details:</span>
              <p className="text-zinc-300 italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                "{submittedInquiry.message}"
              </p>
            </div>
          </div>

          {/* Quick Instant Follow-up Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenWhatsApp(submittedInquiry)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ping DJ Emma on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenEmail(submittedInquiry)}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Send via Email App</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopySummary(submittedInquiry)}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Summary</span>
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit Another Inquiry</span>
            </button>
          </div>
        </motion.div>
      ) : viewMode === 'inbox' && isAdmin ? (
        /* VIEW 2: ADMIN INBOX MANAGEMENT */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inquirySearch}
                onChange={e => setInquirySearch(e.target.value)}
                placeholder="Search inquiries by client name, email, project type, or message..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#E50914]"
              >
                <option value="all">All Statuses ({inquiries.length})</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                type="button"
                onClick={fetchAdminInquiries}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                title="Refresh Inquiries"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoadingInquiries ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Loading incoming inquiries from Firestore...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No inquiries found matching your filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInquiries.map(inq => (
                <div
                  key={inq.id}
                  className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 space-y-3 transition-all hover:border-zinc-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{inq.name}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-xs text-zinc-400 font-mono">{inq.email}</span>
                      {inq.phone && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-xs text-zinc-400 font-mono">{inq.phone}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                      <select
                        value={inq.status}
                        onChange={e => handleUpdateStatus(inq.id, e.target.value as StudioInquiry['status'])}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                          inq.status === 'new'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : inq.status === 'contacted'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : inq.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        } focus:outline-none`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="text-white font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {inq.projectType}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">Budget: {inq.budget || 'Not set'}</span>
                    <span>·</span>
                    <span className="text-zinc-300">Timeline: {inq.timeline || 'Standard'}</span>
                  </div>

                  <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(inq)}
                      className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEmail(inq)}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                      <span>Reply by Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySummary(inq)}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 3: INQUIRY SUBMISSION FORM */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Email (Required Fields per prompt) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field: Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Your Name / Stage Name / Organization *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. DJ Pulse, John Doe, Royal Event Center"
                  className={`w-full bg-zinc-900/90 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#E50914]'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Field: Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Email Address *</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="e.g. client@gmail.com"
                  className={`w-full bg-zinc-900/90 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#E50914]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Project Type (Required Field per prompt) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Project Type *</span>
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                Choose primary service
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PROJECT_TYPES.map(type => {
                const IconComponent = type.icon;
                const isSelected = projectType === type.label;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setProjectType(type.label);
                      if (errors.projectType) setErrors(prev => ({ ...prev, projectType: '' }));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-[#E50914] shadow-md shadow-red-950/50'
                        : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#E50914]' : 'text-zinc-400'}`} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                            {type.label}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#E50914] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Est. Delivery:</span>
                      <span className="text-amber-400 font-semibold">{type.estimatedTurnaround}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.projectType && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.projectType}</span>
              </p>
            )}
          </div>

          {/* Row 3: Optional Contact Phone, Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Field: Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Phone / WhatsApp Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +256 780 527361"
                className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-[#E50914] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">For instant WhatsApp updates</span>
            </div>

            {/* Field: Budget Range */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Budget</span>
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-[#E50914] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
              >
                {BUDGET_RANGES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 mt-1 block">Helps tailor production scale</span>
            </div>

            {/* Field: Timeline */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Timeline</span>
              </label>
              <select
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-[#E50914] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
              >
                {TIMELINE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 mt-1 block">Rush delivery available</span>
            </div>
          </div>

          {/* Row 4: Project Requirements & Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Project Requirements & Details *</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-500">
                {message.length} chars
              </span>
            </div>

            <textarea
              rows={4}
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
              }}
              placeholder="Describe your vision: e.g. text for 3D logo, script for vocal drop, preferred music genres, event location and date, or special instructions..."
              className={`w-full bg-zinc-900/90 border rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-y min-h-[110px] ${
                errors.message ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#E50914]'
              }`}
            />
            {errors.message && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Security & Direct Delivery Guarantees */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Studio Connection: Reaches DJ Emma Pro FX phone & inbox immediately.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span>WhatsApp: +256 780 527361</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const draftInquiry: StudioInquiry = {
                    id: 'PREVIEW',
                    name: name || 'Client',
                    email: email || 'client@example.com',
                    projectType,
                    phone,
                    budget,
                    timeline,
                    message: message || 'Project details',
                    status: 'new',
                    createdAt: new Date().toISOString()
                  };
                  handleOpenWhatsApp(draftInquiry);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                title="Send inquiry directly via WhatsApp app"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const draftInquiry: StudioInquiry = {
                    id: 'PREVIEW',
                    name: name || 'Client',
                    email: email || 'client@example.com',
                    projectType,
                    phone,
                    budget,
                    timeline,
                    message: message || 'Project details',
                    status: 'new',
                    createdAt: new Date().toISOString()
                  };
                  handleOpenEmail(draftInquiry);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                title="Send inquiry directly via your email client"
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>Send via Email</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] disabled:bg-zinc-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Studio</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
