import React, { useState } from 'react';
import { Shield, Star, ArrowRight, Zap, Sun, Award, CheckCircle2 } from 'lucide-react';
import { SystemConfig } from '../types/solar';

interface HeroSectionProps {
  system: SystemConfig;
  isDark: boolean;
  onNavigateToConfig: () => void;
  onNavigateToFlow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  system,
  isDark,
  onNavigateToConfig,
  onNavigateToFlow,
}) => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showResilienceModal, setShowResilienceModal] = useState(false);

  return (
    <section className="relative min-h-screen pt-28 pb-16 overflow-hidden flex flex-col justify-between">
      {/* Mountain silhouette background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <svg
          className="absolute bottom-36 w-full h-80 text-[#090e13] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path d="M0,224L60,197.3C120,171,240,117,360,128C480,139,600,213,720,208C840,203,960,117,1080,106.7C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Perspective Neon Ground Grid */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-96 pointer-events-none z-0 ${
          isDark ? 'solar-grid-perspective opacity-45' : 'solar-grid-perspective-light opacity-30'
        }`}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-start">
        {/* Big Atmospheric Hero Title */}
        <div className="text-center pt-2 sm:pt-4 pb-2">
          <h1
            className={`text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight font-sans flex items-center justify-center gap-2 sm:gap-6 drop-shadow-sm select-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="tracking-tighter">Solar</span>

            {/* 3D Glowing Energy Bolt Emblem */}
            <span className="inline-flex items-center justify-center relative mx-0.5 sm:mx-1 transform -rotate-6 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <span className="absolute inset-0 bg-amber-400 blur-lg sm:blur-xl opacity-75 rounded-full scale-110 sm:scale-125 animate-pulse" />
              <span className="relative w-10 h-10 sm:w-16 sm:h-16 lg:w-22 lg:h-22 bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border border-yellow-200/60">
                <Zap className="w-5 h-5 sm:w-8 sm:h-8 lg:w-13 lg:h-13 text-slate-950 fill-current drop-shadow" />
              </span>
            </span>

            <span className="font-extralight tracking-tight opacity-95">Power</span>
          </h1>
        </div>

        {/* Sub-badge indicating Pakistan Market */}
        <div className="flex items-center justify-center text-center px-2 mb-2">
          <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 font-medium text-slate-300">
            🇵🇰 Pakistan Premier Solar EPC & NEPRA Net Metering
          </span>
        </div>

        {/* Hero Visual Stage & Architecture Composition */}
        <div className="relative w-full mt-1 sm:mt-2 min-h-[300px] sm:min-h-[420px] lg:min-h-[460px] flex items-center justify-center">
          {/* Ambient Warm Interior Light Cone behind Villa */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[340px] sm:w-[520px] h-[240px] sm:h-[360px] house-glow-mesh rounded-full blur-xl sm:blur-2xl opacity-80" />
          </div>

          {/* LEFT HERO OVERLAY: Tier-1 Panels Card */}
          <aside
            className={`hidden lg:block absolute left-4 top-8 z-20 w-72 p-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
              isDark
                ? 'glass-card-dark border-white/10 hover:border-amber-400/40 text-slate-100'
                : 'glass-card-light border-slate-200 hover:border-amber-400 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-400/10 text-amber-400 font-mono tracking-wider border border-amber-400/30">
                LONGI · JINKO
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-sm font-light leading-relaxed mb-4 opacity-90">
              Tier-1 N-Type TOPCon 585W–620W panels with anti-dust coating for Pakistan climate.
            </p>

            {/* Solar Panel Preview Graphics */}
            <div className="relative h-28 w-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-slate-700/60 mb-4 p-2 flex items-center justify-center">
              <div className="w-20 h-24 bg-slate-800 rounded border border-sky-400/30 grid grid-cols-2 gap-1 p-1 transform -rotate-12 shadow-lg">
                <div className="bg-sky-950/80 rounded-sm border border-sky-400/20" />
                <div className="bg-sky-950/80 rounded-sm border border-sky-400/20" />
                <div className="bg-sky-950/80 rounded-sm border border-sky-400/20" />
                <div className="bg-sky-950/80 rounded-sm border border-sky-400/20" />
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] text-emerald-400 font-mono tracking-wider">
                TOPCon 23.2%
              </div>
            </div>

            <button
              onClick={onNavigateToConfig}
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-400 border-b-2 border-amber-400 pb-0.5 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Get Custom Quote
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </aside>

          {/* CENTER HERO: High-Tech Architectural Solar Villa SVG */}
          <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-[16/11]">
              <svg
                className="w-full h-full drop-shadow-2xl overflow-visible cursor-pointer"
                fill="none"
                viewBox="0 0 600 420"
                xmlns="http://www.w3.org/2000/svg"
                onClick={onNavigateToFlow}
              >
                <title>Interactive solar architecture simulation</title>
                <defs>
                  <linearGradient id="roofSolar" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>
                  <linearGradient id="warmLight" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFDD55" />
                    <stop offset="60%" stopColor="#FF9E0D" />
                    <stop offset="100%" stopColor="#D95B00" />
                  </linearGradient>
                  <linearGradient id="facadeDark" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#2d3748" />
                    <stop offset="100%" stopColor="#1a202c" />
                  </linearGradient>
                  <filter height="140%" id="yellowGlow" width="140%" x="-20%" y="-20%">
                    <feGaussianBlur result="blur" stdDeviation="6" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ground Shadow */}
                <ellipse cx="300" cy="380" fill="#000000" filter="blur(14px)" opacity="0.6" rx="260" ry="25" />

                {/* Main Cantilevered Roof */}
                <polygon
                  fill="url(#roofSolar)"
                  points="170,140 280,60 380,135 380,240 170,240"
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* Solar Photovoltaic Roof Strata */}
                <polygon
                  fill="#09131f"
                  opacity="0.85"
                  points="175,140 280,64 330,105 220,180"
                  stroke="#38bdf8"
                  strokeDasharray="8 3"
                  strokeWidth="0.7"
                />

                {/* Golden Glass Interior Wall */}
                <polygon
                  fill="url(#warmLight)"
                  filter="url(#yellowGlow)"
                  opacity="0.95"
                  points="210,145 280,95 340,145 340,230 210,230"
                />

                {/* Loft Architectural Mullions */}
                <line stroke="#78350f" strokeWidth="2.5" x1="280" x2="280" y1="95" y2="230" />
                <line stroke="#78350f" strokeWidth="2" x1="245" x2="315" y1="185" y2="185" />

                {/* Lower Ground Floor Glass Cube */}
                <rect fill="#111827" height="110" rx="3" stroke="#334155" strokeWidth="1.5" width="230" x="220" y="235" />

                {/* Warm Floor Interior Ambient */}
                <rect fill="url(#warmLight)" height="100" opacity="0.92" width="165" x="225" y="240" />
                <line stroke="#78350f" strokeWidth="2" x1="280" x2="280" y1="240" y2="340" />
                <line stroke="#78350f" strokeWidth="2" x1="340" x2="340" y1="240" y2="340" />

                {/* Modern Dark Concrete Cantilever */}
                <polygon fill="url(#facadeDark)" points="380,180 500,180 480,270 380,270" stroke="#4b5563" strokeWidth="1.5" />
                <rect fill="#030712" height="60" stroke="#374151" strokeWidth="1" width="60" x="420" y="195" />

                {/* Glowing Perimeter Neon Strips */}
                <polyline
                  filter="url(#yellowGlow)"
                  points="166,242 382,242 382,348 480,348"
                  stroke="#FBBF24"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
                <polyline
                  filter="url(#yellowGlow)"
                  points="170,140 280,60 380,135"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
                <line filter="url(#yellowGlow)" stroke="#FDE047" strokeWidth="4" x1="220" x2="480" y1="348" y2="348" />

                {/* Futuristic Balcony Railing */}
                <line stroke="#94a3b8" strokeWidth="1.5" x1="390" x2="475" y1="240" y2="240" />
                <line stroke="#94a3b8" strokeWidth="1" x1="410" x2="410" y1="240" y2="270" />
                <line stroke="#94a3b8" strokeWidth="1" x1="450" x2="450" y1="240" y2="270" />
              </svg>

              {/* CALLOUT BADGE 1: NEPRA GREEN METER */}
              <button
                onClick={onNavigateToFlow}
                className="absolute top-4 sm:top-10 right-2 sm:right-16 md:right-22 z-20 flex items-center gap-1 sm:gap-1.5 cursor-pointer group"
                title="View dynamic solar generation and net metering"
              >
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500" />
                </span>
                <span className="bg-white/95 text-slate-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-xl border border-white group-hover:scale-105 transition-transform">
                  Green Meter
                </span>
              </button>

              {/* CALLOUT BADGE 2: SYSTEM PEAK GENERATION */}
              <button
                onClick={onNavigateToConfig}
                className="absolute top-14 sm:top-26 right-1 sm:right-4 z-20 flex items-center cursor-pointer group"
                title="Customize system size"
              >
                <div className="h-px w-3 sm:w-5 bg-slate-300" />
                <div className="bg-white/95 backdrop-blur text-slate-900 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md shadow-lg border border-white group-hover:scale-105 transition-transform">
                  {system.solarCapacityKw.toFixed(1)} kW Hybrid
                </div>
              </button>
            </div>

            {/* Mobile Feature Highlights (Visible on Mobile & Tablet) */}
            <div className="lg:hidden mt-3 sm:mt-5 grid grid-cols-2 gap-2.5 w-full max-w-lg">
              <div
                onClick={onNavigateToConfig}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  isDark ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold">LONGI · JINKO</div>
                <div className="font-bold text-slate-200 mt-0.5">Tier-1 N-Type</div>
                <div className="text-[10px] text-slate-400">23.2% Heat Efficiency</div>
              </div>

              <div
                onClick={onNavigateToFlow}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  isDark ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-emerald-400 font-bold">LOAD SHEDDING</div>
                <div className="font-bold text-slate-200 mt-0.5">Crown / itel Lithium</div>
                <div className="text-[10px] text-slate-400">0-ms UPS Transfer</div>
              </div>
            </div>
          </div>

          {/* RIGHT HERO OVERLAY: Load Shedding & Tariff Copy */}
          <aside className="hidden lg:block absolute right-4 top-12 z-20 max-w-xs">
            <div className="space-y-3">
              <h2
                className={`text-2xl font-light leading-snug ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Zero WAPDA bills & zero load shedding with{' '}
                <span className="inline-flex items-center text-amber-400 font-normal">
                  <Sun className="w-5 h-5 mx-1 inline text-amber-400" />
                  sun
                </span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Autonomous hybrid inverters with Crown & itel lithium storage. Eliminate heavy Rs. 65+/unit peak tariffs and enjoy continuous power.
              </p>
              <div className="pt-2">
                <button
                  onClick={onNavigateToFlow}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate WAPDA Outage Mode</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM FEATURE CARDS GRID */}
        <section className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
          {/* CARD 1: Customer Reviews across Pakistan */}
          <article
            onClick={() => setShowReviewsModal(true)}
            className={`rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group min-h-[200px] ${
              isDark
                ? 'glass-card-dark text-slate-100 border-white/10 hover:border-amber-400/50'
                : 'glass-card-light text-slate-800 border-slate-200 hover:border-amber-400'
            }`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Client Verification
                </span>
                <h3 className="text-lg font-light leading-snug">
                  500+ Homes
                  <br />
                  in Pakistan
                </h3>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-xl font-bold font-display text-white">4.9</span>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-4">
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-amber-400/50 pb-0.5 group-hover:text-amber-300 transition-colors">
                Read Feedback
              </span>
              <div className="w-13 h-13 rounded-full border-2 border-amber-400/70 p-0.5 overflow-hidden shadow-lg bg-slate-800">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500/40 via-slate-700 to-amber-200 flex items-center justify-center text-slate-300">
                  <Award className="w-6 h-6 text-amber-300" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          </article>

          {/* CARD 2: Crown / itel Smart Lithium Battery (Requested by User) */}
          <article
            onClick={onNavigateToConfig}
            className={`rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-between group min-h-[200px] ${
              isDark
                ? 'glass-card-dark text-slate-100 border-white/10 hover:border-amber-400/50'
                : 'glass-card-light text-slate-800 border-slate-200 hover:border-amber-400'
            }`}
          >
            <div className="text-center relative z-10">
              <h3 className="text-lg font-light leading-tight">
                Crown & itel
                <br />
                <span className="font-medium text-amber-400">LiFePO4 Lithium</span>
              </h3>
            </div>

            {/* Futuristic Clean Wall Battery Mockup */}
            <div className="my-2 relative w-20 h-26 bg-gradient-to-b from-slate-200 to-slate-400 rounded-xl p-1.5 shadow-2xl flex flex-col items-center justify-between border border-white/70">
              <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="w-full space-y-1 px-2 mb-2">
                <div className="h-1 w-full bg-emerald-500 rounded-full" />
                <div className="h-1 w-full bg-emerald-500 rounded-full" />
                <div className="h-1 w-3/4 bg-amber-400 rounded-full" />
              </div>
            </div>

            <div className="relative z-10 w-full flex justify-between items-center text-[11px] text-slate-400">
              <span>Load Shedding Ready</span>
              <span className={`font-mono font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                6000+ Cycles
              </span>
            </div>
          </article>

          {/* CARD 3: Custom GI Mounting & 50°C Heat Durability */}
          <article
            onClick={() => setShowResilienceModal(true)}
            className="glass-card-light text-slate-900 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between group min-h-[200px]"
          >
            <div className="absolute -top-2 left-6 w-10 h-10 bg-gradient-to-br from-white/90 to-blue-200/50 rounded-full blur-[1px] shadow-md opacity-80" />
            <div className="absolute bottom-6 right-6 w-8 h-8 bg-gradient-to-tl from-white to-blue-100 rounded-full blur-[0.5px] shadow-sm opacity-90" />

            <div className="relative z-10 flex justify-between items-start">
              <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[11px] font-bold font-mono tracking-widest uppercase bg-slate-900 text-white px-2.5 py-1 rounded-full">
                GI L2/L3
              </span>
            </div>

            <div className="relative z-10 mt-3">
              <h3 className="text-xl font-medium tracking-tight text-slate-900 mb-1">
                Heavy Duty
                <br />
                GI Structure
              </h3>
              <p className="text-xs text-slate-600 font-normal">
                Hot-dip galvanized structure engineered for 140 km/h winds and 50°C summer heatwaves.
              </p>
            </div>
          </article>
        </section>
      </div>

      {/* Customer Reviews Modal for Pakistan */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border ${
              isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <h3 className="text-lg font-bold">Client Experiences Across Pakistan</h3>
              </div>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 my-4 max-h-80 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span>★★★★★</span>
                  <span className="text-slate-400 font-mono">DHA Phase 6, Lahore (LESCO)</span>
                </div>
                <p className="text-sm font-medium">“Our WAPDA bill went from Rs. 140,000 to Rs. 2,500!”</p>
                <p className="text-xs text-slate-400 mt-1">
                  15 kW Longi system with NEPRA green meter. Even during summer peak AC load, our meter was spinning backwards.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span>★★★★★</span>
                  <span className="text-slate-400 font-mono">Bahria Town, Rawalpindi (IESCO)</span>
                </div>
                <p className="text-sm font-medium">“Crown 10kWh Lithium battery saved us from 6hr load shedding.”</p>
                <p className="text-xs text-slate-400 mt-1">
                  Zero flicker, inverter AC runs effortlessly all night long without noisy fuel generator fumes.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span>★★★★★</span>
                  <span className="text-slate-400 font-mono">Qasimabad, Hyderabad (HESCO)</span>
                </div>
                <p className="text-sm font-medium">“HESCO Green Meter installed seamlessly. Zero load shedding!”</p>
                <p className="text-xs text-slate-400 mt-1">
                  12 kW Longi panels with Crown 10kWh battery. Even during brutal 46°C heatwaves and HESCO feeder cuts, both our inverter ACs run non-stop.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span>★★★★★</span>
                  <span className="text-slate-400 font-mono">Clifton Block 4, Karachi (K-Electric)</span>
                </div>
                <p className="text-sm font-medium">“itel LiFePO4 wall battery is ultra silent and fast charging.”</p>
                <p className="text-xs text-slate-400 mt-1">
                  Compact wall mount design, takes zero floor space in our garage and fully charges from morning sun.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReviewsModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer hover:bg-amber-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Resilience Modal */}
      {showResilienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
              isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold">Engineering Standards in Pakistan</h3>
              </div>
              <button
                onClick={() => setShowResilienceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="my-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Heavy-gauge 14-gauge custom galvanized L2/L3 structure for RCC roofs.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Deep 80-foot copper earthing bore pit with bentonite chemical mix for low resistance.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Dual surge arrestors (SPD) protecting against lightning strikes and WAPDA voltage surges.</span>
              </div>
            </div>
            <button
              onClick={() => setShowResilienceModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer hover:bg-amber-300"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
