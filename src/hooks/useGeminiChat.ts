import { useReducer, useEffect, useCallback, useRef } from 'react';
import { 
  GoogleGenerativeAI, 
  ChatSession, 
  Part, 
  FunctionDeclarationsTool,
  SchemaType, // <--- 1. IMPORTAMOS SchemaType
  GenerateContentResult 
} from '@google/generative-ai';
import { ChatState, ChatAction, ChatMessage, UserInfo } from '../types/chat';

// --- MENSAJES PREDETERMINADOS ---
const WELCOME_MESSAGE = '¡Bienvenido al asistente técnico de Alemana de Serigrafía! Por favor, completa el siguiente formulario para poder ayudarte mejor.';
const ADVISOR_INTRO_MESSAGE = 'Hola, soy Seri, el asistente técnico de Alemana de Serigrafía. Estoy aquí para responder todas tus dudas sobre serigrafía, procesos, materiales y recomendaciones técnicas. ¿En qué puedo ayudarte?';

// --- INSTRUCCIÓN DEL SISTEMA (CONTEXTO DEL NEGOCIO) ---
const SYSTEM_PROMPT: Part[] = [
  {
    text: `Eres "Seri", un asistente virtual experto y amigable de "Alemana de Serigrafía", una empresa ecuatoriana líder en insumos de serigrafía desde 1992.

    **Tu Misión:**
    - Asistir a los usuarios con dudas técnicas sobre serigrafía.
    - Proveer información sobre los productos y servicios de la empresa.
    - Tu tono debe ser siempre profesional, servicial y cercano.
    - Siempre responde en español.

    **Conocimiento Clave de "Alemana de Serigrafía":**
    - **Fundación:** 1992 por Raúl Trujillo.
    - **Especialidad:** Venta de insumos técnicos (emulsiones, tintas, mallas), equipos, servicios de preprensa (fotolitos, tensado de marcos) y capacitación.
    - **Marcas Distribuidas:** Kiwo, Ulano, Printop, Avient, Alcoplast, Architex.
    - **Contacto:** Correo ventas1@inkgraph.net, teléfonos +593 96 867 6893 / +593 98 611 2559. Ubicados en Quito, Ecuador.
    - **Propuesta de Valor:** Pioneros en la modernización de la serigrafía en Ecuador.

    **Reglas Importantes:**
    - Si un usuario pregunta por precios o stock, DEBES usar la herramienta 'obtenerInfoProducto'. No inventes esta información.
    - Si no sabes algo, responde honestamente que necesitas consultar con un especialista humano del equipo.`
  }
];

// --- DEFINICIÓN DE HERRAMIENTAS (FUNCTION CALLING) ---
const tools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      {
        name: 'obtenerInfoProducto',
        description: 'Obtiene información de stock y precio de un producto de serigrafía.',
        parameters: {
          // <--- 2. CORREGIMOS LOS TIPOS A SchemaType
          type: SchemaType.OBJECT, 
          properties: {
            nombreProducto: {
              type: SchemaType.STRING,
              description: 'El producto a buscar, ej: "tinta plastisol", "emulsión"',
            },
            marca: {
              type: SchemaType.STRING,
              description: 'La marca del producto, ej: "Printop", "Kiwo"',
            },
          },
          required: ['nombreProducto'],
        },
      },
    ],
  },
];

// Base de datos simulada para la función
const fakeProductDatabase: { [key: string]: { stock: number; precio: string } } = {
  "tinta plastisol printop": { stock: 120, precio: "15.50 USD por kg" },
  "emulsion kiwo": { stock: 75, precio: "30.00 USD por litro" },
  "malla 90": { stock: 200, precio: "12.00 USD por metro" }
};

// --- CONFIGURACIÓN DE GEMINI ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
  throw new Error('La clave VITE_GEMINI_API_KEY no está configurada en tu archivo .env');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: {
    role: "model",
    parts: SYSTEM_PROMPT,
  },
  tools: tools,
});

// --- LÓGICA DEL CHAT (REDUCER Y ESTADO) ---
const STORAGE_KEY = 'alemana-chat-gemini-state';
const MAX_MESSAGES = 20;
const FORM_DELAY = 1500;

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

