import OpenAI from 'openai';

interface RateLimiter {
  tokens: number;
  lastReset: number;
}

interface AssistantMessage {
  content: string;
  requestSolved?: boolean;
}

class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;
  private assistantId: string = 'asst_QmljoBEcPnflDmYkxqoho2cv';
  private rateLimiter: RateLimiter;
  private threadId: string | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT = 30000; // 30 segundos
  private readonly MODEL = 'gpt-3.5-turbo-1106';

  private async verifyAssistant(): Promise<boolean> {
    try {
      await this.openai.beta.assistants.retrieve(this.assistantId);
      return true;
    } catch (error) {
      console.error('Error verificando el asistente:', error);
      return false;
    }
  }

  private constructor() {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('La clave API de OpenAI no está configurada');
    }

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

  private async initializeThread(): Promise<string> {
    if (!this.threadId) {
      const thread = await this.openai.beta.threads.create();
      this.threadId = thread.id;
    }
    return this.threadId;
  }

  public async clearThread(): Promise<void> {
    if (this.threadId) {
      try {
        await this.openai.beta.threads.del(this.threadId);
        this.threadId = null;
      } catch (error) {
        console.error('Error al limpiar el thread:', error);
      }
    }
  }

  private async waitForCompletion(threadId: string, runId: string): Promise<OpenAI.Beta.Threads.Runs.Run> {
    const startTime = Date.now();
    let retries = 0;
    
    while (true) {
      if (Date.now() - startTime > this.TIMEOUT) {
        throw new Error('La operación excedió el tiempo límite');
      }

      try {
        const runStatus = await this.openai.beta.threads.runs.retrieve(threadId, runId);
        
        if (runStatus.status === 'completed') {
          return runStatus;
        }
        
        if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`El asistente falló: ${runStatus.last_error?.message || 'Error desconocido'}`);
        }

        if (retries >= this.MAX_RETRIES) {
          throw new Error('Número máximo de intentos excedido');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      } catch (error) {
        if (retries >= this.MAX_RETRIES) {
          throw error;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private parseAssistantResponse(message: string): AssistantMessage {
    const requestSolved = message.includes('Contactando con un asesor');
    return {
      content: message,
      requestSolved
    };
  }

  public async sendMessage(message: string): Promise<AssistantMessage> {
    if (!await this.checkRateLimit()) {
      throw new Error('Límite de velocidad excedido. Por favor, espere un momento antes de enviar otro mensaje.');
    }

    try {
      const assistantExists = await this.verifyAssistant();
      if (!assistantExists) {
        throw new Error('Asistente no encontrado o no accesible. Por favor, verifique su configuración.');
      }

      const threadId = await this.initializeThread();

      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
        model: this.MODEL
      });

      await this.waitForCompletion(threadId, run.id);
      
      const messages = await this.openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];
      
      if (lastMessage && lastMessage.content[0].type === 'text') {
        return this.parseAssistantResponse(lastMessage.content[0].text.value);
      }

      throw new Error('No se pudo obtener una respuesta del asistente');
    } catch (error: any) {
      console.error('Error en el servicio OpenAI:', error);
      
      if (error.status === 404) {
        throw new Error('Asistente no encontrado. Por favor, verifique su configuración.');
      } else if (error.status === 401) {
        throw new Error('Clave API inválida. Por favor, verifique su clave API de OpenAI.');
      } else if (error.status === 429) {
        throw new Error('Se ha excedido el límite de solicitudes. Por favor, inténtelo más tarde.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al obtener respuesta del asistente de IA');
      }
    }
  }
}

export default OpenAIService;
