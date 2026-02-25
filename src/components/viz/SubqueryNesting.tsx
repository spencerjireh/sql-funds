import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIZ } from './vizPalette';

type SubqueryType = 'scalar' | 'in' | 'correlated';

interface SubqueryNestingProps {
  type?: SubqueryType;
  outerQuery?: string;
  innerQuery?: string;
  resultValue?: string;
  height?: number;
}

const DEFAULTS: Record<SubqueryType, { outer: string; inner: string; result: string }> = {
  scalar: {
    outer: 'SELECT * FROM products WHERE price >',
    inner: 'SELECT AVG(price) FROM products',
    result: '$29.99',
  },
  in: {
    outer: 'SELECT * FROM customers WHERE id IN',
    inner: 'SELECT customer_id FROM orders',
    result: '1, 3, 5, 7',
  },
  correlated: {
    outer: 'SELECT * FROM products p WHERE price >',
    inner: 'SELECT AVG(price) FROM products WHERE category = p.category',
    result: '$19.99',
  },
};

const SVG_W = 420;
const OUTER_X = 20;
const OUTER_W = 380;
const OUTER_H = 160;
const INNER_X = 50;
const INNER_W = 320;
const INNER_H = 50;
const INNER_Y = 80;

export default function SubqueryNesting({
  type = 'scalar',
  outerQuery,
  innerQuery,
  resultValue,
  height,
}: SubqueryNestingProps) {
  const defaults = DEFAULTS[type];
  const outer = outerQuery || defaults.outer;
  const inner = innerQuery || defaults.inner;
  const result = resultValue || defaults.result;

  const [phase, setPhase] = useState(0);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    setPhase(0);
    setIteration(0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (type === 'correlated') {
      const runCycle = (iter: number, baseDelay: number) => {
        timers.push(setTimeout(() => { setIteration(iter); setPhase(1); }, baseDelay));
        timers.push(setTimeout(() => setPhase(2), baseDelay + 600));
        timers.push(setTimeout(() => setPhase(3), baseDelay + 1200));
      };
      runCycle(0, 500);
      runCycle(1, 2500);
      runCycle(2, 4500);
      timers.push(setTimeout(() => { setPhase(0); setIteration(0); }, 6000));
      const interval = setInterval(() => {
        const runAgain = (iter: number, baseDelay: number) => {
          timers.push(setTimeout(() => { setIteration(iter); setPhase(1); }, baseDelay));
          timers.push(setTimeout(() => setPhase(2), baseDelay + 600));
          timers.push(setTimeout(() => setPhase(3), baseDelay + 1200));
        };
        runAgain(0, 0);
        runAgain(1, 2000);
        runAgain(2, 4000);
        timers.push(setTimeout(() => { setPhase(0); setIteration(0); }, 5500));
      }, 6500);
      return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    } else {
      timers.push(setTimeout(() => setPhase(1), 500));
      timers.push(setTimeout(() => setPhase(2), 1400));
      timers.push(setTimeout(() => setPhase(3), 2200));
      return () => timers.forEach(clearTimeout);
    }
  }, [type]);

  const innerGlow = phase >= 1;
  const pillTraveling = phase >= 2;
  const outerProcessing = phase >= 3;

  const pillY = pillTraveling ? 40 : INNER_Y + INNER_H / 2;

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <svg viewBox={`0 0 ${SVG_W} 200`} width={SVG_W} style={{ maxWidth: '100%' }}>
        {/* Outer query box */}
        <motion.rect
          x={OUTER_X} y={10} width={OUTER_W} height={OUTER_H}
          rx={12}
          fill={outerProcessing ? `${VIZ.primary}10` : 'white'}
          stroke={outerProcessing ? VIZ.primary : VIZ.border}
          strokeWidth={outerProcessing ? 2 : 1.5}
          transition={{ duration: 0.3 }}
        />
        <text x={OUTER_X + 14} y={36} fontSize="10" fontWeight="600" fill={VIZ.textMuted}>OUTER QUERY</text>
        <text x={OUTER_X + 14} y={56} fontSize="11" fontFamily="var(--font-mono)" fill={VIZ.text}>{outer}</text>

        {/* Inner query box */}
        <motion.rect
          x={INNER_X} y={INNER_Y} width={INNER_W} height={INNER_H}
          rx={8}
          fill={innerGlow ? `${VIZ.accent}15` : VIZ.surfaceAlt}
          stroke={innerGlow ? VIZ.accent : VIZ.border}
          strokeWidth={innerGlow ? 2 : 1}
          transition={{ duration: 0.3 }}
        />
        <text x={INNER_X + 12} y={INNER_Y + 18} fontSize="10" fontWeight="600" fill={VIZ.textMuted}>
          {type === 'correlated' ? `INNER QUERY (row ${iteration + 1})` : 'INNER QUERY'}
        </text>
        <text x={INNER_X + 12} y={INNER_Y + 36} fontSize="10" fontFamily="var(--font-mono)" fill={VIZ.text}>{inner}</text>

        {/* Result pill */}
        <AnimatePresence>
          {pillTraveling && (
            <motion.g
              initial={{ opacity: 0, y: INNER_Y + INNER_H / 2 }}
              animate={{ opacity: 1, y: pillY }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <rect
                x={SVG_W / 2 - 40} y={-10}
                width={80} height={22}
                rx={11}
                fill={VIZ.accent}
              />
              <text
                x={SVG_W / 2} y={3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight="600"
                fill="white"
              >
                {result}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Correlated: row reference arrow */}
        {type === 'correlated' && innerGlow && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <line x1={INNER_X + 10} y1={INNER_Y} x2={INNER_X + 10} y2={68} stroke={VIZ.primary} strokeWidth="1" strokeDasharray="3 2" />
            <text x={INNER_X + 16} y={74} fontSize="8" fill={VIZ.primary} fontWeight="600">p.category</text>
          </motion.g>
        )}

        {/* Type label */}
        <text x={SVG_W / 2} y={190} textAnchor="middle" fontSize="11" fontWeight="600" fill={VIZ.text}>
          {type === 'scalar' ? 'Scalar Subquery' : type === 'in' ? 'IN Subquery' : 'Correlated Subquery'}
        </text>
      </svg>
    </div>
  );
}
