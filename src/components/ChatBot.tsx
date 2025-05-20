import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { CSSTransition } from 'react-transition-group';
import { useChat } from '../hooks/useChat';
import { chatConfig } from '../config/chatStyles';
import { validateEcuadorianId, formatPhoneNumber } from '../utils/ecuadorianIdValidator';
import { UserInfo } from '../types/chat';
import LogoAlemana from '../assets/LogoAlemana.svg';

// Componente del formulario como mensaje
const UserFormMessage: React.FC<{
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
    <div className={`${chatConfig.components.message.container} justify-start`}>
      <div className={`${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border} p-4 rounded-lg w-full max-w-[90%]`}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-white/90 text-sm mb-1 block">Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus} w-full`}
            />
            {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
          </div>
          <div>
            <label className="text-white/90 text-sm mb-1 block">Cédula</label>
            <input
              type="text"
              value={formData.id}
              onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus} w-full`}
            />
            {errors.id && <span className="text-red-400 text-xs">{errors.id}</span>}
          </div>
          <div>
            <label className="text-white/90 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus} w-full`}
            />
            {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
          </div>
          <div>
            <label className="text-white/90 text-sm mb-1 block">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus} w-full`}
            />
            {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4B0082] to-[#DAA520] text-white py-2 rounded-md hover:opacity-90 transition-opacity mt-4"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

const ChatBot: React.FC = () => {
  const { state, sendMessage, setUserInfo, toggleChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isTyping, state.showForm]);

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

  const renderTypingIndicator = () => (
    <div className={`${chatConfig.components.message.container} justify-start`}>
      <div className={`${chatConfig.colors.message.bot.bg} ${chatConfig.colors.message.bot.border} p-3 rounded-lg`}>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );

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
          nodeRef={nodeRef}
          in={state.isOpen}
          timeout={300}
          classNames={chatConfig.animations.chat}
          unmountOnExit
        >
          <div 
            ref={nodeRef}
            className={`${chatWindowClass} bg-gradient-to-b ${chatConfig.colors.background} backdrop-blur-md flex flex-col shadow-xl ring-1 ring-white/10`}
          >
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

              {!state.isFormCompleted && state.showForm && (
                <UserFormMessage onSubmit={setUserInfo} />
              )}

              {state.isTyping && renderTypingIndicator()}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {state.isFormCompleted && (
              <div className="p-4 border-t border-purple-700/30 bg-gradient-to-b from-transparent to-purple-900/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className={`${chatConfig.components.input.base} ${chatConfig.components.input.focus} flex-1`}
                    disabled={state.requestSolved}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#4B0082] to-[#DAA520] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!input.trim() || state.requestSolved}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default ChatBot;