import React, { useState } from 'react';
import { Sun, Moon, FileText, Zap, Menu, X, ArrowRight } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenProposalModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenProposalModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', desc: 'Hero & architectural model' },
    { id: 'configurator', label: 'Solar Configurator', desc: 'Custom kW, battery & PKR cost' },
    { id: 'energy-flow', label: 'Load Shedding & Flow', desc: 'Dynamic WAPDA & UPS animation' },
    { id: 'comparison', label: 'Bill Comparison', desc: '12-Month summer peak analysis' },
    { id: 'dashboard', label: 'NEPRA & Project Tracker', desc: '6-Phase milestone timeline' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none">
        <nav
          className={`pointer-events-auto max-w-6xl w-full h-14 sm:h-16 rounded-full px-4 sm:px-6 flex items-center justify-between shadow-2xl transition-all duration-300 ${
            isDark ? 'glass-nav-dark text-slate-100' : 'glass-nav-light text-slate-800'
          }`}
        >
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer whitespace-nowrap shrink-0 text-left min-h-[44px]"
            aria-label="AJ Solar Pakistan Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md transition-transform duration-300 group-hover:scale-105">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className={`font-display font-bold text-lg sm:text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AJ
              </span>
              <span className="font-display font-medium text-lg sm:text-xl text-amber-400 ml-1">
                Solar
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-emerald-400 ml-1 px-1 sm:px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                PK
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium tracking-wide">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap transition-colors duration-200 cursor-pointer min-h-[44px] flex items-center ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:text-amber-300'
                      : 'text-slate-600 hover:text-amber-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Desktop PDF Export Button */}
            <button
              onClick={onOpenProposalModal}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer min-h-[40px] ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/50 hover:text-amber-300'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Quotation</span>
            </button>

            {/* Primary Action Button (Desktop & Tablet) */}
            <button
              onClick={() => handleNavClick('configurator')}
              className="hidden md:inline-flex group relative items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-4 sm:px-5 rounded-full shadow-lg hover:shadow-amber-400/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap min-h-[40px]"
            >
              <span>Calculate Units</span>
              <Zap className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                mobileMenuOpen
                  ? 'bg-amber-400 text-slate-950'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-start pt-20 px-4 pb-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`w-full max-w-md mx-auto rounded-3xl p-5 shadow-2xl border transition-all ${
              isDark ? 'glass-card-dark border-slate-700/80 text-white' : 'glass-card-light border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/50">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Platform Navigation
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Pakistan Solar EPC
              </span>
            </div>

            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer min-h-[48px] ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : isDark
                        ? 'hover:bg-slate-800/70 text-slate-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div
                        className={`text-[11px] ${
                          isActive ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-2">
              <button
                onClick={() => {
                  onOpenProposalModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>Download Quotation PDF (PKR)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
