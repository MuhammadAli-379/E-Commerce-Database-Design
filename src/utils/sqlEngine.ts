import { SAMPLE_DATA } from '../data/databaseData';

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  sourceQuery: string;
}

// Normalize table name lookup (case-insensitive & handles space vs non-space)
function resolveTableName(rawName: string): string | null {
  const clean = rawName.trim().replace(/['"`]/g, '').toLowerCase().replace(/[\s_]+/g, '');
  for (const key of Object.keys(SAMPLE_DATA)) {
    const keyClean = key.toLowerCase().replace(/[\s_]+/g, '');
    if (keyClean === clean) return key;
  }
  return null;
}

export function executeSQLQuery(sql: string): QueryResult {
  const startTime = performance.now();
  const trimmed = sql.trim().replace(/;+$/, '');

  try {
    if (!trimmed.toUpperCase().startsWith('SELECT')) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Only SELECT queries are supported in this educational demonstration engine.',
        sourceQuery: sql,
      };
    }

    // Match SELECT ... FROM <table> [JOIN <joinTable> ON <c1> = <c2>] [WHERE <cond>] [ORDER BY <col> [ASC|DESC]] [LIMIT <num>]
    const fromMatch = trimmed.match(/SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+(?:\s+[a-zA-Z0-9_]+)?)/i);
    if (!fromMatch) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Syntax error: Could not parse SELECT ... FROM clause.',
        sourceQuery: sql,
      };
    }

    const selectPart = fromMatch[1].trim();
    const primaryTableRaw = fromMatch[2].trim();
    const primaryTableName = resolveTableName(primaryTableRaw);

    if (!primaryTableName || !SAMPLE_DATA[primaryTableName]) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: `Table '${primaryTableRaw}' does not exist in schema. Available tables: ${Object.keys(SAMPLE_DATA).join(', ')}`,
        sourceQuery: sql,
      };
    }

    // Start with clone of primary table rows
    let currentRows: Record<string, unknown>[] = SAMPLE_DATA[primaryTableName].map(r => ({ ...r }));

    // Check for JOIN clause: JOIN <table> ON <left> = <right>
    const joinRegex = /(?:INNER\s+)?JOIN\s+([a-zA-Z0-9_]+(?:\s+[a-zA-Z0-9_]+)?)\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/gi;
    let joinMatch: RegExpExecArray | null;

    while ((joinMatch = joinRegex.exec(trimmed)) !== null) {
      const joinTableRaw = joinMatch[1].trim();
      const leftColRaw = joinMatch[2].trim();
      const rightColRaw = joinMatch[3].trim();

      const joinTableName = resolveTableName(joinTableRaw);
      if (!joinTableName || !SAMPLE_DATA[joinTableName]) {
        return {
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 0,
          error: `JOIN target table '${joinTableRaw}' not found in schema.`,
          sourceQuery: sql,
        };
      }

      const joinData = SAMPLE_DATA[joinTableName];
      const leftCol = leftColRaw.includes('.') ? leftColRaw.split('.')[1] : leftColRaw;
      const rightCol = rightColRaw.includes('.') ? rightColRaw.split('.')[1] : rightColRaw;

      const joinedRows: Record<string, unknown>[] = [];
      for (const primaryRow of currentRows) {
        for (const foreignRow of joinData) {
          const leftVal = (primaryRow as Record<string, unknown>)[leftCol] ?? (primaryRow as Record<string, unknown>)[rightCol];
          const rightVal = (foreignRow as Record<string, unknown>)[rightCol] ?? (foreignRow as Record<string, unknown>)[leftCol];

          if (leftVal !== undefined && rightVal !== undefined && String(leftVal) === String(rightVal)) {
            joinedRows.push({ ...primaryRow, ...foreignRow });
          }
        }
      }
      currentRows = joinedRows;
    }

    // Check for WHERE clause
    const whereMatch = trimmed.match(/\s+WHERE\s+([\s\S]+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const conditionStr = whereMatch[1].trim();
      // Handle simple conditions: col = val, col > val, col < val, col != val, with optional AND/OR
      currentRows = currentRows.filter(row => evaluateWhere(conditionStr, row));
    }

    // Check for ORDER BY clause
    const orderMatch = trimmed.match(/\s+ORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const orderCol = orderMatch[1].includes('.') ? orderMatch[1].split('.')[1] : orderMatch[1];
      const direction = (orderMatch[2] || 'ASC').toUpperCase();
      currentRows.sort((a, b) => {
        const valA = (a as Record<string, unknown>)[orderCol];
        const valB = (b as Record<string, unknown>)[orderCol];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return direction === 'ASC' ? valA - valB : valB - valA;
        }
        return direction === 'ASC'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // Check for LIMIT clause
    const limitMatch = trimmed.match(/\s+LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      currentRows = currentRows.slice(0, limitVal);
    }

    // Determine projected columns
    let finalColumns: string[] = [];
    if (selectPart === '*') {
      if (currentRows.length > 0) {
        finalColumns = Object.keys(currentRows[0]);
      } else {
        const sampleFirst = SAMPLE_DATA[primaryTableName]?.[0];
        finalColumns = sampleFirst ? Object.keys(sampleFirst) : ['Result'];
      }
    } else {
      finalColumns = selectPart.split(',').map(c => {
        const clean = c.trim().replace(/['"`]/g, '');
        return clean.includes('.') ? clean.split('.')[1] : clean;
      });
    }

    // Extract table cell matrix
    const matrix = currentRows.map(row => {
      return finalColumns.map(col => {
        const val = (row as Record<string, unknown>)[col];
        return val !== undefined ? (val as string | number | boolean | null) : null;
      });
    });

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      columns: finalColumns,
      rows: matrix,
      rowCount: matrix.length,
      executionTimeMs: Math.max(executionTimeMs, 0.45),
      sourceQuery: sql,
    };
  } catch (err: unknown) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: `Query error: ${err instanceof Error ? err.message : String(err)}`,
      sourceQuery: sql,
    };
  }
}

function evaluateWhere(conditionStr: string, row: Record<string, unknown>): boolean {
  // Support AND / OR chaining
  if (conditionStr.toUpperCase().includes(' AND ')) {
    const parts = conditionStr.split(/\s+AND\s+/i);
    return parts.every(p => evaluateSingleCond(p.trim(), row));
  }
  if (conditionStr.toUpperCase().includes(' OR ')) {
    const parts = conditionStr.split(/\s+OR\s+/i);
    return parts.some(p => evaluateSingleCond(p.trim(), row));
  }
  return evaluateSingleCond(conditionStr, row);
}

function evaluateSingleCond(cond: string, row: Record<string, unknown>): boolean {
  // Matches: <col> (>=|<=|!=|=|>|<) <val>
  const match = cond.match(/([a-zA-Z0-9_.]+)\s*(>=|<=|!=|=|<>|>|<)\s*([\s\S]+)/);
  if (!match) return true;

  const colRaw = match[1].trim();
  const operator = match[2];
  let targetValStr = match[3].trim().replace(/^['"]|['"]$/g, '');

  const col = colRaw.includes('.') ? colRaw.split('.')[1] : colRaw;
  const actualVal = row[col];

  if (actualVal === undefined) return false;

  // Number comparison if both look like numbers
  const numTarget = Number(targetValStr);
  if (typeof actualVal === 'number' && !isNaN(numTarget)) {
    if (operator === '=') return actualVal === numTarget;
    if (operator === '!=' || operator === '<>') return actualVal !== numTarget;
    if (operator === '>') return actualVal > numTarget;
    if (operator === '<') return actualVal < numTarget;
    if (operator === '>=') return actualVal >= numTarget;
    if (operator === '<=') return actualVal <= numTarget;
  }

  // Boolean comparison
  if (typeof actualVal === 'boolean') {
    const boolTarget = targetValStr.toLowerCase() === 'true';
    if (operator === '=') return actualVal === boolTarget;
    if (operator === '!=' || operator === '<>') return actualVal !== boolTarget;
  }

  // String comparison
  const strActual = String(actualVal).toLowerCase();
  const strTarget = targetValStr.toLowerCase();

  if (operator === '=') return strActual === strTarget;
  if (operator === '!=' || operator === '<>') return strActual !== strTarget;
  if (operator === '>') return strActual > strTarget;
  if (operator === '<') return strActual < strTarget;

  return true;
}
