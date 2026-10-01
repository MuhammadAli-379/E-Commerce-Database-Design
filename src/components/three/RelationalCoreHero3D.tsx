import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Database, Play, Pause, RotateCcw, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface DomainSatellite {
  id: string;
  name: string;
  count: number;
  color: string;
  distance: number;
  angle: number;
  speed: number;
  mesh?: THREE.Mesh;
}

interface RelationalCoreHero3DProps {
  onSelectDomain?: (domain: string) => void;
}

const DOMAINS: Omit<DomainSatellite, 'mesh'>[] = [
  { id: 'Customer', name: 'Customer & Contact', count: 4, color: '#06b6d4', distance: 3.8, angle: 0, speed: 0.4 },
  { id: 'Address', name: 'Addresses & Geo', count: 3, color: '#3b82f6', distance: 4.2, angle: (Math.PI / 3) * 1, speed: 0.35 },
  { id: 'Product', name: 'Product Catalog', count: 3, color: '#8b5cf6', distance: 4.0, angle: (Math.PI / 3) * 2, speed: 0.45 },
  { id: 'Orders', name: 'Orders & Line Items', count: 3, color: '#f59e0b', distance: 3.7, angle: (Math.PI / 3) * 3, speed: 0.38 },
  { id: 'Payments', name: 'Payments & Gateway', count: 3, color: '#10b981', distance: 4.3, angle: (Math.PI / 3) * 4, speed: 0.32 },
  { id: 'Shipping', name: 'Shipment Logistics', count: 3, color: '#ef4444', distance: 3.9, angle: (Math.PI / 3) * 5, speed: 0.42 },
];

