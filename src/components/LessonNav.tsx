import { Link } from 'react-router-dom';
import { getAdjacentLessons } from '../data/lessonRegistry';
import styles from './LessonNav.module.css';

export default function LessonNav({ currentSlug }: { currentSlug: string }) {
  const { prev, next } = getAdjacentLessons(currentSlug);

  return (
    <nav className={styles.nav}>
      {prev ? (
        <Link to={`/lessons/${prev.slug}`} className={styles.link}>
          <span className={styles.label}>Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link to={`/lessons/${next.slug}`} className={`${styles.link} ${styles.linkNext}`}>
          <span className={styles.label}>Next</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : <div />}
    </nav>
  );
}