// El reducer no necesita cambios
function chatReducer(state: ChatState, action: ChatAction): ChatState {
    // ... (código del reducer sin cambios)
    switch (action.type) {
      case 'TOGGLE_CHAT':
        const isOpening = !state.isOpen;
        if (isOpening && state.messages.length === 0 && !state.userInfo) {
          return {
            ...state,
            isOpen: true,
            messages: [{ role: 'model', content: WELCOME_MESSAGE, timestamp: Date.now() }],
            showForm: false,
          };
        } else if (isOpening && state.messages.length === 0 && state.userInfo) {
          return {
            ...state,
            isOpen: true,
            messages: [{ role: 'model', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }],
            isFormCompleted: true,
          };
        }
        return { ...state, isOpen: isOpening };
  
      case 'SHOW_FORM':
        return { ...state, showForm: true };
  
      case 'SET_USER_INFO':
        return {
          ...state,
          userInfo: action.payload,
          isFormCompleted: true,
          showForm: false,
          messages: [{ role: 'model', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }],
        };
  
      case 'ADD_MESSAGE':
        const messageToAdd: ChatMessage = {
          ...action.payload,
          role: action.payload.role === 'assistant' ? 'model' : action.payload.role,
        };
        return { ...state, messages: [...state.messages, messageToAdd] };
  
      case 'SET_TYPING':
        return { ...state, isTyping: action.payload };
        
      case 'RESET_CHAT':
        return {
          ...initialState,
          userInfo: state.userInfo,
          isFormCompleted: state.userInfo !== null,
          isOpen: true,
          messages: state.userInfo ? [{ role: 'model', content: ADVISOR_INTRO_MESSAGE, timestamp: Date.now() }] : [],
        };
        
      case 'SET_FORM_COMPLETED':
        return { ...state, isFormCompleted: action.payload };
      case 'SET_REQUEST_SOLVED':
        return { ...state, requestSolved: action.payload };
      case 'INCREMENT_MESSAGE_COUNT':
        return { ...state, messageCount: state.messageCount + 1 };
      default:
        return state;
    }
}

export function useGeminiChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const chatSessionRef = useRef<ChatSession | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { userInfo } = JSON.parse(savedState);
      if (userInfo) {
        dispatch({ type: 'SET_USER_INFO', payload: userInfo });
      }
    }
  }, []);

  useEffect(() => {
    if (state.userInfo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userInfo: state.userInfo }));
    }
  }, [state.userInfo]);

  useEffect(() => {
    if (state.isOpen && !state.isFormCompleted && !state.showForm && state.messages.length > 0) {
      const timer = setTimeout(() => dispatch({ type: 'SHOW_FORM' }), FORM_DELAY);
      return () => clearTimeout(timer);
    }
  }, [state.isOpen, state.isFormCompleted, state.showForm, state.messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (state.messageCount >= MAX_MESSAGES) {
      const limitMessage: ChatMessage = { role: 'model', content: 'Has alcanzado el límite de mensajes. Refresca para iniciar una nueva conversación.', timestamp: Date.now() };
      dispatch({ type: 'ADD_MESSAGE', payload: limitMessage });
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content, timestamp: Date.now() };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'INCREMENT_MESSAGE_COUNT' });

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = model.startChat();
      }

      // <--- 3. CORREGIMOS EL MANEJO DE LA RESPUESTA ---
      let result: GenerateContentResult = await chatSessionRef.current.sendMessage(content);
      
      let continueLoop = true;
      while (continueLoop) {
        const response = result.response;
        const functionCall = response.functionCalls()?.[0];

        if (functionCall) {
          console.log("El modelo solicitó una llamada de función:", functionCall);
          const { name, args } = functionCall;
          
          if (name === 'obtenerInfoProducto') {
            // Cambiamos el acceso a las propiedades usando indexación por string
            const nombreProducto = (args as any)['nombreProducto'] as string;
            const marca = (args as any)['marca'] as string | undefined;
            const key = `${nombreProducto} ${marca || ''}`.trim().toLowerCase();
            const productInfo = fakeProductDatabase[key] || { info: "Producto no encontrado. Por favor, pide a un asesor humano más detalles." };

            // Enviamos el resultado de la función de vuelta al modelo
            result = await chatSessionRef.current.sendMessage([
              { functionResponse: { name, response: { content: JSON.stringify(productInfo) } } },
            ]);
          } else {
            // Si la función no existe en nuestro código, detenemos el bucle
            continueLoop = false;
          }
        } else {
            // Si no hay más function calls, salimos del bucle
            continueLoop = false;
        }
      }

      const finalText = result.response.text();
      const botMessage: ChatMessage = { role: 'model', content: finalText, timestamp: Date.now() };
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });

    } catch (error) {
      console.error("Error al enviar mensaje a Gemini:", error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Lo siento, ocurrió un error. Intenta de nuevo.', timestamp: Date.now() };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.messageCount]);

  const setUserInfo = useCallback(async (userInfo: UserInfo) => {
    dispatch({ type: 'SET_USER_INFO', payload: userInfo });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  return { state, sendMessage, setUserInfo, toggleChat };
}