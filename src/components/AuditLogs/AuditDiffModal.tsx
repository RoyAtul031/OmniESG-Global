import React, { useState } from 'react';
import { AuditLogEntry } from '../../types/audit';
import { X, Lock, CheckCircle2, ArrowRight, ShieldCheck, FileJson, AlertTriangle } from 'lucide-react';

interface AuditDiffModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

export const AuditDiffModal: React.FC<AuditDiffModalProps> = ({ log, onClose }) => {
  const [viewMode, setViewMode] = useState<'DIFF_FIELDS' | 'RAW_SNAPSHOTS'>('DIFF_FIELDS');

  if (!log) return null;

  const isTampered = log.id.startsWith('tampered_');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400">
                Block #{log.blockIndex}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">
                {log.action}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              Audit Record Inspection: {log.entityName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>By <strong className="text-slate-300">{log.userName}</strong> ({log.userRole.replace('_', ' ')})</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono">{log.timestamp.replace('T', ' ').slice(0, 19)} UTC</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Tamper Warning if broken */}
          {isTampered && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300">Integrity Breach:</strong> This block has been tampered with or modified outside the cryptographic state consensus. Stored hash does not match computed SHA-256 payload!
              </div>
            </div>
          )}

          {/* Cryptographic Linkage Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                SHA-256 Cryptographic Linkage
              </span>
              <span className="text-[11px] text-slate-500">
                Session IP: {log.userIp}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Previous Block Hash (Parent):</span>
              <span className="text-slate-400 text-[11px] break-all select-all">
                {log.previousHash}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Current Block Hash (Signed Payload):</span>
              <span className="text-emerald-300 text-[11px] font-semibold break-all select-all">
                {log.currentHash}
              </span>
            </div>
          </div>

          {/* Regulatory Justification */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Business & Compliance Justification
            </h3>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-200 italic leading-relaxed">
              &ldquo;{log.justification}&rdquo;
            </div>
          </div>

          {/* Diff View Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                State Mutation (Before vs. After)
              </h3>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
                <button
                  onClick={() => setViewMode('DIFF_FIELDS')}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                    viewMode === 'DIFF_FIELDS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Field Diff Table
                </button>
                <button
                  onClick={() => setViewMode('RAW_SNAPSHOTS')}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                    viewMode === 'RAW_SNAPSHOTS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw JSON Snapshots
                </button>
              </div>
            </div>

            {viewMode === 'DIFF_FIELDS' ? (
              log.diff && log.diff.length > 0 ? (
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                        <th className="py-2 px-3 font-semibold">Field Name</th>
                        <th className="py-2 px-3 font-semibold text-rose-400/90">Prior Value (Before)</th>
                        <th className="py-2 px-3 font-semibold text-emerald-400">Committed Value (After)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {log.diff.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                            {item.label}
                          </td>
                          <td className="py-2.5 px-3 text-rose-300/80 bg-rose-950/10">
                            {item.oldValue !== null && item.oldValue !== undefined ? (
                              <span>{String(item.oldValue)} {item.unit || ''}</span>
                            ) : (
                              <span className="text-slate-600 italic">None (New)</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-300 font-semibold bg-emerald-950/10">
                            {String(item.newValue)} {item.unit || ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 text-xs text-slate-500 text-center">
                  Initial state snapshot (Genesis block initialization).
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[11px] text-rose-400/80 font-sans block mb-1">
                    Before Snapshot JSON
                  </span>
                  <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 overflow-x-auto max-h-56">
                    {JSON.stringify(log.beforeSnapshot, null, 2) || '// No prior state'}
                  </pre>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-400 font-sans block mb-1">
                    After Snapshot JSON (Immutable)
                  </span>
                  <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-emerald-300/90 overflow-x-auto max-h-56">
                    {JSON.stringify(log.afterSnapshot, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            User ID: {log.userId} · Entity: {log.entityId}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
