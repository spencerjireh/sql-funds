import { useState } from 'react';
import { motion } from 'framer-motion';
import { VIZ } from './vizPalette';
import styles from './SetOperationsVenn.module.css';

type SetOp = 'UNION' | 'UNION ALL' | 'INTERSECT' | 'EXCEPT';

interface SetOperationsVennProps {
  operation?: SetOp;
  leftLabel?: string;
  rightLabel?: string;
  leftItems?: string[];
  sharedItems?: string[];
  rightItems?: string[];
  height?: number;
}

const OP_LABELS: Record<SetOp, string> = {
  UNION: 'Combines both, removes duplicates',
  'UNION ALL': 'Combines both, keeps duplicates',
  INTERSECT: 'Only rows in both result sets',
  EXCEPT: 'Rows in first set but not second',
};

const LCX = 160;
const RCX = 240;
const CY = 120;
const R = 85;

function dotPositions(cx: number, cy: number, count: number, spread: number): [number, number][] {
  const positions: [number, number][] = [];
  const cols = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const ox = (col - (cols - 1) / 2) * spread;
    const oy = (row - (Math.ceil(count / cols) - 1) / 2) * spread;
    positions.push([cx + ox, cy + oy]);
  }
  return positions;
}

export default function SetOperationsVenn({
  operation: initialOp = 'UNION',
  leftLabel = 'Query A',
  rightLabel = 'Query B',
  leftItems = ['Alice', 'Bob', 'Carol'],
  sharedItems = ['Dave', 'Eve'],
  rightItems = ['Frank', 'Grace'],
}: SetOperationsVennProps) {
  const [op, setOp] = useState<SetOp>(initialOp);

  const leftOnly = dotPositions(LCX - 28, CY, leftItems.length, 22);
  const shared = dotPositions((LCX + RCX) / 2, CY, sharedItems.length, 22);
  const rightOnly = dotPositions(RCX + 28, CY, rightItems.length, 22);

  const isLeftActive = op === 'UNION' || op === 'UNION ALL' || op === 'EXCEPT';
  const isSharedActive = op !== 'EXCEPT';
  const isRightActive = op === 'UNION' || op === 'UNION ALL';
  const showDuplicate = op === 'UNION ALL';

  return (
    <div className={styles.container}>
      <div className={styles.toggleGroup}>
        {(['UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT'] as SetOp[]).map(o => (
          <button
            key={o}
            className={`${styles.toggleBtn} ${op === o ? styles.toggleBtnActive : ''}`}
            onClick={() => setOp(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 400 240" width="400" style={{ maxWidth: '100%' }}>
        <defs>
          <clipPath id="sov-clip-right">
            <circle cx={RCX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Left circle */}
        <motion.circle
          cx={LCX} cy={CY} r={R}
          fill={VIZ.primary}
          stroke={VIZ.primary}
          strokeWidth="2"
          initial={{ opacity: 0.15 }}
          animate={{ opacity: isLeftActive ? 0.2 : 0.08 }}
          transition={{ duration: 0.4 }}
        />

        {/* Right circle */}
        <motion.circle
          cx={RCX} cy={CY} r={R}
          fill={VIZ.accent}
          stroke={VIZ.accent}
          strokeWidth="2"
          initial={{ opacity: 0.15 }}
          animate={{ opacity: isRightActive || op === 'INTERSECT' ? 0.2 : 0.08 }}
          transition={{ duration: 0.4 }}
        />

        {/* Overlap region */}
        <motion.circle
          cx={LCX} cy={CY} r={R}
          fill={VIZ.primary}
          clipPath="url(#sov-clip-right)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSharedActive ? 0.35 : 0.05 }}
          transition={{ duration: 0.4 }}
        />

        {/* Left-only dots */}
        {leftOnly.map(([x, y], i) => (
          <motion.circle
            key={`l-${i}`}
            cx={x} cy={y} r={6}
            fill={VIZ.primary}
            initial={{ scale: 0 }}
            animate={{ scale: isLeftActive ? 1 : 0.4, opacity: isLeftActive ? 1 : 0.2 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}

        {/* Shared dots */}
        {shared.map(([x, y], i) => (
          <g key={`s-${i}`}>
            <motion.circle
              cx={x} cy={y} r={6}
              fill={VIZ.primaryDark}
              initial={{ scale: 0 }}
              animate={{ scale: isSharedActive ? 1 : 0.4, opacity: isSharedActive ? 1 : 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.05 + 0.1 }}
            />
            {showDuplicate && (
              <motion.text
                x={x + 9} y={y - 6}
                fontSize="8" fontWeight="700"
                fill={VIZ.accent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                x2
              </motion.text>
            )}
          </g>
        ))}

        {/* Right-only dots */}
        {rightOnly.map(([x, y], i) => (
          <motion.circle
            key={`r-${i}`}
            cx={x} cy={y} r={6}
            fill={VIZ.accent}
            initial={{ scale: 0 }}
            animate={{ scale: isRightActive ? 1 : 0.4, opacity: isRightActive ? 1 : 0.2 }}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.2 }}
          />
        ))}

        {/* Labels */}
        <text x={LCX - 30} y={CY + R + 18} textAnchor="middle" fontSize="11" fontWeight="600" fill={VIZ.text}>{leftLabel}</text>
        <text x={RCX + 30} y={CY + R + 18} textAnchor="middle" fontSize="11" fontWeight="600" fill={VIZ.text}>{rightLabel}</text>
      </svg>
      <div className={styles.label}>{op}</div>
      <div className={styles.description}>{OP_LABELS[op]}</div>
    </div>
  );
}
