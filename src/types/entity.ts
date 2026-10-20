export type EntityType = 'ENTERPRISE_HOLDING' | 'REGIONAL_DIVISION' | 'FACILITY_PROPERTY';

export interface MeterDevice {
  id: string;
  name: string;
  utilityType: 'ELECTRICITY_GRID' | 'SOLAR_ROOFTOP' | 'DIESEL_GENSET' | 'WATER_MAINS' | 'HVAC_CHILLER';
  scope: 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3';
  unit: 'kWh' | 'liters' | 'm3' | 'metric_tons';
  status: 'ONLINE' | 'CALIBRATION_DUE' | 'OFFLINE';
  lastReadingTimestamp: string;
  currentQuarterUsage: number;
}

export interface FacilityEntity {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: EntityType;
  parentId?: string; // Links to parent division or holding
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  grossFloorAreaSqFt: number;
  occupancyCount: number;
  assignedManagerId: string;
  assignedManagerName: string;
  assignedContributorId: string;
  assignedContributorName: string;
  meters: MeterDevice[];
  scope1Tco2e: number;
  scope2Tco2e: number;
  scope3Tco2e: number;
  renewableEnergyPercent: number;
  waterRecycledPercent: number;
  wasteDivertedPercent: number;
  reportingStatus: 'COMPLETE' | 'IN_PROGRESS' | 'NEEDS_DATA';
  hasAnomaly: boolean;
  anomalyNote?: string;
}
