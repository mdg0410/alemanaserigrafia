import OpenAI from 'openai';
import CacheService from './cacheService';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatService {
  private static instance: ChatService;
  private context: string;
  private cacheService: CacheService;

  private constructor() {
    this.context = `Eres un asistente virtual de Alemana Print, una empresa de serigrafía. 
    Debes ser profesional, amable y ayudar con información sobre servicios, precios, tiempos de entrega y proceso de serigrafía.
    Conoces bien todos los servicios y técnicas de serigrafía.
    Los servicios principales son: Serigrafía textil, Serigrafía en objetos promocionales, Diseño gráfico y Asesoría en proyectos.`;
    
    this.cacheService = CacheService.getInstance({
      ttl: 60 * 60 * 1000, // 1 hora
      maxSize: 10 * 1024 * 1024 // 10MB
    });
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private generateCacheKey(messages: ChatMessage[]): string {
    const relevantMessages = messages.slice(-3);
    return `chat_${JSON.stringify(relevantMessages)}`;
  }

  public async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const cacheKey = this.generateCacheKey(messages);
      
      const cachedResponse = await this.cacheService.get<string>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      const systemMessage: ChatMessage = {
        role: 'system',
        content: this.context
      };

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.2,
      });

      const response = completion.choices[0]?.message?.content || 
        'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.';

      if (response) {
        await this.cacheService.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      console.error('Error al comunicarse con OpenAI:', error);
      
      const cacheKey = this.generateCacheKey(messages);
      const cachedResponse = await this.cacheService.get<string>(cacheKey);
      
      if (cachedResponse) {
        return `${cachedResponse}\n\n(Respuesta obtenida del caché debido a un error de conexión)`;
      }
      
      throw new Error('No se pudo procesar tu mensaje. Por favor, intenta de nuevo más tarde.');
    }
  }

  public clearCache(): void {
    this.cacheService.clear();
  }
}