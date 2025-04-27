import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import LogoScene from '../aframe/LogoScene';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-dark via-primary/80 to-primary">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent opacity-50" />
      </div>

      <div className="container-custom relative h-screen flex flex-col lg:flex-row items-center justify-center gap-12 pt-20">
        {/* Contenido principal */}
        <motion.div 
          className="lg:w-1/2 space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Serigrafía de
            <motion.span 
              className="block text-secondary mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Alta Calidad
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Transformamos tus ideas en impresiones excepcionales con tecnología de vanguardia y atención al detalle.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.a
              href="#contact"
              className="btn-secondary px-8 py-3 text-lg font-semibold w-full sm:w-auto text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cotizar Ahora
            </motion.a>
            <motion.a
              href="#services"
              className="btn-primary px-8 py-3 text-lg font-semibold w-full sm:w-auto text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Servicios
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Escena 3D */}
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <LogoScene />
        </motion.div>
      </div>

      {/* Flecha de scroll */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-light"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 1.2,
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <FontAwesomeIcon icon={faArrowDown} className="text-2xl" />
      </motion.div>
    </section>
  );
};

export default HeroSection;