import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UiToCodeTab() {
  return (
    <Card className="p-6 opacity-50">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">UI-to-Code</h2>
        <Badge variant="secondary">Coming Soon</Badge>
      </div>
      <p className="text-muted-foreground">
        Upload a design mockup to generate HTML and CSS code.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        This feature will be available in V2 and requires multimodal AI capabilities.
      </p>
    </Card>
  );
}