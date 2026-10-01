import React from 'react';
import { Database, GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Academic Details */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              Database Systems · Semester 3 · Individual Project
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <span>Muhammad Abu Bakar</span>
              <span className="font-mono text-cyan-400">(FA24-BBD-109)</span>
              <span>·</span>
              <span>Prepared for Sir Ayyaz Mahmood</span>
            </div>
          </div>
        </div>

        {/* Course Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Educational Database Design Demonstration</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3NF Relational Model</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
