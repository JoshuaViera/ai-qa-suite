'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestGeneratorTab } from './components/TestGeneratorTab';
import { ErrorExplainerTab } from './components/ErrorExplainerTab';
import { BugFormatterTab } from './components/BugFormatterTab';
import { StatsDashboard } from './components/StatsDashboard';
import { Code, AlertCircle, FileText, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('test-generator');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          AI-Powered Quality Assurance Tools
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate tests, explain errors, and format bug reports with AI assistance.
          Track your productivity and achievements.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] lg:mx-auto">
          <TabsTrigger value="test-generator" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Test Generator</span>
            <span className="sm:hidden">Tests</span>
          </TabsTrigger>
          <TabsTrigger value="error-explainer" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Error Explainer</span>
            <span className="sm:hidden">Errors</span>
          </TabsTrigger>
          <TabsTrigger value="bug-formatter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Bug Formatter</span>
            <span className="sm:hidden">Bugs</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
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

        <TabsContent value="stats" className="mt-6">
          <StatsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}