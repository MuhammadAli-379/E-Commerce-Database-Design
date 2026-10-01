import React, { useState } from 'react';
import { Entity } from '../types/database';
import { ENTITIES, RELATIONSHIPS } from '../data/databaseData';
import { Search, Filter, Key, Link2, GitFork, ArrowUpRight, Database } from 'lucide-react';
import { EntityDrawer } from './EntityDrawer';

interface EntitiesBrowserProps {
  schemaCountMode: 19 | 21;
  onNavigateToERD: (entityId: string) => void;
}

export const EntitiesBrowser: React.FC<EntitiesBrowserProps> = ({
  schemaCountMode,
  onNavigateToERD,
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const activeEntities = ENTITIES.filter(
    e => schemaCountMode === 21 || !e.isDocumentedExtra
  );

  const filteredEntities = activeEntities.filter(entity => {
    const matchesDomain =
      domainFilter === 'All' ||
      (domainFilter === 'Lookup' ? entity.isLookup : entity.domain === domainFilter);
    const matchesSearch =
      entity.name.toLowerCase().includes(search.toLowerCase()) ||
      entity.purpose.toLowerCase().includes(search.toLowerCase()) ||
      entity.attributes.some(a => a.name.toLowerCase().includes(search.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const domains = [
    'All',
    'Customer',
    'Address',
    'Product',
    'Inventory',
    'Orders',
    'Payments',
    'Shipping',
    'Lookup',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>Entities Catalog</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Authoritative inventory of normalized entities ({activeEntities.length} active in current view)
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search entities, attributes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
        <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
        {domains.map(dom => (
          <button
            key={dom}
            onClick={() => setDomainFilter(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              domainFilter === dom
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Entities Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 border-b border-slate-800 uppercase font-mono tracking-wider text-slate-400 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Primary Key</th>
                <th className="py-3.5 px-4">Foreign Keys</th>
                <th className="py-3.5 px-4">Relationships</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntities.map(entity => {
                const pk = entity.attributes.find(a => a.isPK);
                const fks = entity.attributes.filter(a => a.isFK);
                const relCount = RELATIONSHIPS.filter(
                  r =>
                    r.parent.toLowerCase() === entity.name.toLowerCase() ||
                    r.child.toLowerCase() === entity.name.toLowerCase()
                ).length;

                return (
                  <tr
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity)}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                  >
                    {/* Entity Name & Badge */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{entity.name}</span>
                        {entity.isLookup && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                            Lookup
                          </span>
                        )}
                        {entity.isDocumentedExtra && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            Doc Schema
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {entity.purpose}
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {entity.domain}
                      </span>
                    </td>

                    {/* Primary Key */}
                    <td className="py-3.5 px-4 font-mono">
                      {pk ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Key className="w-3 h-3" /> {pk.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    {/* Foreign Keys */}
                    <td className="py-3.5 px-4">
                      {fks.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {fks.map(fk => (
                            <span
                              key={fk.name}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                            >
                              <Link2 className="w-2.5 h-2.5" /> {fk.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Relationships Count */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="inline-flex items-center gap-1 text-cyan-400">
                        <GitFork className="w-3.5 h-3.5" /> {relCount} link{relCount !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onNavigateToERD(entity.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 transition-colors text-[11px]"
                      >
                        <span>View ERD</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        relationships={RELATIONSHIPS}
        onSelectRelatedEntity={name => {
          const target = activeEntities.find(
            e => e.name.toLowerCase() === name.toLowerCase()
          );
          if (target) setSelectedEntity(target);
        }}
      />
    </div>
  );
};
