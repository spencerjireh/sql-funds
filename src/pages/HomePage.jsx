import { Link } from 'react-router-dom';
import { sections } from '../data/lessonRegistry';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Learn <span className={styles.heroAccent}>SQL</span> from Scratch
        </h1>
        <p className={styles.heroSub}>
          25 interactive lessons covering everything from your first SELECT to window functions.
          Run real queries in your browser -- no setup required.
        </p>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <h2 className={styles.sectionHeader}>{section.title}</h2>
            <ul className={styles.lessonList}>
              {section.lessons.map((lesson) => (
                <li key={lesson.slug} className={styles.lessonItem}>
                  <Link to={`/lessons/${lesson.slug}`} className={styles.lessonLink}>
                    <span className={styles.lessonNum}>{lesson.number}</span>
                    <div className={styles.lessonInfo}>
                      <div className={styles.lessonTitle}>{lesson.title}</div>
                      <div className={styles.lessonSub}>{lesson.subtitle}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
