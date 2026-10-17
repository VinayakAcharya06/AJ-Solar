import React, { useState } from 'react';
import { HomeConfig, SystemConfig, FinancialBreakdown, ProposalInfo, DISCO_INFO } from '../types/solar';
import { PANEL_SPECS, BATTERY_SPECS, INVERTER_SPECS, formatPkr } from '../utils/calculations';
import { generateProposalPdf } from '../utils/pdfGenerator';
import { FileText, Download, CheckCircle, Zap, Shield, DollarSign, X } from 'lucide-react';

interface ProposalPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  home: HomeConfig;
  system: SystemConfig;
  financials: FinancialBreakdown;
  isDark: boolean;
}

export const ProposalPdfModal: React.FC<ProposalPdfModalProps> = ({
  isOpen,
  onClose,
  home,
  system,
  financials,
  isDark,
}) => {
  const [proposalInfo, setProposalInfo] = useState<ProposalInfo>({
    clientName: 'Mian Tariq Mahmood',
    clientEmail: 'tariq.mahmood@example.com',
    clientPhone: '+92 (300) 412-3456',
    propertyAddress: 'House 42-C, Street 14, DHA Phase 6',
    city: 'Lahore',
    discoConsumerNumber: '24-11234-9876543-U',
    notes: 'Requires 10 kW hybrid solar with Crown 10kWh lithium battery and NEPRA green meter.',
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      generateProposalPdf(proposalInfo, home, system, financials);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const panel = PANEL_SPECS[system.panelTier];
  const battery = BATTERY_SPECS[system.batteryPack];
  const inverter = INVERTER_SPECS[system.inverterTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-3xl my-auto rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl border transition-all max-h-[92vh] overflow-y-auto ${
          isDark
            ? 'bg-slate-900 text-slate-100 border-slate-700'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold font-display">Export Turnkey Solar Quotation (PDF)</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Official project proposal with NEPRA net metering, Tier-1 panels, and Crown/itel storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client & Address Form Inputs */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Client Full Name
            </label>
            <input
              type="text"
              value={proposalInfo.clientName}
              onChange={(e) => setProposalInfo({ ...proposalInfo, clientName: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
              placeholder="e.g. Mian Tariq Mahmood"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Site Address & City
            </label>
            <input
              type="text"
              value={proposalInfo.propertyAddress}
              onChange={(e) => setProposalInfo({ ...proposalInfo, propertyAddress: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
              placeholder="e.g. House 42-C, DHA Phase 6, Lahore"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={proposalInfo.clientPhone}
              onChange={(e) => setProposalInfo({ ...proposalInfo, clientPhone: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
              placeholder="+92 (300) 123-4567"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              DISCO Consumer Reference #
            </label>
            <input
              type="text"
              value={proposalInfo.discoConsumerNumber}
              onChange={(e) => setProposalInfo({ ...proposalInfo, discoConsumerNumber: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
              }`}
              placeholder="14-digit WAPDA / K-Electric Ref #"
            />
          </div>
        </div>

        {/* Summary Card Preview */}
        <div
          className={`p-5 rounded-2xl border space-y-4 mb-6 ${
            isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-700/50">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              Document Preview Summary
            </span>
            <span className="text-slate-400 font-mono">
              Utility: {DISCO_INFO[home.disco].name} ({DISCO_INFO[home.disco].region}) Net Metering
            </span>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Solar PV Array</span>
              <span className="font-bold text-amber-400 text-sm">
                {system.solarCapacityKw.toFixed(1)} kW DC Peak
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{panel.name}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Battery Storage</span>
              <span className="font-bold text-emerald-400 text-sm">
                {battery.capacityKwh > 0 ? `${battery.capacityKwh} kWh (${battery.type})` : 'On-Grid Only'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {battery.backupHours > 0 ? `~${battery.backupHours}h Load Shedding Backup` : 'No Storage'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Total Turnkey Price</span>
              <span className="font-bold text-white text-sm">
                Rs. {financials.grossSystemCostPkr.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                {formatPkr(financials.grossSystemCostPkr)}
              </span>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-amber-300">25-Year Estimated Financial Gain:</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Cumulative net savings of{' '}
                <strong className="text-emerald-400">
                  {formatPkr(financials.lifetime25YearSavingsPkr)}
                </strong>{' '}
                with estimated ROI payback in{' '}
                <strong className="text-amber-300">{financials.paybackPeriodYears} years</strong>.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Annual Solar Output</span>
              <span className="font-bold text-emerald-400">
                {financials.annualProductionUnits.toLocaleString()} Units/yr
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {downloadSuccess && (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Quotation PDF downloaded successfully! Check your downloads.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:shadow-lg hover:shadow-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Building PDF...' : 'Download Quotation PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
