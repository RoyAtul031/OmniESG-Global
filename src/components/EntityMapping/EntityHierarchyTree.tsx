import React, { useState } from 'react';
import { FacilityEntity } from '../../types/entity';
import { Tenant } from '../../types/tenant';
import { User } from '../../types/rbac';
import { GlobalAssetMapView } from './GlobalAssetMapView';
import {
  Building2,
  MapPin,
  Users,
  Gauge,
  Plus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Lock,
  LayoutGrid,
  Globe,
} from 'lucide-react';

interface EntityHierarchyTreeProps {
  tenant: Tenant;
  facilities: FacilityEntity[];
  activeUser: User;
  onSelectFacility: (facility: FacilityEntity) => void;
  onOpenAddFacility: () => void;
}

export const EntityHierarchyTree: React.FC<EntityHierarchyTreeProps> = ({
  tenant,
  facilities,
  activeUser,
  onSelectFacility,
  onOpenAddFacility,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const safeFacilities = facilities || [];
  const countries = Array.from(new Set(safeFacilities.map(f => f.country).filter(Boolean)));

  // Fallback to ALL if selectedCountry is not in active company
  const activeCountry = (selectedCountry === 'ALL' || countries.includes(selectedCountry))
    ? selectedCountry
    : 'ALL';

  const filteredFacilities = safeFacilities.filter(f => {
    if (activeCountry === 'ALL') return true;
    return f.country === activeCountry;
  });

  const canEditMapping = activeUser?.role === 'SUSTAINABILITY_MANAGER' || activeUser?.role === 'TENANT_ADMIN';

  return (
    <div className="space-y-6">
      {/* Top Section Intro & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Corporate Entity & Asset Mapping
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Consolidated multi-tenant asset hierarchy. Operational assets aggregate Scope 1 stationary combustion, Scope 2 metered electricity, and Scope 3 supply chain inputs under GHG Protocol operational control boundaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Grid vs. Map */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-0.5 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'map'
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Global Map
              </button>
            </div>

            {canEditMapping ? (
              <button
                onClick={onOpenAddFacility}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Facility Asset
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 bg-slate-950 rounded-lg border border-slate-800"
                title="Only Sustainability Managers and Tenant Admins can create or modify entity mappings"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                Entity Mapping Locked (RBAC: {activeUser?.role || 'VIEWER'})
              </div>
            )}
          </div>
        </div>

        {/* Filter by Country Segment */}
        {countries.length > 0 && (
          <div className="flex items-center gap-2 pt-4">
            <span className="text-xs text-slate-400 font-medium">Regional Division:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedCountry('ALL')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeCountry === 'ALL'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Regions ({safeFacilities.length})
              </button>
              {countries.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeCountry === c
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c} ({safeFacilities.filter(f => f.country === c).length})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Mode 1: Interactive Geographic Radar Map */}
      {viewMode === 'map' ? (
        <GlobalAssetMapView
          tenant={tenant}
          facilities={filteredFacilities}
          onSelectFacility={onSelectFacility}
        />
      ) : safeFacilities.length === 0 ? (
        /* Empty State: No Facilities at all */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Facility Assets Registered</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
            No operational branches, campuses, or data hubs are currently mapped for {tenant?.name || 'this enterprise'}. Add your corporate properties to track Scope 1/2/3 carbon telemetry.
          </p>
          {canEditMapping && (
            <button
              onClick={onOpenAddFacility}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Facility Asset
            </button>
          )}
        </div>
      ) : filteredFacilities.length === 0 ? (
        /* Filter Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-xs text-slate-400">
            No operational facilities registered in region: <strong className="text-white">{activeCountry}</strong>
          </p>
          <button
            onClick={() => setSelectedCountry('ALL')}
            className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Show All Regions ({safeFacilities.length})
          </button>
        </div>
      ) : (
        /* View Mode 2: Corporate Hierarchy Tree Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.map(facility => {
            const s1 = Number(facility.scope1Tco2e ?? (facility as any).scope1_tco2e ?? 0);
            const s2 = Number(facility.scope2Tco2e ?? (facility as any).scope2_tco2e ?? 0);
            const s3 = Number(facility.scope3Tco2e ?? (facility as any).scope3_tco2e ?? 0);
            const totalTco2e = s1 + s2 + s3;
            const isUserAssigned = activeUser?.assignedFacilityId === facility.id;
            const floorArea = Number(facility.grossFloorAreaSqFt ?? (facility as any).gross_floor_area_sqft ?? 0);
            const renPercent = Number(facility.renewableEnergyPercent ?? (facility as any).renewable_energy_percent ?? 50);
            const meters = facility.meters || [];
            const contributor = facility.assignedContributorName ?? (facility as any).assigned_contributor_name ?? 'Lead Operations';
            const repStatus = facility.reportingStatus ?? 'Audited';

            return (
              <div
                key={facility.id}
                onClick={() => onSelectFacility(facility)}
                className={`bg-slate-900 border rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between hover:border-slate-700 relative overflow-hidden group ${
                  isUserAssigned ? 'border-blue-500/40 ring-1 ring-blue-500/30' : 'border-slate-800'
                }`}
              >
                {isUserAssigned && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg font-mono">
                    Your Assigned Facility
                  </div>
                )}

                <div>
                  {/* Facility Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 block font-medium">
                        {facility.code}
                      </span>
                      <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {facility.name}
                      </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5 mt-1" />
                  </div>

                  {/* Location & Metadata */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{facility.city}, {facility.country}</span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono tabular-nums">{floorArea.toLocaleString()} sq ft</span>
                  </div>

                  {/* Scope Emissions Snapshot */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-2 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total Carbon Inventory</span>
                      <span className="font-bold text-white font-mono tabular-nums">
                        {totalTco2e.toFixed(1)} <span className="text-[10px] text-slate-400 font-sans">tCO2e</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Scope 1</span>
                        <span className="font-mono tabular-nums text-amber-400 font-medium">
                          {s1.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Scope 2</span>
                        <span className="font-mono tabular-nums text-cyan-400 font-medium">
                          {s2.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Scope 3</span>
                        <span className="font-mono tabular-nums text-indigo-400 font-medium">
                          {s3.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meter Integrations */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-500" />
                      <span>{meters.length} Active Meters</span>
                    </div>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-emerald-400 font-medium">
                      {renPercent.toFixed(0)}% Solar/Green
                    </span>
                  </div>
                </div>

                {/* Footer Assigned Personnel */}
                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Lead: {contributor}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px] uppercase">
                    {repStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
