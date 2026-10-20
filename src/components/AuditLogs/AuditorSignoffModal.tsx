import React, { useState } from 'react';
import { Tenant } from '../../types/tenant';
import { User } from '../../types/rbac';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuditorSignoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  auditor: User;
  onSignoff: (params: {
    standard: string;
    opinion: string;
    notes: string;
  }) => void;
}

export const AuditorSignoffModal: React.FC<AuditorSignoffModalProps> = ({
  isOpen,
  onClose,
  tenant,
  auditor,
  onSignoff,
}) => {
  const [standard, setStandard] = useState('ISAE 3000 (Revised) / AA1000AS');
  const [opinion, setOpinion] = useState('UNQUALIFIED_ASSURANCE');
  const [notes, setNotes] = useState(
    'Conducted substantive testing of utility electricity billing receipts and stationary diesel fuel logs. In our opinion, the consolidated GHG inventory presents fairly in all material respects in conformity with GHG Protocol Corporate Standard.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignoff({ standard, opinion, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">
              Independent ESG Auditor Verification & Sign-Off
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200 leading-relaxed">
            You are signing off as <strong className="text-amber-300">{auditor.name}</strong> ({auditor.title}). This formal action will append an immutable cryptographic assurance block to {tenant.name}&apos;s compliance chain.
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Assurance Framework Standard
            </label>
            <select
              value={standard}
              onChange={e => setStandard(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="ISAE 3000 (Revised) / AA1000AS">
                ISAE 3000 (Revised) & AA1000AS - Limited / Reasonable Assurance
              </option>
              <option value="SEBI BRSR Core Mandated Assurance">
                SEBI BRSR Core (Mandatory Reasonable Assurance for Top 250)
              </option>
              <option value="GHG Protocol Corporate Standard Verification">
                GHG Protocol Corporate Accounting and Reporting Standard
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Auditor Opinion Statement
            </label>
            <select
              value={opinion}
              onChange={e => setOpinion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="UNQUALIFIED_ASSURANCE">Unqualified (Clean) Opinion - Unreserved True & Fair</option>
              <option value="QUALIFIED_ASSURANCE">Qualified Opinion - Subject to Scope 3 Upstream Disclaimers</option>
              <option value="EMPHASIS_OF_MATTER">Unqualified with Emphasis of Matter (Grid Substation Anomaly)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Formal Assurance Notes & Regulatory Summary
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sign Off & Commit Cryptographic Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
