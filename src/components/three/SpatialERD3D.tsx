import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ENTITIES, RELATIONSHIPS } from '../../data/databaseData';
import { Entity, Relationship } from '../../types/database';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EntityDrawer } from '../EntityDrawer';
import { RelationshipModal } from '../RelationshipModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Layers,
  Network,
  Sparkles,
  Info,
} from 'lucide-react';

interface SpatialERD3DProps {
  schemaCountMode: 19 | 21;
}

const DOMAIN_COLOR_MAP: Record<string, string> = {
  Customer: '#06b6d4',
  Address: '#3b82f6',
  Product: '#8b5cf6',
  Orders: '#f59e0b',
  Payments: '#10b981',
  Shipping: '#ef4444',
  Inventory: '#f97316',
  Suppliers: '#ec4899',
};

// 3D Spatial positions mapped for logical relational clustering
const DOMAIN_CLUSTER_CENTERS: Record<string, [number, number, number]> = {
  Customer: [-6, 2, 0],
  Address: [-6, -3, 2],
  Product: [0, 5, -2],
  Inventory: [4, 5, -3],
  Suppliers: [7, 5, -4],
  Orders: [0, 0, 0],
  Payments: [5, -2, 1],
  Shipping: [5, 2, 2],
};

export const SpatialERD3D: React.FC<SpatialERD3DProps> = ({ schemaCountMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSupported } = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  // Active entities list
  const activeEntities = useMemo(() => {
    return ENTITIES.filter(e => schemaCountMode === 21 || !e.isDocumentedExtra);
  }, [schemaCountMode]);

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('orders');
  const [activeRelationship, setActiveRelationship] = useState<Relationship | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [showLabels, setShowLabels] = useState(true);

  // Selected Entity
  const selectedEntity = useMemo(() => {
    return activeEntities.find(e => e.id === selectedEntityId) || null;
  }, [activeEntities, selectedEntityId]);

  // Connected entities for highlighting
  const connectedEntityIds = useMemo(() => {
    if (!selectedEntity) return new Set<string>();
    const ids = new Set<string>([selectedEntity.id]);

    RELATIONSHIPS.forEach(rel => {
      const parent = activeEntities.find(e => e.name.toLowerCase() === rel.parent.toLowerCase());
      const child = activeEntities.find(e => e.name.toLowerCase() === rel.child.toLowerCase());
      if (parent && child) {
        if (parent.id === selectedEntity.id) ids.add(child.id);
        if (child.id === selectedEntity.id) ids.add(parent.id);
      }
    });

    return ids;
  }, [selectedEntity, activeEntities]);

  // Three.js Scene Setup
  useEffect(() => {
    if (!isSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // ── Lights ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0f172a, 3.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.0);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // ── Grid Plane for Spatial Orientation ───────────────
    const gridHelper = new THREE.GridHelper(36, 36, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // ── Compute 3D Coordinates for Entities ──────────────
    const entityCoords: Record<string, THREE.Vector3> = {};
    const domainCounters: Record<string, number> = {};

    activeEntities.forEach(ent => {
      const center = DOMAIN_CLUSTER_CENTERS[ent.domain] || [0, 0, 0];
      const count = domainCounters[ent.domain] || 0;
      domainCounters[ent.domain] = count + 1;

      // Layout in a small rosette around cluster center
      const angle = (count * Math.PI * 2) / 3.5;
      const radius = count === 0 ? 0 : 2.2;
      const x = center[0] + Math.cos(angle) * radius;
      const y = center[1] + (count % 2 === 0 ? 0.6 : -0.6);
      const z = center[2] + Math.sin(angle) * radius;

      entityCoords[ent.id] = new THREE.Vector3(x, y, z);
    });

    // ── Entity 3D Monolith Nodes ─────────────────────────
    const nodeMeshes: THREE.Mesh[] = [];
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    activeEntities.forEach(ent => {
      const pos = entityCoords[ent.id] || new THREE.Vector3(0, 0, 0);
      const colorHex = DOMAIN_COLOR_MAP[ent.domain] || '#06b6d4';
      const isSelected = selectedEntityId === ent.id;
      const isConnected = connectedEntityIds.has(ent.id);
      const isDimmed = selectedEntityId && !isSelected && !isConnected;

      // Entity Monolith Box
      const boxGeo = new THREE.BoxGeometry(2.2, 1.2, 0.4);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: isSelected ? 0.7 : isConnected ? 0.4 : isDimmed ? 0.05 : 0.25,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: isDimmed ? 0.25 : 0.95,
      });

      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.copy(pos);
      mesh.userData = { id: ent.id, name: ent.name, domain: ent.domain };
      rootGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Glowing Wireframe Outline
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffffff : new THREE.Color(colorHex),
        transparent: true,
        opacity: isDimmed ? 0.2 : 0.8,
      });
      const wire = new THREE.LineSegments(edges, lineMat);
      mesh.add(wire);

      // Label Canvas Texture for Monolith
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = colorHex;
        ctx.fillRect(0, 0, 512, 16);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ent.name, 256, 110);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px "JetBrains Mono", monospace';
        ctx.fillText(`${ent.attributes.length} Fields · PK: ${ent.primaryKey}`, 256, 170);

        const tex = new THREE.CanvasTexture(canvas);
        const labelGeo = new THREE.PlaneGeometry(2.1, 1.1);
        const labelMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: isDimmed ? 0.25 : 0.95,
        });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.z = 0.21;
        mesh.add(labelMesh);
      }
    });

    // ── Relational Spline Tubes (Connections) ───────────
    const relationshipSplines: { line: THREE.Line; rel: Relationship }[] = [];

    RELATIONSHIPS.forEach(rel => {
      const parent = activeEntities.find(e => e.name.toLowerCase() === rel.parent.toLowerCase());
      const child = activeEntities.find(e => e.name.toLowerCase() === rel.child.toLowerCase());
      if (!parent || !child) return;

      const pPos = entityCoords[parent.id];
      const cPos = entityCoords[child.id];
      if (!pPos || !cPos) return;

      const isConnected =
        selectedEntityId && (parent.id === selectedEntityId || child.id === selectedEntityId);
      const isDimmed = selectedEntityId && !isConnected;

      // Curve midpoint with slight vertical lift
      const mid = new THREE.Vector3()
        .addVectors(pPos, cPos)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 1.2, 0));

      const curve = new THREE.QuadraticBezierCurve3(pPos, mid, cPos);
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: isConnected ? 0x06b6d4 : isDimmed ? 0x1e293b : 0x475569,
        transparent: true,
        opacity: isConnected ? 1.0 : isDimmed ? 0.15 : 0.45,
        linewidth: isConnected ? 3 : 1,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
      relationshipSplines.push({ line, rel });
    });

    // ── Orbit Controls (Mouse Drag & Wheel) ──────────────
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotY = 0;
    let targetRotX = 0;
    let zoomDistance = 18;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.005;
        prevMouse = { x: e.clientX, y: e.clientY };
      }

      // Raycast hover
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes, false);
      container.style.cursor = hits.length > 0 ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomDistance = Math.max(8, Math.min(32, zoomDistance + e.deltaY * 0.02));
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes, false);
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        setSelectedEntityId(hit.userData.id);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // ── Resize Observer ──────────────────────────────────
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width: nw, height: nh } = entries[0].contentRect;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    resizeObserver.observe(container);

    // ── Animation Loop ───────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth damping on orbit rotation
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;

      // Smooth zoom distance
      camera.position.z += (zoomDistance - camera.position.z) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);

      nodeMeshes.forEach(m => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
        else m.material.dispose();
      });

      relationshipSplines.forEach(s => {
        s.line.geometry.dispose();
        (s.line.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [activeEntities, selectedEntityId, connectedEntityIds, isSupported]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top 3D Control Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        {/* Left: Domain Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D SPATIAL RELATIONAL GRAPH</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-xs">
          {selectedEntityId && (
            <button
              onClick={() => setSelectedEntityId(null)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              Clear Focus
            </button>
          )}

          <div className="text-[11px] text-slate-400 font-mono hidden md:block">
            {activeEntities.length} 3D Nodes Active &middot; Drag to Orbit &middot; Click to Inspect
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative" />

      {/* Floating Entity Details Drawer */}
      <EntityDrawer
        entity={selectedEntity}
        onClose={() => setSelectedEntityId(null)}
        relationships={RELATIONSHIPS}
        onSelectRelatedEntity={name => {
          const target = activeEntities.find(e => e.name.toLowerCase() === name.toLowerCase());
          if (target) setSelectedEntityId(target.id);
        }}
      />
    </div>
  );
};
