/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { EsgOverview } from './components/Dashboard/EsgOverview';
import { AnomalyAlertBanner } from './components/Dashboard/AnomalyAlertBanner';
import { EmissionBreakdownChart } from './components/Dashboard/EmissionBreakdownChart';
import { CarbonPricingWidget } from './components/Dashboard/CarbonPricingWidget';
import { WidgetCustomizerModal, DashboardWidgetConfig } from './components/Dashboard/WidgetCustomizerModal';
import { EntityHierarchyTree } from './components/EntityMapping/EntityHierarchyTree';
import { FacilityDetailModal } from './components/EntityMapping/FacilityDetailModal';
import { AddFacilityModal } from './components/EntityMapping/AddFacilityModal';
import { AuditLogTable } from './components/AuditLogs/AuditLogTable';
import { AuditDiffModal } from './components/AuditLogs/AuditDiffModal';
import { ChainIntegrityVerifierModal } from './components/AuditLogs/ChainIntegrityVerifierModal';
import { AuditorSignoffModal } from './components/AuditLogs/AuditorSignoffModal';
import { LogEmissionModal } from './components/DataEntry/LogEmissionModal';
import { ComplianceReportsView } from './components/Reports/ComplianceReportsView';
import { ComplianceDossierModal } from './components/Reports/ComplianceDossierModal';
import { RbacPermissionsMatrix } from './components/Admin/RbacPermissionsMatrix';
import { TenantSettingsView } from './components/Admin/TenantSettingsView';
import { OnboardCompanyModal } from './components/Admin/OnboardCompanyModal';
import { LandingLoginPage } from './components/Auth/LandingLoginPage';

import { enterpriseStorage } from './utils/storage';
import { exportAuditLogsToCsv, exportComplianceReportCsv } from './utils/export';
import { Tenant, TenantSettings } from './types/tenant';
import { User, ROLE_CONFIGS } from './types/rbac';
import { FacilityEntity } from './types/entity';
import { EmissionRecord, ScopeSummary } from './types/esg';
import { AuditLogEntry, CryptographicVerificationResult } from './types/audit';

