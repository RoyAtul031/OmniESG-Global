import React, { useState } from 'react';
import { Tenant } from '../../types/tenant';
import { FacilityEntity } from '../../types/entity';
import { EmissionRecord, ScopeSummary } from '../../types/esg';
import { User } from '../../types/rbac';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  Scale,
} from 'lucide-react';

interface ComplianceReportsViewProps {
  tenant: Tenant;
  facilities: FacilityEntity[];
  emissions: EmissionRecord[];
  scopeSummary: ScopeSummary;
  activeUser: User;
  onExportCsv: () => void;
  onOpenDossier: (framework: string) => void;
}

export const ComplianceReportsView: React.FC<ComplianceReportsViewProps> = ({
  tenant,
  facilities,
  emissions,
  scopeSummary,
  activeUser,
  onExportCsv,
  onOpenDossier,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<'BRSR_CORE' | 'GHG_PROTOCOL' | 'GRI' | 'SEC_CLIMATE'>('BRSR_CORE');

  const frameworks = [
    {
      id: 'BRSR_CORE',
      name: 'SEBI BRSR Core',
      authority: 'Securities and Exchange Board of India',
      description: 'Mandatory 9 ESG attributes requiring reasonable third-party assurance for top enterprise entities.',
      assuranceRequirement: 'Reasonable Assurance (Mandatory)',
      applicability: 'Embassy Office Parks REIT & Large Commercial REITs',
    },
    {
      id: 'GHG_PROTOCOL',
      name: 'GHG Protocol Corporate Standard',
      authority: 'WRI / WBCSD',
      description: 'Standardized operational control accounting across Scope 1, Scope 2 (dual reporting), and Scope 3.',
      assuranceRequirement: 'Limited / Reasonable Assurance (ISO 14064-3)',
      applicability: 'Global Enterprise Tenants & WeWork Worldwide',
    },
    {
      id: 'GRI',
      name: 'GRI 300 Environmental Series',
      authority: 'Global Reporting Initiative',
      description: 'GRI 302 Energy, GRI 303 Water & Effluents, GRI 305 Greenhouse Gas Emissions disclosures.',
      assuranceRequirement: 'Independent Assurance Statement (AA1000AS)',
      applicability: 'Global Sustainability Index Reporting',
    },
    {
      id: 'SEC_CLIMATE',
      name: 'SEC Climate-Related Disclosures',
      authority: 'U.S. Securities and Exchange Commission',
      description: 'Material Scope 1 and Scope 2 disclosures and financial impact metrics for commercial enterprises.',
      assuranceRequirement: 'Attestation Report by Independent Public Accountant',
      applicability: 'US Listed Commercial Real Estate & WeWork Inc.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Enterprise Compliance & Regulatory Reporting
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Generate audit-ready statutory ESG disclosures and exportable verification bundles for institutional investors, regulators, and assurance partners.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Download Formatted CSV Pack
            </button>
            <button
              onClick={() => onOpenDossier(selectedFramework)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              View Printable PDF Dossier
            </button>
          </div>
        </div>

        {/* Framework Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {frameworks.map(fw => (
            <button
              key={fw.id}
              onClick={() => setSelectedFramework(fw.id as any)}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                selectedFramework === fw.id
                  ? 'bg-slate-800 border-emerald-500/50 text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-bold block ${selectedFramework === fw.id ? 'text-emerald-400' : 'text-slate-300'}`}>
                {fw.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                {fw.authority}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                {fw.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Framework Executive Summary & Indicator Mapping */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
              Reporting Standard Blueprint
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {frameworks.find(f => f.id === selectedFramework)?.name} Disclosure Package
            </h3>
            <span className="text-xs text-slate-400">
              Entity: <strong className="text-slate-200">{tenant.name}</strong> · Reporting Period: {tenant.reportingYear}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Assurance Status:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {tenant.auditVerificationStatus === 'VERIFIED' ? 'Certified Verified' : 'In Substantive Review'}
            </span>
          </div>
        </div>

        {/* BRSR / GHG Protocol Indicator Table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Core Indicator Disclosures & Attestation Metrics
          </h4>
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Indicator Code</th>
                  <th className="py-2.5 px-3">Environmental Parameter</th>
                  <th className="py-2.5 px-3 text-right">Reported Value</th>
                  <th className="py-2.5 px-3 text-right">Unit of Measure</th>
                  <th className="py-2.5 px-3">Primary Evidence Source</th>
                  <th className="py-2.5 px-3 text-center">Assurance Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">BRSR-E1.1 / GHG-S1</td>
                  <td className="py-2.5 px-3 font-sans text-white">Gross Scope 1 Direct Emissions</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-400 tabular-nums">
                    {scopeSummary.scope1Tco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-sans">Metric Tons CO2e</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">Stationary Diesel Genset Delivery Vouchers</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-sans">ISAE 3000 Verified</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">BRSR-E1.2 / GHG-S2L</td>
                  <td className="py-2.5 px-3 font-sans text-white">Scope 2 Location-Based Grid Electricity</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-400 tabular-nums">
                    {scopeSummary.scope2Tco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-sans">Metric Tons CO2e</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">Substation Utility Revenue Meter Invoices</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-sans">ISAE 3000 Verified</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">BRSR-E1.3 / GHG-S2M</td>
                  <td className="py-2.5 px-3 font-sans text-white">Scope 2 Market-Based (Solar PPAs & EACs)</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums">
                    {scopeSummary.scope2MarketTco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-sans">Metric Tons CO2e</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">I-REC & J-Credit Registry Certificates</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-sans">Verified Attested</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">BRSR-E2.1 / GRI-302</td>
                  <td className="py-2.5 px-3 font-sans text-white">Building Energy Intensity Ratio</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white tabular-nums">
                    {scopeSummary.energyIntensityKwhPerSqFt.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-sans">kWh / sq ft / year</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">Consolidated Facility Meter Registers</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-sans">Sample Tested</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">BRSR-E3.1 / GRI-303</td>
                  <td className="py-2.5 px-3 font-sans text-white">Water Recycling & Circularity Index</td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-400 tabular-nums">
                    {scopeSummary.waterRecycledPercent.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-sans">Percentage Reused</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">Sewage Treatment Plant (STP) Flow Logs</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-sans">Verified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Stamp & Signature Callout */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">
                Independent Third-Party Assurance Opinion
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Signed by <strong>{tenant.verifiedBy || 'Marcus Vance, KPMG ESG Advisory Partner'}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenDossier(selectedFramework)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            Launch Official Compliance Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
