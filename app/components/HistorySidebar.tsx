'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, Clock, Code, AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import { Generation } from '@/lib/db/service';
import { toast } from 'sonner';

interface HistorySidebarProps {
  onSelectGeneration?: (generation: Generation) => void;
  autoRefresh?: boolean;
}

export function HistorySidebar({ onSelectGeneration, autoRefresh = true }: HistorySidebarProps) {
  const { generations, loading, removeGeneration, refresh } = useGenerationHistory();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh every 5 seconds when sidebar is open
  useEffect(() => {
    if (!open || !autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [open, autoRefresh, refresh]);

  // Listen for custom events to trigger refresh
  useEffect(() => {
    const handleNewGeneration = () => {
      refresh();
    };

    window.addEventListener('generation-created', handleNewGeneration);
    return () => window.removeEventListener('generation-created', handleNewGeneration);
  }, [refresh]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeGeneration(id);
      toast.success('Generation deleted');
    } catch (error) {
      toast.error('Failed to delete generation');
    }
  };

  const handleSelect = (generation: Generation) => {
    if (onSelectGeneration) {
      onSelectGeneration(generation);
      setOpen(false);
      toast.info('Generation loaded');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 500);
    toast.success('History refreshed');
  };

  const getFeatureIcon = (featureType: string) => {
    switch (featureType) {
      case 'test-generator':
        return <Code className="h-4 w-4" />;
      case 'error-explainer':
        return <AlertCircle className="h-4 w-4" />;
      case 'bug-formatter':
        return <FileText className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getFeatureLabel = (featureType: string) => {
    switch (featureType) {
      case 'test-generator':
        return 'Test Generator';
      case 'error-explainer':
        return 'Error Explainer';
      case 'bug-formatter':
        return 'Bug Formatter';
      default:
        return featureType;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <History className="mr-2 h-4 w-4" />
          History
          {generations.length > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
              {generations.length}
            </span>
          )}
          {autoRefresh && open && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Generation History</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <SheetDescription>
            {autoRefresh && 'Auto-refreshing every 5 seconds • '}
            Your recent AI generations
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading history...</p>
              </div>
            </div>
          ) : generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No history yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Generate your first test, explain an error, or format a bug report to see your history here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => handleSelect(gen)}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded">
                        {getFeatureIcon(gen.feature_type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {getFeatureLabel(gen.feature_type)}
                        </p>
                        {(gen.component_framework || gen.backend_language) && (
                          <p className="text-xs text-muted-foreground">
                            {gen.component_framework || gen.backend_language}
                            {gen.test_framework && ` • ${gen.test_framework}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={(e) => handleDelete(gen.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-mono text-xs">
                    {gen.input_code.substring(0, 120)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(gen.created_at)}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{gen.input_length} chars in</span>
                      <span>•</span>
                      <span>{gen.output_length} chars out</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}