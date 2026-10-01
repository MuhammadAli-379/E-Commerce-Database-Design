import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Database,
  Layers,
  GitFork,
  SlidersHorizontal,
  Table,
  Terminal,
  Key,
  Link2,
  Info,
  ChevronRight,
  FileCheck,
  Sparkles,
  TrendingUp,
  BookOpen,
  Zap,
  Box,
} from 'lucide-react';
import { ENTITIES, RELATIONSHIPS } from '../data/databaseData';
import { RelationalCoreHero3D } from './three/RelationalCoreHero3D';

interface OverviewProps {
  schemaCountMode: 19 | 21;
  setSchemaCountMode: (mode: 19 | 21) => void;
  setActiveTab: (tab: string) => void;
}

// Animated number counter hook
function useCountUp(target: number, duration = 900, delay = 0) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      started.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return count;
}

const DOMAIN_COLORS: Record<string, string> = {
  Customer: '#06b6d4',
  Address: '#3b82f6',
  Product: '#8b5cf6',
  Orders: '#f59e0b',
  Payments: '#10b981',
  Shipping: '#ef4444',
  Inventory: '#f97316',
  Suppliers: '#ec4899',
};

export const Overview: React.FC<OverviewProps> = ({
  schemaCountMode,
  setSchemaCountMode,
  setActiveTab,
}) => {
  const activeEntities = ENTITIES.filter(
    e => schemaCountMode === 21 || !e.isDocumentedExtra
  );

  const totalPKs = activeEntities.length;
  const totalFKs = activeEntities.reduce(
    (acc, e) => acc + e.attributes.filter(a => a.isFK).length,
    0
  );
  const totalRelationships = RELATIONSHIPS.length;
  const lookupEntities = activeEntities.filter(e => e.isLookup).length;

  const domainCounts = activeEntities.reduce((acc, e) => {
    acc[e.domain] = (acc[e.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Animated counters
  const cBase = useCountUp(9, 700, 100);
  const cNorm = useCountUp(schemaCountMode, 900, 200);
  const cRels = useCountUp(totalRelationships, 800, 350);
  const cPKs  = useCountUp(totalPKs, 700, 150);
  const cFKs  = useCountUp(totalFKs, 750, 200);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-14 page-enter">
      {/* ── Hero Section with 3D Relational Core ─────────────── */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-1/4 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Academic & Product Narrative (7 cols) */}
            <div className="lg:col-span-7">
              {/* Course badge row */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-cyan-400 mb-3 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Database Systems</span>
                <span className="text-slate-700">·</span>
                <span>Semester 3</span>
                <span className="text-slate-700">·</span>
                <span>Individual Term Project</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                E-Commerce{' '}
                <span className="text-gradient-cyan">Database Design</span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-slate-300">&amp; Normalization</span>
              </h1>

              <p className="mt-3 text-xs md:text-sm font-semibold text-slate-400 tracking-wide">
                1NF · 2NF · 3NF · 3D Spatial ERD · Relational Schema · SQL Engine
              </p>

              <blockquote className="mt-4 text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed border-l-2 border-cyan-500/50 pl-4">
                Designed and normalized a relational e-commerce database covering customer management,
                products, inventory, orders, payments, shipment logistics, and supporting lookup entities.
              </blockquote>

              {/* Architecture Transformation Banner */}
              <div className="mt-6 inline-flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Original</div>
                  <span className="font-mono text-lg md:text-xl font-bold text-amber-400">{cBase}</span>
                  <span className="text-xs text-amber-400/70 ml-1">Tables</span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-arrow-pulse" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500">1NF→3NF</span>
                </div>

                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Normalized</div>
                  <span className="font-mono text-lg md:text-xl font-bold text-cyan-300">{cNorm}</span>
                  <span className="text-xs text-cyan-300/70 ml-1">Entities</span>
                </div>

                <div className="h-7 w-px bg-slate-800" />

                <span className="text-[11px] text-slate-400 max-w-[140px] leading-tight hidden sm:block">
                  {schemaCountMode === 19 ? '19 Final List' : '21 Complete Schema'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('erd')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs md:text-sm font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Box className="w-4 h-4" />
                  <span>Open 3D Spatial ERD</span>
                </button>

                <button
                  onClick={() => setActiveTab('normalization')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs md:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>1NF → 3NF Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab('sql')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs md:text-sm font-medium transition-colors"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Run SQL Queries</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Spatial Relational Kernel (5 cols) */}
            <div className="lg:col-span-5">
              <RelationalCoreHero3D onSelectDomain={() => setActiveTab('erd')} />
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Base Tables */}
        <div
          className="stat-card p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 transition-all cursor-default"
          style={{ '--stat-accent': '#f59e0b' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Base Tables</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Table className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="text-4xl font-bold font-mono text-amber-400 animate-count-up">{cBase}</div>
          <div className="text-xs text-slate-500 mt-1.5">Monolithic unnormalized starting tables</div>
        </div>

        {/* Normalized Entities */}
        <div
          className="stat-card p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-default"
          style={{ '--stat-accent': '#06b6d4' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entities</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <div className="text-4xl font-bold font-mono text-cyan-400 animate-count-up delay-100">{cNorm}</div>
          <div className="text-xs text-slate-500 mt-1.5">
            {schemaCountMode === 19 ? 'Explicit final list' : 'Complete documented schema'}
          </div>
        </div>

        {/* Normalization */}
        <div
          className="stat-card p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/30 transition-all cursor-default"
          style={{ '--stat-accent': '#a855f7' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Normal Forms</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-0.5 animate-count-up delay-200">1NF · 2NF · 3NF</div>
          <div className="text-xs text-slate-500 mt-1.5">Zero repeating groups &amp; transitive deps</div>
        </div>

        {/* Relationships */}
        <div
          className="stat-card p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 transition-all cursor-default"
          style={{ '--stat-accent': '#10b981' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Relationships</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <GitFork className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="text-4xl font-bold font-mono text-emerald-400 animate-count-up delay-300">{cRels}</div>
          <div className="text-xs text-slate-500 mt-1.5">1:M, 1:1 &amp; M:1 referential links</div>
        </div>
      </div>

      {/* ── Report Consistency Notice ─────────────── */}
      <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs leading-relaxed flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="space-y-1.5">
          <span className="font-bold text-amber-300 block text-[13px]">Report Consistency Notice</span>
          <p className="text-slate-400 leading-relaxed">
            The supplied report contains inconsistent wording (referencing 17 or 18 entities in earlier chapters).
            The final explicit schema enumerates <strong className="text-slate-200">19 entities</strong> (the authoritative baseline).
            In addition, <strong className="text-slate-200">Inventory</strong> and <strong className="text-slate-200">Suppliers</strong> are
            fully documented with defined relationships, bringing the complete logical schema to{' '}
            <strong className="text-slate-200">21 entities</strong>.
          </p>
          <div className="pt-1 flex items-center gap-2 flex-wrap">
            <span className="text-slate-500">Active view:</span>
            <button
              onClick={() => setSchemaCountMode(19)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                schemaCountMode === 19
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              19 Final Entities
            </button>
            <button
              onClick={() => setSchemaCountMode(21)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 ${
                schemaCountMode === 21
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3 h-3" />
              21 Complete (+Inventory/Suppliers)
            </button>
          </div>
        </div>
      </div>

      {/* ── Three-Column Analytics Row ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Distribution */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 card-glow-cyan">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Entity Distribution by Domain
          </h3>
          <p className="text-[11px] text-slate-500 mb-5">How entities are spread across business domains</p>

          <div className="space-y-3.5">
            {Object.entries(domainCounts).map(([domain, count], i) => {
              const pct = Math.round((count / activeEntities.length) * 100);
              const color = DOMAIN_COLORS[domain] || '#06b6d4';
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {domain}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} entity{count !== 1 ? 's' : ''} &middot; {pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full animate-progress"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{activeEntities.length} total entities</span>
            <span className="text-cyan-400 font-mono">{Object.keys(domainCounts).length} domains</span>
          </div>
        </div>

        {/* Integrity Metrics */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 card-glow-emerald">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Relational Integrity Metrics
          </h3>
          <p className="text-[11px] text-slate-500 mb-5">Key integrity and referential constraint counts</p>

          <div className="space-y-3">
            {[
              { icon: Key, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Primary Keys (PK)', value: cPKs },
              { icon: Link2, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Foreign Keys (FK)', value: cFKs },
              { icon: GitFork, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Direct Relationships', value: cRels },
              { icon: FileCheck, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Lookup / Master Tables', value: lookupEntities },
            ].map(({ icon: Icon, color, bg, label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className={`p-1.5 rounded-lg ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </span>
                  {label}
                </span>
                <span className={`font-mono font-bold text-base ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Enforces strict referential cascades on all primary foreign key constraints.
          </div>
        </div>

        {/* Exploration Tracks */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 card-glow-purple">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Core Exploration Tracks
          </h3>
          <p className="text-[11px] text-slate-500 mb-5">
            Explore the transformation from 9 legacy tables into an industry-grade normalized schema.
          </p>

          <div className="space-y-2">
            {[
              {
                tab: 'erd',
                title: 'Interactive 3D ERD Canvas',
                desc: 'Orbit nodes, inspect foreign keys, zoom & filter in 3D',
                accent: 'group-hover:text-cyan-300',
                arrow: 'group-hover:text-cyan-400',
              },
              {
                tab: 'normalization',
                title: 'Normalization Lab (1NF → 3NF)',
                desc: 'Step-by-step dependency removal with visual before/after',
                accent: 'group-hover:text-purple-300',
                arrow: 'group-hover:text-purple-400',
              },
              {
                tab: 'sql',
                title: 'In-Browser SQL Playground',
                desc: 'Execute real SELECT, JOIN & WHERE operations live',
                accent: 'group-hover:text-emerald-300',
                arrow: 'group-hover:text-emerald-400',
              },
              {
                tab: 'schema',
                title: 'Relational Schema & DDL',
                desc: 'PostgreSQL / MySQL / SQLite CREATE TABLE scripts',
                accent: 'group-hover:text-blue-300',
                arrow: 'group-hover:text-blue-400',
              },
              {
                tab: 'report',
                title: 'Project Report Dossier',
                desc: 'Full academic writeup with print/PDF export',
                accent: 'group-hover:text-slate-200',
                arrow: 'group-hover:text-slate-400',
              },
            ].map(({ tab, title, desc, accent, arrow }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 text-xs text-left group transition-all"
              >
                <div>
                  <span className={`font-semibold text-slate-200 block transition-colors ${accent}`}>{title}</span>
                  <span className="text-[11px] text-slate-500">{desc}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-600 shrink-0 ml-2 transition-colors ${arrow}`} />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Database Systems Coursework</span>
            <span className="text-cyan-400/80 font-medium">Sir Ayyaz Mahmood</span>
          </div>
        </div>
      </div>
    </div>
  );
};
