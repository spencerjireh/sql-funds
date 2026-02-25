import { motion } from 'framer-motion';
import { VIZ } from './vizPalette';

const COLORS = {
  matched: VIZ.primary,
  unmatched: VIZ.border,
  header: VIZ.surfaceAlt,
  text: VIZ.text,
  mutedText: VIZ.textMuted,
};

interface TableBoxProps {
  x: number;
  y: number;
  title: string;
  rows: string[];
  matchedRows?: number[];
}

function TableBox({ x, y, title, rows, matchedRows = [] }: TableBoxProps) {
  const rowHeight = 28;
  const headerHeight = 32;
  const width = 140;
  const height = headerHeight + rows.length * rowHeight + 4;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="6" fill="white" stroke={COLORS.unmatched} strokeWidth="1.5" />
      <rect x={x} y={y} width={width} height={headerHeight} rx="6" fill={COLORS.header} />
      <rect x={x} y={y + headerHeight - 1} width={width} height="1" fill={COLORS.unmatched} />
      <text x={x + width / 2} y={y + 21} textAnchor="middle" fontSize="12" fontWeight="600" fill={COLORS.text}>
        {title}
      </text>
      {rows.map((row, i) => {
        const isMatched = matchedRows.includes(i);
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
          >
            {isMatched && (
              <motion.rect
                x={x + 2} y={y + headerHeight + i * rowHeight + 2}
                width={width - 4} height={rowHeight - 2} rx="3"
                fill={COLORS.matched}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                transition={{ delay: 0.3 + 0.1 * i, duration: 0.4 }}
              />
            )}
            <text
              x={x + 12} y={y + headerHeight + i * rowHeight + 20}
              fontSize="11" fontFamily="var(--font-mono)"
              fill={isMatched ? COLORS.matched : COLORS.mutedText}
              fontWeight={isMatched ? 500 : 400}
            >
              {row}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

interface MatchLinesProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  pairs: [number, number][];
  rowHeight?: number;
  headerHeight?: number;
}

function MatchLines({ x1, y1, x2, y2, pairs, rowHeight = 28, headerHeight = 32 }: MatchLinesProps) {
  return pairs.map(([leftIdx, rightIdx], i) => (
    <motion.line
      key={i}
      x1={x1} y1={y1 + headerHeight + leftIdx * rowHeight + 14}
      x2={x2} y2={y2 + headerHeight + rightIdx * rowHeight + 14}
      stroke={COLORS.matched}
      strokeWidth="1.5"
      strokeDasharray="4 2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ delay: 0.5 + 0.1 * i, duration: 0.4 }}
    />
  ));
}

interface TableDiagramProps {
  leftTitle?: string;
  rightTitle?: string;
  leftRows?: string[];
  rightRows?: string[];
  matchedLeft?: number[];
  matchedRight?: number[];
  matchPairs?: [number, number][];
}

export default function TableDiagram({
  leftTitle = 'Table A',
  rightTitle = 'Table B',
  leftRows = [],
  rightRows = [],
  matchedLeft = [],
  matchedRight = [],
  matchPairs = [],
}: TableDiagramProps) {
  const svgWidth = 400;
  const lx = 30;
  const rx = 230;

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <svg viewBox={`0 0 ${svgWidth} ${Math.max(leftRows.length, rightRows.length) * 28 + 60}`}
        width={svgWidth} style={{ maxWidth: '100%' }}>
        <TableBox x={lx} y={10} title={leftTitle} rows={leftRows} matchedRows={matchedLeft} />
        <TableBox x={rx} y={10} title={rightTitle} rows={rightRows} matchedRows={matchedRight} />
        <MatchLines x1={lx + 140} y1={10} x2={rx} y2={10} pairs={matchPairs} />
      </svg>
    </div>
  );
}
