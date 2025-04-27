import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTshirt, 
  faPaintBrush, 
  faIndustry, 
  faPalette 
} from '@fortawesome/free-solid-svg-icons';

const ServicesSection = () => {
  const services = [
    {
      title: "Serigrafía Textil",
      description: "Impresión de alta calidad en todo tipo de prendas: camisetas, sudaderas, gorras y más.",
      icon: faTshirt,
      bgColor: "from-purple-600 to-pink-500"
    },
    {
      title: "Serigrafía Publicitaria",
      description: "Materiales promocionales, banners, carteles y señalización para tu negocio.",
      icon: faPaintBrush,
      bgColor: "from-blue-600 to-cyan-500"
    },
    {
      title: "Serigrafía Industrial",
      description: "Soluciones para etiquetado industrial, placas y componentes técnicos.",
      icon: faIndustry,
      bgColor: "from-orange-600 to-yellow-500"
    },
    {
      title: "Serigrafía Artística",
      description: "Reproducción de obras de arte y diseños personalizados en diversos materiales.",
      icon: faPalette,
      bgColor: "from-green-600 to-emerald-500"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section id="services" className="section bg-gradient-to-b from-dark to-primary text-light py-20">
      <motion.div
        className="container-custom"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ofrecemos soluciones profesionales de serigrafía para todas tus necesidades
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-xl bg-dark/30 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-10`} />
              <div className="p-8 relative z-10">
                <div className="text-4xl mb-6 text-secondary">
                  <FontAwesomeIcon icon={service.icon} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-secondary">
                  {service.title}
                </h3>
                <p className="text-gray-300">
                  {service.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-2 bg-secondary text-dark rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
                >
                  Más información
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="#contact" 
            className="inline-block px-8 py-3 bg-secondary text-dark rounded-lg font-bold hover:bg-secondary/90 transition-colors"
          >
            Solicitar Cotización
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;