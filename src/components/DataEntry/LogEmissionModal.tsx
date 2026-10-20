import React, { useState, useEffect } from 'react';
import { FacilityEntity } from '../../types/entity';
import { Tenant, TenantSettings } from '../../types/tenant';
import { User } from '../../types/rbac';
import { EmissionRecord, ActivityType, ScopeCategory } from '../../types/esg';
import { X, PlusCircle, Calculator, FileCheck2, Lock } from 'lucide-react';

interface LogEmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  tenantSettings: TenantSettings;
  facilities: FacilityEntity[];
  activeUser: User;
  preselectedFacilityId?: string;
  onSaveRecord: (record: EmissionRecord, justification: string) => void;
}

export const LogEmissionModal: React.FC<LogEmissionModalProps> = ({
  isOpen,
  onClose,
  tenant,
  tenantSettings,
  facilities,
  activeUser,
  preselectedFacilityId,
  onSaveRecord,
}) => {
  // If user is facility contributor, default to their assigned facility
  const defaultFacilityId =
    activeUser.role === 'FACILITY_CONTRIBUTOR' && activeUser.assignedFacilityId
      ? activeUser.assignedFacilityId
      : preselectedFacilityId || facilities[0]?.id || '';

  const [facilityId, setFacilityId] = useState(defaultFacilityId);
  const [activityType, setActivityType] = useState<ActivityType>('PURCHASED_ELECTRICITY_GRID');
  const [periodYear, setPeriodYear] = useState<number>(2025);
  const [periodQuarter, setPeriodQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');
  const [quantity, setQuantity] = useState<number>(45000);
  const [evidenceDoc, setEvidenceDoc] = useState('BESCOM_Invoice_October_Verified.pdf');
  const [justification, setJustification] = useState('Monthly billing cycle utility log submission.');

  useEffect(() => {
    if (activeUser.role === 'FACILITY_CONTRIBUTOR' && activeUser.assignedFacilityId) {
      setFacilityId(activeUser.assignedFacilityId);
    } else if (preselectedFacilityId) {
      setFacilityId(preselectedFacilityId);
    }
  }, [activeUser, preselectedFacilityId]);

  if (!isOpen) return null;

  const isAuditor = activeUser.role === 'ESG_AUDITOR';

  // Calculate emission factor and unit based on activity type
  let unit = 'kWh';
  let factor = tenantSettings.gridEmissionFactor;
  let factorSource = 'CEA CO2 Baseline Database v19';
  let scope: ScopeCategory = 'SCOPE_2';

  if (activityType === 'DIESEL_GENSET') {
    unit = 'liters';
    factor = tenantSettings.dieselEmissionFactor;
    factorSource = 'IPCC 2006 Guidelines Table 2.2';
    scope = 'SCOPE_1';
  } else if (activityType === 'PURCHASED_ELECTRICITY_SOLAR_PPA') {
    unit = 'kWh';
    factor = 0.045;
    factorSource = 'Renewable Energy Certificate (REC) Factor';
    scope = 'SCOPE_2';
  } else if (activityType === 'BUSINESS_TRAVEL_FLIGHTS') {
    unit = 'passenger-km';
    factor = 0.158;
    factorSource = 'DEFRA 2024 Business Travel Conversion';
    scope = 'SCOPE_3';
  } else if (activityType === 'WATER_SUPPLY') {
    unit = 'm3';
    factor = tenantSettings.waterEmissionFactor;
    factorSource = 'UK DEFRA Water Supply Baseline';
    scope = 'SCOPE_3';
  }

  // Calculated emissions in tCO2e: (Quantity * Factor) / 1000 (if kgCO2e)
  const calculatedTco2e = Number(((quantity * factor) / 1000).toFixed(3));
  const targetFacility = facilities.find(f => f.id === facilityId) || facilities[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuditor) return;

    const newRecord: EmissionRecord = {
      id: `em_rec_${Date.now()}`,
      tenantId: tenant.id,
      facilityId: targetFacility.id,
      facilityName: targetFacility.name,
      activityType,
      scope,
      periodYear,
      periodQuarter,
      periodMonth: `${periodQuarter} ${periodYear}`,
      quantity: Number(quantity),
      unit,
      emissionFactor: factor,
      emissionFactorSource: factorSource,
      calculatedTco2e,
      evidenceDocumentName: evidenceDoc,
      reportedByUserId: activeUser.id,
      reportedByUserName: activeUser.name,
      reportedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    onSaveRecord(newRecord, justification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">
              Log Activity Data & Generate Audit Block
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAuditor ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Write Operation Prohibited Under RBAC Independence
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              As an <strong>ESG Auditor</strong>, independent assurance standards (ISAE 3000 / SEC Rules) strictly prohibit direct modification of raw client emissions data. Switch to Sustainability Manager or Facility Contributor role to submit entries.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-white rounded-lg transition-colors"
              >
                Close Dialog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* RBAC Notice if Facility Contributor */}
            {activeUser.role === 'FACILITY_CONTRIBUTOR' && (
              <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
                Logged in as Facility Contributor. Form is locked to your assigned operational unit: <strong className="text-blue-100">{targetFacility?.name}</strong>.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Facility
                </label>
                <select
                  disabled={activeUser.role === 'FACILITY_CONTRIBUTOR'}
                  value={facilityId}
                  onChange={e => setFacilityId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Activity Source Category
                </label>
                <select
                  value={activityType}
                  onChange={e => setActivityType(e.target.value as ActivityType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="PURCHASED_ELECTRICITY_GRID">Scope 2: Grid Electricity (kWh)</option>
                  <option value="DIESEL_GENSET">Scope 1: Backup Diesel Generator (Liters)</option>
                  <option value="PURCHASED_ELECTRICITY_SOLAR_PPA">Scope 2: Solar PPA Wheeling (kWh)</option>
                  <option value="BUSINESS_TRAVEL_FLIGHTS">Scope 3: Business Air Travel (pass-km)</option>
                  <option value="WATER_SUPPLY">Scope 3: Municipal Water Inflow (m3)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Quantity ({unit})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fiscal Period
                </label>
                <select
                  value={periodQuarter}
                  onChange={e => setPeriodQuarter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Q1">Q1 (Jan - Mar)</option>
                  <option value="Q2">Q2 (Apr - Jun)</option>
                  <option value="Q3">Q3 (Jul - Sep)</option>
                  <option value="Q4">Q4 (Oct - Dec)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={periodYear}
                  onChange={e => setPeriodYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Live Calculation Engine Preview */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-slate-400 font-sans">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Calculator className="w-3.5 h-3.5" />
                  Calibrated GHG Calculation Engine
                </span>
                <span className="text-[11px] text-slate-500">{scope}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Emission Factor Applied:</span>
                <span>{factor} kgCO2e/{unit} ({factorSource})</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Calculated Greenhouse Impact:</span>
                <span className="text-emerald-400">{calculatedTco2e} tCO2e</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Audit Evidence Document Reference
              </label>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={evidenceDoc}
                  onChange={e => setEvidenceDoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Utility_Bill_Invoice_Q3.pdf"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mandatory Regulatory Justification (Audit Block Payload)
              </label>
              <textarea
                rows={2}
                required
                value={justification}
                onChange={e => setJustification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="State the audit explanation for this utility entry..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Commit & Append to Hash Chain
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
