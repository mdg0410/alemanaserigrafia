import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Product {
  name: string;
  description: string;
  image: string;
  brand: string;
}

interface Service {
  name: string;
  description: string;
  image: string;
  details: string[];
}

interface ProductServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'products' | 'services';
  category?: string;
}

const products: { [key: string]: Product[] } = {
  'Tintas': [
    {
      name: 'Tintas Textiles',
      description: 'Tintas de alta calidad para serigrafía textil',
      image: '/src/assets/Avient.png',
      brand: 'Avient'
    },
    {
      name: 'Tintas para Plásticos',
      description: 'Especiales para impresión en materiales sintéticos',
      image: '/src/assets/Printop.png',
      brand: 'Printop'
    },
  ],
  'Emulsiones': [
    {
      name: 'Emulsiones Fotográficas',
      description: 'Emulsiones de alta resistencia',
      image: '/src/assets/Ulano.png',
      brand: 'Ulano'
    },
    {
      name: 'Emulsiones Textiles',
      description: 'Especiales para estampado en tela',
      image: '/src/assets/Kiwo.png',
      brand: 'Kiwo'
    },
  ],
  'Equipos': [
    {
      name: 'Pulpos de Serigrafía',
      description: 'Equipos profesionales para talleres',
      image: '/src/assets/Architex.png',
      brand: 'Architex'
    },
    {
      name: 'Secadoras Textiles',
      description: 'Para curado de tintas textiles',
      image: '/src/assets/Alcoplast.png',
      brand: 'Alcoplast'
    }
  ]
};

const services: { [key: string]: Service[] } = {
  'Serigrafía Textil': [
    {
      name: 'Impresión en Prendas',
      description: 'Servicio profesional de impresión en todo tipo de telas',
      image: '/public/images/service-textile.jpg',
      details: [
        'Alta durabilidad',
        'Colores vibrantes',
        'Múltiples técnicas disponibles'
      ]
    },
    {
      name: 'Estampado Especial',
      description: 'Técnicas avanzadas como puff, glitter y foil',
      image: '/public/images/service-special.jpg',
      details: [
        'Efectos especiales',
        'Acabados premium',
        'Ideal para diseños llamativos'
      ]
    }
  ],
  'Diseño Gráfico': [
    {
      name: 'Diseño de Logos',
      description: 'Creación de logos para tu marca',
      image: '/public/images/service-logo.jpg',
      details: [
        'Diseños exclusivos',
        'Preparados para serigrafía',
        'Incluye manual de identidad básico'
      ]
    },
    {
      name: 'Adaptación de Diseños',
      description: 'Adecuación de artes para impresión serigráfica',
      image: '/public/images/service-adapt.jpg',
      details: [
        'Separación de colores',
        'Optimización técnica',
        'Asesoría profesional'
      ]
    }
  ],
};

const ProductServiceModal = ({ isOpen, onClose, type, category }: ProductServiceModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Actualizar la categoría seleccionada si cambia la prop
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // Manejar cierre con la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Enfocar el botón de cierre cuando se abre el modal
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
    
    // Prevenir scroll cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Atrapar el foco dentro del modal (trampa de foco)
  useEffect(() => {
    if (!isOpen) return;
    
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    modalElement.addEventListener('keydown', handleTabKey);
    return () => {
      modalElement.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  const categories = type === 'products' 
    ? Object.keys(products)
    : Object.keys(services);

  const items = selectedCategory 
    ? (type === 'products' ? products[selectedCategory] : services[selectedCategory]) 
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-[#4B0082]/95 to-black/95 p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 
                id="modal-title"
                className="text-2xl font-bold text-[#DAA520]"
              >
                {type === 'products' ? 'Nuestros Productos' : 'Nuestros Servicios'}
              </h2>
              <button 
                ref={closeButtonRef}
                onClick={onClose}
                className="text-white hover:text-[#DAA520] transition-colors w-10 h-10 rounded-full
                  flex items-center justify-center hover:bg-white/10 focus:outline-none 
                  focus:ring-2 focus:ring-secondary focus:ring-offset-1 focus:ring-offset-[#4B0082]/50"
                aria-label="Cerrar ventana"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-4 mb-8" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#4B0082]/50
                    ${selectedCategory === cat
                      ? 'bg-[#DAA520] text-white focus:ring-white'
                      : 'bg-white/10 text-white hover:bg-[#DAA520]/20 focus:ring-[#DAA520]'
                    }`}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  aria-controls={`panel-${cat}`}
                  id={`tab-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {selectedCategory && (
              <div 
                id={`panel-${selectedCategory}`}
                role="tabpanel"
                aria-labelledby={`tab-${selectedCategory}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all 
                      duration-300 border border-white/10 hover:border-secondary/30 
                      focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary"
                    tabIndex={0}
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={`Imagen de ${item.name}`}
                        className="w-full h-48 object-contain rounded-lg mb-4 bg-white/5 p-2"
                        onError={(e) => {
                          // Imagen de respaldo si falla la carga
                          e.currentTarget.src = '/public/images/image-placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <h3 className="text-[#DAA520] font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-white/80 mb-2">{item.description}</p>
                    
                    {'brand' in item && (
                      <p className="text-[#DAA520]/80 text-sm">Marca: {item.brand}</p>
                    )}
                    
                    {'details' in item && (
                      <ul className="list-disc list-inside text-white/80 text-sm mt-2">
                        {item.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductServiceModal;