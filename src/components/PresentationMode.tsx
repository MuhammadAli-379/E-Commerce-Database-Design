import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Presentation,
  CheckCircle2,
  Table,
  SlidersHorizontal,
  GitFork,
  Database,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { BASE_TABLES, ENTITIES, SAMPLE_DATA } from '../data/databaseData';

interface PresentationModeProps {
  onClose: () => void;
  schemaCountMode: 19 | 21;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  onClose,
  schemaCountMode,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'overview',
      title: '1. Project Overview & Term Defense',
      subtitle: 'Coursework: Database Systems · Semester 3',
      content: (
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
            Individual Term Project Defense
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            E-Commerce Database Design &amp; Normalization
          </h1>

          <p className="text-lg text-slate-300">
            A Rigorous 1NF · 2NF · 3NF Transformation Demonstration
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs uppercase text-slate-400 font-mono">Candidate Student</span>
              <div className="text-lg font-bold text-white mt-1">Muhammad Abu Bakar</div>
              <div className="text-xs text-cyan-400 font-mono">FA24-BBD-109</div>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-400 font-mono">Evaluated By</span>
              <div className="text-lg font-bold text-white mt-1">Sir Ayyaz Mahmood</div>
              <div className="text-xs text-slate-400">Department of Computer Science</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm">
            Core Scope: Transforming 9 base tables into {schemaCountMode} normalized relational entities to guarantee zero redundancy and prevent database anomalies.
          </div>
        </div>
      ),
    },
    {
      id: 'base_tables',
      title: '2. The Problem: Original 9 Base Tables',
      subtitle: 'Monolithic starting records suffering from redundancy & anomalies',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <p className="text-slate-300 text-base leading-relaxed">
            The initial e-commerce requirements were consolidated into 9 monolithic tables. These tables suffered from significant repeating groups, partial key dependencies, and transitive update anomalies.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {BASE_TABLES.map(table => (
              <div key={table.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-amber-400 font-mono font-bold block">{table.name}</span>
                <span className="text-slate-400 text-[11px] block mt-1 line-clamp-2">
                  {table.originalPurpose}
                </span>
                <div className="mt-2 text-[10px] text-red-300/80 bg-red-950/40 p-1 rounded font-mono truncate">
                  {table.anomalies[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: '1nf',
      title: '3. First Normal Form (1NF)',
      subtitle: 'Eliminating repeating groups and enforcing atomic values',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-red-500/30">
              <span className="text-xs font-mono font-bold text-red-400 uppercase">1NF Violation Example</span>
              <h3 className="text-lg font-bold text-white mt-1">Repeating Order Items</h3>
              <div className="mt-3 font-mono text-xs bg-slate-950 p-3 rounded-lg text-slate-300 space-y-1">
                <div className="text-slate-500">TABLE Orders</div>
                <div className="text-emerald-400">OrderID</div>
                <div>Customer</div>
                <div className="text-red-400 bg-red-950/40 p-1 rounded">Product1, Qty1</div>
                <div className="text-red-400 bg-red-950/40 p-1 rounded">Product2, Qty2</div>
                <div className="text-red-400 bg-red-950/40 p-1 rounded">Product3, Qty3</div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Flaw: Fixed column limit, wasted NULL space, and inability to query products cleanly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">1NF Solution</span>
              <h3 className="text-lg font-bold text-white mt-1">Atomic Line Decomposition</h3>
              <div className="mt-3 font-mono text-xs bg-slate-950 p-3 rounded-lg text-slate-300 space-y-2">
                <div className="p-1.5 rounded bg-slate-900">
                  <div className="text-cyan-400">TABLE Orders</div>
                  <div>OrderID, CustomerID, OrderDate</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900">
                  <div className="text-cyan-400">TABLE OrderItems</div>
                  <div>OrderItemID, OrderID, ProductID, Qty, UnitPrice</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Advantage: Infinite items supported, zero NULL fields, fully atomic attributes.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '2nf',
      title: '4. Second Normal Form (2NF)',
      subtitle: 'Eliminating partial functional dependencies on composite candidate keys',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">Composite Key Dependency Rule</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              In a table with composite key <code className="text-cyan-300 font-mono">{'{OrderID, ProductID}'}</code>, non-key attributes must depend on both keys together.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-red-500/20">
                <span className="text-red-400 font-bold block mb-1">Violation in Composite Table:</span>
                <div className="text-slate-300 space-y-1">
                  <div>{'{OrderID, ProductID}'} → Quantity (Full)</div>
                  <div className="text-red-400 font-bold bg-red-950/40 p-1 rounded">
                    ProductID → ProductName (Partial!)
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-sans">
                  ProductName depends only on ProductID. Repeating it in every order line violates 2NF.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold block mb-1">2NF Resolved Schema:</span>
                <div className="text-slate-300 space-y-1">
                  <div className="text-cyan-400">Product: ProductID → ProductName</div>
                  <div className="text-cyan-400">OrderItems: OrderItemID → OrderID, ProductID, Qty</div>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-sans">
                  Product catalog separated from sales lines. Updates happen in exactly one place.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '3nf',
      title: '5. Third Normal Form (3NF)',
      subtitle: 'Eliminating transitive dependencies (X → Y → Z)',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Transitive Dependency Removal</h3>
            <p className="text-slate-300 text-sm">
              Non-key attributes must never depend on other non-key attributes.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 font-mono text-xs space-y-2">
              <div className="text-amber-400">ProductID → CategoryID → CategoryName (Transitive Chain)</div>
              <div className="text-amber-400">ProductID → BrandID → BrandName (Transitive Chain)</div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Category</span>
                <span className="text-emerald-400">PK CategoryID</span>
                <div className="text-slate-300">CategoryName</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Brand</span>
                <span className="text-emerald-400">PK BrandID</span>
                <div className="text-slate-300">BrandName, Country</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Product</span>
                <span className="text-emerald-400">PK ProductID</span>
                <span className="text-amber-400 block">FK CategoryID, BrandID</span>
                <div className="text-slate-300">SKU, Price, Cost</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'schema',
      title: '6. Final Relational Schema',
      subtitle: `${schemaCountMode} Authoritative Normalized Entities`,
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          <p className="text-slate-300 text-sm">
            Categorized by domain, completely isolated into single-responsibility tables:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto pr-2">
            {ENTITIES.filter(e => schemaCountMode === 21 || !e.isDocumentedExtra).map(e => (
              <div key={e.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="font-bold text-white truncate">{e.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">{e.domain}</div>
                <div className="text-[10px] text-slate-400 mt-1">{e.attributes.length} columns</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'erd',
      title: '7. Entity Relationship Model (ERD)',
      subtitle: 'Referential integrity network with strict foreign key constraints',
      content: (
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <GitFork className="w-12 h-12 text-cyan-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Full Interactive Topology Available</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The live ERD canvas supports zooming, dynamic node dragging, parent-child relationship line inspection, and connected hub filtering.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono">
              Orders connects to Customers, Order Items, Financials, Payments, and Shipments
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sample_data',
      title: '8. Relational Data Verification',
      subtitle: 'Demonstrating real records grounded in the report',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          <p className="text-slate-300 text-sm">
            Realistic data records verified against primary and foreign key constraints:
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-2">Customers Sample</span>
              {SAMPLE_DATA.Customers.slice(0, 3).map((c, i) => (
                <div key={i} className="py-1 border-b border-slate-800 last:border-0 text-slate-300">
                  #{String(c.CustomerID)} — {String(c.Name)} ({String(c.CreatedAt).split(' ')[0]})
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-2">Product Catalog Sample</span>
              {SAMPLE_DATA.Product.slice(0, 3).map((p, i) => (
                <div key={i} className="py-1 border-b border-slate-800 last:border-0 text-slate-300">
                  {String(p.ProductName)} — ${Number(p.Price).toFixed(2)} ({String(p.SKU)})
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'conclusion',
      title: '9. Viva Conclusion & Defense Summary',
      subtitle: 'Key architectural takeaways for database systems examination',
      content: (
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Normalized Relational Design Delivered</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              The project demonstrates mastery of relational database design: separating business domains into atomic, non-redundant, and referentially sound tables.
            </p>

            <div className="pt-4 border-t border-slate-800 font-mono text-sm text-cyan-300">
              9 Base Tables → {schemaCountMode} Normalized Entities (1NF · 2NF · 3NF Certified)
            </div>

            <div className="text-xs text-slate-400">
              Prepared by: <strong className="text-white">Muhammad Abu Bakar (FA24-BBD-109)</strong> for <strong className="text-white">Sir Ayyaz Mahmood</strong>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 md:p-10 select-none animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">
              Presentation Mode · Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="text-sm font-bold text-white">{slide.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick slide selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs ${
                  currentSlide === i ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Exit Viva Mode</span>
          </button>
        </div>
      </div>

      {/* Main Slide Content Canvas */}
      <div className="flex-1 flex flex-col justify-center py-6 overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {slide.title}
          </h2>
          <p className="text-sm md:text-base text-cyan-400 font-medium mt-1">
            {slide.subtitle}
          </p>
        </div>

        <div className="w-full">{slide.content}</div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="hidden sm:inline">Navigate:</span>
          <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px]">←</kbd>
          <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px]">→</kbd>
          <span className="hidden sm:inline">or Space</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
