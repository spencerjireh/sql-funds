import type { ComponentType } from 'react';
import type { LessonMap } from '../types';

const modules = import.meta.glob<{ default: ComponentType }>('./**/index.tsx', { eager: true });

export function loadLessons(): LessonMap {
  const lessons: LessonMap = {};
  for (const path in modules) {
    const slug = path.replace('./', '').replace('/index.tsx', '');
    lessons[slug] = modules[path]!.default;
  }
  return lessons;
}
