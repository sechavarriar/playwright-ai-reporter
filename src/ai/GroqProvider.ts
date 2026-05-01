import Groq from 'groq-sdk';
import { AIProvider } from './AIProvider.interface';

const MODEL = 'llama-3.3-70b-versatile';

export class GroqProvider implements AIProvider {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    this.client = new Groq({ apiKey });
  }

  async analyze(errorContext: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'user', content: errorContext },
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content ?? 'No analysis returned.';
  }
}
