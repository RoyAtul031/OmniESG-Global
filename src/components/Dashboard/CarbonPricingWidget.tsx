import React, { useState } from 'react';
import { Tenant } from '../../types/tenant';
import { ScopeSummary } from '../../types/esg';
import { DollarSign, TrendingDown, ShieldAlert, Sparkles, Sliders, ArrowUpRight } from 'lucide-react';

interface CarbonPricingWidgetProps {
  tenant: Tenant;
  summary: ScopeSummary;
}

export const CarbonPricingWidget: React.FC<CarbonPricingWidgetProps> = ({ tenant, summary }) => {
  // Default internal carbon shadow fee per tCO2e ($85 default, or equivalent in enterprise currency)
  const [carbonFeePerTon, setCarbonFeePerTon] = useState<number>(85);

  const totalTco2e = summary.totalTco2e || 0;
  const scope1Tco2e = summary.scope1Tco2e || 0;
  const scope2Tco2e = summary.scope2Tco2e || 0;
  const scope3Tco2e = summary.scope3Tco2e || 0;

  // Currency symbol extractor
  const currencyMatch = (tenant.currency || 'USD ($)').match(/\((.*?)\)/);
  const currencySymbol = currencyMatch ? currencyMatch[1] : '$';

  // Compute fiscal exposure
  const totalLiability = totalTco2e * carbonFeePerTon;
  const scope1Liability = scope1Tco2e * carbonFeePerTon;
  const scope2Liability = scope2Tco2e * carbonFeePerTon;
  const targetSavings = totalLiability * ((Number(tenant.targetReductionPercent) || 40) / 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Internal Carbon Shadow Fee & Financial Exposure
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              TCFD / EU ETS Aligned
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise shadow carbon pricing model evaluating capital liability across GHG Protocol operational boundaries.
          </p>
        </div>

        {/* Fee Slider Control */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-3">
          <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Internal Fee:</span>
            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={carbonFeePerTon}
              onChange={e => setCarbonFeePerTon(Number(e.target.value))}
              className="w-24 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
            <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
              {currencySymbol}{carbonFeePerTon} <span className="text-[10px] text-slate-500 font-sans">/tCO2e</span>
            </span>
          </div>
        </div>
      </div>

      {/* Financial Exposure Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Total Annual Carbon Liability */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Carbon Liability</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{tenant.reportingYear}</span>
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            {currencySymbol}{totalLiability.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Based on {totalTco2e.toLocaleString(undefined, { maximumFractionDigits: 1 })} gross tCO2e
          </div>
        </div>

        {/* Scope 1 Direct Combustion Risk */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Direct Fuel / Genset Levy</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tracking-tight">
            {currencySymbol}{scope1Liability.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Scope 1 direct stationary emissions
          </div>
        </div>

        {/* Scope 2 Grid Electricity Tariff Risk */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Grid Power Carbon Fee</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 tracking-tight">
            {currencySymbol}{scope2Liability.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Scope 2 location/market power purchases
          </div>
        </div>

        {/* Net-Zero Target Value at Stake */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1 font-medium">
            <span>Net-Zero Value at Stake</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight">
            +{currencySymbol}{targetSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Annual savings at {tenant.targetReductionPercent}% 2030 target
          </div>
        </div>
      </div>
    </div>
  );
};
