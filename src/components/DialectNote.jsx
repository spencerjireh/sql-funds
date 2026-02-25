import styles from './Callout.module.css';

export default function DialectNote({ title = 'Dialect Note', children }) {
  return (
    <div className={`${styles.callout} ${styles.dialect}`}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
}
