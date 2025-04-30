import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductServiceModal from './ProductServiceModal';

const services = [
  {
    title: 'Serigrafía Textil',
    description: 'Impresión de alta calidad en todo tipo de prendas',
    icon: '👕',
    type: 'services',
    ariaLabel: 'Servicio de Serigrafía Textil'
  },
  {
    title: 'Productos Promocionales',
    description: 'Artículos personalizados para tu marca',
    icon: '🎯',
    type: 'products',
    ariaLabel: 'Productos Promocionales'
  },
  {
    title: 'Diseño Gráfico',
    description: 'Creación y adaptación de diseños para serigrafía',
    icon: '🎨',
    type: 'services',
    ariaLabel: 'Servicio de Diseño Gráfico'
  },
  {
    title: 'Materiales y Equipos',
    description: 'Venta de insumos y equipamiento profesional',
    icon: '🛠️',
    type: 'products',
    ariaLabel: 'Materiales y Equipos'
  }
];

const ServicesSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'products' | 'services'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // Referencia para foco después de cerrar el modal
  const returnFocusRef = useRef<HTMLDivElement | null>(null);

  const handleServiceClick = (type: 'products' | 'services', category: string, ref: React.RefObject<HTMLDivElement>) => {
    setModalType(type);
    setSelectedCategory(category);
    setModalOpen(true);
    returnFocusRef.current = ref.current;
  };

  return (
    <section 
      id="servicios" 
      className="py-20 bg-gradient-to-b from-dark-soft to-primary-dark/20"
      aria-labelledby="services-heading"
    >
      <div className="container-custom">
        <motion.h2 
          id="services-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-8 md:mb-12"
        >
          Nuestros Servicios
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {services.map((service, index) => {
            // Crear una ref para cada servicio
            const cardRef = useRef<HTMLDivElement>(null);
            
            return (
              <motion.div
                key={service.title}
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-primary/20 to-dark-soft/70 backdrop-blur-sm 
                  rounded-xl p-6 cursor-pointer group transform transition-all duration-300
                  hover:shadow-lg hover:shadow-secondary/20 border border-secondary/10"
                onClick={() => handleServiceClick(service.type as 'products' | 'services', service.title, cardRef)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleServiceClick(service.type as 'products' | 'services', service.title, cardRef);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={service.ariaLabel}
                aria-haspopup="dialog"
              >
                <div 
                  className="text-4xl sm:text-5xl mb-4 transform transition-transform 
                    group-hover:scale-110 group-hover:rotate-12"
                  aria-hidden="true"
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3 
                  group-hover:text-white group-focus:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 group-hover:text-white/90 
                  group-focus:text-white/90 transition-colors">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-secondary 
                  group-hover:text-white group-focus:text-white transition-colors">
                  <span>Ver más</span>
                  <svg 
                    className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        <ProductServiceModal 
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            // Devolver el foco al elemento que abrió el modal
            setTimeout(() => returnFocusRef.current?.focus(), 100);
          }}
          type={modalType}
          category={selectedCategory}
        />
      </div>
    </section>
  );
};

export default ServicesSection;