# AI QA Suite

A unified AI-powered toolkit for developers and QA teams, designed to accelerate software quality assurance by automating test generation, error debugging, and bug report formatting.

\<p align="center"\>
\<strong\>\<a href="[https://ai-qa-suite.vercel.app](https://ai-qa-suite.vercel.app)" target="\_blank"\>View Live Demo\</a\>\</strong\>
\&nbsp;\&nbsp;\&nbsp;·\&nbsp;\&nbsp;\&nbsp;
\<strong\>\<a href="[https://github.com/JoshuaViera/ai-qa-suite/issues](https://www.google.com/search?q=https://github.com/JoshuaViera/ai-qa-suite/issues)" target="\_blank"\>Report Bug\</a\>\</strong\>
\&nbsp;\&nbsp;\&nbsp;·\&nbsp;\&nbsp;\&nbsp;
\<strong\>\<a href="[https://github.com/JoshuaViera/ai-qa-suite/issues](https://www.google.com/search?q=https://github.com/JoshuaViera/ai-qa-suite/issues)" target="\_blank"\>Request Feature\</a\>\</strong\>
\</p\>

\<p align="center"\>
\<img alt="Project Status" src="[https://img.shields.io/badge/Status-Actively\_Developed-brightgreen?style=for-the-badge](https://www.google.com/search?q=https://img.shields.io/badge/Status-Actively_Developed-brightgreen%3Fstyle%3Dfor-the-badge)" /\>
\<img alt="Next.js" src="[https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=nextdotjs\&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Next.js-000000%3Fstyle%3Dfor-the-badge%26logo%3Dnextdotjs%26logoColor%3Dwhite)" /\>
\<img alt="TypeScript" src="[https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)" /\>
\<img alt="Tailwind CSS" src="[https://img.shields.io/badge/Tailwind\_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-06B6D4%3Fstyle%3Dfor-the-badge%26logo%3Dtailwindcss%26logoColor%3Dwhite)" /\>
\<img alt="Vercel" src="[https://img.shields.io/badge/Deployed\_on-Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Deployed_on-Vercel-000000%3Fstyle%3Dfor-the-badge%26logo%3Dvercel%26logoColor%3Dwhite)" /\>
\<img alt="License" src="[https://img.shields.io/github/license/JoshuaViera/ai-qa-suite?style=for-the-badge\&color=blue](https://www.google.com/search?q=https://img.shields.io/github/license/JoshuaViera/ai-qa-suite%3Fstyle%3Dfor-the-badge%26color%3Dblue)" /\>
\</p\>

\<br /\>

\<p align="center"\>
\<img alt="AI QA Suite Demo" src="[YOUR\_PROJECT\_DEMO\_GIF\_HERE.gif]" /\>
\</p\>

## The Problem

Meet Sarah, a full-stack developer at a fast-moving startup. She loves building features, but every sprint, she hits the same wall. After shipping code, she spends hours:

  * Writing repetitive unit tests for new components.
  * Deciphering vague bug reports from Slack ("the modal is broken").
  * Debugging cryptic error messages from the CI/CD pipeline.

The constant context-switching kills her momentum and slows down the entire team. Developers lack a unified AI co-pilot for the tedious, repetitive parts of quality assurance.

## The Solution

AI QA Suite provides three essential tools in one clean interface to solve these exact problems.

-----

### 🧪 Test Generator

Instantly create production-ready unit tests from component code.

  * **Framework-Flexible:** Supports **Jest** and **Vitest** testing frameworks.
  * **Multi-Framework Components:** Works with **React**, **Vue**, and **Svelte**.
  * **Instant Examples:** Pre-loaded with examples for every framework combination so you can see it work in one click.

-----

### 🐛 Error Explainer

Transform cryptic errors into human-readable explanations and actionable fixes.

  * **QA-Focused Analysis:** Not just *the fix*, but *why* it breaks in a testing or production context.
  * **Prevention-Oriented:** Automatically suggests a unit test to catch this specific error before it happens again.
  * **Clear Structure:** "Why This Breaks" → "The Fix" → "Prevention Test".

-----

### 📋 Bug Formatter

Turn messy Slack messages or brain dumps into perfectly structured bug reports.

  * **Messy-to-Structured:** Transforms "the button on the home page is weird" into an actionable report.
  * **Issue-Tracker Ready:** Copy as clean markdown formatted for GitHub, Jira, or Linear.
  * **Smart Inference:** Intelligently fills in missing details (e.g., suggests steps to reproduce from a vague description).

-----

