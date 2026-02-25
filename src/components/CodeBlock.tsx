import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './CodeBlock.module.css';

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS',
  'NULL', 'AS', 'ON', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS',
  'ORDER', 'BY', 'ASC', 'DESC', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION',
  'ALL', 'INTERSECT', 'EXCEPT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'PRIMARY', 'KEY',
  'FOREIGN', 'REFERENCES', 'NOT', 'UNIQUE', 'CHECK', 'DEFAULT', 'CONSTRAINT',
  'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'COUNT', 'SUM',
  'AVG', 'MIN', 'MAX', 'OVER', 'PARTITION', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
  'WITH', 'RECURSIVE', 'FETCH', 'FIRST', 'ROWS', 'ONLY', 'ILIKE', 'INTEGER',
  'TEXT', 'REAL', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'VARCHAR', 'IF', 'WINDOW',
  'EXPLAIN', 'ANALYZE', 'USING',
]);

function highlightSQL(code: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const regex = /('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|(--[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|([<>=!]+|\*|,|;|\(|\)|\.)|([ \t]+)|(\n)/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(code)) !== null) {
    const [full, str1, str2, comment, num, word, op, ws, nl] = match;
    if (str1 || str2) {
      tokens.push(<span key={key++} className={styles.string}>{full}</span>);
    } else if (comment) {
      tokens.push(<span key={key++} className={styles.comment}>{full}</span>);
    } else if (num) {
      tokens.push(<span key={key++} className={styles.number}>{full}</span>);
    } else if (word) {
      if (SQL_KEYWORDS.has(word.toUpperCase())) {
        tokens.push(<span key={key++} className={styles.keyword}>{full}</span>);
      } else {
        tokens.push(<span key={key++}>{full}</span>);
      }
    } else if (op) {
      tokens.push(<span key={key++} className={styles.operator}>{full}</span>);
    } else {
      tokens.push(<span key={key++}>{full}</span>);
    }
  }
  return tokens;
}

interface CodeBlockProps {
  code: string;
  label?: string;
}

export default function CodeBlock({ code, label = 'SQL' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.code}>
        <code>{highlightSQL(code.trim())}</code>
      </pre>
    </div>
  );
}
