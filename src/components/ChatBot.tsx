import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useChat } from '../hooks/useChat';
import { chatConfig } from '../config/chatStyles';
import { validateEcuadorianId, formatPhoneNumber } from '../utils/ecuadorianIdValidator';
import { UserInfo } from '../types/chat';
import LogoAlemana from '../assets/LogoAlemana.svg';

// Componente del formulario
const UserForm: React.FC<{
  onSubmit: (userInfo: UserInfo) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: !formData.name ? 'El nombre es requerido' : '',
      id: !validateEcuadorianId(formData.id) ? 'Cédula inválida' : '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Email inválido' : '',
      phone: !/^\d{10}$/.test(formData.phone.replace(/\D/g, '')) ? 'Teléfono inválido' : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        phone: formatPhoneNumber(formData.phone),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`${chatConfig.components.input} w-full`}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Cédula"
          value={formData.id}
          onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
          className={`${chatConfig.components.input} w-full`}
        />
        {errors.id && <span className="text-red-500 text-sm">{errors.id}</span>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`${chatConfig.components.input} w-full`}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className={`${chatConfig.components.input} w-full`}
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#4B0082] to-[#DAA520] text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Iniciar chat
      </button>
    </form>
  );
};

// Componente de mensaje
const ChatMessage: React.FC<{
  role: 'assistant' | 'user' | 'system';
  content: string;
}> = ({ role, content }) => {
  const isBot = role === 'assistant';
  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          isBot
            ? `${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border}`
            : chatConfig.colors.message.user.bg
        } text-white`}
      >
        {content}
      </div>
    </div>
  );
};

// Componente principal del chat
const ChatBot: React.FC = () => {
  const { state, sendMessage, setUserInfo, toggleChat, resetChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  useEffect(() => {
    if (state.isOpen && !state.isFormCompleted) {
      sendMessage('¡Bienvenido al asistente técnico de Alemana Serigrafía! Por favor, completa el siguiente formulario para poder ayudarte mejor.');
    }
  }, [state.isOpen, state.isFormCompleted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const chatWindowClass = isMobile
    ? 'fixed inset-0 z-50'
    : `${chatConfig.layout.container} ${chatConfig.layout.chatWindow}`;

  return (
    <>
      <button
        onClick={toggleChat}
        className={`${chatConfig.components.button.base} ${
          state.isOpen
            ? chatConfig.components.button.gradient.open
            : chatConfig.components.button.gradient.closed
        } ${chatConfig.layout.container}`}
      >
        {state.isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <img src={LogoAlemana} alt="Chat" className="w-8 h-8" />
        )}
      </button>

      <CSSTransition
        in={state.isOpen}
        timeout={300}
        classNames="chat"
        unmountOnExit
      >
        <div className={`${chatWindowClass} bg-gradient-to-b ${chatConfig.colors.background} flex flex-col`}>
          <div className="flex justify-between items-center p-4 border-b border-purple-700/30">
            <h3 className="text-white font-semibold">Asistente Técnico</h3>
            {isMobile && (
              <button
                onClick={toggleChat}
                className="text-white text-2xl"
              >
                ×
              </button>
            )}
          </div>

          <div className={chatConfig.layout.messages}>
            {!state.isFormCompleted ? (
              <UserForm onSubmit={setUserInfo} />
            ) : (
              <>
                {state.messages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
                {state.isTyping && (
                  <div className={`${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border} p-3 rounded-lg inline-block`}>
                    <div className="flex space-x-2">
                      <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {state.isFormCompleted && !state.requestSolved && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-purple-700/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className={chatConfig.components.input}
                  disabled={state.isTyping}
                />
                <button
                  type="submit"
                  disabled={state.isTyping || !input.trim()}
                  className="px-4 py-2 bg-[#DAA520] text-white rounded-lg disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </form>
          )}

          {state.requestSolved && (
            <div className="p-4 border-t border-purple-700/30">
              <button
                onClick={() => {
                  // Aquí puedes implementar la lógica para WhatsApp
                  window.open('https://wa.me/+593XXXXXXXX', '_blank');
                }}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Cotizar con un asesor
              </button>
            </div>
          )}
        </div>
      </CSSTransition>

      <style jsx>{`
        .chat-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .chat-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .chat-exit {
          opacity: 1;
          transform: scale(1);
        }
        .chat-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </>
  );
};

export default ChatBot;