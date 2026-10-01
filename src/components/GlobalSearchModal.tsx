import React, { useState, useEffect } from 'react';
import { Search, X, Database, Key, Link2, GitFork, ArrowRight } from 'lucide-react';
import { ENTITIES, RELATIONSHIPS } from '../data/databaseData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (entityId: string) => void;
  schemaCountMode: 19 | 21;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
  schemaCountMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeEntities = ENTITIES.filter(
    e => schemaCountMode === 21 || !e.isDocumentedExtra
  );

  const cleanQuery = query.trim().toLowerCase();

  // Matched Entities
  const matchedEntities = cleanQuery
    ? activeEntities.filter(
        e =>
          e.name.toLowerCase().includes(cleanQuery) ||
          e.purpose.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Matched Attributes (e.g. searching 'CustomerID' finds Customers, Orders, Contact, Status, etc.)
  const matchedAttributes = cleanQuery
    ? activeEntities
        .flatMap(entity =>
          entity.attributes
            .filter(a => a.name.toLowerCase().includes(cleanQuery))
            .map(a => ({ entity, attribute: a }))
        )
    : [];

  // Matched Relationships
  const matchedRelationships = cleanQuery
    ? RELATIONSHIPS.filter(
        r =>
          r.parent.toLowerCase().includes(cleanQuery) ||
          r.child.toLowerCase().includes(cleanQuery) ||
          r.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search entities, attributes, relationships (e.g. Payment, CustomerID)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-6 text-xs flex-1">
          {!cleanQuery ? (
            <div className="text-center py-10 text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30" />
              <p>Type to search across normalized database entities, columns, or relationships.</p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setQuery('Payment')}
                  className="px-2 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 font-mono text-[11px]"
                >
                  &ldquo;Payment&rdquo;
                </button>
                <button
                  onClick={() => setQuery('CustomerID')}
                  className="px-2 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 font-mono text-[11px]"
                >
                  &ldquo;CustomerID&rdquo;
                </button>
                <button
                  onClick={() => setQuery('Orders')}
                  className="px-2 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 font-mono text-[11px]"
                >
                  &ldquo;Orders&rdquo;
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Entities Matches */}
              {matchedEntities.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                    Matching Entities ({matchedEntities.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedEntities.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onSelectEntity(e.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-white group-hover:text-cyan-300">
                            {e.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {e.domain}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-cyan-300 flex items-center gap-1">
                          Jump to ERD <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes Column Matches */}
              {matchedAttributes.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                    Tables Containing Attribute &ldquo;{query}&rdquo; ({matchedAttributes.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedAttributes.map(({ entity, attribute }, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectEntity(entity.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2 font-mono">
                          {attribute.isPK ? (
                            <Key className="w-3.5 h-3.5 text-emerald-400" />
                          ) : attribute.isFK ? (
                            <Link2 className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <span className="w-3.5" />
                          )}
                          <span className="text-white font-bold">{attribute.name}</span>
                          <span className="text-slate-500">in</span>
                          <span className="text-cyan-300 underline underline-offset-2">
                            {entity.name}
                          </span>
                          <span className="text-[10px] text-slate-500">({attribute.type})</span>
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-cyan-300">
                          Inspect Table →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Relationship Matches */}
              {matchedRelationships.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                    Matching Relationships ({matchedRelationships.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedRelationships.map(r => (
                      <div
                        key={r.id}
                        className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 font-medium text-slate-300">
                          <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-white">{r.parent}</span>
                          <span className="text-cyan-400 font-mono text-[10px]">[{r.cardinality}]</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-white">{r.child}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 max-w-xs truncate">
                          {r.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedEntities.length === 0 &&
                matchedAttributes.length === 0 &&
                matchedRelationships.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No schema elements matching &ldquo;{query}&rdquo;.
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC or click outside to dismiss</span>
          <span className="font-mono">Global Schema Index</span>
        </div>
      </div>
    </div>
  );
};
