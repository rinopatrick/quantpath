import type { PracticeModule } from '@/lib/practice-types';
import { genMentalMath } from './generators';

export const mentalMath: PracticeModule = {
  id: 'mental-math',
  name: 'Mental Math',
  tagline: '80 soal / 8 menit, gaya trading firm',
  description:
    '80 soal aritmetika, 8 menit total (timer bersama). Benar +1, salah −1, skip 0. Boleh bolak-balik. Soal DI-GENERATE ULANG setiap attempt — tidak bisa dihafal. Target trading firm: 50–60+ benar.',
  timerMode: 'global',
  globalSec: 480,
  allowBack: true,
  scoring: { correct: 1, wrong: -1, skip: 0 },
  tips: [
    'Target 6 detik per soal. Jangan cek ulang — kecepatan > kesempurnaan di drill ini.',
    'Hafalkan: kuadrat 11–25, 1/8=0.125, 1/16=0.0625, tabel perkalian sampai 15.',
    'Perkalian ×25 = ×100÷4. ×15 = ×10 + setengahnya. ×12 = ×10 + ×2.',
    'Persen: 12.5% = 1/8, 25% = 1/4, 75% = 3/4. Konversi ke pecahan selalu lebih cepat.',
    'Subtraksi besar: bulatkan dulu. 703 − 458 = 703 − 500 + 42.',
    'Latihan harian 8 menit lebih efektif daripada sekali seminggu 1 jam.',
  ],
  questions: genMentalMath(80),
  generator: () => genMentalMath(80),
};
