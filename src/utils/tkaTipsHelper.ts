import { SoalItem } from '../types';

/**
 * Utility helper to ensure every question in TKA (Tes Kemampuan Akademik)
 * has a high-value, actionable, pedagogically sound "Tips & Trik Cepat Menjawab".
 */
export function getFallbackTipsTrik(soal: Partial<SoalItem>): string {
  if (soal.tips_trik && soal.tips_trik.trim().length > 0) {
    return soal.tips_trik.trim();
  }

  const domain = soal.domain || 'Literasi';
  const subdomain = (soal.subdomain || '').toLowerCase();
  const level = (soal.level_kognitif || '').toLowerCase();
  const bentuk = (soal.bentuk_soal || '').toLowerCase();

  if (domain === 'Literasi') {
    if (subdomain.includes('menemukan') || subdomain.includes('tersurat')) {
      return 'Trik Cepat (Metode Scanning Kata Kunci): Lingkari kata kunci spesifik pada pertanyaan (nama tokoh, benda, tempat, atau angka). Lalu lakukan pemindaian cepat (skimming) pada paragraf terkait untuk menemukan kalimat yang mengandung kata kunci tersebut tanpa perlu membaca ulang seluruh stimulus dari awal.';
    }
    if (subdomain.includes('memahami') || subdomain.includes('ide pokok') || subdomain.includes('simpulan')) {
      return 'Trik Cepat (Eliminasi Ekstrem & Baca Kalimat Penutup): Kalimat penutup atau pembuka paragraf biasanya merangkum gagasan utama. Coret segera opsi yang memuat kata mutlak/ekstrem seperti "semua", "hanya", "satu-satunya", atau yang memuat detail teknis yang terlalu sempit.';
    }
    if (subdomain.includes('menganalisis') || subdomain.includes('fakta') || subdomain.includes('opini')) {
      return 'Trik Cepat (Uji Verifikasi Fakta vs Opini): Kalimat fakta selalu didukung oleh data terukur (angka, kuantitas, bukti empiris). Jika suatu opsi mengandung kata sifat penilaian subjektif (seperti "paling mudah", "sebaiknya", "wajib", "menyenangkan"), itu adalah opini dan harus dieliminasi bila yang ditanyakan adalah fakta.';
    }
    if (subdomain.includes('evaluasi') || subdomain.includes('refleksi') || level.includes('evaluasi')) {
      return 'Trik Cepat (Analisis Bukti Representatif): Periksa apakah klaim didukung data sampel yang luas atau sekadar cerita pribadi (anekdotal). Jawaban evaluasi yang benar selalu mengutamakan objektivitas data dan proporsionalitas argumen.';
    }
    if (bentuk.includes('uraian')) {
      return 'Trik Cepat (Rumus Uraian Skor Maksimal): Tuliskan simpulan tegas di awal ("Layak/Tepat"), sertakan minimal 2 bukti angka/kutipan kalimat dari teks stimulus, dan tutup dengan saran atau refleksi logis.';
    }
    return 'Trik Cepat (Baca Pertanyaan Dahulu): Selalu baca kalimat pertanyaan sebelum membaca teks stimulus agar pikiran Anda langsung fokus menyaring informasi yang relevan saat membaca teks.';
  } else {
    // Numerasi
    if (subdomain.includes('bilangan') || subdomain.includes('aljabar')) {
      return 'Trik Cepat (Metode Operasi Mundur / Substitusi Opsi): Untuk soal aljabar atau cerita tarif/biaya, kurangkan terlebih dahulu total nilai dengan biaya tetap, lalu bagi dengan tarif satuan. Anda juga bisa menguji opsi jawaban dari tengah (B atau C) ke dalam cerita soal.';
    }
    if (subdomain.includes('geometri') || subdomain.includes('pengukuran')) {
      return 'Trik Cepat (Sketsa Sederhana & Waspada Jebakan Pintu): Gambar sketsa kasar untuk memvisualisasikan soal. Jika ada pintu atau celah yang tidak dipagari, kurangkan segera dari keliling total sebelum mengalikan dengan biaya per meter. Ingat tripel Pythagoras populer (3-4-5, 5-12-13, 7-24-25, 8-15-17).';
    }
    if (subdomain.includes('data') || subdomain.includes('statistika') || subdomain.includes('ketidakpastian')) {
      return 'Trik Cepat (Pasangan Angka Bulat / Rounding): Saat menghitung rata-rata, kelompokkan angka-angka yang menghasilkan kelipatan 10 (misal: 35 + 45 = 80) agar penjumlahan lebih cepat dan terhindar dari kesalahan hitung manual.';
    }
    if (subdomain.includes('pemecahan') || subdomain.includes('ekonomi') || subdomain.includes('diskon')) {
      return 'Trik Cepat (Faktor Pengali Persentase): Jangan menjumlahkan diskon bertingkat (misal: diskon 30% + 10% BUKAN 40%). Hitung dengan faktor sisa bayar: 0,70 × 0,90 = 0,63 (bayar 63% atau diskon efektif 37%).';
    }
    if (bentuk.includes('uraian')) {
      return 'Trik Cepat (Penyetaraan Satuan di Awal): Konversikan semua satuan ke unit yang sama di langkah pertama (misal m³ ke liter, atau jam ke menit). Tuliskan rumus dasar, langkah kalkulasi, dan kalimat simpulan akhir secara berurutan.';
    }
    return 'Trik Cepat (Cek Digit Terakhir / Angka Satuan): Periksa angka satuan dari hasil perkalian atau penjumlahan untuk mencocokkan dengan digit terakhir pada opsi pilihan ganda guna menghemat waktu pengerjaan.';
  }
}
