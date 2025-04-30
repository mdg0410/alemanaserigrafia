import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ChatService, ChatMessage } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "¡Hola! Soy el asistente virtual de Alemana Print. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatService = ChatService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Enfocar el input cuando se monta el componente
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }, []);

  // Trampa de foco para mantener el foco dentro del chat
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const chatContainer = document.getElementById('chat-window');
        if (!chatContainer) return;

        const focusableElements = chatContainer.querySelectorAll(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage([...messages, userMessage]);
      const botMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde."
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div 
      id="chat-window"
      className="flex flex-col h-full bg-gradient-to-br from-primary/95 to-dark-soft/95 backdrop-blur-md text-white"
      role="dialog"
      aria-label="Ventana de chat con asistente virtual"
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-secondary/20 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-2 bg-secondary rounded-full animate-pulse" 
            aria-hidden="true"
          />
          <h3 className="font-medium text-secondary" id="chat-title">Chat con Alemana Print</h3>
        </div>
        <button 
          onClick={onClose} 
          className="text-secondary hover:text-secondary-light transition-colors w-10 h-10 
            flex items-center justify-center rounded-full hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-secondary/50"
          aria-label="Cerrar chat"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        aria-live="polite"
        aria-relevant="additions"
        aria-labelledby="chat-title"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 
                  ${message.role === 'assistant'
                    ? 'bg-primary/30 border border-secondary/10 rounded-tl-sm'
                    : 'bg-gradient-to-r from-secondary/20 to-secondary/30 rounded-tr-sm'
                  }`}
                role={message.role === 'assistant' ? 'status' : undefined}
              >
                <p className="text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
            role="status"
            aria-label="El asistente está escribiendo..."
          >
            <div className="bg-primary/30 p-3 rounded-2xl border border-secondary/10 rounded-tl-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} tabIndex={-1} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-secondary/20 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 rounded-xl bg-primary/20 border border-secondary/20 text-white 
              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 
              focus:border-transparent transition-all"
            disabled={isLoading}
            aria-label="Tu mensaje"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            className="p-2 bg-gradient-to-r from-secondary to-secondary/80 text-dark rounded-xl
              hover:from-secondary/90 hover:to-secondary/70 disabled:opacity-50 transition-all 
              duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            aria-label="Enviar mensaje"
          >
            <FontAwesomeIcon 
              icon={faPaperPlane} 
              className={`text-lg transition-transform duration-300 ${isLoading ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;