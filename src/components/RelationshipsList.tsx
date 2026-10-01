import React, { useState } from 'react';
import { RELATIONSHIPS } from '../data/databaseData';
import { Relationship } from '../types/database';
import { GitFork, ArrowRight, ShieldCheck, Key, Search, BookOpen } from 'lucide-react';
import { RelationshipModal } from './RelationshipModal';

interface RelationshipsListProps {
  onNavigateToERD: (entityId: string) => void;
}

export const RelationshipsList: React.FC<RelationshipsListProps> = ({ onNavigateToERD }) => {
  const [search, setSearch] = useState('');
  const [selectedRel, setSelectedRel] = useState<Relationship | null>(null);

  const filteredRels = RELATIONSHIPS.filter(rel => {
    const q = search.toLowerCase();
    return (
      rel.parent.toLowerCase().includes(q) ||
      rel.child.toLowerCase().includes(q) ||
      rel.description.toLowerCase().includes(q) ||
      rel.cardinality.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <GitFork className="w-7 h-7 text-emerald-400" />
            <span>Relational Integrity &amp; Cardinality</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Complete referential dataset defining Foreign Key constraints across the e-commerce schema
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search relationships..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Cardinality Legend (Section 18) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Relational Cardinality Guide</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-cyan-400 font-mono">1:1</span>
              <span className="text-[10px] text-slate-400 font-mono">One-to-One</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Exactly one parent record links to one child record.
            </p>
            <div className="mt-2 text-[10px] font-mono text-cyan-300/80 bg-cyan-950/40 p-1.5 rounded">
              Example: Orders ↔ Order Financials
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-emerald-400 font-mono">1:M</span>
              <span className="text-[10px] text-slate-400 font-mono">One-to-Many</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              A single parent entity can correspond to zero or many child records.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-300/80 bg-emerald-950/40 p-1.5 rounded">
              Example: Customers → Orders
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-amber-400 font-mono">M:1</span>
              <span className="text-[10px] text-slate-400 font-mono">Many-to-One</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Many operational records reference a shared lookup reference entry.
            </p>
            <div className="mt-2 text-[10px] font-mono text-amber-300/80 bg-amber-950/40 p-1.5 rounded">
              Example: Shipments → Carriers
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-purple-400 font-mono">M:M</span>
              <span className="text-[10px] text-slate-400 font-mono">Many-to-Many</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Resolved in relational design via an associative junction table.
            </p>
            <div className="mt-2 text-[10px] font-mono text-purple-300/80 bg-purple-950/40 p-1.5 rounded">
              Example: Customers ↔ Locations via Customer Address
            </div>
          </div>
        </div>
      </div>

      {/* Complete Relationships Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 border-b border-slate-800 uppercase font-mono tracking-wider text-slate-400 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Parent Entity</th>
                <th className="py-3.5 px-4">Card.</th>
                <th className="py-3.5 px-4">Child Entity</th>
                <th className="py-3.5 px-4">Keys Linkage</th>
                <th className="py-3.5 px-4">Relational Business Rule</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRels.map(rel => (
                <tr
                  key={rel.id}
                  onClick={() => setSelectedRel(rel)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  {/* Parent */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {rel.parent}
                    </span>
                  </td>

                  {/* Cardinality Badge */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {rel.cardinality}
                    </span>
                  </td>

                  {/* Child */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                      {rel.child}
                    </span>
                  </td>

                  {/* Keys */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Key className="w-3 h-3" /> {rel.parentKey}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-amber-400 flex items-center gap-0.5">
                        {rel.childKey}
                      </span>
                    </div>
                  </td>

                  {/* Business Rule */}
                  <td className="py-3.5 px-4 text-slate-300 max-w-md">
                    <p className="line-clamp-2 text-[11px] leading-relaxed">
                      {rel.businessRule}
                    </p>
                  </td>

                  {/* Inspect Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedRel(rel);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[11px] transition-colors"
                    >
                      Rule Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relationship Modal */}
      <RelationshipModal
        relationship={selectedRel}
        onClose={() => setSelectedRel(null)}
        onSelectEntity={name => {
          onNavigateToERD(name.toLowerCase().replace(/[\s_]+/g, '_'));
        }}
      />
    </div>
  );
};
