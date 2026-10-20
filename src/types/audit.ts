import { UserRole } from './rbac';

export type AuditActionType =
  | 'CREATE_EMISSION_RECORD'
  | 'UPDATE_EMISSION_RECORD'
  | 'DELETE_EMISSION_RECORD'
  | 'RECALCULATE_SCOPE'
  | 'UPDATE_EMISSION_FACTOR'
  | 'BATCH_CSV_UPLOAD'
  | 'AUDITOR_VERIFICATION_SIGNOFF'
  | 'FACILITY_MAPPING_UPDATE'
  | 'ROLE_PERMISSION_UPDATE'
  | 'GLOBAL_TENANT_ONBOARD';

export interface AuditDiffItem {
  field: string;
  label: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
  unit?: string;
}

export interface AuditLogEntry {
  id: string;
  blockIndex: number;
  tenantId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userIp: string;
  action: AuditActionType;
  entityId: string;
  entityName: string;
  category: string;
  justification: string;
  beforeSnapshot: Record<string, any> | null;
  afterSnapshot: Record<string, any>;
  diff: AuditDiffItem[];
  previousHash: string;
  currentHash: string;
}

export interface CryptographicVerificationResult {
  isValid: boolean;
  totalBlocks: number;
  verifiedBlocks: number;
  brokenBlockIndex?: number;
  genesisHash: string;
  latestHash: string;
  verifiedAt: string;
  blocks: {
    index: number;
    id: string;
    action: string;
    computedHash: string;
    storedHash: string;
    matches: boolean;
  }[];
}
