'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Layers,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Shuffle,
  Filter,
} from 'lucide-react';
import flashcardsJson from '@/data/flashcards.json';

type Flashcard = {
  id: string;
  category: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

const flashcardsData = flashcardsJson as Flashcard[];

const STORAGE_KEY = 'quantpath-flashcards-mastered';

const categoryMeta: Record<string, { label: string; color: string }> = {
  probability: { label: 'Probability', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  finance: { label: 'Finance', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  formulas: { label: 'Formulas', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  brainteasers: { label: 'Brainteasers', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  medium: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  hard: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export default function FlashcardsPage() {
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [needsReview, setNeedsReview] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMastered(new Set(parsed.mastered || []));
        setNeedsReview(new Set(parsed.needsReview || []));
      }
    } catch {}
  }, []);

  const saveState = useCallback((m: Set<string>, r: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mastered: Array.from(m),
        needsReview: Array.from(r),
      }));
    } catch {}
  }, []);

  const cards: Flashcard[] = selectedCategory
    ? flashcardsData.filter((c) => c.category === selectedCategory)
    : flashcardsData;

  const currentCard = cards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleEasy = () => {
    const newMastered = new Set(mastered);
    const newReview = new Set(needsReview);
    newMastered.add(currentCard.id);
    newReview.delete(currentCard.id);
    setMastered(newMastered);
    setNeedsReview(newReview);
    saveState(newMastered, newReview);
    goToNext();
  };

  const handleHard = () => {
    const newReview = new Set(needsReview);
    const newMastered = new Set(mastered);
    newReview.add(currentCard.id);
    newMastered.delete(currentCard.id);
    setNeedsReview(newReview);
    setMastered(newMastered);
    saveState(newMastered, newReview);
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handleReset = () => {
    setMastered(new Set());
    setNeedsReview(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
    saveState(new Set(), new Set());
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * cards.length));
  };

  const masteredCount = cards.filter((c) => mastered.has(c.id)).length;
  const reviewCount = cards.filter((c) => needsReview.has(c.id)).length;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Flashcards</h1>
              <p className="text-blue-100 text-sm">Spaced repetition practice for quant concepts</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              {masteredCount} Mastered
            </Badge>
            <Badge variant="secondary" className="bg-white/15 text-white/90 border-0">
              <XCircle className="h-3 w-3 mr-1" />
              {reviewCount} Review
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              {cards.length} Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {selectedCategory ? categoryMeta[selectedCategory]?.label : 'All Categories'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShuffle} className="gap-2">
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {/* Category Filter */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setSelectedCategory(null); setCurrentIndex(0); setIsFlipped(false); }}
          >
            All
          </Button>
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedCategory(key); setCurrentIndex(0); setIsFlipped(false); }}
            >
              {meta.label}
            </Button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent progress-animated rounded-full"
          style={{ width: `${cards.length > 0 ? (masteredCount / cards.length) * 100 : 0}%` }}
        />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="flex justify-center">
          <div
            className="w-full max-w-2xl cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={handleFlip}
          >
            <div
              className="relative w-full transition-transform duration-500 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: '280px',
              }}
            >
              {/* Front */}
              <Card
                className="absolute inset-0 card-hover"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardContent className="flex flex-col h-full p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={categoryMeta[currentCard.category]?.color}>
                      {categoryMeta[currentCard.category]?.label}
                    </Badge>
                    <Badge variant="outline" className={difficultyColors[currentCard.difficulty]}>
                      {currentCard.difficulty}
                    </Badge>
                    {mastered.has(currentCard.id) && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mastered
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-lg md:text-xl font-semibold text-center leading-relaxed">
                      {currentCard.front}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Tap to reveal answer
                  </p>
                </CardContent>
              </Card>

              {/* Back */}
              <Card
                className="absolute inset-0 card-hover border-primary/30"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CardContent className="flex flex-col h-full p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Answer
                    </Badge>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-base md:text-lg text-center leading-relaxed text-foreground/90">
                      {currentCard.back}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Rate your recall below
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleHard}
          className="gap-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
        >
          <XCircle className="h-5 w-5" />
          Hard
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={goToNext}
          className="gap-2"
        >
          <ChevronRight className="h-5 w-5" />
          Next
        </Button>
        <Button
          size="lg"
          onClick={handleEasy}
          className="gap-2"
        >
          <CheckCircle className="h-5 w-5" />
          Easy
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(categoryMeta).map(([key, meta]) => {
          const catCards = flashcardsData.filter((c) => c.category === key);
          const catMastered = catCards.filter((c) => mastered.has(c.id)).length;
          const pct = catCards.length > 0 ? Math.round((catMastered / catCards.length) * 100) : 0;
          return (
            <Card
              key={key}
              className={`card-hover cursor-pointer ${selectedCategory === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => { setSelectedCategory(selectedCategory === key ? null : key); setCurrentIndex(0); setIsFlipped(false); }}
            >
              <CardContent className="p-4">
                <p className="text-sm font-semibold">{meta.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {catMastered}/{catCards.length} mastered
                </p>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full progress-animated"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
