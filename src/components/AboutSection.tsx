import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLightbulb, 
  faHandshake,
  faUsers,
  faAward,
  faClock,
  faBalanceScale,
  faHeart,
  faCheckCircle,
  faShieldAlt,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import LearnMoreModal from './LearnMoreModal';

const AboutSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const values = [
    {
      title: "Calidad",
      description: "Seleccionamos cuidadosamente insumos y tintas de marcas reconocidas a nivel mundial, asegurando los más altos estándares internacionales.",
      icon: faShieldAlt,
      color: "text-blue-500"
    },
    {
      title: "Innovación",
      description: "Introducimos técnicas avanzadas y materiales de última generación en el mercado ecuatoriano para optimizar los procesos de serigrafía.",
      icon: faLightbulb,
      color: "text-yellow-500"
    },
    {
      title: "Compromiso",
      description: "Buscamos ser aliados estratégicos en el crecimiento de la industria serigráfica ecuatoriana con asesoramiento técnico personalizado.",
      icon: faHandshake,
      color: "text-green-500"
    },
    {
      title: "Honestidad",
      description: "Actuamos con transparencia y sinceridad en todas nuestras relaciones comerciales.",
      icon: faBalanceScale,
      color: "text-red-500"
    }
  ];

  const stats = [
    { value: "33+", label: "Años de Experiencia", icon: faClock },
    { value: "2000+", label: "Clientes Satisfechos", icon: faUsers },
    { value: "100+", label: "Cursos y Capacitaciones", icon: faAward }
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section id="about" className="section bg-gradient-to-b from-light to-gray-100">
      <motion.div 
        className="container-custom py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Estadísticas */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl text-primary mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <FontAwesomeIcon icon={stat.icon} />
              </motion.div>
              <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Historia */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-primary mb-6"
              variants={itemVariants}
            >
              Nuestra Historia
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600"
              variants={itemVariants}
            >
              Alemana de Serigrafía fue fundada en 1992 por Raúl Trujillo con la visión de modernizar la serigrafía 
              en Ecuador. Desde entonces, hemos sido pioneros en la introducción de nuevas técnicas y materiales, 
              contribuyendo significativamente al desarrollo del sector.
            </motion.p>
            <motion.p 
              className="text-lg text-gray-600"
              variants={itemVariants}
            >
              En 2017, adoptamos la razón social Inkgraph S.C.C., manteniendo nuestro nombre comercial. 
              Con más de tres décadas de experiencia, seguimos comprometidos con la excelencia y la 
              innovación en cada aspecto de nuestro negocio.
            </motion.p>
            
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-primary mt-8 mb-4"
              variants={itemVariants}
            >
              Nuestro Compromiso
            </motion.h3>
            <motion.p 
              className="text-lg text-gray-600"
              variants={itemVariants}
            >
              Nuestro compromiso va más allá de la comercialización de insumos; buscamos ser 
              aliados estratégicos en el crecimiento de la industria serigráfica ecuatoriana. 
              Ofrecemos asesoramiento técnico personalizado, programas de formación continua 
              y un servicio al cliente enfocado en la satisfacción total.
            </motion.p>
            
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="inline-block btn-primary px-8 py-3 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Conocer Más
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Valores */}
          <motion.div 
            className="grid gap-5"
            variants={containerVariants}
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
              variants={itemVariants}
            >
              Nuestros Valores
            </motion.h3>
            {values.map((value, index) => (
              <motion.div 
                key={value.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-4xl ${value.color}`}>
                    <FontAwesomeIcon icon={value.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Nuestros Servicios */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl font-bold text-primary text-center mb-12"
            variants={itemVariants}
          >
            Nuestros Servicios
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl text-primary mb-4">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Distribución de Productos</h3>
              <p className="text-gray-600">
                Ofrecemos tintas y materiales de serigrafía de marcas líderes a nivel mundial.
              </p>
            </motion.div>
            
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl text-primary mb-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Cursos y Talleres</h3>
              <p className="text-gray-600">
                Programas de capacitación y talleres especializados para mejorar las habilidades técnicas.
              </p>
            </motion.div>
            
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl text-primary mb-4">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Asesoramiento</h3>
              <p className="text-gray-600">
                Asesoramiento técnico personalizado para optimizar procesos de impresión.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal de Conocer Más */}
      <LearnMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Decoración de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutSection;