import React from 'react';
import { User, UserRole, ROLE_CONFIGS } from '../types/rbac';
import { Tenant } from '../types/tenant';
import {
  ShieldCheck,
  Building2,
  UserCircle2,
  ArrowRightLeft,
  FileSpreadsheet,
  PlusCircle,
  CheckCircle2,
  Globe2,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeTenant: Tenant;
  tenants: Tenant[];
  onTenantChange: (tenantId: string) => void;
  activeUser: User;
  users: User[];
  onUserChange: (userId: string) => void;
  onOpenDataEntry: () => void;
  onOpenOnboardCompany?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  activeTenant,
  tenants,
  onTenantChange,
  activeUser,
  users,
  onUserChange,
  onOpenDataEntry,
  onOpenOnboardCompany,
  onLogout,
}) => {
  const roleConfig = (activeUser && activeUser.role && ROLE_CONFIGS[activeUser.role]) 
    ? ROLE_CONFIGS[activeUser.role] 
    : ROLE_CONFIGS['SUSTAINABILITY_MANAGER'];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Universal 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className="text-left group flex items-center gap-2.5 focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
                  OmniESG Global
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block -mt-0.5 tracking-wider uppercase">
                  Enterprise OS
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'dashboard'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('entity-mapping')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'entity-mapping'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entity Mapping
            </button>
            <button
              onClick={() => onTabChange('audit-logs')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'audit-logs'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cryptographic Audit Logs
            </button>
            <button
              onClick={() => onTabChange('reports')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'reports'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compliance Reports
            </button>
            <button
              onClick={() => onTabChange('governance')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'governance'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RBAC Governance
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {roleConfig.permissions.includes('upload_facility_data') ? (
              <button
                onClick={onOpenDataEntry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Log Utility Record
              </button>
            ) : (
              <button
                onClick={() => onTabChange('reports')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all whitespace-nowrap shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Export Reports
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enterprise Context Bar: Multi-Tenant & RBAC Role Switchers */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Active Enterprise Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Active Enterprise:
            </span>
            <div className="relative">
              <select
                value={activeTenant.id}
                onChange={e => onTenantChange(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-white font-semibold rounded-md pl-2.5 pr-8 py-1 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none text-xs"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.reportingYear})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ArrowRightLeft className="w-3 h-3" />
              </div>
            </div>

            {onOpenOnboardCompany && (
              <button
                onClick={onOpenOnboardCompany}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors"
                title="Onboard and register any new global corporation"
              >
                <Globe2 className="w-3 h-3 text-emerald-400" />
                <span>+ Onboard Company</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-700">·</span>
              <span className="bg-slate-900 border border-slate-800 text-[11px] font-mono px-2 py-0.5 rounded text-slate-300">
                {activeTenant.country || activeTenant.region || 'Global'}
              </span>
              <span className="bg-slate-900 border border-slate-800 text-[11px] font-mono px-2 py-0.5 rounded text-emerald-400">
                {activeTenant.currency || 'USD ($)'}
              </span>
              <span className="text-slate-500 text-[11px]">
                {activeTenant.activeFacilitiesCount || 1} Facilities
              </span>
            </div>
          </div>

          {/* RBAC Active Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
              Current User / RBAC Role:
            </span>
            <div className="relative">
              <select
                value={activeUser.id}
                onChange={e => onUserChange(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 rounded-md pl-2.5 pr-8 py-1 font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none text-xs"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {ROLE_CONFIGS[u.role].label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ArrowRightLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Scope / Access indicator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-2 text-slate-400 border-l border-slate-800">
              {activeUser.role === 'SUSTAINABILITY_MANAGER' && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Full Read/Write Scope
                </span>
              )}
              {activeUser.role === 'ESG_AUDITOR' && (
                <span className="text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Independent Assurance (Read + Sign-Off)
                </span>
              )}
              {activeUser.role === 'FACILITY_CONTRIBUTOR' && (
                <span className="text-blue-400 flex items-center gap-1">
                  Facility-Restricted Upload Only
                </span>
              )}
              {activeUser.role === 'TENANT_ADMIN' && (
                <span className="text-purple-400 flex items-center gap-1">
                  Governance & Policy Admin
                </span>
              )}
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30 border border-slate-700/80 rounded-md transition-all ml-1"
                title="Sign out and return to OmniESG Global landing portal"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
