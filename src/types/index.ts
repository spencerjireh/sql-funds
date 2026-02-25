import type { ComponentType } from 'react';
import type { Database } from 'sql.js';

export type SqlValue = string | number | null | Uint8Array;

export interface QueryResultSet {
  columns: string[];
  values: SqlValue[][];
}

export interface QueryResult {
  results: QueryResultSet[];
  error: string | null;
}

export interface DatabaseContextValue {
  db: Database | null;
  loading: boolean;
  error: string | null;
  executeQuery: (sql: string) => QueryResult;
  resetDatabase: () => Promise<void>;
}

export interface Lesson {
  slug: string;
  title: string;
  number: number;
  subtitle: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface AdjacentLessons {
  prev: Lesson | null;
  next: Lesson | null;
}

export type LessonMap = Record<string, ComponentType>;

export interface SQLQueryState {
  sql: string;
  setSQL: (sql: string) => void;
  results: QueryResultSet[] | null;
  error: string | null;
  hasRun: boolean;
  runQuery: (queryOverride?: string) => void;
  clear: () => void;
}

export interface CalloutProps {
  title?: string;
  children: React.ReactNode;
}
