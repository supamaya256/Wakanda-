import { useState, FormEvent } from 'react';
import { Search, CheckCircle2, Clock, Truck, ShieldAlert, Sparkles, Phone, MessageSquare } from 'lucide-react';

export default function NetflixClientPortal() {
  const [searchPhone, setSearchPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const activeOrders = [
    {
      id: 'FX-8841',
      client: 'DJ Rex Kampala',
      item: 'Club Hype 3-Pack Voice Drops',
      stage: 'Mastering Audio',
      progress: 75,
      deliveryTime: 'Today at 6:00 PM',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'FX-8842',
      client: 'Soroti City DJs',
      item: 'Studio 3D Logo Animation',
      stage: 'Final ProRes 3D Render',
      progress: 90,
      deliveryTime: 'Ready in 45 Mins',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'FX-8843',
      client: 'Radio Kyoga Eastern',
      item: 'Station ID Jingle & Frequency Drops',
      stage: 'Delivered to WhatsApp',
      progress: 100,
      deliveryTime: 'Completed',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    // Find matching demo or generate live status
    const s = (searchPhone || '').toLowerCase();
    const match = activeOrders.find(
      o => (o.id && typeof o.id === 'string' && o.id.toLowerCase().includes(s)) ||
           (o.client && typeof o.client === 'string' && o.client.toLowerCase().includes(s))
    );

    if (match) {
      setTrackedOrder(match);
    } else {
      setTrackedOrder({
        id: `FX-${searchPhone.slice(-4) || '9920'}`,
        client: searchPhone,
        item: 'Custom Audio Drops & Branding',
        stage: 'In Studio Production',
        progress: 60,
        deliveryTime: 'Est. within 12 Hours',
        thumbnail: '/wallpaper.png'
      });
    }
  };

  return (
    <section id="portal" className="my-10 lg:my-14 px-4 sm:px-8 lg:px-12 select-none">
      {/* Row Title */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>Client Portal & Order Progress</span>
            <span className="text-xs text-[#E50914] font-normal tracking-normal inline-flex items-center">
              ● Live Studio Feed
            </span>
          </h2>
          <p className="text-xs text-zinc-400">Track your pending voice drops and 3D logo delivery status</p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#181818] border border-zinc-800 rounded-md overflow-hidden hover:border-zinc-600 transition-colors"
          >
            <div className="relative aspect-video w-full bg-zinc-900">
              <img
                src={order.thumbnail}
                alt={order.client}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40" />

              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="w-3.5 h-4.5 rounded-[1px] bg-[#E50914] flex items-center justify-center font-black text-white text-[9px]">
                  N
                </span>
                <span className="bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                  {order.id}
                </span>
              </div>

              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div
                  className="h-full bg-[#E50914]"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white font-bold">{order.client}</span>
                <span className="text-[#46d369] font-mono font-bold text-[10px]">{order.progress}%</span>
              </div>
              <p className="text-zinc-300 text-xs mb-3 truncate">{order.item}</p>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">{order.stage}</span>
                <span className="text-zinc-400 font-mono">{order.deliveryTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Search Card */}
      <div className="bg-[#181818] border border-zinc-800 p-6 rounded-md max-w-2xl">
        <h3 className="text-sm font-bold text-white mb-1">Look Up Your Order Status</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Enter your WhatsApp phone number or Order ID to inspect your production status.
        </p>

        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. +256 780 527 361 or FX-8841"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>TRACK</span>
          </button>
        </form>

        {hasSearched && trackedOrder && (
          <div className="mt-4 p-4 rounded bg-zinc-900 border border-zinc-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Order {trackedOrder.id}</span>
              <span className="text-xs text-[#46d369] font-bold">{trackedOrder.progress}% Complete</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-[#E50914] h-full" style={{ width: `${trackedOrder.progress}%` }} />
            </div>
            <p className="text-xs text-zinc-300">Current Phase: <strong className="text-white">{trackedOrder.stage}</strong></p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">{trackedOrder.deliveryTime}</span>
              <a
                href={`https://wa.me/256780527361?text=Hello%20DJ%20Emma%20Pro%20FX,%20checking%20status%20for%20order%20${trackedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#E50914] font-bold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
