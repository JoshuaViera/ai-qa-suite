'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, Clock } from 'lucide-react';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import { toast } from 'sonner';

interface HistorySidebarProps {
  onSelectGeneration: (generation: any) => void;
}

export function HistorySidebar({ onSelectGeneration }: HistorySidebarProps) {
  const { generations, loading, removeGeneration } = useGenerationHistory();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeGeneration(id);
      toast.success('Generation deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSelect = (generation: any) => {
    onSelectGeneration(generation);
    setOpen(false);
    toast.info('Generation loaded');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-2 h-4 w-4" />
          History ({generations.length})
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Generation History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : generations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No history yet</p>
          ) : (
            <div className="space-y-3">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => handleSelect(gen)}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 rounded">
                        {gen.feature_type.replace('-', ' ')}
                      </span>
                      {gen.component_framework && (
                        <span className="text-xs text-muted-foreground">
                          {gen.component_framework}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(gen.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {gen.input_code.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(gen.created_at).toLocaleDateString()}
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