import { useState, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext';

export function useSQLQuery(initialSQL = '') {
  const { executeQuery } = useDatabase();
  const [sql, setSQL] = useState(initialSQL);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const runQuery = useCallback((queryOverride) => {
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
