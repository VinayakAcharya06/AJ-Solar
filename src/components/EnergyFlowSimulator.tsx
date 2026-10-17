import React, { useState, useEffect } from 'react';
import { Sun, BatteryCharging, Home, Zap, AlertTriangle, Play, Pause, RefreshCw, Power } from 'lucide-react';
import { SystemConfig, FlowMode } from '../types/solar';
import { BATTERY_SPECS } from '../utils/calculations';

interface EnergyFlowSimulatorProps {
  system: SystemConfig;
  isDark: boolean;
}

export const EnergyFlowSimulator: React.FC<EnergyFlowSimulatorProps> = ({ system, isDark }) => {
  const [mode, setMode] = useState<FlowMode>('sunny_export');
  const [timeHour, setTimeHour] = useState<number>(13); // 1:00 PM default
  const [isPlayingTime, setIsPlayingTime] = useState<boolean>(false);
  const [batterySoc, setBatterySoc] = useState<number>(90);

  // Automatic time lapse animation
  useEffect(() => {
    let interval: any;
    if (isPlayingTime) {
      interval = setInterval(() => {
        setTimeHour((prev) => {
          const next = (prev + 0.2) % 24;
          return Number(next.toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingTime]);

  let solarKw = 0;
  let homeLoadKw = 2.8; // AC + fans + fridge
  let batteryKw = 0;
  let gridKw = 0;
  let isGridDown = false;

  const batteryCapacity = BATTERY_SPECS[system.batteryPack].capacityKwh;
  const hasBattery = system.batteryPack !== 'none';

  if (mode === 'manual') {
    if (timeHour >= 6 && timeHour <= 18) {
      const sunFactor = Math.sin(((timeHour - 6) / 12) * Math.PI);
      solarKw = Number((system.solarCapacityKw * 0.88 * Math.max(0, sunFactor)).toFixed(2));
    } else {
      solarKw = 0;
    }

    if ((timeHour >= 12 && timeHour <= 16) || (timeHour >= 18 && timeHour <= 22)) {
      homeLoadKw = 4.2; // Pakistani summer AC peak load
    } else if (timeHour >= 0 && timeHour <= 6) {
      homeLoadKw = 1.6;
    } else {
      homeLoadKw = 2.5;
    }

    const surplus = solarKw - homeLoadKw;
    if (surplus > 0) {
      if (hasBattery && batterySoc < 98) {
        batteryKw = Math.min(surplus, 4.0);
        gridKw = Number((surplus - batteryKw).toFixed(2));
      } else {
        batteryKw = 0;
        gridKw = Number(surplus.toFixed(2));
      }
    } else {
      const deficit = Math.abs(surplus);
      if (hasBattery && batterySoc > 15) {
        batteryKw = -Math.min(deficit, 4.5);
        gridKw = -Number((deficit - Math.abs(batteryKw)).toFixed(2));
      } else {
        batteryKw = 0;
        gridKw = -Number(deficit.toFixed(2));
      }
    }
  } else if (mode === 'sunny_export') {
    solarKw = Number((system.solarCapacityKw * 0.85).toFixed(1));
    homeLoadKw = 2.6;
    if (hasBattery) {
      batteryKw = 3.2; // charging Crown/itel battery
      gridKw = Math.max(0, Number((solarKw - homeLoadKw - batteryKw).toFixed(1)));
    } else {
      batteryKw = 0;
      gridKw = Math.max(0, Number((solarKw - homeLoadKw).toFixed(1)));
    }
  } else if (mode === 'evening_battery') {
    solarKw = 0;
    homeLoadKw = 3.2;
    if (hasBattery) {
      batteryKw = -3.2; // Crown/itel battery powers whole house
      gridKw = 0; // ZERO peak WAPDA units drawn
    } else {
      batteryKw = 0;
      gridKw = -3.2; // drawn from WAPDA at expensive peak rates
    }
  } else if (mode === 'cloudy_grid') {
    solarKw = Number((system.solarCapacityKw * 0.25).toFixed(1));
    homeLoadKw = 4.5;
    if (hasBattery) {
      batteryKw = -2.0;
      gridKw = -Number((homeLoadKw - solarKw - 2.0).toFixed(1));
    } else {
      batteryKw = 0;
      gridKw = -Number((homeLoadKw - solarKw).toFixed(1));
    }
  } else if (mode === 'grid_outage') {
    isGridDown = true;
    solarKw = Number((system.solarCapacityKw * 0.55).toFixed(1));
    homeLoadKw = 2.5;
    gridKw = 0; // WAPDA feeder tripped / load shedding
    if (hasBattery) {
      if (solarKw >= homeLoadKw) {
        batteryKw = Number((solarKw - homeLoadKw).toFixed(1));
      } else {
        batteryKw = -Number((homeLoadKw - solarKw).toFixed(1));
      }
    } else {
      solarKw = Math.min(solarKw, homeLoadKw);
      batteryKw = 0;
    }
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header and intro */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-2 sm:mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>NEPRA Green Meter & Load Shedding Dynamic Engine</span>
        </div>
        <h2
          className={`text-2xl sm:text-4xl md:text-5xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Dynamic Energy Flow & Load Shedding Protection
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-400">
          See how your hybrid solar setup eliminates heavy WAPDA tariffs and automatically switches to Crown / itel battery storage when load shedding occurs.
        </p>
      </div>

      {/* Mode Control Bar */}
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
        {[
          { id: 'sunny_export', label: '☀️ Peak Sun & WAPDA Export', desc: 'NEPRA Green Meter spinning backwards' },
          { id: 'evening_battery', label: '🌙 Evening Battery Autonomy', desc: 'Zero WAPDA peak unit charges' },
          { id: 'cloudy_grid', label: '☁️ Monsoon Overcast Balancing', desc: 'Multi-source hybrid balancing' },
          { id: 'grid_outage', label: '⚡ WAPDA Load Shedding', desc: 'Zero-second automatic UPS handover' },
          { id: 'manual', label: '⏱️ 24-Hour Pakistan Sun Arc', desc: 'Day-to-night dynamic solar simulation' },
        ].map((item) => {
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id as FlowMode);
                if (item.id !== 'manual') setIsPlayingTime(false);
              }}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105 font-bold'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 24-Hour Slider */}
      {mode === 'manual' && (
        <div
          className={`max-w-xl mx-auto p-4 mb-8 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sun className="w-4 h-4" />
              <span>Simulated Time of Day (Pakistan Standard Time):</span>
            </span>
            <span className="font-mono text-base font-bold text-amber-400">
              {Math.floor(timeHour).toString().padStart(2, '0')}:
              {Math.round((timeHour % 1) * 60).toString().padStart(2, '0')}{' '}
              {timeHour >= 12 ? 'PM' : 'AM'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingTime(!isPlayingTime)}
              className="p-2 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer"
              title={isPlayingTime ? 'Pause timelapse' : 'Play timelapse'}
            >
              {isPlayingTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.1"
              value={timeHour}
              onChange={(e) => setTimeHour(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <button
              onClick={() => {
                setTimeHour(13);
                setIsPlayingTime(false);
              }}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Reset to noon"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Load Shedding Warning Alert */}
      {isGridDown && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold block text-red-300">
                WAPDA / DISCO FEEDER DOWN (LOAD SHEDDING IN PROGRESS)
              </span>
              <span>
                {hasBattery
                  ? `Hybrid Inverter seamlessly switched to ${BATTERY_SPECS[system.batteryPack].name}. Your house, AC & fans are running without a blip!`
                  : 'Notice: On-Grid only system without battery cannot operate during WAPDA load shedding.'}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-red-900 text-white font-mono text-xs font-bold shrink-0">
            UPS ISLAND MODE
          </span>
        </div>
      )}

      {/* Center Interactive Simulation Stage */}
      <div
        className={`relative w-full rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border ${
          isDark
            ? 'glass-card-dark border-slate-700/60'
            : 'glass-card-light border-slate-200'
        }`}
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto aspect-[16/9] min-h-[360px] sm:min-h-[460px]">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 900 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="sunGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Wire 1: Solar Roof to Smart Inverter */}
            <path
              d="M 230 140 L 450 250"
              stroke={solarKw > 0 ? '#FBBF24' : '#334155'}
              strokeWidth={solarKw > 0 ? '3.5' : '1.5'}
              strokeDasharray={solarKw > 0 ? '6 4' : 'none'}
              className={solarKw > 0 ? 'animate-flow-dash' : ''}
              filter={solarKw > 0 ? 'url(#flowGlow)' : undefined}
            />

            {/* Wire 2: Inverter to Home Loads */}
            <path
              d="M 450 250 L 290 390"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              className="animate-flow-dash"
              filter="url(#flowGlow)"
            />

            {/* Wire 3: Inverter to Crown / itel Battery Storage */}
            <path
              d="M 450 250 L 450 420"
              stroke={
                batteryKw > 0
                  ? '#10B981'
                  : batteryKw < 0
                  ? '#F59E0B'
                  : '#475569'
              }
              strokeWidth={batteryKw !== 0 ? '3.5' : '1.5'}
              strokeDasharray={batteryKw !== 0 ? '6 4' : 'none'}
              className={
                batteryKw > 0
                  ? 'animate-flow-dash'
                  : batteryKw < 0
                  ? 'animate-flow-reverse'
                  : ''
              }
              filter={batteryKw !== 0 ? 'url(#flowGlow)' : undefined}
            />

            {/* Wire 4: Inverter to WAPDA Grid / NEPRA Meter */}
            <path
              d="M 450 250 L 710 250"
              stroke={
                isGridDown
                  ? '#EF4444'
                  : gridKw > 0
                  ? '#10B981'
                  : gridKw < 0
                  ? '#F43F5E'
                  : '#475569'
              }
              strokeWidth={gridKw !== 0 || isGridDown ? '3.5' : '1.5'}
              strokeDasharray={gridKw !== 0 && !isGridDown ? '6 4' : isGridDown ? '4 4' : 'none'}
              className={
                gridKw > 0 && !isGridDown
                  ? 'animate-flow-dash'
                  : gridKw < 0 && !isGridDown
                  ? 'animate-flow-reverse'
                  : ''
              }
              filter={gridKw !== 0 || isGridDown ? 'url(#flowGlow)' : undefined}
            />

            {/* NODE 1: SUN & TIER-1 ROOFTOP */}
            <g transform="translate(140, 60)">
              <circle
                cx="40"
                cy="30"
                r="30"
                fill="url(#sunGlowGrad)"
                opacity={solarKw > 0 ? '1' : '0.2'}
                filter="url(#flowGlow)"
              />
              {solarKw > 0 && (
                <circle
                  cx="40"
                  cy="30"
                  r="38"
                  stroke="#FEF08A"
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-ping"
                />
              )}
              <polygon
                points="10,85 85,45 140,85 65,120"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <line x1="45" y1="65" x2="105" y2="105" stroke="#38BDF8" strokeWidth="0.8" />
              <line x1="85" y1="45" x2="65" y2="120" stroke="#38BDF8" strokeWidth="0.8" />
              <text x="75" y="145" textAnchor="middle" fill={isDark ? '#F8FAFC' : '#0F172A'} fontSize="13" fontWeight="bold">
                Longi / Jinko Panels
              </text>
              <text x="75" y="162" textAnchor="middle" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {solarKw} kW Active
              </text>
            </g>

            {/* NODE 2: SMART HYBRID INVERTER */}
            <g transform="translate(400, 205)">
              <rect
                x="0"
                y="0"
                width="100"
                height="90"
                rx="16"
                fill={isDark ? '#1E293B' : '#FFFFFF'}
                stroke="#FBBF24"
                strokeWidth="2.5"
                filter="url(#flowGlow)"
              />
              <circle cx="50" cy="35" r="14" fill="#0F172A" stroke="#FBBF24" strokeWidth="1.5" />
              <circle cx="50" cy="35" r="6" fill="#FBBF24" className="animate-pulse" />
              <text x="50" y="65" textAnchor="middle" fill={isDark ? '#F8FAFC' : '#0F172A'} fontSize="11" fontWeight="bold">
                Hybrid Inverter
              </text>
              <text x="50" y="80" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                Zero-ms UPS
              </text>
            </g>

            {/* NODE 3: HOME APPLIANCES & AC LOAD */}
            <g transform="translate(180, 310)">
              <polygon
                points="60,20 120,55 120,110 0,110 0,55"
                fill={isDark ? '#1E293B' : '#F1F5F9'}
                stroke="#FBBF24"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="65"
                width="30"
                height="35"
                rx="3"
                fill="#FBBF24"
                opacity={homeLoadKw > 0 ? '0.9' : '0.1'}
                filter="url(#flowGlow)"
              />
              <rect
                x="65"
                y="65"
                width="40"
                height="35"
                rx="3"
                fill="#FBBF24"
                opacity={homeLoadKw > 0 ? '0.9' : '0.1'}
                filter="url(#flowGlow)"
              />
              <text x="60" y="132" textAnchor="middle" fill={isDark ? '#F8FAFC' : '#0F172A'} fontSize="13" fontWeight="bold">
                Home AC & Load
              </text>
              <text x="60" y="148" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {homeLoadKw} kW Running
              </text>
            </g>

            {/* NODE 4: CROWN / ITEL BATTERY STORAGE */}
            <g transform="translate(385, 360)">
              <rect
                x="15"
                y="20"
                width="100"
                height="110"
                rx="14"
                fill={isDark ? '#1E293B' : '#FFFFFF'}
                stroke={hasBattery ? '#10B981' : '#64748B'}
                strokeWidth="2"
              />
              <rect x="28" y="35" width="74" height="12" rx="4" fill="#0F172A" />
              <rect
                x="30"
                y="37"
                width={hasBattery ? `${(batterySoc / 100) * 70}` : '0'}
                height="8"
                rx="3"
                fill={batteryKw > 0 ? '#10B981' : '#FBBF24'}
              />
              <text x="65" y="70" textAnchor="middle" fill={isDark ? '#F8FAFC' : '#0F172A'} fontSize="10" fontWeight="bold">
                {hasBattery ? 'Crown / itel Lithium' : 'No Battery'}
              </text>
              <text
                x="65"
                y="86"
                textAnchor="middle"
                fill={batteryKw > 0 ? '#10B981' : batteryKw < 0 ? '#FBBF24' : '#94A3B8'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {hasBattery
                  ? batteryKw > 0
                    ? `+${batteryKw} kW Charge`
                    : batteryKw < 0
                    ? `${batteryKw} kW Backup`
                    : 'Standby Buffer'
                  : 'N/A'}
              </text>
              <text x="65" y="104" textAnchor="middle" fill="#94A3B8" fontSize="10">
                {hasBattery ? `SoC: ${batterySoc}% (${batteryCapacity} kWh)` : 'On-Grid Only'}
              </text>
            </g>

            {/* NODE 5: WAPDA / DISCO GRID & NEPRA GREEN METER */}
            <g transform="translate(680, 180)">
              <polygon
                points="45,15 20,110 70,110"
                fill="none"
                stroke={isGridDown ? '#EF4444' : '#94A3B8'}
                strokeWidth="2"
              />
              <line x1="15" y1="45" x2="75" y2="45" stroke={isGridDown ? '#EF4444' : '#94A3B8'} strokeWidth="2" />
              <line x1="25" y1="75" x2="65" y2="75" stroke={isGridDown ? '#EF4444' : '#94A3B8'} strokeWidth="2" />
              {isGridDown && (
                <text x="45" y="5" textAnchor="middle" fill="#EF4444" fontSize="16" fontWeight="bold">
                  ⚠️
                </text>
              )}
              <text x="45" y="132" textAnchor="middle" fill={isDark ? '#F8FAFC' : '#0F172A'} fontSize="13" fontWeight="bold">
                WAPDA / NEPRA Meter
              </text>
              <text
                x="45"
                y="148"
                textAnchor="middle"
                fill={
                  isGridDown
                    ? '#EF4444'
                    : gridKw > 0
                    ? '#10B981'
                    : gridKw < 0
                    ? '#F43F5E'
                    : '#94A3B8'
                }
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {isGridDown
                  ? 'Feeder Off (Loadshedding)'
                  : gridKw > 0
                  ? `+${gridKw} kW Export (Green Meter)`
                  : gridKw < 0
                  ? `${Math.abs(gridKw)} kW Import (WAPDA)`
                  : '0.0 kW (Neutral)'}
              </text>
            </g>
          </svg>
        </div>

        {/* Telemetry Dashboard in PKR Context */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/40">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span>Solar Output</span>
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
              {solarKw} <span className="text-xs font-sans text-slate-400">kW</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {solarKw > 0 ? 'High Pakistani sunlight' : 'Sun dormant'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
            <div className="flex items-center justify-between text-xs text-sky-400 mb-1">
              <span>House Demand</span>
              <Home className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
              {homeLoadKw} <span className="text-xs font-sans text-slate-400">kW</span>
            </div>
            <span className="text-[11px] text-slate-400">Inverter ACs, fans & pumps</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
              <span>Crown/itel Battery</span>
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              {hasBattery ? `${batterySoc}%` : 'N/A'}
            </div>
            <span className="text-[11px] text-slate-400">
              {hasBattery
                ? batteryKw > 0
                  ? `Charging @ ${batteryKw} kW`
                  : batteryKw < 0
                  ? `Backing up @ ${Math.abs(batteryKw)} kW`
                  : 'Full charge buffer'
                : 'No battery selected'}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              isGridDown
                ? 'bg-red-500/10 border-red-500/30'
                : gridKw >= 0
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/20'
            }`}
          >
            <div
              className={`flex items-center justify-between text-xs mb-1 ${
                isGridDown ? 'text-red-400' : gridKw >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>NEPRA Green Meter</span>
              <Power className="w-4 h-4" />
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold font-mono ${
                isGridDown ? 'text-red-400' : gridKw >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isGridDown ? 'FEEDER OFF' : `${gridKw > 0 ? '+' : ''}${gridKw}`}
              {!isGridDown && <span className="text-xs font-sans text-slate-400 ml-1">kW</span>}
            </div>
            <span className="text-[11px] text-slate-400">
              {isGridDown
                ? 'Load shedding active'
                : gridKw > 0
                ? 'Selling units to WAPDA'
                : gridKw < 0
                ? 'Buying from WAPDA'
                : 'Zero net bill balance'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
