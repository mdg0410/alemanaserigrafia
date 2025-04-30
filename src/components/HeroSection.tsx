import { useState, useEffect } from 'react';
import LogoAlemana from '../assets/LogoAlemana.svg';
import AlemanaTotal from '../assets/AlemanaTotal.png';
import BrandsCarousel3D from './BrandsCarousel3D';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeño retraso para asegurar que la animación se vea después de la carga
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden"
      aria-label="Sección de inicio"
    >
      {/* Fondo con efecto de gradiente para mejorar el contraste y legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/40 to-black/90 z-10"></div>
      
      {/* Imagen de fondo con optimización de accesibilidad */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src={AlemanaTotal}
          alt=""
          className="w-full h-full object-cover opacity-20"
          style={{ objectPosition: 'center' }}
          loading="eager"
        />
      </div>

      {/* Carrusel 3D de marcas */}
      <div aria-hidden="true">
        <BrandsCarousel3D />
      </div>

      <div id="main-content" tabIndex={-1} className="sr-only">Contenido principal comienza aquí</div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col items-center text-center">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <img
              src={LogoAlemana}
              alt="Alemana Print Logo"
              className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-8"
              style={{
                padding: '15px',
                filter: 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.3))'
              }}
            />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            Expertos en <span className="text-secondary">Serigrafía</span>
          </h1>
          
          <p className={`text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            Soluciones profesionales de serigrafía para todos tus proyectos.
            Calidad y precisión en cada impresión.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <a
              href="#servicios"
              className="btn-primary px-8 py-3 text-lg"
              aria-label="Ver nuestros servicios"
            >
              Nuestros Servicios
            </a>
            <a
              href="#contacto"
              className="btn-outline px-8 py-3 text-lg"
              aria-label="Contactar con nosotros"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll mejorado con mayor accesibilidad */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-6 h-10 border-2 border-secondary rounded-full p-1">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce mx-auto"></div>
          </div>
          <p className="text-secondary text-sm mt-2 text-center">Desliza para explorar</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;