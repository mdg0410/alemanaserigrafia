import OpenAI from 'openai';
import { ChatMessage } from '../types/chat';

class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;
  private assistantId: string = 'asst_4r7ibGnE4az6pz2f2r2BU17';
  private rateLimiter: {
    tokens: number;
    lastReset: number;
  };
  private threadId: string | null = null;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.rateLimiter = {
      tokens: 5,
      lastReset: Date.now(),
    };
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private resetRateLimiter() {
    const now = Date.now();
    if (now - this.rateLimiter.lastReset >= 60000) {
      this.rateLimiter.tokens = 5;
      this.rateLimiter.lastReset = now;
    }
  }

  private async checkRateLimit(): Promise<boolean> {
    this.resetRateLimiter();
    if (this.rateLimiter.tokens > 0) {
      this.rateLimiter.tokens--;
      return true;
    }
    return false;
  }

  private async initializeThread() {
    if (!this.threadId) {
      const thread = await this.openai.beta.threads.create();
      this.threadId = thread.id;
    }
    return this.threadId;
  }

  public async sendMessage(message: string): Promise<string> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
    }

    try {
      // Asegurarse de que existe un thread
      const threadId = await this.initializeThread();

      // Agregar el mensaje del usuario al thread
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      // Ejecutar el asistente
      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
      });

      // Esperar a que el asistente termine de procesar
      let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      if (runStatus.status === 'completed') {
        // Obtener los mensajes más recientes
        const messages = await this.openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage && lastMessage.content[0].type === 'text') {
          return lastMessage.content[0].text.value;
        }
      }

      throw new Error('Failed to get response from assistant');
    } catch (error) {
      console.error('Error in OpenAI service:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
}

export default OpenAIService;
