// app/components/Header.tsx

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">AI QA Suite</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your intelligent partner for quality assurance
          </p>
        </div>
      </div>
    </header>
  );
}