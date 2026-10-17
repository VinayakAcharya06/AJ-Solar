import React, { useState } from 'react';
import { HomeConfig, SystemConfig } from '../types/solar';
import { generateMonthlyComparison, formatPkr } from '../utils/calculations';
import { BarChart3, TrendingUp, Zap, DollarSign, Calendar, Info } from 'lucide-react';

interface MonthlyComparisonChartProps {
  home: HomeConfig;
  system: SystemConfig;
  isDark: boolean;
}

export const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({
  home,
  system,
  isDark,
}) => {
  const [chartView, setChartView] = useState<'energy' | 'cost'>('cost');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const monthlyData = generateMonthlyComparison(home, system);

  const maxUnits = Math.max(...monthlyData.map((d) => Math.max(d.solarProductionUnits, d.homeConsumptionUnits))) * 1.15;
  const maxPkr = Math.max(...monthlyData.map((d) => Math.max(d.billBeforeSolarPkr, d.billAfterSolarPkr))) * 1.2;

  const totalSolarAnnual = monthlyData.reduce((acc, d) => acc + d.solarProductionUnits, 0);
  const totalHomeAnnual = monthlyData.reduce((acc, d) => acc + d.homeConsumptionUnits, 0);
  const totalSavingsAnnual = monthlyData.reduce((acc, d) => acc + d.netSavingsPkr, 0);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>NEPRA Net Metering Bill Analytics</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Monthly WAPDA Bill vs Solar Generation
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare heavy summer air-conditioning peak units against high solar yield in {home.city || 'Pakistan'}.
          </p>
        </div>

        {/* View toggle button */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => setChartView('cost')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartView === 'cost'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WAPDA Bills (PKR)
          </button>
          <button
            onClick={() => setChartView('energy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartView === 'energy'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Units Profile (kWh)
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span>Annual Solar Units</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
            {totalSolarAnnual.toLocaleString()} <span className="text-xs font-sans text-slate-400">Units</span>
          </div>
          <span className="text-[11px] text-slate-400">Exported & consumed units</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-400 mb-1">
            <span>Home Units Needed</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
            {totalHomeAnnual.toLocaleString()} <span className="text-xs font-sans text-slate-400">Units</span>
          </div>
          <span className="text-[11px] text-slate-400">Annual household demand</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span>Annual PKR Saved</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {formatPkr(totalSavingsAnnual)}
          </div>
          <span className="text-[11px] text-slate-400">Direct money kept in pocket</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
            <span>Solar Offset Ratio</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">
            {Math.round((totalSolarAnnual / totalHomeAnnual) * 100)}%
          </div>
          <span className="text-[11px] text-slate-400">Surplus credits banked with {home.disco}</span>
        </div>
      </div>

      {/* SVG Interactive Chart Stage */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'glass-card-dark border-slate-700/60' : 'glass-card-light border-slate-200'
        }`}
      >
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 sm:gap-6 mb-4 sm:mb-6 text-xs font-semibold">
          {chartView === 'energy' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                <span className="text-slate-300">Solar Units</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-sky-400" />
                <span className="text-slate-300">Home Units</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400" />
                <span className="text-slate-300">WAPDA Bill Before</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Bill After Net Metering</span>
              </div>
            </>
          )}
        </div>

        {/* 12-Month Bar Chart */}
        <div className="grid grid-cols-12 gap-1 xs:gap-1.5 sm:gap-4 h-64 sm:h-72 items-end pt-6 sm:pt-8 pb-3 sm:pb-4 border-b border-slate-700/50">
          {monthlyData.map((d, idx) => {
            const isHovered = hoveredMonth === idx;
            const bar1Height =
              chartView === 'energy'
                ? Math.round((d.solarProductionUnits / maxUnits) * 100)
                : Math.round((d.billBeforeSolarPkr / maxPkr) * 100);

            const bar2Height =
              chartView === 'energy'
                ? Math.round((d.homeConsumptionUnits / maxUnits) * 100)
                : Math.round((d.billAfterSolarPkr / maxPkr) * 100);

            return (
              <div
                key={d.month}
                onMouseEnter={() => setHoveredMonth(idx)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => setHoveredMonth(isHovered ? null : idx)}
                className="relative flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-26 z-30 min-w-[140px] xs:min-w-[160px] p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-2xl border border-amber-400/40 pointer-events-none transform -translate-x-1/2 left-1/2">
                    <div className="font-bold text-amber-400 mb-1">{d.month} Breakdown</div>
                    {chartView === 'energy' ? (
                      <>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-400">Solar Gen:</span>
                          <span className="font-mono text-amber-300 font-bold">
                            {d.solarProductionUnits} Units
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-400">Home Need:</span>
                          <span className="font-mono text-sky-300">{d.homeConsumptionUnits} Units</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-400">Old Bill:</span>
                          <span className="font-mono text-rose-300">
                            Rs. {d.billBeforeSolarPkr.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-400">New Bill:</span>
                          <span className="font-mono text-emerald-300">
                            Rs. {d.billAfterSolarPkr.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2 pt-1 border-t border-slate-700 text-emerald-400 font-bold">
                          <span>PKR Saved:</span>
                          <span>+Rs. {d.netSavingsPkr.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Bars */}
                <div className="flex items-end gap-0.5 sm:gap-1 w-full justify-center h-full">
                  <div
                    style={{ height: `${bar1Height}%` }}
                    className={`w-1.5 xs:w-2 sm:w-4 rounded-t-xs sm:rounded-t-sm transition-all duration-300 ${
                      chartView === 'energy'
                        ? isHovered
                          ? 'bg-amber-300 shadow-lg shadow-amber-400/50 scale-y-105'
                          : 'bg-amber-400'
                        : isHovered
                        ? 'bg-rose-400 shadow-lg'
                        : 'bg-rose-500/80'
                    }`}
                  />
                  <div
                    style={{ height: `${bar2Height}%` }}
                    className={`w-1.5 xs:w-2 sm:w-4 rounded-t-xs sm:rounded-t-sm transition-all duration-300 ${
                      chartView === 'energy'
                        ? isHovered
                          ? 'bg-sky-300 shadow-lg shadow-sky-400/50 scale-y-105'
                          : 'bg-sky-500/80'
                        : isHovered
                        ? 'bg-emerald-300 shadow-lg'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>

                <span
                  className={`mt-1.5 sm:mt-2 text-[9px] xs:text-[10px] sm:text-xs font-medium truncate ${
                    isHovered ? 'text-amber-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Peak summer sun in May–August produces huge surplus units that offset expensive air-conditioning bills through NEPRA bidirectional accounting.
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold shrink-0">
            {home.disco} Net Metering Model
          </span>
        </div>
      </div>
    </section>
  );
};
