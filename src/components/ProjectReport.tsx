import React from 'react';
import {
  FileText,
  GraduationCap,
  Target,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ProjectReportProps {
  schemaCountMode: 19 | 21;
  setSchemaCountMode: (mode: 19 | 21) => void;
}

export const ProjectReport: React.FC<ProjectReportProps> = ({
  schemaCountMode,
  setSchemaCountMode,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Title & Academic Header */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          <span>Database Systems Coursework</span>
          <span className="text-slate-600">·</span>
          <span>Semester 3 Term Project</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Comprehensive Database Design &amp; Normalization Report
        </h1>

        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Candidate Student</span>
              <span className="font-bold text-white text-sm">Muhammad Abu Bakar</span>
              <span className="text-slate-400 block font-mono">Registration: FA24-BBD-109</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Course Instructor</span>
              <span className="font-bold text-white text-sm">Sir Ayyaz Mahmood</span>
              <span className="text-slate-400 block">Department of Computer Science</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Consistency Notes Panel (Section 21) */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Academic Consistency &amp; Entity Count Discrepancy Analysis</span>
        </div>
        <p className="leading-relaxed">
          The submitted coursework report contains numerical variations across sections:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 leading-relaxed">
          <li>Certain prose sections reference <strong>17 or 18 entities</strong>.</li>
          <li>The final explicit relational list precisely names <strong>19 entities</strong> (the authoritative baseline).</li>
          <li>
            <strong>Inventory</strong> and <strong>Suppliers</strong> are thoroughly discussed and assigned foreign key relationships in the functional text, but were omitted from the final 19-item summary enumeration.
          </li>
          <li>The concluding section references &ldquo;17–18 entities.&rdquo;</li>
        </ol>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <div>
            <span className="font-semibold text-white">Application Resolution:</span>
            <span className="text-slate-400 ml-1">
              Supports both views dynamically without hiding discrepancies.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSchemaCountMode(19)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors ${
                schemaCountMode === 19
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              19 Final Entities
            </button>
            <button
              onClick={() => setSchemaCountMode(21)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors ${
                schemaCountMode === 21
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              21 Complete Documented
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>1. Executive Summary</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          The database was designed for a comprehensive e-commerce enterprise architecture covering customer accounts, multi-channel contact methods, physical and geospatial address telemetry, catalog product taxonomy, inventory logistics, sales transactions, order financials, payment settlements, and multi-carrier courier fulfillment.
        </p>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          The initial monolithic design of 9 base tables contained repeating groups, composite partial key dependencies, and transitive non-key dependencies. By applying rigorous normalization principles through 1NF, 2NF, and 3NF, the schema was decomposed into 19 authoritative relational entities (21 including warehouse inventory and procurement vendors).
        </p>
      </div>

      {/* Design Goals */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>2. Architectural Design Goals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Organize Data Logically</span>
              <span className="text-slate-400">Strict separation of concerns between catalog, orders, and logistics.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Eliminate Redundancy</span>
              <span className="text-slate-400">Zero duplicated brand, category, or customer contact strings.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Prevent Update &amp; Deletion Anomalies</span>
              <span className="text-slate-400">Modifying a carrier or brand does not corrupt historical order lines.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Enforce Referential Integrity</span>
              <span className="text-slate-400">Primary Key and Foreign Key constraints with defined cascade rules.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Normalization Outcome */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>3. Final Outcome &amp; Transformation</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          The transformation eliminates all multi-valued repeating columns (1NF), ensures all non-key fields depend on the complete primary key (2NF), and extracts lookup dependencies like <code className="text-cyan-300">Category</code>, <code className="text-cyan-300">Brand</code>, <code className="text-cyan-300">Payment Method</code>, and <code className="text-cyan-300">Carriers</code> into dedicated reference master tables (3NF).
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-4 text-xs font-mono">
          <span className="text-amber-400 font-bold">9 Base Tables</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span className="text-purple-400 font-bold">1NF · 2NF · 3NF</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span className="text-emerald-400 font-bold">{schemaCountMode} Normalized Entities</span>
        </div>
      </div>

      {/* Conclusion (Section 25) */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <span>4. Conclusion</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          The normalized relational database design successfully isolates customer management, address spatial coordinates, product cataloging, inventory supply, order checkout headers, financial ledgers, payment settlement traces, and logistics consignments into independent logical entities.
        </p>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Normalization:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2">
          <li>removes repeating groups</li>
          <li>reduces redundancy</li>
          <li>removes partial dependencies</li>
          <li>removes transitive dependencies</li>
          <li>improves consistency</li>
          <li>strengthens referential integrity</li>
          <li>makes the database easier to maintain and extend</li>
        </ul>

        <div className="pt-4 text-center">
          <span className="inline-block px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs font-bold text-cyan-300">
            9 Base Tables → Normalized Relational Design
          </span>
        </div>
      </div>
    </div>
  );
};
