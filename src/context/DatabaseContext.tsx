import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import initSqlJs from 'sql.js';
import type { SqlJsStatic, Database } from 'sql.js';
import { SCHEMA_SQL, SEED_SQL } from '../data/sampleDatabase';
import type { DatabaseContextValue, QueryResult } from '../types';

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sqlRef = useRef<SqlJsStatic | null>(null);

  const initDatabase = useCallback(async () => {
    try {
      if (!sqlRef.current) {
        sqlRef.current = await initSqlJs({
          locateFile: () => '/sql-wasm.wasm',
        });
      }
      const database = new sqlRef.current.Database();
      database.run(SCHEMA_SQL);
      database.run(SEED_SQL);
      setDb(database);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize database:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initDatabase();
    return () => {
      if (db) db.close();
    };
  }, []);

  const resetDatabase = useCallback(async () => {
    if (db) db.close();
    setLoading(true);
    await initDatabase();
  }, [db, initDatabase]);

  const executeQuery = useCallback((sql: string): QueryResult => {
    if (!db) throw new Error('Database not initialized');
    try {
      const raw = db.exec(sql);
      const results = raw.map((r) => ({
        columns: r.columns,
        values: r.values,
      }));
      return { results, error: null };
    } catch (err) {
      return { results: [], error: err instanceof Error ? err.message : String(err) };
    }
  }, [db]);

  return (
    <DatabaseContext.Provider value={{ db, loading, error, executeQuery, resetDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseContextValue {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
