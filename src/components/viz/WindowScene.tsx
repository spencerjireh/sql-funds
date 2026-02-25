import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIZ } from './vizPalette';
import styles from './WindowScene.module.css';

type WinFunc = 'ROW_NUMBER' | 'RANK' | 'DENSE_RANK';

interface WindowRow {
  label: string;
  partition: string;
  sortValue: number;
}

interface WindowSceneProps {
  rows?: WindowRow[];
  windowFunction?: WinFunc;
  partitionBy?: string;
  orderBy?: string;
  height?: number;
}

const DEFAULT_ROWS: WindowRow[] = [
  { label: 'Laptop', partition: 'Electronics', sortValue: 1299 },
  { label: 'Mouse', partition: 'Electronics', sortValue: 29 },
  { label: 'Monitor', partition: 'Electronics', sortValue: 499 },
  { label: 'Desk', partition: 'Furniture', sortValue: 350 },
  { label: 'Chair', partition: 'Furniture', sortValue: 350 },
  { label: 'Lamp', partition: 'Furniture', sortValue: 89 },
];

const PARTITION_COLORS = [VIZ.primary, VIZ.accent, VIZ.purple, VIZ.success];

const ROW_H = 30;
const ROW_W = 320;
const GAP = 4;
const PARTITION_GAP = 14;
const LEFT = 40;
const RESULT_COL_X = LEFT + ROW_W + 8;
const RESULT_COL_W = 60;

function computeRanks(values: number[], func: WinFunc): number[] {
  const sorted = values.map((v, i) => ({ v, i }));
  sorted.sort((a, b) => b.v - a.v);

  const ranks: number[] = new Array(values.length).fill(1);
  let currentRank = 1;

  for (let pos = 0; pos < sorted.length; pos++) {
    const cur = sorted[pos]!;
    const prev = pos > 0 ? sorted[pos - 1]! : null;

    if (func === 'ROW_NUMBER') {
      ranks[cur.i] = pos + 1;
    } else if (func === 'RANK') {
      if (prev && cur.v === prev.v) {
        ranks[cur.i] = ranks[prev.i] ?? pos + 1;
      } else {
        ranks[cur.i] = pos + 1;
      }
    } else {
      if (prev && cur.v === prev.v) {
        ranks[cur.i] = ranks[prev.i] ?? currentRank;
      } else {
        ranks[cur.i] = currentRank;
      }
      if (!prev || cur.v !== prev.v) {
        currentRank++;
      }
    }
  }
  return ranks;
}

