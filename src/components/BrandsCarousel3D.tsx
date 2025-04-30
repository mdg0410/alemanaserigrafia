import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useTexture, OrbitControls, useAspect } from '@react-three/drei';
import { Group } from 'three';
import gsap from 'gsap';

const brands = [
  'Alcoplast', 'Architex', 'Avient', 
  'Kiwo', 'Printop', 'Ulano'
];

// Componente optimizado para mejor rendimiento
function BrandRing() {
  const groupRef = useRef<Group>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  
  // Cargar texturas de forma optimizada
  const textures = useTexture({
    Alcoplast: '/src/assets/Alcoplast.png',
    Architex: '/src/assets/Architex.png',
    Avient: '/src/assets/Avient.png',
    Kiwo: '/src/assets/Kiwo.png',
    Printop: '/src/assets/Printop.png',
    Ulano: '/src/assets/Ulano.png'
  });

  // Animación suave en cada frame
  useFrame(() => {
    if (groupRef.current && !hoveredBrand) {
      // Rotación más suave solo cuando no hay elemento hover
      groupRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      // Animación inicial con GSAP para movimiento fluido
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 25,
        repeat: -1,
        ease: "none"
      });
    }

    // Limpiar animación en desmontaje
    return () => {
      gsap.killTweensOf(groupRef.current?.rotation);
    };
  }, []);

  return (
    <group ref={groupRef}>
      {brands.map((brand, index) => {
        const angle = (index / brands.length) * Math.PI * 2;
        const radius = 5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <group 
            key={brand} 
            position={[x, 0, z]} 
            rotation={[0, -angle, 0]}
            onPointerOver={() => setHoveredBrand(brand)}
            onPointerOut={() => setHoveredBrand(null)}
          >
            <mesh>
              <planeGeometry args={[2, 1]} />
              <meshBasicMaterial 
                map={textures[brand as keyof typeof textures]}
                transparent
                opacity={hoveredBrand === brand ? 1 : 0.8}
                color={hoveredBrand === brand ? "#ffffff" : "#dddddd"}
              />
            </mesh>
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.3}
              color={hoveredBrand === brand ? "#DAA520" : "#b3b3b3"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {brand}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Componente optimizado para el fondo
function BackgroundStars() {
  return (
    <>
      {Array.from({ length: 200 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const size = Math.random() * 0.05 + 0.01;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial color={Math.random() > 0.6 ? "#DAA520" : "#ffffff"} />
          </mesh>
        );
      })}
    </>
  );
}

// Componente principal con mejor manejo de accesibilidad
const BrandsCarousel3D = () => {
  const [mounted, setMounted] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  
  // Manejo de carga y errores
  useEffect(() => {
    setMounted(true);
    
    const handleError = () => {
      setHasFailed(true);
    };
    
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Si falla la carga o no es compatible, mostrar alternativa
  if (hasFailed || !mounted) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/30 to-dark" aria-hidden="true">
        <div className="w-full h-full flex items-center justify-center">
          <p className="sr-only">Fondo decorativo con logos de marcas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        dpr={[1, 2]} // Optimización para diferentes densidades de píxel
        performance={{ min: 0.5 }} // Para mejor rendimiento en dispositivos de baja gama
        gl={{ 
          antialias: false, // Desactivar antialiasing para mejor rendimiento
          alpha: true, 
          powerPreference: 'high-performance' 
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <BackgroundStars />
        <BrandRing />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false} // Desactivamos ya que usamos GSAP para animación
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default BrandsCarousel3D;