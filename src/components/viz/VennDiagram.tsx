import { motion } from 'framer-motion';
import { VIZ } from './vizPalette';

type JoinType = 'inner' | 'left' | 'right' | 'full' | 'cross';

interface VennPreset {
  leftOpacity: number;
  rightOpacity: number;
  overlapOpacity: number;
  label: string;
  description: string;
}

const presets: Record<JoinType, VennPreset> = {
  inner: {
    leftOpacity: 0.15,
    rightOpacity: 0.15,
    overlapOpacity: 0.9,
    label: 'INNER JOIN',
    description: 'Only matching rows from both tables',
  },
  left: {
    leftOpacity: 0.9,
    rightOpacity: 0.15,
    overlapOpacity: 0.9,
    label: 'LEFT JOIN',
    description: 'All rows from left table + matches from right',
  },
  right: {
    leftOpacity: 0.15,
    rightOpacity: 0.9,
    overlapOpacity: 0.9,
    label: 'RIGHT JOIN',
    description: 'All rows from right table + matches from left',
  },
  full: {
    leftOpacity: 0.9,
    rightOpacity: 0.9,
    overlapOpacity: 0.9,
    label: 'FULL OUTER JOIN',
    description: 'All rows from both tables',
  },
  cross: {
    leftOpacity: 0.9,
    rightOpacity: 0.9,
    overlapOpacity: 0.9,
    label: 'CROSS JOIN',
    description: 'Every combination of rows',
  },
};

interface VennDiagramProps {
  type?: JoinType;
  leftLabel?: string;
  rightLabel?: string;
}

export default function VennDiagram({ type = 'inner', leftLabel = 'Table A', rightLabel = 'Table B' }: VennDiagramProps) {
  const config = presets[type] || presets.inner;

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <svg viewBox="0 0 400 220" width="400" style={{ maxWidth: '100%' }}>
        <defs>
          <clipPath id={`clip-right-${type}`}>
            <circle cx="230" cy="110" r="80" />
          </clipPath>
          <clipPath id={`clip-left-${type}`}>
            <circle cx="170" cy="110" r="80" />
          </clipPath>
        </defs>

        {/* Left circle */}
        <motion.circle
          cx="170" cy="110" r="80"
          fill={VIZ.primary}
          initial={{ opacity: 0 }}
          animate={{ opacity: config.leftOpacity }}
          transition={{ duration: 0.5 }}
          stroke={VIZ.primary}
          strokeWidth="2"
        />

        {/* Right circle */}
        <motion.circle
          cx="230" cy="110" r="80"
          fill={VIZ.accent}
          initial={{ opacity: 0 }}
          animate={{ opacity: config.rightOpacity }}
          transition={{ duration: 0.5 }}
          stroke={VIZ.accent}
          strokeWidth="2"
        />

        {/* Overlap highlight */}
        <motion.circle
          cx="170" cy="110" r="80"
          fill={VIZ.primary}
          clipPath={`url(#clip-right-${type})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: config.overlapOpacity }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Labels */}
        <text x="140" y="110" textAnchor="middle" fontSize="13" fontWeight="600" fill="white">{leftLabel}</text>
        <text x="260" y="110" textAnchor="middle" fontSize="13" fontWeight="600" fill="white">{rightLabel}</text>
      </svg>
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{config.label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{config.description}</div>
      </div>
    </div>
  );
}
