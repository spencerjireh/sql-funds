import type { QueryResultSet } from '../types';
import styles from './ResultsTable.module.css';

export default function ResultsTable({ columns, values }: QueryResultSet) {
  if (!columns || columns.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {cell === null ? (
                    <span className={styles.null}>NULL</span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.rowCount}>
        {values.length} row{values.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
