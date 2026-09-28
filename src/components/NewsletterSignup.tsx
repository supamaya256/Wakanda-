import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

export default function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.toLowerCase(),
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative py-16 sm:py-24 overflow-hidden border-t border-zinc-800 bg-[#141414]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#141414] to-black z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#E50914]/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-full mb-6 border border-zinc-800 shadow-xl">
            <Mail className="w-6 h-6 text-[#E50914]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {t('newsletter.title')}
          </h2>
          
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
            Join the exclusive DJ Emma Pro FX list. Get instant email alerts for brand new nonstop mixtapes, Ateso movie releases, and custom voice drop packs before anyone else.
          </p>

          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center p-6 bg-emerald-950/30 border border-emerald-500/30 rounded-xl max-w-md mx-auto"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className="text-emerald-400 font-bold text-lg mb-1">You're on the list!</h3>
              <p className="text-emerald-500/80 text-sm">Get ready for the hottest exclusive drops.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    disabled={status === 'loading'}
                    className={`w-full px-5 py-4 bg-zinc-900/80 border ${status === 'error' ? 'border-red-500' : 'border-zinc-700'} text-white rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-500`}
                    required
                  />
                  {status === 'error' && (
                    <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-4 text-center">
                By subscribing, you agree to receive promotional emails. We respect your inbox and never spam.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
