import React, { useState } from 'react';
import { Tenant, TenantSettings } from '../../types/tenant';
import { User } from '../../types/rbac';
import { Sliders, Save, ShieldCheck, Lock, Key } from 'lucide-react';

interface TenantSettingsViewProps {
  tenant: Tenant;
  settings: TenantSettings;
  activeUser: User;
  onSaveSettings: (settings: TenantSettings, justification: string) => void;
}

export const TenantSettingsView: React.FC<TenantSettingsViewProps> = ({
  tenant,
  settings,
  activeUser,
  onSaveSettings,
}) => {
  const [gridFactor, setGridFactor] = useState(settings.gridEmissionFactor);
  const [dieselFactor, setDieselFactor] = useState(settings.dieselEmissionFactor);
  const [waterFactor, setWaterFactor] = useState(settings.waterEmissionFactor);
  const [retentionDays, setRetentionDays] = useState(settings.auditLogRetentionDays);
  const [tamperProof, setTamperProof] = useState(settings.tamperProofChainingEnabled);
  const [strictMfa, setStrictMfa] = useState(settings.strictMfaRequired);
  const [justification, setJustification] = useState('Annual baseline recalibration per updated CEA CO2 database.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canEdit = activeUser.role === 'TENANT_ADMIN' || activeUser.role === 'SUSTAINABILITY_MANAGER';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    const updated: TenantSettings = {
      tenantId: tenant.id,
      gridEmissionFactor: Number(gridFactor),
      dieselEmissionFactor: Number(dieselFactor),
      waterEmissionFactor: Number(waterFactor),
      auditLogRetentionDays: Number(retentionDays),
      tamperProofChainingEnabled: tamperProof,
      strictMfaRequired: strictMfa,
      ipWhitelistEnabled: settings.ipWhitelistEnabled,
    };

    onSaveSettings(updated, justification);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            Tenant Baseline & Emission Factors Configuration
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Configure default regional emission conversion factors, statutory audit trail retention horizons, and cryptographic consensus rules for {tenant.name}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {!canEdit && (
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Configuration is read-only for your role (<strong>{activeUser.role}</strong>). Switch to Tenant Admin or Sustainability Manager to adjust factors.
            </span>
          </div>
        )}

        {/* Emission Factors */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            GHG Protocol Emission Conversion Factors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Grid Electricity (kgCO2e / kWh)
              </label>
              <input
                type="number"
                step="0.001"
                disabled={!canEdit}
                value={gridFactor}
                onChange={e => setGridFactor(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-60"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                CEA Baseline Database v19
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stationary Diesel (kgCO2e / Liter)
              </label>
              <input
                type="number"
                step="0.01"
                disabled={!canEdit}
                value={dieselFactor}
                onChange={e => setDieselFactor(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-60"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                IPCC 2006 Fuel Inventory
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Water Supply (kgCO2e / m3)
              </label>
              <input
                type="number"
                step="0.001"
                disabled={!canEdit}
                value={waterFactor}
                onChange={e => setWaterFactor(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-60"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                DEFRA Water Treatment Standard
              </span>
            </div>
          </div>
        </div>

        {/* Audit Log Retention & Tamper Proof Rules */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Audit Ledger Security & Statutory Retention
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Audit Trail Retention Horizon (Days)
              </label>
              <input
                type="number"
                disabled={!canEdit}
                value={retentionDays}
                onChange={e => setRetentionDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-60"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Recommended: 2,555 days (7 years statutory requirement for WeWork / Embassy REIT)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  checked={tamperProof}
                  onChange={e => setTamperProof(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-200">
                  Enforce SHA-256 Chained Block Consensus
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  checked={strictMfa}
                  onChange={e => setStrictMfa(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-200">
                  Enforce Hardware Security Keys / Strict MFA for Auditors
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Regulatory Justification */}
        {canEdit && (
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Regulatory Justification for Setting Alteration (Required for Audit Trail)
            </label>
            <textarea
              rows={2}
              required
              value={justification}
              onChange={e => setJustification(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="State the regulatory basis for changing emission factors..."
            />
          </div>
        )}

        {canEdit && (
          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-medium">
                  Settings updated and committed to cryptographic audit chain.
                </span>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Configuration & Commit Block
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
