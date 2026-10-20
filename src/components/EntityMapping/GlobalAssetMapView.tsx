import React, { useState } from 'react';
import { FacilityEntity } from '../../types/entity';
import { Tenant } from '../../types/tenant';
import {
  MapPin,
  Building2,
  Gauge,
  Sparkles,
  Zap,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface GlobalAssetMapViewProps {
  tenant: Tenant;
  facilities: FacilityEntity[];
  onSelectFacility: (facility: FacilityEntity) => void;
}

export const GlobalAssetMapView: React.FC<GlobalAssetMapViewProps> = ({
  tenant,
  facilities,
  onSelectFacility,
}) => {
  const [hoveredFacility, setHoveredFacility] = useState<FacilityEntity | null>(null);

  // Approximate relative percentages on a world map projection (X: 0-100%, Y: 0-100%)
  const getCoordinates = (fac: FacilityEntity) => {
    const lat = Number(fac.latitude ?? 0);
    const lon = Number(fac.longitude ?? 0);

    if (lat !== 0 && lon !== 0) {
      // Standard Equirectangular projection mapping to 0-100%
      const x = ((lon + 180) / 360) * 100;
      const y = ((90 - lat) / 180) * 100;
      return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
    }

    // Default city fallback coordinates
    const city = (fac.city || '').toLowerCase();
    if (city.includes('new york')) return { x: 26, y: 34 };
    if (city.includes('san francisco')) return { x: 17, y: 36 };
    if (city.includes('london')) return { x: 48, y: 28 };
    if (city.includes('frankfurt')) return { x: 51, y: 29 };
    if (city.includes('bengaluru') || city.includes('bangalore')) return { x: 71, y: 53 };
    if (city.includes('pune')) return { x: 70, y: 51 };
    if (city.includes('hong kong')) return { x: 79, y: 46 };
    if (city.includes('tokyo')) return { x: 86, y: 38 };
    if (city.includes('singapore')) return { x: 77, y: 58 };
    return { x: 50, y: 50 };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Map Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-tight">
            Geographic Asset Distribution Radar
          </span>
          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            {facilities.length} Active Nodes
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Telemetry Grid
          </span>
        </div>
      </div>

      {/* Interactive World Map Canvas */}
      <div className="relative w-full h-[440px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* SVG World Map Grid Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Subtle Latitude/Longitude Markers */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
        </svg>

        {/* Continents Outline (Simplified Global Silhouette) */}
        <div className="absolute inset-x-8 inset-y-12 border border-slate-800/60 rounded-2xl pointer-events-none flex items-center justify-center">
          <span className="text-[90px] font-extrabold text-slate-900/50 font-mono tracking-widest select-none pointer-events-none">
            GLOBAL ESG
          </span>
        </div>

        {/* Facility Radar Pins */}
        {facilities.map(facility => {
          const coords = getCoordinates(facility);
          const isHovered = hoveredFacility?.id === facility.id;
          const s1 = Number(facility.scope1Tco2e ?? (facility as any).scope1_tco2e ?? 0);
          const s2 = Number(facility.scope2Tco2e ?? (facility as any).scope2_tco2e ?? 0);
          const s3 = Number(facility.scope3Tco2e ?? (facility as any).scope3_tco2e ?? 0);
          const totalTco2e = s1 + s2 + s3;
          const renPercent = Number(facility.renewableEnergyPercent ?? (facility as any).renewable_energy_percent ?? 50);

          return (
            <div
              key={facility.id}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              onClick={() => onSelectFacility(facility)}
              onMouseEnter={() => setHoveredFacility(facility)}
              onMouseLeave={() => setHoveredFacility(null)}
            >
              {/* Radar pulse ring */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-20" />
                <div
                  className={`relative w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                    isHovered
                      ? 'bg-emerald-400 border-white scale-125 shadow-lg shadow-emerald-500/50'
                      : renPercent > 50
                      ? 'bg-emerald-500 border-emerald-300'
                      : 'bg-amber-500 border-amber-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>
              </div>

              {/* Pin Label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-5 transition-all pointer-events-none whitespace-nowrap ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-70 group-hover:opacity-100'
                }`}
              >
                <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-white shadow-md block">
                  {facility.code} · {facility.city}
                </span>
              </div>

              {/* Hover Tooltip Card */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-50 w-64 p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto animate-in zoom-in-95 duration-150">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400">{facility.code}</span>
                      <h4 className="text-xs font-bold text-white leading-tight">{facility.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {facility.country}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-950/70 p-2 rounded-lg border border-slate-800 mb-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Carbon</span>
                      <span className="font-mono font-bold text-white">{totalTco2e.toFixed(1)} t</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Renewable</span>
                      <span className="font-mono font-bold text-emerald-400">{renPercent.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-400 flex items-center justify-between font-medium">
                    <span>Click to inspect telemetry</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Asset Summary Bottom Bar */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300" />
            <span>High Renewable (&gt;50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-300" />
            <span>Transition / Baseline</span>
          </div>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Operational Region: <strong className="text-white">{tenant.region || 'Multinational Scope'}</strong>
        </div>
      </div>
    </div>
  );
};
