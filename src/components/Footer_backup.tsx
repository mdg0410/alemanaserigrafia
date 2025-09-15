import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faTiktok, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const socialLinks = [
    { icon: faFacebook, href: 'https://www.facebook.com/alemanadeserigrafia/', label: 'Facebook' },
    { icon: faInstagram, href: 'https://www.instagram.com/alemana_serigrafia/', label: 'Instagram' },
    { icon: faTiktok, href: 'https://www.tiktok.com/@alemana_serigrafia', label: 'TikTok' },
    { icon: faLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre Nosotros', href: '#about' },
    { name: 'Servicios', href: '#services' },
    { name: 'Contacto', href: '#contact' }
  ];

  return (
    <footer className="bg-dark text-light relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="container-custom py-16">
          {/* Información de la empresa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <motion.h3 
              className="text-2xl font-bold text-secondary mb-6"
              whileHover={{ scale: 1.05 }}
            >
              Alemana de Serigrafía
            </motion.h3>
            <div className="space-y-2">
              {/* Matriz */}
              <div className="mb-1">
                <p className="font-semibold text-base text-secondary">Matriz</p>
                <p className="flex items-start gap-2 text-sm">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mt-1" />
                  <span>Av. Eloy Alfaro, Quito 170144</span>
                </p>
              </div>
              {/* Sucursal Sur */}
              <div className="mb-1">
                <p className="font-semibold text-base text-secondary">Sucursal Sur</p>
                <p className="flex items-start gap-2 text-sm">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mt-1" />
                  <span>PF77+53W C.C. El Dorado Plaza, Local, Av. Pedro Vicente Maldonado S28-195 y, Quito 170131</span>
                </p>
              </div>
              {/* Teléfonos */}
              <p className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faPhone} className="text-secondary" />
                <span>+593 96 867 6893 / +593 98 611 2559</span>
              </p>
              {/* Email */}
              <p className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
                <span>ventas1@inkgraph.net</span>
              </p>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          {/* Enlaces rápidos se mostrarán al final del footer */}

          {/* Horario de atención */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-secondary mb-6">
              Horario de Atención
            </h3>            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="text-secondary">8:00 - 17:30</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span className="text-secondary">9:00 - 13:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span className="text-secondary">Cerrado</span>
              </li>
            </ul>
          </motion.div>

          {/* Redes sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-secondary mb-6">
              Síguenos
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center hover:bg-secondary hover:text-dark transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enlaces rápidos en horizontal y copyright */}
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between text-sm text-white/70">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 order-2 md:order-1">
              {quickLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="hover:text-yellow-400 transition-colors font-semibold px-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <span className="order-1 md:order-2">© {new Date().getFullYear()} Alemana de Serigrafía. Todos los derechos reservados.</span>
            <span className="order-3">Desarrollado por <a href="https://mdg.studio" className="text-secondary hover:underline">mdg.studio</a></span>
          </div>
    </div>
  </footer>
  )
}

export default Footer;