import React from 'react';
import { Relationship } from '../types/database';
import { GitFork, ArrowRight, X, ShieldAlert, Key } from 'lucide-react';

interface RelationshipModalProps {
  relationship: Relationship | null;
  onClose: () => void;
  onSelectEntity: (name: string) => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  relationship,
  onClose,
  onSelectEntity,
}) => {
  if (!relationship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Relational Integrity Rule</h2>
              <div className="text-xs text-slate-400">Constraint definition &amp; cardinality</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Cardinality Diagram */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onSelectEntity(relationship.parent)}
            className="flex-1 text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-750 transition-colors group"
          >
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Parent Table</span>
            <span className="font-bold text-sm text-cyan-400 group-hover:underline">
              {relationship.parent}
            </span>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Key className="w-3 h-3 text-emerald-400" /> {relationship.parentKey}
            </div>
          </button>

          <div className="px-3 flex flex-col items-center">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {relationship.cardinality}
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 mt-1" />
          </div>

          <button
            onClick={() => onSelectEntity(relationship.child)}
            className="flex-1 text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-750 transition-colors group"
          >
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Child / Foreign Table</span>
            <span className="font-bold text-sm text-purple-400 group-hover:underline">
              {relationship.child}
            </span>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Key className="w-3 h-3 text-amber-400" /> {relationship.childKey}
            </div>
          </button>
        </div>

        {/* Business Rule */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Relational Business Rule
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            {relationship.businessRule}
          </p>
        </div>

        {/* Technical Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Functional Rationale
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {relationship.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
