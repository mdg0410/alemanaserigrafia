import { useRef, useEffect, useState, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Billboard } from '@react-three/drei';
import { Group } from 'three';
import gsap from 'gsap';
import { BRANDS_CONFIG, SCENE_CONFIG } from '../config/carousel3DConfig';
import { useAccessibility } from '../hooks/useAccessibility';

// Componente optimizado para renderizar una marca individual
const BrandLogo = memo(({ 
  brand, 
  position, 
  texture, 
  isHovered, 
  onHover,
  reducedMotion
}: { 
  brand: string;
  position: [number, number, number];
  texture: THREE.Texture;
  isHovered: boolean;
  onHover: (brand: string | null) => void;
  reducedMotion: boolean;
}) => (
  <group 
    position={position}
    onPointerOver={() => !reducedMotion && onHover(brand)}
    onPointerOut={() => !reducedMotion && onHover(null)}
  >
    <Billboard follow={!reducedMotion} lockX={false} lockY={false} lockZ={false}>
      <mesh>
        <planeGeometry args={[6, 1.7]} />
        <meshBasicMaterial 
          map={texture}
          transparent
          opacity={isHovered ? 1 : 0.9}
          color={isHovered ? "#ffffff" : "#f0f0f0"}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  </group>
));

BrandLogo.displayName = 'BrandLogo';

// Componente optimizado para las estrellas del fondo
const BackgroundStars = memo(() => {
  const stars = Array.from({ length: SCENE_CONFIG.stars.count }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * SCENE_CONFIG.stars.spread,
      (Math.random() - 0.5) * SCENE_CONFIG.stars.spread,
      (Math.random() - 0.5) * SCENE_CONFIG.stars.spread
    ] as [number, number, number],
    size: Math.random() * (SCENE_CONFIG.stars.size.max - SCENE_CONFIG.stars.size.min) + SCENE_CONFIG.stars.size.min,
    color: Math.random() > 0.7 ? SCENE_CONFIG.stars.colors.accent : SCENE_CONFIG.stars.colors.primary
  }));

  return (
    <>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial color={star.color} />
        </mesh>
      ))}
    </>
  );
});

BackgroundStars.displayName = 'BackgroundStars';

// Componente principal del anillo de marcas
const BrandRing = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const groupRef = useRef<Group>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const textures = useTexture(BRANDS_CONFIG.brandImagesMap);

  useFrame(() => {
    if (groupRef.current && !hoveredBrand && !reducedMotion) {
      groupRef.current.rotation.y += SCENE_CONFIG.ring.rotationSpeed;
    }
  });

  useEffect(() => {
    if (!groupRef.current || reducedMotion) return;

    const animation = gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: SCENE_CONFIG.ring.animationDuration,
      repeat: -1,
      ease: "none"
    });

    return () => {
      animation.kill();
    };
  }, [reducedMotion]);

  return (
    <group ref={groupRef}>
      {BRANDS_CONFIG.brands.map((brand, index) => {
        const angle = (index / BRANDS_CONFIG.brands.length) * Math.PI * 2;
        const position: [number, number, number] = [
          Math.sin(angle) * SCENE_CONFIG.ring.radius,
          0,
          Math.cos(angle) * SCENE_CONFIG.ring.radius
        ];

        return (
          <BrandLogo
            key={brand}
            brand={brand}
            position={position}
            texture={textures[brand as keyof typeof BRANDS_CONFIG.brandImagesMap]}
            isHovered={hoveredBrand === brand}
            onHover={setHoveredBrand}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </group>
  );
};

// Componente de fallback para cuando WebGL no está disponible
const FallbackDisplay = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/30 to-dark" aria-hidden="true">
    <div className="w-full h-full flex items-center justify-center">
      <p className="sr-only">Fondo decorativo con logos de marcas</p>
    </div>
  </div>
);

// Componente principal con manejo de errores
const BrandsCarousel3D = () => {
  const [mounted, setMounted] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const { preferences } = useAccessibility();

  useEffect(() => {
    setMounted(true);
    const handleError = () => setHasFailed(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasFailed || !mounted) {
    return <FallbackDisplay />;
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: SCENE_CONFIG.camera.position, fov: SCENE_CONFIG.camera.fov }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 20]} />
        
        <ambientLight intensity={SCENE_CONFIG.lights.ambient.intensity} />
        <pointLight 
          position={SCENE_CONFIG.lights.point.position} 
          intensity={SCENE_CONFIG.lights.point.intensity} 
        />
        
        <BackgroundStars />
        <group position={[0, 2, 0]}>
          <BrandRing reducedMotion={preferences.prefersReducedMotion} />
        </group>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={SCENE_CONFIG.controls.minPolarAngle}
          maxPolarAngle={SCENE_CONFIG.controls.maxPolarAngle}
          autoRotate={!preferences.prefersReducedMotion}
          enableDamping={!preferences.prefersReducedMotion}
          dampingFactor={SCENE_CONFIG.controls.dampingFactor}
        />
      </Canvas>
    </div>
  );
};

export default memo(BrandsCarousel3D);