## Key Features

  * **Intelligent AI Integration:** Powered by Google Gemini 2.0 Flash for fast and accurate responses.
  * **Dynamic Prompt Adaptation:** The underlying AI prompt intelligently changes based on user's framework and testing library selections.
  * **One-Click Examples:** Example-driven inputs for every tool to demonstrate value immediately.
  * **Graceful Error Handling:** User-friendly messages for API failures or network issues.
  * **Client-Side Rate Limiting:** Cooldown mechanism to protect the API quota and prevent spam.
  * **Copy to Clipboard:** One-click copying of all generated code and reports.
  * **Fully Responsive Design:** Works seamlessly on desktop, tablet, and mobile.
  * **Professional UI:** Built with **shadcn/ui** and Tailwind CSS for a clean, accessible, and modern feel.

## Tech Stack & Architecture

| Category | Technology | Why I Chose It |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Provides Server Components for fast initial loads and API Routes for secure, server-side AI logic. |
| **Language** | **TypeScript** | Essential for type safety, especially when handling complex AI response objects and dynamic state. |
| **Styling** | **Tailwind CSS & shadcn/ui** | Tailwind allows for rapid, utility-first styling. shadcn/ui provides beautiful, accessible, and unopinionated components to build on. |
| **AI** | **Google Gemini 2.0 Flash** | The free tier is generous, and the model is perfectly suited for high-speed, structured code and text generation. |
| **API Logic** | **Next.js API Routes** | Keeps the Gemini API key secure on the server, preventing client-side exposure. |
| **Deployment** | **Vercel** | Offers a seamless, zero-config CI/CD pipeline perfectly integrated with Next.js. |

## What I Learned

This project was a deep dive into building a full-stack, AI-powered application. Key takeaways include:

  * **Dynamic Prompt Engineering:** I learned to construct and "build" complex prompts on the server by chaining user inputs (like framework, test library, and code) into one highly-specific instruction for the AI.
  * **Full-Stack State Management:** I managed the complete data flow, from client-side state (loading, error, cooldowns) to server-side API requests and back, ensuring the UI always reflects the current app state.
  * **API Design & Security:** I built a secure API endpoint that acts as a proxy to the Gemini API. This involved implementing rate-limiting, robust error handling, and protecting API keys using environment variables.
  * **Component-Based Architecture:** I used `shadcn/ui` to build a reusable, composable, and accessible component library, which allowed me to build the UI quickly and consistently.
  * **User-Centric Design:** I learned the importance of "demo-ability." Adding "Try Example" buttons dramatically improved the user experience, as it allows anyone (especially recruiters) to see the app's value without thinking of their own code to test.

## Getting Started

### Prerequisites

  * Node.js 18+
  * A Google Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JoshuaViera/ai-qa-suite.git
    cd ai-qa-suite
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your API key:

    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

## Project Structure

```
ai-qa-suite/
├── app/
│    ├── api/
│   │   └── generate/
│   │       └── route.ts         # Server-side API endpoint for AI
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TestGeneratorTab.tsx
│   │   ├── ErrorExplainerTab.tsx
│   │   └── BugFormatterTab.tsx
│   ├── lib/
│   │   ├── ai.ts                # Gemini API client setup
│   │   ├── prompts.ts           # Base AI prompt templates
│   │   ├── promptBuilder.ts     # Logic for dynamically building prompts
│   │   └── examples.ts          # Example data for one-click demos
│   ├── layout.tsx
│   └── page.tsx                 # Main page (contains all tabs)
├── components/ui/                 # shadcn/ui components
└── public/
```

## Product Roadmap (V2)

The missing piece is **visual design validation**. V2 will close the loop from **design → code → testing**.

### 🚀 Coming Soon: UI-to-Code Generator

Upload a design mockup (Figma screenshot, wireframe, or even a sketch) and receive:

  * Semantic HTML structure
  * Tailwind CSS styling
  * Accessible component code (React, Vue, or Svelte)

This will allow teams to validate whether the shipped UI *visually* matches the designer's vision, catching visual regressions before users do.

### V2 Technical Requirements

  * **Multimodal AI:** Upgrade to a model like Gemini 2.0 Pro or GPT-4o for image understanding.
  * **User Accounts:** Add Supabase or Clerk for authentication to save generation history.
  * **Persistent Storage:** Use a database (e.g., Supabase Postgres) to store past generations.

## Deployment

This project is deployed on Vercel with automatic deployments on every push to the `main` branch.

**Deploy your own version:**

[](https://www.google.com/search?q=https://vercel.com/new/clone%3Frepository-url%3Dhttps://github.com/JoshuaViera/ai-qa-suite%26env%3DGEMINI_API_KEY)

*Remember to add your `GEMINI_API_KEY` to Vercel's environment variables\!*

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## Contact

**Joshua Viera**

  * **GitHub:** [@JoshuaViera](https://github.com/JoshuaViera)
  