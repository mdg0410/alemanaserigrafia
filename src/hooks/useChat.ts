import { useReducer, useEffect, useCallback } from 'react';
import { ChatState, ChatAction, ChatMessage, UserInfo } from '../types/chat';
import OpenAIService from '../services/openAiService';
import GoogleSheetService from '../services/googleSheetService';

const WELCOME_MESSAGE = '¡Bienvenido al asistente técnico de Alemana Serigrafía! Por favor, completa el siguiente formulario para poder ayudarte mejor.';
const ADVISOR_INTRO_MESSAGE = 'Hola, soy el asistente técnico de Alemana Serigrafía. Estoy aquí para responder todas tus dudas sobre serigrafía, procesos, materiales y recomendaciones técnicas. ¿En qué puedo ayudarte?';

const STORAGE_KEY = 'alemana-chat-state';
const MAX_MESSAGES = 15;
const FORM_DELAY = 2000; // 2 segundos

const initialState: ChatState = {
  isOpen: false,
  messages: [],
  userInfo: null,
  isTyping: false,
  isFormCompleted: false,
  requestSolved: false,
  messageCount: 0,
  showForm: false,
};

function createUserContextMessage(userInfo: UserInfo): string {
  return `Información del usuario:
    Nombre: ${userInfo.name}
    Cédula: ${userInfo.id}
    Email: ${userInfo.email}
    Teléfono: ${userInfo.phone}
  `;
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      const isOpening = !state.isOpen;
      // Si está abriendo y no hay mensajes o datos de usuario guardados
      if (isOpening && state.messages.length === 0 && !state.userInfo) {
        return {
          ...state,
          isOpen: true,
          messages: [{ role: 'assistant', content: WELCOME_MESSAGE, timestamp: Date.now() }],
          showForm: false, // El formulario se mostrará después del delay
        };
      }
      // Si está abriendo y hay datos de usuario guardados pero no hay mensajes
      else if (isOpening && state.messages.length === 0 && state.userInfo) {
        return {
          ...state,
          isOpen: true,
          messages: [{ role: 'assistant', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }],
          isFormCompleted: true,
        };
      }
      return {
        ...state,
        isOpen: isOpening,
      };

    case 'SHOW_FORM':
      return { ...state, showForm: true };

    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
        isFormCompleted: true,
        showForm: false,
        messages: [{ role: 'assistant', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }],
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };

    case 'SET_FORM_COMPLETED':
      return { ...state, isFormCompleted: action.payload };

    case 'SET_REQUEST_SOLVED':
      return { ...state, requestSolved: action.payload };

    case 'RESET_CHAT':
      return {
        ...initialState,
        userInfo: state.userInfo,
        isFormCompleted: state.userInfo !== null,
        isOpen: true,
        messages: state.userInfo ? [{ role: 'assistant', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }] : [],
      };

    case 'INCREMENT_MESSAGE_COUNT':
      return { ...state, messageCount: state.messageCount + 1 };

    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const openAIService = OpenAIService.getInstance();

  // Cargar estado del localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.userInfo) {
        dispatch({ type: 'SET_USER_INFO', payload: parsedState.userInfo });
      }
    }
  }, []);

  // Guardar userInfo en localStorage
  useEffect(() => {
    if (state.userInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userInfo: state.userInfo }));
    }
  }, [state.userInfo]);

  // Mostrar formulario después del delay
  useEffect(() => {
    if (state.isOpen && !state.isFormCompleted && !state.showForm && state.messages.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_FORM' });
      }, FORM_DELAY);
      return () => clearTimeout(timer);
    }
  }, [state.isOpen, state.isFormCompleted, state.showForm, state.messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (state.messageCount >= MAX_MESSAGES) {
      throw new Error('Maximum message limit reached');
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'INCREMENT_MESSAGE_COUNT' });

    try {
      let assistantResponse;
      
      // Ya no enviamos el mensaje de introducción al empezar a chatear
      assistantResponse = await openAIService.sendMessage(content);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse.content,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      
      if (assistantResponse.requestSolved) {
        dispatch({ type: 'SET_REQUEST_SOLVED', payload: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.messageCount]);

  const setUserInfo = useCallback(async (userInfo: UserInfo) => {
    try {
      const googleSheetService = GoogleSheetService.getInstance();
      const result = await googleSheetService.saveUserData(userInfo);
      
      if (!result.success) {
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            role: 'assistant', 
            content: result.message, 
            timestamp: Date.now() 
          } 
        });
        return;
      }

      dispatch({ type: 'SET_USER_INFO', payload: userInfo });
    } catch (error) {
      console.error('Error guardando datos del usuario:', error);
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          role: 'assistant', 
          content: 'Lo siento, hubo un error al guardar tus datos. Por favor, inténtalo de nuevo.', 
          timestamp: Date.now() 
        } 
      });
    }
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, []);

  return {
    state,
    sendMessage,
    setUserInfo,
    toggleChat,
    resetChat,
  };
}
