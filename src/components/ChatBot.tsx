import { useState, lazy, Suspense, useEffect } from 'react';
import LogoAlemana from '../assets/LogoAlemana.svg';

// Importación lazy para mejorar el rendimiento
const ChatWindow = lazy(() => import('./ChatWindow'));

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  // Manejar el cierre con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleChat = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsAnimating(false), 300); // Duración de la animación
    } else {
      setIsOpen(true);
      setIsLoaded(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      role="region"
      aria-label="Asistente virtual de chat"
    >
      {/* Agregar una etiqueta visible al enfocar para mejorar accesibilidad */}
      {hasFocus && !isOpen && (
        <div 
          className="absolute bottom-16 right-0 bg-black/80 text-white py-2 px-4 rounded-lg text-sm
            animate-fadeIn whitespace-nowrap"
          role="tooltip"
        >
          Abrir chat de asistencia
        </div>
      )}

      {isOpen && isLoaded && (
        <div 
          className="absolute bottom-16 right-0 w-[320px] h-[480px] rounded-2xl overflow-hidden 
            shadow-elevated transform-gpu animate-slideUp"
          aria-live="polite"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/90 to-dark-soft/90 backdrop-blur-md">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={LogoAlemana}
                  alt=""
                  className="w-16 h-16 animate-pulse"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(218, 165, 32, 0.3))' }}
                  aria-hidden="true"
                />
                <p className="text-secondary font-medium" aria-live="polite">Cargando chat...</p>
              </div>
            </div>
          }>
            <ChatWindow onClose={() => setIsOpen(false)} />
          </Suspense>
        </div>
      )}
      
      <button
        onClick={toggleChat}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full 
          shadow-elevated transition-all duration-300 transform hover:scale-110 
          focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-dark
          ${isOpen 
            ? 'bg-gradient-to-br from-red-600/90 to-red-700/90 hover:from-red-700/90 hover:to-red-800/90' 
            : 'bg-gradient-to-br from-primary to-secondary hover:from-primary-light hover:to-secondary-light'
          }`}
        aria-label={isOpen ? 'Cerrar chat de asistencia' : 'Abrir chat de asistencia'}
        aria-expanded={isOpen}
        aria-controls="chat-window"
        disabled={isAnimating}
      >
        <div className={`absolute inset-[2px] rounded-full bg-gradient-to-br transition-opacity duration-300
          ${isOpen 
            ? 'from-red-600 to-red-700 opacity-80' 
            : 'from-primary to-secondary opacity-90'
          }`}>
          <img 
            src={LogoAlemana}
            alt=""
            className={`w-full h-full p-2.5 transition-all duration-300 ${
              isOpen ? 'rotate-90 scale-90' : 'rotate-0 scale-100'
            }`}
            style={{ filter: 'brightness(0) invert(1)' }}
            aria-hidden="true"
          />
        </div>
        {!isOpen && (
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse ring-2 ring-dark"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};

export default ChatBot;