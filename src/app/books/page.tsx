'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookMarked, 
  ExternalLink,
  Filter,
  BookOpen,
  Brain,
  TrendingUp,
  Code,
  Shield,
  BarChart3
} from 'lucide-react';
import booksData from '@/data/books.json';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  derivatives: TrendingUp,
  mathematics: Brain,
  'machine-learning': Code,
  interview: BookOpen,
  trading: BarChart3,
  'risk-management': Shield,
};

const categoryColors: Record<string, string> = {
  derivatives: 'text-orange-400',
  mathematics: 'text-blue-400',
  'machine-learning': 'text-purple-400',
  interview: 'text-green-400',
  trading: 'text-yellow-400',
  'risk-management': 'text-red-400',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const categories = Array.from(new Set(booksData.books.map((b) => b.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredBooks = booksData.books.filter((book) => {
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || book.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6 page-enter">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <BookMarked className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Book Recommendations</h1>
              <p className="text-orange-100 text-sm">Essential reading for quantitative finance</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {booksData.books.length} Books
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {categories.length} Categories
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filter:
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat.replace('-', ' ')}
            </Button>
          ))}
        </div>

        <div className="w-px h-6 bg-border hidden md:block" />

        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <Button
              key={diff}
              variant={selectedDifficulty === diff ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
              className="capitalize"
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredBooks.map((book, index) => {
          const Icon = categoryIcons[book.category] || BookOpen;
          return (
            <Card key={book.id} className={`card-hover animate-in stagger-${(index % 6) + 1}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-5 w-5 ${categoryColors[book.category] || 'text-amber-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight">{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                    </div>
                  </div>
                  <Badge className={`${difficultyColors[book.difficulty]} text-white border-0 flex-shrink-0`}>
                    {book.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{book.description}</p>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-semibold text-amber-500 mb-1">Why It Matters</p>
                  <p className="text-xs text-muted-foreground">{book.whyImportant}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="secondary" className="capitalize">
                    {book.category.replace('-', ' ')}
                  </Badge>
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    View on Amazon <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books match filters</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your category or difficulty filters
            </p>
            <Button onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
