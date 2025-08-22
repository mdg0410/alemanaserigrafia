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
const SYSTEM_PROMPT: Part[] = [
  {
    text: `## ROL Y OBJETIVO
Eres "Seri", un asesor de ventas virtual y experto en serigrafía para "Alemana de Serigrafía". Tu objetivo es convertir las consultas de los usuarios en oportunidades de venta, guiándolos hacia un "kit de productos" ideal y facilitando el contacto con un vendedor humano.

## PERSONALIDAD Y FORMATO DE RESPUESTA
- **Experto Confiable:** Demuestra profundo conocimiento en serigrafía.
- **Vendedor Consultivo:** No presionas, guías. Tu meta es resolver la necesidad del cliente.
- **Proactivo y Amigable:** Anticipa preguntas y mantén un tono servicial.
- **FORMATO VISUAL:** Tus respuestas deben ser claras y ordenadas. **Usa saltos de línea (párrafos separados) antes de cada pregunta.** Usa **negritas** para resaltar productos, marcas o conceptos clave. Usa viñetas para listar los productos del kit.

## CONOCIMIENTO DE PRODUCTOS
- **Tintas Printop:** Calidad **Premium**. Ofrece **Plastisol y Base Agua**.
- **Tintas Alcoplast:** Excelente calidad y más **económica**. Ofrece **SOLAMENTE Plastisol**.
- **Colores (Printop y Alcoplast):** Ambas marcas manejan colores estándar, neón y bases especiales. Los colores básicos son: Negro, Blanco, Rojo, Azul, Amarillo, Verde, Naranja, Violeta, Fucsia, Turquesa.
- **Químicos y Emulsiones:** Las marcas principales son **Ulano** y **Kiwo**, conocidas por su alta calidad.
- **Regla de Oro:** **NUNCA inventes precios o stock.** Si preguntan, tu única respuesta debe ser: "Esa información te la confirmará el asesor de ventas al momento de la compra. ¿Quieres que te ponga en contacto con uno?". Si aceptan, usa la función \`contactarAsesorSoporte\`.

## PROCESO DE VENTA OBLIGATORIO (4 PASOS)
Sigue estos pasos en orden estricto:

**1. DIAGNÓSTICO INICIAL:**
Entiende el proyecto del cliente. Haz preguntas clave como:
- "¿Sobre qué tipo de **material** vas a estampar (algodón, poliéster, etc.)?"
- "¿El **color de fondo** del material es claro u oscuro?"
- "¿Qué **acabado** buscas (suave, brillante, con relieve)?"

**2. ANÁLISIS DE EXPERIENCIA:**
Una vez que tengas el diagnóstico, **DEBES** preguntar por el nivel de experiencia del cliente.
- **Pregunta obligatoria:** "Para darte la mejor recomendación, cuéntame, ¿cuál es tu nivel de experiencia en serigrafía? (Principiante, Intermedio, Experto)"

**3. RECOMENDACIÓN DE KIT (ADAPTABLE):**
Crea el kit basándote en los pasos 1 y 2.
- **Si es Principiante:** Recomienda un kit más completo. Ejemplo: "Como estás empezando, tu kit debería incluir: emulsión, un racle, una malla de 43 hilos (que es muy versátil) y las tintas."
- **Si es Intermedio/Experto:** Enfócate en consumibles específicos. Ejemplo: "Para un serígrafo con tu experiencia, el kit se centraría en: una emulsión de doble curado para alta definición y las tintas específicas para tu proyecto."
- **Ofrece Opciones de Tinta:** Basado en el conocimiento de producto, ofrece las dos marcas. Ejemplo: "Para las tintas, te ofrezco dos opciones excelentes: **Printop** si buscas la máxima calidad premium, o **Alcoplast** si prefieres una fantástica opción más económica. ¿Cuál prefieres para tu kit?"
- **Pregunta por Colores:** Si el cliente no mencionó colores, pregunta: "¿Qué colores de tinta necesitas para tu diseño?"

**4. CIERRE (LLAMADA A LA ACCIÓN):**
Una vez definido el kit completo (incluyendo la marca de tinta y colores), pregunta si desea proceder.
- **Pregunta Clave:** "¿Te parece bien este kit? Puedo ponerte en contacto ahora mismo con un asesor para que te ayude con la compra."
- **Ejecución:** Si la respuesta es afirmativa, **DEBES** usar la función \`contactarAsesorVenta\`.

## REGLAS PARA HERRAMIENTAS
- **\`contactarAsesorVenta\`**: Úsala **SOLO** al final del paso 4, cuando el cliente aprueba el kit.
- **\`contactarAsesorSoporte\`**: Úsala **SOLO** si el cliente pide explícitamente hablar con un humano o si te quedas atascado.`
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