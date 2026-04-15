import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'

const SIGNS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  '1','2','3','4','5','6','7','8','9'
]

// Pre-compute positions & randomness at module level (stable across renders)
const SIGN_DATA = SIGNS.map((sign, i) => {
  const phi   = Math.acos(-1 + (2 * i) / SIGNS.length)
  const theta = Math.sqrt(SIGNS.length * Math.PI) * phi
  const r     = 5.8
  return {
    sign,
    position: [
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi) * 0.55,
    ],
    floatSpeed:  0.6 + (i % 7) * 0.15,
    delay:       i * 0.19,
    rotMul:      0.18 + (i % 5) * 0.06,
  }
})

/* ── Individual sign tile ── */
function SignTile({ sign, position, floatSpeed, delay, rotMul }) {
  const group = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    group.current.rotation.y = Math.sin(t * rotMul + delay) * 0.35
    group.current.rotation.x = Math.cos(t * rotMul * 0.7 + delay) * 0.18
  })

  return (
    <Float speed={floatSpeed} floatIntensity={0.7} rotationIntensity={0.05}>
      <group ref={group} position={position}>
        {/* Card face */}
        <mesh>
          <boxGeometry args={[0.72, 0.72, 0.07]} />
          <meshStandardMaterial
            color="#012a2d"
            emissive="#01696f"
            emissiveIntensity={0.55}
            roughness={0.08}
            metalness={0.9}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Subtle glow plane */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial color="#01696f" transparent opacity={0.12} />
        </mesh>
        {/* Letter */}
        <Text
          position={[0, 0, 0.07]}
          fontSize={0.38}
          color="#e2f7f8"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {sign}
        </Text>
      </group>
    </Float>
  )
}

/* ── Central wireframe orb ── */
function CentralOrb() {
  const mesh = useRef()
  const ring = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mesh.current.rotation.y = t * 0.28
    mesh.current.rotation.x = t * 0.11
    ring.current.rotation.z = t * 0.18
    ring.current.rotation.x = t * 0.07
  })

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#01696f"
          emissive="#4f98a3"
          emissiveIntensity={0.9}
          wireframe
        />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.5, 0.018, 6, 80]} />
        <meshBasicMaterial color="#01696f" transparent opacity={0.4} />
      </mesh>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color="#01696f" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

/* ── Slow rotation wrapper around all tiles ── */
function SphericalGlobe({ children }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.06
  })
  return <group ref={ref}>{children}</group>
}

/* ── Mouse-driven camera nudge ── */
function CameraRig({ mouse }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current[0] * 2.5 - camera.position.x) * 0.025
    camera.position.y += (-mouse.current[1] * 2.5 - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ── Scene contents ── */
function SceneContent({ mouse }) {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 9, 22]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]}    intensity={2.5} color="#01696f" distance={18} />
      <pointLight position={[6, 6, 4]}    intensity={1.2} color="#4f98a3" />
      <pointLight position={[-6, -4, 2]}  intensity={0.6} color="#7cb5bc" />
      <pointLight position={[0, -8, -4]}  intensity={0.4} color="#013a3d" />

      <Stars radius={90} depth={60} count={5000} factor={3.5} saturation={0.2} fade speed={0.4} />

      <CentralOrb />
      <CameraRig mouse={mouse} />

      <SphericalGlobe>
        {SIGN_DATA.map((d) => (
          <SignTile key={d.sign} {...d} />
        ))}
      </SphericalGlobe>
    </>
  )
}

/* ── Exported canvas component ── */
export default function HeroScene() {
  const mouse = useRef([0, 0])

  return (
    <div
      className="absolute inset-0"
      onMouseMove={(e) => {
        mouse.current = [
          (e.clientX / window.innerWidth)  * 2 - 1,
          (e.clientY / window.innerHeight) * 2 - 1,
        ]
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 11], fov: 58 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneContent mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}