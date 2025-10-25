'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGenerationStats, Generation } from '@/lib/db/service';
import { 
  TrendingUp, 
  Zap, 
  Trophy, 
  Target,
  Code,
  AlertCircle,
  FileText,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface Stats {
  total: number;
  byType: Record<string, number>;
  totalInputLength: number;
  totalOutputLength: number;
  avgGenerationTime: number;
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byType: {},
    totalInputLength: 0,
    totalOutputLength: 0,
    avgGenerationTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getGenerationStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate derived metrics
  const timeSavedHours = Math.round((stats.total * 15) / 60 * 10) / 10; // Assume 15 min saved per generation
  const linesGenerated = Math.round(stats.totalOutputLength / 80); // Rough estimate
  const testsGenerated = stats.byType['test-generator'] || 0;
  const errorsFixed = stats.byType['error-explainer'] || 0;
  const bugsFormatted = stats.byType['bug-formatter'] || 0;

  // Achievements/Badges
  const achievements = [
    { 
      name: 'First Steps', 
      unlocked: stats.total >= 1, 
      icon: Sparkles,
      description: 'Generate your first output'
    },
    { 
      name: 'Getting Started', 
      unlocked: stats.total >= 5, 
      icon: Target,
      description: 'Generate 5 outputs'
    },
    { 
      name: 'Power User', 
      unlocked: stats.total >= 10, 
      icon: Zap,
      description: 'Generate 10 outputs'
    },
    { 
      name: 'Test Master', 
      unlocked: testsGenerated >= 5, 
      icon: Code,
      description: 'Generate 5 test suites'
    },
    { 
      name: 'Bug Hunter', 
      unlocked: errorsFixed >= 3, 
      icon: AlertCircle,
      description: 'Fix 3 errors'
    },
    { 
      name: 'Productivity Pro', 
      unlocked: stats.total >= 25, 
      icon: Trophy,
      description: 'Generate 25 outputs'
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const nextAchievement = achievements.find(a => !a.unlocked);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (stats.total === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No Stats Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Start using the AI QA Suite to see your productivity stats and achievements!
          </p>
          <Button onClick={loadStats} variant="outline" size="sm">
            Refresh Stats
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Generations</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-4xl font-bold mb-1">{timeSavedHours}h</div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-4xl font-bold mb-1">{linesGenerated}</div>
            <div className="text-sm text-muted-foreground">Lines Generated</div>
          </div>
        </div>
      </Card>

      {/* Breakdown by Feature */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded">
                <Code className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-2xl">{testsGenerated}</div>
                <div className="text-sm text-muted-foreground">Tests Generated</div>
              </div>
            </div>
            {testsGenerated > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  ~{Math.round(testsGenerated * 15)} min saved
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-2xl">{errorsFixed}</div>
                <div className="text-sm text-muted-foreground">Errors Explained</div>
              </div>
            </div>
            {errorsFixed > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  ~{Math.round(errorsFixed * 10)} min saved
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-2xl">{bugsFormatted}</div>
                <div className="text-sm text-muted-foreground">Bugs Formatted</div>
              </div>
            </div>
            {bugsFormatted > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  ~{Math.round(bugsFormatted * 5)} min saved
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </h3>
          <Badge variant="secondary">
            {unlockedCount} / {achievements.length}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.name}
                className={`border rounded-lg p-4 transition-all ${
                  achievement.unlocked
                    ? 'bg-primary/5 border-primary/20'
                    : 'opacity-50 grayscale'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${
                    achievement.unlocked 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      achievement.unlocked 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-1">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {nextAchievement && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>
                Next: <span className="font-medium text-foreground">{nextAchievement.name}</span> - {nextAchievement.description}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Average Generation Time</div>
            <div className="text-2xl font-semibold">
              {(stats.avgGenerationTime / 1000).toFixed(1)}s
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Characters Processed</div>
            <div className="text-2xl font-semibold">
              {(stats.totalInputLength + stats.totalOutputLength).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Average Input Size</div>
            <div className="text-2xl font-semibold">
              {stats.total > 0 ? Math.round(stats.totalInputLength / stats.total) : 0} chars
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Average Output Size</div>
            <div className="text-2xl font-semibold">
              {stats.total > 0 ? Math.round(stats.totalOutputLength / stats.total) : 0} chars
            </div>
          </div>
        </div>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadStats} variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh Statistics
        </Button>
      </div>
    </div>
  );
}