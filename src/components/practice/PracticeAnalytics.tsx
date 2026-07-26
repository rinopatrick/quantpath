'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BarChart3, Crosshair, AlertTriangle, Timer } from 'lucide-react';
import type { PracticeAttempt } from '@/lib/practice-types';
import { practiceModules } from '@/data/practice';

const topicLabels: Record<string, string> = {
  ev: 'Expected value',
  bayes: 'Bayes / conditional',
  conditional: 'Conditional probability',
  dice: 'Dice',
  cards: 'Cards',
  binomial: 'Binomial',
  complement: 'Complement',
  symmetry: 'Symmetry',
  'random-walk': 'Random walk',
  coupon: 'Coupon collector',
  birthday: 'Birthday paradox',
  kelly: 'Kelly / betting',
  'geometry-prob': 'Geometric probability',
  sequences: 'Number sequences',
  likelihood: 'Likelihood ranking',
  calibration: 'Interval calibration',
  orderbook: 'Order books',
  'mm-addsub': 'Mental: +/−',
  'mm-mul': 'Mental: ×',
  'mm-div': 'Mental: ÷',
  'mm-pct': 'Mental: persen',
  'mm-frac': 'Mental: pecahan',
};

export function PracticeAnalytics({ attempts }: { attempts: PracticeAttempt[] }) {
  const stats = useMemo(() => {
    if (!attempts.length) return null;

    // --- score trend per module (last 8 attempts each) ---
    const byModule = new Map<string, PracticeAttempt[]>();
    for (const a of attempts) {
      const arr = byModule.get(a.moduleId) ?? [];
      arr.push(a);
      byModule.set(a.moduleId, arr);
    }

    // --- topic breakdown ---
    const topicAgg = new Map<string, { correct: number; wrong: number; skip: number; time: number; n: number }>();
    for (const a of attempts) {
      for (const r of a.results ?? []) {
        if (!r.topic) continue;
        const t = topicAgg.get(r.topic) ?? { correct: 0, wrong: 0, skip: 0, time: 0, n: 0 };
        t[r.outcome === 'correct' ? 'correct' : r.outcome === 'wrong' ? 'wrong' : 'skip'] += 1;
        t.time += r.timeSec;
        t.n += 1;
        topicAgg.set(r.topic, t);
      }
    }
    const topics = [...topicAgg.entries()]
      .map(([topic, t]) => {
        const attempted = t.correct + t.wrong;
        return {
          topic,
          label: topicLabels[topic] ?? topic,
          n: t.n,
          attempted,
          accuracy: attempted ? t.correct / attempted : null,
          skipRate: t.n ? t.skip / t.n : 0,
          avgTime: t.n ? t.time / t.n : 0,
        };
      })
      .filter((t) => t.n >= 3);

    const weakTopics = topics
      .filter((t) => t.attempted >= 2 && t.accuracy !== null && t.accuracy < 0.7)
      .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
      .slice(0, 5);

    // --- interval calibration ---
    const ivAttempts = attempts.filter((a) => a.moduleId === 'intervals');
    let ivHit = 0;
    let ivTotal = 0;
    for (const a of ivAttempts) {
      for (const r of a.results ?? []) {
        if (r.outcome === 'skip') continue;
        ivTotal += 1;
        if (r.outcome === 'correct') ivHit += 1;
      }
    }
    const calibration = ivTotal >= 5 ? ivHit / ivTotal : null;

    // --- pace ---
    const totalQuestions = attempts.reduce((s, a) => s + a.correct + a.wrong + a.skipped, 0);
    const totalTime = attempts.reduce((s, a) => s + (a.totalTimeSec ?? 0), 0);

    return { byModule, topics, weakTopics, calibration, ivTotal, totalQuestions, totalTime };
  }, [attempts]);

  if (!stats) return null;

  const moduleName = (id: string) => practiceModules.find((m) => m.id === id)?.name ?? id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Analytics Latihan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score trends */}
        <div className="space-y-3">
          {[...stats.byModule.entries()].map(([moduleId, arr]) => {
            const recent = arr.slice(-8);
            const maxScore = recent[0]?.maxScore || 1;
            return (
              <div key={moduleId}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground">{moduleName(moduleId)}</p>
                  <p className="text-[10px] text-muted-foreground">{arr.length} attempt</p>
                </div>
                <div className="flex items-end gap-1 h-10">
                  {recent.map((a, i) => {
                    const pct = Math.max(0.06, Math.max(0, a.score) / maxScore);
                    return (
                      <div
                        key={i}
                        title={`${a.score}/${a.maxScore} — ${new Date(a.date).toLocaleDateString()}`}
                        className={cn(
                          'flex-1 rounded-t-sm max-w-8',
                          a.score > 0 ? 'bg-primary/70' : 'bg-red-400/40'
                        )}
                        style={{ height: `${pct * 100}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weak topics */}
        {stats.weakTopics.length > 0 && (
          <div className="rounded-xl bg-muted/40 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Weak spots (akurasi &lt; 70%)
            </p>
            <div className="space-y-1.5">
              {stats.weakTopics.map((t) => (
                <div key={t.topic} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="font-mono text-red-400">
                    {Math.round((t.accuracy ?? 0) * 100)}% ({t.attempted} dijawab)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calibration + pace */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
              <Crosshair className="w-4 h-4 text-primary" />
              Kalibrasi Interval
            </p>
            {stats.calibration !== null ? (
              <>
                <p
                  className={cn(
                    'text-xl font-bold',
                    stats.calibration >= 0.8 ? 'text-green-400' : stats.calibration >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                  )}
                >
                  {Math.round(stats.calibration * 100)}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  hit rate ({stats.ivTotal} soal) · target ~90%.{' '}
                  {stats.calibration < 0.7 ? 'Overconfident — lebarkan interval ~2×.' : stats.calibration > 0.95 ? 'Terlalu lebar — persempit demi skor.' : 'Cukup terkalibrasi.'}
                </p>
              </>
            ) : (
              <p className="text-[10px] text-muted-foreground">Kerjakan ≥5 soal Intervals dulu.</p>
            )}
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
              <Timer className="w-4 h-4 text-primary" />
              Volume
            </p>
            <p className="text-xl font-bold text-foreground">{stats.totalQuestions}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              soal dikerjakan · {Math.round(stats.totalTime / 60)} menit total
            </p>
          </div>
        </div>

        {/* All topics table */}
        {stats.topics.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Akurasi per topik
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {stats.topics
                .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))
                .map((t) => (
                  <div key={t.topic} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground truncate mr-2">{t.label}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      {t.accuracy !== null ? (
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] font-mono',
                            t.accuracy >= 0.8 ? 'text-green-400' : t.accuracy >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                          )}
                        >
                          {Math.round(t.accuracy * 100)}%
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">semua di-skip</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground font-mono">{Math.round(t.avgTime)}s</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
