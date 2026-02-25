import styles from './Header.module.css';

export default function Header({ onMenuToggle }) {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuToggle} aria-label="Toggle menu">
        &#9776;
      </button>
      <span className={styles.title}>
        <span className={styles.titleAccent}>SQL</span> Fundamentals
      </span>
    </header>
  );
}
