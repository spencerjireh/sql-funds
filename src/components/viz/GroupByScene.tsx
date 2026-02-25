import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Group } from 'three';
import { VIZ, MONO_FONT_URL } from './vizPalette';
import styles from './GroupByScene.module.css';

interface GroupRow {
  label: string;
  group: string;
  value: number;
}

interface GroupBySceneProps {
  rows?: GroupRow[];
  groupColumn?: string;
  aggregateLabel?: string;
  height?: number;
  autoPlay?: boolean;
}

const DEFAULT_ROWS: GroupRow[] = [
  { label: 'Laptop', group: 'Electronics', value: 1299 },
  { label: 'Mouse', group: 'Electronics', value: 29 },
  { label: 'Monitor', group: 'Electronics', value: 499 },
  { label: 'Desk', group: 'Furniture', value: 350 },
  { label: 'Chair', group: 'Furniture', value: 275 },
  { label: 'Pen', group: 'Office', value: 5 },
  { label: 'Notebook', group: 'Office', value: 12 },
];

const GROUP_COLORS = [VIZ.primary, VIZ.accent, VIZ.purple, VIZ.success];

type Phase = 'initial' | 'partition' | 'aggregate';

interface RowBlockProps {
  row: GroupRow;
  index: number;
  phase: Phase;
  groupIdx: number;
  withinGroupIdx: number;
  groupSize: number;
  groupCount: number;
  maxVal: number;
  color: string;
}

function RowBlock({ row, index, phase, groupIdx, withinGroupIdx, groupSize, groupCount, maxVal, color }: RowBlockProps) {
  const ref = useRef<Group>(null);
  const height = Math.max(0.3, (row.value / maxVal) * 1.8);

  const initialX = (index - 3) * 1.2;
  const groupSpacing = 3;
  const groupX = (groupIdx - (groupCount - 1) / 2) * groupSpacing;
  const withinX = (withinGroupIdx - (groupSize - 1) / 2) * 0.8;
  const partitionX = groupX + withinX;

  const aggregateHeight = Math.max(0.4, 1.2);

  useFrame(() => {
    if (!ref.current) return;
    const g = ref.current;
    const speed = 0.08;

    if (phase === 'initial') {
      g.position.x += (initialX - g.position.x) * speed;
      g.position.y += (height / 2 - g.position.y) * speed;
      g.position.z += (0 - g.position.z) * speed;
      g.scale.y += (1 - g.scale.y) * speed;
    } else if (phase === 'partition') {
      g.position.x += (partitionX - g.position.x) * speed;
      g.position.y += (height / 2 - g.position.y) * speed;
      g.position.z += (0 - g.position.z) * speed;
      g.scale.y += (1 - g.scale.y) * speed;
    } else {
      g.position.x += (groupX - g.position.x) * speed;
      g.position.y += (aggregateHeight / 2 - g.position.y) * speed;
      g.position.z += (0 - g.position.z) * speed;
      const targetScale = withinGroupIdx === 0 ? 1 : 0.01;
      g.scale.y += (targetScale - g.scale.y) * speed;
    }
  });

  return (
    <group ref={ref} position={[initialX, height / 2, 0]}>
      <RoundedBox args={[0.6, height, 0.5]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          clearcoat={0.3}
        />
      </RoundedBox>
      {phase !== 'aggregate' && (
        <Text
          position={[0, height / 2 + 0.15, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          font={MONO_FONT_URL}
        >
          {row.label}
        </Text>
      )}
    </group>
  );
}

function FloorPlate({ groupIdx, groupCount, label, color, phase }: { groupIdx: number; groupCount: number; label: string; color: string; phase: Phase }) {
  const ref = useRef<Group>(null);
  const groupSpacing = 3;
  const x = (groupIdx - (groupCount - 1) / 2) * groupSpacing;

  useFrame(() => {
    if (!ref.current) return;
    const targetOpacity = phase !== 'initial' ? 1 : 0;
    ref.current.position.set(x, -0.05, 0);
    ref.current.visible = targetOpacity > 0.5;
  });

  if (phase === 'initial') return null;

  return (
    <group ref={ref} position={[x, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <Text
        position={[0, 0.01, 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.14}
        color={color}
        anchorX="center"
        font={MONO_FONT_URL}
      >
        {label}
      </Text>
    </group>
  );
}

function GroupByGraph({ rows, groupColumn }: { rows: GroupRow[]; groupColumn: string }) {
  const [phase, setPhase] = useState<Phase>('initial');

  const groups = useMemo(() => {
    const map = new Map<string, number[]>();
    rows.forEach((r, i) => {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(i);
    });
    return Array.from(map.entries());
  }, [rows]);

  const maxVal = Math.max(...rows.map(r => r.value));

  const runAnimation = useCallback(() => {
    setPhase('initial');
    const t1 = setTimeout(() => setPhase('partition'), 1200);
    const t2 = setTimeout(() => setPhase('aggregate'), 3500);
    return [t1, t2];
  }, []);

  useEffect(() => {
    const timers = runAnimation();
    return () => timers.forEach(clearTimeout);
  }, [runAnimation]);

  return (
    <>
      {groups.map(([groupName, indices], gi) => (
        <FloorPlate
          key={groupName}
          groupIdx={gi}
          groupCount={groups.length}
          label={groupName}
          color={GROUP_COLORS[gi % GROUP_COLORS.length] ?? VIZ.primary}
          phase={phase}
        />
      ))}
      {rows.map((row, i) => {
        const gi = groups.findIndex(([name]) => name === row.group);
        if (gi === -1) return null;
        const groupEntry = groups[gi]!;
        const withinIdx = groupEntry[1].indexOf(i);
        return (
          <RowBlock
            key={i}
            row={row}
            index={i}
            phase={phase}
            groupIdx={gi}
            withinGroupIdx={withinIdx}
            groupSize={groupEntry[1].length}
            groupCount={groups.length}
            maxVal={maxVal}
            color={GROUP_COLORS[gi % GROUP_COLORS.length] ?? VIZ.primary}
          />
        );
      })}
    </>
  );
}

export default function GroupByScene({
  rows = DEFAULT_ROWS,
  groupColumn = 'category',
  aggregateLabel = 'COUNT(*)',
  height = 340,
}: GroupBySceneProps) {
  const [key, setKey] = useState(0);

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.phaseOverlay}>
        <span className={`${styles.phaseLabel} ${styles.phasePartition}`}>GROUP BY {groupColumn}</span>
        <button className={styles.playBtn} onClick={() => setKey(k => k + 1)}>
          Replay
        </button>
      </div>
      <Canvas camera={{ position: [0, 3, 7], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
          <directionalLight position={[-3, 2, -3]} intensity={0.25} color="#e0f2fe" />
          <GroupByGraph key={key} rows={rows} groupColumn={groupColumn} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>
    </div>
  );
}
