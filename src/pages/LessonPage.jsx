import { useParams } from 'react-router-dom';
import { Suspense, useMemo } from 'react';
import { getLessonBySlug } from '../data/lessonRegistry';
import { loadLessons } from '../lessons';
import LessonNav from '../components/LessonNav';
import NotFoundPage from './NotFoundPage';

export default function LessonPage() {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const lessons = useMemo(() => loadLessons(), []);
  const LessonComponent = lessons[slug];

  if (!lesson || !LessonComponent) {
    return <NotFoundPage />;
  }

  return (
    <article>
      <Suspense fallback={<div>Loading lesson...</div>}>
        <LessonComponent />
      </Suspense>
      <LessonNav currentSlug={slug} />
    </article>
  );
}
