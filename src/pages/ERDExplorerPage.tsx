import React, { useState } from 'react';
import { ERDCanvas } from '../components/ERDCanvas';
import { SpatialERD3D } from '../components/three/SpatialERD3D';
import { Network, Sparkles, BookOpen, Layers, Box, LayoutGrid } from 'lucide-react';

interface ERDExplorerPageProps {
  schemaCountMode: 19 | 21;
}

export const ERDExplorerPage: React.FC<ERDExplorerPageProps> = ({ schemaCountMode }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  return (
    <div className="space-y-4 max-w-7xl mx-auto page-enter">
      {/* Top Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              Visual Topology
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-xs text-slate-400 font-mono">Module 02</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Interactive Entity Relationship Diagram (ERD)</span>
          </h1>
        </div>

        {/* View Mode Switcher (2D Schematic vs 3D Spatial) & Canvas Tips */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-300" />
              <span>3D Spatial Graph</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-300" />
              <span>2D Schematic Canvas</span>
            </button>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors border border-slate-800"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{showGuide ? 'Hide Guide' : 'Canvas Tips'}</span>
          </button>
        </div>
      </div>

      {/* Guide Callout (if active) */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 3D Orbit &amp; Spatial Inspection
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              In 3D mode, left-click &amp; drag anywhere to orbit the camera in 3D coordinate space. Scroll with mouse wheel to zoom. Click any holographic monolith to inspect attributes.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Context Hub Highlighting
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Clicking a central entity like <code className="text-cyan-300 font-mono">Orders</code> highlights all foreign-key relationships while dimming distant tables for focused analysis.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> 2D Schematic &amp; Cardinality
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Switch to 2D Schematic Canvas to drag cards freely and click relationship lines to view mathematical business rules and foreign key integrity constraints.
            </p>
          </div>
        </div>
      )}

      {/* Interactive ERD: 3D Spatial Universe or 2D Schematic Layout */}
      {viewMode === '3d' ? (
        <SpatialERD3D schemaCountMode={schemaCountMode} />
      ) : (
        <ERDCanvas schemaCountMode={schemaCountMode} />
      )}
    </div>
  );
};
