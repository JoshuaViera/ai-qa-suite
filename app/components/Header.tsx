import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">AI QA Suite</h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent partner for quality assurance
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}