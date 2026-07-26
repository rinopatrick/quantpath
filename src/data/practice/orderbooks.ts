import type { PracticeModule } from '@/lib/practice-types';

export const orderbooks: PracticeModule = {
  id: 'orderbooks',
  name: 'Orderbooks',
  tagline: 'Spot the arbitrage',
  description:
    '12 soal, 60 detik per soal. Baca order book (bid = harga beli orang lain, ask = harga jual orang lain). Temukan peluang: beli murah di satu book, jual mahal di book lain.',
  timerMode: 'perQuestion',
  perQuestionSec: 60,
  allowBack: false,
  scoring: { correct: 1, wrong: -1, skip: 0 },
  tips: [
    'Kamu BELI di harga ASK (lift the offer), kamu JUAL di harga BID (hit the bid).',
    'Arbitrage ada jika BID di satu book > ASK di book lain untuk aset sama/ekuivalen.',
    'Profit = (bid tinggi − ask rendah) × min(size bid, size ask). Size membatasi!',
    'Untuk basket/ETF: bandingkan harga basket vs jumlah komponen. Beli yang murah, jual yang mahal.',
    'Scan cepat: lihat best bid dan best ask dulu, abaikan level dalam kecuali size best level tidak cukup.',
  ],
  questions: [
    {
      id: 'ob-1',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Aset sama diperdagangkan di dua exchange. Ada arbitrage? Jika ada, berapa profit maksimal?',
      books: [
        { label: 'Exchange A', bids: [{ price: 101, size: 50 }, { price: 100, size: 80 }], asks: [{ price: 103, size: 40 }] },
        { label: 'Exchange B', bids: [{ price: 99, size: 60 }], asks: [{ price: 100, size: 30 }] },
      ],
      options: ['Tidak ada arbitrage', 'Profit 30 (beli B@100, jual A@101)', 'Profit 50 (beli B@100, jual A@101)', 'Profit 60 (beli A@103, jual B@99)'],
      answerIndex: 1,
      explanation: 'Bid A (101) > Ask B (100). Size: min(50, 30) = 30. Profit = (101−100) × 30 = 30.',
    },
    {
      id: 'ob-2',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Ada arbitrage antara kedua book ini?',
      books: [
        { label: 'Exchange A', bids: [{ price: 98, size: 100 }], asks: [{ price: 99, size: 100 }] },
        { label: 'Exchange B', bids: [{ price: 97, size: 100 }], asks: [{ price: 98.5, size: 100 }] },
      ],
      options: ['Ya, profit 50', 'Ya, profit 100', 'Tidak ada — tidak ada bid yang melebihi ask lain', 'Ya, profit 150'],
      answerIndex: 2,
      explanation: 'Best bid keseluruhan 98 (A), best ask 98.5 (B). Bid tertinggi < ask terendah → tidak ada crossing, tidak ada arbitrage.',
    },
    {
      id: 'ob-3',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Berapa profit arbitrage maksimal (boleh pakai beberapa level)?',
      books: [
        { label: 'Exchange A', bids: [{ price: 105, size: 20 }, { price: 104, size: 30 }], asks: [{ price: 106, size: 50 }] },
        { label: 'Exchange B', bids: [{ price: 103, size: 40 }], asks: [{ price: 102, size: 60 }] },
      ],
      options: ['40', '60', '100', '120'],
      answerIndex: 3,
      explanation:
        'Beli B@102 (60 tersedia). Jual A@105 ×20 = profit 60, lalu A@104 ×30 = profit 60. Total 20+30=50 unit ≤ 60. Profit = 60 + 60 = 120. (Bonus: bid B 103 > ask B 102 — book B sendiri crossed.)',
    },
    {
      id: 'ob-4',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'ETF = 1 saham X + 1 saham Y. Ada arbitrage?',
      books: [
        { label: 'Saham X', bids: [{ price: 50, size: 100 }], asks: [{ price: 51, size: 100 }] },
        { label: 'Saham Y', bids: [{ price: 30, size: 100 }], asks: [{ price: 31, size: 100 }] },
        { label: 'ETF (X+Y)', bids: [{ price: 84, size: 50 }], asks: [{ price: 85, size: 50 }] },
      ],
      options: ['Tidak ada', 'Beli X+Y (82), jual ETF (84): profit 2/unit × 50', 'Beli ETF (85), jual X+Y (80): profit 5/unit', 'Beli X+Y (81), jual ETF (85): profit 4/unit'],
      answerIndex: 1,
      explanation: 'Beli komponen di ask: 51 + 31 = 82. Jual ETF di bid: 84. Profit 2/unit, size min = 50. Arah sebaliknya: beli ETF 85, jual komponen 50+30=80 → rugi.',
    },
    {
      id: 'ob-5',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Kamu HARUS beli 50 unit sekarang di Exchange A. Berapa biaya total?',
      books: [
        { label: 'Exchange A', bids: [{ price: 99, size: 200 }], asks: [{ price: 100, size: 30 }, { price: 101, size: 40 }] },
      ],
      options: ['5000', '5020', '5050', '4950'],
      answerIndex: 1,
      explanation: 'Sapu ask: 30 × 100 = 3000, lalu 20 × 101 = 2020. Total 5020.',
    },
    {
      id: 'ob-6',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Mid price book ini berapa?',
      books: [
        { label: 'Exchange A', bids: [{ price: 47, size: 10 }, { price: 46, size: 50 }], asks: [{ price: 49, size: 5 }, { price: 50, size: 80 }] },
      ],
      options: ['47', '48', '48.5', '49'],
      answerIndex: 1,
      explanation: 'Mid = (best bid + best ask)/2 = (47 + 49)/2 = 48.',
    },
    {
      id: 'ob-7',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Futures fair value = spot + 2 (carry). Ada arbitrage?',
      books: [
        { label: 'Spot', bids: [{ price: 100, size: 50 }], asks: [{ price: 101, size: 50 }] },
        { label: 'Futures', bids: [{ price: 105, size: 30 }], asks: [{ price: 106, size: 30 }] },
      ],
      options: ['Tidak ada', 'Beli spot@101 + jual futures@105: profit 2/unit × 30', 'Jual spot@100 + beli futures@106: profit 4/unit', 'Beli spot@101 + jual futures@105: profit 4/unit × 30'],
      answerIndex: 1,
      explanation: 'Cash-and-carry: beli spot 101, biaya carry 2 → total 103. Jual futures 105. Profit 2/unit, size 30.',
    },
    {
      id: 'ob-8',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Order book satu exchange. Ada yang aneh?',
      books: [
        { label: 'Exchange A', bids: [{ price: 102, size: 10 }, { price: 100, size: 40 }], asks: [{ price: 101, size: 25 }] },
      ],
      options: ['Normal', 'Crossed book: bid 102 > ask 101 — beli@101, jual@102, profit 10', 'Crossed book: profit 25', 'Locked book: bid = ask'],
      answerIndex: 1,
      explanation: 'Bid 102 > ask 101 → crossed. Eksekusi min(10, 25) = 10 unit × (102−101) = profit 10.',
    },
    {
      id: 'ob-9',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Kamu jual 60 unit market order di book ini. Berapa yang kamu terima?',
      books: [
        { label: 'Exchange A', bids: [{ price: 80, size: 25 }, { price: 79, size: 25 }, { price: 78, size: 50 }], asks: [{ price: 82, size: 100 }] },
      ],
      options: ['4800', '4755', '4740', '4680'],
      answerIndex: 1,
      explanation: '25×80 + 25×79 + 10×78 = 2000 + 1975 + 780 = 4755.',
    },
    {
      id: 'ob-10',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Dua book mata uang: EUR/USD dan USD/EUR (inverse). EUR/USD ask = 1.25. Agar TIDAK ada arbitrage, bid USD/EUR maksimal?',
      books: [
        { label: 'EUR/USD', bids: [{ price: 1.24, size: 100 }], asks: [{ price: 1.25, size: 100 }] },
        { label: 'USD/EUR', bids: [{ price: 0.8, size: 100 }], asks: [{ price: 0.81, size: 100 }] },
      ],
      options: ['0.79', '0.80', '0.81', '1/1.25 = 0.80 — book saat ini TEPAT di batas, tidak ada arbitrage'],
      answerIndex: 3,
      explanation: 'Beli EUR@1.25 USD → jual EUR (beli USD) di bid USD/EUR 0.8 ⇒ implied 1/0.8 = 1.25. Round trip = impas. Bid > 0.8 baru menghasilkan arbitrage.',
    },
    {
      id: 'ob-11',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Basket = 2 saham X. Ada arbitrage?',
      books: [
        { label: 'Saham X', bids: [{ price: 40, size: 100 }], asks: [{ price: 41, size: 100 }] },
        { label: 'Basket (2X)', bids: [{ price: 83, size: 30 }], asks: [{ price: 84, size: 30 }] },
      ],
      options: ['Tidak ada', 'Beli 2X (82), jual basket (83): profit 1/basket × 30', 'Beli basket (84), jual 2X (80): profit 4', 'Beli 2X (80), jual basket (83): profit 3 × 30'],
      answerIndex: 1,
      explanation: 'Beli 2 X di ask: 2×41 = 82. Jual basket di bid: 83. Profit 1 per basket, 30 basket. Kebalikan: 84 vs 2×40=80 → rugi.',
    },
    {
      id: 'ob-12',
      type: 'orderbook-mcq', topic: 'orderbook',
      prompt: 'Spread book ini dan siapa yang membayarnya?',
      books: [
        { label: 'Exchange A', bids: [{ price: 19.5, size: 500 }], asks: [{ price: 20, size: 500 }] },
      ],
      options: ['Spread 0.5; dibayar market taker (yang pakai market order)', 'Spread 0.5; dibayar market maker', 'Spread 39.5; dibayar taker', 'Spread 0.25; dibagi dua'],
      answerIndex: 0,
      explanation: 'Spread = 20 − 19.5 = 0.5. Taker beli di 20, jual di 19.5 → round trip rugi 0.5. Maker mengutip dua sisi dan mengumpulkan spread.',
    },
  ],
};
