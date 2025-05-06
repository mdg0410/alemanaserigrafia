import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

const Logo = () => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.8} 
      floatIntensity={0.6}
    >
      <motion.group
        animate={{
          scale: hovered ? 1.2 : 1,
          rotateY: hovered ? Math.PI * 2 : 0
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshStandardMaterial
            color={hovered ? "#DAA520" : "#4B0082"}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Texto 2D como alternativa al Text3D */}
        <Html position={[-2.8, -2, 0]} center>
          <div className="text-white text-2xl font-bold" style={{ whiteSpace: 'nowrap' }}>
            ALEMANA DE SERIGRAFÍA
          </div>
        </Html>
      </motion.group>
    </Float>
  );
};

// Componente de carga
const Loader = () => {
  return (
    <Html center>
      <div className="text-white text-xl">Cargando...</div>
    </Html>
  );
};

// Componente de error
const ErrorFallback = () => {
  return (
    <Html center>
      <div className="text-red-500 text-xl">
        Error al cargar la escena 3D
      </div>
    </Html>
  );
};

const LogoScene = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          className="bg-gradient-to-b from-primary/20 to-dark"
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000');
          }}
        >
          <color attach="background" args={['#000']} />
          <fog attach="fog" args={['#000', 5, 15]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[-2, 2, 2]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[0, 2, -1]} intensity={0.4} />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          
          <Suspense fallback={<Loader />}>
            <Logo />
          </Suspense>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

// Componente ErrorBoundary personalizado
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; FallbackComponent: React.ComponentType },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; FallbackComponent: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error en la escena 3D:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default LogoScene;