import React, { useState } from 'react';
import { FacilityEntity } from '../../types/entity';
import { EmissionRecord } from '../../types/esg';
import { Zap, Fuel, Plane, Droplets, Sun, Building } from 'lucide-react';

interface EmissionBreakdownChartProps {
  facilities: FacilityEntity[];
  emissions: EmissionRecord[];
  onSelectFacility: (facId: string) => void;
}

export const EmissionBreakdownChart: React.FC<EmissionBreakdownChartProps> = ({
  facilities,
  emissions,
  onSelectFacility,
}) => {
  const [activeView, setActiveView] = useState<'BY_FACILITY' | 'BY_SOURCE'>('BY_FACILITY');

  // Compute source breakdowns
  const sourceTotals: Record<string, { label: string; tco2e: number; scope: string; icon: any }> = {
    ELECTRICITY: { label: 'Grid Electricity', tco2e: 0, scope: 'Scope 2', icon: Zap },
    DIESEL: { label: 'Diesel Genset Fuel', tco2e: 0, scope: 'Scope 1', icon: Fuel },
    SOLAR_OFFSET: { label: 'Solar PPA Offset', tco2e: 0, scope: 'Scope 2 (Market)', icon: Sun },
    TRAVEL: { label: 'Business Flights & Travel', tco2e: 0, scope: 'Scope 3', icon: Plane },
    WATER_WASTE: { label: 'Water & Effluent Loop', tco2e: 0, scope: 'Scope 3', icon: Droplets },
  };

  emissions.forEach(e => {
    if (e.activityType.includes('ELECTRICITY_GRID')) {
      sourceTotals.ELECTRICITY.tco2e += e.calculatedTco2e;
    } else if (e.activityType.includes('DIESEL')) {
      sourceTotals.DIESEL.tco2e += e.calculatedTco2e;
    } else if (e.activityType.includes('SOLAR')) {
      sourceTotals.SOLAR_OFFSET.tco2e += e.calculatedTco2e;
    } else if (e.activityType.includes('TRAVEL')) {
      sourceTotals.TRAVEL.tco2e += e.calculatedTco2e;
    } else {
      sourceTotals.WATER_WASTE.tco2e += e.calculatedTco2e;
    }
  });

  const totalSum = Object.values(sourceTotals).reduce((acc, curr) => acc + curr.tco2e, 0) || 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      {/* Header with Segmented View Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            GHG Inventory Distribution
          </h2>
          <span className="text-xs text-slate-400">
            Granular activity data calibrated against GHG Protocol standards
          </span>
        </div>

        {/* Interactive Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('BY_FACILITY')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeView === 'BY_FACILITY'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Facility Asset
          </button>
          <button
            onClick={() => setActiveView('BY_SOURCE')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeView === 'BY_SOURCE'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Activity Category
          </button>
        </div>
      </div>

      {activeView === 'BY_FACILITY' ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Facility Asset</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Floor Area</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Scope 1 (tCO2e)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Scope 2 (tCO2e)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Scope 3 (tCO2e)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Total (tCO2e)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Renewable %</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {facilities.map(f => {
                  const facilityTotal = f.scope1Tco2e + f.scope2Tco2e + f.scope3Tco2e;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => onSelectFacility(f.id)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          {f.name}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {f.code} · {f.city}, {f.country}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                        {f.grossFloorAreaSqFt.toLocaleString()} sq ft
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-400">
                        {f.scope1Tco2e.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-cyan-400">
                        {f.scope2Tco2e.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-indigo-400">
                        {f.scope3Tco2e.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white">
                        {facilityTotal.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">
                        {f.renewableEnergyPercent.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {f.reportingStatus === 'COMPLETE' ? 'Audited' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sourceTotals).map(([key, data]) => {
            const pct = ((data.tco2e / totalSum) * 100).toFixed(1);
            const Icon = data.icon;
            return (
              <div key={key} className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-white">{data.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{data.scope}</span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-xl font-bold text-white font-mono tabular-nums">
                    {data.tco2e.toFixed(1)} <span className="text-xs font-sans text-slate-400">tCO2e</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-medium">{pct}%</span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
