import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { Suspense } from 'react';

function Cell({ position, text, isHeader = false, color = '#ffffff' }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.8, 0.4, 0.8]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={isHeader ? '#2563EB' : color} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.15}
        color={isHeader ? '#ffffff' : '#1F2328'}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
      >
        {text}
      </Text>
    </group>
  );
}

function TableModel({ position = [0, 0, 0], headers, rows }) {
  const rowHeight = 0.5;
  return (
    <group position={position}>
      {headers.map((h, i) => (
        <Cell
          key={`h-${i}`}
          position={[i * 2, 0, 0]}
          text={h}
          isHeader
        />
      ))}
      {rows.map((row, ri) =>
        row.map((cell, ci) => (
          <Cell
            key={`${ri}-${ci}`}
            position={[ci * 2, -(ri + 1) * rowHeight, 0]}
            text={String(cell)}
            color={ri % 2 === 0 ? '#F6F8FA' : '#FFFFFF'}
          />
        ))
      )}
    </group>
  );
}

export default function TableScene3D() {
  const headers = ['ID', 'Name', 'Price'];
  const rows = [
    [1, 'Laptop', '$1299'],
    [2, 'Mouse', '$29'],
    [3, 'Keyboard', '$149'],
  ];

  return (
    <div style={{ height: 320, margin: '2rem 0', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <TableModel headers={headers} rows={rows} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
