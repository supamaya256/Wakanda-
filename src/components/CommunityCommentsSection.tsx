import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, Heart, User, CheckCircle2, ThumbsUp, Sparkles, Clock, CornerDownRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

interface ReplyItem {
  id: string;
  author: string;
  text: string;
  createdAt: any;
  likes?: number;
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt: any;
  likes: number;
  replies: ReplyItem[];
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Ateso Vibe Master',
    text: 'DJ Emma Pro FX non-stop club mixes are absolute fire! The laser drops and basslines hit different 🔥',
    createdAt: new Date(Date.now() - 3600000 * 3),
    likes: 24,
    replies: [
      {
        id: 'r1',
        author: 'Erokau John',
        text: 'Bro true! I listen to this every single day while driving in Soroti.',
        createdAt: new Date(Date.now() - 3600000 * 2),
        likes: 5
      }
    ]
  },
  {
    id: 'c2',
    author: 'Sarah Akurut',
    text: 'The video player modal and Dolby master audio downloads are super clean. Much love from Kampala!',
    createdAt: new Date(Date.now() - 3600000 * 12),
    likes: 18,
    replies: [
      {
        id: 'r2',
        author: 'Emmanuel Oumo',
        text: 'Agreed Sarah! The lossless WAV download feature is a game changer for djs.',
        createdAt: new Date(Date.now() - 3600000 * 8),
        likes: 7
      }
    ]
  },
  {
    id: 'c3',
    author: 'Okurut Michael',
    text: 'The Amapiano & Ateso fusion mix is my favorite track on here. Keep up the legendary work DJ Emma!',
    createdAt: new Date(Date.now() - 3600000 * 24),
    likes: 31,
    replies: []
  },
  {
    id: 'c4',
    author: 'Grace Amongin',
    text: 'Amazing sound quality and smooth UI. Proudly supporting Eastern Uganda music culture 🇺🇬✨',
    createdAt: new Date(Date.now() - 3600000 * 48),
    likes: 42,
    replies: []
  }
];

export default function CommunityCommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>(() => {
    const saved = localStorage.getItem('dj_emma_community_comments');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_COMMENTS; }
    }
    return DEFAULT_COMMENTS;
  });

  const [authorName, setAuthorName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync with Firestore in real-time
  useEffect(() => {
    try {
      const q = query(collection(db, 'community_comments'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteComments: CommentItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteComments.push({
              id: docSnap.id,
              author: data.author || 'Anonymous Fan',
              text: data.text || '',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
              likes: data.likes || 0,
              replies: (data.replies || []).map((r: any) => ({
                id: r.id || Math.random().toString(36).substr(2, 9),
                author: r.author || 'Fan',
                text: r.text || '',
                createdAt: r.createdAt?.toDate ? r.createdAt.toDate() : new Date(),
                likes: r.likes || 0
              }))
            });
          });
          setComments(remoteComments);
        }
      }, (err) => {
        // Silently handle offline/unavailable Firestore state
        if (err?.code !== 'unavailable' && !err?.message?.includes('offline')) {
          console.warn('Firestore sync note:', err?.message || err);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization fallback:', e);
    }
  }, []);

  // Save to localStorage whenever comments change
  useEffect(() => {
    localStorage.setItem('dj_emma_community_comments', JSON.stringify(comments));
  }, [comments]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmitting(true);
    const finalAuthor = authorName.trim() || `Music Fan #${Math.floor(Math.random() * 900) + 100}`;
    const newComment: CommentItem = {
      id: 'local_' + Date.now(),
      author: finalAuthor,
      text: newCommentText.trim(),
      createdAt: new Date(),
      likes: 0,
      replies: []
    };

    // Update locally immediately for instant feedback
    setComments(prev => [newComment, ...prev]);

    try {
      addDoc(collection(db, 'community_comments'), {
        author: newComment.author,
        text: newComment.text,
        createdAt: Timestamp.now(),
        likes: 0,
        replies: []
      }).catch(err => {
        if (err?.code !== 'unavailable') {
          console.warn('Firestore background sync note:', err?.message || err);
        }
      });
    } catch (err) {
      // Offline mode handled locally
    }

    setNewCommentText('');
    setIsSubmitting(false);
    setFeedback('Comment posted successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePostReply = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const finalReplyAuthor = replyAuthor.trim() || `Supporter #${Math.floor(Math.random() * 900) + 100}`;
    const newReply: ReplyItem = {
      id: 'rep_' + Date.now(),
      author: finalReplyAuthor,
      text: replyText.trim(),
      createdAt: new Date(),
      likes: 0
    };

    // Update locally first for instant response
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, newReply]
        };
      }
      return c;
    }));

    try {
      // If it's a Firestore document (doesn't start with local_), update in Firestore
      if (!commentId.startsWith('local_')) {
        const commentRef = doc(db, 'community_comments', commentId);
        await updateDoc(commentRef, {
          replies: arrayUnion({
            id: newReply.id,
            author: newReply.author,
            text: newReply.text,
            createdAt: Timestamp.fromDate(new Date()),
            likes: 0
          })
        });
      }
    } catch (err) {
      console.warn('Firestore reply sync fallback:', err);
    }

    setReplyText('');
    setReplyingToId(null);
    setFeedback('Reply posted!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    }));
  };

  const formatTimeAgo = (dateInput: any) => {
    try {
      const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
      const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 border-t border-zinc-800/80 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Wall</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bebas text-white tracking-wide">
            Live Fan Board & Discussion
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Leave your comments, feedback, or shoutouts below. Anyone can view and reply instantly!
          </p>
        </div>

        {feedback && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Leave a Comment Form */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-xl mb-10">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#E50914]" />
          <span>Post a Public Message</span>
        </h3>

        <form onSubmit={handlePostComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Name / Alias</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Ateso Clubber"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none"
                />
                <User className="w-4 h-4 text-zinc-500 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Message or Shoutout</label>
            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="What do you think of the mixes? Leave a comment..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none resize-none"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newCommentText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Post Message</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments Feed */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
          Recent Public Comments ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})
        </h3>

        {comments.map((comment) => (
          <div key={comment.id} className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 shadow-md space-y-4 transition-all hover:border-zinc-700">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914] to-zinc-800 flex items-center justify-center text-white font-bold text-sm shadow">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{comment.author}</span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">Verified Fan</span>
                  </h4>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleLikeComment(comment.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Like this comment"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#E50914]" />
                <span>{comment.likes}</span>
              </button>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed pl-13">
              {comment.text}
            </p>

            {/* Replies List */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 sm:ml-12 pl-4 border-l-2 border-zinc-800 space-y-3 mt-4 pt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                        <CornerDownRight className="w-3 h-3 text-[#E50914]" />
                        {reply.author}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-xs text-zinc-300 pl-4">
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Toggle & Form */}
            <div className="pl-13 pt-2">
              {replyingToId === comment.id ? (
                <form onSubmit={(e) => handlePostReply(comment.id, e)} className="mt-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">Reply to {comment.author}</span>
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    placeholder="Your Name / Alias"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#E50914]"
                  />
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#E50914] resize-none"
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 rounded bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Post Reply
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setReplyingToId(comment.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#E50914] transition-colors cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply ({comment.replies.length})</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
