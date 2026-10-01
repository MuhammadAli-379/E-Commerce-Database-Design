import React, { useState } from 'react';
import { FUNCTIONAL_DEPENDENCIES } from '../data/databaseData';
import { Network, ArrowRight, ShieldCheck, AlertCircle, Key, Layers } from 'lucide-react';

export const DependencyExplorer: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('product');

  const selectedFD =
    FUNCTIONAL_DEPENDENCIES.find(fd => fd.entityId === selectedEntityId) ||
    FUNCTIONAL_DEPENDENCIES[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
          <Network className="w-7 h-7 text-cyan-400" />
          <span>Functional Dependency Explorer</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Trace primary determinants, identify transitive or partial dependency violations, and verify normal form adherence
        </p>
      </div>

      {/* Entity Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <Layers className="w-4 h-4 text-slate-400 ml-2 mr-1 shrink-0" />
        {FUNCTIONAL_DEPENDENCIES.map(fd => (
          <button
            key={fd.entityId}
            onClick={() => setSelectedEntityId(fd.entityId)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedEntityId === fd.entityId
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {fd.entityName}
          </button>
        ))}
      </div>

      {/* Main Dependency Graph Area */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">Target Entity</span>
            <h2 className="text-xl font-bold text-white">{selectedFD.entityName}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> {selectedFD.normalFormAchieved}
            </span>
          </div>
        </div>

        {/* Primary Determinant Arrow */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-emerald-400" /> Primary Candidate Determinant
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm shrink-0">
              {selectedFD.determinant}
            </div>

            <div className="flex items-center text-cyan-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            <div className="flex-1 flex flex-wrap gap-2">
              {selectedFD.dependents.map(dep => (
                <span
                  key={dep}
                  className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transitive Dependencies Breakdown */}
        {selectedFD.transitiveDependencies && selectedFD.transitiveDependencies.length > 0 && (
          <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-purple-400" /> Transitive Dependency Chains (3NF Violations Eliminated)
            </div>

            <div className="space-y-3">
              {selectedFD.transitiveDependencies.map((td, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">{selectedFD.determinant}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-amber-400 font-bold">{td.via}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-red-400 font-bold underline">{td.target}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Relational Solution: </span>
                    {td.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partial Dependencies Breakdown (if applicable) */}
        {selectedFD.partialDependencies && selectedFD.partialDependencies.length > 0 && (
          <div className="p-5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-400" /> Partial Key Dependencies (2NF Violations Eliminated)
            </div>

            <div className="space-y-3">
              {selectedFD.partialDependencies.map((pd, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">{'{' + pd.compositeKey.join(', ') + '}'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-amber-400 font-bold">{pd.partialKey}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-red-400 font-bold underline">{pd.dependent}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Relational Solution: </span>
                    {pd.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