export const RelationalCoreHero3D: React.FC<RelationalCoreHero3DProps> = ({ onSelectDomain }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSupported } = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  const [isRotating, setIsRotating] = useState<boolean>(!prefersReducedMotion);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [activeDomainInfo, setActiveDomainInfo] = useState<{ name: string; count: number; color: string } | null>(null);

  useEffect(() => {
    if (!isSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Scene, Camera & Renderer ──────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Ensure DOM insertion
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // ── Lights ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 6.0, 15);
    cyanPointLight.position.set(0, 0, 0);
    scene.add(cyanPointLight);

    const topLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    topLight.position.set(5, 10, 7);
    scene.add(topLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 4.0, 20);
    purpleLight.position.set(-6, -4, -3);
    scene.add(purpleLight);

    // ── Root Group for Smooth Rotation ────────────────────
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // ── 1. The Relational Kernel (Center Crystal) ─────────
    const kernelGeo = new THREE.OctahedronGeometry(1.2, 0);
    const kernelMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const kernel = new THREE.Mesh(kernelGeo, kernelMat);
    coreGroup.add(kernel);

    // Inner wireframe lattice
    const wireGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireKernel = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireKernel);

    // ── 2. Three Normalization Concentric Gimbal Rings ─────
    // 1NF Ring (Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    coreGroup.add(ring1);

    // 2NF Ring (Purple)
    const ring2Geo = new THREE.TorusGeometry(2.4, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    coreGroup.add(ring2);

    // 3NF Ring (Emerald)
    const ring3Geo = new THREE.TorusGeometry(2.8, 0.025, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 3;
    ring3.rotation.y = Math.PI / 5;
    coreGroup.add(ring3);

    // ── 3. Six Orbiting Domain Satellites ──────────────────
    const domainObjects: (DomainSatellite & {
      mesh: THREE.Mesh;
      line: THREE.Line;
      particles: THREE.Points;
    })[] = [];

    const domainGroup = new THREE.Group();
    coreGroup.add(domainGroup);

    DOMAINS.forEach(dom => {
      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(dom.color),
        emissive: new THREE.Color(dom.color),
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.userData = { id: dom.id, name: dom.name, count: dom.count, color: dom.color };

      // Halo ring around each satellite
      const haloGeo = new THREE.TorusGeometry(0.55, 0.015, 12, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(dom.color),
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      mesh.add(halo);

      // Connecting filament line from center to satellite
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(dom.color),
        transparent: true,
        opacity: 0.35,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(dom.angle) * dom.distance,
          Math.sin(dom.angle * 1.5) * 0.8,
          Math.sin(dom.angle) * dom.distance
        ),
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      domainGroup.add(line);

      // Pulse particle on line
      const pulseGeo = new THREE.BufferGeometry();
      pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
      const pulseMat = new THREE.PointsMaterial({
        color: new THREE.Color(dom.color),
        size: 0.15,
        transparent: true,
        opacity: 0.9,
      });
      const particles = new THREE.Points(pulseGeo, pulseMat);
      domainGroup.add(particles);

      domainGroup.add(mesh);

      domainObjects.push({
        ...dom,
        mesh,
        line,
        particles,
      });
    });

    // ── 4. Ambient Sparkle Constellation ──────────────────
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 16;
      starPositions[i + 1] = (Math.random() - 0.5) * 12;
      starPositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Mouse Interaction & Orbit Controls ────────────────
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.006;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }

      // Raycast against domain satellites
      raycaster.setFromCamera(mouse, camera);
      const meshes = domainObjects.map(d => d.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        container.style.cursor = 'pointer';
        setHoveredDomain(data.name);
        setActiveDomainInfo({ name: data.name, count: data.count, color: data.color });
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredDomain(null);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = domainObjects.map(d => d.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        if (onSelectDomain) {
          onSelectDomain(data.id);
        }
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // ── Resize Observer ───────────────────────────────────
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // ── Animation Loop ────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth damping on rotation
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.08;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.08;

      if (isRotating && !prefersReducedMotion) {
        targetRotationY += 0.0035;

        // Animate Rings
        ring1.rotation.z += 0.008;
        ring2.rotation.x += 0.006;
        ring3.rotation.y -= 0.007;

        // Kernel pulsing
        const scale = 1.0 + Math.sin(time * 2.0) * 0.05;
        kernel.scale.set(scale, scale, scale);
        wireKernel.rotation.y -= 0.005;
        wireKernel.rotation.x += 0.004;

        // Domain satellites orbit motion
        domainObjects.forEach((dom, index) => {
          const currentAngle = dom.angle + time * dom.speed * 0.4;
          const x = Math.cos(currentAngle) * dom.distance;
          const y = Math.sin(currentAngle * 1.5 + index) * 0.9;
          const z = Math.sin(currentAngle) * dom.distance;

          dom.mesh.position.set(x, y, z);
          dom.mesh.rotation.y += 0.02;

          // Update connecting line
          const positions = dom.line.geometry.attributes.position.array as Float32Array;
          positions[3] = x;
          positions[4] = y;
          positions[5] = z;
          dom.line.geometry.attributes.position.needsUpdate = true;

          // Update pulse particle
          const pulseT = (time * 0.8 + index * 0.3) % 1.0;
          const px = x * (1 - pulseT);
          const py = y * (1 - pulseT);
          const pz = z * (1 - pulseT);
          const pPositions = dom.particles.geometry.attributes.position.array as Float32Array;
          pPositions[0] = px;
          pPositions[1] = py;
          pPositions[2] = pz;
          dom.particles.geometry.attributes.position.needsUpdate = true;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);

      // Dispose Geometries & Materials
      kernelGeo.dispose();
      kernelMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      starGeo.dispose();
      starMat.dispose();

      domainObjects.forEach(d => {
        d.mesh.geometry.dispose();
        if (Array.isArray(d.mesh.material)) {
          d.mesh.material.forEach(m => m.dispose());
        } else {
          d.mesh.material.dispose();
        }
        d.line.geometry.dispose();
        (d.line.material as THREE.Material).dispose();
        d.particles.geometry.dispose();
        (d.particles.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [isSupported, isRotating, prefersReducedMotion, onSelectDomain]);

  if (!isSupported) {
    return (
      <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-center">
        <Database className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-white mb-1">Spatial 3D Relational Core</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          WebGL acceleration is disabled or unavailable on this display device. The relational architecture remains fully accessible via the 2D Schematic Canvas.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[460px] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden group select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Badge: Normalization Engine Indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-cyan-300">ARC-3D SPATIAL KERNEL</span>
        </div>
      </div>

      {/* Domain Info Callout (when hovered) */}
      {hoveredDomain && activeDomainInfo && (
        <div className="absolute top-4 right-4 z-10 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeDomainInfo.color }}
            />
            <span className="font-bold text-xs text-white">{activeDomainInfo.name}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {activeDomainInfo.count} Normalized Tables &middot; Click to inspect
          </div>
        </div>
      )}

      {/* Normalization Ring Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1 text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> 1NF
        </span>
        <span className="text-slate-600">·</span>
        <span className="flex items-center gap-1 text-purple-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> 2NF
        </span>
        <span className="text-slate-600">·</span>
        <span className="flex items-center gap-1 text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 3NF
        </span>
      </div>

      {/* Interactive Controls Bar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause Orbital Motion' : 'Resume Orbital Motion'}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 backdrop-blur-md transition-colors shadow-lg"
        >
          {isRotating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Interaction Hint Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] text-slate-500 font-mono hidden md:block">
        Drag to Orbit &middot; Hover / Click Domain Nodes
      </div>
    </div>
  );
};
