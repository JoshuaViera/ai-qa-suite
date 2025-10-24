// app/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestGeneratorTab } from "./components/TestGeneratorTab";
import { ErrorExplainerTab } from "./components/ErrorExplainerTab";
import { BugFormatterTab } from "./components/BugFormatterTab";
import { UiToCodeTab } from "./components/UiToCodeTab";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="test-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test-generator">Test Generator</TabsTrigger>
          <TabsTrigger value="error-explainer">Error Explainer</TabsTrigger>
          <TabsTrigger value="bug-formatter">Bug Formatter</TabsTrigger>
          <TabsTrigger value="ui-to-code" disabled>
            UI-to-Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test-generator" className="mt-6">
          <TestGeneratorTab />
        </TabsContent>

        <TabsContent value="error-explainer" className="mt-6">
          <ErrorExplainerTab />
        </TabsContent>

        <TabsContent value="bug-formatter" className="mt-6">
          <BugFormatterTab />
        </TabsContent>

        <TabsContent value="ui-to-code" className="mt-6">
          <UiToCodeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}