import React, { useState } from 'react';
import { SystemConfig, FinancialBreakdown, HomeConfig } from '../types/solar';
import { formatPkr } from '../utils/calculations';
import {
  CheckCircle2,
  Clock,
  Zap,
  DollarSign,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  Send,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  system: SystemConfig;
  financials: FinancialBreakdown;
  isDark: boolean;
  onOpenPdfModal: () => void;
  onNavigateToConfig: () => void;
  home?: HomeConfig;
  setSystem?: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  system,
  financials,
  isDark,
  onOpenPdfModal,
  onNavigateToConfig,
  home,
  setSystem,
}) => {
  // Contact & Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [disco, setDisco] = useState(home?.disco || 'LESCO');
  const [city, setCity] = useState(home?.city || 'Lahore');
  const [message, setMessage] = useState(
    `Hello Engr. Vinayak, I would like to request an official quotation and site audit for a ${system.solarCapacityKw.toFixed(
      1
    )} kW solar system with NEPRA green meter.`
  );
  const [isCopied, setIsCopied] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Simple Tracker State
  const [trackingRef, setTrackingRef] = useState('AJS-PK-774902');
  const [activeStep, setActiveStep] = useState<number>(3); // Phase 3 in progress

  // Engineer Details
  const engineer = {
    name: 'Engr. Vinayak',
    email: 'vinayakacharya376@gmail.com',
    phone: '+92 (300) 845-7652',
    role: 'Lead Solar EPC & NEPRA Net Metering Specialist',
    pecNumber: 'PEC Reg: #ELECT-774902 · AEDB V1 Certified',
    office: 'DHA Phase 5, Lahore · Blue Area, Islamabad (Nationwide Net Metering)',
  };

  // Quick system capacity selector
  const handleCapacitySelect = (kw: number) => {
    if (setSystem) {
      setSystem((prev) => ({
        ...prev,
        solarCapacityKw: kw,
      }));
      setMessage(
        `Hello Engr. Vinayak, I would like to request an official quotation and site audit for a ${kw} kW solar system with NEPRA green meter.`
      );
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(engineer.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Solar Quotation & NEPRA Net Metering Inquiry - ${clientName || 'Homeowner'}`
    );
    const body = encodeURIComponent(
      `Dear ${engineer.name},\n\n${message}\n\nContact Details:\nName: ${
        clientName || 'Not specified'
      }\nPhone / WhatsApp: ${clientPhone || 'Not specified'}\nCity / DISCO: ${city} (${disco})\n\nRequested System: ${system.solarCapacityKw.toFixed(
        1
      )} kW Turnkey System\nEstimated Investment: Rs. ${financials.grossSystemCostPkr.toLocaleString()}\nProject Ref: ${trackingRef}\n\nLooking forward to your technical response.\nBest regards,\n${clientName || 'Homeowner'}`
    );
    window.open(`mailto:${engineer.email}?subject=${subject}&body=${body}`, '_blank');
    setInquirySent(true);
  };

  const nepraStages = [
    {
      step: 1,
      title: 'Site Audit & Single-Line Diagram',
      desc: '3D shadow profiling, roof load verification, and electrical schematics approved by Engr. Vinayak.',
      status: 'completed',
      date: 'Oct 02, 2026',
    },
    {
      step: 2,
      title: 'DISCO Feasibility & Net Metering NOC',
      desc: 'SDO inspection and 80% transformer threshold clearance for bi-directional green meter.',
      status: 'completed',
      date: 'Oct 08, 2026',
    },
    {
      step: 3,
      title: 'Hardware Staging & Earthing Installation',
      desc: 'Tier-1 modules mounting, dual copper earthing bore pit, and hybrid inverter commissioning.',
      status: 'in_progress',
      date: 'In Progress (Oct 16, 2026)',
    },
    {
      step: 4,
      title: 'NEPRA Green Meter Energization',
      desc: 'Bi-directional meter installation and testing with DISCO M&T team. Meter starts spinning backwards.',
      status: 'upcoming',
      date: 'Est: Oct 24, 2026',
    },
  ];

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-700/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEPRA Net Metering & EPC Quotation Desk</span>
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            NEPRA & Project Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simple and interactive hub for turnkey solar quotations, project milestone tracking, and direct consultation with{' '}
            <strong className="text-amber-400 font-medium">{engineer.name}</strong>.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`mailto:${engineer.email}?subject=Solar Quotation Inquiry for Engr. Vinayak`}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Engineer</span>
          </a>
          <button
            onClick={onOpenPdfModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Quotation (PDF)</span>
          </button>
        </div>
      </div>

      {/* TWO PRIMARY PILLARS: THE QUOTATION & THE CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* PILLAR 1: INTERACTIVE SOLAR QUOTATION (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/15 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Turnkey Solar Quotation
                    </h2>
                    <p className="text-xs text-slate-400">
                      Certified by {engineer.name} · AEDB V1 & NEPRA Net Metering Standards
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/25">
                  Ref: {trackingRef}
                </span>
              </div>

              {/* Interactive Sizing Pills */}
              <div className="my-5">
                <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                  Select System Capacity to Update Quotation:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((kw) => {
                    const isSelected = Math.round(system.solarCapacityKw) === kw;
                    return (
                      <button
                        key={kw}
                        onClick={() => handleCapacitySelect(kw)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                            : isDark
                            ? 'bg-slate-800/70 text-slate-300 border-slate-700 hover:border-slate-500'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {kw} kW Peak
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Pricing Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                    <span className="font-semibold">Turnkey Cost</span>
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-400">
                    Rs. {financials.grossSystemCostPkr.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {formatPkr(financials.grossSystemCostPkr)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
                    <span className="font-semibold">Monthly Savings</span>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    +Rs. {financials.netMonthlySavingsPkr.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Save Rs. {(financials.netMonthlySavingsPkr * 12).toLocaleString()}/yr
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-sky-400 mb-1">
                    <span className="font-semibold">Payback ROI</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold font-mono text-sky-400">
                    {financials.paybackPeriodYears} Years
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    25-Yr: {formatPkr(financials.lifetime25YearSavingsPkr)}
                  </span>
                </div>
              </div>

              {/* Hardware Bill of Materials Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                  <span className="text-slate-400">Tier-1 Solar Modules</span>
                  <span className="font-bold text-slate-200">
                    {system.solarCapacityKw.toFixed(1)} kW DC ({Math.round(system.solarCapacityKw * 1.7)} Panels)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                  <span className="text-slate-400">Smart Inverter & MPPT</span>
                  <span className="font-bold text-slate-200">
                    {system.solarCapacityKw.toFixed(0)} kW Dual MPPT Hybrid (IP65)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                  <span className="text-slate-400">NEPRA Green Meter & Testing</span>
                  <span className="font-bold text-amber-400">
                    Rs. {financials.nepraNetMeteringFeePkr.toLocaleString()} (Included)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                  <span className="text-slate-400">Mounting & Earthing</span>
                  <span className="font-bold text-emerald-400">
                    Hot-Dip Galvanized + Dual Copper Pit
                  </span>
                </div>
              </div>
            </div>

            {/* Quotation Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-700/50 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenPdfModal}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF Quotation</span>
              </button>
              <button
                onClick={onNavigateToConfig}
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Customize in Configurator</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* PILLAR 2: DIRECT ENGINEER CONTACT DESK (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between ${
              isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
            }`}
          >
            {/* Engineer Profile Header */}
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg">
                      EV
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online & Available" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {engineer.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">{engineer.role}</p>
                    <p className="text-[11px] text-slate-400">{engineer.pecNumber}</p>
                  </div>
                </div>
              </div>

              {/* Direct Info Pills */}
              <div className="my-4 space-y-2 text-xs">
                {/* Email Item */}
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <a
                      href={`mailto:${engineer.email}`}
                      className="hover:text-amber-400 hover:underline truncate font-mono text-[11px]"
                    >
                      {engineer.email}
                    </a>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Copy Email"
                  >
                    {isCopied ? (
                      <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono text-[11px]">{engineer.phone}</span>
                  </div>
                  <a
                    href={`tel:${engineer.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-[11px] text-amber-400 font-semibold hover:underline"
                  >
                    Call Now
                  </a>
                </div>

                {/* Location Item */}
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-2 text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{engineer.office}</span>
                </div>
              </div>

              {/* Interactive Quotation & Consultation Form */}
              <form onSubmit={handleSendEmail} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Tariq Mahmood"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                      isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+92 (300) 123-4567"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                        isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                      City & DISCO
                    </label>
                    <input
                      type="text"
                      value={`${city} (${disco})`}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lahore (LESCO)"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                        isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                    Requirement / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none ${
                      isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                {inquirySent && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Inquiry email opened for {engineer.name}! We will review your site dossier promptly.</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to {engineer.name}</span>
                  </button>

                  <a
                    href={`https://wa.me/923008457652?text=${encodeURIComponent(
                      `Hello Engr. Vinayak, I am interested in a ${system.solarCapacityKw.toFixed(
                        1
                      )} kW solar system with NEPRA Net Metering. Please share the details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center cursor-pointer"
                    title="Direct WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SIMPLE & INTERACTIVE NEPRA PROGRESS TRACKER */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
              NEPRA Green Meter Application Tracker
            </span>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              4-Phase Net Metering Execution Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track project progress from engineering single-line diagram to official green meter energization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ref #:</span>
            <input
              type="text"
              value={trackingRef}
              onChange={(e) => setTrackingRef(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border focus:ring-1 focus:ring-amber-400 focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-400 font-bold' : 'bg-slate-100 border-slate-300'
              }`}
            />
          </div>
        </div>

        {/* 4 Interactive Phase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {nepraStages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isSelected = activeStep === stage.step;

            return (
              <div
                key={stage.step}
                onClick={() => setActiveStep(stage.step)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Phase 0{stage.step}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{stage.desc}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{stage.date}</span>
                  </span>
                  <span className="text-amber-400 font-bold hover:underline">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200">
                Phase 0{activeStep} Active Dossier:
              </span>{' '}
              <span className="text-slate-400">
                Supervised & stamped by {engineer.name}. Contact our desk for DISCO submission receipts.
              </span>
            </div>
          </div>
          <a
            href={`mailto:${engineer.email}?subject=Status inquiry for Phase ${activeStep} - Ref ${trackingRef}`}
            className="text-amber-400 font-semibold hover:underline shrink-0 text-left sm:text-right"
          >
            Ask {engineer.name} about this Phase →
          </a>
        </div>
      </div>
    </section>
  );
};
