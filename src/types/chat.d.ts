export interface UserInfo {
  name: string;
  id: string;
  email: string;
  phone: string;
}

export interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  userInfo: UserInfo | null;
  isTyping: boolean;
  isFormCompleted: boolean;
  requestSolved: boolean;
  messageCount: number;
}

export type ChatAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_USER_INFO'; payload: UserInfo }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_FORM_COMPLETED'; payload: boolean }
  | { type: 'SET_REQUEST_SOLVED'; payload: boolean }
  | { type: 'RESET_CHAT' }
  | { type: 'INCREMENT_MESSAGE_COUNT' };
