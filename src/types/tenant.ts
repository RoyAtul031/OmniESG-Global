export interface Tenant {
  id: string;
  name: string;
  slug: string;
  hqLocation: string;
  industry: string;
  totalFloorAreaSqFt: number;
  activeFacilitiesCount: number;
  reportingYear: string;
  baselineYear: string;
  targetReductionPercent: number; // e.g. 45% by 2030
  complianceStandards: string[]; // e.g. BRSR Core, GHG Protocol, GRI, SEC Climate
  auditVerificationStatus: 'UNAUDITED' | 'IN_REVIEW' | 'VERIFIED';
  verifiedBy?: string;
  verifiedAt?: string;
  currency?: string;
  region?: string;
  country?: string;
}

export interface TenantSettings {
  tenantId: string;
  gridEmissionFactor: number; // kgCO2e/kWh
  dieselEmissionFactor: number; // kgCO2e/liter
  waterEmissionFactor: number; // kgCO2e/m3
  auditLogRetentionDays: number;
  tamperProofChainingEnabled: boolean;
  strictMfaRequired: boolean;
  ipWhitelistEnabled: boolean;
}
