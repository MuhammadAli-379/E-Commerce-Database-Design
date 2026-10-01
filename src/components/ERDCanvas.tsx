import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Entity, Relationship, DomainType } from '../types/database';
import { ENTITIES, RELATIONSHIPS } from '../data/databaseData';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Eye,
  EyeOff,
  Filter,
  Key,
  Link2,
  Search,
  Sparkles,
  GitFork,
  ArrowRight,
  Database,
} from 'lucide-react';
import { EntityDrawer } from './EntityDrawer';
import { RelationshipModal } from './RelationshipModal';

interface ERDCanvasProps {
  schemaCountMode: 19 | 21;
}

interface NodePosition {
  x: number;
  y: number;
}

export const ERDCanvas: React.FC<ERDCanvasProps> = ({ schemaCountMode }) => {
  // Filter entities according to schema mode
  const rawEntities = useMemo(() => {
    return ENTITIES.filter(e => schemaCountMode === 21 || !e.isDocumentedExtra);
  }, [schemaCountMode]);

  // Positions state so cards can be dragged
  const [positions, setPositions] = useState<Record<string, NodePosition>>(() => {
    const initial: Record<string, NodePosition> = {};
    ENTITIES.forEach(e => {
      initial[e.id] = { x: e.x, y: e.y };
    });
    return initial;
  });

  // Canvas zoom & pan
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Dragging individual entity card
  const [draggedEntityId, setDraggedEntityId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Selection & Highlighting
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('orders');
  const [activeRelationship, setActiveRelationship] = useState<Relationship | null>(null);
  const [showRelationshipLabels, setShowRelationshipLabels] = useState(true);
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Available entities based on domain filter & search
  const visibleEntities = useMemo(() => {
    return rawEntities.filter(entity => {
      const matchesDomain = domainFilter === 'All' || entity.domain === domainFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.attributes.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesSearch;
    });
  }, [rawEntities, domainFilter, searchQuery]);

  // Selected Entity Object
  const selectedEntity = useMemo(() => {
    return rawEntities.find(e => e.id === selectedEntityId) || null;
  }, [rawEntities, selectedEntityId]);

  // Connected Entity IDs (for highlighting)
  const connectedEntityIds = useMemo(() => {
    if (!selectedEntity) return new Set<string>();
    const ids = new Set<string>([selectedEntity.id]);

    RELATIONSHIPS.forEach(rel => {
      const parentEntity = rawEntities.find(
        e => e.name.toLowerCase() === rel.parent.toLowerCase()
      );
      const childEntity = rawEntities.find(
        e => e.name.toLowerCase() === rel.child.toLowerCase()
      );

      if (parentEntity && childEntity) {
        if (parentEntity.id === selectedEntity.id) {
          ids.add(childEntity.id);
        }
        if (childEntity.id === selectedEntity.id) {
          ids.add(parentEntity.id);
        }
      }
    });

    return ids;
  }, [selectedEntity, rawEntities]);

  // Filtered relationships where both ends exist in visibleEntities
  const visibleRelationships = useMemo(() => {
    const visibleIds = new Set(rawEntities.map(e => e.name.toLowerCase()));
    return RELATIONSHIPS.filter(rel => {
      return (
        visibleIds.has(rel.parent.toLowerCase()) &&
        visibleIds.has(rel.child.toLowerCase())
      );
    });
  }, [rawEntities]);

  // Mouse pan handlers
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    // Only pan if clicked on background canvas
    if ((e.target as HTMLElement).closest('.entity-card')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggedEntityId) {
      const newX = (e.clientX - pan.x) / zoom - dragOffset.x;
      const newY = (e.clientY - pan.y) / zoom - dragOffset.y;
      setPositions(prev => ({
        ...prev,
        [draggedEntityId]: { x: Math.max(0, newX), y: Math.max(0, newY) },
      }));
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggedEntityId(null);
  };

  // Card drag start
  const handleStartDragCard = (e: React.MouseEvent, entityId: string) => {
    e.stopPropagation();
    const pos = positions[entityId] || { x: 0, y: 0 };
    setDraggedEntityId(entityId);
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - pos.x,
      y: (e.clientY - pan.y) / zoom - pos.y,
    });
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(1.8, Math.max(0.4, prev + delta)));
  };

  const handleFitDiagram = () => {
    setZoom(0.75);
    setPan({ x: 20, y: 20 });
  };

  const handleResetLayout = () => {
    const initial: Record<string, NodePosition> = {};
    ENTITIES.forEach(e => {
      initial[e.id] = { x: e.x, y: e.y };
    });
    setPositions(initial);
    setZoom(0.85);
    setPan({ x: 30, y: 30 });
    setSelectedEntityId(null);
    setDomainFilter('All');
    setSearchQuery('');
  };

  // Wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      setZoom(prev => Math.min(1.8, Math.max(0.35, prev * zoomFactor)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-2xl">
      {/* Top Toolbar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        {/* Left: Domain Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter entities / columns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 md:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
            {['All', 'Customer', 'Product', 'Orders', 'Payments', 'Shipping'].map(dom => (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  domainFilter === dom
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Right: Interactive Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => handleZoom(0.1)}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFitDiagram}
            title="Fit Diagram"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Fit</span>
          </button>
          <button
            onClick={handleResetLayout}
            title="Reset Layout"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
          <button
            onClick={() => setShowRelationshipLabels(!showRelationshipLabels)}
            title="Toggle Cardinality Labels"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
              showRelationshipLabels
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {showRelationshipLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">Labels</span>
          </button>
          {selectedEntityId && (
            <button
              onClick={() => setSelectedEntityId(null)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              Clear Focus
            </button>
          )}
        </div>
      </div>

      {/* Selected Entity Connection Tree Bar (when an entity like Orders is focused) */}
      {selectedEntity && (
        <div className="z-10 bg-slate-900/95 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400">Focused Entity:</span>
            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {selectedEntity.name}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Connected Hub:</span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {Array.from(connectedEntityIds)
                .filter(id => id !== selectedEntity.id)
                .map(id => {
                  const ent = rawEntities.find(e => e.id === id);
                  if (!ent) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedEntityId(id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition-colors"
                    >
                      {ent.name}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:block">
            Click entity to inspect schema · Click lines for business rules
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
        className="relative flex-1 w-full h-full overflow-hidden select-none erd-grid-pattern cursor-grab active:cursor-grabbing"
      >
        {/* SVG Relationship Connector Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <marker
              id="arrow-cyan"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#06b6d4" />
            </marker>
            <marker
              id="arrow-purple"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#a855f7" />
            </marker>
            <marker
              id="arrow-muted"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#475569" />
            </marker>
          </defs>

          {visibleRelationships.map(rel => {
            const parentEntity = rawEntities.find(
              e => e.name.toLowerCase() === rel.parent.toLowerCase()
            );
            const childEntity = rawEntities.find(
              e => e.name.toLowerCase() === rel.child.toLowerCase()
            );

            if (!parentEntity || !childEntity) return null;

            const pPos = positions[parentEntity.id] || { x: parentEntity.x, y: parentEntity.y };
            const cPos = positions[childEntity.id] || { x: childEntity.x, y: childEntity.y };

            // Card dimensions approximation
            const cardWidth = 220;
            const pHeight = 35 + parentEntity.attributes.length * 22;
            const cHeight = 35 + childEntity.attributes.length * 22;

            // Connection anchor points
            const startX = pPos.x + cardWidth;
            const startY = pPos.y + pHeight / 2;
            const endX = cPos.x;
            const endY = cPos.y + cHeight / 2;

            // Curved cubic bezier
            const dx = Math.abs(endX - startX) * 0.5;
            const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

            // Determine highlighting
            const isConnectedToSelected =
              selectedEntityId &&
              (parentEntity.id === selectedEntityId || childEntity.id === selectedEntityId);

            const isDimmed = selectedEntityId && !isConnectedToSelected;

            return (
              <g
                key={rel.id}
                className="pointer-events-auto cursor-pointer group"
                onClick={e => {
                  e.stopPropagation();
                  setActiveRelationship(rel);
                }}
              >
                {/* Thick invisible path for easy clicking */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="cursor-pointer"
                />

                {/* Visible rendered path */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={
                    isConnectedToSelected
                      ? '#06b6d4'
                      : isDimmed
                      ? '#1e293b'
                      : '#475569'
                  }
                  strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                  strokeDasharray={isConnectedToSelected ? 'none' : '4 3'}
                  markerEnd={
                    isConnectedToSelected
                      ? 'url(#arrow-cyan)'
                      : isDimmed
                      ? 'url(#arrow-muted)'
                      : 'url(#arrow-purple)'
                  }
                  className="transition-colors duration-200 group-hover:stroke-cyan-300"
                />

                {/* Cardinality badge in middle of line */}
                {showRelationshipLabels && !isDimmed && (
                  <g
                    transform={`translate(${(startX + endX) / 2}, ${(startY + endY) / 2})`}
                  >
                    <rect
                      x="-18"
                      y="-10"
                      width="36"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke={isConnectedToSelected ? '#06b6d4' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isConnectedToSelected ? '#38bdf8' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {rel.cardinality}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Draggable Entity Cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {visibleEntities.map(entity => {
            const pos = positions[entity.id] || { x: entity.x, y: entity.y };
            const isSelected = selectedEntityId === entity.id;
            const isConnected = connectedEntityIds.has(entity.id);
            const isDimmed = selectedEntityId && !isSelected && !isConnected;

            return (
              <div
                key={entity.id}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  width: '230px',
                }}
                onMouseDown={e => handleStartDragCard(e, entity.id)}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedEntityId(entity.id);
                }}
                className={`entity-card absolute pointer-events-auto rounded-xl border shadow-xl transition-all duration-150 backdrop-blur-md cursor-move ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 shadow-cyan-500/20 z-30 scale-[1.02]'
                    : isConnected
                    ? 'border-cyan-500/70 bg-slate-900/90 shadow-md shadow-cyan-500/10 z-20'
                    : isDimmed
                    ? 'border-slate-800/60 bg-slate-950/60 opacity-35 z-10'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 z-10'
                }`}
              >
                {/* Entity Header */}
                <div
                  className={`p-2.5 border-b rounded-t-xl flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/40'
                      : isConnected
                      ? 'bg-slate-850 border-slate-800'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Database
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="font-bold text-xs text-white truncate">
                      {entity.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      entity.isLookup
                        ? 'bg-purple-500/20 text-purple-300'
                        : entity.isDocumentedExtra
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {entity.domain.substring(0, 4)}
                  </span>
                </div>

                {/* Entity Attributes Preview */}
                <div className="p-2 space-y-1 font-mono text-[11px]">
                  {entity.attributes.slice(0, 6).map(attr => (
                    <div
                      key={attr.name}
                      className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {attr.isPK && (
                          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <Key className="w-2.5 h-2.5" /> PK
                          </span>
                        )}
                        {attr.isFK && (
                          <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                            <Link2 className="w-2.5 h-2.5" /> FK
                          </span>
                        )}
                        <span
                          className={`truncate ${
                            attr.isPK
                              ? 'text-emerald-300 font-semibold'
                              : attr.isFK
                              ? 'text-amber-300'
                              : 'text-slate-300'
                          }`}
                        >
                          {attr.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {attr.type.split('(')[0]}
                      </span>
                    </div>
                  ))}

                  {entity.attributes.length > 6 && (
                    <div className="text-[10px] text-slate-400 text-center pt-0.5">
                      +{entity.attributes.length - 6} more attributes...
                    </div>
                  )}
                </div>

                {/* Card Quick Footer Indicator */}
                <div className="px-2 py-1 bg-slate-950/70 border-t border-slate-800/60 rounded-b-xl flex items-center justify-between text-[10px] text-slate-400">
                  <span>{entity.attributes.length} fields</span>
                  <span className="text-cyan-400 hover:underline">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Entity Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntityId(null)}
        relationships={RELATIONSHIPS}
        onSelectRelatedEntity={name => {
          const target = rawEntities.find(
            e => e.name.toLowerCase() === name.toLowerCase()
          );
          if (target) setSelectedEntityId(target.id);
        }}
      />

      {/* Relationship Modal */}
      <RelationshipModal
        relationship={activeRelationship}
        onClose={() => setActiveRelationship(null)}
        onSelectEntity={name => {
          const target = rawEntities.find(
            e => e.name.toLowerCase() === name.toLowerCase()
          );
          if (target) {
            setSelectedEntityId(target.id);
            setActiveRelationship(null);
          }
        }}
      />
    </div>
  );
};
