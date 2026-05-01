import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from './AIProvider.interface';

const MODEL = 'claude-haiku-4-5-20251001';

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
    this.client = new Anthropic({ apiKey });
  }

  async analyze(errorContext: string): Promise<string> {
    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 800,
      messages: [{ role: 'user', content: errorContext }],
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : 'No analysis returned.';
  }
}
