# playwright-ai-reporter

Playwright reporter that uses AI to automatically analyze test failures and suggest fixes. Built with TypeScript. Uses **Groq (free, no credit card)** by default, and supports Claude and OpenAI as alternatives.

---

## What this does

When a Playwright test fails, the AI reporter kicks in automatically:

```
❌ Login › locked out user sees lock message

🔍 Analyzing failure: "locked out user sees lock message"

---
## ❌ locked out user sees lock message

1. **Root cause**
   The selector `[data-test="error"]` matched but the assertion
   expected different text than what Sauce Demo returned.

2. **Fix**
   ```typescript
   await expect(loginPage.errorMessage).toContainText(
     'Epic sadface: Sorry, this user has been locked out.'
   );
   ```

3. **Prevention**
   Always assert the exact error string shown in the UI, not a partial guess.

📄 Diagnosis saved → test-results/ai-diagnosis.md
```

---

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/your-username/playwright-ai-reporter
cd playwright-ai-reporter
npm install
npx playwright install chromium

# 2. Add your free Groq API key (https://console.groq.com)
cp .env.example .env
# Edit .env and set GROQ_API_KEY=your_key_here

# 3. Run the tests
npm test
```

> No credit card required. Groq's free tier is enough for all analyses.

---

## How to switch AI provider

Edit your `.env` file:

```bash
# Use Groq (free, default)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key

# Use Claude (best quality)
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_anthropic_key

# Use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
```

No code changes needed — the provider is swapped at runtime via environment variable.

---

## AI provider comparison

| Provider | Cost | Speed | Analysis Quality | Best for |
|---|---|---|---|---|
| Groq (Llama 3) | **Free** | Very fast | Good | Portfolio, small teams |
| Claude Haiku | ~$0.001/analysis | Fast | Very good | Medium teams |
| Claude Sonnet | ~$0.005/analysis | Medium | Excellent | Enterprise |
| OpenAI GPT-4o-mini | ~$0.003/analysis | Fast | Very good | Enterprise alternative |

---

## Project structure

```
playwright-ai-reporter/
├── src/ai/
│   ├── AIProvider.interface.ts   # shared contract for all providers
│   ├── GroqProvider.ts           # default, free
│   ├── ClaudeProvider.ts         # best paid option
│   ├── OpenAIProvider.ts         # popular alternative
│   └── providerFactory.ts        # selects provider from AI_PROVIDER env var
├── reporters/
│   └── AIReporter.ts             # custom Playwright reporter
├── tests/saucedemo/
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── pages/                        # Page Object Models
│   ├── LoginPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── index.ts                  # shared Playwright fixtures
├── .github/workflows/
│   └── playwright.yml            # GitHub Actions CI
├── .env.example
└── playwright.config.ts
```

---

## Best practices applied

- **Page Object Model (POM)** — selectors and actions live in `pages/`, tests stay clean
- **Fixtures** — shared `authenticatedPage` fixture avoids login boilerplate in every test
- **Data-driven tests** — login tests cover happy path, invalid credentials, and locked user
- **Meaningful assertions** — tests assert on visible text, not just navigation URLs
- **Custom reporter** — implements Playwright's `Reporter` interface, hooks into `onTestEnd`
- **Environment variables** — `.env.example` documents all keys; real keys never committed
- **Interchangeable AI** — `AIProvider` interface lets you swap providers without touching tests

---

## Running in CI with GitHub Actions

The workflow runs automatically on every push to `main` and on pull requests.

### 1. Add your API key as a repository secret

```
Settings → Secrets and variables → Actions → New repository secret
Name:  GROQ_API_KEY
Value: your_key_here
```

> Get your free key at [console.groq.com](https://console.groq.com) — no credit card required.

### 2. Run the pipeline manually

Go to your repo on GitHub:

```
Actions → Playwright Tests → Run workflow → Run workflow
```

### What the workflow does

1. Installs dependencies and Chromium
2. Runs all Playwright tests with the AI reporter active
3. Uploads the HTML report as an artifact (always)
4. Uploads `ai-diagnosis.md` as an artifact (only when there are failures)

> `ai-diagnosis.md` won't appear as an artifact if all tests pass — that's expected.
