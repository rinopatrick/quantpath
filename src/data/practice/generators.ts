import type {
  PracticeQuestion,
  NumericQuestion,
  OrderbookMcqQuestion,
  OrderBookLevel,
} from '@/lib/practice-types';

// ---------- RNG helpers ----------

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueOptions(correct: string, wrongs: string[], filler: () => string): string[] {
  const set = new Set<string>([correct]);
  for (const w of wrongs) set.add(w);
  let guard = 0;
  while (set.size < 4 && guard < 50) {
    set.add(filler());
    guard++;
  }
  return shuffle([...set]);
}

let uid = 0;
function qid(prefix: string): string {
  uid += 1;
  return `${prefix}-g${Date.now().toString(36)}-${uid}`;
}

// =====================================================
// NumberLogic generator — parameterized sequence families
// =====================================================

type SeqFamily = {
  topic: string;
  gen: () => { terms: number[]; answer: number; explanation: string };
};

const seqFamilies: SeqFamily[] = [
  {
    // second-order arithmetic: diffs increase by k
    topic: 'sequences',
    gen: () => {
      const start = ri(1, 12);
      const d0 = ri(1, 6);
      const k = ri(1, 4);
      const terms: number[] = [start];
      let d = d0;
      for (let i = 0; i < 6; i++) {
        terms.push(terms[terms.length - 1] + d);
        d += k;
      }
      const answer = terms.pop()!;
      return {
        terms,
        answer,
        explanation: `Selisih naik konstan +${k}: ${d0}, ${d0 + k}, ${d0 + 2 * k}, … → ${terms[terms.length - 1]} + ${d - k} = ${answer}.`,
      };
    },
  },
  {
    // geometric
    topic: 'sequences',
    gen: () => {
      const start = ri(1, 5);
      const r = pick([2, 3]);
      const terms: number[] = [start];
      for (let i = 0; i < 5; i++) terms.push(terms[terms.length - 1] * r);
      const answer = terms.pop()!;
      return { terms, answer, explanation: `Rasio ×${r}: ${terms[terms.length - 1]} × ${r} = ${answer}.` };
    },
  },
  {
    // alternating: ×a then −b
    topic: 'sequences',
    gen: () => {
      const start = ri(2, 6);
      const a = pick([2, 3]);
      const b = ri(1, 4);
      const terms: number[] = [start];
      for (let i = 0; i < 6; i++) {
        const last = terms[terms.length - 1];
        terms.push(i % 2 === 0 ? last * a : last - b);
      }
      const answer = terms.pop()!;
      const op = (terms.length - 1) % 2 === 0 ? `× ${a}` : `− ${b}`;
      return { terms, answer, explanation: `Operasi bergantian: ×${a}, −${b}. Berikutnya: ${terms[terms.length - 1]} ${op} = ${answer}.` };
    },
  },
  {
    // interleaved
    topic: 'sequences',
    gen: () => {
      const a0 = ri(1, 8);
      const da = ri(2, 5);
      const b0 = ri(10, 30);
      const db = ri(5, 12);
      const terms: number[] = [];
      for (let i = 0; i < 3; i++) {
        terms.push(a0 + i * da, b0 + i * db);
      }
      const answer = a0 + 3 * da;
      return {
        terms,
        answer,
        explanation: `Dua deret interleaved: (${a0}, ${a0 + da}, ${a0 + 2 * da}, …) dan (${b0}, ${b0 + db}, …). Berikutnya dari deret pertama: ${answer}.`,
      };
    },
  },
  {
    // fibonacci-like
    topic: 'sequences',
    gen: () => {
      const a = ri(1, 6);
      const b = ri(2, 9);
      const terms = [a, b];
      for (let i = 0; i < 4; i++) terms.push(terms[terms.length - 1] + terms[terms.length - 2]);
      const answer = terms.pop()!;
      return {
        terms,
        answer,
        explanation: `Jumlah dua angka sebelumnya: ${terms[terms.length - 2]} + ${terms[terms.length - 1]} = ${answer}.`,
      };
    },
  },
  {
    // a_n = k*a_{n-1} + a_{n-2}
    topic: 'sequences',
    gen: () => {
      const k = 2;
      const a = ri(1, 4);
      const b = ri(3, 8);
      const terms = [a, b];
      for (let i = 0; i < 4; i++) {
        terms.push(k * terms[terms.length - 1] + terms[terms.length - 2]);
      }
      const answer = terms.pop()!;
      return {
        terms,
        answer,
        explanation: `aₙ = 2·aₙ₋₁ + aₙ₋₂ → 2(${terms[terms.length - 1]}) + ${terms[terms.length - 2]} = ${answer}.`,
      };
    },
  },
  {
    // n^2 + c
    topic: 'sequences',
    gen: () => {
      const c = ri(-3, 5);
      const startN = ri(1, 3);
      const terms: number[] = [];
      for (let n = startN; n < startN + 5; n++) terms.push(n * n + c);
      const nNext = startN + 5;
      const answer = nNext * nNext + c;
      return {
        terms,
        answer,
        explanation: `Pola n² ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)}: ${nNext}² ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} = ${answer}.`,
      };
    },
  },
  {
    // 2a + c
    topic: 'sequences',
    gen: () => {
      const c = pick([-2, -1, 1, 2, 3]);
      const start = ri(2, 7);
      const terms = [start];
      for (let i = 0; i < 5; i++) terms.push(2 * terms[terms.length - 1] + c);
      const answer = terms.pop()!;
      return {
        terms,
        answer,
        explanation: `aₙ = 2·aₙ₋₁ ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} → 2(${terms[terms.length - 1]}) ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} = ${answer}.`,
      };
    },
  },
];

