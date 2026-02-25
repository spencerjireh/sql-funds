import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, Edges } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Group, Vector3 } from 'three';
import { VIZ, SANS_FONT_URL } from './vizPalette';

type Vec3 = [number, number, number];

interface CellProps {
  position: Vec3;
  text: string;
  isHeader?: boolean;
  isHighlighted?: boolean;
  color?: string;
  index?: number;
}

function Cell({ position, text, isHeader = false, isHighlighted = false, color = '#ffffff', index = 0 }: CellProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2 + index * 0.4) * 0.02;
  });

  const highlight = isHighlighted || isHeader;

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[1.8, 0.4, 0.8]} radius={0.05} smoothness={4}>
        {highlight ? (
          <meshPhysicalMaterial
            color={VIZ.primary}
            metalness={0.3}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            metalness={0.05}
            roughness={0.4}
            clearcoat={0.2}
          />
        )}
        {highlight && <Edges color={VIZ.primaryLight} />}
      </RoundedBox>
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.15}
        color={highlight ? '#ffffff' : VIZ.text}
        anchorX="center"
        anchorY="middle"
        font={SANS_FONT_URL}
      >
        {text}
      </Text>
    </group>
  );
}

interface TableModelProps {
  position?: Vec3;
  headers: string[];
  rows: (string | number)[][];
  highlightRows?: number[];
}

function TableModel({ position = [0, 0, 0], headers, rows, highlightRows = [] }: TableModelProps) {
  const rowHeight = 0.5;
  return (
    <group position={position}>
      {headers.map((h, i) => (
        <Cell
          key={`h-${i}`}
          position={[i * 2, 0, 0]}
          text={h}
          isHeader
          index={i}
        />
      ))}
      {rows.map((row, ri) =>
        row.map((cell, ci) => (
          <Cell
            key={`${ri}-${ci}`}
            position={[ci * 2, -(ri + 1) * rowHeight, 0]}
            text={String(cell)}
            color={ri % 2 === 0 ? VIZ.surfaceAlt : VIZ.surface}
            isHighlighted={highlightRows.includes(ri)}
            index={ri * headers.length + ci + headers.length}
          />
        ))
      )}
    </group>
  );
}

const cameraStart = new Vector3(8, 6, 10);
const cameraEnd = new Vector3(3, 2, 5);

function CameraIntro() {
  const { camera } = useThree();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta / 1.5);
    const t = 1 - Math.pow(1 - progress.current, 3);
    camera.position.lerpVectors(cameraStart, cameraEnd, t);
  });

  return null;
}

interface TableScene3DProps {
  headers?: string[];
  rows?: (string | number)[][];
  highlightRows?: number[];
  height?: number;
}

export default function TableScene3D({
  headers = ['ID', 'Name', 'Price'],
  rows = [
    [1, 'Laptop', '$1299'],
    [2, 'Mouse', '$29'],
    [3, 'Keyboard', '$149'],
  ],
  highlightRows = [],
  height = 320,
}: TableScene3DProps) {
  return (
    <div style={{ height, margin: '2rem 0', borderRadius: 12, overflow: 'hidden', border: `1px solid ${VIZ.border}` }}>
      <Canvas camera={{ position: [8, 6, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
          <directionalLight position={[-3, 3, -2]} intensity={0.3} color="#e0f2fe" />
          <pointLight position={[0, 2, 3]} intensity={0.2} color={VIZ.primaryLight} />
          <CameraIntro />
          <TableModel headers={headers} rows={rows} highlightRows={highlightRows} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>
    </div>
  );
}
