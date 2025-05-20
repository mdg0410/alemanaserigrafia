import { useReducer, useEffect, useCallback } from 'react';
import { ChatState, ChatAction, ChatMessage, UserInfo } from '../types/chat';
import OpenAIService from '../services/openAiService';

const STORAGE_KEY = 'alemana-chat-state';
const MAX_MESSAGES = 15;

const initialState: ChatState = {
  isOpen: false,
  messages: [],
  userInfo: null,
  isTyping: false,
  isFormCompleted: false,
  requestSolved: false,
  messageCount: 0,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload, isFormCompleted: true };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'SET_FORM_COMPLETED':
      return { ...state, isFormCompleted: action.payload };
    case 'SET_REQUEST_SOLVED':
      return { ...state, requestSolved: action.payload };
    case 'RESET_CHAT':
      return { ...initialState, userInfo: state.userInfo };
    case 'INCREMENT_MESSAGE_COUNT':
      return { ...state, messageCount: state.messageCount + 1 };
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const openAIService = OpenAIService.getInstance();

  useEffect(() => {
    // Cargar estado del localStorage
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.userInfo) {
        dispatch({ type: 'SET_USER_INFO', payload: parsedState.userInfo });
      }
    }
  }, []);

  useEffect(() => {
    // Guardar userInfo en localStorage
    if (state.userInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userInfo: state.userInfo }));
    }
  }, [state.userInfo]);

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
      const response = await openAIService.sendMessage([...state.messages, userMessage]);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      
      // Verificar si la solicitud fue resuelta
      if (response.includes('request_solved = true')) {
        dispatch({ type: 'SET_REQUEST_SOLVED', payload: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.messages, state.messageCount]);

  const setUserInfo = useCallback((userInfo: UserInfo) => {
    dispatch({ type: 'SET_USER_INFO', payload: userInfo });
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
