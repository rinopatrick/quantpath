import type { PracticeModule } from '@/lib/practice-types';

export const intervals: PracticeModule = {
  id: 'intervals',
  name: 'Intervals',
  tagline: 'Estimate with calibrated bounds',
  description:
    '12 soal estimasi, ~75 detik per soal. Beri LOWER dan UPPER bound. Skor jika nilai sebenarnya ada di dalam intervalmu. Di tes asli, interval makin sempit makin tinggi skornya — jadi jangan asal lebar.',
  timerMode: 'perQuestion',
  perQuestionSec: 75,
  allowBack: false,
  scoring: { correct: 1, wrong: -1, skip: 0 },
  tips: [
    'Target kalibrasi ~90%: intervalmu harus memuat jawaban 9 dari 10 kali. Kebanyakan orang OVERCONFIDENT — lebarkan interval pertamamu 2×.',
    'Teknik: estimasi titik dulu, lalu tanya "apakah saya kaget kalau jawabannya setengahnya? dua kalinya?" — set bound di titik kaget.',
    'Untuk kuantitas fisik pakai dekomposisi Fermi: pecah jadi faktor yang kamu tahu.',
    'Orde besaran dulu, digit belakangan. Salah orde = pasti miss; salah digit = mungkin masih masuk.',
    'Jangan set bound bulat-psikologis (juta pas). Nilai asli sering di dekat angka bulat — geser boundmu melewatinya.',
  ],
  questions: [
    { id: 'iv-1', type: 'interval', topic: 'calibration', prompt: 'Berapa tinggi Gunung Everest (meter)?', trueValue: 8849, unit: 'm', explanation: '8.849 m (survei 2020).' },
    { id: 'iv-2', type: 'interval', topic: 'calibration', prompt: 'Berapa populasi Jepang (juta jiwa)?', trueValue: 124, unit: 'juta', explanation: '≈124 juta (2024).' },
    { id: 'iv-3', type: 'interval', topic: 'calibration', prompt: 'Berapa jarak rata-rata Bumi–Bulan (ribu km)?', trueValue: 384, unit: 'ribu km', explanation: '≈384.400 km.' },
    { id: 'iv-4', type: 'interval', topic: 'calibration', prompt: 'Berapa jumlah negara anggota PBB?', trueValue: 193, unit: 'negara', explanation: '193 anggota.' },
    { id: 'iv-5', type: 'interval', topic: 'calibration', prompt: 'Berapa panjang Sungai Nil (km)?', trueValue: 6650, unit: 'km', explanation: '≈6.650 km.' },
    { id: 'iv-6', type: 'interval', topic: 'calibration', prompt: 'Berapa kecepatan suara di udara pada 20°C (m/s)?', trueValue: 343, unit: 'm/s', explanation: '≈343 m/s.' },
    { id: 'iv-7', type: 'interval', topic: 'calibration', prompt: 'Berapa jumlah kunci (tuts) piano standar?', trueValue: 88, unit: 'tuts', explanation: '88 tuts (52 putih + 36 hitam).' },
    { id: 'iv-8', type: 'interval', topic: 'calibration', prompt: 'Berapa luas daratan Indonesia (juta km²)?', trueValue: 1.9, unit: 'juta km²', explanation: '≈1,9 juta km² daratan.' },
    { id: 'iv-9', type: 'interval', topic: 'calibration', prompt: 'Tahun berapa Wall Street Crash "Black Tuesday" terjadi?', trueValue: 1929, unit: '', explanation: 'Oktober 1929.' },
    { id: 'iv-10', type: 'interval', topic: 'calibration', prompt: 'Berapa jumlah detik dalam satu hari?', trueValue: 86400, unit: 'detik', explanation: '24 × 3600 = 86.400.' },
    { id: 'iv-11', type: 'interval', topic: 'calibration', prompt: 'Berapa titik didih air di puncak Everest (°C)?', trueValue: 71, unit: '°C', explanation: '≈71°C karena tekanan rendah.' },
    { id: 'iv-12', type: 'interval', topic: 'calibration', prompt: 'Berapa jumlah penerbangan komersial per hari di dunia (ribu)?', trueValue: 100, unit: 'ribu', explanation: '≈100.000 penerbangan/hari (pra-normal 2024).' },
  ],
};
