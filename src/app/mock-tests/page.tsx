'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Timer,
  Dices,
  Hash,
  ListOrdered,
  Ruler,
  CandlestickChart,
  TrendingUp,
  History,
  Calculator,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { practiceModules } from '@/data/practice';
import { loadAttempts, type PracticeAttempt } from '@/lib/practice-types';
import { PracticeAnalytics } from '@/components/practice/PracticeAnalytics';

const moduleIcons: Record<string, React.ElementType> = {
  'beat-the-odds': Dices,
  'number-logic': Hash,
  'likelihood-list': ListOrdered,
  intervals: Ruler,
  orderbooks: CandlestickChart,
  'mental-math': Calculator,
};

const generalTips = [
  {
    title: 'Scoring management',
    body: 'Hampir semua modul: benar +1, salah −1, skip 0. Tebak hanya jika keyakinan > 50% (MCQ 4 opsi: > 25% sudah break-even, tapi margin error tinggi). Ragu total = skip.',
  },
  {
    title: 'Time-boxing',
    body: 'Set batas per soal SEBELUM mulai (BTO: 60s, NumberLogic: 45s). Lewat batas → skip tanpa nego. Satu soal susah tidak bernilai lebih dari dua soal mudah.',
  },
  {
    title: 'Hafalkan konstanta kunci',
    body: 'E[flips HH]=6, HT=4 · coupon collector 6 item=14.7 · birthday 23→50% · E|X−Y| uniform=1/3 · √(2n/π) untuk |H−T| · P(sum=7)=1/6 · fair gambler ruin = modal/target.',
  },
  {
    title: 'Simulasi kondisi asli',
    body: 'Latihan dengan timer ON, tanpa kalkulator (kecuali tes aslinya mengizinkan), sekali duduk penuh. Review SEMUA soal salah setelahnya — di situ belajarnya.',
  },
  {
    title: 'Kalibrasi interval',
    body: 'Untuk modul Intervals: target 90% hit rate. Kalau hit rate latihanmu < 70%, kamu overconfident — sistematis lebarkan bound 1.5–2×.',
  },
  {
    title: 'Malam sebelum tes',
    body: 'Jangan latihan berat H-1. Review konstanta + tidur cukup. Saat tes: baca aturan scoring TIAP modul — kalau beda dengan latihan ini, ikuti aturan resmi.',
  },
];

export default function PracticePage() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);

  useEffect(() => {
    setAttempts(loadAttempts());
  }, []);

  const bestFor = (moduleId: string) => {
    const rel = attempts.filter((a) => a.moduleId === moduleId);
    if (!rel.length) return null;
    return rel.reduce((best, a) => (a.score > best.score ? a : best));
  };

  const lastFor = (moduleId: string) => {
    const rel = attempts.filter((a) => a.moduleId === moduleId);
    return rel.length ? rel[rel.length - 1] : null;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Timer className="w-6 h-6 text-primary" />
          Test Practice
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Simulasi 6 modul assessment ala trading firm: probabilitas, deret angka, ranking
          likelihood, estimasi interval, order book, dan mental math. Timer dan scoring meniru
          format asli. Modul dengan ikon ∞ men-generate soal baru tiap attempt.
        </p>
      </div>

      {/* Modules */}
      <div className="grid gap-4 sm:grid-cols-2">
        {practiceModules.map((mod) => {
          const Icon = moduleIcons[mod.id] ?? Dices;
          const best = bestFor(mod.id);
          const last = lastFor(mod.id);
          return (
            <Card key={mod.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-5 h-5 text-primary" />
                  {mod.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{mod.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {mod.questions.length} soal
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {mod.timerMode === 'perQuestion'
                      ? `${mod.perQuestionSec}s/soal`
                      : `${Math.round((mod.globalSec ?? 0) / 60)} menit total`}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {mod.allowBack ? 'bisa kembali' : 'satu arah'}
                  </Badge>
                  {mod.generator && (
                    <Badge variant="secondary" className="text-[10px] text-primary flex items-center gap-0.5">
                      <InfinityIcon className="w-3 h-3" />
                      soal baru tiap attempt
                    </Badge>
                  )}
                </div>
                {(best || last) && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {best && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        Best: {best.score}/{best.maxScore}
                      </span>
                    )}
                    {last && (
                      <span className="flex items-center gap-1">
                        <History className="w-3.5 h-3.5" />
                        Terakhir: {last.score}/{last.maxScore}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-auto">
                  <Link href={`/mock-tests/${mod.id}`}>
                    <Button className="w-full" size="sm">
                      Latihan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics */}
      <PracticeAnalytics attempts={attempts} />

      {/* General strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Strategi Umum (baca sebelum latihan)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {generalTips.map((tip) => (
              <div key={tip.title} className="rounded-xl bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">{tip.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
