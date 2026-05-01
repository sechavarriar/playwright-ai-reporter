import { AIProvider } from './AIProvider.interface';
import { GroqProvider } from './GroqProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { OpenAIProvider } from './OpenAIProvider';

export function createProvider(): AIProvider {
  const name = (process.env.AI_PROVIDER ?? 'groq').toLowerCase();

  switch (name) {
    case 'claude':
      return new ClaudeProvider();
    case 'openai':
      return new OpenAIProvider();
    case 'groq':
    default:
      return new GroqProvider();
  }
}
