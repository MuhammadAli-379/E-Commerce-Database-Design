import React, { useState } from 'react';
import { PRESET_SQL_QUERIES } from '../data/databaseData';
import { executeSQLQuery, QueryResult } from '../utils/sqlEngine';
import {
  Terminal,
  Play,
  Trash2,
  Clock,
  Rows,
  AlertCircle,
  Download,
  BookOpen,
} from 'lucide-react';

interface SQLPlaygroundProps {
  initialQuery?: string;
}

export const SQLPlayground: React.FC<SQLPlaygroundProps> = ({ initialQuery }) => {
  const [query, setQuery] = useState(
    initialQuery || 'SELECT ProductName, CategoryName FROM Product JOIN Category ON Product.CategoryID = Category.CategoryID;'
  );
  const [result, setResult] = useState<QueryResult | null>(() =>
    executeSQLQuery(
      initialQuery ||
        'SELECT ProductName, CategoryName FROM Product JOIN Category ON Product.CategoryID = Category.CategoryID;'
    )
  );

  const handleRun = () => {
    const res = executeSQLQuery(query);
    setResult(res);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
  };

  const handleLoadPreset = (sql: string) => {
    setQuery(sql);
    const res = executeSQLQuery(sql);
    setResult(res);
  };

  const handleExportCSV = () => {
    if (!result || result.rows.length === 0) return;
    const headerLine = result.columns.join(',');
    const rowLines = result.rows.map(row =>
      row.map(val => `"${String(val ?? '')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerLine, ...rowLines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sql_query_result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Demo SQL Engine — Browser Only
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <Terminal className="w-7 h-7 text-emerald-400" />
            <span>Interactive SQL Playground</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Execute in-memory relational SELECT, JOIN, WHERE, ORDER BY, and LIMIT operations directly against normalized tables
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Engine Ready (Client-Side)
          </span>
        </div>
      </div>

      {/* Preset Queries Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Pre-Configured Showcase Queries
          </span>
          <span className="text-slate-400 text-[11px]">Click any preset to load &amp; execute</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_SQL_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(preset.sql)}
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors group"
            >
              <div className="font-semibold text-slate-200 text-xs group-hover:text-cyan-300 truncate">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        {/* Editor Toolbar */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">SQL QUERY CONSOLE</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Query</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={4}
          placeholder="SELECT * FROM Customers;"
          className="w-full p-4 font-mono text-xs md:text-sm bg-slate-950/80 text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed"
        />

        {/* Execution Status Bar */}
        {result && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{result.executionTimeMs} ms</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Rows className="w-3.5 h-3.5 text-emerald-400" />
                <span>{result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned</span>
              </span>
            </div>

            {result.rows.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <Download className="w-3 h-3" /> Export Result
              </button>
            )}
          </div>
        )}
      </div>

      {/* Query Result View */}
      {result?.error ? (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-200">Execution Error</div>
            <div className="mt-1 font-mono text-[11px]">{result.error}</div>
          </div>
        </div>
      ) : result ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[11px] z-10">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center text-slate-600">#</th>
                  {result.columns.map(col => (
                    <th key={col} className="py-2.5 px-4 text-emerald-300 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-850/60 text-slate-300 transition-colors">
                    <td className="py-2 px-4 text-center text-slate-500 text-[11px]">
                      {rIdx + 1}
                    </td>
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="py-2 px-4">
                        {val === null ? (
                          <span className="text-slate-500 italic">NULL</span>
                        ) : typeof val === 'boolean' ? (
                          <span className={val ? 'text-emerald-400' : 'text-rose-400'}>
                            {String(val)}
                          </span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};
