import React from 'react';
import { ROLE_CONFIGS, UserRole, PermissionAction } from '../../types/rbac';
import { Shield, Check, X, Lock, Users, Key } from 'lucide-react';

export const RbacPermissionsMatrix: React.FC = () => {
  const roles: UserRole[] = [
    'SUSTAINABILITY_MANAGER',
    'ESG_AUDITOR',
    'FACILITY_CONTRIBUTOR',
    'TENANT_ADMIN',
  ];

  const actions: { id: PermissionAction; label: string; category: string }[] = [
    { id: 'view_dashboard', label: 'View ESG Executive Dashboards', category: 'Analytics' },
    { id: 'edit_metrics', label: 'Create & Modify Corporate Emissions Data', category: 'Data Operations' },
    { id: 'upload_facility_data', label: 'Submit Activity Invoices & Meter Logs', category: 'Data Operations' },
    { id: 'view_all_entities', label: 'View All Global Facilities & Assets', category: 'Entity Mapping' },
    { id: 'edit_entity_mapping', label: 'Add/Edit Facilities & Assign Contributors', category: 'Entity Mapping' },
    { id: 'view_audit_logs', label: 'Inspect Cryptographic Audit Trail', category: 'Audit & Compliance' },
    { id: 'verify_audit_logs', label: 'Perform Assurance Verification & Digital Sign-Off', category: 'Audit & Compliance' },
    { id: 'export_compliance_report', label: 'Export BRSR / GHG Protocol Compliance Packs', category: 'Reporting' },
    { id: 'manage_tenant_settings', label: 'Configure Emission Factors & Baseline Years', category: 'Administration' },
    { id: 'manage_users', label: 'Manage Roles, API Keys & Retention Rules', category: 'Administration' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            Role-Based Access Control (RBAC) Enforcement Matrix
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Granular permission policies applied across enterprise tenants. Enforced on both frontend UI components and backend REST API endpoints to preserve auditor independence and data integrity.
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-300">
                <th className="py-3 px-4 font-semibold w-1/3">System Capability / API Action</th>
                {roles.map(r => (
                  <th key={r} className="py-3 px-3 font-semibold text-center">
                    <span className="block text-white font-bold">{ROLE_CONFIGS[r].label}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">
                      Role: {r}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {actions.map(action => (
                <tr key={action.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{action.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Category: {action.category} · perm: {action.id}
                    </span>
                  </td>
                  {roles.map(r => {
                    const hasPerm = ROLE_CONFIGS[r].permissions.includes(action.id);
                    const isFacilityRestricted = r === 'FACILITY_CONTRIBUTOR' && action.id === 'upload_facility_data';

                    return (
                      <td key={r} className="py-3 px-3 text-center">
                        {hasPerm ? (
                          <div className="inline-flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            {isFacilityRestricted && (
                              <span className="text-[9px] text-blue-400 font-mono mt-0.5">
                                Assigned Facility Only
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                              <X className="w-3.5 h-3.5 stroke-[2]" />
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
