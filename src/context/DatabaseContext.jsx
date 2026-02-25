import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import initSqlJs from 'sql.js';
import { SCHEMA_SQL, SEED_SQL } from '../data/sampleDatabase';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sqlRef = useRef(null);

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
      setError(err.message);
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

  const executeQuery = useCallback((sql) => {
    if (!db) throw new Error('Database not initialized');
    try {
      const raw = db.exec(sql);
      const results = raw.map((r) => ({
        columns: r.columns || r.lc || Object.values(r).find(Array.isArray) || [],
        values: r.values,
      }));
      return { results, error: null };
    } catch (err) {
      return { results: [], error: err.message };
    }
  }, [db]);

  return (
    <DatabaseContext.Provider value={{ db, loading, error, executeQuery, resetDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
