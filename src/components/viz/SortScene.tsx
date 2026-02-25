import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { VIZ } from './vizPalette';

interface SortRow {
  label: string;
  value: number;
}

interface SortSceneProps {
  rows?: SortRow[];
  sortDirection?: 'ASC' | 'DESC';
  sortKey?: string;
  height?: number;
}

const DEFAULT_ROWS: SortRow[] = [
  { label: 'Laptop', value: 1299 },
  { label: 'Mouse', value: 29 },
  { label: 'Keyboard', value: 149 },
  { label: 'Monitor', value: 499 },
  { label: 'Webcam', value: 79 },
];

const BAR_HEIGHT = 32;
const BAR_GAP = 6;
const LEFT_PAD = 90;
const RIGHT_PAD = 50;
const SVG_WIDTH = 440;

export default function SortScene({
  rows = DEFAULT_ROWS,
  sortDirection: initialDir = 'ASC',
  sortKey = 'price',
  height,
}: SortSceneProps) {
  const [direction, setDirection] = useState<'ASC' | 'DESC'>(initialDir);

  const maxVal = Math.max(...rows.map(r => r.value));
  const barMaxWidth = SVG_WIDTH - LEFT_PAD - RIGHT_PAD;
  const svgHeight = rows.length * (BAR_HEIGHT + BAR_GAP) + 50;

  const sorted = useMemo(() => {
    const indexed = rows.map((r, i) => ({ ...r, origIndex: i }));
    indexed.sort((a, b) => direction === 'ASC' ? a.value - b.value : b.value - a.value);
    return indexed;
  }, [rows, direction]);

  const positionMap = useMemo(() => {
    const map: Record<number, number> = {};
    sorted.forEach((item, sortedIdx) => {
      map[item.origIndex] = sortedIdx;
    });
    return map;
  }, [sorted]);

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {(['ASC', 'DESC'] as const).map(dir => (
          <button
            key={dir}
            onClick={() => setDirection(dir)}
            style={{
              padding: '0.35rem 1rem',
              borderRadius: 6,
              border: `1.5px solid ${direction === dir ? VIZ.primary : VIZ.border}`,
              background: direction === dir ? VIZ.primary : VIZ.surface,
              color: direction === dir ? '#fff' : VIZ.text,
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {dir === 'ASC' ? 'Ascending' : 'Descending'}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`} width={SVG_WIDTH} style={{ maxWidth: '100%' }}>
        <text x={SVG_WIDTH / 2} y={16} textAnchor="middle" fontSize="11" fill={VIZ.textMuted} fontWeight={500}>
          ORDER BY {sortKey} {direction}
        </text>
        {rows.map((row, origIndex) => {
          const sortedPos = positionMap[origIndex] ?? 0;
          const y = 30 + sortedPos * (BAR_HEIGHT + BAR_GAP);
          const barWidth = (row.value / maxVal) * barMaxWidth;

          return (
            <motion.g
              key={row.label}
              animate={{ y }}
              initial={false}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <text
                x={LEFT_PAD - 8}
                y={BAR_HEIGHT / 2 + 1}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill={VIZ.text}
                fontWeight={500}
              >
                {row.label}
              </text>
              <motion.rect
                x={LEFT_PAD}
                y={2}
                height={BAR_HEIGHT - 4}
                rx={4}
                fill={VIZ.primary}
                initial={false}
                animate={{ width: barWidth }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
              <motion.text
                x={LEFT_PAD + barWidth + 6}
                y={BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill={VIZ.textMuted}
                fontWeight={600}
                animate={{ x: LEFT_PAD + barWidth + 6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                ${row.value}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
