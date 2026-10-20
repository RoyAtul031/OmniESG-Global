import React from 'react';
import { ScopeSummary } from '../../types/esg';
import { Tenant } from '../../types/tenant';
import { TrendingDown, Zap, Droplets, Sun, Recycle, ShieldCheck } from 'lucide-react';

interface EsgOverviewProps {
  tenant: Tenant;
  summary: ScopeSummary;
  onNavigateToAudit: () => void;
}

export const EsgOverview: React.FC<EsgOverviewProps> = ({ tenant, summary, onNavigateToAudit }) => {
  return (
    <div className="space-y-6">
      {/* Executive Scope Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GHG Footprint */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Gross GHG Footprint</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                -12.4% vs FY22
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {summary.totalTco2e.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs text-slate-400 font-medium">tCO2e</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
            <span>2030 Target: {summary.target2030Tco2e.toLocaleString()} tCO2e</span>
            <span className="text-slate-400 font-medium">
              {((summary.totalTco2e / (summary.previousYearTotalTco2e || 1)) * 100).toFixed(0)}% of Baseline
            </span>
          </div>
        </div>

        {/* Scope 1 Direct */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Scope 1 (Direct Fuel & Gas)</span>
              <span className="text-slate-500 font-mono text-[11px]">Stationary & DG</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-amber-400 font-mono tabular-nums">
                {summary.scope1Tco2e.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs text-slate-400 font-medium">tCO2e</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Diesel Gensets & Chiller Fugitive</span>
            <span className="text-amber-400 font-mono">
              {((summary.scope1Tco2e / summary.totalTco2e) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>

        {/* Scope 2 Indirect */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Scope 2 (Purchased Electricity)</span>
              <span className="text-emerald-400 text-[11px] font-mono">Location-Based</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-cyan-400 font-mono tabular-nums">
                {summary.scope2Tco2e.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs text-slate-400 font-medium">tCO2e</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Market-Based: {summary.scope2MarketTco2e.toFixed(1)} tCO2e</span>
            <span className="text-cyan-400 font-mono">
              {((summary.scope2Tco2e / summary.totalTco2e) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>

        {/* Scope 3 Value Chain */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Scope 3 (Upstream & Travel)</span>
              <span className="text-slate-500 text-[11px]">Commuting & Waste</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-indigo-400 font-mono tabular-nums">
                {summary.scope3Tco2e.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs text-slate-400 font-medium">tCO2e</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Air Travel + Municipal Solid Waste</span>
            <span className="text-indigo-400 font-mono">
              {((summary.scope3Tco2e / summary.totalTco2e) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>
      </div>

      {/* Sustainability Efficiency Kpis Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        {/* Renewable Energy Mix */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Renewable Mix</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {summary.renewableEnergyPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Energy Intensity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Energy Intensity</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {summary.energyIntensityKwhPerSqFt.toFixed(2)}
              <span className="text-xs text-slate-400 font-sans ml-1">kWh/sq ft</span>
            </span>
          </div>
        </div>

        {/* Water Recycled */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Water Recycled</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {summary.waterRecycledPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Landfill Waste Diversion */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Waste Diverted</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {summary.wasteDiversionPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
