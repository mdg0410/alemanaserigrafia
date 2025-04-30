import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faBox, 
  faGraduationCap, 
  faChartLine,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal = ({ isOpen, onClose }: LearnMoreModalProps) => {
  const services = [
    {
      icon: faBox,
      title: "Distribución de Tintas y Materiales",
      description: "Ofrecemos una amplia gama de productos de marcas líderes a nivel mundial, seleccionados cuidadosamente para garantizar los más altos estándares de calidad."
    },
    {
      icon: faGraduationCap,
      title: "Programas de Capacitación",
      description: "Nuestros cursos y talleres especializados están diseñados para mejorar las habilidades técnicas de los profesionales de la serigrafía."
    },
    {
      icon: faHandshake,
      title: "Asesoramiento Técnico Personalizado",
      description: "Brindamos consultoría especializada para optimizar los procesos de impresión y la selección de insumos adecuados para cada proyecto."
    },
    {
      icon: faChartLine,
      title: "Desarrollo del Sector Textil",
      description: "Trabajamos para ser un referente en la industria, promoviendo prácticas sostenibles y eficientes que contribuyan al crecimiento del sector textil en Ecuador."
    }
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      y: 50,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      y: 50,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b p-6">
              <h3 className="text-2xl font-bold text-primary">Sobre Alemana de Serigrafía</h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-primary mb-4">Desde 1992 impulsando la serigrafía ecuatoriana</h4>
                <p className="text-gray-600 mb-4">
                  Desde nuestros inicios, en Alemana de Serigrafía hemos sido impulsores del avance técnico en la serigrafía 
                  ecuatoriana. A lo largo de más de tres décadas, hemos evolucionado para ofrecer soluciones integrales 
                  que satisfacen las necesidades de serigrafistas profesionales y aficionados.
                </p>
                <p className="text-gray-600">
                  Nuestro objetivo es ser un referente en la industria, promoviendo prácticas sostenibles y eficientes 
                  que contribuyan al crecimiento del sector textil en Ecuador. Creemos en construir relaciones duraderas 
                  basadas en la confianza, la transparencia y el apoyo mutuo.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-primary mb-6">Nuestra Oferta</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl text-primary">
                          <FontAwesomeIcon icon={service.icon} />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800">{service.title}</h5>
                          <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-primary mb-4">Compromiso con la industria</h4>
                <p className="text-gray-600">
                  En Alemana de Serigrafía, nos comprometemos a ofrecer productos y servicios que impulsen 
                  la innovación y el crecimiento en el sector serigráfico ecuatoriano. Nuestra pasión por 
                  la excelencia nos motiva a seguir evolucionando y mejorando constantemente para satisfacer 
                  las necesidades cambiantes de la industria.
                </p>
              </div>
            </div>
            
            <div className="border-t p-6 flex justify-end">
              <button
                onClick={onClose}
                className="btn-primary px-6 py-2"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LearnMoreModal;