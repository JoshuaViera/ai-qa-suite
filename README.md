# AI QA Suite

A unified AI-powered toolkit for developers and QA teams, designed to accelerate software quality assurance by automating test generation, error debugging, and bug report formatting.

🔗 **Live Demo:** [https://ai-qa-suite.vercel.app](https://ai-qa-suite.vercel.app)

![AI QA Suite](https://img.shields.io/badge/Next.js-16.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

## The Problem

Meet Sarah, a full-stack developer at a fast-moving startup. She loves building features, but every sprint, she hits the same wall: after shipping code, she spends hours writing unit tests, deciphering vague bug reports from Slack, and debugging cryptic error messages. The constant context-switching kills her momentum and slows down the entire team.

**The root issue:** Developers lack a unified AI co-pilot for the tedious, repetitive aspects of quality assurance.

## The Solution

AI QA Suite provides three essential tools in one interface:

### 🧪 Test Generator
- **Framework-Flexible:** Supports Jest and Vitest testing frameworks
- **Multi-Framework Components:** Works with React, Vue, and Svelte
- **Production-Ready Output:** Generates tests following best practices
- **Instant Examples:** Pre-loaded use cases for every framework combination

### 🐛 Error Explainer  
- **QA-Focused Analysis:** Not just a fix, but an explanation of why it breaks in testing/production
- **Prevention-Oriented:** Suggests unit tests to catch errors before deployment
- **Clear Structure:** "Why This Breaks" → "The Fix" → "Prevention Test"

### 📋 Bug Formatter
- **Messy-to-Structured:** Transforms vague Slack messages into actionable bug reports
- **Issue-Tracker Ready:** Copy as markdown for GitHub, Jira, or Linear
- **Smart Inference:** Makes reasonable assumptions from incomplete information

## Features (V1)

✅ **Intelligent AI Integration** - Powered by Google Gemini 2.0 Flash  
✅ **Framework Selection** - Dynamic prompt adaptation based on user choices  
✅ **Example-Driven** - One-click examples for immediate testing  
✅ **Error Handling** - Graceful failures with user-friendly messages  
✅ **Rate Limiting** - Client-side cooldown to protect API quota  
✅ **Copy to Clipboard** - One-click copying of all generated content  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Professional UI** - Built with shadcn/ui and Tailwind CSS  

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **AI:** Google Gemini 2.0 Flash API (free tier)
- **Deployment:** Vercel with automatic CI/CD
- **Version Control:** Git with feature branch workflow

### Why This Stack?

- **Next.js** provides server and client rendering flexibility for optimal UX
- **TypeScript** ensures type safety across complex state management
- **shadcn/ui** delivers accessible, production-grade components without runtime overhead
- **Gemini's free tier** makes this 100% cost-free to run and demo

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/JoshuaViera/ai-qa-suite.git
cd ai-qa-suite
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## Project Structure
```
ai-qa-suite/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # AI API endpoint
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TestGeneratorTab.tsx
│   │   ├── ErrorExplainerTab.tsx
│   │   ├── BugFormatterTab.tsx
│   │   └── UiToCodeTab.tsx       # V2 Preview
│   ├── lib/
│   │   ├── ai.ts                 # Gemini API integration
│   │   ├── prompts.ts            # AI prompt templates
│   │   ├── promptBuilder.ts      # Dynamic prompt construction
│   │   └── examples.ts           # Example data
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/                # shadcn/ui components
└── public/
```

## Usage Examples

### Test Generator
1. Select your test framework (Jest or Vitest)
2. Select your component framework (React, Vue, or Svelte)
3. Paste your component code or click "Try Example"
4. Click "Generate Tests"
5. Copy the generated tests to your test file

### Error Explainer
1. Paste your broken code
2. Paste the error message or stack trace
3. Click "Explain & Fix"
4. Review the three-section analysis: Why, Fix, and Prevention Test

### Bug Formatter
1. Paste messy feedback from Slack, email, or user reports
2. Click "Format Bug Report"
3. Get a structured markdown report with Title, Description, Steps to Reproduce, Expected/Actual Behavior, and Notes
4. Copy directly to your issue tracker

## Product Roadmap

### V2: Completing the QA Loop

The missing piece of the quality assurance puzzle is **visual design validation**.

**Coming Soon: UI-to-Code Generator**

Upload a design mockup (Figma screenshot, wireframe, hand-drawn sketch) and get:
- Semantic HTML structure
- Tailwind CSS styling
- Accessible component code

### Why V2 Matters

This closes the loop from **design → code → testing**. Teams can validate whether their shipped UI matches the designer's vision, catching visual regressions before users do.

### What V2 Requires

- **Multimodal AI:** Upgrade to Gemini 2.0 Pro or GPT-4 Vision for image understanding
- **User Accounts:** Supabase authentication to save generation history and uploaded images
- **Persistent Storage:** Database to store past generations for comparison and iteration
- **Cost Considerations:** Multimodal models have limited free tiers, requiring rate limiting or a freemium model

## What I Learned

Building this project taught me:

- **Dynamic Prompt Engineering:** Adapting AI behavior based on user selections without separate API calls
- **State Management Patterns:** Handling loading, error, and cooldown states across multiple features
- **API Design Best Practices:** Rate limiting, error handling, and graceful degradation
- **Professional Git Workflow:** Feature branches, pull requests, and clean commit history
- **Building for Demo-ability:** The importance of "Try Example" buttons for instant user engagement
- **Working with AI APIs:** Navigating model versions, API endpoints, and authentication challenges
- **User Experience Focus:** Creating intuitive interfaces that minimize friction and maximize value

## Performance

- **Fast Response Times:** Average AI generation in 2-5 seconds
- **Optimized Bundle:** Next.js automatic code splitting
- **Edge Deployment:** Vercel Edge Network for global low latency
- **Zero Cost:** Runs entirely on free tiers (Gemini API + Vercel)

## Deployment

This project is deployed on Vercel with automatic deployments on every push to `main`.

**Deploy your own:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JoshuaViera/ai-qa-suite)

Remember to add your `GEMINI_API_KEY` to Vercel's environment variables!

## Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or reach out directly.

## License

MIT

## Acknowledgments

- Google Gemini API for powerful AI capabilities
- shadcn/ui for beautiful, accessible components
- Vercel for seamless deployment
- The open-source community for inspiration

## Contact

**Joshua Viera**
- GitHub: [@JoshuaViera](https://github.com/JoshuaViera)
- LinkedIn: [linkedin.com/in/joshuaviera](https://www.linkedin.com/in/joshuaviera/)
- Live Demo: [ai-qa-suite.vercel.app](https://ai-qa-suite.vercel.app)

---

Built with ❤️ as a portfolio project demonstrating full-stack development, AI integration, and product thinking