export default function WindowScene({
  rows = DEFAULT_ROWS,
  windowFunction: initialFunc = 'ROW_NUMBER',
  partitionBy = 'category',
  orderBy = 'price DESC',
}: WindowSceneProps) {
  const [func, setFunc] = useState<WinFunc>(initialFunc);
  const [phase, setPhase] = useState(0);
  const [windowPos, setWindowPos] = useState(-1);

  const partitions = useMemo(() => {
    const map = new Map<string, { row: WindowRow; origIdx: number }[]>();
    rows.forEach((r, i) => {
      if (!map.has(r.partition)) map.set(r.partition, []);
      map.get(r.partition)!.push({ row: r, origIdx: i });
    });
    return Array.from(map.entries()).map(([name, items]) => {
      items.sort((a, b) => b.row.sortValue - a.row.sortValue);
      return { name, items };
    });
  }, [rows]);

  const partitionRanks = useMemo(() => {
    return partitions.map(p => {
      const values = p.items.map(item => item.row.sortValue);
      return computeRanks(values, func);
    });
  }, [partitions, func]);

  useEffect(() => {
    setPhase(0);
    setWindowPos(-1);

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);

    const timers = [t1, t2];
    let delay = 2400;
    for (let pi = 0; pi < partitions.length; pi++) {
      const capturedPi = pi;
      timers.push(setTimeout(() => setWindowPos(capturedPi), delay));
      delay += 800;
    }
    timers.push(setTimeout(() => setPhase(3), delay));

    return () => timers.forEach(clearTimeout);
  }, [func, partitions.length]);

  let yOffset = 30;
  const partitionYStarts: number[] = [];

  const rowElements: React.ReactNode[] = [];
  const frameElements: React.ReactNode[] = [];

  partitions.forEach((partition, pi) => {
    partitionYStarts.push(yOffset);
    const color = PARTITION_COLORS[pi % PARTITION_COLORS.length] ?? VIZ.primary;
    const ranks = partitionRanks[pi] ?? [];

    partition.items.forEach((item, ri) => {
      const y = yOffset + ri * (ROW_H + GAP);
      const partitioned = phase >= 1;
      const showRank = phase >= 2 && windowPos >= pi;

      rowElements.push(
        <motion.g
          key={`${pi}-${ri}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: 0,
            y: partitioned ? y : 30 + (pi * partition.items.length + ri) * (ROW_H + GAP),
          }}
          transition={{ duration: 0.5, delay: ri * 0.05 }}
        >
          <rect
            x={LEFT}
            y={0}
            width={ROW_W}
            height={ROW_H}
            rx={5}
            fill="white"
            stroke={color}
            strokeWidth={1.5}
          />
          <circle cx={LEFT + 14} cy={ROW_H / 2} r={4} fill={color} opacity={0.5} />
          <text
            x={LEFT + 28}
            y={ROW_H / 2 + 1}
            dominantBaseline="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill={VIZ.text}
          >
            {item.row.label}
          </text>
          <text
            x={LEFT + ROW_W / 2}
            y={ROW_H / 2 + 1}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="10"
            fill={VIZ.textMuted}
          >
            {item.row.partition}
          </text>
          <text
            x={LEFT + ROW_W - 12}
            y={ROW_H / 2 + 1}
            dominantBaseline="middle"
            textAnchor="end"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill={VIZ.text}
            fontWeight={600}
          >
            ${item.row.sortValue}
          </text>

          <AnimatePresence>
            {showRank && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: ri * 0.1, duration: 0.3 }}
              >
                <rect
                  x={RESULT_COL_X}
                  y={2}
                  width={RESULT_COL_W}
                  height={ROW_H - 4}
                  rx={4}
                  fill={color}
                  opacity={0.15}
                />
                <text
                  x={RESULT_COL_X + RESULT_COL_W / 2}
                  y={ROW_H / 2 + 1}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  fill={color}
                >
                  {ranks?.[ri] ?? ''}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>,
      );
    });

    if (phase >= 1 && windowPos === pi) {
      const frameH = partition.items.length * (ROW_H + GAP) - GAP + 8;
      frameElements.push(
        <motion.rect
          key={`frame-${pi}`}
          x={LEFT - 6}
          y={yOffset - 4}
          width={ROW_W + RESULT_COL_W + 22}
          height={frameH}
          rx={8}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
        />,
      );
    }

    yOffset += partition.items.length * (ROW_H + GAP) + PARTITION_GAP;
  });

  const svgHeight = yOffset + 10;

  return (
    <div className={styles.container}>
      <div className={styles.toggleGroup}>
        {(['ROW_NUMBER', 'RANK', 'DENSE_RANK'] as WinFunc[]).map(f => (
          <button
            key={f}
            className={`${styles.toggleBtn} ${func === f ? styles.toggleBtnActive : ''}`}
            onClick={() => setFunc(f)}
          >
            {f}()
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${RESULT_COL_X + RESULT_COL_W + 20} ${svgHeight}`}
        width={RESULT_COL_X + RESULT_COL_W + 20}
        style={{ maxWidth: '100%' }}>
        <text
          x={(LEFT + RESULT_COL_X + RESULT_COL_W) / 2}
          y={18}
          textAnchor="middle"
          fontSize="10"
          fontWeight={500}
          fill={VIZ.textMuted}
        >
          {func}() OVER(PARTITION BY {partitionBy} ORDER BY {orderBy})
        </text>

        {frameElements}
        {rowElements}
      </svg>
    </div>
  );
}
