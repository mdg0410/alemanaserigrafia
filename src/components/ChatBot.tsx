import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
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
    <form onSubmit={handleSubmit} className={chatConfig.components.form.container}>
      <div className={chatConfig.components.form.field}>
        <label className={chatConfig.components.form.label}>Nombre completo</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus}`}
          placeholder="Ej: Juan Pérez"
        />
        {errors.name && <span className={chatConfig.components.form.error}>{errors.name}</span>}
      </div>
      <div className={chatConfig.components.form.field}>
        <label className={chatConfig.components.form.label}>Cédula</label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
          className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus}`}
          placeholder="Ej: 1234567890"
        />
        {errors.id && <span className={chatConfig.components.form.error}>{errors.id}</span>}
      </div>
      <div className={chatConfig.components.form.field}>
        <label className={chatConfig.components.form.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus}`}
          placeholder="ejemplo@correo.com"
        />
        {errors.email && <span className={chatConfig.components.form.error}>{errors.email}</span>}
      </div>
      <div className={chatConfig.components.form.field}>
        <label className={chatConfig.components.form.label}>Teléfono</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus}`}
          placeholder="Ej: 0991234567"
        />
        {errors.phone && <span className={chatConfig.components.form.error}>{errors.phone}</span>}
      </div>
      <button
        type="submit"
        className={chatConfig.components.form.submit}
      >
        Iniciar chat
      </button>
    </form>
  );
};

const ChatBot: React.FC = () => {
  const { state, sendMessage, setUserInfo, toggleChat } = useChat();
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
    ? chatConfig.layout.chatWindow.mobile
    : chatConfig.layout.chatWindow.desktop;

  return (
    <div className={chatConfig.layout.wrapper}>
      <div className={chatConfig.layout.container}>
        <div className={chatConfig.layout.chatButton.wrapper}>
          <button
            onClick={toggleChat}
            className={`${chatConfig.components.button.base} ${chatConfig.layout.chatButton.dimensions} ${
              state.isOpen
                ? chatConfig.components.button.gradient.open
                : chatConfig.components.button.gradient.closed
            }`}
          >
            {state.isOpen ? (
              <span className="text-2xl text-white">×</span>
            ) : (
              <img src={LogoAlemana} alt="Chat" className="w-8 h-8" />
            )}
          </button>
        </div>

        <CSSTransition
          in={state.isOpen}
          timeout={300}
          classNames={chatConfig.animations.chat}
          unmountOnExit
        >
          <div className={`${chatWindowClass} bg-gradient-to-b ${chatConfig.colors.background} backdrop-blur-md flex flex-col shadow-xl ring-1 ring-white/10`}>
            {/* Header */}
            <div className={chatConfig.layout.header}>
              <h3 className="text-white font-semibold">Asistente Técnico</h3>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className={chatConfig.layout.messages}>
              {!state.isFormCompleted ? (
                <UserForm onSubmit={setUserInfo} />
              ) : (
                <>
                  {state.messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`${chatConfig.components.message.container} ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`${chatConfig.components.message.content} ${
                          msg.role === 'user' 
                            ? `${chatConfig.colors.message.user.bg} ${chatConfig.colors.message.user.text}`
                            : `${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border} text-white`
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {state.isTyping && (
                    <div className={chatConfig.components.message.container}>
                      <div className={`${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border} p-3 rounded-lg`}>
                        <div className="flex space-x-2">
                          <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${chatConfig.colors.text.accent} ${chatConfig.animations.bounce}`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Footer */}
            {state.isFormCompleted && !state.requestSolved && (
              <div className={chatConfig.layout.footer}>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus}`}
                    disabled={state.isTyping}
                  />
                  <button
                    type="submit"
                    disabled={state.isTyping || !input.trim()}
                    className="px-6 py-2 bg-[#DAA520] text-white rounded-lg disabled:opacity-50 hover:bg-[#B8860B] transition-colors shadow-md"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}

            {state.requestSolved && (
              <div className={chatConfig.layout.footer}>
                <button
                  onClick={() => window.open('https://wa.me/+593XXXXXXXX', '_blank')}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Cotizar con un asesor</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </CSSTransition>      </div>
    </div>
  );
};

export default ChatBot;