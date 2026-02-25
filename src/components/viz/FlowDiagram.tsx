import { motion } from 'framer-motion';
import { VIZ } from './vizPalette';

const STEP_HEIGHT = 44;
const STEP_WIDTH = 180;
const GAP = 16;
const ARROW_SIZE = 8;

interface FlowDiagramProps {
  steps?: string[];
  highlight?: number | string;
}

export default function FlowDiagram({ steps = [], highlight }: FlowDiagramProps) {
  const totalHeight = steps.length * (STEP_HEIGHT + GAP);
  const cx = 200;

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <svg viewBox={`0 0 400 ${totalHeight}`} width="400" style={{ maxWidth: '100%' }}>
        {steps.map((step, i) => {
          const y = i * (STEP_HEIGHT + GAP);
          const isHighlighted = highlight === i || highlight === step;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
            >
              <rect
                x={cx - STEP_WIDTH / 2} y={y}
                width={STEP_WIDTH} height={STEP_HEIGHT}
                rx="8"
                fill={isHighlighted ? VIZ.primary : 'white'}
                stroke={isHighlighted ? VIZ.primary : VIZ.border}
                strokeWidth="1.5"
              />
              <text
                x={cx} y={y + STEP_HEIGHT / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight={isHighlighted ? 600 : 500}
                fill={isHighlighted ? 'white' : '#1F2328'}
              >
                {step}
              </text>
              {i < steps.length - 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.1 * i + 0.15 }}
                >
                  <line
                    x1={cx} y1={y + STEP_HEIGHT}
                    x2={cx} y2={y + STEP_HEIGHT + GAP}
                    stroke="#8B949E" strokeWidth="1.5"
                  />
                  <polygon
                    points={`${cx},${y + STEP_HEIGHT + GAP} ${cx - ARROW_SIZE / 2},${y + STEP_HEIGHT + GAP - ARROW_SIZE} ${cx + ARROW_SIZE / 2},${y + STEP_HEIGHT + GAP - ARROW_SIZE}`}
                    fill="#8B949E"
                  />
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
