import { useReducer, useEffect, useCallback, useRef } from 'react';
import { 
  GoogleGenerativeAI, 
  ChatSession, 
  Part, 
  FunctionDeclarationsTool,
  SchemaType,
  GenerateContentResult 
} from '@google/generative-ai';
import { ChatState, ChatAction, ChatMessage, UserInfo } from '../types/chat';

// --- PRE-DETERMINED MESSAGES ---
const WELCOME_MESSAGE = '¡Bienvenido al asistente técnico de Alemana de Serigrafía! Por favor, completa el siguiente formulario para poder ayudarte mejor.';
const ADVISOR_INTRO_MESSAGE = 'Hola, soy Seri, tu asesor de serigrafía virtual. Cuéntame sobre tu proyecto y te ayudaré a armar el kit de productos perfecto para ti.';
const HUMAN_ADVISOR_PHONE_NUMBER = '593968676893'; 

// --- SYSTEM INSTRUCTIONS (NEW PERSONALITY) ---
const SYSTEM_PROMPT: Part[] = [
  {
    text: `Eres "Seri", un asesor de ventas y experto en serigrafía para "Alemana de Serigrafía", una empresa ecuatoriana líder en insumos de serigrafía desde 1992.

    **Tu Misión:**
    - Entender las necesidades del cliente para recomendarle un "kit de productos" ideal.
    - Facilitar el contacto con un vendedor humano para cerrar la venta o dar soporte.
    - Tu tono debe ser siempre profesional, servicial y proactivo.
    - Siempre responde en español.

    **Tu Proceso de Venta:**
    1.  **Entender el Contexto:** Haz preguntas clave para entender el proyecto del cliente. Ejemplos: "¿Qué tipo de producto vas a estampar (camisetas, jarras, etc.)?", "¿Sobre qué material (algodón, poliéster, cerámica)?", "¿Es para fondos claros u oscuros?".
    2.  **Crear un Kit:** Basado en sus respuestas, recomienda un "kit de productos". Describe los productos de forma conceptual (ej: "Para eso, tu kit ideal llevaría: una emulsión fotosensible de alta definición marca Ulano, tintas plastisol de Printop..."). **NUNCA inventes stock ni precios.**
    3.  **Confirmar y Actuar:** Una vez que el cliente esté de acuerdo con el kit, pregunta si desea que un asesor humano lo contacte. Si dice que sí, **DEBES** usar la función 'contactarAsesorVenta'.

    **Reglas para Ejecutar Funciones:**
    - **Usa 'contactarAsesorVenta'** cuando hayas definido un kit y el cliente quiera proceder.
    - **Usa 'contactarAsesorSoporte'** si el cliente pide explícitamente hablar con una persona, un humano, un asesor, o si se siente frustrado.
    
    **Marcas que conoces:** Kiwo, Ulano, Printop, Avient, Alcoplast, Architex.`
  }
];

// --- TOOL DEFINITION (FUNCTION CALLING) ---
const tools: FunctionDeclarationsTool[] = [
    {
      functionDeclarations: [
        {
          name: 'contactarAsesorVenta',
          description: 'Redirige al usuario a WhatsApp para finalizar la compra de un kit de productos con un asesor humano.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              resumenKit: {
                type: SchemaType.STRING,
                description: 'Un resumen claro y conciso del kit de productos recomendado para el cliente. Ej: "Kit para camisetas de algodón: Emulsión Ulano, Tintas Printop (rojo, negro), Malla 90."',
              },
              nombreCliente: {
                  type: SchemaType.STRING,
                  description: 'El nombre del cliente que se obtuvo del formulario inicial.'
              }
            },
            required: ['resumenKit', 'nombreCliente'],
          },
        },
        {
          name: 'contactarAsesorSoporte',
          description: 'Redirige al usuario a WhatsApp para que reciba ayuda de un asesor humano.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              motivoConsulta: {
                type: SchemaType.STRING,
                description: 'Un resumen del problema o la pregunta del cliente para darle contexto al asesor humano.',
              },
              nombreCliente: {
                  type: SchemaType.STRING,
                  description: 'El nombre del cliente que se obtuvo del formulario inicial.'
              }
            },
            required: ['motivoConsulta', 'nombreCliente'],
          },
        },
      ],
    },
  ];

// --- GEMINI CONFIGURATION ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: {
    role: "model",
    parts: SYSTEM_PROMPT,
  },
  tools: tools,
});

// --- CHAT LOGIC ---
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

function chatReducer(state: ChatState, action: ChatAction): ChatState {
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

  const redirectToWhatsApp = (message: string) => {
    const whatsappUrl = `https://wa.me/${HUMAN_ADVISOR_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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

      let result: GenerateContentResult = await chatSessionRef.current.sendMessage(content);
      
      let continueLoop = true;
      while (continueLoop) {
        const response = result.response;
        const functionCall = response.functionCalls()?.[0];

        if (functionCall) {
          console.log("El modelo solicitó una llamada de función:", functionCall);
          const { name, args } = functionCall as { name: string; args: any };

          if (name === 'contactarAsesorVenta') {
            const message = `¡Hola! Soy ${args.nombreCliente}. Seri me recomendó el siguiente kit y quisiera finalizar la compra:\n\n*Kit Recomendado:*\n${args.resumenKit}`;
            redirectToWhatsApp(message);
            const botMessage: ChatMessage = { role: 'model', content: '¡Perfecto! Te estoy redirigiendo a WhatsApp para que un asesor complete tu pedido.', timestamp: Date.now() };
            dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
            dispatch({ type: 'SET_REQUEST_SOLVED', payload: true }); 
            continueLoop = false; 

          } else if (name === 'contactarAsesorSoporte') {
            const message = `¡Hola! Soy ${args.nombreCliente} y necesito ayuda con lo siguiente: ${args.motivoConsulta}`;
            redirectToWhatsApp(message);
            const botMessage: ChatMessage = { role: 'model', content: 'Claro que sí. Un asesor humano te atenderá por WhatsApp en un momento.', timestamp: Date.now() };
            dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
            dispatch({ type: 'SET_REQUEST_SOLVED', payload: true }); 
            continueLoop = false; 
            
          } else {
            continueLoop = false;
          }
        } else {
            continueLoop = false;
        }
      }

      if (!result.response.functionCalls()?.length) {
        const finalText = result.response.text();
        const botMessage: ChatMessage = { role: 'model', content: finalText, timestamp: Date.now() };
        dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
      }

    } catch (error) {
      console.error("Error al enviar mensaje a Gemini:", error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Lo siento, ocurrió un error. Intenta de nuevo.', timestamp: Date.now() };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.messageCount, state.userInfo]);

  const setUserInfo = useCallback(async (userInfo: UserInfo) => {
    dispatch({ type: 'SET_USER_INFO', payload: userInfo });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  return { state, sendMessage, setUserInfo, toggleChat };
}