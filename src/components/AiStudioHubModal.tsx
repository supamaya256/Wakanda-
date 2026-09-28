import React, { useState } from 'react';
import { X, Sparkles, Music, Image as ImageIcon, Video, MessageSquare, Mic, Send, Play, Download, Search, MapPin, RefreshCw, Layers } from 'lucide-react';

interface AiStudioHubModalProps {
  onClose: () => void;
}

export default function AiStudioHubModal({ onClose }: AiStudioHubModalProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'music' | 'image' | 'video' | 'live'>('chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string; grounding?: any }>>([
    { role: 'model', text: 'Hello! I am your DJ Emma AI Studio Pro Assistant. Ask me about Ateso club mixes, upcoming gigs in Soroti & Kampala, or music production!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [useSearch, setUseSearch] = useState(true);
  const [useMaps, setUseMaps] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Music state (Lyria)
  const [musicPrompt, setMusicPrompt] = useState('High energy Ateso club dance mix with traditional drums and heavy bass drops');
  const [musicDuration, setMusicDuration] = useState<number>(30);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicMessage, setMusicMessage] = useState('');

  // Image state (Gemini 3.1 Flash Image)
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk DJ Emma spinning records at a massive festival in Soroti with neon laser lights');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Video state (Veo)
  const [videoPrompt, setVideoPrompt] = useState('Cinematic drone shot over a massive outdoor concert in Uganda with pyrotechnics and cheering fans');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Live Voice state
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);

  // Handlers
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatting) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: chatMessages.slice(-6),
          useSearch,
          useMaps
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setChatMessages(prev => [...prev, { role: 'model', text: data.reply, grounding: data.groundingMetadata }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message || 'Failed to connect to AI server'}` }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicPrompt.trim() || isGeneratingMusic) return;

    setIsGeneratingMusic(true);
    setGeneratedAudioUrl(null);
    setMusicMessage('');

    try {
      const res = await fetch('/api/ai/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, duration: musicDuration })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedAudioUrl(data.audioUrl);
      setMusicMessage(data.message || 'Generated successfully!');
    } catch (err: any) {
      setMusicMessage(`Error: ${err.message}`);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      alert(`Image generation error: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim() || isGeneratingVideo) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);

    try {
      const res = await fetch('/api/ai/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio: videoAspectRatio })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedVideoUrl(data.videoUrl);
    } catch (err: any) {
      alert(`Video generation error: ${err.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#E50914] to-zinc-900 text-white shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Studio Pro Features Hub</h2>
              <p className="text-xs text-zinc-400">Powered by Gemini 3.5, Lyria Music, Veo Video & Grounding APIs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-zinc-800 bg-zinc-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#E50914] text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat & Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'music'
                ? 'bg-[#E50914] text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Lyria Music Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'image'
                ? 'bg-[#E50914] text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gemini Art Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-[#E50914] text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Veo Video Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-[#E50914] text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Live Voice Assistant</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* 1. Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-zinc-300 font-semibold">Grounding Sources:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={useSearch}
                      onChange={(e) => setUseSearch(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#E50914] focus:ring-0"
                    />
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google Search</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={useMaps}
                      onChange={(e) => setUseMaps(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#E50914] focus:ring-0"
                    />
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Maps</span>
                  </label>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Model: gemini-3.5-flash</span>
              </div>

              {/* Message Thread */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 min-h-[300px] max-h-[400px]">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#E50914] text-white rounded-br-none shadow-lg'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none shadow'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.grounding && (
                        <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
                          <Search className="w-3 h-3 text-blue-400" />
                          <span>Grounded with Google Search / Maps data</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-400 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#E50914]" />
                      <span>Thinking with Grounding...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-3 pt-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about Ateso club music, tour dates, or studio tips..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#E50914] outline-none"
                />
                <button
                  type="submit"
                  disabled={isChatting || !inputMessage.trim()}
                  className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition-all shadow flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. Music Tab (Lyria) */}
          {activeTab === 'music' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#E50914]" />
                    <span>AI Music Studio (Lyria-3)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Generate professional Ateso club beat clips or full tracks instantly.</p>
                </div>

                <form onSubmit={handleGenerateMusic} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Music Description / Prompt</label>
                    <textarea
                      rows={3}
                      value={musicPrompt}
                      onChange={(e) => setMusicPrompt(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#E50914] outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Duration & Model</label>
                      <select
                        value={musicDuration}
                        onChange={(e) => setMusicDuration(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                      >
                        <option value={30}>30 Second Clip (lyria-3-clip-preview)</option>
                        <option value={60}>Full Track (lyria-3-pro-preview)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isGeneratingMusic || !musicPrompt.trim()}
                        className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingMusic ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Composing Music...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate Track</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {musicMessage && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                    {musicMessage}
                  </div>
                )}

                {generatedAudioUrl && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">Generated Track Ready</span>
                      <a
                        href={generatedAudioUrl}
                        download="dj_emma_ai_track.mp3"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MP3</span>
                      </a>
                    </div>
                    <audio controls src={generatedAudioUrl} className="w-full" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Image Tab (Gemini Art Generator) */}
          {activeTab === 'image' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#E50914]" />
                    <span>Gemini Art & Image Studio (3.1 Flash Image)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Create stunning DJ album covers, concert posters, and visuals from text prompts.</p>
                </div>

                <form onSubmit={handleGenerateImage} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Image Prompt</label>
                    <textarea
                      rows={3}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#E50914] outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Rendering Artwork...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Artwork</span>
                      </>
                    )}
                  </button>
                </form>

                {generatedImageUrl && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
                    <img src={generatedImageUrl} alt="Generated AI Art" className="max-h-96 mx-auto rounded-xl shadow-lg border border-zinc-800" />
                    <div>
                      <a
                        href={generatedImageUrl}
                        download="dj_emma_artwork.png"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Image</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Video Tab (Veo) */}
          {activeTab === 'video' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#E50914]" />
                    <span>Veo Video Studio (Veo-3.1 Fast)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Generate high-definition cinematic music video clips in 16:9 or 9:16 portrait format.</p>
                </div>

                <form onSubmit={handleGenerateVideo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Video Description / Prompt</label>
                    <textarea
                      rows={3}
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#E50914] outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Aspect Ratio</label>
                      <select
                        value={videoAspectRatio}
                        onChange={(e) => setVideoAspectRatio(e.target.value as '16:9' | '9:16')}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                      >
                        <option value="16:9">16:9 Landscape (Cinematic)</option>
                        <option value="9:16">9:16 Portrait (Reels / TikTok)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isGeneratingVideo || !videoPrompt.trim()}
                        className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Generating Video...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {generatedVideoUrl && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
                    <video controls src={generatedVideoUrl} className="max-h-96 mx-auto rounded-xl shadow-lg border border-zinc-800" />
                    <div>
                      <a
                        href={generatedVideoUrl}
                        download="dj_emma_ai_video.mp4"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Video</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Live Voice Tab */}
          {activeTab === 'live' && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#E50914] to-zinc-900 flex items-center justify-center text-white shadow-xl animate-pulse">
                <Mic className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Gemini Live Voice Assistant (Gemini-3.8-Live)</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Have a real-time voice conversation with DJ Emma Pro AI about club mixes, song requests, and audio setups.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 max-w-lg mx-auto space-y-4">
                <div className="text-xs text-zinc-400 font-mono">
                  {isLiveActive ? '🔴 Live Session Active — Speak into your microphone' : '⚪ Session Idle'}
                </div>

                <button
                  onClick={() => setIsLiveActive(!isLiveActive)}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isLiveActive
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#E50914] hover:bg-[#b80710] text-white'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{isLiveActive ? 'Disconnect Live Voice' : 'Start Live Voice Conversation'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
