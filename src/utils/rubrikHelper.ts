import { SoalItem, RubrikAnalitik } from '../types';

/**
 * Mengambil atau menghasilkan Rubrik Skor Analitik Bertingkat untuk butir soal.
 * Memastikan setiap soal Uraian memiliki tabel skor 2 (Penuh), 1 (Parsial), dan 0 (Tidak Memenuhi).
 */
export function getRubrikForSoal(soal: SoalItem): RubrikAnalitik {
  if (soal.rubrik && Array.isArray(soal.rubrik.kriteria) && soal.rubrik.kriteria.length > 0) {
    return soal.rubrik;
  }

  const isNumerasi = soal.domain === 'Numerasi';
  const cleanKunci = typeof soal.kunci === 'string' ? soal.kunci : JSON.stringify(soal.kunci);

  if (isNumerasi) {
    return {
      skor_maksimal: 2,
      pedoman_penskoran: 'Gunakan skala skor analitik 2, 1, 0 untuk menilai kedalaman pemahaman matematis, ketepatan rumus, dan hasil akhir perhitungan siswa.',
      kriteria: [
        {
          skor: 2,
          label: 'Skor Penuh (Penalaran Matematis Lengkap)',
          deskripsi: `Siswa menuliskan jawaban akhir yang benar (${cleanKunci}) dan menyertakan langkah/strategi perhitungan matematis yang runtut, logis, dan benar.`,
          contoh_jawaban: soal.pembahasan
            ? `Menuliskan runtutan langkah seperti: "${soal.pembahasan.slice(0, 140)}..." dan memperoleh hasil ${cleanKunci}.`
            : `Menuliskan rumus dan langkah perhitungan lengkap hingga menemukan jawaban ${cleanKunci}.`,
        },
        {
          skor: 1,
          label: 'Skor Parsial (Sebagian Benar / Tanpa Langkah)',
          deskripsi: 'Siswa menuliskan jawaban akhir yang benar namun TANPA menyertakan langkah perhitungan, ATAU sudah menuliskan rumus dan strategi yang tepat namun terjadi kekeliruan aritmetika sederhana pada hasil akhir.',
          contoh_jawaban: `Hanya menuliskan "${cleanKunci}" saja tanpa cara kerja, ATAU langkah perhitungan sudah benar di awal namun salah saat menjumlahkan/mengalikan angka akhir.`,
        },
        {
          skor: 0,
          label: 'Skor Nol (Tidak Tepat / Kosong)',
          deskripsi: 'Siswa memberikan jawaban yang salah total, menggunakan rumus/konsep yang keliru, menuliskan hal yang tidak relevan dengan stimulus, atau tidak menjawab sama sekali.',
          contoh_jawaban: 'Menuliskan angka acak tanpa dasar perhitungan atau mengosongkan lembar jawaban.',
        },
      ],
    };
  }

  // Literasi
  return {
    skor_maksimal: 2,
    pedoman_penskoran: 'Gunakan skala skor analitik 2, 1, 0 untuk menilai ketepatan simpulan/argumen dan kemampuan siswa mengaitkan bukti langsung dari teks stimulus.',
    kriteria: [
      {
        skor: 2,
        label: 'Skor Penuh (Analisis Komprehensif & Bukti Teks)',
        deskripsi: `Siswa memberikan simpulan/jawaban yang tepat (${cleanKunci}) dan menyertakan bukti kalimat langsung atau alasan eksplisit yang relevan dari bacaan secara runtut.`,
        contoh_jawaban: soal.pembahasan
          ? `Menjelaskan inti simpulan dan mengutip bukti bacaan: "${soal.pembahasan.slice(0, 140)}...".`
          : `Menjawab inti masalah dan melampirkan rujukan kalimat pendukung dari teks stimulus.`,
      },
      {
        skor: 1,
        label: 'Skor Parsial (Sebagian Benar / Tanpa Bukti Teks)',
        deskripsi: 'Siswa memberikan gagasan/simpulan yang benar tetapi TIDAK menyertakan bukti kutipan dari teks, ATAU mengutip kalimat teks yang tepat namun interpretasi/simpulannya kurang tuntas.',
        contoh_jawaban: `Menjawab inti pokok secara singkat namun tidak mencantumkan alasan/fakta pendukung dari teks stimulus.`,
      },
      {
        skor: 0,
        label: 'Skor Nol (Tidak Tepat / Kosong)',
        deskripsi: 'Siswa memberikan jawaban yang bertentangan dengan informasi pada teks, keliru dalam menafsirkan isi bacaan secara mendasar, atau tidak memberikan respon.',
        contoh_jawaban: 'Menuliskan opini yang berlawanan dengan fakta teks bacaan atau tidak mengisi lembar jawaban.',
      },
    ],
  };
}