export function genNumberLogic(count = 26): PracticeQuestion[] {
  const qs: NumericQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const fam = seqFamilies[i % seqFamilies.length];
    const { terms, answer, explanation } = fam.gen();
    qs.push({
      id: qid('nlg'),
      type: 'numeric',
      prompt: `${terms.join(', ')}, ?`,
      answer,
      explanation,
      topic: fam.topic,
    });
  }
  return shuffle(qs);
}

// =====================================================
// Orderbooks generator
// =====================================================

function levels(price: number, size: number): OrderBookLevel[] {
  return [{ price, size }];
}

type ObGen = () => OrderbookMcqQuestion;

const obGenerators: ObGen[] = [
  // cross-exchange arb (or none)
  () => {
    const askB = ri(90, 110);
    const hasArb = Math.random() < 0.6;
    const bidA = hasArb ? askB + ri(1, 3) : askB - ri(1, 3);
    const sizeBid = pick([20, 30, 40, 50]);
    const sizeAsk = pick([20, 30, 40, 50]);
    const qty = Math.min(sizeBid, sizeAsk);
    const profit = (bidA - askB) * qty;
    const correct = hasArb
      ? `Profit ${profit} (beli B@${askB}, jual A@${bidA}, ${qty} unit)`
      : 'Tidak ada arbitrage';
    const wrongs = hasArb
      ? [
          'Tidak ada arbitrage',
          `Profit ${(bidA - askB) * Math.max(sizeBid, sizeAsk)} (pakai size terbesar)`,
          `Profit ${bidA - askB} (1 unit saja)`,
        ]
      : [
          `Profit ${Math.abs(bidA - askB) * qty} (beli B, jual A)`,
          `Profit ${qty} (beli A, jual B)`,
          `Profit ${Math.abs(bidA - askB)} (spread positif)`,
        ];
    const options = shuffle([correct, ...wrongs]);
    return {
      id: qid('obg'),
      type: 'orderbook-mcq',
      topic: 'orderbook',
      prompt: 'Aset sama di dua exchange. Ada arbitrage? Berapa profit maksimal?',
      books: [
        { label: 'Exchange A', bids: levels(bidA, sizeBid), asks: levels(bidA + ri(2, 4), 50) },
        { label: 'Exchange B', bids: levels(askB - ri(2, 4), 50), asks: levels(askB, sizeAsk) },
      ],
      options,
      answerIndex: options.indexOf(correct),
      explanation: hasArb
        ? `Bid A (${bidA}) > Ask B (${askB}). Size executable = min(${sizeBid}, ${sizeAsk}) = ${qty}. Profit = (${bidA} − ${askB}) × ${qty} = ${profit}.`
        : `Best bid keseluruhan (${bidA}) < best ask (${askB}) → tidak ada crossing, tidak ada arbitrage.`,
    };
  },
  // market order sweep cost
  () => {
    const p1 = ri(95, 105);
    const s1 = pick([20, 30, 40]);
    const p2 = p1 + 1;
    const s2 = pick([30, 40, 50]);
    const buyQty = s1 + ri(5, Math.min(s2, 25));
    const cost = s1 * p1 + (buyQty - s1) * p2;
    const correct = String(cost);
    const options = uniqueOptions(
      correct,
      [String(buyQty * p1), String(buyQty * p2)],
      () => String(cost + ri(5, 40))
    );
    return {
      id: qid('obg'),
      type: 'orderbook-mcq',
      topic: 'orderbook',
      prompt: `Kamu HARUS beli ${buyQty} unit sekarang (market order). Berapa total biaya?`,
      books: [
        {
          label: 'Exchange A',
          bids: levels(p1 - 1, 100),
          asks: [
            { price: p1, size: s1 },
            { price: p2, size: s2 },
          ],
        },
      ],
      options,
      answerIndex: options.indexOf(correct),
      explanation: `Sapu ask level 1: ${s1} × ${p1} = ${s1 * p1}, lalu level 2: ${buyQty - s1} × ${p2} = ${(buyQty - s1) * p2}. Total ${cost}.`,
    };
  },
  // ETF basket arb
  () => {
    const askX = ri(40, 60);
    const askY = ri(20, 35);
    const comp = askX + askY;
    const hasArb = Math.random() < 0.6;
    const bidEtf = hasArb ? comp + ri(1, 3) : comp - ri(1, 3);
    const size = pick([20, 30, 50]);
    const profit = (bidEtf - comp) * size;
    const correct = hasArb
      ? `Beli X+Y (${comp}), jual ETF (${bidEtf}): profit ${bidEtf - comp}/unit × ${size}`
      : 'Tidak ada arbitrage';
    const wrongs = hasArb
      ? [
          'Tidak ada arbitrage',
          `Beli ETF (${bidEtf + 1}), jual X+Y: profit ${ri(1, 3)}/unit`,
          `Profit ${profit + size} total`,
        ]
      : [
          `Beli X+Y (${comp}), jual ETF (${bidEtf}): profit ${Math.abs(bidEtf - comp)}/unit`,
          `Beli ETF, jual X+Y: profit ${ri(1, 3)}/unit`,
          `Profit ${size} total`,
        ];
    const options = shuffle([correct, ...wrongs]);
    return {
      id: qid('obg'),
      type: 'orderbook-mcq',
      topic: 'orderbook',
      prompt: 'ETF = 1 saham X + 1 saham Y. Ada arbitrage?',
      books: [
        { label: 'Saham X', bids: levels(askX - 1, 100), asks: levels(askX, 100) },
        { label: 'Saham Y', bids: levels(askY - 1, 100), asks: levels(askY, 100) },
        { label: 'ETF (X+Y)', bids: levels(bidEtf, size), asks: levels(bidEtf + 1, size) },
      ],
      options,
      answerIndex: options.indexOf(correct),
      explanation: hasArb
        ? `Beli komponen di ask: ${askX} + ${askY} = ${comp}. Jual ETF di bid: ${bidEtf}. Profit ${bidEtf - comp}/unit × ${size} unit.`
        : `Komponen di ask = ${comp}, bid ETF = ${bidEtf} < ${comp} — jual ETF rugi. Arah sebaliknya juga rugi. Tidak ada arbitrage.`,
    };
  },
  // mid price / spread
  () => {
    const bid = ri(40, 80);
    const spread = pick([1, 2, 3, 4]);
    const ask = bid + spread;
    const mid = (bid + ask) / 2;
    const correct = String(mid);
    const options = uniqueOptions(
      correct,
      [String(bid), String(ask)],
      () => String(mid + pick([-1.5, -1, -0.5, 0.5, 1, 1.5, 2]))
    );
    return {
      id: qid('obg'),
      type: 'orderbook-mcq',
      topic: 'orderbook',
      prompt: 'Berapa mid price book ini?',
      books: [
        {
          label: 'Exchange A',
          bids: [
            { price: bid, size: ri(10, 50) },
            { price: bid - 1, size: ri(20, 80) },
          ],
          asks: [
            { price: ask, size: ri(10, 50) },
            { price: ask + 1, size: ri(20, 80) },
          ],
        },
      ],
      options,
      answerIndex: options.indexOf(correct),
      explanation: `Mid = (best bid + best ask) / 2 = (${bid} + ${ask}) / 2 = ${mid}.`,
    };
  },
];

