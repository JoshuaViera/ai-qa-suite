// app/components/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>AI QA Suite - Your intelligent partner for quality assurance</p>
          <div className="flex gap-4">
            {/* Fix was here: Added the opening <a> tag */}
            <a
              href="https://github.com/JoshuaViera/ai-qa-suite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}