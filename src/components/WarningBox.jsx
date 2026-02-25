import styles from './Callout.module.css';

export default function WarningBox({ title = 'Warning', children }) {
  return (
    <div className={`${styles.callout} ${styles.warning}`}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
}
