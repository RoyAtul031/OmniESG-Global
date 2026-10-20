export type UserRole =
  | 'SUSTAINABILITY_MANAGER'
  | 'ESG_AUDITOR'
  | 'FACILITY_CONTRIBUTOR'
  | 'TENANT_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  tenantId: string;
  assignedFacilityId?: string; // If FACILITY_CONTRIBUTOR, restricted to this facility
  avatarColor: string;
  initials: string;
}

export type PermissionAction =
  | 'view_dashboard'
  | 'edit_metrics'
  | 'upload_facility_data'
  | 'view_all_entities'
  | 'edit_entity_mapping'
  | 'view_audit_logs'
  | 'verify_audit_logs' // Auditor signoff
  | 'export_compliance_report'
  | 'manage_tenant_settings'
  | 'manage_users';

export interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  permissions: PermissionAction[];
  badgeColor: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  SUSTAINABILITY_MANAGER: {
    role: 'SUSTAINABILITY_MANAGER',
    label: 'Sustainability Manager',
    description: 'Full read/write on corporate GHG targets, emission factors, facility data, and entity mapping.',
    permissions: [
      'view_dashboard',
      'edit_metrics',
      'upload_facility_data',
      'view_all_entities',
      'edit_entity_mapping',
      'view_audit_logs',
      'export_compliance_report',
    ],
    badgeColor: 'emerald',
  },
  ESG_AUDITOR: {
    role: 'ESG_AUDITOR',
    label: 'ESG Auditor',
    description: 'Independent compliance assurance. Read-only verification, tamper-proof audit verification, and digital sign-off.',
    permissions: [
      'view_dashboard',
      'view_all_entities',
      'view_audit_logs',
      'verify_audit_logs',
      'export_compliance_report',
    ],
    badgeColor: 'amber',
  },
  FACILITY_CONTRIBUTOR: {
    role: 'FACILITY_CONTRIBUTOR',
    label: 'Facility Contributor',
    description: 'Restricted field operator. Can only submit meter and activity data for assigned facility.',
    permissions: [
      'view_dashboard',
      'upload_facility_data',
    ],
    badgeColor: 'blue',
  },
  TENANT_ADMIN: {
    role: 'TENANT_ADMIN',
    label: 'Tenant Administrator',
    description: 'Enterprise governance. Manages tenant configuration, RBAC permissions, audit retention, and API credentials.',
    permissions: [
      'view_dashboard',
      'view_all_entities',
      'view_audit_logs',
      'export_compliance_report',
      'manage_tenant_settings',
      'manage_users',
    ],
    badgeColor: 'purple',
  },
};
