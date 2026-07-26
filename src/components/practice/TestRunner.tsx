'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Clock,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RotateCcw,
  Flag,
} from 'lucide-react';
import type {
  PracticeQuestion,
  AnswerRecord,
  OrderBookData,
  RankingQuestion,
} from '@/lib/practice-types';
import { gradeQuestion, isAnswered, saveAttempt } from '@/lib/practice-types';
import { getModule } from '@/data/practice';

// ---------- Order book display ----------

function OrderBookView({ book }: { book: OrderBookData }) {
  const maxRows = Math.max(book.bids.length, book.asks.length);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {book.label && (
        <div className="px-3 py-1.5 bg-muted/50 text-xs font-semibold text-foreground border-b border-border">
          {book.label}
        </div>
      )}
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="px-2 py-1 text-left font-medium">Bid Size</th>
            <th className="px-2 py-1 text-left font-medium text-green-400">Bid</th>
            <th className="px-2 py-1 text-right font-medium text-red-400">Ask</th>
            <th className="px-2 py-1 text-right font-medium">Ask Size</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="px-2 py-1 text-left text-muted-foreground">{book.bids[i]?.size ?? ''}</td>
              <td className="px-2 py-1 text-left text-green-400">{book.bids[i]?.price ?? ''}</td>
              <td className="px-2 py-1 text-right text-red-400">{book.asks[i]?.price ?? ''}</td>
              <td className="px-2 py-1 text-right text-muted-foreground">{book.asks[i]?.size ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Ranking input ----------

function RankingInput({
  question,
  value,
  onChange,
}: {
  question: RankingQuestion;
  value: number[] | null;
  onChange: (order: number[] | null) => void;
}) {
  const order = value ?? [];
  const toggle = (idx: number) => {
    if (order.includes(idx)) {
      onChange(order.filter((v) => v !== idx).length ? order.filter((v) => v !== idx) : null);
    } else {
      const next = [...order, idx];
      onChange(next);
    }
  };
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Klik sesuai urutan: pertama = paling mungkin, terakhir = paling tidak mungkin. Klik lagi untuk batal.
      </p>
      {question.items.map((item, idx) => {
        const pos = order.indexOf(idx);
        return (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all',
              pos >= 0
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                pos >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {pos >= 0 ? pos + 1 : '·'}
            </span>
            {item}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Main runner ----------

type Phase = 'intro' | 'running' | 'results';

export function TestRunner({ moduleId }: { moduleId: string }) {
  const mod = getModule(moduleId)!;
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [locked, setLocked] = useState<Set<string>>(new Set()); // per-question mode: submitted/skipped questions
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const questionStartRef = useRef<number>(0);
  const [numericInput, setNumericInput] = useState('');
  const [lowerInput, setLowerInput] = useState('');
  const [upperInput, setUpperInput] = useState('');
  // Freshly generated questions per attempt when module has a generator
  const [generated, setGenerated] = useState<PracticeQuestion[] | null>(null);

  const questions = generated ?? mod.questions;
  const q: PracticeQuestion = questions[current];
  const perQuestion = mod.timerMode === 'perQuestion';

  const recordTime = useCallback(
    (qid: string) => {
      const elapsed = (Date.now() - questionStartRef.current) / 1000;
      setQuestionTimes((prev) => ({ ...prev, [qid]: (prev[qid] ?? 0) + elapsed }));
      questionStartRef.current = Date.now();
    },
    []
  );

  const commitLocalInputs = useCallback(() => {
    if (!q) return;
    if (q.type === 'numeric') {
      const v = numericInput.trim() === '' ? null : Number(numericInput);
      setAnswers((prev) => ({
        ...prev,
        [q.id]: { kind: 'numeric', value: v !== null && Number.isFinite(v) ? v : null },
      }));
    } else if (q.type === 'interval') {
      const lo = lowerInput.trim() === '' ? null : Number(lowerInput);
      const hi = upperInput.trim() === '' ? null : Number(upperInput);
      setAnswers((prev) => ({
        ...prev,
        [q.id]: {
          kind: 'interval',
          lower: lo !== null && Number.isFinite(lo) ? lo : null,
          upper: hi !== null && Number.isFinite(hi) ? hi : null,
        },
      }));
    }
  }, [q, numericInput, lowerInput, upperInput]);

  // load local inputs when question changes
  useEffect(() => {
    if (!q) return;
    const rec = answers[q.id];
    if (q.type === 'numeric') {
      setNumericInput(rec && rec.kind === 'numeric' && rec.value !== null ? String(rec.value) : '');
    } else if (q.type === 'interval') {
      setLowerInput(rec && rec.kind === 'interval' && rec.lower !== null ? String(rec.lower) : '');
      setUpperInput(rec && rec.kind === 'interval' && rec.upper !== null ? String(rec.upper) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  const finish = useCallback(() => {
    // capture current inputs before grading
    commitLocalInputs();
    recordTime(q?.id ?? '');
    setPhase('results');
  }, [commitLocalInputs, recordTime, q]);

  const goTo = useCallback(
    (idx: number) => {
      commitLocalInputs();
      recordTime(q.id);
      if (idx >= questions.length) {
        setPhase('results');
      } else {
        setCurrent(idx);
        if (perQuestion) setTimeLeft(mod.perQuestionSec ?? 90);
      }
    },
    [commitLocalInputs, recordTime, q, questions.length, perQuestion, mod.perQuestionSec]
  );

  const submitCurrent = useCallback(() => {
    setLocked((prev) => new Set(prev).add(q.id));
    goTo(current + 1);
  }, [q, current, goTo]);

  const skipCurrent = useCallback(() => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
    setNumericInput('');
    setLowerInput('');
    setUpperInput('');
    setLocked((prev) => new Set(prev).add(q.id));
    // avoid commitLocalInputs re-adding: goTo commits, but inputs cleared
    recordTime(q.id);
    if (current + 1 >= questions.length) {
      setPhase('results');
    } else {
      setCurrent(current + 1);
      if (perQuestion) setTimeLeft(mod.perQuestionSec ?? 90);
    }
  }, [q, current, questions.length, perQuestion, mod.perQuestionSec, recordTime]);

  // timer
  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // handle timeout
  useEffect(() => {
    if (phase !== 'running' || timeLeft > 0) return;
    if (perQuestion) {
      // per-question timeout → auto move on (counts as skip if unanswered)
      setLocked((prev) => new Set(prev).add(q.id));
      goTo(current + 1);
    } else {
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const start = () => {
    if (mod.generator) setGenerated(mod.generator());
    setAnswers({});
    setLocked(new Set());
    setQuestionTimes({});
    setCurrent(0);
    setTimeLeft(perQuestion ? mod.perQuestionSec ?? 90 : mod.globalSec ?? 1500);
    questionStartRef.current = Date.now();
    setPhase('running');
  };

  // results
  const results = useMemo(() => {
    if (phase !== 'results') return null;
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const detail = questions.map((question) => {
      const outcome = gradeQuestion(question, answers[question.id]);
      if (outcome === 'correct') {
        score += mod.scoring.correct;
        correct++;
      } else if (outcome === 'wrong') {
        score += mod.scoring.wrong;
        wrong++;
      } else {
        score += mod.scoring.skip;
        skipped++;
      }
      return { question, outcome, rec: answers[question.id] };
    });
    return { score, correct, wrong, skipped, detail };
  }, [phase, questions, answers, mod.scoring]);

  // save attempt once on results
  const savedRef = useRef(false);
  useEffect(() => {
    if (phase === 'results' && results && !savedRef.current) {
      savedRef.current = true;
      const totalTime = Object.values(questionTimes).reduce((a, b) => a + b, 0);
      saveAttempt({
        moduleId: mod.id,
        date: new Date().toISOString(),
        score: results.score,
        maxScore: questions.length * mod.scoring.correct,
        correct: results.correct,
        wrong: results.wrong,
        skipped: results.skipped,
        totalTimeSec: Math.round(totalTime),
        results: results.detail.map((d) => ({
          questionId: d.question.id,
          outcome: d.outcome,
          timeSec: Math.round(questionTimes[d.question.id] ?? 0),
          topic: d.question.topic,
        })),
      });
    }
    if (phase !== 'results') savedRef.current = false;
  }, [phase, results, mod, questions.length, questionTimes]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ---------- intro ----------
  if (phase === 'intro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            {mod.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{mod.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{questions.length} soal</Badge>
            <Badge variant="secondary">
              {perQuestion ? `${mod.perQuestionSec}s / soal` : `${fmt(mod.globalSec ?? 0)} total`}
            </Badge>
            <Badge variant="secondary">
              +{mod.scoring.correct} / {mod.scoring.wrong} / {mod.scoring.skip}
            </Badge>
            <Badge variant="secondary">{mod.allowBack ? 'Bisa kembali' : 'Tidak bisa kembali'}</Badge>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Tips cepat</p>
            <ul className="space-y-1.5">
              {mod.tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary shrink-0">▸</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={start} className="w-full">
            Mulai Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ---------- results ----------
  if (phase === 'results' && results) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hasil — {mod.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold text-foreground">{results.score}</p>
                <p className="text-xs text-muted-foreground">Skor</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold text-green-400">{results.correct}</p>
                <p className="text-xs text-muted-foreground">Benar</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold text-red-400">{results.wrong}</p>
                <p className="text-xs text-muted-foreground">Salah</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-2xl font-bold text-muted-foreground">{results.skipped}</p>
                <p className="text-xs text-muted-foreground">Skip</p>
              </div>
            </div>
            <Button onClick={start} variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Ulangi Test
            </Button>
          </CardContent>
        </Card>

        {results.detail.map(({ question, outcome, rec }, i) => (
          <Card key={question.id}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-start gap-2">
                {outcome === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : outcome === 'wrong' ? (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {question.prompt}
                  </p>
                  {question.type === 'orderbook-mcq' && (
                    <div className="grid gap-2 sm:grid-cols-2 py-1">
                      {question.books.map((b, bi) => (
                        <OrderBookView key={bi} book={b} />
                      ))}
                    </div>
                  )}
                  {(question.type === 'mcq' || question.type === 'orderbook-mcq') && (
                    <p className="text-xs text-muted-foreground">
                      Jawaban benar: <span className="text-green-400">{question.options[question.answerIndex]}</span>
                      {rec && rec.kind === 'mcq' && rec.choice !== null && rec.choice !== question.answerIndex && (
                        <> · Jawabanmu: <span className="text-red-400">{question.options[rec.choice]}</span></>
                      )}
                    </p>
                  )}
                  {question.type === 'numeric' && (
                    <p className="text-xs text-muted-foreground">
                      Jawaban benar: <span className="text-green-400">{question.answer}</span>
                      {rec && rec.kind === 'numeric' && rec.value !== null && (
                        <> · Jawabanmu: <span className={outcome === 'correct' ? 'text-green-400' : 'text-red-400'}>{rec.value}</span></>
                      )}
                    </p>
                  )}
                  {question.type === 'ranking' && (
                    <p className="text-xs text-muted-foreground">
                      Urutan benar:{' '}
                      <span className="text-green-400">
                        {question.correctOrder.map((idx) => question.items[idx]).join(' → ')}
                      </span>
                    </p>
                  )}
                  {question.type === 'interval' && (
                    <p className="text-xs text-muted-foreground">
                      Nilai sebenarnya: <span className="text-green-400">{question.trueValue} {question.unit}</span>
                      {rec && rec.kind === 'interval' && rec.lower !== null && rec.upper !== null && (
                        <> · Intervalmu: [{rec.lower}, {rec.upper}]</>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ---------- running ----------
  const rec = answers[q.id];
  const answeredCount = questions.filter((qq) => isAnswered(answers[qq.id]) || locked.has(qq.id)).length;

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">
            {current + 1} / {questions.length}
          </Badge>
          <span
            className={cn(
              'flex items-center gap-1.5 font-mono font-semibold',
              timeLeft <= 10 ? 'text-red-400' : 'text-foreground'
            )}
          >
            <Clock className="w-4 h-4" />
            {fmt(timeLeft)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={finish}>
          Selesai Sekarang
        </Button>
      </div>
      <Progress value={((current + 1) / questions.length) * 100} />

      {/* Question navigator for global-timer mode */}
      {mod.allowBack && (
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => goTo(i)}
              className={cn(
                'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                i === current
                  ? 'bg-primary text-primary-foreground'
                  : isAnswered(answers[qq.id])
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Question */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <p className="text-base font-medium text-foreground leading-relaxed">{q.prompt}</p>

          {q.type === 'orderbook-mcq' && (
            <div className="grid gap-3 sm:grid-cols-2">
              {q.books.map((b, bi) => (
                <OrderBookView key={bi} book={b} />
              ))}
            </div>
          )}

          {(q.type === 'mcq' || q.type === 'orderbook-mcq') && (
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = rec?.kind === 'mcq' && rec.choice === idx;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: { kind: 'mcq', choice: selected ? null : idx },
                      }))
                    }
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-left text-sm transition-all',
                      selected
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="font-semibold mr-2 text-primary">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'numeric' && (
            <Input
              type="number"
              inputMode="decimal"
              placeholder="Jawaban angka…"
              value={numericInput}
              onChange={(e) => setNumericInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitCurrent();
              }}
              className="max-w-xs font-mono"
            />
          )}

          {q.type === 'ranking' && (
            <RankingInput
              question={q}
              value={rec?.kind === 'ranking' ? rec.order : null}
              onChange={(order) =>
                setAnswers((prev) => ({ ...prev, [q.id]: { kind: 'ranking', order } }))
              }
            />
          )}

          {q.type === 'interval' && (
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Lower bound</p>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={lowerInput}
                  onChange={(e) => setLowerInput(e.target.value)}
                  className="max-w-[140px] font-mono"
                />
              </div>
              <span className="text-muted-foreground mt-5">—</span>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Upper bound</p>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={upperInput}
                  onChange={(e) => setUpperInput(e.target.value)}
                  className="max-w-[140px] font-mono"
                />
              </div>
              {q.unit && <span className="text-xs text-muted-foreground mt-5">{q.unit}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {mod.allowBack && (
            <Button variant="outline" size="sm" onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={skipCurrent}>
            <SkipForward className="w-4 h-4 mr-1" />
            Skip
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{answeredCount}/{questions.length} terisi</span>
          <Button size="sm" onClick={submitCurrent}>
            {current + 1 === questions.length ? 'Selesai' : mod.allowBack ? 'Next' : 'Submit'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
