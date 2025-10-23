import { Card } from "@/components/ui/card";

export function BugFormatterTab() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Bug Formatter</h2>
      <p className="text-muted-foreground">
        Paste messy feedback to get a structured bug report.
      </p>
    </Card>
  );
}