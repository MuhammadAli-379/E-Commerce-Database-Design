import React, { useState } from 'react';
import { ENTITIES } from '../data/databaseData';
import { Code2, Key, Link2, Copy, Check, Filter, Search } from 'lucide-react';

interface RelationalSchemaProps {
  schemaCountMode: 19 | 21;
}

export const RelationalSchema: React.FC<RelationalSchemaProps> = ({ schemaCountMode }) => {
  const [filterDomain, setFilterDomain] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  const activeEntities = ENTITIES.filter(
    e => schemaCountMode === 21 || !e.isDocumentedExtra
  );

  const filtered = activeEntities.filter(e => {
    const matchesDomain = filterDomain === 'All' || e.domain === filterDomain;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.attributes.some(a => a.name.toLowerCase().includes(search.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const handleCopyDDL = (entityName: string, ddl: string) => {
    navigator.clipboard.writeText(ddl);
    setCopiedTable(entityName);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  const generateDDL = (entity: typeof ENTITIES[0]) => {
    const lines = entity.attributes.map(attr => {
      const pkPart = attr.isPK ? ' PRIMARY KEY' : '';
      const notNull = attr.nullable ? '' : ' NOT NULL';
      return `  ${attr.name.padEnd(20)} ${attr.type}${pkPart}${notNull}`;
    });

    const fkLines = entity.attributes
      .filter(a => a.isFK && a.references)
      .map(a => {
        const [refTable, refCol] = a.references!.split('.');
        return `  CONSTRAINT fk_${entity.name.toLowerCase()}_${a.name.toLowerCase()} FOREIGN KEY (${a.name}) REFERENCES ${refTable}(${refCol})`;
      });

    const allLines = [...lines, ...fkLines];
    return `CREATE TABLE ${entity.name.replace(/\s+/g, '_')} (\n${allLines.join(',\n')}\n);`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-cyan-400" />
            <span>Relational Schema &amp; DDL</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Complete formal database schema specification with primary keys, foreign constraints, and SQL generation
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schema..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
        <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
        {['All', 'Customer', 'Address', 'Product', 'Inventory', 'Orders', 'Payments', 'Shipping'].map(dom => (
          <button
            key={dom}
            onClick={() => setFilterDomain(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterDomain === dom
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Schema Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(entity => {
          const ddl = generateDDL(entity);
          const isCopied = copiedTable === entity.name;

          return (
            <div
              key={entity.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg flex flex-col justify-between overflow-hidden group hover:border-slate-700 transition-all"
            >
              {/* Table Card Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">TABLE</span>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{entity.name}</span>
                    {entity.isLookup && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                        Lookup
                      </span>
                    )}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopyDDL(entity.name, ddl)}
                  title="Copy SQL CREATE TABLE statement"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>SQL DDL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Attributes Schema Listing */}
              <div className="p-4 font-mono text-xs space-y-1.5 flex-1">
                {entity.attributes.map(attr => (
                  <div
                    key={attr.name}
                    className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {attr.isPK ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                          <Key className="w-2.5 h-2.5" /> PK
                        </span>
                      ) : attr.isFK ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/30 flex items-center gap-0.5">
                          <Link2 className="w-2.5 h-2.5" /> FK
                        </span>
                      ) : (
                        <span className="w-6" />
                      )}

                      <span
                        className={`truncate ${
                          attr.isPK
                            ? 'text-emerald-300 font-semibold'
                            : attr.isFK
                            ? 'text-amber-300'
                            : 'text-slate-200'
                        }`}
                      >
                        {attr.name}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      {attr.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{entity.attributes.length} columns</span>
                <span className="font-mono text-cyan-400/90">{entity.domain}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
