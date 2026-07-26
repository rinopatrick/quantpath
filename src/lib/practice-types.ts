// Types for the Optiver-style test practice modules

export type PracticeQuestionType = 'mcq' | 'numeric' | 'ranking' | 'interval' | 'orderbook-mcq';

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBookData {
  label?: string;
  bids: OrderBookLevel[]; // sorted best (highest) first
  asks: OrderBookLevel[]; // sorted best (lowest) first
}

export interface BaseQuestion {
  id: string;
  type: PracticeQuestionType;
  prompt: string;
  explanation: string;
  /** Topic tag for weak-spot analytics (e.g. 'bayes', 'sequences', 'mental-math'). */
  topic?: string;
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  answerIndex: number;
}

export interface NumericQuestion extends BaseQuestion {
  type: 'numeric';
  answer: number;
  tolerance?: number; // absolute tolerance, default 0
}

export interface RankingQuestion extends BaseQuestion {
  type: 'ranking';
  items: string[]; // three outcomes
  correctOrder: number[]; // indices into items, most likely -> least likely
}

export interface IntervalQuestion extends BaseQuestion {
  type: 'interval';
  trueValue: number;
  unit: string;
}

export interface OrderbookMcqQuestion extends BaseQuestion {
  type: 'orderbook-mcq';
  books: OrderBookData[];
  options: string[];
  answerIndex: number;
}

export type PracticeQuestion =
  | McqQuestion
  | NumericQuestion
  | RankingQuestion
  | IntervalQuestion
  | OrderbookMcqQuestion;

export interface PracticeModule {
  id: string;
  name: string;
  tagline: string;
  description: string;
  timerMode: 'perQuestion' | 'global';
  perQuestionSec?: number;
  globalSec?: number;
  allowBack: boolean;
  scoring: { correct: number; wrong: number; skip: number };
  tips: string[];
  questions: PracticeQuestion[];
  /** When set, fresh questions are generated for every attempt (infinite practice). */
  generator?: () => PracticeQuestion[];
}

export type AnswerRecord =
  | { kind: 'mcq'; choice: number | null }
  | { kind: 'numeric'; value: number | null }
  | { kind: 'ranking'; order: number[] | null }
  | { kind: 'interval'; lower: number | null; upper: number | null };

export interface QuestionResult {
  questionId: string;
  outcome: 'correct' | 'wrong' | 'skip';
  timeSec: number;
  topic?: string;
}

export interface PracticeAttempt {
  moduleId: string;
  date: string; // ISO
  score: number;
  maxScore: number;
  correct: number;
  wrong: number;
  skipped: number;
  totalTimeSec: number;
  results: QuestionResult[];
}

export function isAnswered(rec: AnswerRecord | undefined): boolean {
  if (!rec) return false;
  switch (rec.kind) {
    case 'mcq':
      return rec.choice !== null;
    case 'numeric':
      return rec.value !== null;
    case 'ranking':
      return rec.order !== null && rec.order.length === 3;
    case 'interval':
      return rec.lower !== null && rec.upper !== null;
  }
}

export function gradeQuestion(q: PracticeQuestion, rec: AnswerRecord | undefined): 'correct' | 'wrong' | 'skip' {
  if (!isAnswered(rec)) return 'skip';
  switch (q.type) {
    case 'mcq':
    case 'orderbook-mcq': {
      const r = rec as Extract<AnswerRecord, { kind: 'mcq' }>;
      return r.choice === q.answerIndex ? 'correct' : 'wrong';
    }
    case 'numeric': {
      const r = rec as Extract<AnswerRecord, { kind: 'numeric' }>;
      const tol = q.tolerance ?? 0;
      return r.value !== null && Math.abs(r.value - q.answer) <= tol ? 'correct' : 'wrong';
    }
    case 'ranking': {
      const r = rec as Extract<AnswerRecord, { kind: 'ranking' }>;
      if (!r.order) return 'skip';
      return r.order.every((v, i) => v === q.correctOrder[i]) ? 'correct' : 'wrong';
    }
    case 'interval': {
      const r = rec as Extract<AnswerRecord, { kind: 'interval' }>;
      if (r.lower === null || r.upper === null) return 'skip';
      return r.lower <= q.trueValue && q.trueValue <= r.upper ? 'correct' : 'wrong';
    }
  }
}

const HISTORY_KEY = 'quantpath-practice-history';

export function loadAttempts(): PracticeAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as PracticeAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: PracticeAttempt) {
  const all = loadAttempts();
  all.push(attempt);
  // keep last 100 attempts
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all.slice(-100)));
}
