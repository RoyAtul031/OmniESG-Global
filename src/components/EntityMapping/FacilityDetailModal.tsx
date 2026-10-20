import React from 'react';
import { FacilityEntity } from '../../types/entity';
import { User } from '../../types/rbac';
import { X, Building, MapPin, Gauge, ShieldAlert, PlusCircle, CheckCircle2 } from 'lucide-react';

interface FacilityDetailModalProps {
  facility: FacilityEntity | null;
  onClose: () => void;
  activeUser: User;
  onLogDataForFacility: (facilityId: string) => void;
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  facility,
  onClose,
  activeUser,
  onLogDataForFacility,
}) => {
  if (!facility) return null;

  const totalEmissions = facility.scope1Tco2e + facility.scope2Tco2e + facility.scope3Tco2e;
  const canUpload =
    activeUser.role === 'SUSTAINABILITY_MANAGER' ||
    activeUser.role === 'TENANT_ADMIN' ||
    (activeUser.role === 'FACILITY_CONTRIBUTOR' && activeUser.assignedFacilityId === facility.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">
              {facility.code} · Operational Boundary Asset
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {facility.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{facility.address}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Anomaly Callout if active */}
          {facility.hasAnomaly && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Auditor Notice:</strong> {facility.anomalyNote}
              </div>
            </div>
          )}

          {/* Key Facility Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Gross Floor Area</span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {facility.grossFloorAreaSqFt.toLocaleString()} sq ft
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Occupancy Capacity</span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {facility.occupancyCount.toLocaleString()} occupants
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Renewable Energy</span>
              <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                {facility.renewableEnergyPercent.toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Water Circularity</span>
              <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                {facility.waterRecycledPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* GHG Emissions Consolidated */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Consolidated GHG Inventory
            </h3>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Carbon</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  {totalEmissions.toFixed(1)} <span className="text-xs font-sans text-slate-400">tCO2e</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Scope 1 Direct</span>
                <span className="text-base font-semibold text-amber-400 font-mono tabular-nums">
                  {facility.scope1Tco2e.toFixed(1)} tCO2e
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Scope 2 Location</span>
                <span className="text-base font-semibold text-cyan-400 font-mono tabular-nums">
                  {facility.scope2Tco2e.toFixed(1)} tCO2e
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Scope 3 Indirect</span>
                <span className="text-base font-semibold text-indigo-400 font-mono tabular-nums">
                  {facility.scope3Tco2e.toFixed(1)} tCO2e
                </span>
              </div>
            </div>
          </div>

          {/* Connected Meters & IoT Hardware Devices */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Connected Utility Meters & Sub-meters ({facility.meters.length})</span>
              <span className="text-[11px] text-slate-500 font-normal">Real-time telemetry</span>
            </h3>

            {facility.meters.length > 0 ? (
              <div className="space-y-2">
                {facility.meters.map(m => (
                  <div
                    key={m.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <Gauge className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{m.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {m.utilityType} · {m.scope}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-semibold block tabular-nums">
                        {m.currentQuarterUsage.toLocaleString()} {m.unit}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Status: {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4 text-center text-xs text-slate-500">
                No telemetry meters mapped yet. Utility data is recorded via manual invoice vouchers.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Assigned Contributor: <strong className="text-slate-200">{facility.assignedContributorName}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              Close
            </button>
            {canUpload ? (
              <button
                onClick={() => {
                  onClose();
                  onLogDataForFacility(facility.id);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Log Utility Record
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                Upload restricted (RBAC: {activeUser.role})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
