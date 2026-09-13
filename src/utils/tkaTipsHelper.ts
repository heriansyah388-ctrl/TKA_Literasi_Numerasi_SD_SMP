import { SoalItem } from '../types';

export interface TkaLangkahSiswa {
  nomor: number;
  judul: string;
  deskripsi: string;
}

export interface TkaTipsPenjelasan {
  judulTrik: string;
  strategiSingkat: string;
  langkahSiswa: TkaLangkahSiswa[];
  penjelasanKonsep: string;
  panduanGuru: string;
  waspadaJebakan: string;
  kategoriStrategi:
    | 'Scanning Kata Kunci'
    | 'Eliminasi Distraktor Mutlak'
    | 'Verifikasi Fakta vs Opini'
    | 'Evaluasi & Refleksi Bukti'
    | 'Operasi Mundur / Aljabar'
    | 'Visualisasi Sketsa Geometri'
    | 'Rounding & Angka Satuan'
    | 'Faktor Pengali Diskon'
    | 'Struktur Uraian Tiga Pilar'
    | 'Analisis Kontekstual TKA';
}

/**
 * Menghasilkan objek penjelasan lengkap "Tips & Trik Cepat Menjawab Soal TKA Ini"
 * yang terstruktur untuk pemahaman mendalam guru dan siswa.
 */
