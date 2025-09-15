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

      <div className="container-custom py-16">
        {/* Bloque principal: Direcciones | Horarios | Síguenos */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-12">
          
          {/* Direcciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-secondary mb-6">Direcciones</h3>
            
            {/* Matriz */}
            <div className="mb-4">
              <p className="font-semibold text-yellow-400 mb-2">Matriz</p>
              <p className="flex items-start gap-3 text-sm leading-relaxed">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mt-1" />
                <span>Av. Eloy Alfaro, Quito 170144</span>
              </p>
            </div>
            
            {/* Sucursal Sur */}
            <div className="mb-4">
              <p className="font-semibold text-yellow-400 mb-2">Sucursal Sur</p>
              <p className="flex items-start gap-3 text-sm leading-relaxed">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary mt-1" />
                <span>C.C. El Dorado Plaza, Av. Pedro Vicente Maldonado S28-195, Quito 170131</span>
              </p>
            </div>
            
            {/* Contacto */}
            <div className="space-y-3 pt-2">
              <p className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faPhone} className="text-secondary" />
                <span>+593 96 867 6893 / +593 98 611 2559</span>
              </p>
              <p className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
                <span>ventas1@inkgraph.net</span>
              </p>
            </div>
          </motion.div>

          {/* Horarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-secondary mb-6">Horarios</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center py-1">
                <span>Lunes - Viernes:</span>
                <span className="text-yellow-400 font-semibold">8:00 - 17:30</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Sábado:</span>
                <span className="text-yellow-400 font-semibold">9:00 - 13:00</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Domingo:</span>
                <span className="text-red-400 font-semibold">Cerrado</span>
              </li>
            </ul>
          </motion.div>

          {/* Síguenos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 animate-pulse">Síguenos</h3>
            <div className="flex gap-5 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-yellow-400 hover:text-dark transition-all duration-300 shadow-lg border-2 border-yellow-400 text-white"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} size="lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enlaces rápidos horizontales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Enlaces rápidos */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {quickLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="hover:text-yellow-400 transition-colors font-semibold px-3 py-1 rounded-md hover:bg-yellow-400/10"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right text-sm text-white/70">
              <p>© {new Date().getFullYear()} Alemana de Serigrafía. Todos los derechos reservados.</p>
              <p className="mt-1">Desarrollado por <a href="https://mdg.studio" className="text-secondary hover:underline">mdg.studio</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;