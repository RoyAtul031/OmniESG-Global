import React, { useState } from 'react';
import { X, Building2, Globe2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../types/tenant';
import { FacilityEntity } from '../../types/entity';

interface OnboardCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (tenant: Tenant, initialFacility: FacilityEntity) => void;
}

const REGION_OPTIONS = [
  { label: 'North America (AMER)', value: 'North America', currency: 'USD ($)', country: 'United States' },
  { label: 'European Union (EMEA)', value: 'European Union', currency: 'EUR (€)', country: 'Germany' },
  { label: 'United Kingdom (EMEA)', value: 'United Kingdom', currency: 'GBP (£)', country: 'United Kingdom' },
  { label: 'Asia-Pacific (APAC - India)', value: 'India', currency: 'INR (₹)', country: 'India' },
  { label: 'Asia-Pacific (APAC - Japan)', value: 'Japan', currency: 'JPY (¥)', country: 'Japan' },
  { label: 'Asia-Pacific (APAC - Singapore)', value: 'Singapore', currency: 'SGD (S$)', country: 'Singapore' },
  { label: 'Australia (APAC)', value: 'Australia', currency: 'AUD (A$)', country: 'Australia' },
];

const COMPLIANCE_FRAMEWORKS = [
  'GHG Protocol Corporate Standard',
  'EU CSRD / ESRS E1',
  'SEBI BRSR Core',
  'SEC Climate Disclosure Rules',
  'ISSB IFRS S1 / S2',
  'ISO 14064-1',
  'CDP Worldwide',
  'SBTi Net-Zero Target',
];

