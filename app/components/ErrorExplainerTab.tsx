import { Card } from "@/components/ui/card";

export function ErrorExplainerTab() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Error Explainer</h2>
      <p className="text-muted-foreground">
        Paste your broken code and error message to get an explanation and fix.
      </p>
    </Card>
  );
}