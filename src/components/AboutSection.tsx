import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLightbulb, 
  faHandshake,
  faUsers,
  faAward,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const AboutSection = () => {
  const values = [
    {
      title: "Calidad",
      description: "Utilizamos tecnología de vanguardia y materiales premium para garantizar resultados excepcionales.",
      icon: faStar,
      color: "text-yellow-500"
    },
    {
      title: "Innovación",
      description: "Constantemente actualizamos nuestros procesos y técnicas para ofrecer soluciones modernas.",
      icon: faLightbulb,
      color: "text-blue-500"
    },
    {
      title: "Compromiso",
      description: "Nos dedicamos a cumplir con los plazos y superar las expectativas de nuestros clientes.",
      icon: faHandshake,
      color: "text-green-500"
    }
  ];

  const stats = [
    { value: "12+", label: "Años de Experiencia", icon: faClock },
    { value: "1000+", label: "Clientes Satisfechos", icon: faUsers },
    { value: "50+", label: "Premios Ganados", icon: faAward }
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
              Desde 2010, Alemana Print ha sido sinónimo de excelencia en serigrafía. 
              Comenzamos como un pequeño taller familiar y hemos crecido hasta convertirnos 
              en un referente en la industria, manteniendo siempre nuestro compromiso con 
              la calidad y la atención personalizada.
            </motion.p>
            <motion.p 
              className="text-lg text-gray-600"
              variants={itemVariants}
            >
              Nuestro equipo de expertos combina técnicas tradicionales con tecnología moderna 
              para crear productos excepcionales que destacan en el mercado.
            </motion.p>
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <motion.a
                href="#contact"
                className="inline-block btn-primary px-8 py-3 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Conoce más
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Valores */}
          <motion.div 
            className="grid gap-6"
            variants={containerVariants}
          >
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
      </motion.div>

      {/* Decoración de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutSection;