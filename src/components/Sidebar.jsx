import { Link, useLocation } from 'react-router-dom';
import { sections } from '../data/lessonRegistry';
import styles from './Sidebar.module.css';

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <Link to="/" className={styles.brand} onClick={onClose}>
          <div className={styles.brandTitle}>
            <span className={styles.brandAccent}>SQL</span> Fundamentals
          </div>
          <div className={styles.brandSub}>Interactive Course</div>
        </Link>
        <nav className={styles.nav}>
          {sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <div className={styles.sectionTitle}>{section.title}</div>
              {section.lessons.map((lesson) => {
                const to = `/lessons/${lesson.slug}`;
                const isActive = pathname === to;
                return (
                  <Link
                    key={lesson.slug}
                    to={to}
                    className={`${styles.lessonLink} ${isActive ? styles.lessonLinkActive : ''}`}
                    onClick={onClose}
                  >
                    <span className={styles.lessonNumber}>{lesson.number}</span>
                    {lesson.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
