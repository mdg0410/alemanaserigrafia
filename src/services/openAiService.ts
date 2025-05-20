import OpenAI from 'openai';
import { ChatMessage } from '../types/chat';

class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;
  private rateLimiter: {
    tokens: number;
    lastReset: number;
  };

  private constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.rateLimiter = {
      tokens: 5, // 5 mensajes por minuto
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
    if (now - this.rateLimiter.lastReset >= 60000) { // 1 minuto
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

  public async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model: import.meta.env.VITE_OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error in OpenAI service:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
}

export default OpenAIService;
