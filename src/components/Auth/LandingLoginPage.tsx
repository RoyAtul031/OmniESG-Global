import React, { useState } from 'react';
import {
  Globe2,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  FileText,
  Sparkles,
  Building2,
  UserCircle2,
  Layers,
  Activity,
  Database,
  Check,
  ChevronRight,
  Cpu,
  BadgeCheck,
  Zap,
} from 'lucide-react';
import { Tenant } from '../../types/tenant';
import { User, ROLE_CONFIGS, UserRole } from '../../types/rbac';

interface LandingLoginPageProps {
  tenants: Tenant[];
  users: User[];
  onLogin: (tenantId: string, userId: string) => void;
}

export const LandingLoginPage: React.FC<LandingLoginPageProps> = ({
  tenants,
  users,
  onLogin,
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    tenants[0]?.id || 'tenant_wework'
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users[0]?.id || 'user_priya'
  );
  const [authTab, setAuthTab] = useState<'demo' | 'sso'>('demo');
  const [ssoEmail, setSsoEmail] = useState('priya.sharma@wework-esg.com');
  const [ssoPassword, setSsoPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const selectedTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const handleLaunchConsole = (tId?: string, uId?: string) => {
    setIsAuthenticating(true);
    const finalTid = tId || selectedTenantId;
    const finalUid = uId || selectedUserId;

    setTimeout(() => {
      onLogin(finalTid, finalUid);
    }, 450);
  };

  const handleSsoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLaunchConsole();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  OmniESG Global
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Enterprise OS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Global Multi-Tenant Sustainability Intelligence & Cryptographic Assurance Cloud
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Consensus: 100% SHA-256 Validated</span>
            </div>
            <button
              onClick={() => handleLaunchConsole()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <span>Access Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Login Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Hero & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Regulatory Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cross-Border Compliance: SEC · EU CSRD · SEBI BRSR · ISSB</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Enterprise Sustainability Cloud with{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Cryptographic Assurance
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              An institutional operating system designed for multinational conglomerates, REITs, and enterprise holdings. Complete with multi-tenant data isolation, Merkle-linked audit blocks, internal shadow carbon fee modeling, and automated regulatory dossiers.
            </p>

            {/* Core Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">45+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Jurisdictions</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">2.4M+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">tCO₂e Tracked</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold text-teal-300 font-mono">100%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tamper-Proof</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">ISAE 3000</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Auditor Ready</div>
              </div>
            </div>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SHA-256 Audit Blockchain
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                TCFD Shadow Carbon Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Global Radar Telemetry
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Trust Multi-Tenancy
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Login & Access Gateway */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden">
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />

              {/* Gateway Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Enterprise Access Gateway
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a verified corporate role or sign in with enterprise credentials.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthTab('demo')}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authTab === 'demo'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>One-Click Role Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('sso')}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authTab === 'sso'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Enterprise SSO / Auth</span>
                </button>
              </div>

              {/* Tab 1: Instant One-Click Role Selector */}
              {authTab === 'demo' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Tenant Select */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        Target Enterprise Tenant
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {selectedTenant?.currency} · {selectedTenant?.country || 'Global'}
                      </span>
                    </label>
                    <select
                      value={selectedTenantId}
                      onChange={e => setSelectedTenantId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.region || t.country || 'Global'} · {t.currency || 'USD'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Profiles Grid */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                      <UserCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Select Verified Persona / RBAC Role
                    </label>
                    <div className="space-y-2">
                      {users.map(u => {
                        const isSelected = u.id === selectedUserId;
                        const roleCfg = ROLE_CONFIGS[u.role];
                        return (
                          <div
                            key={u.id}
                            onClick={() => setSelectedUserId(u.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg ${u.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner`}
                              >
                                {u.initials}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-white flex items-center gap-2">
                                  <span>{u.name}</span>
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                      u.role === 'SUSTAINABILITY_MANAGER'
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        : u.role === 'ESG_AUDITOR'
                                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                        : u.role === 'TENANT_ADMIN'
                                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    }`}
                                  >
                                    {roleCfg.label}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                                  {u.title}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-700" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    type="button"
                    onClick={() => handleLaunchConsole()}
                    disabled={isAuthenticating}
                    className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 animate-spin" />
                        Initializing Ledger Session...
                      </span>
                    ) : (
                      <>
                        <span>Enter OmniESG Global Console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab 2: Corporate SSO & Credentials */}
              {authTab === 'sso' && (
                <form onSubmit={handleSsoSubmit} className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Corporate Work Email
                    </label>
                    <input
                      type="email"
                      value={ssoEmail}
                      onChange={e => setSsoEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Enterprise Password / MFA Token
                    </label>
                    <input
                      type="password"
                      value={ssoPassword}
                      onChange={e => setSsoPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-emerald-500" />
                      <span>Remember cryptographic session</span>
                    </label>
                    <span className="text-emerald-400 font-mono">FIDO2 MFA Required</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Authenticate & Access Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* SSO Federation Buttons */}
                  <div className="pt-2">
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                        Or Single Sign-On
                      </span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleLaunchConsole()}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
                      >
                        Sign in with Okta
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunchConsole()}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
                      >
                        Microsoft Entra ID
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Bottom Security Assurance Stamp */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SHA-256 Chained Identity</span>
                </span>
                <span>SOC 2 Type II · ISAE 3000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix Showcase */}
      <section className="relative z-10 border-t border-slate-900 bg-slate-950/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional ESG Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Engineered from the ground up for strict regulatory verification, zero database tampering, and real-time capital exposure modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                Cryptographic Block Ledger
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every meter reading, utility invoice, and emission factor update is chained with SHA-256 hashes. Tampering with any block instantly invalidates consensus.
              </p>
              <div className="mt-3 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Tamper-evident verification</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                Shadow Carbon Pricing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic internal carbon fees ($20 to $250/tCO₂e) calculate fiscal exposure across Scope 1, 2, and 3 boundaries to guide decarbonization CAPEX.
              </p>
              <div className="mt-3 text-[11px] font-mono text-teal-400 flex items-center gap-1">
                <span>TCFD / EU ETS Aligned</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                Global Radar & Sub-Meters
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive equirectangular asset map with live pulsating radar pins across AMER, EMEA, and APAC. Sub-meter level electricity, solar, and diesel telemetry.
              </p>
              <div className="mt-3 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                <span>Real-time asset telemetry</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                Multi-Standard Dossiers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click export of comprehensive compliance dossiers formatted for SEC Climate, EU CSRD (ESRS E1), and SEBI BRSR Core with cryptographic watermark.
              </p>
              <div className="mt-3 text-[11px] font-mono text-purple-400 flex items-center gap-1">
                <span>PDF & CSV Dossier Export</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">
              OmniESG Global Enterprise OS · Institutional Sustainability & Cryptographic Assurance Cloud
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>SEC Climate Aligned</span>
            <span>·</span>
            <span>EU CSRD ESRS E1</span>
            <span>·</span>
            <span>SEBI BRSR Core</span>
            <span>·</span>
            <span>ISAE 3000 Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
