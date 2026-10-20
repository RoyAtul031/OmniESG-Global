import React, { useState } from 'react';
import { AuditLogEntry, AuditActionType } from '../../types/audit';
import { Tenant } from '../../types/tenant';
import { User } from '../../types/rbac';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertOctagon,
  FileText,
  Lock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface AuditLogTableProps {
  tenant: Tenant;
  logs: AuditLogEntry[];
  activeUser: User;
  onViewDiff: (log: AuditLogEntry) => void;
  onVerifyChain: () => void;
  onSimulateTamper: () => void;
  onExportCsv: () => void;
  onOpenAuditorSignoff: () => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  tenant,
  logs,
  activeUser,
  onViewDiff,
  onVerifyChain,
  onSimulateTamper,
  onExportCsv,
  onOpenAuditorSignoff,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.currentHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.justification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const isAuditor = activeUser.role === 'ESG_AUDITOR';

  return (
    <div className="space-y-6">
      {/* Enterprise Audit Header & Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Cryptographically Chained Audit Trail
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Tamper-proof compliance ledger for {tenant.name}. Every metric mutation, invoice adjustment, and factor override is permanently chained via SHA-256 cryptographic hashes with before/after state snapshots.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onVerifyChain}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verify Chain Integrity
            </button>

            {isAuditor && (
              <button
                onClick={onOpenAuditorSignoff}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                Auditor Sign-Off & Stamp
              </button>
            )}

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            {/* Tamper Test Demonstrator for Assurance */}
            <button
              onClick={onSimulateTamper}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-rose-300/80 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition-colors whitespace-nowrap"
              title="Demonstrates mathematical tamper detection by altering a previous block payload"
            >
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              Simulate Tamper
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, entity, justification, hash..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Action Filter:</span>
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="ALL">All Actions ({logs.length})</option>
              <option value="CREATE_EMISSION_RECORD">Create Record</option>
              <option value="UPDATE_EMISSION_RECORD">Update Record (Diff)</option>
              <option value="AUDITOR_VERIFICATION_SIGNOFF">Auditor Sign-off</option>
              <option value="BATCH_CSV_UPLOAD">Batch Upload</option>
              <option value="FACILITY_MAPPING_UPDATE">Entity Mapping Update</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2.5 px-3 font-semibold text-center w-16">Block #</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">User & Role</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Target Entity</th>
                <th className="py-2.5 px-3 font-semibold">Cryptographic SHA-256 Hash</th>
                <th className="py-2.5 px-3 font-semibold">Diff Summary</th>
                <th className="py-2.5 px-3 font-semibold text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const isTampered = log.id.startsWith('tampered_');
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isTampered ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      {/* Block Index */}
                      <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-slate-300">
                        #{log.blockIndex}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
                        {log.timestamp.replace('T', ' ').slice(0, 19)}
                      </td>

                      {/* User & Role */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{log.userName}</div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {log.userRole.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-emerald-400 font-medium">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                          {log.category}
                        </span>
                      </td>

                      {/* Target Entity */}
                      <td className="py-3 px-3">
                        <span className="text-white font-medium block truncate max-w-[150px]">
                          {log.entityName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {log.entityId}
                        </span>
                      </td>

                      {/* Cryptographic Hash */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {isTampered ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3" />
                            BROKEN: {log.currentHash.slice(0, 12)}...
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate max-w-[140px] text-slate-300" title={log.currentHash}>
                              {log.currentHash.slice(0, 14)}...
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-600 block">
                          prev: {log.previousHash.slice(0, 8)}...
                        </span>
                      </td>

                      {/* Diff Summary */}
                      <td className="py-3 px-3">
                        {log.diff && log.diff.length > 0 ? (
                          <div className="space-y-0.5">
                            {log.diff.slice(0, 2).map((d, i) => (
                              <div key={i} className="text-[11px] text-slate-300 truncate max-w-[200px]">
                                <span className="text-slate-500 font-mono">{d.label}: </span>
                                {d.oldValue !== null && (
                                  <span className="text-rose-400/80 line-through mr-1 font-mono">
                                    {String(d.oldValue)}
                                  </span>
                                )}
                                <span className="text-emerald-400 font-mono font-medium">
                                  {String(d.newValue)} {d.unit || ''}
                                </span>
                              </div>
                            ))}
                            {log.diff.length > 2 && (
                              <span className="text-[10px] text-slate-500">
                                +{log.diff.length - 2} more fields
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Genesis / State</span>
                        )}
                      </td>

                      {/* Inspection Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onViewDiff(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-3 h-3 text-emerald-400" />
                          View Diff
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
