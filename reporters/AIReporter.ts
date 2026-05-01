import fs from 'fs';
import path from 'path';
import {
  Reporter,
  TestCase,
  TestResult,
  FullConfig,
  FullResult,
} from '@playwright/test/reporter';
import 'dotenv/config';
import { createProvider } from '../src/ai/providerFactory';

const OUTPUT_DIR = 'test-results';
const DIAGNOSIS_FILE = path.join(OUTPUT_DIR, 'ai-diagnosis.md');

export default class AIReporter implements Reporter {
  private provider: ReturnType<typeof createProvider> | null = null;
  private providerName = (process.env.AI_PROVIDER ?? 'groq').toUpperCase();
  private pending: Promise<string | null>[] = [];

  onBegin(_config: FullConfig): void {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`\n🤖 AI Reporter active — provider: ${this.providerName}\n`);
  }

  // Synchronous: just queues the analysis promise, no await
  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed') return;
    this.pending.push(this.analyzeFailure(test, result));
  }

  // Awaits all pending analyses before writing the file
  async onEnd(_result: FullResult): Promise<void> {
    const results = await Promise.all(this.pending);
    const diagnoses = results.filter((d): d is string => d !== null);

    if (diagnoses.length === 0) return;

    const content = [
      `# AI Diagnosis Report`,
      `> Provider: ${this.providerName}`,
      `> Generated: ${new Date().toISOString()}`,
      '',
      ...diagnoses,
    ].join('\n');

    fs.writeFileSync(DIAGNOSIS_FILE, content, 'utf-8');
    console.log(`\n📄 Diagnosis saved → ${DIAGNOSIS_FILE}\n`);
  }

  private async analyzeFailure(test: TestCase, result: TestResult): Promise<string | null> {
    console.log(`\n🔍 Analyzing failure: "${test.title}"`);

    try {
      const errorContext = readErrorContext(result);
      if (!this.provider) this.provider = createProvider();

      const diagnosis = await this.provider.analyze(errorContext);
      const section = formatSection(test.title, diagnosis);

      console.log(section);
      return section;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ⚠️  AI analysis failed: ${msg}`);
      return null;
    }
  }
}

function readErrorContext(result: TestResult): string {
  // Playwright generates error-context.md in the test output dir.
  // The screenshot attachment path lets us locate that directory.
  const screenshot = result.attachments.find(
    (a) => a.name === 'screenshot' && a.path
  );

  if (screenshot?.path) {
    const errorContextPath = path.join(path.dirname(screenshot.path), 'error-context.md');
    if (fs.existsSync(errorContextPath)) {
      return fs.readFileSync(errorContextPath, 'utf-8');
    }
  }

  // Fallback for when screenshot is not available
  const error = result.error;
  return [
    '# Instructions',
    '- Following Playwright test failed.',
    '- Explain why, be concise, respect Playwright best practices.',
    '- Provide a snippet of code with the fix, if possible.',
    '',
    '# Error details',
    '```',
    error?.message ?? 'Unknown error',
    error?.stack ?? '',
    '```',
  ].join('\n');
}

function formatSection(title: string, diagnosis: string): string {
  return [`---`, `## ❌ ${title}`, '', diagnosis, ''].join('\n');
}