export function genOrderbooks(count = 12): PracticeQuestion[] {
  const qs: PracticeQuestion[] = [];
  for (let i = 0; i < count; i++) {
    qs.push(obGenerators[i % obGenerators.length]());
  }
  return shuffle(qs);
}

// =====================================================
// Mental Math generator — Optiver "80 in 8" style
// =====================================================

type MmGen = () => { prompt: string; answer: number; explanation: string; topic: string };

const mmGenerators: MmGen[] = [
  // 2-3 digit addition
  () => {
    const a = ri(25, 999);
    const b = ri(25, 999);
    return { prompt: `${a} + ${b} = ?`, answer: a + b, explanation: `${a} + ${b} = ${a + b}.`, topic: 'mm-addsub' };
  },
  // subtraction
  () => {
    const a = ri(100, 999);
    const b = ri(25, a - 10);
    return { prompt: `${a} − ${b} = ?`, answer: a - b, explanation: `${a} − ${b} = ${a - b}.`, topic: 'mm-addsub' };
  },
  // 2-digit × 1-digit
  () => {
    const a = ri(12, 99);
    const b = ri(3, 9);
    return { prompt: `${a} × ${b} = ?`, answer: a * b, explanation: `${a} × ${b} = ${a * b}.`, topic: 'mm-mul' };
  },
  // 2-digit × 2-digit (one friendly factor)
  () => {
    const a = ri(11, 25);
    const b = pick([11, 12, 15, 20, 25, 30, 40, 50]);
    return { prompt: `${a} × ${b} = ?`, answer: a * b, explanation: `${a} × ${b} = ${a * b}.`, topic: 'mm-mul' };
  },
  // division (exact)
  () => {
    const b = ri(3, 12);
    const q = ri(12, 60);
    const a = b * q;
    return { prompt: `${a} ÷ ${b} = ?`, answer: q, explanation: `${a} ÷ ${b} = ${q}.`, topic: 'mm-div' };
  },
  // percentage of a number
  () => {
    const pct = pick([5, 10, 12.5, 15, 20, 25, 40, 50, 75]);
    const base = pick([40, 60, 80, 120, 160, 200, 240, 320, 400, 480]);
    const ans = (pct / 100) * base;
    return {
      prompt: `${pct}% dari ${base} = ?`,
      answer: ans,
      explanation: `${pct}% × ${base} = ${ans}.`,
      topic: 'mm-pct',
    };
  },
  // fraction to decimal
  () => {
    const pairs: [number, number][] = [
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 16],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 20],
      [3, 20],
      [7, 20],
    ];
    const [n, d] = pick(pairs);
    return {
      prompt: `${n}/${d} sebagai desimal = ?`,
      answer: n / d,
      explanation: `${n}/${d} = ${n / d}.`,
      topic: 'mm-frac',
    };
  },
  // squares
  () => {
    const a = ri(11, 25);
    return { prompt: `${a}² = ?`, answer: a * a, explanation: `${a}² = ${a * a}.`, topic: 'mm-mul' };
  },
];

export function genMentalMath(count = 80): PracticeQuestion[] {
  const qs: NumericQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const g = mmGenerators[i % mmGenerators.length];
    const { prompt, answer, explanation, topic } = g();
    qs.push({
      id: qid('mm'),
      type: 'numeric',
      prompt,
      answer,
      tolerance: 0.001,
      explanation,
      topic,
    });
  }
  return shuffle(qs);
}
