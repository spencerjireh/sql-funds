import type { Section, Lesson, AdjacentLessons } from '../types';

const sections: Section[] = [
  {
    id: 'foundations',
    title: 'A: Foundations',
    lessons: [
      { slug: 'what-is-a-database', title: 'What Is a Database?', number: 1, subtitle: 'Relational model, tables, rows, columns, keys' },
      { slug: 'your-first-query', title: 'Your First Query', number: 2, subtitle: 'SELECT, FROM, asterisk wildcard' },
      { slug: 'filtering-with-where', title: 'Filtering with WHERE', number: 3, subtitle: 'Comparison operators, AND/OR/NOT' },
      { slug: 'data-types', title: 'Data Types and NULL', number: 4, subtitle: 'Integers, text, dates, NULL behavior' },
      { slug: 'aliasing-and-expressions', title: 'Aliases and Expressions', number: 5, subtitle: 'AS, arithmetic, computed columns' },
    ],
  },
  {
    id: 'sorting-limiting',
    title: 'B: Sorting, Limiting, Patterns',
    lessons: [
      { slug: 'sorting-with-order-by', title: 'Sorting with ORDER BY', number: 6, subtitle: 'ASC/DESC, multi-column sorting' },
      { slug: 'limiting-results', title: 'Limiting Results', number: 7, subtitle: 'LIMIT/OFFSET, FETCH FIRST' },
      { slug: 'pattern-matching', title: 'Pattern Matching with LIKE', number: 8, subtitle: 'Wildcards, ILIKE note' },
      { slug: 'filtering-with-in-and-between', title: 'IN, BETWEEN, and Filtering', number: 9, subtitle: 'DISTINCT, advanced filtering' },
    ],
  },
  {
    id: 'joins',
    title: 'C: Joins',
    lessons: [
      { slug: 'introduction-to-joins', title: 'Introduction to Joins', number: 10, subtitle: 'Foreign keys, why joins exist' },
      { slug: 'inner-join', title: 'INNER JOIN', number: 11, subtitle: 'Matching rows, ON clause' },
      { slug: 'left-and-right-join', title: 'LEFT and RIGHT JOIN', number: 12, subtitle: 'Unmatched rows, NULLs' },
      { slug: 'full-outer-and-cross-join', title: 'FULL OUTER and CROSS JOIN', number: 13, subtitle: 'Cartesian products' },
      { slug: 'self-joins-and-multiple-joins', title: 'Self Joins and Multi-Table', number: 14, subtitle: 'Aliases, chaining joins' },
    ],
  },
  {
    id: 'aggregation',
    title: 'D: Aggregation',
    lessons: [
      { slug: 'aggregate-functions', title: 'Aggregate Functions', number: 15, subtitle: 'COUNT, SUM, AVG, MIN, MAX' },
      { slug: 'group-by', title: 'GROUP BY', number: 16, subtitle: 'Grouping rows, column rules' },
      { slug: 'having', title: 'Filtering Groups with HAVING', number: 17, subtitle: 'HAVING vs WHERE' },
      { slug: 'grouping-patterns', title: 'Grouping Patterns', number: 18, subtitle: 'Multi-column groups, joins' },
    ],
  },
  {
    id: 'subqueries-sets',
    title: 'E: Subqueries and Sets',
    lessons: [
      { slug: 'subqueries', title: 'Subqueries', number: 19, subtitle: 'Scalar, IN, correlated' },
      { slug: 'subqueries-in-from-and-select', title: 'Subqueries in FROM/SELECT', number: 20, subtitle: 'Derived tables, computed columns' },
      { slug: 'union-and-set-operations', title: 'UNION and Set Operations', number: 21, subtitle: 'UNION ALL, INTERSECT, EXCEPT' },
    ],
  },
  {
    id: 'advanced',
    title: 'F: Data Modification and Advanced',
    lessons: [
      { slug: 'insert-update-delete', title: 'INSERT, UPDATE, DELETE', number: 22, subtitle: 'Data modification, WHERE safety' },
      { slug: 'creating-tables', title: 'CREATE TABLE and Constraints', number: 23, subtitle: 'DDL, keys, NOT NULL, UNIQUE' },
      { slug: 'indexes-and-performance', title: 'Indexes and Performance', number: 24, subtitle: 'B-tree, EXPLAIN concept' },
      { slug: 'window-functions-intro', title: 'Window Functions Intro', number: 25, subtitle: 'ROW_NUMBER, RANK, OVER' },
    ],
  },
];

export function getAllLessons(): Lesson[] {
  return sections.flatMap((s) => s.lessons);
}

export function getLessonBySlug(slug: string): Lesson | null {
  return getAllLessons().find((l) => l.slug === slug) ?? null;
}

export function getAdjacentLessons(slug: string): AdjacentLessons {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1]! : null,
    next: idx < all.length - 1 ? all[idx + 1]! : null,
  };
}

export function getSectionForLesson(slug: string): Section | null {
  return sections.find((s) => s.lessons.some((l) => l.slug === slug)) ?? null;
}

export { sections };
export default sections;
