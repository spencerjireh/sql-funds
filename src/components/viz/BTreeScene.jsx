import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { Suspense } from 'react';

function BTreeNode({ position, values, color = '#2563EB' }) {
  const width = values.length * 0.8 + 0.4;
  return (
    <group position={position}>
      <RoundedBox args={[width, 0.5, 0.3]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      {values.map((v, i) => (
        <Text
          key={i}
          position={[(i - (values.length - 1) / 2) * 0.8, 0, 0.16]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.ttf"
        >
          {String(v)}
        </Text>
      ))}
    </group>
  );
}

function Edge({ from, to }) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...from, ...to])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8B949E" linewidth={1} />
    </line>
  );
}

export default function BTreeScene() {
  return (
    <div style={{ height: 360, margin: '2rem 0', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {/* Root */}
          <BTreeNode position={[0, 2.5, 0]} values={[10, 20]} />

          {/* Level 2 */}
          <BTreeNode position={[-3, 0.8, 0]} values={[3, 7]} color="#7C3AED" />
          <BTreeNode position={[0, 0.8, 0]} values={[12, 15]} color="#7C3AED" />
          <BTreeNode position={[3, 0.8, 0]} values={[25, 30]} color="#7C3AED" />

          {/* Level 3 - leaves */}
          <BTreeNode position={[-4.2, -1, 0]} values={[1, 2]} color="#16A34A" />
          <BTreeNode position={[-2.8, -1, 0]} values={[4, 5, 6]} color="#16A34A" />
          <BTreeNode position={[-1.2, -1, 0]} values={[8, 9]} color="#16A34A" />
          <BTreeNode position={[0, -1, 0]} values={[11]} color="#16A34A" />
          <BTreeNode position={[1.2, -1, 0]} values={[13, 14]} color="#16A34A" />
          <BTreeNode position={[2.4, -1, 0]} values={[21, 22]} color="#16A34A" />
          <BTreeNode position={[3.8, -1, 0]} values={[26, 28, 31]} color="#16A34A" />

          {/* Edges root -> level 2 */}
          <Edge from={[-0.6, 2.25, 0]} to={[-3, 1.05, 0]} />
          <Edge from={[0, 2.25, 0]} to={[0, 1.05, 0]} />
          <Edge from={[0.6, 2.25, 0]} to={[3, 1.05, 0]} />

          {/* Edges level 2 -> level 3 */}
          <Edge from={[-3.5, 0.55, 0]} to={[-4.2, -0.75, 0]} />
          <Edge from={[-3, 0.55, 0]} to={[-2.8, -0.75, 0]} />
          <Edge from={[-2.5, 0.55, 0]} to={[-1.2, -0.75, 0]} />
          <Edge from={[-0.5, 0.55, 0]} to={[0, -0.75, 0]} />
          <Edge from={[0.5, 0.55, 0]} to={[1.2, -0.75, 0]} />
          <Edge from={[2.5, 0.55, 0]} to={[2.4, -0.75, 0]} />
          <Edge from={[3.5, 0.55, 0]} to={[3.8, -0.75, 0]} />

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
