import styles from './DataTable.module.css';

export default function DataTable({ headers, rows, caption }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell === null ? 'NULL' : String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  );
}
