import React, { useState } from 'react';
import { SystemConfig, FinancialBreakdown, InstallationStage } from '../types/solar';
import { formatPkr } from '../utils/calculations';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Zap,
  DollarSign,
  TreePine,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  HardHat,
  MapPin,
} from 'lucide-react';

interface DashboardProps {
  system: SystemConfig;
  financials: FinancialBreakdown;
  isDark: boolean;
  onOpenPdfModal: () => void;
  onNavigateToConfig: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  system,
  financials,
  isDark,
  onOpenPdfModal,
  onNavigateToConfig,
}) => {
  const [activeStageId, setActiveStageId] = useState<number>(3);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  const stages: InstallationStage[] = [
    {
      id: 1,
      title: '3D LIDAR Roof Audit & Structural Load Analysis',
      subtitle: 'Drone scan, shadow profiling, and RCC roof slab structural load certification.',
      status: 'completed',
      estimatedDate: 'Oct 02, 2026',
      completionPercentage: 100,
      details: 'Passed structural engineering review. Hot-dip galvanized structure orientation mapped for zero parapet shade.',
    },
    {
      id: 2,
      title: 'AEDB Certified Engineering Dossier & Single-Line Diagram',
      subtitle: 'Electrical schematics and technical submittal for utility load approval.',
      status: 'completed',
      estimatedDate: 'Oct 06, 2026',
      completionPercentage: 100,
      details: 'Engineering dossier stamped by PEC licensed professional electrical engineer.',
    },
    {
      id: 3,
      title: 'DISCO SDO Inspection & Net Metering Feasibility (NOC)',
      subtitle: 'Grid operator sub-divisional officer site inspection & transformer capacity check.',
      status: 'in_progress',
      estimatedDate: 'Oct 14, 2026',
      completionPercentage: 85,
      details: 'Transformer capacity verified within 80% limit. NOC issued for bidirectional green meter.',
    },
    {
      id: 4,
      title: 'Tier-1 Hardware Staging & Dispatch',
      subtitle: 'Longi / Jinko modules, hybrid inverter & Crown/itel lithium battery dispatched.',
      status: 'scheduled',
      estimatedDate: 'Oct 18, 2026',
      completionPercentage: 0,
      details: 'Hardware stored and quality-inspected at regional central warehouse.',
    },
    {
      id: 5,
      title: 'Certified Master Electrician Installation & Earthing Bore',
      subtitle: 'Rooftop mounting, DC cabling, dual copper earthing bore pit, and hybrid inverter wiring.',
      status: 'pending',
      estimatedDate: 'Oct 21, 2026',
      completionPercentage: 0,
      details: 'Certified solar technicians assigned. Includes AC/DC surge protection installation.',
    },
    {
      id: 6,
      title: 'NEPRA Bi-Directional Green Meter Commissioning',
      subtitle: 'Testing & commissioning with DISCO M&T team and official activation of net metering.',
      status: 'pending',
      estimatedDate: 'Oct 25, 2026',
      completionPercentage: 0,
      details: 'Green meter installed. Official net metering billing commences.',
    },
  ];

  const overallProgress = Math.round(
    stages.reduce((acc, stage) => acc + stage.completionPercentage, 0) / stages.length
  );

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-2">
            <HardHat className="w-3.5 h-3.5" />
            <span>AJ Solar Pakistan EPC Portal</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            NEPRA Net Metering & Installation Tracker
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time transparency from initial shadow audit to NEPRA green meter energization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowContactModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Project Manager Hotline</span>
          </button>
          <button
            onClick={onOpenPdfModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Quotation</span>
          </button>
        </div>
      </div>

      {/* TOP ROW: Telemetry & Savings in PKR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div
          className={`p-5 rounded-3xl border shadow-lg ${
            isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Annual Solar Gen</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400">
            {financials.annualProductionUnits.toLocaleString()}{' '}
            <span className="text-xs font-sans text-slate-400">Units/yr</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Covers {financials.solarOffsetPercent}% of total household electricity
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-lg ${
            isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Monthly Money Saved</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            +Rs. {financials.netMonthlySavingsPkr.toLocaleString()}{' '}
            <span className="text-xs font-sans text-slate-400">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            25-Yr Net Gain: {formatPkr(financials.lifetime25YearSavingsPkr)}
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-lg ${
            isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Carbon Offset</span>
            <TreePine className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {financials.carbonOffsetTonsAnnual}{' '}
            <span className="text-xs font-sans text-slate-400">Tons CO₂</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Clean energy protecting Pakistan’s environment
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-lg ${
            isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">System Warranty</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold font-mono text-sky-400">
            25 Years <span className="text-xs font-sans text-slate-400">Linear</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tier-1 Performance Guarantee
          </p>
        </div>
      </div>

      {/* SECTION: INSTALLATION PROGRESS TIMELINE */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
              Project Execution Status
            </span>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              NEPRA Green Meter & EPC Milestones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Project Ref: #AJS-PK-774902 · Sized: {system.solarCapacityKw.toFixed(1)} kW DC Peak Hybrid
            </p>
          </div>

          <div className="text-right sm:w-64">
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-300">Commissioning Progress</span>
              <span className="text-amber-400 font-mono">{overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${overallProgress}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isSelected = activeStageId === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Phase 0{stage.id}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3" />
                        In Progress ({stage.completionPercentage}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {stage.status === 'scheduled' ? 'Scheduled' : 'Upcoming'}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{stage.estimatedDate}</span>
                  </span>
                  <span className="font-bold text-amber-400 hover:underline">
                    View Dossier →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Phase Detail Callout */}
        {activeStageId && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">
                  Phase 0{activeStageId} Inspection Status:
                </span>
                <span className="text-slate-400">
                  {stages.find((s) => s.id === activeStageId)?.details}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-amber-400 font-semibold hover:underline shrink-0 text-left sm:text-right cursor-pointer"
            >
              Request SDO Inspection Report
            </button>
          </div>
        )}
      </div>

      {/* Engineer Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
              isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <h3 className="text-lg font-bold">AJ Solar Pakistan Engineering Desk</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="my-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  EA
                </div>
                <div>
                  <h4 className="font-bold text-sm">Engr. Asadullah Khan, P.E.</h4>
                  <p className="text-xs text-slate-400">Lead Solar EPC & Net Metering Specialist</p>
                  <p className="text-xs text-emerald-400">PEC Reg: #ELECT-48219 (AEDB Certified)</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Helpline / WhatsApp: +92 (300) 845-SOLAR</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Desk: projects@ajsolar.pk</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Main Office: DHA Phase 5, Lahore · Blue Area, Islamabad</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer hover:bg-amber-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
