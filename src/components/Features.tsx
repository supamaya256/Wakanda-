import { Zap, Headphones, Settings, MonitorPlay } from 'lucide-react';

const steps = [
  { num: '01', title: 'PLACE YOUR ORDER', desc: 'Select your package and submit your requirements via our secure form.' },
  { num: '02', title: 'SEND YOUR DETAILS', desc: 'Provide pronunciations, scripts, reference audio, or logo files.' },
  { num: '03', title: 'WE CREATE', desc: 'Our studio produces your custom audio or 3D visuals.' },
  { num: '04', title: 'REVIEW PREVIEW', desc: 'Listen or watch the watermarked preview and request revisions if needed.' },
  { num: '05', title: 'FINAL DELIVERY', desc: 'Download your high-quality, mastered final files directly from your dashboard.' },
];

export function OrderProcess() {
  return (
    <section className="py-24 bg-black relative border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            HOW IT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">WORKS</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-cyan-400/50 to-purple-500/20 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-6 group-hover:border-cyan-400 group-hover:-translate-y-2 transition-all duration-300 relative shadow-xl bg-gradient-to-br from-black to-zinc-900">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400">{step.num}</span>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan-400/0 group-hover:bg-cyan-400/10 blur-md transition-all duration-300"></div>
                </div>
                <h3 className="text-white font-bold tracking-widest text-sm mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  { title: 'PROFESSIONAL QUALITY', desc: 'Industry-standard mixing, mastering, and high-resolution 3D rendering.', icon: Headphones },
  { title: 'CUSTOM DESIGNS', desc: '100% bespoke audio and visual creations tailored to your specific brand identity.', icon: Settings },
  { title: 'FAST COMMUNICATION', desc: 'Direct access to your producer or designer via the client portal.', icon: Zap },
  { title: 'DJ-FOCUSED CREATIVE', desc: 'Made by industry professionals who understand what works in the club and on radio.', icon: MonitorPlay },
];

export function Features() {
  return (
    <section className="py-24 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-8 hover:bg-[#151515] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-black tracking-widest text-sm mb-3">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
