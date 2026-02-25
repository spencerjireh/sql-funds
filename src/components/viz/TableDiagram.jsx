import { motion } from 'framer-motion';

const COLORS = {
  matched: '#2563EB',
  unmatched: '#E2E5E9',
  header: '#F6F8FA',
  text: '#1F2328',
  mutedText: '#8B949E',
};

function TableBox({ x, y, title, rows, matchedRows = [] }) {
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

function MatchLines({ x1, y1, x2, y2, pairs, rowHeight = 28, headerHeight = 32 }) {
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

export default function TableDiagram({
  leftTitle = 'Table A',
  rightTitle = 'Table B',
  leftRows = [],
  rightRows = [],
  matchedLeft = [],
  matchedRight = [],
  matchPairs = [],
}) {
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
