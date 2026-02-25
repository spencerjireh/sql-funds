import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, QuadraticBezierLine } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Group } from 'three';
import { VIZ, MONO_FONT_URL } from './vizPalette';

type Vec3 = [number, number, number];

interface NodeData {
  id: string;
  position: Vec3;
  values: number[];
  color: string;
  children: string[];
}

const TREE: NodeData[] = [
  { id: 'root', position: [0, 2.5, 0], values: [10, 20], color: VIZ.primary, children: ['l2a', 'l2b', 'l2c'] },
  { id: 'l2a', position: [-3, 0.8, 0], values: [3, 7], color: VIZ.accent, children: ['l3a', 'l3b', 'l3c'] },
  { id: 'l2b', position: [0, 0.8, 0], values: [12, 15], color: VIZ.accent, children: ['l3d', 'l3e'] },
  { id: 'l2c', position: [3, 0.8, 0], values: [25, 30], color: VIZ.accent, children: ['l3f', 'l3g'] },
  { id: 'l3a', position: [-4.2, -1, 0], values: [1, 2], color: VIZ.success, children: [] },
  { id: 'l3b', position: [-2.8, -1, 0], values: [4, 5, 6], color: VIZ.success, children: [] },
  { id: 'l3c', position: [-1.2, -1, 0], values: [8, 9], color: VIZ.success, children: [] },
  { id: 'l3d', position: [0, -1, 0], values: [11], color: VIZ.success, children: [] },
  { id: 'l3e', position: [1.2, -1, 0], values: [13, 14], color: VIZ.success, children: [] },
  { id: 'l3f', position: [2.4, -1, 0], values: [21, 22], color: VIZ.success, children: [] },
  { id: 'l3g', position: [3.8, -1, 0], values: [26, 28, 31], color: VIZ.success, children: [] },
];

const EDGES: [string, string][] = [
  ['root', 'l2a'], ['root', 'l2b'], ['root', 'l2c'],
  ['l2a', 'l3a'], ['l2a', 'l3b'], ['l2a', 'l3c'],
  ['l2b', 'l3d'], ['l2b', 'l3e'],
  ['l2c', 'l3f'], ['l2c', 'l3g'],
];

function findSearchPath(value: number): string[] {
  const path: string[] = ['root'];
  const root = TREE[0]!;
  if (root.values.includes(value)) return path;

  let childIdx = root.values.findIndex(v => value < v);
  if (childIdx === -1) childIdx = root.values.length;
  const l2Id = root.children[childIdx];
  if (!l2Id) return path;
  path.push(l2Id);

  const l2 = TREE.find(n => n.id === l2Id)!;
  if (l2.values.includes(value)) return path;

  let leafIdx = l2.values.findIndex(v => value < v);
  if (leafIdx === -1) leafIdx = l2.values.length;
  const l3Id = l2.children[leafIdx];
  if (l3Id) path.push(l3Id);
  return path;
}

interface BTreeNodeMeshProps {
  node: NodeData;
  isOnPath: boolean;
  isActive: boolean;
  dimmed: boolean;
}

function BTreeNodeMesh({ node, isOnPath, isActive, dimmed }: BTreeNodeMeshProps) {
  const ref = useRef<Group>(null);
  const width = node.values.length * 0.8 + 0.4;

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y = node.position[1];
  });

  const opacity = dimmed ? 0.25 : 1;
  const emissiveColor = isActive ? VIZ.accentLight : '#000000';
  const emissiveIntensity = isActive ? 0.4 : 0;

  return (
    <group ref={ref} position={node.position}>
      <RoundedBox args={[width, 0.5, 0.3]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color={node.color}
          roughness={0.3}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          transparent={dimmed}
          opacity={opacity}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>
      {node.values.map((v, i) => (
        <Text
          key={i}
          position={[(i - (node.values.length - 1) / 2) * 0.8, 0, 0.16]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={MONO_FONT_URL}
          fillOpacity={dimmed ? 0.3 : 1}
        >
          {String(v)}
        </Text>
      ))}
    </group>
  );
}

function getNodePos(id: string): Vec3 {
  return TREE.find(n => n.id === id)!.position;
}

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.3, (a[2] + b[2]) / 2];
}

interface BTreeGraphProps {
  searchValue?: number;
}

function BTreeGraph({ searchValue }: BTreeGraphProps) {
  const [activeStep, setActiveStep] = useState(-1);
  const searchPath = searchValue != null ? findSearchPath(searchValue) : [];
  const searching = searchPath.length > 0 && searchValue != null;

  useEffect(() => {
    if (!searching) { setActiveStep(-1); return; }
    setActiveStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < searchPath.length; i++) {
      timers.push(setTimeout(() => setActiveStep(i), i * 400));
    }
    const resetTimer = setTimeout(() => setActiveStep(-1), searchPath.length * 400 + 1500);
    timers.push(resetTimer);
    return () => timers.forEach(clearTimeout);
  }, [searchValue]);

  const pathSet = new Set(searching && activeStep >= 0 ? searchPath.slice(0, activeStep + 1) : []);
  const dimming = searching && activeStep >= 0;

  return (
    <>
      {TREE.map(node => (
        <BTreeNodeMesh
          key={node.id}
          node={node}
          isOnPath={pathSet.has(node.id)}
          isActive={searchPath[activeStep] === node.id}
          dimmed={dimming && !pathSet.has(node.id)}
        />
      ))}
      {EDGES.map(([fromId, toId]) => {
        const from = getNodePos(fromId);
        const to = getNodePos(toId);
        const mid = midpoint(from, to);
        const onPath = pathSet.has(fromId) && pathSet.has(toId);
        return (
          <QuadraticBezierLine
            key={`${fromId}-${toId}`}
            start={from}
            end={to}
            mid={mid}
            color={onPath ? VIZ.accentLight : VIZ.textMuted}
            lineWidth={onPath ? 2.5 : 1}
            transparent
            opacity={dimming && !onPath ? 0.15 : 0.6}
          />
        );
      })}
    </>
  );
}

interface BTreeSceneProps {
  searchValue?: number;
  height?: number;
  autoRotateSpeed?: number;
}

export default function BTreeScene({ searchValue, height = 360, autoRotateSpeed = 0.3 }: BTreeSceneProps) {
  return (
    <div style={{ height, margin: '2rem 0', borderRadius: 12, overflow: 'hidden', border: `1px solid ${VIZ.border}` }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <fog attach="fog" args={[VIZ.surfaceAlt, 8, 18]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
          <directionalLight position={[-3, 2, -3]} intensity={0.25} color="#e0f2fe" />
          <BTreeGraph searchValue={searchValue} />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={autoRotateSpeed}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
