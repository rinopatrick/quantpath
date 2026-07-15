'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Copy, 
  Check,
  Code,
  Database,
  Table,
  BarChart,
  Sigma,
  TrendingUp,
  DollarSign,
  Brain
} from 'lucide-react';
import cheatSheetsData from '@/data/cheat-sheets.json';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Database,
  Table,
  BarChart,
  Sigma,
  TrendingUp,
  DollarSign,
  Brain,
};

export default function ReferencePage() {
  const [selectedCategory, setSelectedCategory] = useState('python');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedSheet = cheatSheetsData.categories.find((c) => c.id === selectedCategory);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Quick Reference</h1>
              <p className="text-teal-100 text-sm">Cheat sheets for Python, NumPy, Pandas, and more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {cheatSheetsData.categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Code;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {cat.title}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {selectedSheet && (
        <div className="grid gap-4 md:grid-cols-2">
          {selectedSheet.items.map((item, index) => (
            <Card key={index} className="card-hover overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-bold truncate">{item.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.code, index)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto max-w-full">
                  <code className="text-sm font-mono break-words whitespace-pre-wrap">{item.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
