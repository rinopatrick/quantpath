import type { PracticeModule } from '@/lib/practice-types';

export const likelihoodList: PracticeModule = {
  id: 'likelihood-list',
  name: 'Likelihood List',
  tagline: 'Rank outcomes by probability',
  description:
    '15 soal, 90 detik per soal. Urutkan 3 outcome dari PALING mungkin ke PALING TIDAK mungkin. Seluruh urutan harus benar — tidak ada partial credit.',
  timerMode: 'perQuestion',
  perQuestionSec: 90,
  allowBack: false,
  scoring: { correct: 1, wrong: -1, skip: 0 },
  tips: [
    'Kamu TIDAK perlu hitung probabilitas eksak — cukup bandingkan relatif.',
    'Cari baseline/anchor dulu (rate historis, mean), lalu ukur seberapa jauh tiap outcome menyimpang.',
    'Sample size besar → hasil makin dekat mean, tail event makin tidak mungkin (LLN).',
    'Hati-hati interval sempit dekat mean vs interval lebar jauh dari mean — lebar interval juga penting.',
    'Sisa waktu 10 detik dan masih ragu di 2 kandidat teratas? Kunci yang paling masuk akal — jangan biarkan timeout (timeout = skip = 0, tapi jawaban 50-50 antara 2 urutan punya EV 0 juga; kalau yakin urutan ekstremnya benar, submit).',
  ],
  questions: [
    {
      id: 'll-1',
      type: 'ranking', topic: 'likelihood',
      prompt:
        'Pemain basket free-throw 90% (90 dari 100 tembakan pertama). Setelah total 200 attempts, urutkan kemungkinan free-throw percentage (FTP) keseluruhan:',
      items: ['87% ≤ FTP ≤ 90%', 'FTP < 87%', 'FTP > 95%'],
      correctOrder: [0, 1, 2],
      explanation:
        'Baseline 90%. Interval yang memuat mean paling mungkin. Turun sedikit di bawah 87% masih mungkin; naik ke atas 95% butuh 100 tembakan berikutnya hampir sempurna (≥101 dari 110 → mustahil-ish).',
    },
    {
      id: 'll-2',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Koin fair dilempar 100 kali. Urutkan:',
      items: ['45 ≤ Heads ≤ 55', 'Heads < 45', 'Heads > 60'],
      correctOrder: [0, 1, 2],
      explanation:
        'SD = 5. ±1 SD di sekitar mean ≈ 68%. Heads < 45 ≈ 16%. Heads > 60 = lebih dari 2 SD ≈ 2%.',
    },
    {
      id: 'll-3',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Dadu fair dilempar 60 kali. Urutkan jumlah angka 6 yang muncul:',
      items: ['8 sampai 12 kali', 'kurang dari 8 kali', 'lebih dari 15 kali'],
      correctOrder: [0, 1, 2],
      explanation:
        'Mean = 10, SD ≈ 2.9. 8–12 memuat mean. <8 ≈ 1 SD ke bawah. >15 hampir 2 SD ke atas.',
    },
    {
      id: 'll-4',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Dua dadu dilempar sekali. Urutkan:',
      items: ['Jumlah 6, 7, atau 8', 'Jumlah ≤ 5', 'Jumlah = 12'],
      correctOrder: [0, 1, 2],
      explanation: 'P(6,7,8) = 16/36. P(≤5) = 10/36. P(12) = 1/36.',
    },
    {
      id: 'll-5',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Deck 52 kartu, tarik 5 kartu. Urutkan:',
      items: ['Minimal satu pair', 'Semua 5 kartu beda rank', 'Flush (5 kartu sesuit)'],
      correctOrder: [1, 0, 2],
      explanation:
        'P(no pair/semua beda rank) ≈ 51%. P(minimal satu pair) ≈ 49%. P(flush termasuk straight flush) ≈ 0.2%. Urutan: no-pair > pair > flush.',
    },
    {
      id: 'll-6',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Saham bergerak harian ±1% dengan peluang 50-50 (random walk). Setelah 100 hari, urutkan:',
      items: ['Harga berubah kurang dari 10% dari awal', 'Harga naik lebih dari 10%', 'Harga naik lebih dari 25%'],
      correctOrder: [0, 1, 2],
      explanation:
        'SD pergerakan ≈ 10 langkah = ~10%. |Δ| < 10% ≈ 68%. Naik > 10% ≈ 16%. Naik > 25% ≈ di luar 2.5 SD < 1%.',
    },
    {
      id: 'll-7',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Kotak: 7 bola merah, 3 biru. Tarik 3 TANPA pengembalian. Urutkan:',
      items: ['Tepat 2 merah', 'Semua 3 merah', 'Semua 3 biru'],
      correctOrder: [0, 1, 2],
      explanation:
        'P(2M1B) = C(7,2)C(3,1)/C(10,3) = 63/120. P(3M) = 35/120. P(3B) = 1/120.',
    },
    {
      id: 'll-8',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Email spam rate historis 20%. Dari 50 email berikutnya, urutkan jumlah spam:',
      items: ['7 sampai 13', '14 sampai 20', '0 sampai 3'],
      correctOrder: [0, 1, 2],
      explanation:
        'Mean = 10, SD ≈ 2.8. 7–13 ≈ ±1 SD, dominan. 14–20 mulai dari +1.4 SD, masih ada massa. 0–3 ≈ di bawah −2.5 SD, hampir nol.',
    },
    {
      id: 'll-9',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Lempar koin fair 10 kali. Urutkan:',
      items: ['Tepat 5 heads', 'Tepat 7 heads', 'Tepat 10 heads'],
      correctOrder: [0, 1, 2],
      explanation: 'P(5) ≈ 24.6%, P(7) ≈ 11.7%, P(10) ≈ 0.1%. Makin jauh dari mean makin kecil.',
    },
    {
      id: 'll-10',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Tinggi pria dewasa ~ Normal(175 cm, SD 7 cm). Pilih satu acak. Urutkan:',
      items: ['170–180 cm', 'di atas 185 cm', 'di bawah 155 cm'],
      correctOrder: [0, 1, 2],
      explanation:
        '170–180 ≈ ±0.7 SD ≈ 52%. >185 ≈ +1.4 SD ≈ 8%. <155 ≈ −2.9 SD ≈ 0.2%.',
    },
    {
      id: 'll-11',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Bus datang rata-rata tiap 10 menit (Poisson). Dalam 30 menit, urutkan jumlah bus:',
      items: ['2 sampai 4 bus', '0 bus', '7 atau lebih'],
      correctOrder: [0, 1, 2],
      explanation:
        'λ = 3. P(2–4) ≈ 62%. P(0) = e⁻³ ≈ 5%. P(≥7) ≈ 3.4%. 0 sedikit lebih mungkin dari ≥7.',
    },
    {
      id: 'll-12',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Dari 30 orang di satu ruangan, urutkan:',
      items: ['Ada minimal 2 orang ulang tahun sama', 'Tidak ada yang sama', 'Ada 3 orang ulang tahun sama'],
      correctOrder: [0, 1, 2],
      explanation:
        'n=30: P(ada pasangan sama) ≈ 70.6%, P(semua beda) ≈ 29.4%, P(triple) ≈ 2.9%.',
    },
    {
      id: 'll-13',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Trader profit 55% dari trade (independen). Dari 20 trade berikutnya, urutkan:',
      items: ['9 sampai 13 profit', '14 sampai 17 profit', '0 sampai 4 profit'],
      correctOrder: [0, 1, 2],
      explanation:
        'Mean = 11, SD ≈ 2.2. 9–13 ≈ ±1 SD, dominan. 14–17 mulai +1.3 SD ≈ 13%. 0–4 ≈ di bawah −3 SD, hampir nol.',
    },
    {
      id: 'll-14',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Lempar dadu 2 kali. Urutkan:',
      items: ['Kedua lemparan berbeda', 'Kedua lemparan sama', 'Keduanya 6'],
      correctOrder: [0, 1, 2],
      explanation: 'P(beda) = 30/36. P(sama) = 6/36. P(6,6) = 1/36.',
    },
    {
      id: 'll-15',
      type: 'ranking', topic: 'likelihood',
      prompt: 'Server down rata-rata 1× per bulan (Poisson). Dalam 6 bulan, urutkan:',
      items: ['4 sampai 8 downtime', '0 atau 1 downtime', '12 atau lebih downtime'],
      correctOrder: [0, 1, 2],
      explanation:
        'λ = 6. P(4–8) ≈ 71%. P(≤1) ≈ 1.7%. P(≥12) ≈ 0.2%. Massa terkonsentrasi di sekitar mean.',
    },
  ],
};