export const OnboardCompanyModal: React.FC<OnboardCompanyModalProps> = ({
  isOpen,
  onClose,
  onCompanyCreated,
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [reportingYear, setReportingYear] = useState('2025');
  const [baselineYear, setBaselineYear] = useState('2022');
  const [targetReductionPercent, setTargetReductionPercent] = useState(45);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
    'GHG Protocol Corporate Standard',
    'EU CSRD / ESRS E1',
  ]);
  const [facilityName, setFacilityName] = useState('');
  const [facilityCity, setFacilityCity] = useState('');
  const [floorArea, setFloorArea] = useState(250000);

  if (!isOpen) return null;

  const handleToggleFramework = (fw: string) => {
    setSelectedFrameworks(prev =>
      prev.includes(fw) ? prev.filter(f => f !== fw) : [...prev, fw]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const reg = REGION_OPTIONS[selectedRegionIndex];
    const tenantSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    const tenantId = `tenant_${tenantSlug}_${Date.now().toString().slice(-4)}`;

    const newTenant: Tenant = {
      id: tenantId,
      name: name.trim(),
      slug: tenantSlug,
      hqLocation: facilityCity ? `${facilityCity}, ${reg.country}` : reg.country,
      industry,
      totalFloorAreaSqFt: floorArea,
      activeFacilitiesCount: 1,
      reportingYear,
      baselineYear,
      targetReductionPercent,
      complianceStandards: selectedFrameworks.length > 0 ? selectedFrameworks : ['GHG Protocol Corporate Standard'],
      auditVerificationStatus: 'UNAUDITED',
      currency: reg.currency,
      region: reg.value,
      country: reg.country,
    };

    const newFacility: FacilityEntity = {
      id: `fac_${Date.now().toString().slice(-6)}`,
      tenantId,
      name: facilityName.trim() || `${name} Global HQ`,
      code: `${tenantSlug.toUpperCase().slice(0, 3)}-HQ-01`,
      type: 'FACILITY_PROPERTY',
      country: reg.country,
      city: facilityCity.trim() || reg.country,
      address: `100 Global Boulevard, ${facilityCity || reg.country}`,
      latitude: reg.country === 'United States' ? 37.7749 : reg.country === 'Germany' ? 52.5200 : reg.country === 'Japan' ? 35.6762 : 12.9716,
      longitude: reg.country === 'United States' ? -122.4194 : reg.country === 'Germany' ? 13.4050 : reg.country === 'Japan' ? 139.6503 : 77.5946,
      grossFloorAreaSqFt: floorArea,
      occupancyCount: Math.round(floorArea / 180),
      assignedManagerId: 'user_priya',
      assignedManagerName: 'Priya Sharma (Global Lead)',
      assignedContributorId: 'user_arjun',
      assignedContributorName: 'Arjun Mehta (Site Auditor)',
      scope1Tco2e: 120.5,
      scope2Tco2e: 480.0,
      scope3Tco2e: 95.0,
      renewableEnergyPercent: 60,
      waterRecycledPercent: 75,
      wasteDivertedPercent: 70,
      reportingStatus: 'IN_PROGRESS',
      hasAnomaly: false,
      meters: [
        {
          id: `meter_${Date.now().toString().slice(-4)}_1`,
          name: 'Main Grid Incomer',
          utilityType: 'ELECTRICITY_GRID',
          scope: 'SCOPE_2',
          unit: 'kWh',
          status: 'ONLINE',
          lastReadingTimestamp: new Date().toISOString(),
          currentQuarterUsage: 350000,
        },
      ],
    };

    onCompanyCreated(newTenant, newFacility);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Onboard Enterprise Tenant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Global Multi-Tenant OS
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Register a new corporation with isolated cryptographic ledger, regional currency, and compliance profiles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 1: Corporation Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              1. Corporation Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Enterprise Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siemens Energy AG, Tata Motors"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry Sector
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Technology & Software">Technology & Cloud Infrastructure</option>
                  <option value="Commercial Real Estate">Commercial Real Estate & REIT</option>
                  <option value="Manufacturing & Industrial">Heavy Manufacturing & Industrial</option>
                  <option value="Automotive & Mobility">Automotive & Clean Mobility</option>
                  <option value="Energy & Utilities">Renewable Energy & Utilities</option>
                  <option value="Consumer Goods & Retail">Consumer Goods & Logistics</option>
                  <option value="Financial Services">Financial Services & Banking</option>
                </select>
              </div>
            </div>

            {/* Region & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Operating Jurisdiction & Region
                </label>
                <select
                  value={selectedRegionIndex}
                  onChange={e => setSelectedRegionIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {REGION_OPTIONS.map((r, idx) => (
                    <option key={r.value} value={idx}>
                      {r.label} — {r.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Currency Symbol
                </label>
                <div className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400">
                  {REGION_OPTIONS[selectedRegionIndex].currency}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Baselines & Targets */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              2. Baseline Calibration & Decarbonization Target
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Reporting Period
                </label>
                <input
                  type="text"
                  value={reportingYear}
                  onChange={e => setReportingYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Baseline Year
                </label>
                <input
                  type="text"
                  value={baselineYear}
                  onChange={e => setBaselineYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  2030 Reduction Goal
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={targetReductionPercent}
                    onChange={e => setTargetReductionPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Applicable Frameworks */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-2">
                Mandatory Regulatory Frameworks
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COMPLIANCE_FRAMEWORKS.map(fw => {
                  const isChecked = selectedFrameworks.includes(fw);
                  return (
                    <button
                      type="button"
                      key={fw}
                      onClick={() => handleToggleFramework(fw)}
                      className={`text-left p-2 rounded-lg border text-[11px] font-medium transition-all flex items-center justify-between gap-1.5 ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{fw}</span>
                      {isChecked && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Genesis Facility */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              3. Genesis Operational Facility / Headquarters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frankfurt Data Center Alpha"
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  City Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frankfurt, Tokyo, London"
                  value={facilityCity}
                  onChange={e => setFacilityCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Floor Area (sq ft)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={floorArea}
                  onChange={e => setFloorArea(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5" />
              Initialize Enterprise & Genesis Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
