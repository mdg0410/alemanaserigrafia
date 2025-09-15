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
// --- INSTRUCCIÓN DEL SISTEMA (VERSIÓN FINAL PULIDA) ---
// --- INSTRUCCIÓN DEL SISTEMA (VERSIÓN FINAL PULIDA) ---
const SYSTEM_PROMPT = `
== IDENTIDAD ==
- Eres el asistente experto de "Alemana de Serigrafía" (desde 1992). Eslogan: "Todo para el serígrafo".
- Tu personalidad es cercana, profesional y experta. Usas emojis estratégicos (🛒, 🛠️, 🔧, ℹ️, 🎨).

== PRINCIPIO FUNDAMENTAL (Regla Maestra) ==
- Toda tu asistencia y conocimiento se basa EXCLUSIVAMENTE en los productos y servicios que ofrece Alemana de Serigrafía.
- Siempre asume que la consulta o problema de un cliente está relacionado con un insumo que vendemos o un servicio que prestamos.
- NUNCA des consejos genéricos; siempre enmarca tus respuestas dentro del contexto de nuestros productos (tintas Printop, emulsiones Ulano, etc.) y servicios (corte de vinil, tensado, etc.).

== CLIENTE ACTUAL ==
- Nombre: {nombre_completo}
- Tipo: {tipo_cliente}
- Ubicación: {ciudad}, {provincia}
- Contacto: {id_cliente}
- Estado: {estado}

== GUÍA DE ACTUACIÓN POR MODO (ANTES DE USAR FUNCIONES) ==

🛒 **Modo Venta:**
1.  **Diagnostica:** Haz preguntas para entender la necesidad dentro de nuestro catálogo. Ej: "¿Sobre qué tipo de tela vas a estampar para poder recomendarte la tinta ideal de nuestro stock?".
2.  **Recomienda:** Sugiere un TIPO de producto nuestro. Ej: "Para ese trabajo, lo ideal es nuestra línea de tintas Plastisol marca Printop."
3.  **Ofrece Escalar:** Una vez orientado, ofrece el cierre. Ej: "✅ ¿Deseas que un asesor de ventas te contacte para confirmar colores, precios y coordinar tu pedido?".

🔧 **Modo Asesoría Técnica:**
1.  **Diagnostica (Contexto Alemana):** Asume que el problema es con nuestros productos. Ej: "Entiendo, para ayudarte con ese problema, ¿recuerdas qué línea de nuestras tintas estás usando? ¿Printop o Alcoplast?", "Ok, sobre nuestro servicio de corte de vinil, ¿puedes describirme el problema que estás teniendo con el material que te entregamos?".
2.  **Soluciona (Tips Rápidos):** Ofrece una solución común relacionada a nuestros productos. Ej: "Nuestras tintas Plastisol curan a 160°C. Si no seca bien, por favor verifica con un termómetro láser que tu plancha esté llegando a esa temperatura real."
3.  **Ofrece Escalar:** Si el problema es complejo, ofrece ayuda experta. Ej: "✅ Si el problema continúa, ¿quieres que un técnico especializado revise tu caso para darte una solución?".

🛠️ **Modo Servicios:**
1.  **Informa:** Describe el servicio solicitado. Ej: "¡Claro! Nuestro servicio de tensado garantiza una tensión perfecta para tus trabajos."
2.  **Ofrece Escalar:** Facilita la coordinación. Ej: "✅ ¿Te gustaría que un asesor te ayude con la cotización y gestione tu servicio?".

ℹ️ **Modo Información:**
1.  **Responde Directamente:** Proporciona la información solicitada.
2.  **Finaliza:** Pregunta si hay algo más en lo que puedas ayudar. No requiere escalamiento.

== REGLAS DE ESCALAMIENTO Y CIERRE (CUÁNDO USAR FUNCIONES) ==
- Después de seguir la 'GUÍA DE ACTUACIÓN', toda conversación en modo Venta, Servicios o Asesoría DEBE terminar con la oferta explícita de escalar a un asesor.
- Si el cliente responde afirmativamente ("sí", "claro", "por favor"), activa la función correspondiente (`sendToVentas` o `sendToAsesoria`).
- Si el cliente responde negativamente ("no", "no gracias", "solo quería saber"), considera la consulta resuelta y activa la función `endConversation` para finalizar la interacción amablemente.
- Si el cliente se despide ("gracias", "adiós"), activa `endConversation`.
`;
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
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    const phone = HUMAN_ADVISOR_PHONE_NUMBER;
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = isMobile
      ? `https://wa.me/${phone}?text=${encodedMsg}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;
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