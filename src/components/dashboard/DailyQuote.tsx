'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import quotesData from '@/data/quotes.json';

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function DailyQuote() {
  const quote = useMemo(() => {
    const dayIndex = getDayOfYear() % quotesData.length;
    return quotesData[dayIndex];
  }, []);

  return (
    <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-none">
      <CardContent className="p-4 md:p-5">
        <div className="flex gap-3">
          <Quote className="h-5 w-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium text-foreground/70">
              — {quote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
