const modules = import.meta.glob('./**/index.jsx', { eager: true });

export function loadLessons() {
  const lessons = {};
  for (const path in modules) {
    const slug = path.replace('./', '').replace('/index.jsx', '');
    lessons[slug] = modules[path].default;
  }
  return lessons;
}
