import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatService {
  private static instance: ChatService;
  private context: string;

  private constructor() {
    this.context = `Eres un asistente virtual de Alemana Print, una empresa de serigrafía. 
    Debes ser profesional, amable y ayudar con información sobre servicios, precios, tiempos de entrega y proceso de serigrafía.
    Conoces bien todos los servicios y técnicas de serigrafía.
    Los servicios principales son: Serigrafía textil, Serigrafía en objetos promocionales, Diseño gráfico y Asesoría en proyectos.`;
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const formattedMessages = [
        { role: 'system', content: this.context },
        ...messages
      ];

      const completion = await openai.chat.completions.create({
        messages: formattedMessages,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.2,
      });

      return completion.choices[0]?.message?.content || 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.';
    } catch (error) {
      console.error('Error al comunicarse con OpenAI:', error);
      throw new Error('No se pudo procesar tu mensaje. Por favor, intenta de nuevo más tarde.');
    }
  }
}