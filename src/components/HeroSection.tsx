import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoAlemana from '../assets/LogoAlemana.svg';
import BrandsCarousel3D from './BrandsCarousel3D';
import { useAccessibility } from '../hooks/useAccessibility';
import { 
  fadeInUpVariants, 
  buttonHoverVariants, 
  scrollIndicatorVariants,
  staggerContainerVariants 
} from '../constants/animations';

const AnimatedLogo = ({ isVisible, reducedMotion }: { isVisible: boolean; reducedMotion: boolean }) => (
  <motion.div
    variants={fadeInUpVariants}
    initial={reducedMotion ? "visible" : "hidden"}
    animate={isVisible ? "visible" : "hidden"}
  >
    <img
      src={LogoAlemana}
      alt="Alemana Print Logo"
      className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-8"
      style={{
        padding: '15px',
        filter: 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.3))'
      }}
    />
  </motion.div>
);

const ScrollIndicator = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div 
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
    variants={scrollIndicatorVariants}
    initial={reducedMotion ? "visible" : "hidden"}
    animate="visible"
    aria-hidden="true"
  >
    <div className="flex flex-col items-center">
      <motion.div 
        className="w-6 h-10 border-2 border-secondary rounded-full p-1"
        variants={scrollIndicatorVariants}
        animate={reducedMotion ? undefined : "bounce"}
      >
        <div className="w-1.5 h-1.5 bg-secondary rounded-full mx-auto" />
      </motion.div>
      <p className="text-secondary text-sm mt-2 text-center">Desliza para explorar</p>
    </div>
  </motion.div>
);

const ActionButtons = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div 
    className="flex flex-col sm:flex-row gap-4"
    variants={fadeInUpVariants}
    initial={reducedMotion ? "visible" : "hidden"}
    animate="visible"
    transition={{ delay: reducedMotion ? 0 : 0.7 }}
  >
    <motion.a
      href="#servicios"
      className="btn-primary px-8 py-3 text-lg"
      variants={buttonHoverVariants}
      whileHover={reducedMotion ? undefined : "hover"}
      whileTap={reducedMotion ? undefined : "tap"}
      aria-label="Ver nuestros servicios"
    >
      Nuestros Servicios
    </motion.a>
    <motion.a
      href="#contacto"
      className="btn-outline px-8 py-3 text-lg"
      variants={buttonHoverVariants}
      whileHover={reducedMotion ? undefined : "hover"}
      whileTap={reducedMotion ? undefined : "tap"}
      aria-label="Contactar con nosotros"
    >
      Contáctanos
    </motion.a>
  </motion.div>
);

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { preferences } = useAccessibility();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden"
      aria-label="Sección de inicio"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/40 to-black/90 z-10" />
      
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <BrandsCarousel3D />
      </div>

      <div id="main-content" tabIndex={-1} className="sr-only">
        Contenido principal comienza aquí
      </div>

      <AnimatePresence>
        <motion.div 
          className="container mx-auto px-4 relative z-20"
          variants={staggerContainerVariants}
          initial={preferences.prefersReducedMotion ? "visible" : "hidden"}
          animate="visible"
        >
          <div className="flex flex-col items-center text-center">
            <AnimatedLogo 
              isVisible={isVisible} 
              reducedMotion={preferences.prefersReducedMotion} 
            />
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              variants={fadeInUpVariants}
              initial={preferences.prefersReducedMotion ? "visible" : "hidden"}
              animate="visible"
            >
              Expertos en <span className="text-secondary">Serigrafía</span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-8"
              variants={fadeInUpVariants}
              initial={preferences.prefersReducedMotion ? "visible" : "hidden"}
              animate="visible"
            >
              Soluciones profesionales de serigrafía para todos tus proyectos.
              Calidad y precisión en cada impresión.
            </motion.p>
            
            <ActionButtons reducedMotion={preferences.prefersReducedMotion} />
          </div>
        </motion.div>
      </AnimatePresence>

      <ScrollIndicator reducedMotion={preferences.prefersReducedMotion} />
    </section>
  );
};

export default HeroSection;