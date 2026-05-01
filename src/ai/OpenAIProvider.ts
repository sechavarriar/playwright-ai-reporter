import OpenAI from 'openai';
import { AIProvider } from './AIProvider.interface';

const MODEL = 'gpt-4o-mini';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    this.client = new OpenAI({ apiKey });
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
