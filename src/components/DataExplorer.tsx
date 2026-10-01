import React, { useState } from 'react';
import { SAMPLE_DATA } from '../data/databaseData';
import { Database, Search, Download, Table, ExternalLink } from 'lucide-react';

interface DataExplorerProps {
  onNavigateToSQL?: (sql: string) => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ onNavigateToSQL }) => {
  const tableNames = Object.keys(SAMPLE_DATA);
  const [activeTable, setActiveTable] = useState<string>('Customers');
  const [search, setSearch] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const rawRows = SAMPLE_DATA[activeTable] || [];
  const columns = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];

  const filteredRows = rawRows.filter(row => {
    if (!search.trim()) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;
    const headerLine = columns.join(',');
    const rowLines = filteredRows.map(row =>
      columns.map(col => `"${String(row[col] ?? '')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerLine, ...rowLines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTable.toLowerCase().replace(/\s+/g, '_')}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>Interactive Data Explorer</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Browse authentic normalized records instantiated from the coursework demonstration dataset
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onNavigateToSQL && (
            <button
              onClick={() => onNavigateToSQL(`SELECT * FROM ${activeTable.replace(/\s+/g, '')};`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-emerald-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Query in SQL</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
        <Table className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
        {tableNames.map(name => (
          <button
            key={name}
            onClick={() => {
              setActiveTable(name);
              setSelectedRowIndex(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTable === name
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Search & Row Info Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Filter rows in ${activeTable}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56 md:w-64"
          />
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <span className="text-cyan-400 font-semibold">{filteredRows.length}</span> records · Sample Data
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 uppercase tracking-wider text-slate-400 text-[11px] z-10">
              <tr>
                <th className="py-3 px-4 w-12 text-center text-slate-600">#</th>
                {columns.map(col => (
                  <th key={col} className="py-3 px-4 text-cyan-300 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRows.map((row, idx) => {
                const isSelected = selectedRowIndex === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRowIndex(isSelected ? null : idx)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-cyan-950/40 text-cyan-200' : 'hover:bg-slate-850/60 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-4 text-center text-slate-500 text-[11px]">
                      {idx + 1}
                    </td>
                    {columns.map(col => {
                      const val = row[col];
                      const isNull = val === null || val === undefined;
                      const isBoolean = typeof val === 'boolean';
                      return (
                        <td key={col} className="py-2.5 px-4">
                          {isNull ? (
                            <span className="text-slate-500 italic">NULL</span>
                          ) : isBoolean ? (
                            <span className={val ? 'text-emerald-400' : 'text-rose-400'}>
                              {String(val)}
                            </span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Inspector Callout if row selected */}
      {selectedRowIndex !== null && filteredRows[selectedRowIndex] && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white">
              Row #{selectedRowIndex + 1} Inspector — {activeTable}
            </span>
            <button
              onClick={() => setSelectedRowIndex(null)}
              className="text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
            {Object.entries(filteredRows[selectedRowIndex]).map(([k, v]) => (
              <div key={k} className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="text-cyan-300 font-semibold">{String(v ?? 'NULL')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
