import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Group } from 'three';
import { VIZ, MONO_FONT_URL } from './vizPalette';
import styles from './AggregateScene.module.css';

type AggType = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

interface AggregateSceneProps {
  aggregateType?: AggType;
  values?: number[];
  height?: number;
}

const DEFAULT_VALUES = [40, 75, 20, 95, 55];
const SPACING = 1.4;

interface BlockProps {
  value: number;
  index: number;
  total: number;
  aggType: AggType;
  step: number;
  maxVal: number;
  avgVal: number;
  minIdx: number;
  maxIdx: number;
  sumOffset: number;
}

function Block({ value, index, total, aggType, step, maxVal, avgVal, minIdx, maxIdx, sumOffset }: BlockProps) {
  const ref = useRef<Group>(null);
  const baseHeight = (value / maxVal) * 2;
  const x = (index - (total - 1) / 2) * SPACING;

  useFrame(() => {
    if (!ref.current) return;
    const g = ref.current;

    if (aggType === 'COUNT') {
      const isFlashing = step === index;
      g.position.set(x, baseHeight / 2, 0);
      g.scale.setScalar(isFlashing ? 1.15 : 1);
    } else if (aggType === 'SUM') {
      const progress = Math.min(1, step / (total - 1));
      const targetX = x * (1 - progress);
      const targetY = sumOffset + baseHeight / 2;
      g.position.set(
        x + (targetX - x) * (step >= index ? 1 : 0),
        step >= index ? targetY : baseHeight / 2,
        0,
      );
      g.scale.setScalar(1);
    } else if (aggType === 'AVG') {
      const avgHeight = (avgVal / maxVal) * 2;
      const progress = step >= total ? 1 : 0;
      const h = baseHeight + (avgHeight - baseHeight) * progress;
      g.position.set(
        step >= total ? 0 : x,
        h / 2,
        0,
      );
      g.scale.setScalar(1);
    } else if (aggType === 'MIN') {
      g.position.set(x, baseHeight / 2, 0);
      g.scale.setScalar(step > 0 && index === minIdx ? 1.1 : 1);
    } else {
      g.position.set(x, baseHeight / 2, 0);
      g.scale.setScalar(step > 0 && index === maxIdx ? 1.1 : 1);
    }
  });

  const isTarget =
    (aggType === 'MIN' && step > 0 && index === minIdx) ||
    (aggType === 'MAX' && step > 0 && index === maxIdx);
  const isFlashingCount = aggType === 'COUNT' && step === index;
  const dimmed =
    (aggType === 'MIN' && step > 0 && index !== minIdx) ||
    (aggType === 'MAX' && step > 0 && index !== maxIdx);

  return (
    <group ref={ref} position={[x, baseHeight / 2, 0]}>
      <RoundedBox args={[0.9, baseHeight, 0.7]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial
          color={VIZ.primary}
          roughness={0.3}
          clearcoat={0.3}
          transparent={dimmed}
          opacity={dimmed ? 0.2 : 1}
          emissive={isTarget || isFlashingCount ? VIZ.accentLight : '#000000'}
          emissiveIntensity={isTarget || isFlashingCount ? 0.5 : 0}
        />
      </RoundedBox>
      <Text
        position={[0, baseHeight / 2 + 0.2, 0]}
        fontSize={0.18}
        color={dimmed ? VIZ.textMuted : 'white'}
        anchorX="center"
        anchorY="bottom"
        font={MONO_FONT_URL}
      >
        {String(value)}
      </Text>
    </group>
  );
}

function ResultLabel({ aggType, step, values, total }: { aggType: AggType; step: number; values: number[]; total: number }) {
  let text = '';
  if (aggType === 'COUNT' && step >= 0) {
    text = `COUNT = ${Math.min(step + 1, total)}`;
  } else if (aggType === 'SUM' && step >= 0) {
    const sum = values.slice(0, Math.min(step + 1, total)).reduce((a, b) => a + b, 0);
    text = `SUM = ${sum}`;
  } else if (aggType === 'AVG' && step >= total) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    text = `AVG = ${avg.toFixed(1)}`;
  } else if (aggType === 'MIN' && step > 0) {
    text = `MIN = ${Math.min(...values)}`;
  } else if (aggType === 'MAX' && step > 0) {
    text = `MAX = ${Math.max(...values)}`;
  }

  if (!text) return null;

  return (
    <Text
      position={[0, -0.5, 2]}
      fontSize={0.22}
      color={VIZ.accent}
      anchorX="center"
      font={MONO_FONT_URL}
    >
      {text}
    </Text>
  );
}

function AggregateBlocks({ values, aggType }: { values: number[]; aggType: AggType }) {
  const [step, setStep] = useState(-1);
  const total = values.length;
  const maxVal = Math.max(...values);
  const avgVal = values.reduce((a, b) => a + b, 0) / values.length;
  const minIdx = values.indexOf(Math.min(...values));
  const maxIdx = values.indexOf(Math.max(...values));

  const sumOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    for (const v of values) {
      offsets.push(acc);
      acc += (v / maxVal) * 2;
    }
    return offsets;
  }, [values, maxVal]);

  useEffect(() => {
    setStep(-1);
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (aggType === 'COUNT') {
      for (let i = 0; i < total; i++) {
        timers.push(setTimeout(() => setStep(i), 400 + i * 350));
      }
    } else if (aggType === 'SUM') {
      for (let i = 0; i < total; i++) {
        timers.push(setTimeout(() => setStep(i), 400 + i * 400));
      }
    } else if (aggType === 'AVG') {
      timers.push(setTimeout(() => setStep(total), 600));
    } else {
      timers.push(setTimeout(() => setStep(1), 500));
    }
    return () => timers.forEach(clearTimeout);
  }, [aggType, total]);

  return (
    <>
      {values.map((v, i) => (
        <Block
          key={`${aggType}-${i}`}
          value={v}
          index={i}
          total={total}
          aggType={aggType}
          step={step}
          maxVal={maxVal}
          avgVal={avgVal}
          minIdx={minIdx}
          maxIdx={maxIdx}
          sumOffset={sumOffsets[i] ?? 0}
        />
      ))}
      <ResultLabel aggType={aggType} step={step} values={values} total={total} />
    </>
  );
}

export default function AggregateScene({
  aggregateType: initialType = 'COUNT',
  values = DEFAULT_VALUES,
  height = 340,
}: AggregateSceneProps) {
  const [aggType, setAggType] = useState<AggType>(initialType);

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.toggleOverlay}>
        {(['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'] as AggType[]).map(t => (
          <button
            key={t}
            className={`${styles.toggleBtn} ${aggType === t ? styles.toggleBtnActive : ''}`}
            onClick={() => setAggType(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
          <directionalLight position={[-3, 2, -3]} intensity={0.25} color="#e0f2fe" />
          <pointLight position={[0, 3, 2]} intensity={0.15} color={VIZ.primaryLight} />
          <AggregateBlocks values={values} aggType={aggType} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>
    </div>
  );
}
