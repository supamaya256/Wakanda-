import { LayoutDashboard, CheckCircle2, Clock, Music, Box, MessageSquare, Download } from 'lucide-react';

export default function ClientDashboard() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            CLIENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">DASHBOARD</span>
          </h2>
          <p className="text-zinc-400">Track your orders, communicate with our team, and download your final files.</p>
        </div>

        {/* Dashboard Concept Mockup */}
        <div className="rounded-3xl border border-white/10 bg-[#050505] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-white font-bold tracking-widest mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              PORTAL
            </div>
            
            <a href="#" className="flex items-center gap-3 text-cyan-400 bg-cyan-500/10 px-4 py-3 rounded-lg font-bold text-sm tracking-wide">
              <CheckCircle2 className="w-4 h-4" /> MY ORDERS
            </a>
            <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors">
              <MessageSquare className="w-4 h-4" /> MESSAGES
              <span className="ml-auto bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full">2</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors">
              <Download className="w-4 h-4" /> DOWNLOADS
            </a>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white tracking-widest">ACTIVE ORDERS</h3>
            </div>

            <div className="space-y-4">
              {/* Order Item 1 */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <Music className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">DJ Drop Package (PRO)</h4>
                    <p className="text-zinc-500 text-xs">Order #FX-2094 • 2 days ago</p>
                  </div>
                </div>
                
                {/* Status Bar */}
                <div className="flex-grow max-w-md mx-auto lg:mx-8 hidden sm:block">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 tracking-widest mb-2">
                    <span className="text-cyan-400">RECEIVED</span>
                    <span className="text-cyan-400">PRODUCTION</span>
                    <span>PREVIEW</span>
                    <span>COMPLETED</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full relative">
                      <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-bold tracking-widest">
                    IN PRODUCTION
                  </span>
                  <button className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Details</button>
                </div>
              </div>

              {/* Order Item 2 */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                    <Box className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">Cinematic 3D Logo</h4>
                    <p className="text-zinc-500 text-xs">Order #FX-2081 • 5 days ago</p>
                  </div>
                </div>
                
                <div className="flex-grow max-w-md mx-auto lg:mx-8 hidden sm:block">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 tracking-widest mb-2">
                    <span className="text-green-400">RECEIVED</span>
                    <span className="text-green-400">PRODUCTION</span>
                    <span className="text-green-400">PREVIEW</span>
                    <span className="text-green-400">COMPLETED</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold tracking-widest">
                    COMPLETED
                  </span>
                  <button className="flex items-center gap-1 text-cyan-400 hover:text-white text-sm font-bold tracking-wide transition-colors">
                    <Download className="w-4 h-4" /> FILE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
