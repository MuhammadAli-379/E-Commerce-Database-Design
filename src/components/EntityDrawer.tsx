import React from 'react';
import { Entity, Relationship } from '../types/database';
import { Key, Link2, X, Database, ArrowRight, ShieldCheck } from 'lucide-react';
import { SAMPLE_DATA } from '../data/databaseData';

interface EntityDrawerProps {
  entity: Entity | null;
  onClose: () => void;
  relationships: Relationship[];
  onSelectRelatedEntity: (entityName: string) => void;
}

export const EntityDrawer: React.FC<EntityDrawerProps> = ({
  entity,
  onClose,
  relationships,
  onSelectRelatedEntity,
}) => {
  if (!entity) return null;

  // Filter incoming and outgoing relationships
  const outgoingRels = relationships.filter(
    r => r.parent.toLowerCase() === entity.name.toLowerCase()
  );
  const incomingRels = relationships.filter(
    r => r.child.toLowerCase() === entity.name.toLowerCase()
  );

  // Sample records for this entity
  const sampleRows = SAMPLE_DATA[entity.name] || [];
  const firstSample = sampleRows[0];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              {entity.domain} Domain
            </span>
            {entity.isLookup && (
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Lookup Table
              </span>
            )}
            {entity.isDocumentedExtra && (
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Documented Schema
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>{entity.name}</span>
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
        {/* Purpose */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Purpose &amp; Description
          </h3>
          <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            {entity.purpose}
          </p>
        </div>

        {/* Attributes & Schema Breakdown */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Attributes ({entity.attributes.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Data types &amp; constraints</span>
          </h3>

          <div className="space-y-1.5">
            {entity.attributes.map(attr => (
              <div
                key={attr.name}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/90 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attr.isPK && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Key className="w-2.5 h-2.5" /> PK
                      </span>
                    )}
                    {attr.isFK && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Link2 className="w-2.5 h-2.5" /> FK
                      </span>
                    )}
                    <span className="font-mono font-medium text-slate-200">{attr.name}</span>
                  </div>

                  <span className="font-mono text-[11px] text-cyan-400/90">
                    {attr.type}
                  </span>
                </div>

                {attr.references && (
                  <div className="text-[11px] text-amber-300/80 pl-1">
                    ↳ References: <span className="font-mono text-amber-200">{attr.references}</span>
                  </div>
                )}

                {attr.description && (
                  <div className="text-[11px] text-slate-400 pl-1 leading-normal">
                    {attr.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Relationships Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Referential Relationships ({outgoingRels.length + incomingRels.length})
          </h3>

          {outgoingRels.length === 0 && incomingRels.length === 0 ? (
            <div className="text-slate-400 text-xs italic p-3 bg-slate-950/40 rounded-lg">
              No direct foreign key relationships registered.
            </div>
          ) : (
            <div className="space-y-2">
              {outgoingRels.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedEntity(rel.child)}
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <span>{rel.parent}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-cyan-300 underline underline-offset-2">{rel.child}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {rel.cardinality}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {rel.description}
                  </p>
                </div>
              ))}

              {incomingRels.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedEntity(rel.parent)}
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <span className="text-purple-300 underline underline-offset-2">{rel.parent}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                      <span>{rel.child}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                      {rel.cardinality}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {rel.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Example Record */}
        {firstSample && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Sample Row Snapshot</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Report Grounded
              </span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5 overflow-x-auto">
              {Object.entries(firstSample).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-0.5 border-b border-slate-900 last:border-0">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-cyan-300 font-medium">
                    {val === null ? 'NULL' : typeof val === 'boolean' ? String(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
        <span>Author: Muhammad Abu Bakar</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