export function getDetailedTkaTips(soal: Partial<SoalItem>): TkaTipsPenjelasan {
  const domain = soal.domain || 'Literasi';
  const subdomain = (soal.subdomain || '').toLowerCase();
  const level = (soal.level_kognitif || '').toLowerCase();
  const bentuk = (soal.bentuk_soal || '').toLowerCase();
  const stimulus = (soal.stimulus || '').toLowerCase();
  const pertanyaan = (soal.pertanyaan || '').toLowerCase();
  const rawTips = (soal.tips_trik || '').trim();

  // 1. LITERASI - Menemukan Informasi Tersurat
  if (
    domain === 'Literasi' &&
    (subdomain.includes('menemukan') ||
      subdomain.includes('tersurat') ||
      pertanyaan.includes('berdasarkan teks') ||
      pertanyaan.includes('bagian tubuh') ||
      pertanyaan.includes('siapa') ||
      pertanyaan.includes('di mana') ||
      pertanyaan.includes('kapan'))
  ) {
    return {
      judulTrik: 'Metode Scanning Kata Kunci & Verifikasi Kalimat Penjelas',
      kategoriStrategi: 'Scanning Kata Kunci',
      strategiSingkat:
        rawTips ||
        'Lingkari kata kunci spesifik pada pertanyaan (nama tokoh, benda, tempat, atau angka). Lalu lakukan pemindaian cepat (skimming) pada paragraf terkait untuk menemukan kalimat yang memuat kata kunci tersebut tanpa perlu membaca ulang seluruh teks dari awal.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Identifikasi Kata Kunci Spesifik di Pertanyaan',
          deskripsi:
            'Baca kalimat pertanyaan terlebih dahulu. Garis bawahi kata benda unik, nama hewan/tokoh, atau tindakan spesifik (misal: "berenang", "bambu", "kalimantan").',
        },
        {
          nomor: 2,
          judul: 'Lakukan Pemindaian Visual Vertikal (Scanning)',
          deskripsi:
            'Arahkan pandangan mata menyusuri teks secara cepat dari atas ke bawah untuk mencari kata kunci tersebut, tanpa mengeja kata per kata.',
        },
        {
          nomor: 3,
          judul: 'Baca Satu Kalimat Utuh Sumber Bukti',
          deskripsi:
            'Ketika kata kunci ditemukan, baca kalimat tersebut secara utuh dari tanda titik awal hingga titik akhir untuk memastikan konteks dan hubungan faktanya akurat.',
        },
      ],
      penjelasanKonsep:
        'Pada asesmen literasi TKA, butir soal level "Menemukan Informasi" (Retrieval) menguji ketepatan siswa melacak fakta objektif yang tertera eksplisit dalam teks bacaan. Fakta tersurat tidak memerlukan interpretasi mendalam; jawabannya bersumber langsung dari frasa atau kalimat penjelas. Dengan memfokuskan pencarian pada kata kunci spesifik, siswa menghemat 60-70% waktu membaca stimulus panjang dan terhindar dari bias asumsi pribadi.',
      panduanGuru:
        'Guru disarankan melatih siswa teknik pemindaian visual (scanning) menggunakan teks bacaan bertarget waktu. Bimbing siswa agar tidak panik ketika menghadapi stimulus bacaan yang panjang. Jika ada siswa yang keliru memilih distraktor ciri lain, ajak mereka membedakan antara "ciri umum yang menarik" dengan "fungsi spesifik yang ditanyakan pada stimulus".',
      waspadaJebakan:
        'Pengecoh (distraktor) pada tipe soal ini biasanya mengambil frasa yang benar-benar ada di teks tetapi merujuk ke fungsi atau benda lain (contoh: hidung panjang bekantan ada di teks, tetapi fungsinya bukan untuk membantu berenang).',
    };
  }

  // 2. LITERASI - Memahami Informasi / Ide Pokok / Simpulan
  if (
    domain === 'Literasi' &&
    (subdomain.includes('memahami') ||
      subdomain.includes('ide pokok') ||
      subdomain.includes('simpulan') ||
      pertanyaan.includes('simpulan') ||
      pertanyaan.includes('tujuan') ||
      pertanyaan.includes('gagasan'))
  ) {
    return {
      judulTrik: 'Teknik Eliminasi Kata Mutlak & Rumus Simpulan Holistik',
      kategoriStrategi: 'Eliminasi Distraktor Mutlak',
      strategiSingkat:
        rawTips ||
        'Kalimat penutup atau pembuka paragraf biasanya merangkum gagasan utama. Coret segera opsi yang memuat kata pembatas mutlak/ekstrem seperti "semua", "hanya", "satu-satunya", "diwajibkan", atau opsi yang memuat detail teknis yang terlalu sempit.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Eliminasi Opsi Bernada Ekstrem / Mutlak',
          deskripsi:
            'Coret opsi pilihan yang menggunakan kata pembatas mutlak seperti "semua jenis", "satu-satunya", "harus selalu", atau "hanya dapat", kecuali teks stimulus secara eksplisit menyatakannya demikian.',
        },
        {
          nomor: 2,
          judul: 'Cek Kalimat Pembuka dan Penutup Stimulus',
          deskripsi:
            'Ide pokok atau simpulan paling sering berada pada kalimat pertama (deduktif) atau kalimat terakhir (induktif) yang merangkum keseluruhan narasi.',
        },
        {
          nomor: 3,
          judul: 'Pilih Simpulan yang Seimbang & Holistik',
          deskripsi:
            'Pilihlah opsi yang mewakili tujuan keseluruhan kegiatan/cerita, bukan sekadar potongan rincian langkah kerja kecil.',
        },
      ],
      penjelasanKonsep:
        'Simpulan dan ide pokok merupakan abstraksi payung yang merangkul seluruh isi paragraf. Pembuat soal TKA secara sengaja menyusun distraktor dengan dua pola utama: 1) Opsi yang terlalu sempit (hanya mengambil satu contoh rincian teknis), atau 2) Opsi generalisasi berlebihan (menggunakan kata mutlak). Opsi yang benar memiliki tingkat keumuman yang proporsional dan mencerminkan pesan inti penulis.',
      panduanGuru:
        'Latih siswa membedakan antara "ide pokok payung" dan "kalimat penjelas/contoh". Guru dapat menggunakan visualisasi diagram payung di papan tulis: letakkan ide utama di atas payung dan rincian langkah di bawah rintik hujan. Tekankan kepada siswa bahwa simpulan yang baik tidak boleh melompati batasan data yang ada pada teks.',
      waspadaJebakan:
        'Hati-hati dengan opsi jawaban yang memuat informasi yang benar di dunia nyata (fakta umum), namun TIDAK dibahas atau tidak menjadi simpulan dari bacaan yang disajikan.',
    };
  }

  // 3. LITERASI - Menganalisis Informasi / Fakta vs Opini
  if (
    domain === 'Literasi' &&
    (subdomain.includes('menganalisis') ||
      pertanyaan.includes('fakta') ||
      pertanyaan.includes('opini') ||
      subdomain.includes('fakta'))
  ) {
    return {
      judulTrik: 'Uji Verifikasi Bukti Empiris (Fakta vs Opini Subjektif)',
      kategoriStrategi: 'Verifikasi Fakta vs Opini',
      strategiSingkat:
        rawTips ||
        'Kalimat fakta selalu didukung oleh data terukur (angka, kuantitas, bukti empiris). Jika suatu opsi mengandung kata sifat penilaian subjektif (seperti "paling mudah", "sebaiknya", "wajib", "menyenangkan"), itu adalah opini dan harus dieliminasi bila yang ditanyakan adalah fakta.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Pindai Opsi yang Memuat Data Angka Terverifikasi',
          deskripsi:
            'Jika soal menanyakan FAKTA, prioritaskan opsi yang mencantumkan data kuantitatif, hasil pengurangan/penjumlahan riil, atau kejadian yang terbukti terjadi di teks.',
        },
        {
          nomor: 2,
          judul: 'Tandai Kata Sifat Subjektif (Emotif/Superlatif)',
          deskripsi:
            'Coret opsi yang memuat kata rasa atau penilaian pribadi seperti "paling menyenangkan", "sangat indah", "sebaiknya ditiru", atau "cara paling mudah".',
        },
        {
          nomor: 3,
          judul: 'Verifikasi Hitungan Selisih Data',
          deskripsi:
            'Jika opsi fakta melibatkan selisih angka (misal penurunan penggunaan air: 25 m³ - 16 m³ = 9 m³), lakukan perhitungan singkat untuk memastikan angkanya tepat.',
        },
      ],
      penjelasanKonsep:
        'Fakta adalah pernyataan yang kebenarannya dapat diuji secara objektif melalui data empiris atau catatan kejadian nyata. Sebaliknya, opini memuat interpretasi, sikap emosional, atau penilaian nilai seseorang yang bersifat relatif. Dalam asesmen kompetensi TKA, kemampuan memisahkan klaim subjektif narasumber dari data faktual merupakan pilar utama kecakapan bernalar kritis (critical thinking).',
      panduanGuru:
        'Ajak siswa membuat tabel pembanding dua kolom di kelas: Kolom Fakta (apa yang terukur dan tercatat) dan Kolom Opini (apa yang dirasakan atau dianjurkan tokoh). Tekankan bahwa opini seorang ahli atau tokoh di dalam teks tetaplah berstatus opini, bukan fakta ilmiah, kecuali jika didukung bukti data yang dipaparkan.',
      waspadaJebakan:
        'Pengecoh opini sering kali diformulasikan dengan kalimat yang terdengar sangat bijaksana dan bermoral baik (misal: "Semua orang patut mencontoh kebiasaan baik ini"). Siswa sering terkecoh menganggapnya fakta karena setuju dengan pesan moralnya.',
    };
  }

  // 4. LITERASI - Evaluasi & Refleksi
  if (
    domain === 'Literasi' &&
    (subdomain.includes('evaluasi') ||
      subdomain.includes('refleksi') ||
      level.includes('evaluasi') ||
      pertanyaan.includes('setuju') ||
      pertanyaan.includes('mengevaluasi'))
  ) {
    return {
      judulTrik: 'Analisis Bukti Representatif & Proporsionalitas Argumen',
      kategoriStrategi: 'Evaluasi & Refleksi Bukti',
      strategiSingkat:
        rawTips ||
        'Periksa apakah klaim didukung data sampel yang luas atau sekadar cerita pribadi (anekdotal). Jawaban evaluasi yang benar selalu mengutamakan objektivitas data dan proporsionalitas argumen.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Bedakan Bukti Riset vs Cerita Anekdotal',
          deskripsi:
            'Periksa apakah argumen didasarkan pada data sampel banyak orang atau hanya pengalaman satu orang tokoh.',
        },
        {
          nomor: 2,
          judul: 'Uji Hubungan Sebab-Akibat',
          deskripsi:
            'Pastikan simpulan evaluasi tidak menghubungkan dua hal yang hanya kebetulan terjadi bersamaan tanpa bukti kausalitas.',
        },
        {
          nomor: 3,
          judul: 'Pilih Sikap Evaluasi yang Disertai Bukti Teks',
          deskripsi:
            'Pilihlah opsi yang memberikan penilaian objektif dengan merujuk langsung ke paragraf pendukung pada stimulus.',
        },
      ],
      penjelasanKonsep:
        'Level kognitif penalaran tinggi (Penalaran/Evaluasi) menuntut siswa untuk menilai kredibilitas sumber, keakuratan argumen, dan relevansi teks dengan konteks kehidupan nyata. Evaluasi ilmiah mensyaratkan pembuktian yang proporsional dan tidak tergesa-gesa mengambil simpulan dari kasus tunggal.',
      panduanGuru:
        'Guru dapat melatih diskusi sokratik di kelas dengan menanyakan: "Mengapa menurutmu klaim ini valid? Apa bukti di paragraf yang mendasarinya? Apakah ada kemungkinan penjelasan lain?" Hal ini mencegah siswa menjawab secara impulsif berdasarkan selera pribadi.',
      waspadaJebakan:
        'Waspadai bias konfirmasi: siswa cenderung memilih opsi yang sesuai dengan kebiasaan di rumahnya sendiri, bukan yang diuji secara logis berdasarkan data teks.',
    };
  }

  // 5. NUMERASI - Bilangan & Aljabar / Tarif & Persamaan
  if (
    domain === 'Numerasi' &&
    (subdomain.includes('bilangan') ||
      subdomain.includes('aljabar') ||
      pertanyaan.includes('tarif') ||
      pertanyaan.includes('biaya') ||
      pertanyaan.includes('persamaan') ||
      pertanyaan.includes('berapa'))
  ) {
    return {
      judulTrik: 'Metode Operasi Mundur (Backward Operation) & Isolasi Variabel',
      kategoriStrategi: 'Operasi Mundur / Aljabar',
      strategiSingkat:
        rawTips ||
        'Untuk soal aljabar atau cerita tarif/biaya bertahap, pisahkan nilai tetap (konstanta) dengan nilai variabel. Kurangkan terlebih dahulu total nilai dengan biaya tetap, lalu bagi dengan tarif satuan. Anda juga bisa menguji opsi jawaban dari tengah (B atau C) ke dalam cerita soal.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Pisahkan Biaya Tetap (Konstanta) dari Tarif Berjalan',
          deskripsi:
            'Cari nilai dasar yang tidak berubah (misal tarif buka pintu, biaya sewa awal, atau saldo minimal).',
        },
        {
          nomor: 2,
          judul: 'Lakukan Operasi Mundur: Kurangkan Baru Bagi',
          deskripsi:
            'Rumus cepat: Jarak/Unit = (Total Uang - Biaya Tetap) ÷ Tarif per Km/Unit. Jangan pernah membagi sebelum mengurangkan biaya tetap!',
        },
        {
          nomor: 3,
          judul: 'Trik Substitusi Cepat (Cek Opsi Tengah)',
          deskripsi:
            'Jika ragu dengan persamaan, masukkan nilai opsi B atau C ke cerita soal. Jika hasilnya terlalu besar, coba opsi yang lebih kecil; jika terlalu kecil, coba yang lebih besar.',
        },
      ],
      penjelasanKonsep:
        'Model matematika kontekstual mengikuti fungsi linier f(x) = ax + b. Di mana b adalah konstanta awal dan a adalah koefisien laju perubahan. Menyelesaikan persamaan ax + b = C memerlukan operasi invers bertahap: pertama invers penjumlahan (+b menjadi -b), lalu invers perkalian (×a menjadi ÷a). Memahami urutan operasi invers ini mencegah kesalahan konsep matematika fatal.',
      panduanGuru:
        'Bimbing siswa menggunakan model balok aljabar atau garis bilangan kontekstual. Tunjukkan secara visual bahwa dari keseluruhan panjang uang yang dibayarkan, potongan pertama adalah biaya tetap (b). Sisa uang itulah yang kemudian dipotong-potong menjadi satuan jarak (a).',
      waspadaJebakan:
        'Kesalahan paling umum siswa adalah langsung membagi total uang dengan tarif satuan tanpa mengurangkan biaya tetap terlebih dahulu. Pengecoh jenis ini hampir selalu disediakan pembuat soal TKA sebagai pilihan jebakan!',
    };
  }

  // 6. NUMERASI - Geometri & Pengukuran (Pemagaran, Keliling, Luas, Pintu)
  if (
    domain === 'Numerasi' &&
    (subdomain.includes('geometri') ||
      subdomain.includes('pengukuran') ||
      stimulus.includes('pagar') ||
      pertanyaan.includes('keliling') ||
      pertanyaan.includes('luas') ||
      stimulus.includes('pintu') ||
      pertanyaan.includes('panjang kawat'))
  ) {
    return {
      judulTrik: 'Visualisasi Sketsa Cepat & Pengurangan Bukaan/Pintu',
      kategoriStrategi: 'Visualisasi Sketsa Geometri',
      strategiSingkat:
        rawTips ||
        'Gambar sketsa kasar untuk memvisualisasikan soal. Jika ada pintu atau celah yang tidak dipagari/dicat, kurangkan segera dari keliling total sebelum mengalikan dengan biaya per meter. Ingat tripel Pythagoras populer (3-4-5, 5-12-13, 7-24-25, 8-15-17).',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Gambar Sketsa Kasar 5 Detik & Cantumkan Ukuran',
          deskripsi:
            'Gambarkan bangun datar sederhana (persegi panjang, trapesium, segitiga) dan tuliskan panjang setiap sisinya langsung pada gambar.',
        },
        {
          nomor: 2,
          judul: 'Tandai Bagian yang TIDAK Dipasang / Bukaan Pintu',
          deskripsi:
            'Cari kata kunci "kecuali pintu selebar ... meter". Beri tanda silang pada bagian pintu tersebut di sketsa Anda.',
        },
        {
          nomor: 3,
          judul: 'Hitung Keliling Bersih Baru Kalikan Biaya',
          deskripsi:
            'Keliling Bersih = Keliling Total - Lebar Pintu. Setelah keliling bersih didapat, baru kalikan dengan biaya per meter atau jumlah lilitan kawat.',
        },
      ],
      penjelasanKonsep:
        'Soal terapan geometri TKA menguji pemodelan spasial dalam kehidupan nyata. Dalam matematika murni keliling persegi panjang adalah 2 × (p + l). Namun dalam rekayasa konstruksi nyata, bagian bukaan gerbang tidak memerlukan kawat pagar. Representasi sketsa eksternal mengurangi beban kognitif memori kerja (*working memory load*) sehingga siswa tidak melewatkan pengurangan bukaan pintu.',
      panduanGuru:
        'Wajibkan siswa selalu membuat coretan sketsa di lembar buram saat mengerjakan soal geometri terapan. Guru dapat mengingatkan prinsip "Sketsa Menyelamatkan Nilai": siswa yang membuat sketsa memiliki akurasi 85% lebih tinggi daripada siswa yang hanya mengawang-awang rumus di kepala.',
      waspadaJebakan:
        'Pembuat soal TKA selalu menyiapkan opsi pengecoh yang merupakan hasil keliling penuh (tanpa dikurangi pintu). Siswa yang ceroboh dan terburu-buru akan langsung memilih opsi keliling penuh tersebut.',
    };
  }

  // 7. NUMERASI - Data, Statistika, & Ketidakpastian
  if (
    domain === 'Numerasi' &&
    (subdomain.includes('data') ||
      subdomain.includes('statistika') ||
      subdomain.includes('ketidakpastian') ||
      pertanyaan.includes('rata-rata') ||
      pertanyaan.includes('diagram') ||
      pertanyaan.includes('tabel') ||
      pertanyaan.includes('median'))
  ) {
    return {
      judulTrik: 'Teknik Pengelompokan Angka Bulat (Rounding & Clustering)',
      kategoriStrategi: 'Rounding & Angka Satuan',
      strategiSingkat:
        rawTips ||
        'Saat menghitung total atau rata-rata dari diagram/tabel, pasangkan data yang menghasilkan angka puluhan bulat (misal: 35 + 45 = 80, 28 + 12 = 40) agar penjumlahan mental lebih cepat dan terhindar dari kesalahan hitung manual.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Cari Pasangan Angka Satuan Bernilai 10 (Sahabat Sepuluh)',
          deskripsi:
            'Pasangkan angka-angka yang berakhiran (1 & 9), (2 & 8), (3 & 7), (4 & 6), atau (5 & 5) untuk membentuk bilangan puluhan bulat.',
        },
        {
          nomor: 2,
          judul: 'Jumlahkan Kelompok Puluhan Terlebih Dahulu',
          deskripsi:
            'Hitung total secara modular per kelompok puluhan, lalu jumlahkan hasil akhirnya.',
        },
        {
          nomor: 3,
          judul: 'Bagi dengan Banyak Frekuensi / Kategori Data',
          deskripsi:
            'Bagi total penjumlahan dengan banyaknya data untuk menemukan nilai rata-rata dengan cepat tanpa coretan bersusun panjang.',
        },
      ],
      penjelasanKonsep:
        'Sifat komutatif dan asosiatif penjumlahan (a + b = b + a) memungkinkan kita menyusun kembali urutan penambahan angka. Membentuk bilangan dasar 10 mereduksi risiko kesalahan transfer digit (carrying error) pada saat pengerjaan di bawah tekanan waktu ujian.',
      panduanGuru:
        'Latih kepekaan bilangan (*number sense*) siswa di awal pembelajaran melalui permainan mental math "Sahabat Sepuluh". Ingatkan pula pentingnya membaca label sumbu grafik dan skala satuan (apakah data disajikan dalam ton, ribuan kuintal, atau persentase).',
      waspadaJebakan:
        'Waspadai satuan pada sumbu diagram batang atau grafik (misal: dalam ribuan ekor, ton, atau persen). Pastikan membaca legenda dan label sumbu secara teliti sebelum menghitung.',
    };
  }

  // 8. NUMERASI - Pemecahan Masalah / Diskon Bertingkat / Rasio
  if (
    domain === 'Numerasi' &&
    (subdomain.includes('pemecahan') ||
      pertanyaan.includes('diskon') ||
      stimulus.includes('diskon') ||
      pertanyaan.includes('perbandingan') ||
      pertanyaan.includes('persen'))
  ) {
    return {
      judulTrik: 'Faktor Pengali Sisa Bayar (Bukan Menjumlahkan Persen)',
      kategoriStrategi: 'Faktor Pengali Diskon',
      strategiSingkat:
        rawTips ||
        'Diskon bertingkat "30% + 10%" BUKAN diskon 40%! Hitung dengan faktor sisa bayar: 0,70 × 0,90 = 0,63 (berarti siswa hanya membayar 63% dari harga awal, atau diskon efektif riil 37%).',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Ubah Setiap Diskon Menjadi Faktor Sisa Bayar',
          deskripsi:
            'Diskon 30% berarti membayar 70% (0,70). Diskon tambahan 10% berarti membayar 90% (0,90) dari harga sisa.',
        },
        {
          nomor: 2,
          judul: 'Kalikan Faktor Pengali Secara Beruntun',
          deskripsi:
            'Faktor Bayar Akhir = 0,70 × 0,90 = 0,63. Jangan pernah menjumlahkan 30% + 10% = 40%!',
        },
        {
          nomor: 3,
          judul: 'Kalikan Langsung ke Harga Banderol Awal',
          deskripsi:
            'Harga Bersih = 0,63 × Harga Awal. Cara ini selesai dalam satu baris perkalian sederhana.',
        },
      ],
      penjelasanKonsep:
        'Diskon bertingkat bekerja secara multiplikatif, bukan aditif. Diskon kedua dipotong dari saldo harga setelah diskon pertama diterapkan, bukan dari harga banderol mula-mula. Secara matematis: Harga Akhir = P × (1 - d1) × (1 - d2). Memahami konsep pengali persentase melatih literasi finansial siswa menghadapi transaksi ekonomi modern.',
      panduanGuru:
        'Gunakan contoh konkret promo di pusat perbelanjaan. Tanyakan kepada siswa: "Jika toko memberikan diskon 50% + 50%, apakah barangnya gratis?" Saat siswa menyadari barangnya masih harus dibayar 25%, pemahaman konsep diskon bertingkat akan melekat kuat seumur hidup.',
      waspadaJebakan:
        'Opsi jawaban yang merupakan penjumlahan langsung persentase (30 + 10 = 40%) adalah distraktor jebakan nomor satu pada soal diskon bertingkat!',
    };
  }

  // 9. SOAL URAIAN (Bentuk Uraian / Esai Penalaran)
  if (bentuk.includes('uraian') || bentuk.includes('esai')) {
    return {
      judulTrik: 'Struktur Argumen Tiga Pilar (Klaim - Bukti - Logika Penutup)',
      kategoriStrategi: 'Struktur Uraian Tiga Pilar',
      strategiSingkat:
        rawTips ||
        'Tuliskan simpulan tegas di awal ("Layak/Tepat/Setuju"), sertakan minimal 2 bukti angka/kutipan kalimat dari teks stimulus, dan tutup dengan kalimat simpulan logis agar meraih skor maksimal pada rubrik analitik.',
      langkahSiswa: [
        {
          nomor: 1,
          judul: 'Pilar 1: Tuliskan Sikap/Keputusan Tegas di Kalimat Pertama',
          deskripsi:
            'Awali jawaban dengan kata tegas: "Pernyataan tersebut TEPAT/SETUJU karena..." atau langsung sebutkan angka hasil perhitungan akhir.',
        },
        {
          nomor: 2,
          judul: 'Pilar 2: Cantumkan Minimal 2 Bukti Data dari Stimulus',
          deskripsi:
            'Kutip angka, perbandingan data, atau kalimat bukti dari teks untuk mendukung keputusan Anda.',
        },
        {
          nomor: 3,
          judul: 'Pilar 3: Tuliskan Penjelasan Hubungan Logis',
          deskripsi:
            'Jelaskan mengapa bukti data tersebut membuktikan bahwa keputusan Anda benar secara ilmiah atau matematis.',
        },
      ],
      penjelasanKonsep:
        'Rubrik penskoran analitik TKA (skala 2, 1, 0) mengutamakan kelengkapan bukti dan penalaran koheren. Menulis jawaban panjang lebar tanpa mengutip data stimulus hanya akan mendapatkan skor 1 atau 0. Format Klaim-Bukti-Penalaran menjamin siswa memenuhi kriteria skor maksimal (Skor 2) secara sistematis.',
      panduanGuru:
        'Kenalkan model CER (Claim, Evidence, Reasoning) kepada siswa. Tunjukkan tabel rubrik skor analitik di kelas agar siswa memahami standar penilaian penguji, bahwa jawaban yang baik bukan dinilai dari banyaknya tulisan melainkan dari ketepatan data bukti yang dikutip.',
      waspadaJebakan:
        'Menuliskan jawaban yang hanya berupa perasaan pribadi ("Menurut saya bagus") tanpa merujuk fakta kalimat atau data angka yang ada di teks stimulus.',
    };
  }

  // 10. DEFAULT / GENERAL FALLBACK
  return {
    judulTrik: 'Strategi Analisis Cepat: Baca Pertanyaan Dahulu & Cek Angka Satuan',
    kategoriStrategi: 'Analisis Kontekstual TKA',
    strategiSingkat:
      rawTips ||
      'Selalu baca kalimat pertanyaan sebelum membaca teks stimulus agar pikiran Anda langsung fokus menyaring informasi yang relevan. Periksa digit terakhir atau angka satuan dari pilihan jawaban untuk menghemat waktu.',
    langkahSiswa: [
      {
        nomor: 1,
        judul: 'Baca Kalimat Pertanyaan Sebelum Stimulus',
        deskripsi:
          'Ketahui terlebih dahulu target yang dicari sebelum membaca teks atau data yang panjang.',
      },
      {
        nomor: 2,
        judul: 'Eliminasi 2 Opsi yang Jelas Salah',
        deskripsi:
          'Fokuskan pilihan Anda pada 2 opsi tersisa yang paling masuk akal untuk meningkatkan peluang benar hingga 50%.',
      },
      {
        nomor: 3,
        judul: 'Lakukan Pengecekan Ulang yang Efisien',
        deskripsi:
          'Periksa apakah jawaban Anda menjawab tepat hal yang ditanyakan oleh soal, bukan hal lain yang tidak relevan.',
      },
    ],
    penjelasanKonsep:
      'Membaca pertanyaan terlebih dahulu mengaktifkan pemrosesan tujuan (goal-directed reading). Hal ini menyaring informasi yang tidak relevan dari memori kerja dan mengarahkan perhatian pada data penting sehingga pengerjaan soal asesmen berlangsung efisien.',
    panduanGuru:
      'Ajarkan manajemen waktu ujian kepada siswa: alokasikan maksimal 2 menit per butir soal. Jika menemui soal yang rumit, minta siswa menandai ragu-ragu dan melanjutkan ke nomor berikutnya terlebih dahulu.',
    waspadaJebakan:
      'Membaca teks berkali-kali tanpa mengetahui apa yang ditanyakan adalah pemborosan waktu terbesar dalam ujian TKA berbasis waktu.',
  };
}

/**
 * Helper ringkas untuk kompatibilitas mundur (string saja)
 */
export function getFallbackTipsTrik(soal: Partial<SoalItem>): string {
  const detail = getDetailedTkaTips(soal);
  return detail.strategiSingkat;
}

/**
 * Format teks lengkap untuk keperluan cetak/ekspor dokumen Word
 */
export function formatTkaTipsForDoc(soal: Partial<SoalItem>): string {
  const detail = getDetailedTkaTips(soal);
  const langkahStr = detail.langkahSiswa
    .map((l) => `${l.nomor}. ${l.judul}: ${l.deskripsi}`)
    .join('\n');

  return `⚡ ${detail.judulTrik}
Strategi Kilat: ${detail.strategiSingkat}

Langkah Praktis Siswa:
${langkahStr}

Logika & Pemahaman Konsep:
${detail.penjelasanKonsep}

Catatan Bimbingan Guru:
${detail.panduanGuru}

Waspada Jebakan Soal:
${detail.waspadaJebakan}`;
}
