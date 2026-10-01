import React, { useState } from 'react';
import { BASE_TABLES } from '../data/databaseData';
import {
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Split,
  Layers,
  Sparkles,
  AlertTriangle,
  GitBranch,
  Table,
} from 'lucide-react';

export const NormalizationLab: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'journey' | '1nf' | '2nf' | '3nf' | 'base_tables'>('journey');
  const [selectedBaseTableId, setSelectedBaseTableId] = useState<string>('base_customers');

  const selectedBaseTable = BASE_TABLES.find(b => b.id === selectedBaseTableId) || BASE_TABLES[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <SlidersHorizontal className="w-7 h-7 text-purple-400" />
            <span>Normalization Lab</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Systematic mathematical decomposition: 1NF (Atomic) → 2NF (No Partial Key) → 3NF (No Transitive Dependencies)
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveStage('journey')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeStage === 'journey'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Journey Timeline
          </button>
          <button
            onClick={() => setActiveStage('1nf')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeStage === '1nf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1NF Visualization
          </button>
          <button
            onClick={() => setActiveStage('2nf')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeStage === '2nf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2NF Dependency
          </button>
          <button
            onClick={() => setActiveStage('3nf')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeStage === '3nf'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3NF Transitive
          </button>
          <button
            onClick={() => setActiveStage('base_tables')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeStage === 'base_tables'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            9 Base Tables Explorer
          </button>
        </div>
      </div>

      {/* STAGE 1: Journey Timeline */}
      {activeStage === 'journey' && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">Relational Normalization Pipeline</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Relational databases prevent update anomalies and minimize redundant storage by enforcing progressively stricter functional dependency normal forms.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 0 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-1">
                  Starting State
                </div>
                <h3 className="font-bold text-sm text-white">9 Base Tables</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Monolithic records with repeating phone/email columns, composite items, and mixed vendor data.
                </p>
                <div className="mt-3 text-[11px] font-mono text-amber-300/80 bg-amber-950/30 p-1.5 rounded">
                  Anomaly: Severe Redundancy
                </div>
              </div>

              {/* Step 1NF */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 relative">
                <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1">
                  First Normal Form
                </div>
                <h3 className="font-bold text-sm text-white">1NF · Atomicity</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Removes repeating groups (Product1, Product2, Phone1, Phone2). Every cell contains atomic values.
                </p>
                <div className="mt-3 text-[11px] font-mono text-cyan-300/80 bg-cyan-950/30 p-1.5 rounded">
                  Result: Atomic Line Items
                </div>
              </div>

              {/* Step 2NF */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 relative">
                <div className="text-[10px] font-mono uppercase text-blue-400 font-bold mb-1">
                  Second Normal Form
                </div>
                <h3 className="font-bold text-sm text-white">2NF · Full Functional</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Removes partial dependencies on composite keys. Non-key attributes depend on the entire candidate key.
                </p>
                <div className="mt-3 text-[11px] font-mono text-blue-300/80 bg-blue-950/30 p-1.5 rounded">
                  Result: Product separated from lines
                </div>
              </div>

              {/* Step 3NF */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 relative">
                <div className="text-[10px] font-mono uppercase text-purple-400 font-bold mb-1">
                  Third Normal Form
                </div>
                <h3 className="font-bold text-sm text-white">3NF · No Transitive</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Removes transitive dependencies where non-key attributes depend on other non-key attributes (Category, Brand, Carriers).
                </p>
                <div className="mt-3 text-[11px] font-mono text-purple-300/80 bg-purple-950/30 p-1.5 rounded">
                  Result: 19/21 Normalized Schema
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveStage('1nf')}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect 1NF Repeating Groups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveStage('2nf')}
                className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect 2NF Partial Key Diagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveStage('3nf')}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect 3NF Transitive Decomposition</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: 1NF Visualization */}
      {activeStage === '1nf' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <Split className="w-4 h-4" /> First Normal Form (1NF)
            </div>
            <h2 className="text-xl font-bold text-white">Removal of Repeating Groups &amp; Multi-Valued Attributes</h2>
            <blockquote className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-3">
              First Normal Form removes repeating groups and ensures attributes contain atomic (indivisible) values.
            </blockquote>

            {/* Before vs After Comparison */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Before 1NF */}
              <div className="p-5 rounded-xl bg-slate-950 border border-red-500/30">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-red-500/20">
                  <span className="font-bold text-sm text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Before 1NF (Unnormalized Orders)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                    Violates 1NF
                  </span>
                </div>

                <div className="font-mono text-xs space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                  <div className="text-slate-400">TABLE Orders_Unnormalized</div>
                  <div className="text-emerald-400 font-bold">PK  OrderID</div>
                  <div>    Customer</div>
                  <div className="text-red-400 bg-red-950/40 px-1 py-0.5 rounded font-bold">
                    Product1, Qty1 (Repeating Group 1)
                  </div>
                  <div className="text-red-400 bg-red-950/40 px-1 py-0.5 rounded font-bold">
                    Product2, Qty2 (Repeating Group 2)
                  </div>
                  <div className="text-red-400 bg-red-950/40 px-1 py-0.5 rounded font-bold">
                    Product3, Qty3 (Repeating Group 3)
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 space-y-1 leading-relaxed">
                  <p className="text-red-300 font-semibold">The Fundamental Flaws:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                    <li>Hardcoded column limits (cannot purchase 4 items without DDL schema change).</li>
                    <li>Wasted NULL storage for orders with only 1 item.</li>
                    <li>Complex queries required to search for a product across Product1, Product2, and Product3.</li>
                  </ul>
                </div>
              </div>

              {/* After 1NF */}
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
                  <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> After 1NF (Normalized Decomposition)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    1NF Compliant
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="font-mono text-xs space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                    <div className="text-cyan-400 font-bold">TABLE Orders</div>
                    <div className="text-emerald-400">PK  OrderID</div>
                    <div className="text-amber-400">FK  CustomerID</div>
                    <div>    OrderDate</div>
                  </div>

                  <div className="font-mono text-xs space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                    <div className="text-cyan-400 font-bold">TABLE OrderItems</div>
                    <div className="text-emerald-400">PK  OrderItemID</div>
                    <div className="text-amber-400">FK  OrderID</div>
                    <div className="text-amber-400">FK  ProductID</div>
                    <div>    Quantity</div>
                    <div>    UnitPrice</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 space-y-1 leading-relaxed">
                  <p className="text-emerald-300 font-semibold">Normalized Advantages:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                    <li>Infinite item support without altering database table schemas.</li>
                    <li>Zero NULL values stored for orders with single line items.</li>
                    <li>Simple relational queries via standard Foreign Key indexing.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: 2NF Visualization */}
      {activeStage === '2nf' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-blue-400 font-mono text-xs font-bold uppercase">
              <GitBranch className="w-4 h-4" /> Second Normal Form (2NF)
            </div>
            <h2 className="text-xl font-bold text-white">Elimination of Partial Functional Dependencies</h2>
            <blockquote className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-3">
              Second Normal Form removes partial dependencies from tables with composite keys. Every non-prime attribute must depend on the whole candidate key, not just a subset.
            </blockquote>

            {/* Interactive Dependency Visualizer */}
            <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Dependency Graph on Composite Key {'{OrderID, ProductID}'}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Composite Key Flaw */}
                <div className="p-4 rounded-xl bg-slate-900 border border-red-500/30 text-xs">
                  <div className="font-bold text-red-400 mb-2">Partial Key Dependency Problem</div>
                  <div className="font-mono bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                    <div className="text-slate-400">Composite Key: <span className="text-white">{'{OrderID, ProductID}'}</span></div>
                    <div className="text-emerald-400">OrderID + ProductID → Quantity (Full Dependency)</div>
                    <div className="text-emerald-400">OrderID + ProductID → UnitPrice (Snapshotted)</div>
                    <div className="text-red-400 font-bold bg-red-950/40 p-1 rounded">
                      ProductID → ProductName (Partial Dependency!)
                    </div>
                  </div>
                  <p className="mt-2 text-slate-400 text-[11px]">
                    <span className="text-red-300 font-semibold">Why this breaks 2NF:</span> <code className="text-slate-200">ProductName</code> depends only on <code className="text-amber-300">ProductID</code>, not on <code className="text-cyan-300">OrderID</code>. Repeating the name across order rows wastes space and creates update anomalies.
                  </p>
                </div>

                {/* 2NF Solution */}
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
                  <div className="font-bold text-emerald-400 mb-2">2NF Solution: Decouple Catalog Item</div>
                  <div className="font-mono bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-cyan-400 font-bold">TABLE Product (Catalog)</div>
                      <div className="text-emerald-400">PK ProductID → ProductName, Price, Cost</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-cyan-400 font-bold">TABLE OrderItems (Transaction)</div>
                      <div className="text-emerald-400">PK OrderItemID</div>
                      <div className="text-amber-400">FK OrderID, FK ProductID</div>
                      <div>Quantity, UnitPrice</div>
                    </div>
                  </div>
                  <p className="mt-2 text-slate-400 text-[11px]">
                    <span className="text-emerald-300 font-semibold">Result:</span> Full functional dependency achieved. Changing a product name only happens in one single place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: 3NF Visualization */}
      {activeStage === '3nf' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-purple-400 font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" /> Third Normal Form (3NF)
            </div>
            <h2 className="text-xl font-bold text-white">Elimination of Transitive Dependencies</h2>
            <blockquote className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed border-l-2 border-purple-500 pl-3">
              Third Normal Form removes transitive dependencies where a non-key attribute depends on another non-key attribute (X → Y → Z).
            </blockquote>

            {/* Before vs After Transitive Resolution */}
            <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transitive Problem */}
                <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
                  <div className="font-bold text-amber-400 mb-2 flex items-center justify-between">
                    <span>Transitive Chains in Product Table</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Transitive Chains
                    </span>
                  </div>

                  <div className="font-mono bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                    <div className="text-cyan-300 font-bold">Unnormalized Product Columns:</div>
                    <div className="text-slate-400 pl-2">
                      ProductID, ProductName, CategoryID, CategoryName, BrandID, BrandName
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1.5">
                      <div className="text-amber-300">
                        ProductID → CategoryID → <span className="text-red-400 font-bold underline">CategoryName</span>
                      </div>
                      <div className="text-amber-300">
                        ProductID → BrandID → <span className="text-red-400 font-bold underline">BrandName</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-slate-400 text-[11px] space-y-1">
                    <p className="text-amber-300 font-semibold">Anomalies Caused:</p>
                    <p>• If brand 'Samsung' changes its corporate name, all Samsung products must be rewritten.</p>
                    <p>• If you delete the only laptop in inventory, you lose the 'Laptops' category entirely!</p>
                  </div>
                </div>

                {/* 3NF Normalized Schema */}
                <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 text-xs">
                  <div className="font-bold text-purple-300 mb-2 flex items-center justify-between">
                    <span>3NF Decomposed Schema</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      3NF Certified
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-cyan-400 font-bold">TABLE Category</div>
                      <div><span className="text-emerald-400">PK CategoryID</span>, CategoryName</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-cyan-400 font-bold">TABLE Brand</div>
                      <div><span className="text-emerald-400">PK BrandID</span>, BrandName, Country</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-cyan-400 font-bold">TABLE Product</div>
                      <div>
                        <span className="text-emerald-400">PK ProductID</span>,{' '}
                        <span className="text-amber-400">FK CategoryID</span>,{' '}
                        <span className="text-amber-400">FK BrandID</span>, SKU, ProductName, Price, Cost, Active
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-slate-400 text-[11px]">
                    <span className="text-purple-300 font-semibold">Outcome:</span> Category and brand data can be modified or created independently of individual product rows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: 9 Base Tables Explorer */}
      {activeStage === 'base_tables' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">From 9 Base Tables to Normalized Entities</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Explore how each of the 9 foundational base tables was decomposed into the final authoritative relational schema.
            </p>

            {/* Base Table Selectors */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {BASE_TABLES.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedBaseTableId(table.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedBaseTableId === table.id
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Table className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />
                  <span className="block truncate">{table.name.split('.')[1].trim().split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Detailed Selected Base Table Breakdown */}
            <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {selectedBaseTable.domain} Domain
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedBaseTable.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400">Resulting Entities:</span>
                  {selectedBaseTable.resultingEntities.map(res => (
                    <span
                      key={res}
                      className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium"
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              {/* Original Purpose & Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <h4 className="font-semibold text-white mb-1.5">Original Scope &amp; Purpose</h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedBaseTable.originalPurpose}
                  </p>
                  <div className="mt-3 font-mono text-[10px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 overflow-x-auto">
                    Columns: {selectedBaseTable.originalColumns.join(', ')}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <h4 className="font-semibold text-red-400 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Anomalies Identified
                  </h4>
                  <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                    {selectedBaseTable.anomalies.map((anom, idx) => (
                      <li key={idx}>{anom}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Normalization Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                    1NF Transformation
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedBaseTable.nf1Explanation}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-1">
                    2NF Transformation
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedBaseTable.nf2Explanation}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">
                    3NF Transformation
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedBaseTable.nf3Explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
