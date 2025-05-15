import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TecnicosImg from '../assets/About/Tecnicos.png';
import CursoImg from '../assets/About/Curso.png';
import SerigrafiaImg from '../assets/About/Serigrafia.png';
import ProfesionalImg from '../assets/About/Profesional.png';

const services = [
  {
    title: 'Insumos Técnicos',
    description: 'Productos de alta calidad para serigrafía',
    icon: '🧪',
    type: 'products',
    ariaLabel: 'Insumos Técnicos para Serigrafía',
    image: TecnicosImg,
    items: [
      {
        subtitle: 'Emulsiones y Grabado',
        details: ['Emulsiones fotosensibles', 'Sensibilizadores', 'Emulsionadores', 'Cintas adhesivas', 'Fotolitos'],
        brands: ['Kiwo', 'Ulano']
      },
      {
        subtitle: 'Tintas y Colorantes',
        details: ['Tintas base agua', 'Plastisol', 'Tintas UV', 'Efectos especiales', 'Aditivos especializados'],
        brands: ['Printop', 'Avient', 'Alcoplast', 'Architexminerva']
      },
      {
        subtitle: 'Limpieza y Recuperación',
        details: ['Desengrasantes', 'Removedores de tinta', 'Recuperadores de emulsión', 'Eliminadores de imágenes fantasma'],
        brands: ['Albachem', 'Kiwo']
      }
    ]
  },
  {
    title: 'Herramientas y Equipos',
    description: 'Equipamiento profesional para serigrafía',
    icon: '🛠️',
    type: 'products',
    ariaLabel: 'Herramientas y Equipos de Serigrafía',
    image: SerigrafiaImg,
    items: [
      {
        subtitle: 'Pantallas',
        details: ['Marcos de madera y aluminio', 'Mallas de poliéster', 'Servicio de cambio de malla'],
        brands: []
      },
      {
        subtitle: 'Impresión y Soporte',
        details: ['Racletas de poliuretano', 'Espátulas', 'Bisagras', 'Pulpos manuales', 'Mesas lineales'],
        brands: []
      },
      {
        subtitle: 'Consumibles',
        details: ['Papel film', 'Guantes', 'Ropa de trabajo', 'Adhesivos para paletas'],
        brands: []
      }
    ]
  },
  {
    title: 'Servicios Técnicos',
    description: 'Soluciones profesionales para tu taller',
    icon: '⚙️',
    type: 'services',
    ariaLabel: 'Servicios Técnicos de Serigrafía',
    image: ProfesionalImg,
    items: [
      {
        subtitle: 'Impresión y Preprensa',
        details: ['Impresión de fotolitos', 'Corte de vinil', 'Impresión DTF'],
        brands: []
      },
      {
        subtitle: 'Servicios de Pantalla',
        details: ['Tensado neumático', 'Recuperación de marcos', 'Emulsionado y fotograbado'],
        brands: []
      },
      {
        subtitle: 'Colorimetría',
        details: ['Preparación de colores Pantone', 'Asesoría técnica de tintas'],
        brands: []
      }
    ]
  },
  {
    title: 'Asesoría y Capacitación',
    description: 'Formación especializada en serigrafía',
    icon: '📚',
    type: 'services',
    ariaLabel: 'Asesoría y Capacitación en Serigrafía',
    image: CursoImg,
    items: [
      {
        subtitle: 'Capacitación Técnica',
        details: ['Cursos prácticos presenciales', 'Cursos online', 'Talleres especializados'],
        brands: []
      },
      {
        subtitle: 'Asesoramiento',
        details: ['Consultoría técnica', 'Evaluación de procesos', 'Recomendaciones de materiales'],
        brands: []
      }
    ]
  }
];

const Modal = ({ isOpen, onClose, content, returnFocusRef }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-dark-soft to-primary-dark/90 p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-secondary">{content.title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {content.items.map((item, index) => (
            <div key={index} className="border-b border-secondary/20 pb-4 last:border-0">
              <h4 className="text-xl font-semibold text-white mb-3">{item.subtitle}</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {item.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              {item.brands && item.brands.length > 0 && (
                <div className="mt-3">
                  <p className="text-secondary font-medium">Marcas destacadas:</p>
                  <p className="text-gray-300">{item.brands.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const returnFocusRef = useRef<HTMLDivElement | null>(null);

  const handleServiceClick = (service, ref: React.RefObject<HTMLDivElement>) => {
    setSelectedService(service);
    setModalOpen(true);
    returnFocusRef.current = ref.current;
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (returnFocusRef.current) {
      returnFocusRef.current.focus();
    }
  };

  return (
    <section 
      id="services" 
      className="relative py-20 overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Fondo decorativo con gradientes animados */}
      <div className="absolute inset-0 bg-dark-soft">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_110%,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_80%_-20%,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-soft/90 via-primary/20 to-dark-soft" />
      </div>

      <div className="container-custom relative z-10">
        <motion.h2 
          id="services-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-8 md:mb-12"
        >
          Productos y Servicios
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <div className="bg-gradient-to-br from-primary/20 via-dark-soft/60 to-primary/20 backdrop-blur-sm 
            rounded-xl p-6 border border-secondary/20 shadow-lg hover:shadow-secondary/10 transition-shadow
            hover:border-secondary/30">
            <h3 className="text-xl sm:text-2xl font-semibold text-secondary mb-4">
              Todo lo que necesitas para serigrafía en un solo lugar
            </h3>
            <div className="text-gray-300 space-y-4">
              <p className="leading-relaxed">
                Ofrecemos una amplia gama de productos indispensables para tu taller: 
                <span className="text-white font-medium"> emulsiones fotosensibles, tintas textiles, 
                tintas base agua, productos de limpieza, marcos, mallas </span> 
                y todo el equipo necesario para serigrafía profesional.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏪</span>
                  <p className="text-sm">Pedidos pequeños</p>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏬</span>
                  <p className="text-sm">Medianos</p>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏭</span>
                  <p className="text-sm">Industriales</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-yellow-500/90 font-medium">
                Nota: Por el momento no realizamos envíos. Solo venta presencial.
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => {
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
                className="relative overflow-hidden bg-gradient-to-br from-primary/30 via-dark-soft/80 to-primary/20 
                  backdrop-blur-sm rounded-xl cursor-pointer group transform transition-all duration-300
                  hover:shadow-lg hover:shadow-secondary/20 border border-secondary/20 hover:border-secondary/40"
                onClick={() => handleServiceClick(service, cardRef)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleServiceClick(service, cardRef);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={service.ariaLabel}
                aria-haspopup="dialog"
              >
                {/* Imagen de fondo con overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={service.image}
                    alt=""
                    className="w-full h-full object-cover object-center transition-transform duration-500 
                      group-hover:scale-110 opacity-20 group-hover:opacity-30"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-soft/90 via-primary/20 to-transparent" />
                  
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                    bg-gradient-to-r from-transparent via-secondary to-transparent blur-2xl" />
                </div>

                {/* Contenido */}
                <div className="relative z-10 p-6">
                  <div 
                    className="text-4xl sm:text-5xl mb-4 transform transition-transform 
                      group-hover:scale-110 group-hover:rotate-12"
                    aria-hidden="true"
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-3 
                    group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white/90 transition-colors">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center text-secondary 
                    group-hover:text-white transition-colors">
                    <span>Ver detalles</span>
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && selectedService && (
          <Modal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            content={selectedService}
            returnFocusRef={returnFocusRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;