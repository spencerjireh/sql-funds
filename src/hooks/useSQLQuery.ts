import { useState, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import type { QueryResultSet, SQLQueryState } from '../types';

export function useSQLQuery(initialSQL = ''): SQLQueryState {
  const { executeQuery } = useDatabase();
  const [sql, setSQL] = useState(initialSQL);
  const [results, setResults] = useState<QueryResultSet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const runQuery = useCallback((queryOverride?: string) => {
    const query = queryOverride ?? sql;
    if (!query.trim()) return;
    const { results: res, error: err } = executeQuery(query);
    setResults(res);
    setError(err);
    setHasRun(true);
  }, [sql, executeQuery]);

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
    setHasRun(false);
  }, []);

  return { sql, setSQL, results, error, hasRun, runQuery, clear };
}
