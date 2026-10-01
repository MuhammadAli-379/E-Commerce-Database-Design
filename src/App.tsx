import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import {
  OverviewPage,
  ERDExplorerPage,
  EntitiesPage,
  RelationshipsPage,
  NormalizationPage,
  RelationalSchemaPage,
  DataExplorerPage,
  SQLPlaygroundPage,
  ProjectReportPage,
} from './pages';
import { PresentationMode } from './components/PresentationMode';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Footer } from './components/Footer';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [schemaCountMode, setSchemaCountMode] = useState<19 | 21>(19);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sqlInitialQuery, setSqlInitialQuery] = useState<string | undefined>(undefined);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToERD = (entityId: string) => {
    setActiveTab('erd');
  };

  const handleNavigateToSQL = (sql: string) => {
    setSqlInitialQuery(sql);
    setActiveTab('sql');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Presentation Mode Fullscreen Overlay */}
      {isPresentationOpen && (
        <PresentationMode
          schemaCountMode={schemaCountMode}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        schemaCountMode={schemaCountMode}
        onSelectEntity={entityId => {
          setActiveTab('erd');
        }}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schemaCountMode={schemaCountMode}
        setSchemaCountMode={setSchemaCountMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Mobile Menu Opener Sub-bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <Menu className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">System Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSchemaCountMode(schemaCountMode === 19 ? 21 : 19)}
            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300"
          >
            {schemaCountMode} Entities
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          schemaCountMode={schemaCountMode}
        />

        {/* Dynamic Center/Right Canvas Workspace using Modular Pages */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 min-w-0 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              schemaCountMode={schemaCountMode}
              setSchemaCountMode={setSchemaCountMode}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'erd' && (
            <ERDExplorerPage schemaCountMode={schemaCountMode} />
          )}

          {activeTab === 'entities' && (
            <EntitiesPage
              schemaCountMode={schemaCountMode}
              onNavigateToERD={handleNavigateToERD}
            />
          )}

          {activeTab === 'relationships' && (
            <RelationshipsPage onNavigateToERD={handleNavigateToERD} />
          )}

          {activeTab === 'normalization' && (
            <NormalizationPage />
          )}

          {activeTab === 'schema' && (
            <RelationalSchemaPage schemaCountMode={schemaCountMode} />
          )}

          {activeTab === 'data' && (
            <DataExplorerPage onNavigateToSQL={handleNavigateToSQL} />
          )}

          {activeTab === 'sql' && (
            <SQLPlaygroundPage initialQuery={sqlInitialQuery} />
          )}

          {activeTab === 'report' && (
            <ProjectReportPage
              schemaCountMode={schemaCountMode}
              setSchemaCountMode={setSchemaCountMode}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
