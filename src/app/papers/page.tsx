'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ExternalLink, 
  Filter,
  BookOpen,
  Star
} from 'lucide-react';
import papersData from '@/data/papers.json';

type Category = 'all' | 'derivatives' | 'portfolio' | 'factor-investing' | 'market-microstructure' | 'ml-finance' | 'risk-management' | 'fixed-income' | 'volatility';

const categoryLabels: Record<string, string> = {
  'derivatives': 'Derivatives',
  'portfolio': 'Portfolio',
  'factor-investing': 'Factor Investing',
  'market-microstructure': 'Microstructure',
  'ml-finance': 'ML & Finance',
  'risk-management': 'Risk',
  'fixed-income': 'Fixed Income',
  'volatility': 'Volatility',
};

const categoryColors: Record<string, string> = {
  'derivatives': 'bg-blue-500/10 text-blue-500',
  'portfolio': 'bg-green-500/10 text-green-500',
  'factor-investing': 'bg-purple-500/10 text-purple-500',
  'market-microstructure': 'bg-orange-500/10 text-orange-500',
  'ml-finance': 'bg-cyan-500/10 text-cyan-500',
  'risk-management': 'bg-red-500/10 text-red-500',
  'fixed-income': 'bg-yellow-500/10 text-yellow-500',
  'volatility': 'bg-pink-500/10 text-pink-500',
};

export default function PapersPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [readPapers, setReadPapers] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const saved = localStorage.getItem('quantpath-papers-read');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleRead = (id: string) => {
    const next = new Set(readPapers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setReadPapers(next);
    localStorage.setItem('quantpath-papers-read', JSON.stringify([...next]));
  };

  const filteredPapers = papersData.papers.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    return true;
  });

  const categories = [...new Set(papersData.papers.map((p) => p.category))];

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Research Papers</h1>
              <p className="text-orange-100 text-sm">Essential papers every quant should read</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-500/20 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              {readPapers.size} Read
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              {papersData.papers.length} Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('all')}
          className="text-xs"
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(cat as Category)}
            className="text-xs whitespace-nowrap"
          >
            {categoryLabels[cat] || cat}
          </Button>
        ))}
      </div>

      {/* Papers List */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => {
          const isRead = readPapers.has(paper.id);
          const colorClass = categoryColors[paper.category] || 'bg-gray-500/10 text-gray-500';

          return (
            <Card key={paper.id} className={`card-hover ${isRead ? 'border-green-500/20 bg-green-500/5' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRead(paper.id)}
                    className={`flex-shrink-0 h-8 w-8 p-0 ${isRead ? 'text-green-500' : 'text-muted-foreground'}`}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold">{paper.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {paper.authors} · {paper.year} · {paper.journal}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${colorClass} flex-shrink-0`}>
                    {categoryLabels[paper.category] || paper.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">{paper.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-medium">Why read:</span>
                  <span className="text-xs text-muted-foreground">{paper.whyRead}</span>
                </div>
                <div className="mt-3">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Read Paper
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
