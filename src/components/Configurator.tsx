import React from 'react';
import {
  HomeConfig,
  SystemConfig,
  FinancialBreakdown,
  RoofType,
  SunExposure,
  PanelTier,
  BatteryPack,
  InverterTier,
  DiscoProvider,
  HomePlotSize,
  DISCO_INFO,
} from '../types/solar';
import { PANEL_SPECS, BATTERY_SPECS, INVERTER_SPECS, formatPkr } from '../utils/calculations';
import { Zap, BatteryCharging, Home, DollarSign, Sparkles, Shield, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface ConfiguratorProps {
  home: HomeConfig;
  setHome: React.Dispatch<React.SetStateAction<HomeConfig>>;
  system: SystemConfig;
  setSystem: React.Dispatch<React.SetStateAction<SystemConfig>>;
  financials: FinancialBreakdown;
  isDark: boolean;
  onOpenPdfModal: () => void;
  onNavigateToDashboard: () => void;
}

export const Configurator: React.FC<ConfiguratorProps> = ({
  home,
  setHome,
  system,
  setSystem,
  financials,
  isDark,
  onOpenPdfModal,
  onNavigateToDashboard,
}) => {
  // Auto-size solar capacity to completely eliminate WAPDA bill
  const handleAutoRecommend = () => {
    const monthlyUnits = home.monthlyBill / Math.max(40, home.electricityRateKwh);
    const targetAnnualUnits = monthlyUnits * 12;
    const recommendedKw = Number((targetAnnualUnits / 1550).toFixed(1));
    const clampedKw = Math.min(30, Math.max(3, recommendedKw));
    setSystem((prev) => ({
      ...prev,
      solarCapacityKw: clampedKw,
    }));
  };

  const setPlotPreset = (plot: HomePlotSize) => {
    let sqFt = 2250;
    if (plot === '5_marla') sqFt = 1125;
    if (plot === '10_marla') sqFt = 2250;
    if (plot === '1_kanal') sqFt = 4500;
    if (plot === '2_kanal') sqFt = 9000;
    if (plot === 'commercial') sqFt = 6000;
    setHome({ ...home, plotSize: plot, homeSizeSqFt: sqFt });
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pakistan Market Sizing Engine (NEPRA Net Metering)</span>
        </div>
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Select Solar, Battery & Inverter for Your Home
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Accurate cost estimations in Pakistani Rupees (PKR) featuring Tier-1 panels, smart inverters, and Crown & itel load shedding batteries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Selections (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: HOME PLOT, BILL & DISCO */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Home Plot, WAPDA Bill & DISCO
                  </h3>
                  <p className="text-xs text-slate-400">Enter your electricity consumption data</p>
                </div>
              </div>
              <button
                onClick={handleAutoRecommend}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-semibold hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>Zero-Bill Sizing</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Monthly Electric Bill Slider in PKR */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">
                    Average Monthly Electricity Bill (PKR)
                  </label>
                  <span className="font-mono text-base font-bold text-amber-400">
                    Rs. {home.monthlyBill.toLocaleString()} <span className="text-xs text-slate-400">/month</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="350000"
                  step="5000"
                  value={home.monthlyBill}
                  onChange={(e) => setHome({ ...home, monthlyBill: Number(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Rs. 20,000</span>
                  <span className="text-amber-400/90 font-mono">
                    ~{Math.round(home.monthlyBill / home.electricityRateKwh)} Units/month (@ Rs. {home.electricityRateKwh}/unit)
                  </span>
                  <span>Rs. 3.5 Lakh+</span>
                </div>
              </div>

              {/* Home Plot Size Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Plot Size Preset (Pakistan Standard)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: '5_marla', label: '5 Marla', sqFt: '1,125 sq.ft' },
                    { id: '10_marla', label: '10 Marla', sqFt: '2,250 sq.ft' },
                    { id: '1_kanal', label: '1 Kanal', sqFt: '4,500 sq.ft' },
                    { id: '2_kanal', label: '2 Kanal', sqFt: '9,000 sq.ft' },
                    { id: 'commercial', label: 'Commercial', sqFt: 'Plaza / Shed' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlotPreset(p.id as HomePlotSize)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        home.plotSize === p.id
                          ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                          : isDark
                          ? 'border-slate-700/60 bg-slate-800/40 text-slate-300'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{p.label}</div>
                      <span className="text-[10px] text-slate-400 block">{p.sqFt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DISCO Utility Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Electricity Utility Provider (DISCO)
                  </label>
                  <span className="text-[11px] font-mono text-amber-400">
                    Selected: {DISCO_INFO[home.disco].fullName}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(
                    [
                      'HESCO',
                      'LESCO',
                      'KElectric',
                      'IESCO',
                      'MEPCO',
                      'FESCO',
                      'GEPCO',
                      'SEPCO',
                      'PESCO',
                      'QESCO',
                    ] as DiscoProvider[]
                  ).map((disco) => {
                    const info = DISCO_INFO[disco];
                    const isSelected = home.disco === disco;
                    return (
                      <button
                        key={disco}
                        onClick={() => {
                          const newCity =
                            disco === 'HESCO'
                              ? 'Hyderabad'
                              : disco === 'LESCO'
                              ? 'Lahore'
                              : disco === 'KElectric'
                              ? 'Karachi'
                              : disco === 'IESCO'
                              ? 'Islamabad'
                              : disco === 'MEPCO'
                              ? 'Multan'
                              : disco === 'FESCO'
                              ? 'Faisalabad'
                              : disco === 'GEPCO'
                              ? 'Gujranwala'
                              : disco === 'SEPCO'
                              ? 'Sukkur'
                              : disco === 'PESCO'
                              ? 'Peshawar'
                              : 'Quetta';
                          setHome({ ...home, disco, city: newCity });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/15 text-amber-400 shadow-sm ring-1 ring-amber-400/30'
                            : isDark
                            ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight flex items-center justify-between">
                          <span>{info.name}</span>
                          {disco === 'HESCO' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-400 font-mono">
                              Sindh
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          {info.region}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Roof Mounting Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Roof Slab & Structure Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    { id: 'concrete_rcc_slab', label: 'RCC Concrete Slab (L2/L3)', sub: 'Most Common' },
                    { id: 'elevated_structure', label: 'Elevated Structure (8-10ft)', sub: 'Rooftop Usable' },
                    { id: 'corrugated_gi_shed', label: 'Industrial / GI Shed', sub: 'Flush Clamp' },
                    { id: 'tile_slanted', label: 'Slanted Tile Roof', sub: 'Custom Hook' },
                    { id: 'terrace_pergola', label: 'Solar Pergola Canopy', sub: 'Architectural' },
                  ].map((roof) => (
                    <button
                      key={roof.id}
                      onClick={() => setHome({ ...home, roofType: roof.id as RoofType })}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer min-h-[44px] flex flex-col justify-center ${
                        home.roofType === roof.id
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : isDark
                          ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                          : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{roof.label}</div>
                      <span className="text-[10px] text-amber-400/80 mt-0.5 block">{roof.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: SOLAR ARRAY RANGE & HARDWARE */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  System Capacity & Tier-1 Panels
                </h3>
                <p className="text-xs text-slate-400">
                  Select peak kilowatt range and certified Bloomberg Tier-1 modules
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Solar Capacity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">
                    Solar System Range (kW)
                  </label>
                  <div className="text-right">
                    <span className="font-mono text-xl font-bold text-amber-400">
                      {system.solarCapacityKw.toFixed(1)} kW
                    </span>
                    <span className="text-xs text-emerald-400 ml-2 font-mono">
                      ({financials.solarOffsetPercent}% Offset)
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="30.0"
                  step="0.5"
                  value={system.solarCapacityKw}
                  onChange={(e) => setSystem({ ...system, solarCapacityKw: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>3 kW (Small)</span>
                  <span>7 kW (10 Marla)</span>
                  <span>12 kW (1 Kanal)</span>
                  <span>20 kW (2 Kanal)</span>
                  <span>30 kW (Large)</span>
                </div>
              </div>

              {/* Panel Tier Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
                  Tier-1 Solar Photovoltaic Modules
                </label>
                <div className="space-y-2.5">
                  {(Object.keys(PANEL_SPECS) as PanelTier[]).map((tierKey) => {
                    const spec = PANEL_SPECS[tierKey];
                    const isSelected = system.panelTier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        onClick={() => setSystem({ ...system, panelTier: tierKey })}
                        className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10 shadow-md'
                            : isDark
                            ? 'border-slate-700/60 bg-slate-800/40 hover:border-slate-500'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>
                              {spec.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                              {spec.efficiency}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{spec.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="text-xs font-mono text-amber-400 font-bold block">
                            Rs. {spec.costPerWattPkr}/Watt
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inverter Choice */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Inverter Brand (Pakistan Market Approved)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(INVERTER_SPECS) as InverterTier[]).map((invKey) => {
                    const inv = INVERTER_SPECS[invKey];
                    const isSelected = system.inverterTier === invKey;
                    return (
                      <button
                        key={invKey}
                        onClick={() => setSystem({ ...system, inverterTier: invKey })}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10'
                            : isDark
                            ? 'border-slate-700/60 bg-slate-800/40'
                            : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold leading-snug">{inv.name}</div>
                        <span className="text-[10px] text-slate-400 mt-1 block">{inv.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: BATTERY RECOMMENDATIONS (User explicit: Crown, itel, etc.) */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Battery Recommendations (Crown, itel & Lithium)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Essential for load shedding protection and peak-hour zero tariff operation
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Loadshedding Backup
              </span>
            </div>

            <div className="space-y-3">
              {(Object.keys(BATTERY_SPECS) as BatteryPack[]).map((packKey) => {
                const bat = BATTERY_SPECS[packKey];
                const isSelected = system.batteryPack === packKey;
                return (
                  <button
                    key={packKey}
                    onClick={() => setSystem({ ...system, batteryPack: packKey })}
                    className={`w-full p-4 rounded-2xl text-left border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/10 shadow-md ring-1 ring-amber-400/40'
                        : isDark
                        ? 'border-slate-700/60 bg-slate-800/40 hover:border-slate-500'
                        : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold">{bat.name}</span>
                        {bat.capacityKwh > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono text-[11px] font-bold">
                            {bat.capacityKwh} kWh ({bat.type})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{bat.description}</p>
                    </div>

                    <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/40 flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {bat.costPkr > 0 ? `+Rs. ${bat.costPkr.toLocaleString()}` : 'Rs. 0'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {bat.backupHours > 0 ? `~${bat.backupHours}h Continuous` : 'Grid-Tied'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Cost & Financial Estimates in PKR */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-2xl ${
              isDark ? 'glass-card-dark border-amber-400/30' : 'glass-card-light border-amber-400/40'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
                  Pakistan Quotation Estimate
                </span>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Turnkey System Cost
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            {/* Price Line Items in PKR */}
            <div className="space-y-3 my-5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Tier-1 Panels & Inverter Hardware</span>
                <span className="font-mono font-bold text-slate-200">
                  Rs. {(system.solarCapacityKw * 1000 * PANEL_SPECS[system.panelTier].costPerWattPkr + system.solarCapacityKw * INVERTER_SPECS[system.inverterTier].costPerKwPkr).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Battery Backup (Crown / itel)</span>
                <span className="font-mono font-bold text-slate-200">
                  {BATTERY_SPECS[system.batteryPack].costPkr > 0
                    ? `Rs. ${BATTERY_SPECS[system.batteryPack].costPkr.toLocaleString()}`
                    : 'Rs. 0'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Heavy GI Structure & Copper Cabling</span>
                <span className="font-mono font-bold text-slate-200">
                  Rs. {(120000 + system.solarCapacityKw * 18000).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Earthing Bore Pit & Master Installation</span>
                <span className="font-mono font-bold text-slate-200">
                  Rs. {(65000 + system.solarCapacityKw * 8000).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>NEPRA Green Meter & Testing</span>
                <span className="font-mono font-bold text-emerald-400">
                  Rs. {financials.nepraNetMeteringFeePkr.toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex justify-between items-baseline">
                <span className="font-bold text-slate-100 text-base">Total Turnkey Price</span>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-amber-400 block">
                    Rs. {financials.grossSystemCostPkr.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({formatPkr(financials.grossSystemCostPkr)})
                  </span>
                </div>
              </div>
            </div>

            {/* Financing Toggle */}
            <div className="p-1 bg-slate-800/80 rounded-xl flex items-center mb-5 text-xs font-semibold">
              <button
                onClick={() => setSystem({ ...system, financingType: 'cash' })}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  system.financingType === 'cash'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cash Upfront
              </button>
              <button
                onClick={() => setSystem({ ...system, financingType: 'bank_islamic_solar' })}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  system.financingType === 'bank_islamic_solar'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Islamic Bank Solar Finance
              </button>
            </div>

            {/* Monthly Impact Highlight Box in PKR */}
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current WAPDA Bill:</span>
                <span className="font-mono text-slate-300 line-through">
                  Rs. {financials.currentMonthlyBillPkr.toLocaleString()}/mo
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">New Bill (with NEPRA Green Meter):</span>
                <span className="font-mono text-emerald-400 font-bold">
                  Rs. {financials.newMonthlyBillPkr.toLocaleString()}/mo
                </span>
              </div>

              {system.financingType === 'bank_islamic_solar' && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Bank Installment (3-5 Years):</span>
                  <span className="font-mono text-slate-200">
                    +Rs. {financials.monthlyLoanPaymentPkr.toLocaleString()}/mo
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-amber-400/20 flex justify-between items-center">
                <span className="font-bold text-xs text-white uppercase tracking-wide">
                  Monthly Money Saved
                </span>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  +Rs. {financials.netMonthlySavingsPkr.toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Long-Term Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-0.5">Payback Period</span>
                <span className="font-mono text-lg font-bold text-amber-400">
                  {financials.paybackPeriodYears} <span className="text-xs text-slate-400">Years</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-0.5">25-Yr Net Gain</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {formatPkr(financials.lifetime25YearSavingsPkr)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onOpenPdfModal}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-400/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Export Official Quotation (PDF)</span>
              </button>

              <button
                onClick={onNavigateToDashboard}
                className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:border-slate-600'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Track NEPRA & Project Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Floating Sticky Summary Bar (< 15% Viewport Cap) */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-30 pointer-events-none">
        <div className="pointer-events-auto max-w-lg mx-auto rounded-2xl px-4 py-2.5 shadow-2xl border border-amber-400/40 flex items-center justify-between backdrop-blur-xl bg-slate-950/95 text-white">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-amber-400">
                {system.solarCapacityKw.toFixed(1)} kW
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              <span className="font-mono text-xs font-bold text-white">
                {formatPkr(financials.grossSystemCostPkr)}
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Save +Rs. {financials.netMonthlySavingsPkr.toLocaleString()}/mo
            </div>
          </div>
          <button
            onClick={onOpenPdfModal}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap min-h-[38px] flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotation</span>
          </button>
        </div>
      </div>
    </section>
  );
};
