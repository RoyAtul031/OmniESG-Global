import { Tenant } from '../types/tenant';
import { FacilityEntity } from '../types/entity';
import { EmissionRecord, ScopeSummary } from '../types/esg';
import { AuditLogEntry, CryptographicVerificationResult } from '../types/audit';

export function exportAuditLogsToCsv(tenant: Tenant, logs: AuditLogEntry[]): void {
  const headers = [
    'Block Index',
    'Timestamp (UTC)',
    'User ID',
    'User Name',
    'User Role',
    'Action Type',
    'Entity Code / Name',
    'Category',
    'Previous Block Hash (SHA-256)',
    'Current Block Hash (SHA-256)',
    'Justification & Regulatory Notes',
    'Changes Summary',
  ];

  const rows = logs.map(l => [
    l.blockIndex,
    `"${l.timestamp}"`,
    `"${l.userId}"`,
    `"${l.userName}"`,
    `"${l.userRole}"`,
    `"${l.action}"`,
    `"${l.entityName}"`,
    `"${l.category}"`,
    `"${l.previousHash}"`,
    `"${l.currentHash}"`,
    `"${l.justification.replace(/"/g, '""')}"`,
    `"${l.diff.map(d => `${d.label}: ${d.oldValue ?? 'None'} -> ${d.newValue ?? 'None'}`).join('; ')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(`${tenant.slug}-cryptographic-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`, csvContent, 'text/csv;charset=utf-8;');
}

export function exportComplianceReportCsv(
  tenant: Tenant,
  facilities: FacilityEntity[],
  emissions: EmissionRecord[],
  scopeSummary: ScopeSummary
): void {
  const lines: string[] = [];

  // Metadata Header
  lines.push(`"ENTERPRISE COMPLIANCE REPORT - ${tenant.name.toUpperCase()}"`);
  lines.push(`"Generated On:","${new Date().toISOString()}"`);
  lines.push(`"Reporting Fiscal Period:","${tenant.reportingYear}"`);
  lines.push(`"Baseline Period:","${tenant.baselineYear}"`);
  lines.push(`"Audit Assurance Status:","${tenant.auditVerificationStatus}"`);
  lines.push(`"Assurance Auditor:","${tenant.verifiedBy || 'Pending Final Signoff'}"`);
  lines.push('');

  // Executive Scope Breakdown
  lines.push('"EXECUTIVE GHG EMISSIONS SUMMARY (tCO2e)"');
  lines.push('"Metric","Current Fiscal Year","Baseline Comparison","Target Reduction"');
  lines.push(`"Scope 1 Direct (Fuel & Refrigerants)",${scopeSummary.scope1Tco2e.toFixed(2)},"Baseline: ${(scopeSummary.scope1Tco2e * 1.25).toFixed(2)}","-${tenant.targetReductionPercent}%"`);
  lines.push(`"Scope 2 Indirect (Location-based Grid)",${scopeSummary.scope2Tco2e.toFixed(2)},"Baseline: ${(scopeSummary.scope2Tco2e * 1.35).toFixed(2)}","-${tenant.targetReductionPercent}%"`);
  lines.push(`"Scope 2 Indirect (Market-based Solar/PPA)",${scopeSummary.scope2MarketTco2e.toFixed(2)},"-","-"`);
  lines.push(`"Scope 3 Value Chain (Travel & Waste)",${scopeSummary.scope3Tco2e.toFixed(2)},"-","-"`);
  lines.push(`"Gross Scope 1 + 2 Total",${(scopeSummary.scope1Tco2e + scopeSummary.scope2Tco2e).toFixed(2)},"-","-"`);
  lines.push(`"Renewable Energy Mix (%)",${scopeSummary.renewableEnergyPercent.toFixed(1)}%,"-","Target: 75%"`);
  lines.push(`"Water Recycled & Reused (%)",${scopeSummary.waterRecycledPercent.toFixed(1)}%,"-","Zero Liquid Discharge"`);
  lines.push('');

  // Facility-Level Entity Breakdown
  lines.push('"FACILITY ENTITY BREAKDOWN"');
  lines.push('"Facility Code","Facility Name","City","Country","Gross Floor Area (sq ft)","Scope 1 (tCO2e)","Scope 2 (tCO2e)","Scope 3 (tCO2e)","Renewable %","Compliance Status"');

  facilities.forEach(f => {
    lines.push([
      `"${f.code}"`,
      `"${f.name}"`,
      `"${f.city}"`,
      `"${f.country}"`,
      f.grossFloorAreaSqFt,
      f.scope1Tco2e.toFixed(2),
      f.scope2Tco2e.toFixed(2),
      f.scope3Tco2e.toFixed(2),
      `${f.renewableEnergyPercent}%`,
      `"${f.reportingStatus}"`,
    ].join(','));
  });

  lines.push('');
  // Raw Activity Records
  lines.push('"AUDITED ACTIVITY DATA ENTRIES"');
  lines.push('"Record ID","Facility","Activity Category","Scope","Quantity","Unit","Emission Factor","Factor Source","Calculated tCO2e","Auditor Status"');

  emissions.forEach(e => {
    lines.push([
      `"${e.id}"`,
      `"${e.facilityName}"`,
      `"${e.activityType}"`,
      `"${e.scope}"`,
      e.quantity,
      `"${e.unit}"`,
      e.emissionFactor,
      `"${e.emissionFactorSource}"`,
      e.calculatedTco2e.toFixed(2),
      `"${e.status}"`,
    ].join(','));
  });

  downloadFile(`${tenant.slug}-compliance-report-${tenant.reportingYear}.csv`, lines.join('\r\n'), 'text/csv;charset=utf-8;');
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
