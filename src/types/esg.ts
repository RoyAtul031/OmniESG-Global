export type ScopeCategory = 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3';

export type ActivityType =
  | 'DIESEL_GENSET'
  | 'NATURAL_GAS'
  | 'REFRIGERANTS'
  | 'PURCHASED_ELECTRICITY_GRID'
  | 'PURCHASED_ELECTRICITY_SOLAR_PPA'
  | 'BUSINESS_TRAVEL_FLIGHTS'
  | 'EMPLOYEE_COMMUTING'
  | 'WASTE_DISPOSAL_MUNICIPAL'
  | 'WATER_SUPPLY';

export interface EmissionRecord {
  id: string;
  tenantId: string;
  facilityId: string;
  facilityName: string;
  activityType: ActivityType;
  scope: ScopeCategory;
  periodYear: number;
  periodQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  periodMonth?: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissionFactorSource: string; // e.g. CEA CO2 Baseline v19, DEFRA 2024
  calculatedTco2e: number;
  evidenceDocumentName?: string;
  evidenceDocumentUrl?: string;
  meterId?: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reportedAt: string;
  status: 'SUBMITTED' | 'VERIFIED' | 'FLAGGED';
  auditNotes?: string;
}

export interface ScopeSummary {
  scope1Tco2e: number;
  scope2Tco2e: number; // location-based
  scope2MarketTco2e: number;
  scope3Tco2e: number;
  totalTco2e: number;
  previousYearTotalTco2e: number;
  percentChangeVsPreviousYear: number;
  target2030Tco2e: number;
  energyIntensityKwhPerSqFt: number;
  renewableEnergyPercent: number;
  waterRecycledPercent: number;
  wasteDiversionPercent: number;
}

export interface ComplianceReportConfig {
  framework: 'BRSR_CORE' | 'GHG_PROTOCOL' | 'GRI_STANDARDS' | 'SEC_CLIMATE';
  reportingPeriod: string;
  tenantId: string;
  includedScopes: ScopeCategory[];
  includeAuditorCertification: boolean;
  includeAuditTrailSample: boolean;
}
