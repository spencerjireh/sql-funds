import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useSQLQuery } from '../hooks/useSQLQuery';
import { useDatabase } from '../context/DatabaseContext';
import ResultsTable from './ResultsTable';
import styles from './SQLSandbox.module.css';

export default function SQLSandbox({ defaultQuery = '', title = 'Try it yourself' }) {
  const { sql: query, setSQL, results, error, hasRun, runQuery } = useSQLQuery(defaultQuery);
  const { resetDatabase } = useDatabase();

  const handleRun = useCallback(() => {
    runQuery();
  }, [runQuery]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  }, [handleRun]);

  return (
    <div className={styles.sandbox}>
      <div className={styles.editorHeader}>
        <span className={styles.editorLabel}>{title}</span>
        <div className={styles.actions}>
          <button className={styles.resetButton} onClick={resetDatabase}>
            Reset DB
          </button>
          <button className={styles.runButton} onClick={handleRun}>
            Run (Ctrl+Enter)
          </button>
        </div>
      </div>
      <div className={styles.editor} onKeyDown={handleKeyDown}>
        <CodeMirror
          value={query}
          onChange={setSQL}
          extensions={[sql()]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
          }}
          minHeight="80px"
          maxHeight="300px"
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {hasRun && !error && results && results.length > 0 && (
        <div className={styles.results}>
          {results.map((r, i) => (
            <ResultsTable key={i} columns={r.columns} values={r.values} />
          ))}
        </div>
      )}
      {hasRun && !error && (!results || results.length === 0) && (
        <div className={styles.empty}>Query executed successfully. No rows returned.</div>
      )}
    </div>
  );
}