import { LayoutGrid, Sparkles, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  // Authentication & session state (defaults to false to present landing/login page first)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Core state
  const [activeTenantId, setActiveTenantId] = useState<string>('tenant_wework');
  const [activeUserId, setActiveUserId] = useState<string>('user_priya');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const [tenants, setTenants] = useState<Tenant[]>(() => enterpriseStorage.getTenants());
  const [users, setUsers] = useState<User[]>(() => enterpriseStorage.getUsers());
  const [facilities, setFacilities] = useState<FacilityEntity[]>([]);
  const [emissions, setEmissions] = useState<EmissionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);

  // Modals state
  const [isLogEmissionOpen, setIsLogEmissionOpen] = useState(false);
  const [preselectedFacilityId, setPreselectedFacilityId] = useState<string | undefined>(undefined);
  const [selectedFacilityForDetail, setSelectedFacilityForDetail] = useState<FacilityEntity | null>(null);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [selectedAuditLogForDiff, setSelectedAuditLogForDiff] = useState<AuditLogEntry | null>(null);
  const [isChainVerifierOpen, setIsChainVerifierOpen] = useState(false);
  const [isAuditorSignoffOpen, setIsAuditorSignoffOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierFramework, setDossierFramework] = useState('SEBI BRSR Core');
  const [isOnboardCompanyOpen, setIsOnboardCompanyOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dashboard customizable widget configuration
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>([
    { id: 'overview_cards', label: 'Executive Scope 1, 2, 3 Totals', description: 'Gross GHG emissions and target progress', visible: true },
    { id: 'carbon_pricing', label: 'Internal Carbon Shadow Fee & Financial Liability', description: 'Real-time financial exposure & TCFD shadow carbon liability calculator', visible: true },
    { id: 'intensity_metrics', label: 'Operational Efficiency Kpis', description: 'Energy intensity, renewable mix, water circularity', visible: true },
    { id: 'anomaly_banner', label: 'Facility Anomaly Alerts', description: 'Instant alerts on consumption baseline spikes', visible: true },
    { id: 'breakdown_table', label: 'Inventory Distribution Grid', description: 'Breakdown by facility assets and activity categories', visible: true },
  ]);

  // Load state from enterpriseStorage
  const refreshAllState = () => {
    const t = enterpriseStorage.getTenants();
    const u = enterpriseStorage.getUsers();
    const curTenantId = enterpriseStorage.getActiveTenantId();
    const curUserId = enterpriseStorage.getActiveUserId();

    setTenants(t);
    setUsers(u);
    setActiveTenantId(curTenantId);
    setActiveUserId(curUserId);

    setFacilities(enterpriseStorage.getFacilities(curTenantId));
    setEmissions(enterpriseStorage.getEmissionRecords(curTenantId));
    setAuditLogs(enterpriseStorage.getAuditLogs(curTenantId));
    setTenantSettings(enterpriseStorage.getTenantSettings(curTenantId));
  };

  useEffect(() => {
    refreshAllState();
  }, []);

  const activeTenant = useMemo(() => {
    return tenants.find(t => t.id === activeTenantId) || tenants[0] || ({} as Tenant);
  }, [tenants, activeTenantId]);

  const activeUser = useMemo(() => {
    return users.find(u => u.id === activeUserId) || users[0] || ({} as User);
  }, [users, activeUserId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Authentication login/logout actions
  const handleLogin = (tenantId: string, userId: string) => {
    enterpriseStorage.setActiveTenantId(tenantId);
    enterpriseStorage.setActiveUserId(userId);
    setActiveTenantId(tenantId);
    setActiveUserId(userId);
    setFacilities(enterpriseStorage.getFacilities(tenantId));
    setEmissions(enterpriseStorage.getEmissionRecords(tenantId));
    setAuditLogs(enterpriseStorage.getAuditLogs(tenantId));
    setTenantSettings(enterpriseStorage.getTenantSettings(tenantId));
    setIsAuthenticated(true);

    const u = users.find(usr => usr.id === userId);
    const t = tenants.find(tn => tn.id === tenantId);
    showToast(`Welcome back, ${u?.name || 'User'}! Connected to ${t?.name || 'Enterprise'}.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of enterprise session. Returned to OmniESG Global portal.');
  };

  // Switch tenant
  const handleTenantChange = (newTenantId: string) => {
    enterpriseStorage.setActiveTenantId(newTenantId);
    setActiveTenantId(newTenantId);
    setFacilities(enterpriseStorage.getFacilities(newTenantId));
    setEmissions(enterpriseStorage.getEmissionRecords(newTenantId));
    setAuditLogs(enterpriseStorage.getAuditLogs(newTenantId));
    setTenantSettings(enterpriseStorage.getTenantSettings(newTenantId));
    showToast(`Switched active tenant to ${tenants.find(t => t.id === newTenantId)?.name}`);
  };

  // Switch user role
  const handleUserChange = (newUserId: string) => {
    enterpriseStorage.setActiveUserId(newUserId);
    setActiveUserId(newUserId);
    const u = users.find(usr => usr.id === newUserId);
    if (u) {
      showToast(`Logged in as ${u.name} (${ROLE_CONFIGS[u.role].label})`);
    }
  };

  // Computed Scope Summary for active tenant
  const scopeSummary: ScopeSummary = useMemo(() => {
    let s1 = 0;
    let s2 = 0;
    let s2Market = 0;
    let s3 = 0;

    facilities.forEach(f => {
      s1 += f.scope1Tco2e;
      s2 += f.scope2Tco2e;
      s3 += f.scope3Tco2e;
      s2Market += f.scope2Tco2e * (1 - f.renewableEnergyPercent / 100);
    });

    const total = s1 + s2 + s3;
    const prevYearTotal = total * 1.14; // baseline calculation
    const target2030 = total * (1 - (activeTenant.targetReductionPercent || 45) / 100);

    const totalFloor = activeTenant.totalFloorAreaSqFt || 1000000;
    const totalKwh = (s2 / 0.78) * 1000;
    const intensity = totalKwh / totalFloor;

    const avgRenewable = facilities.length > 0
      ? facilities.reduce((acc, f) => acc + f.renewableEnergyPercent, 0) / facilities.length
      : 55;

    const avgWater = facilities.length > 0
      ? facilities.reduce((acc, f) => acc + f.waterRecycledPercent, 0) / facilities.length
      : 70;

    const avgWaste = facilities.length > 0
      ? facilities.reduce((acc, f) => acc + f.wasteDivertedPercent, 0) / facilities.length
      : 65;

    return {
      scope1Tco2e: s1,
      scope2Tco2e: s2,
      scope2MarketTco2e: s2Market,
      scope3Tco2e: s3,
      totalTco2e: total,
      previousYearTotalTco2e: prevYearTotal,
      percentChangeVsPreviousYear: -12.4,
      target2030Tco2e: target2030,
      energyIntensityKwhPerSqFt: intensity,
      renewableEnergyPercent: avgRenewable,
      waterRecycledPercent: avgWater,
      wasteDiversionPercent: avgWaste,
    };
  }, [facilities, activeTenant]);

  const facilitiesWithAnomaly = useMemo(() => {
    return facilities.filter(f => f.hasAnomaly);
  }, [facilities]);

  // Actions
  const handleSaveEmissionRecord = async (record: EmissionRecord, justification: string) => {
    enterpriseStorage.saveEmissionRecord(record);

    await enterpriseStorage.appendAuditLog({
      tenantId: activeTenant.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'CREATE_EMISSION_RECORD',
      entityId: record.facilityId,
      entityName: record.facilityName,
      category: `Scope ${record.scope} Data Submission`,
      justification,
      beforeSnapshot: null,
      afterSnapshot: {
        recordId: record.id,
        activityType: record.activityType,
        quantity: record.quantity,
        unit: record.unit,
        emissionFactor: record.emissionFactor,
        calculatedTco2e: record.calculatedTco2e,
        evidenceDocument: record.evidenceDocumentName,
      },
      diff: [
        { field: 'quantity', label: 'Billed Quantity', oldValue: null, newValue: record.quantity, unit: record.unit },
        { field: 'calculatedTco2e', label: 'Calculated tCO2e', oldValue: null, newValue: record.calculatedTco2e, unit: 'tCO2e' },
      ],
    });

    refreshAllState();
    showToast(`Committed ${record.calculatedTco2e} tCO2e to audit block ledger`);
  };

  const handleAddFacility = async (newFacility: FacilityEntity, justification: string) => {
    enterpriseStorage.saveFacility(newFacility);

    await enterpriseStorage.appendAuditLog({
      tenantId: activeTenant.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'FACILITY_MAPPING_UPDATE',
      entityId: newFacility.id,
      entityName: newFacility.name,
      category: 'Corporate Entity Mapping',
      justification,
      beforeSnapshot: null,
      afterSnapshot: {
        facilityId: newFacility.id,
        code: newFacility.code,
        city: newFacility.city,
        grossFloorAreaSqFt: newFacility.grossFloorAreaSqFt,
        contributor: newFacility.assignedContributorName,
      },
      diff: [
        { field: 'name', label: 'Facility Name', oldValue: null, newValue: newFacility.name },
        { field: 'grossFloorAreaSqFt', label: 'Gross Floor Area', oldValue: null, newValue: newFacility.grossFloorAreaSqFt, unit: 'sq ft' },
      ],
    });

    refreshAllState();
    showToast(`Added facility ${newFacility.name} & committed audit block`);
  };

  const handleSaveSettings = async (settings: TenantSettings, justification: string) => {
    const prevSettings = tenantSettings;
    enterpriseStorage.updateTenantSettings(settings);

    await enterpriseStorage.appendAuditLog({
      tenantId: activeTenant.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'UPDATE_EMISSION_FACTOR',
      entityId: activeTenant.id,
      entityName: `${activeTenant.name} Policy Config`,
      category: 'Tenant Factors Calibration',
      justification,
      beforeSnapshot: prevSettings as any,
      afterSnapshot: settings as any,
      diff: [
        { field: 'gridEmissionFactor', label: 'Grid Electricity Factor', oldValue: prevSettings?.gridEmissionFactor ?? null, newValue: settings.gridEmissionFactor, unit: 'kgCO2e/kWh' },
        { field: 'dieselEmissionFactor', label: 'Diesel Genset Factor', oldValue: prevSettings?.dieselEmissionFactor ?? null, newValue: settings.dieselEmissionFactor, unit: 'kgCO2e/L' },
      ],
    });

    refreshAllState();
    showToast('Updated tenant baseline factors & committed audit block');
  };

  const handleAuditorSignoff = async (params: { standard: string; opinion: string; notes: string }) => {
    const updatedTenant: Tenant = {
      ...activeTenant,
      auditVerificationStatus: 'VERIFIED',
      verifiedBy: `${activeUser.name}, ${activeUser.title}`,
      verifiedAt: new Date().toISOString(),
    };
    enterpriseStorage.updateTenant(updatedTenant);

    await enterpriseStorage.appendAuditLog({
      tenantId: activeTenant.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'AUDITOR_VERIFICATION_SIGNOFF',
      entityId: activeTenant.id,
      entityName: activeTenant.name,
      category: 'Independent Audit Sign-Off',
      justification: params.notes,
      beforeSnapshot: { status: activeTenant.auditVerificationStatus },
      afterSnapshot: { status: 'VERIFIED', opinion: params.opinion, standard: params.standard },
      diff: [
        { field: 'auditVerificationStatus', label: 'Verification Status', oldValue: activeTenant.auditVerificationStatus, newValue: 'VERIFIED' },
        { field: 'auditorOpinion', label: 'Assurance Opinion', oldValue: null, newValue: params.opinion },
      ],
    });

    refreshAllState();
    showToast('Signed off compliance assurance & anchored cryptographic seal');
  };

  const handleRunVerification = async (): Promise<CryptographicVerificationResult> => {
    return await enterpriseStorage.verifyCryptographicChain(activeTenant.id);
  };

  const handleSimulateTamper = () => {
    enterpriseStorage.simulateTampering(1);
    refreshAllState();
    setIsChainVerifierOpen(true);
    showToast('Simulated database tampering on Block #1. Run verifier to inspect detection!');
  };

  const handleRestoreConsensus = () => {
    enterpriseStorage.resetAllData();
    refreshAllState();
    showToast('Restored cryptographic consensus and clean seed data');
  };

  const handleInvestigateAnomaly = (facility: FacilityEntity) => {
    const anomalyLog = auditLogs.find(l => l.entityId === facility.id && l.diff.some(d => d.newValue && Number(d.newValue) > 0));
    if (anomalyLog) {
      setSelectedAuditLogForDiff(anomalyLog);
    } else if (auditLogs.length > 0) {
      setSelectedAuditLogForDiff(auditLogs[0]);
    }
  };

  const handleOpenDossier = (frameworkName: string) => {
    setDossierFramework(frameworkName);
    setIsDossierOpen(true);
  };

  const handleCompanyCreated = async (newTenant: Tenant, initialFacility: FacilityEntity) => {
    enterpriseStorage.addTenant(newTenant);
    enterpriseStorage.saveFacility(initialFacility);
    enterpriseStorage.updateTenantSettings({
      tenantId: newTenant.id,
      gridEmissionFactor: 0.78,
      dieselEmissionFactor: 2.68,
      waterEmissionFactor: 0.35,
      auditLogRetentionDays: 2555,
      tamperProofChainingEnabled: true,
      strictMfaRequired: true,
      ipWhitelistEnabled: false,
    });

    await enterpriseStorage.appendAuditLog({
      tenantId: newTenant.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'GLOBAL_TENANT_ONBOARD',
      entityId: newTenant.id,
      entityName: newTenant.name,
      category: 'Enterprise Global Provisioning',
      justification: `Genesis ledger initialized for ${newTenant.name} (${newTenant.region || 'Global'}) with baseline ${newTenant.baselineYear}.`,
      beforeSnapshot: null,
      afterSnapshot: {
        tenantId: newTenant.id,
        name: newTenant.name,
        country: newTenant.country,
        currency: newTenant.currency,
        reportingYear: newTenant.reportingYear,
        standards: newTenant.complianceStandards,
      },
      diff: [
        { field: 'name', label: 'Enterprise Name', oldValue: null, newValue: newTenant.name },
        { field: 'currency', label: 'Operating Currency', oldValue: null, newValue: newTenant.currency || 'USD ($)' },
      ],
    });

    try {
      await fetch('http://127.0.0.1:8000/api/tenants/onboard_company/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTenant.name,
          country: newTenant.country,
          region: newTenant.region,
          currency: newTenant.currency,
          industry: newTenant.industry,
          baselineYear: newTenant.baselineYear,
          reportingYear: newTenant.reportingYear,
          standards: newTenant.complianceStandards,
          targetReductionPercent: newTenant.targetReductionPercent,
          facilityName: initialFacility.name,
          city: initialFacility.city,
          floorAreaSqFt: initialFacility.grossFloorAreaSqFt,
          scope1Tco2e: initialFacility.scope1Tco2e,
          scope2Tco2e: initialFacility.scope2Tco2e,
          scope3Tco2e: initialFacility.scope3Tco2e,
        }),
      });
    } catch {
      // Offline fallback
    }

    refreshAllState();
    handleTenantChange(newTenant.id);
    showToast(`Registered ${newTenant.name} & minted cryptographic Genesis Ledger Block #0`);
  };

  const isWidgetVisible = (widgetId: string) => {
    return widgets.find(w => w.id === widgetId)?.visible ?? true;
  };

  // If user is not authenticated, show the landing & login portal first
  if (!isAuthenticated) {
    return (
      <LandingLoginPage
        tenants={tenants}
        users={users}
        onLogin={handleLogin}
      />
    );
  }

  if (!activeTenant.id || !tenantSettings) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
        Initializing OmniESG Global Enterprise workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Header with Context Controls */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeTenant={activeTenant}
        tenants={tenants}
        onTenantChange={handleTenantChange}
        activeUser={activeUser}
        users={users}
        onUserChange={handleUserChange}
        onOpenDataEntry={() => {
          setPreselectedFacilityId(undefined);
          setIsLogEmissionOpen(true);
        }}
        onOpenOnboardCompany={() => setIsOnboardCompanyOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Executive Dashboard */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Dashboard Sub-Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {activeTenant.name} · Executive Sustainability Console
                </h1>
                <span className="text-xs text-slate-400">
                  Fiscal Period {activeTenant.reportingYear} · Baseline: {activeTenant.baselineYear} · Standards: {activeTenant.complianceStandards.join(' · ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
                  Customize Dashboard
                </button>
              </div>
            </div>

            {/* Widget 1: Scope 1, 2, 3 Totals & KPI Grid */}
            {isWidgetVisible('overview_cards') && (
              <EsgOverview
                tenant={activeTenant}
                summary={scopeSummary}
                onNavigateToAudit={() => setCurrentTab('audit-logs')}
              />
            )}

            {/* Widget 2: Internal Shadow Carbon Pricing & Financial Liability */}
            {isWidgetVisible('carbon_pricing') && (
              <CarbonPricingWidget
                tenant={activeTenant}
                summary={scopeSummary}
              />
            )}

            {/* Widget 2: Facility Anomaly Banner */}
            {isWidgetVisible('anomaly_banner') && (
              <AnomalyAlertBanner
                facilitiesWithAnomaly={facilitiesWithAnomaly}
                onInvestigate={handleInvestigateAnomaly}
              />
            )}

            {/* Widget 3: GHG Distribution by Facility & Activity */}
            {isWidgetVisible('breakdown_table') && (
              <EmissionBreakdownChart
                facilities={facilities}
                emissions={emissions}
                onSelectFacility={(facId) => {
                  const target = facilities.find(f => f.id === facId);
                  if (target) setSelectedFacilityForDetail(target);
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Entity Mapping */}
        {currentTab === 'entity-mapping' && (
          <div className="animate-in fade-in duration-200">
            <EntityHierarchyTree
              tenant={activeTenant}
              facilities={facilities}
              activeUser={activeUser}
              onSelectFacility={setSelectedFacilityForDetail}
              onOpenAddFacility={() => setIsAddFacilityOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Cryptographic Audit Logs */}
        {currentTab === 'audit-logs' && (
          <div className="animate-in fade-in duration-200">
            <AuditLogTable
              tenant={activeTenant}
              logs={auditLogs}
              activeUser={activeUser}
              onViewDiff={setSelectedAuditLogForDiff}
              onVerifyChain={() => setIsChainVerifierOpen(true)}
              onSimulateTamper={handleSimulateTamper}
              onExportCsv={() => exportAuditLogsToCsv(activeTenant, auditLogs)}
              onOpenAuditorSignoff={() => setIsAuditorSignoffOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Compliance Reports */}
        {currentTab === 'reports' && (
          <div className="animate-in fade-in duration-200">
            <ComplianceReportsView
              tenant={activeTenant}
              facilities={facilities}
              emissions={emissions}
              scopeSummary={scopeSummary}
              activeUser={activeUser}
              onExportCsv={() => exportComplianceReportCsv(activeTenant, facilities, emissions, scopeSummary)}
              onOpenDossier={handleOpenDossier}
            />
          </div>
        )}

        {/* Tab 5: RBAC & Governance Settings */}
        {currentTab === 'governance' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <RbacPermissionsMatrix />
            <TenantSettingsView
              tenant={activeTenant}
              settings={tenantSettings}
              activeUser={activeUser}
              onSaveSettings={handleSaveSettings}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              OmniESG Global Enterprise OS · Global Multi-Tenant Sustainability Cloud · Cross-Border Compliance (SEC · CSRD · SEBI BRSR · ISSB)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>ISAE 3000 / SEBI BRSR Core</span>
            <span>·</span>
            <span>SHA-256 Chained Consensus</span>
          </div>
        </div>
      </footer>

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <LogEmissionModal
        isOpen={isLogEmissionOpen}
        onClose={() => setIsLogEmissionOpen(false)}
        tenant={activeTenant}
        tenantSettings={tenantSettings}
        facilities={facilities}
        activeUser={activeUser}
        preselectedFacilityId={preselectedFacilityId}
        onSaveRecord={handleSaveEmissionRecord}
      />

      <FacilityDetailModal
        facility={selectedFacilityForDetail}
        onClose={() => setSelectedFacilityForDetail(null)}
        activeUser={activeUser}
        onLogDataForFacility={(facId) => {
          setPreselectedFacilityId(facId);
          setIsLogEmissionOpen(true);
        }}
      />

      <AddFacilityModal
        isOpen={isAddFacilityOpen}
        onClose={() => setIsAddFacilityOpen(false)}
        tenant={activeTenant}
        users={users}
        onAddFacility={handleAddFacility}
      />

      <AuditDiffModal
        log={selectedAuditLogForDiff}
        onClose={() => setSelectedAuditLogForDiff(null)}
      />

      <ChainIntegrityVerifierModal
        isOpen={isChainVerifierOpen}
        onClose={() => setIsChainVerifierOpen(false)}
        tenant={activeTenant}
        onRunVerification={handleRunVerification}
        onRestoreConsensus={handleRestoreConsensus}
      />

      <AuditorSignoffModal
        isOpen={isAuditorSignoffOpen}
        onClose={() => setIsAuditorSignoffOpen(false)}
        tenant={activeTenant}
        auditor={activeUser}
        onSignoff={handleAuditorSignoff}
      />

      <WidgetCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgets={widgets}
        onToggleWidget={(id) => {
          setWidgets(prev => prev.map(w => (w.id === id ? { ...w, visible: !w.visible } : w)));
        }}
        onResetLayout={() => {
          setWidgets(prev => prev.map(w => ({ ...w, visible: true })));
        }}
      />

      <ComplianceDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        frameworkName={dossierFramework}
        tenant={activeTenant}
        facilities={facilities}
        scopeSummary={scopeSummary}
        latestAuditLog={auditLogs[0]}
      />

      <OnboardCompanyModal
        isOpen={isOnboardCompanyOpen}
        onClose={() => setIsOnboardCompanyOpen(false)}
        onCompanyCreated={handleCompanyCreated}
      />
    </div>
  );
}
