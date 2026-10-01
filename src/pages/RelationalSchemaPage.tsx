import React, { useState } from 'react';
import { RelationalSchema } from '../components/RelationalSchema';
import { ENTITIES } from '../data/databaseData';
import { Code2, Download, Copy, Check, Terminal } from 'lucide-react';

interface RelationalSchemaPageProps {
  schemaCountMode: 19 | 21;
}

export const RelationalSchemaPage: React.FC<RelationalSchemaPageProps> = ({ schemaCountMode }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [exportDialect, setExportDialect] = useState<'postgres' | 'mysql' | 'sqlite'>('postgres');

  const activeEntities = ENTITIES.filter(
    e => schemaCountMode === 21 || !e.isDocumentedExtra
  );

  const generateFullDDL = () => {
    return activeEntities
      .map(entity => {
        const lines = entity.attributes.map(attr => {
          let typeStr = attr.type;
          if (exportDialect === 'sqlite') {
            if (attr.type.startsWith('VARCHAR') || attr.type.startsWith('TEXT')) typeStr = 'TEXT';
            if (attr.type.startsWith('INT')) typeStr = 'INTEGER';
            if (attr.type.startsWith('DECIMAL')) typeStr = 'REAL';
            if (attr.type === 'TIMESTAMP' || attr.type === 'DATE') typeStr = 'TEXT';
          }
          const pkPart = attr.isPK ? ' PRIMARY KEY' : '';
          const notNull = attr.nullable ? '' : ' NOT NULL';
          return `  ${attr.name.padEnd(20)} ${typeStr}${pkPart}${notNull}`;
        });

        const fkLines = entity.attributes
          .filter(a => a.isFK && a.references)
          .map(a => {
            const [refTable, refCol] = a.references!.split('.');
            return `  CONSTRAINT fk_${entity.name.toLowerCase().replace(/\s+/g, '_')}_${a.name.toLowerCase()} FOREIGN KEY (${a.name}) REFERENCES ${refTable.replace(/\s+/g, '_')}(${refCol})`;
          });

        const allLines = [...lines, ...fkLines];
        return `-- Table: ${entity.name}\nCREATE TABLE ${entity.name.replace(/\s+/g, '_')} (\n${allLines.join(',\n')}\n);\n`;
      })
      .join('\n');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generateFullDDL());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadSQL = () => {
    const ddl = generateFullDDL();
    const blob = new Blob([ddl], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecommerce_schema_${exportDialect}_${schemaCountMode}_entities.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              Relational DDL
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400">Section 06</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Relational Schema &amp; SQL DDL Exporter</span>
          </h1>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['postgres', 'mysql', 'sqlite'] as const).map(dia => (
              <button
                key={dia}
                onClick={() => setExportDialect(dia)}
                className={`px-2 py-1 rounded transition-colors uppercase ${
                  exportDialect === dia
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Schema Copied!' : 'Copy Entire DDL'}</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/15"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .SQL</span>
          </button>
        </div>
      </div>

      <RelationalSchema schemaCountMode={schemaCountMode} />
    </div>
  );
};
