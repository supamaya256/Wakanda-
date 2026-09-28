import { useState, FormEvent } from 'react';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Log the feedback (can be wired to Firestore later)
    console.log('User Feedback:', feedback);
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setFeedback('');
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#E50914] hover:bg-[#b80710] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-black/50 transition-transform hover:scale-105 flex items-center gap-2 group border border-[#E50914]/50 hover:border-white/20"
        title="Send Feedback"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline font-medium text-sm pr-1">Feedback</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="feedback-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                <h3 className="font-bold text-lg text-white">Send Feedback</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors rounded-full p-1 hover:bg-zinc-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-[#46d369] mb-3" />
                    <h4 className="text-white font-bold text-lg mb-1">Thank You!</h4>
                    <p className="text-zinc-400 text-sm">Your feedback has been recorded.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <p className="text-zinc-400 text-sm">
                      Have a suggestion or found a bug? Let us know what you think about the app!
                    </p>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] resize-none transition-all"
                      required
                      autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded font-medium text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!feedback.trim()}
                        className="flex items-center gap-2 px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
