import React from 'react';
import { Presentation, Search, Database, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  schemaCountMode: 19 | 21;
  setSchemaCountMode: (mode: 19 | 21) => void;
  onOpenSearch: () => void;
  onOpenPresentation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  schemaCountMode,
  setSchemaCountMode,
  onOpenSearch,
  onOpenPresentation,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Wordmark Brand Zone (single clean title) */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white block group-hover:text-cyan-400 transition-colors">
              E-Commerce Database Systems
            </span>
            <span className="text-xs text-slate-400 hidden sm:block">
              Muhammad Abu Bakar · FA24-BBD-109
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Fast access nav links for key modules */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('erd')}
          className={`transition-colors hover:text-white ${activeTab === 'erd' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          ERD Canvas
        </button>
        <button
          onClick={() => setActiveTab('normalization')}
          className={`transition-colors hover:text-white ${activeTab === 'normalization' ? 'text-purple-400 font-semibold' : ''}`}
        >
          1NF · 2NF · 3NF
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`transition-colors hover:text-white ${activeTab === 'schema' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Relational DDL
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`transition-colors hover:text-white ${activeTab === 'sql' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          SQL Playground
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`transition-colors hover:text-white ${activeTab === 'data' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Live Data
        </button>
      </nav>

      {/* Zone 3: Interactive Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Schema Count Toggle: 19 Listed vs 21 Documented */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setSchemaCountMode(19)}
            title="Final explicit list of 19 normalized entities"
            className={`px-2.5 py-1 rounded-md transition-all ${
              schemaCountMode === 19
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            19 Entities
          </button>
          <button
            onClick={() => setSchemaCountMode(21)}
            title="Complete documented schema including Inventory and Suppliers"
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              schemaCountMode === 21
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3 text-purple-400" />
            21 Complete
          </button>
        </div>

        {/* Search Action */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
          title="Search entities, attributes & relationships"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick Search</span>
          <kbd className="hidden md:inline-block px-1 py-0.2 text-[10px] bg-slate-800 text-slate-400 rounded">⌘K</kbd>
        </button>

        {/* Presentation Viva Mode */}
        <button
          onClick={onOpenPresentation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Presentation Mode</span>
        </button>
      </div>
    </header>
  );
};
