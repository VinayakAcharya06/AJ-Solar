import React, { useState, useEffect } from 'react';
import { HomeConfig, SystemConfig } from './types/solar';
import { calculateFinancials } from './utils/calculations';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { Configurator } from './components/Configurator';
import { EnergyFlowSimulator } from './components/EnergyFlowSimulator';
import { MonthlyComparisonChart } from './components/MonthlyComparisonChart';
import { Dashboard } from './components/Dashboard';
import { ProposalPdfModal } from './components/ProposalPdfModal';
import { Zap, Shield, Sun, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  // Pakistan Home configuration state (Default: 10 Marla home in Lahore under LESCO)
  const [home, setHome] = useState<HomeConfig>({
    homeSizeSqFt: 2250,
    plotSize: '10_marla',
    monthlyBill: 85000, // PKR (~1,300 units @ Rs. 65/unit)
    electricityRateKwh: 65, // PKR per unit including FCA & peak rates
    disco: 'LESCO',
    roofType: 'concrete_rcc_slab',
    sunExposure: 'full_unshaded',
    city: 'Lahore',
  });

  // Pakistan Solar & Battery System state (Default: 10 kW Longi + Inverex Nitrox + Crown 10kWh Lithium)
  const [system, setSystem] = useState<SystemConfig>({
    solarCapacityKw: 10.0,
    panelTier: 'longi_himo7',
    inverterTier: 'inverex_nitrox',
    batteryPack: 'crown_lifepo4_10kwh',
    financingType: 'cash',
    loanTermYears: 3,
    loanApr: 18.0,
  });

  // Calculate real-time financials and savings in PKR
  const financials = calculateFinancials(home, system);

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.className =
        'bg-[#0b1118] text-slate-100 font-sans selection:bg-[#fde047] selection:text-black overflow-x-hidden min-h-screen';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className =
        'bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#f59e0b] selection:text-white overflow-x-hidden min-h-screen';
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'hero-sky-gradient-dark' : 'hero-sky-gradient-light'
      }`}
    >
      {/* Fixed Glass Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenProposalModal={() => setShowPdfModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-4">
        {activeTab === 'overview' && (
          <>
            <HeroSection
              system={system}
              isDark={isDark}
              onNavigateToConfig={() => setActiveTab('configurator')}
              onNavigateToFlow={() => setActiveTab('energy-flow')}
            />

            {/* Quick Feature Previews on Overview Tab */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 pb-20 lg:pb-12 space-y-8 sm:space-y-12">
              <EnergyFlowSimulator system={system} isDark={isDark} />
              <Configurator
                home={home}
                setHome={setHome}
                system={system}
                setSystem={setSystem}
                financials={financials}
                isDark={isDark}
                onOpenPdfModal={() => setShowPdfModal(true)}
                onNavigateToDashboard={() => setActiveTab('dashboard')}
              />
              <MonthlyComparisonChart home={home} system={system} isDark={isDark} />
            </div>
          </>
        )}

        {activeTab === 'configurator' && (
          <div className="pt-16 sm:pt-20 pb-20 lg:pb-0">
            <Configurator
              home={home}
              setHome={setHome}
              system={system}
              setSystem={setSystem}
              financials={financials}
              isDark={isDark}
              onOpenPdfModal={() => setShowPdfModal(true)}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          </div>
        )}

        {activeTab === 'energy-flow' && (
          <div className="pt-16 sm:pt-20">
            <EnergyFlowSimulator system={system} isDark={isDark} />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="pt-16 sm:pt-20">
            <MonthlyComparisonChart home={home} system={system} isDark={isDark} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="pt-16 sm:pt-20">
            <Dashboard
              home={home}
              system={system}
              setSystem={setSystem}
              financials={financials}
              isDark={isDark}
              onOpenPdfModal={() => setShowPdfModal(true)}
              onNavigateToConfig={() => setActiveTab('configurator')}
            />
          </div>
        )}
      </main>

      {/* Proposal PDF Export Modal */}
      <ProposalPdfModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        home={home}
        system={system}
        financials={financials}
        isDark={isDark}
      />

      {/* Architectural Footer */}
      <footer
        className={`border-t py-12 px-4 sm:px-6 lg:px-8 transition-colors ${
          isDark
            ? 'bg-[#080d12] border-slate-800/80 text-slate-400'
            : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AJ
              </span>
              <span className="font-display font-medium text-lg text-amber-400 ml-1">
                Solar
              </span>
              <span className="text-[10px] font-mono text-emerald-400 ml-1.5 px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                Pakistan
              </span>
            </div>
            <span className="text-xs text-slate-500 ml-2">
              · AEDB & NEPRA Certified EPC Agency
            </span>
          </div>

          {/* Quick tab links */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('configurator')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Solar Configurator
            </button>
            <button
              onClick={() => setActiveTab('energy-flow')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Load Shedding Flow
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Bill Comparison
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              NEPRA Progress Tracker
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>AEDB V1 / NEPRA Certified</span>
            </span>
            <span>·</span>
            <span>25-Yr Performance Warranty</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            © {new Date().getFullYear()} AJ Solar Pakistan (Pvt.) Ltd. Authorized EPC partner for Longi, Jinko, Inverex, Crown Micro & itel Energy.
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPdfModal(true)}
              className="hover:text-amber-400 cursor-pointer"
            >
              Download Quotation (PDF)
            </button>
            <span>·</span>
            <button onClick={toggleTheme} className="hover:text-amber-400 cursor-pointer">
              {isDark ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
