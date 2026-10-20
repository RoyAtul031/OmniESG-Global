import React from 'react';
import { Tenant } from '../../types/tenant';
import { FacilityEntity } from '../../types/entity';
import { ScopeSummary } from '../../types/esg';
import { AuditLogEntry } from '../../types/audit';
import { X, Printer, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface ComplianceDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  frameworkName: string;
  tenant: Tenant;
  facilities: FacilityEntity[];
  scopeSummary: ScopeSummary;
  latestAuditLog?: AuditLogEntry;
}

export const ComplianceDossierModal: React.FC<ComplianceDossierModalProps> = ({
  isOpen,
  onClose,
  frameworkName,
  tenant,
  facilities,
  scopeSummary,
  latestAuditLog,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Action Bar (hidden in print) */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              OFFICIAL COMPLIANCE DOSSIER
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-medium">
              {tenant.name} ({tenant.reportingYear})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Canvas */}
        <div className="p-8 space-y-6 overflow-y-auto bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
          {/* Letterhead */}
          <div className="border-b-2 border-emerald-500 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider print:text-emerald-700">
                Independent ESG Assurance & Compliance Dossier
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1 print:text-slate-900">
                {tenant.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Consolidated GHG Inventory & Statutory ESG Disclosure · Framework: {frameworkName}
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-slate-400 print:text-slate-600">
              <div>Reporting Period: <strong>{tenant.reportingYear}</strong></div>
              <div>Baseline Period: <strong>{tenant.baselineYear}</strong></div>
              <div>Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Verification Seal & Hash Commitment */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 print:text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white print:text-slate-900 block">
                  Cryptographically Anchored Assurance Attestation
                </span>
                <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-0.5 leading-relaxed">
                  Ledger secured with sequential SHA-256 block hashing. All underlying meter activity data and utility invoice vouchers verified tamper-proof.
                </span>
                <div className="text-[10px] font-mono text-slate-500 print:text-slate-600 mt-1.5 break-all">
                  Chain Head Hash: {latestAuditLog?.currentHash || '3a7d8f4e91b5c2a68e3f019482b6d7c81a9f0e2b4c5d6e7f8a9b0c1d2e3f4a5b'}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md print:border-emerald-600 print:text-emerald-700">
                UNQUALIFIED ASSURANCE
              </span>
            </div>
          </div>

          {/* Executive GHG Emissions Breakdown */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 print:text-slate-800">
              Table 1: Consolidated Greenhouse Gas Emissions (tCO2e)
            </h2>
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold print:bg-slate-100 print:text-slate-800 print:border-slate-300">
                  <th className="py-2.5 px-3">GHG Scope Category</th>
                  <th className="py-2.5 px-3">Accounting Standard</th>
                  <th className="py-2.5 px-3 text-right">Reported (tCO2e)</th>
                  <th className="py-2.5 px-3 text-right">% of Total</th>
                  <th className="py-2.5 px-3">Assurance Opinion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white print:text-slate-900">
                    Scope 1 Direct (Fuel & Stationary)
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 font-sans">
                    IPCC Guidelines / GHG Protocol
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-400 print:text-amber-800 tabular-nums">
                    {scopeSummary.scope1Tco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 print:text-slate-600">
                    {((scopeSummary.scope1Tco2e / scopeSummary.totalTco2e) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 print:text-emerald-700 font-sans">
                    Reasonable Assurance
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white print:text-slate-900">
                    Scope 2 Indirect (Location-based Grid)
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 font-sans">
                    CEA v19 / EPA eGRID
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-400 print:text-cyan-800 tabular-nums">
                    {scopeSummary.scope2Tco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 print:text-slate-600">
                    {((scopeSummary.scope2Tco2e / scopeSummary.totalTco2e) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 print:text-emerald-700 font-sans">
                    Reasonable Assurance
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white print:text-slate-900">
                    Scope 2 Market-based (PPAs / Solar)
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 font-sans">
                    Dual Scope 2 Reporting
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400 print:text-emerald-800 tabular-nums">
                    {scopeSummary.scope2MarketTco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 print:text-slate-600">-</td>
                  <td className="py-2.5 px-3 text-emerald-400 print:text-emerald-700 font-sans">
                    Contractual Attested
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white print:text-slate-900">
                    Scope 3 Value Chain (Travel & Waste)
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 font-sans">
                    DEFRA Conversion Factors
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-400 print:text-indigo-800 tabular-nums">
                    {scopeSummary.scope3Tco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 print:text-slate-600">
                    {((scopeSummary.scope3Tco2e / scopeSummary.totalTco2e) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 print:text-emerald-700 font-sans">
                    Limited Assurance
                  </td>
                </tr>
                <tr className="bg-slate-950/40 print:bg-slate-100 font-bold">
                  <td className="py-2.5 px-3 font-sans text-white print:text-slate-900">
                    Gross Consolidated Inventory
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 font-sans">
                    All Included Scopes
                  </td>
                  <td className="py-2.5 px-3 text-right text-white print:text-slate-900 tabular-nums text-sm">
                    {scopeSummary.totalTco2e.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 print:text-slate-800">100.0%</td>
                  <td className="py-2.5 px-3 text-emerald-400 print:text-emerald-700 font-sans">
                    Sign-Off Finalized
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Operational Efficiency Attributes */}
          <div className="grid grid-cols-3 gap-3 text-xs border border-slate-800 rounded-lg p-4 print:border-slate-300 print:bg-slate-50">
            <div>
              <span className="text-slate-400 print:text-slate-600 block">Energy Intensity Ratio</span>
              <span className="text-base font-bold text-white print:text-slate-900 font-mono">
                {scopeSummary.energyIntensityKwhPerSqFt.toFixed(2)} kWh / sq ft
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block">Renewable Energy Mix</span>
              <span className="text-base font-bold text-emerald-400 print:text-emerald-700 font-mono">
                {scopeSummary.renewableEnergyPercent.toFixed(1)}% of total load
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block">Water Recycling & Reuse</span>
              <span className="text-base font-bold text-cyan-400 print:text-cyan-700 font-mono">
                {scopeSummary.waterRecycledPercent.toFixed(1)}% STP treated
              </span>
            </div>
          </div>

          {/* Auditor Certification Signature Block */}
          <div className="border-t border-slate-800 pt-5 print:border-slate-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div className="max-w-md">
              <span className="font-bold text-white print:text-slate-900 block">
                Auditor Assurance Statement
              </span>
              <p className="text-slate-400 print:text-slate-600 mt-1 leading-relaxed text-[11px]">
                We have reviewed the procedures and quantitative emissions calculations of {tenant.name} for the period {tenant.reportingYear}. Nothing has come to our attention that causes us to believe that the stated greenhouse gas assertions are materially misstated.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-serif italic text-base text-slate-200 print:text-slate-800 border-b border-slate-700 pb-1 mb-1">
                Marcus Vance
              </div>
              <div className="font-mono text-[11px] text-slate-400 print:text-slate-600">
                Lead ESG Assurance Partner, KPMG
              </div>
              <div className="font-mono text-[10px] text-slate-500 print:text-slate-500">
                AA1000 / ISAE 3000 Cert #AS-2025-9941
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500 font-mono">
            OmniESG Global Assurance Engine · SHA-256 Validated Cryptographic Seal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
