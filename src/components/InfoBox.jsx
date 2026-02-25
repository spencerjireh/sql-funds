import styles from './Callout.module.css';

export default function InfoBox({ title = 'Tip', children }) {
  return (
    <div className={`${styles.callout} ${styles.info}`}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
}
