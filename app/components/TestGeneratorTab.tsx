import { Card } from "@/components/ui/card";

export function TestGeneratorTab() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Test Generator</h2>
      <p className="text-muted-foreground">
        Paste your code and select your framework to generate unit tests.
      </p>
    </Card>
  );
}