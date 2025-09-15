import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import LogoAlemana from '../assets/LogoAlemana.svg';

const ChatBot: React.FC = () => {
  // Número de WhatsApp (puedes cambiarlo más tarde)
  const WHATSAPP_NUMBER = '593968676893';
  
  // Mensaje predefinido que empieza con "Hola"
  const PREDEFINED_MESSAGE = 'Hola, estoy interesado en los productos y servicios de Alemana Serigrafía. ¿Podrían darme más información?';

  // Estados para el texto flotante
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  // Mensajes dinámicos que aparecerán
  const floatingMessages = [
    "💬 ¡Pregúntanos sobre serigrafía!",
    "🛒 ¿Necesitas materiales?",
    "🎨 ¡Cotiza tu proyecto!",
    "📞 ¡Estamos aquí para ayudarte!",
    "✨ ¡Consulta nuestros productos!",
    "🚀 ¡Hablemos de tu idea!"
  ];

  const redirectToWhatsApp = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    const encodedMsg = encodeURIComponent(PREDEFINED_MESSAGE);
    const whatsappUrl = isMobile
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`
      : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;
    
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const showMessage = () => {
      setShowFloatingText(true);
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowFloatingText(false);
      }, 5000);
      
      // Cambiar al siguiente mensaje
      setMessageIndex((prev) => (prev + 1) % floatingMessages.length);
    };

    // Mostrar el primer mensaje después de 10 segundos de carga
    const initialTimer = setTimeout(showMessage, 5000);

    // Luego mostrar cada 2 minutos (120000 ms)
    const intervalTimer = setInterval(showMessage, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Texto flotante */}
      {showFloatingText && (
        <div className="floating-message absolute bottom-20 right-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg border-2 border-purple-300 min-w-max max-w-xs">
          <div className="relative text-center">
            {floatingMessages[messageIndex]}
            {/* Flecha hacia abajo */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-300"></div>
          </div>
        </div>
      )}
      
      {/* Botón principal */}
      <button
        onClick={redirectToWhatsApp}
        className="whatsapp-button w-16 h-16 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-2 border-white"
        aria-label="Contactar por WhatsApp"
      >
        <img 
          src={LogoAlemana} 
          alt="Contacto WhatsApp" 
          className="w-10 h-10 drop-shadow-lg"
        />
      </button>
    </div>
  );
};

export default ChatBot;