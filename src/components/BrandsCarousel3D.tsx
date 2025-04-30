import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useTexture, OrbitControls, Billboard } from '@react-three/drei';
import { Group } from 'three';
import gsap from 'gsap';

// Importaciones de SVG en lugar de PNG
import AlcoplastImg from '../assets/marcas/Alcoplast.svg';
import ArchitexImg from '../assets/marcas/Architex.svg';
import AvientImg from '../assets/marcas/Avient.svg';
import KiwoImg from '../assets/marcas/Kiwo.svg';
import PrintopImg from '../assets/marcas/Printop.svg';
import UlanoImg from '../assets/marcas/Ulano.svg';

const brands = [
  'Alcoplast', 'Architex', 'Avient', 
  'Kiwo', 'Printop', 'Ulano'
];

// Mapeo de nombres de marcas a sus imágenes importadas
const brandImagesMap = {
  Alcoplast: AlcoplastImg,
  Architex: ArchitexImg,
  Avient: AvientImg,
  Kiwo: KiwoImg,
  Printop: PrintopImg,
  Ulano: UlanoImg
};

// Componente optimizado para mejor rendimiento
function BrandRing() {
  const groupRef = useRef<Group>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  
  // Cargar texturas de forma optimizada usando las importaciones directas
  const textures = useTexture(
    Object.fromEntries(
      Object.entries(brandImagesMap).map(([key, value]) => [key, value])
    )
  );

  // Animación suave en cada frame
  useFrame(() => {
    if (groupRef.current && !hoveredBrand) {
      // Rotación más suave solo cuando no hay elemento hover
      groupRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      // Configuración de la animación con GSAP
      const target = groupRef.current.rotation;
      if (target) {
        gsap.to(target, {
          y: Math.PI * 2,
          duration: 30, // Más lento para que sea menos distractivo
          repeat: -1,
          ease: "none"
        });
      }
    }

    // Limpiar animación en desmontaje
    return () => {
      if (groupRef.current && groupRef.current.rotation) {
        gsap.killTweensOf(groupRef.current.rotation);
      }
    };
  }, []);

  // Aumentamos el radio del carrusel para que sea más grande
  const radius = 7.5; // Ligeramente más grande

  return (
    <group ref={groupRef}>
      {brands.map((brand, index) => {
        const angle = (index / brands.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <group 
            key={brand} 
            position={[x, 0, z]} 
            onPointerOver={() => setHoveredBrand(brand)}
            onPointerOut={() => setHoveredBrand(null)}
          >
            {/* Usamos Billboard para que siempre sea legible (no se ponga en espejo) */}
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
              <mesh>
                <planeGeometry args={[3.2, 1.8]} /> {/* Ligeramente más grande */}
                <meshBasicMaterial 
                  map={textures[brand as keyof typeof textures]}
                  transparent
                  opacity={hoveredBrand === brand ? 1 : 0.9}
                  color={hoveredBrand === brand ? "#ffffff" : "#f0f0f0"}
                  side={2} // Material visible desde ambos lados
                  depthWrite={false}
                />
              </mesh>
            </Billboard>
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
      {Array.from({ length: 250 }).map((_, i) => { // Más estrellas para un efecto más inmersivo
        const x = (Math.random() - 0.5) * 40; 
        const y = (Math.random() - 0.5) * 40; 
        const z = (Math.random() - 0.5) * 40; 
        const size = Math.random() * 0.05 + 0.01;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial color={Math.random() > 0.7 ? "#DAA520" : "#ffffff"} />
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
        camera={{ position: [0, 1, 13.5], fov: 60 }} // Ajustamos la posición de la cámara un poco más alta
        dpr={[1, 2]} 
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true, // Activamos antialiasing para mejor calidad visual
          alpha: true, 
          powerPreference: 'high-performance' 
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 20]} /> 
        <ambientLight intensity={0.6} /> {/* Más luz ambiente */}
        <pointLight position={[10, 10, 10]} intensity={0.6} /> {/* Más intensidad */}
        <BackgroundStars />
        <group position={[0, 2, 0]}> {/* Posicionamos el carrusel más arriba */}
          <BrandRing />
        </group>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default BrandsCarousel3D;