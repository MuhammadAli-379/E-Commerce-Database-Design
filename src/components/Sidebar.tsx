import React from 'react';
import {
  LayoutDashboard,
  Network,
  TableProperties,
  GitFork,
  SlidersHorizontal,
  Code2,
  Database,
  Terminal,
  FileText,
  X,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  schemaCountMode: 19 | 21;
}

const navItems = [
  { id: 'overview',        label: 'Overview',          sub: 'Dashboard',       icon: LayoutDashboard, accent: '#06b6d4' },
  { id: 'erd',             label: 'ERD Explorer',      sub: 'Interactive',     icon: Network,         accent: '#38bdf8' },
  { id: 'entities',        label: 'Entities Catalog',  sub: 'Schema',          icon: TableProperties, accent: '#6366f1' },
  { id: 'relationships',   label: 'Relationships',     sub: '16+ Links',       icon: GitFork,         accent: '#10b981' },
  { id: 'normalization',   label: 'Normalization Lab', sub: '1NF→3NF',         icon: SlidersHorizontal, accent: '#a855f7' },
  { id: 'schema',          label: 'Relational Schema', sub: 'DDL Export',      icon: Code2,           accent: '#3b82f6' },
  { id: 'data',            label: 'Data Explorer',     sub: 'Live Rows',       icon: Database,        accent: '#06b6d4' },
  { id: 'sql',             label: 'SQL Playground',    sub: 'Query Engine',    icon: Terminal,        accent: '#10b981' },
  { id: 'report',          label: 'Project Report',    sub: 'Academic PDF',    icon: FileText,        accent: '#94a3b8' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  schemaCountMode,
}) => {
  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-50 lg:z-20 w-64 h-full lg:h-[calc(100vh-57px)] bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-250 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-white">Database Systems</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Area */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {/* Section Label */}
          <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-1">
            System Modules
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={isActive ? { '--active-accent': item.accent } as React.CSSProperties : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'sidebar-item-active bg-slate-900 border border-slate-800/80 shadow-sm'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  {/* Active left indicator */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                      style={{ backgroundColor: item.accent }}
                    />
                  )}

                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 transition-all ${
                        isActive
                          ? 'shadow-sm'
                          : 'bg-transparent group-hover:bg-slate-800'
                      }`}
                      style={isActive ? { backgroundColor: `${item.accent}18` } : undefined}
                    >
                      <Icon
                        className="w-3.5 h-3.5 transition-colors"
                        style={isActive ? { color: item.accent } : undefined}
                      />
                    </span>
                    <div className="overflow-hidden">
                      <span
                        className={`block truncate font-semibold transition-colors ${
                          isActive ? 'text-white' : 'group-hover:text-slate-200'
                        }`}
                      >
                        {idx + 1}. {item.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-all ${
                        isActive
                          ? 'text-white/80'
                          : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'
                      }`}
                      style={isActive ? { backgroundColor: `${item.accent}20`, color: item.accent } : undefined}
                    >
                      {item.id === 'entities' ? schemaCountMode : item.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Transformation Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Architecture Shift
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
              <span className="text-amber-400 font-mono font-bold">9 Tables</span>
              <span className="text-slate-600 animate-arrow-pulse">→</span>
              <span className="text-cyan-300 font-mono font-bold">{schemaCountMode} Entities</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500"
                style={{ width: `${(schemaCountMode / 21) * 100}%` }}
              />
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>BCNF / 3NF Verified</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Student Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Muhammad Abu Bakar</div>
              <div className="text-[10px] text-slate-500 truncate">FA24-BBD-109</div>
              <div className="text-[10px] text-cyan-400/80 truncate mt-0.5">Sir Ayyaz Mahmood</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
