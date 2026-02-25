import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <span className={styles.code}>404</span>
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.message}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className={styles.link}>
        Back to lessons
      </Link>
    </div>
  );
}
