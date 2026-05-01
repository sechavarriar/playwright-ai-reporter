# playwright-ai-reporter — Project Context

## Description
Playwright reporter that uses AI to automatically analyze test failures and suggest fixes. Built with TypeScript, Groq (free) and supports Claude, OpenAI.

## Goal
Portfolio project to demonstrate QA Automation skills with AI integration. Will be published on GitHub and LinkedIn.

---

## Stack
- **Playwright** + **TypeScript** — test automation framework
- **Groq** (free tier, no credit card) — default AI provider
- **Sauce Demo** (https://www.saucedemo.com) — target app to automate
- **GitHub Actions** — CI/CD pipeline

---

## Project Structure
```
playwright-ai-reporter/
├── src/
│   └── ai/
│       ├── AIProvider.interface.ts     # common contract for all providers
│       ├── GroqProvider.ts             # default, free
│       ├── ClaudeProvider.ts           # best paid option
│       └── OpenAIProvider.ts           # popular alternative
├── reporters/
│   └── AIReporter.ts                   # custom Playwright reporter
├── tests/
│   └── saucedemo/
│       ├── login.spec.ts
│       ├── cart.spec.ts
│       └── checkout.spec.ts
├── pages/                              # Page Object Models
│   ├── LoginPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── index.ts                        # shared Playwright fixtures
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions CI
├── .env.example                        # template with all env vars
├── CONTEXT.md                          # this file
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Architecture — Interchangeable AI Provider Pattern
The reporter uses a common interface so any AI provider can be swapped via environment variable, no code changes needed.

### Interface contract
```typescript
// src/ai/AIProvider.interface.ts
export interface AIProvider {
  analyze(failureContext: FailureContext): Promise<string>;
}

export interface FailureContext {
  testTitle: string;
  errorMessage: string;
  stackTrace: string;
  testCode: string;
  screenshotBase64?: string;
}
```

### Provider selection via env var
```typescript
// AI_PROVIDER=groq (default) | claude | openai
```

---

## AI Providers

### Groq — default, free
- Model: `llama-3.3-70b-versatile`
- Free tier: no credit card required
- Get API key: https://console.groq.com
- Env var: `GROQ_API_KEY`

### Claude (Anthropic) — best paid option
- Model: `claude-sonnet-4-5` for best quality, `claude-haiku-4-5-20251001` for cost efficiency
- Why best: longest context window (ideal for full traces), best TypeScript reasoning, most structured responses
- Get API key: https://console.anthropic.com
- Env var: `ANTHROPIC_API_KEY`
- Approx cost: ~$0.005 per failure analysis with Sonnet

### OpenAI — popular alternative
- Model: `gpt-4o-mini` for cost, `gpt-4o` for quality
- Get API key: https://platform.openai.com
- Env var: `OPENAI_API_KEY`
- Approx cost: ~$0.003 per failure analysis with gpt-4o-mini

### Provider comparison table (for README)
| Provider | Cost | Speed | Analysis Quality | Best for |
|---|---|---|---|---|
| Groq (Llama 3) | Free | Very fast | Good | Portfolio, small teams |
| Claude Haiku | ~$0.001/analysis | Fast | Very good | Medium teams |
| Claude Sonnet | ~$0.005/analysis | Medium | Excellent | Enterprise |
| OpenAI GPT-4o | ~$0.005/analysis | Medium | Very good | Enterprise alternative |

---

## App Under Test — Sauce Demo
URL: https://www.saucedemo.com
Test credentials:
- user: `standard_user` / pass: `secret_sauce`
- user: `locked_out_user` / pass: `secret_sauce` (locked, for negative tests)
- user: `problem_user` / pass: `secret_sauce` (broken UI, for visual bugs)

### Flows to automate
1. **Login** — valid login, invalid credentials, locked user
2. **Cart** — add product, remove product, verify total
3. **Checkout** — complete flow, missing fields validation

---

## Best Practices to demonstrate
- Page Object Model (POM) pattern
- Fixtures for shared setup/teardown
- Data-driven tests
- Meaningful assertions (not just status codes)
- Custom reporter implementing Playwright's Reporter interface
- Environment variables with `.env.example` (never commit real keys)
- GitHub Actions running tests on every push and PR

---

## AI Reporter — How it works
1. Playwright runs tests normally
2. On test failure, `AIReporter.onTestEnd()` is triggered
3. Reporter collects: test title, error message, stack trace, test source code, screenshot (if available)
4. Sends context to configured AI provider
5. AI responds with: root cause, fix suggestion, how to prevent it
6. Diagnosis printed in terminal and saved to `test-results/ai-diagnosis.md`

### Prompt structure sent to AI
```
You are a Playwright TypeScript expert.
Analyze this test failure and respond in exactly 3 sections:

1. **Root cause** (1-2 lines)
2. **Fix** (TypeScript code block, ready to copy)
3. **Prevention** (1 line)

Test: {testTitle}
Error: {errorMessage}
Stack: {stackTrace}

Test code:
{testCode}
```

---

## Environment Variables
```bash
# .env.example

# AI Provider: groq (default) | claude | openai
AI_PROVIDER=groq

# Groq (free) — https://console.groq.com
GROQ_API_KEY=

# Claude (best paid) — https://console.anthropic.com
ANTHROPIC_API_KEY=

# OpenAI (alternative) — https://platform.openai.com
OPENAI_API_KEY=
```

---

## GitHub Actions — CI pipeline
- Trigger: push to main, pull requests
- Run all Playwright tests
- Publish test report as artifact
- Show pass/fail summary in PR

---

## README sections to write
1. What this project does (with a terminal screenshot showing AI diagnosis)
2. Quick start (clone, install, add GROQ_API_KEY, run)
3. How to switch AI provider
4. AI provider comparison table
5. Project structure explained
6. Best practices applied
7. How to run in CI with GitHub Actions

---

## Important constraints
- No API keys committed to the repo ever
- Groq must work out of the box as default (free, no credit card)
- Anyone cloning the repo should be able to run it in under 5 minutes
- Code must be clean enough to show in a LinkedIn post screenshot
