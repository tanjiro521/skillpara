"use client"

import { Canvas } from "@react-three/fiber"
import { Float, OrbitControls, Sparkles } from "@react-three/drei"

function AbstractNodes() {
  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.7}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.7, 0]} />
          <meshStandardMaterial color="#7A1E2C" emissive="#7A1E2C" roughness={0.35} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8} position={[3, 1.2, -1.3]}>
        <mesh>
          <torusGeometry args={[0.75, 0.18, 32, 96]} />
          <meshStandardMaterial color="#D96B2B" emissive="#D96B2B" roughness={0.2} metalness={0.7} />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.35} floatIntensity={0.55} position={[-3, -1.4, 1.1]}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#7C8F5A" emissive="#7C8F5A" roughness={0.25} metalness={0.7} />
        </mesh>
      </Float>

      <Sparkles count={20} size={3} scale={[6, 3, 6]} color="#D96B2B" speed={0.2} />
    </group>
  )
}

export default function Login3DHero() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-[#7A1E2C]/10 bg-[#F2E9DC]/60 shadow-[0_40px_120px_rgba(122,30,44,0.18)]">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} className="h-full w-full">
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -2, -2]} intensity={0.4} />
        <AbstractNodes />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#7A1E2C]/20 to-transparent px-6 py-5 text-white/80">
        <p className="text-sm font-medium">SkillPara token economy</p>
        <p className="mt-1 text-xs leading-5 text-white/70">Earn rewards for teaching and referrals. Spend tokens to unlock new learning pathways.</p>
      </div>
    </div>
  )
}
