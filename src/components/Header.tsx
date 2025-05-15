import { useState, useEffect } from 'react';
import NombreAlemana from '../assets/NombreAlemana.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejar cierre del menú con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled ? 'bg-black/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'}`}
      role="banner"
    >
      {/* Skip to content link para accesibilidad */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <nav className="container mx-auto px-6" aria-label="Navegación principal">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <a href="#hero" aria-label="Inicio - Alemana de Serigrafía">
              <img 
                src={NombreAlemana} 
                alt="Alemana de Serigrafía" 
                className={`transition-all duration-500 object-contain
                  ${isScrolled ? 'h-16' : 'h-24'}`}
                style={{
                  minWidth: '240px',
                  maxWidth: '320px',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(218, 165, 32, 0.3))'
                }}
              />
            </a>
          </div>          {/* Menú de navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#hero">Inicio</NavLink>
            <NavLink href="#about">Nosotros</NavLink>
            <NavLink href="#services">Servicios</NavLink>
            <NavLink href="#contact">Contacto</NavLink>
          </div>

          {/* Botón de menú móvil con mayor accesibilidad */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors
              focus:outline-none focus:ring-2 focus:ring-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 
                ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`} />
              <span className={`absolute h-0.5 w-full bg-white top-3 transition-opacity duration-300 
                ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 
                ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`} />
            </div>
          </button>
        </div>

        {/* Menú móvil con mejor accesibilidad */}        <div 
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 overflow-hidden 
            ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 space-y-2">
            <MobileNavLink href="#hero" onClick={() => setIsMenuOpen(false)}>Inicio</MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setIsMenuOpen(false)}>Nosotros</MobileNavLink>
            <MobileNavLink href="#services" onClick={() => setIsMenuOpen(false)}>Servicios</MobileNavLink>
            <MobileNavLink href="#contact" onClick={() => setIsMenuOpen(false)}>Contacto</MobileNavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="text-white hover:text-secondary transition-colors duration-300 text-lg font-medium
      relative after:absolute after:bottom-0 after:left-0 after:bg-secondary 
      after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
  <a 
    href={href}
    onClick={onClick}
    className="block text-white hover:text-secondary transition-colors duration-300 text-lg font-medium
      py-3 px-4 border-l-4 border-transparent hover:border-secondary rounded-r-lg
      hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-secondary"
  >
    {children}
  </a>
);

export default Header;