# Free AI Prompt Generator

A free, browser-based AI prompt generator built with Astro that empowers creators, developers, marketers, and researchers to craft highly optimized, structured prompts for ChatGPT, Gemini, Claude, and Midjourney using proven prompt engineering frameworks like RTF and CO-STAR.

Live site: [https://freeaipromptgen.com](https://freeaipromptgen.com)

---

## ✨ Features

- **🪄 Interactive Prompt Wizard**: Step-by-step guided wizard to shape raw ideas into structured, high-performing prompts without manual guesswork.
- **📐 Prompt Engineering Frameworks**: Built-in support for battle-tested prompt frameworks including **RTF** (Role-Task-Format) and **CO-STAR** (Context, Objective, Style, Tone, Audience, Response).
- **🎯 Model Targeting**: Tailored prompt syntax, formatting, and parameters optimized specifically for top AI models:
  - **ChatGPT** (OpenAI GPT-4o / o1 / o3-mini)
  - **Claude** (Anthropic Claude 3.5 Sonnet / Opus / Haiku)
  - **Gemini** (Google Gemini 1.5 Pro / Flash / 2.0)
  - **Midjourney** (Image generation prompt parameters, aspect ratios, stylization, lighting)
- **📊 AI Prompt Scoring**: Real-time evaluator that analyzes prompt clarity, specificity, constraints, and context completeness to score prompt strength and suggest actionable improvements.
- **📚 Template Library**: Curated, ready-to-use prompt templates across coding, writing, marketing, research, business strategy, and visual art creation.
- **⚡ 100% Client-Side & Private**: All prompt generation, formatting, and scoring happen directly in your browser with zero data retention or tracking.

---

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) (Fast, content-focused static site generation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: Static output optimized for Cloudflare Pages / Vercel / Netlify

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v22.12.0` or higher
- **npm** (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lakshyajaglan1/free-ai-prompt-gen.git
   cd free-ai-prompt-gen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Or run the Astro background daemon:
   ```bash
   npx astro dev --background
   ```
   Open your browser and navigate to `http://localhost:4321`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:4321` |
| `npm run build` | Builds static production assets to `./dist/` |
| `npm run preview` | Locally previews the production build from `./dist/` |
| `npx astro check` | Runs Astro and TypeScript diagnostic type checks |

---

## 📄 License

Distributed under the [MIT License](License).
