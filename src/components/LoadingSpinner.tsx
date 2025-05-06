import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]" role="status" aria-label="Cargando contenido">
      <motion.div
        className="w-16 h-16 border-4 border-secondary rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;