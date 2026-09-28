import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Smile } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface EmojiReactionPickerProps {
  trackId: number;
}

export default function EmojiReactionPicker({ trackId }: EmojiReactionPickerProps) {
  const [reactions, setReactions] = useState<{ [emoji: string]: number }>({});
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to all emojis for this track
    const emojisRef = collection(db, 'track_reactions', trackId.toString(), 'emojis');
    const unsubscribe = onSnapshot(emojisRef, (snapshot) => {
      const newReactions: { [emoji: string]: number } = {};
      snapshot.forEach((doc) => {
        newReactions[doc.id] = doc.data().count || 0;
      });
      setReactions(newReactions);
    }, (error) => {
      console.error("Error fetching reactions:", error);
    });

    return () => unsubscribe();
  }, [trackId]);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleAddReaction = async (emoji: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowPicker(false);
    try {
      const emojiDocRef = doc(db, 'track_reactions', trackId.toString(), 'emojis', emoji);
      await setDoc(emojiDocRef, {
        count: increment(1)
      }, { merge: true });
    } catch (error) {
      console.error("Failed to add reaction", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    handleAddReaction(emojiData.emoji);
  };

  const totalReactions = Object.values(reactions).reduce((a: any, b: any) => a + b, 0) as number;

  // Sort emojis by count and take top 10
  const sortedReactions = Object.entries(reactions as any)
    .sort((a: any, b: any) => b[1] - a[1])
    .filter(([_, count]: [any, any]) => count > 0)
    .slice(0, 10);

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 relative">
      {/* Existing Reactions */}
      {sortedReactions.map(([emoji, count]: [any, any]) => (
        <motion.button
          key={emoji}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => handleAddReaction(emoji)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 transition-colors cursor-pointer"
          title={`Add ${emoji} reaction`}
        >
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-xs font-bold text-zinc-300">{count}</span>
        </motion.button>
      ))}

      {/* Add Reaction Button */}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            showPicker || totalReactions > 0
              ? 'border-zinc-500 bg-zinc-800 text-white hover:border-white'
              : 'border-dashed border-zinc-600 bg-transparent text-zinc-400 hover:text-white hover:border-zinc-400'
          }`}
          title="React with emoji"
        >
          {totalReactions === 0 && !showPicker ? (
             <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2">
               <Smile className="w-3.5 h-3.5" />
             </span>
          ) : (
             <Plus className="w-4 h-4" />
          )}
        </button>

        {/* Emoji Picker Popup */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              key="emoji-picker-dropdown"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-3 z-50 shadow-2xl shadow-black origin-bottom-left sm:origin-bottom-right"
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
                lazyLoadEmojis={true}
                searchPlaceHolder="Search emojis..."
                width={300}
                height={400}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
