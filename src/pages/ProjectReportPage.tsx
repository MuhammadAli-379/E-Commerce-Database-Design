import React from 'react';
import { ProjectReport } from '../components/ProjectReport';
import { Printer, Download, BookOpen } from 'lucide-react';

interface ProjectReportPageProps {
  schemaCountMode: 19 | 21;
  setSchemaCountMode: (mode: 19 | 21) => void;
}

export const ProjectReportPage: React.FC<ProjectReportPageProps> = ({
  schemaCountMode,
  setSchemaCountMode,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">
            Academic Project Documentation &amp; Defense Dossier
          </span>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <ProjectReport
        schemaCountMode={schemaCountMode}
        setSchemaCountMode={setSchemaCountMode}
      />
    </div>
  );
};
