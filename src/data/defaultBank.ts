import { SoalItem } from '../types';

export const DEFAULT_SOAL_BANK: SoalItem[] = [
  // ===================== SD LITERASI =====================
  {
    id: 'SD4-LIT-001',
    jenjang: 'SD',
    kelas: 'SD 4',
    domain: 'Literasi',
    subdomain: 'Menemukan informasi',
    kompetensi: 'Menemukan informasi tersurat tentang ciri fisik dan kebiasaan hewan pada teks deskripsi.',
    konten: 'Teks Deskripsi Hewan Khas Nusantara',
    konteks: 'Lingkungan',
    level_kognitif: 'Memahami',
    kesulitan: 'Mudah',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Bekantan adalah monyet berhidung panjang dengan rambut berwarna cokelat kemerahan. Hewan endemik Pulau Kalimantan ini menghabiskan sebagian besar waktunya di atas pohon bakau dan rawa gambut. Bekantan pandai berenang karena memiliki selaput di antara jari-jari kakinya. Mereka biasanya mencari makan pucuk daun muda dan buah mangrove yang belum matang saat pagi dan menjelang sore hari. Populasi bekantan kini terancam akibat alih fungsi lahan hutan mangrove.`,
    pertanyaan: 'Berdasarkan teks di atas, bagian tubuh manakah yang membantu bekantan mahir berenang?',
    opsi: {
      A: 'Hidungnya yang panjang dan elastis',
      B: 'Rambutnya yang berwarna cokelat kemerahan',
      C: 'Selaput di antara jari-jari kakinya',
      D: 'Ekornya yang panjang untuk berayun di pohon'
    },
    kunci: 'C',
    pembahasan: 'Proses berpikir: Siswa mencari kata kunci "mahir berenang" atau "berenang" pada teks. Pada kalimat ke-3 tertulis: "Bekantan pandai berenang karena memiliki selaput di antara jari-jari kakinya." Dengan demikian jawaban yang tepat adalah opsi C.',
    tips_trik: 'Trik Cepat (Scanning Kata Kunci): Lingkari kata kunci "berenang" pada pertanyaan, lalu scan cepat teks untuk mencari kata "berenang" atau sinonimnya. Kalimat ke-3 langsung menyebutkan "selaput di antara jari-jari kakinya". Hindari terdistraksi oleh ciri fisik lain seperti hidung panjang.',
    indikator: 'Siswa dapat menentukan informasi tersurat pendukung pada teks deskripsi lingkungan.',
    tag: ['Literasi', 'Menemukan Informasi', 'SD 4', 'Sains Lingkungan'],
    kemampuan_diukur: 'Identifikasi fakta spesifik dari bacaan deskripsi.',
    kesalahan_umum: 'Siswa memilih ciri yang paling mencolok (hidung panjang) tanpa menghubungkan dengan fungsi berenang.',
    alasan_distraktor: {
      A: 'Hidung panjang adalah ciri khas bekantan, namun tidak berfungsi untuk berenang.',
      B: 'Warna rambut adalah ciri visual, bukan alat bantu berenang.',
      D: 'Ekor membantu keseimbangan di pohon, bukan alasan keahlian berenang.'
    }
  },
  {
    id: 'SD5-LIT-002',
    jenjang: 'SD',
    kelas: 'SD 5',
    domain: 'Literasi',
    subdomain: 'Memahami informasi',
    kompetensi: 'Menyimpulkan ide pokok dan tujuan penulis dari teks prosedur pembuatan pupuk kompos.',
    konten: 'Teks Prosedur Pembuatan Kompos Sederhana',
    konteks: 'Sekolah',
    level_kognitif: 'Memahami',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Program "Sekolah Bebas Sampah" di SDN Pertiwi mengajak siswa memanfaatkan daun gugur menjadi pupuk kompos. Setiap hari Jumat, siswa mengumpulkan daun kering ke dalam wadah komposter bambu. Daun dicampur dengan sedikit tanah dan disiram air cucian beras untuk mempercepat pembusukan. Setelah empat pekan didiamkan, daun berubah menjadi serbuk hitam yang gembur dan tidak berbau. Kompos ini kemudian digunakan untuk menyuburkan kebun sayur apotek hidup sekolah. Melalui kegiatan ini, siswa belajar menjaga kebersihan sekaligus menghasilkan pupuk alami secara gratis.`,
    pertanyaan: 'Apa simpulan utama dari kegiatan pengomposan di SDN Pertiwi tersebut?',
    opsi: {
      A: 'Semua jenis sampah di sekolah dapat habis terbakar dalam empat pekan.',
      B: 'Pemanfaatan daun gugur menjadi kompos melatih kepedulian lingkungan dan menyuburkan tanaman sekolah.',
      C: 'Tanah apotek hidup sekolah hanya dapat subur bila disiram dengan air cucian beras.',
      D: 'Siswa di SDN Pertiwi diwajibkan membawa pupuk kimia dari rumah setiap hari Jumat.'
    },
    kunci: 'B',
    pembahasan: 'Proses berpikir: Kalimat penutup paragraf merangkum esensi: siswa belajar menjaga kebersihan dan menghasilkan pupuk alami untuk menyuburkan kebun apotek hidup. Opsi B mencerminkan ide menyeluruh teks secara akurat tanpa generalisasi berlebihan.',
    tips_trik: 'Trik Cepat (Eliminasi Opsi Terlalu Sempit & Ekstrem): Kalimat penutup paragraf merangkum keseluruhan ide. Singkirkan segera opsi yang mengandung kata pembatas mutlak seperti "Semua jenis sampah" (Opsi A), "hanya dapat subur" (Opsi C), atau "diwajibkan membawa" (Opsi D). Opsi B adalah satu-satunya simpulan yang seimbang dan mencakup esensi kegiatan secara utuh.',
    indikator: 'Siswa mampu menyimpulkan pesan utama teks prosedur dan kegiatan lingkungan sekolah.',
    tag: ['Literasi', 'Memahami Informasi', 'SD 5', 'Sekolah Hijau'],
    kemampuan_diukur: 'Menyimpulkan isi bacaan secara utuh.',
    kesalahan_umum: 'Terpaku pada detail teknis air cucian beras atau jadwal hari Jumat.',
    alasan_distraktor: {
      A: 'Sampah tidak dibakar melainkan dikomposkan.',
      C: 'Air cucian beras hanya salah satu bahan pembantu, bukan satu-satunya syarat kesuburan.',
      D: 'Bertentangan dengan teks karena pupuk dibuat alami di sekolah, bukan membeli pupuk kimia.'
    }
  },
  {
    id: 'SD6-LIT-003',
    jenjang: 'SD',
    kelas: 'SD 6',
    domain: 'Literasi',
    subdomain: 'Menganalisis informasi',
    kompetensi: 'Menganalisis hubungan sebab-akibat dan membedakan fakta dengan opini pada infografis hemat air.',
    konten: 'Teks Berita & Data Kebiasaan Hidup Bersih',
    konteks: 'Rumah',
    level_kognitif: 'Menganalisis',
    kesulitan: 'Sulit',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Keluarga Pak Budi mencatat penggunaan air selama musim kemarau. Menutup keran saat menggosok gigi terbukti menghemat 6 liter air per menit. Sebelum menerapkan kebiasaan ini, tagihan air keluarga Pak Budi mencapai 25 meter kubik per bulan. Setelah seluruh anggota keluarga terbiasa mandi menggunakan pancuran (shower) bertekanan rendah dan selalu menutup keran saat menyabuni tangan, pemakaian air turun menjadi 16 meter kubik per bulan. Ibu Budi berpendapat bahwa kebiasaan hemat air ini merupakan cara paling mudah menyelamatkan bumi yang patut dicontoh semua orang.`,
    stimulus_visual: {
      tipe: 'infografis',
      judul: 'Infografis Pemantauan Penghematan Air Keluarga Mandiri',
      catatan: 'Catatan Meteran Air Bersih Rumah Tangga (m³ / Bulan)',
      poinInfografis: [
        { label: 'Sebelum Hemat Air', nilai: '25 m³', sublabel: 'Tagihan per Bulan' },
        { label: 'Sesudah Hemat Air', nilai: '16 m³', sublabel: 'Gunakan Shower Hemat' },
        { label: 'Volume Dihemat', nilai: '9 m³', sublabel: 'Penurunan Riil (Fakta)' },
        { label: 'Keran Gosok Gigi', nilai: '6 Liter', sublabel: 'Dihemat per Menit' }
      ]
    },
    pertanyaan: 'Manakah pernyataan berikut yang merupakan FAKTA yang dapat dibuktikan dari teks di atas?',
    opsi: {
      A: 'Hemat air adalah satu-satunya cara paling mudah untuk menyelamatkan kelestarian bumi.',
      B: 'Semua orang wajib meniru kebiasaan keluarga Pak Budi agar tagihan airnya berkurang.',
      C: 'Penggunaan air keluarga Pak Budi mengalami penurunan sebanyak 9 meter kubik per bulan.',
      D: 'Mandi menggunakan pancuran lebih menyenangkan daripada mandi menggunakan gayung.'
    },
    kunci: 'C',
    pembahasan: 'Proses berpikir: Fakta adalah sesuatu yang nyata dan dapat diuji secara objektif dengan data. Pemakaian awal 25 m³, pemakaian baru 16 m³. Penurunan = 25 - 16 = 9 m³. Pernyataan C adalah fakta teruji. Pilihan A, B, dan D memuat kata-kata opini subjektif ("paling mudah", "wajib meniru", "lebih menyenangkan").',
    tips_trik: 'Trik Cepat (Filter Kata Sifat Opini): Cari opsi yang memuat angka terverifikasi (25 - 16 = 9 m³). Coret opsi yang memuat kata opini subjektif seperti "satu-satunya" (A), "wajib meniru" (B), atau "lebih menyenangkan" (D).',
    indikator: 'Siswa dapat membedakan kalimat fakta berbasis data numerik dengan opini.',
    tag: ['Literasi', 'Menganalisis Informasi', 'SD 6', 'Fakta dan Opini'],
    kemampuan_diukur: 'Analisis validitas data teks dan klasifikasi fakta vs opini.',
    kesalahan_umum: 'Siswa mengira pendapat Ibu Budi pada kalimat terakhir adalah fakta ilmiah.',
    alasan_distraktor: {
      A: 'Merupakan opini subjektif Ibu Budi yang menggunakan kata superlative "paling mudah".',
      B: 'Merupakan saran/pandangan subjektif.',
      D: 'Merupakan penilaian perasaan (subjektif).'
    }
  },

  // ===================== SD NUMERASI =====================
  {
    id: 'SD3-NUM-001',
    jenjang: 'SD',
    kelas: 'SD 3',
    domain: 'Numerasi',
    subdomain: 'Bilangan',
    kompetensi: 'Menyelesaikan masalah operasi perkalian dan pembagian dalam kehidupan sehari-hari.',
    konten: 'Operasi Bilangan Cacah',
    konteks: 'Kehidupan sehari-hari',
    level_kognitif: 'Menerapkan',
    kesulitan: 'Mudah',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Siti membantu ibunya membungkus kue putu ayu untuk acara arisan RT. Ibu membuat 48 buah kue putu ayu. Siti memasukkan kue-kue tersebut ke dalam 6 kotak dengan jumlah sama banyak di setiap kotak. Kemudian, paman datang membawa 2 kotak tambahan yang masing-masing juga berisi 8 buah kue putu ayu.`,
    pertanyaan: 'Berapa banyak kue putu ayu yang ada di dalam setiap kotak yang disiapkan Siti?',
    opsi: {
      A: '6 buah',
      B: '7 buah',
      C: '8 buah',
      D: '9 buah'
    },
    kunci: 'C',
    pembahasan: 'Langkah perhitungan: Ibu membuat 48 kue dan Siti membaginya ke dalam 6 kotak secara sama rata. Jumlah kue per kotak yang disiapkan Siti = 48 ÷ 6 = 8 kue. Keterangan paman adalah informasi tambahan yang tidak memengaruhi isi per kotak Siti.',
    tips_trik: 'Trik Cepat (Abaikan Distraktor Cerita): Pertanyaan hanya menanyakan kotak yang "disiapkan Siti" (48 ÷ 6 = 8). Informasi tentang "paman datang membawa 2 kotak" adalah distraktor pengecoh yang tidak perlu dihitung sama sekali.',
    indikator: 'Siswa mampu menentukan hasil pembagian bilangan cacah dengan konteks pembagian wadah.',
    tag: ['Numerasi', 'Bilangan', 'SD 3', 'Operasi Hitung'],
    kemampuan_diukur: 'Pemahaman konsep pembagian sebagai pembagian sama rata.',
    kesalahan_umum: 'Siswa bingung dengan informasi tambahan tentang paman sehingga menjumlahkan atau salah operasi.',
    alasan_distraktor: {
      A: 'Siswa membagi 48 dengan 8 atau salah mengira jumlah kotak.',
      B: 'Kesalahan perhitungan tabel perkalian 6 × 7 = 42.',
      D: 'Kesalahan perhitungan 6 × 9 = 54.'
    }
  },
  {
    id: 'SD5-NUM-002',
    jenjang: 'SD',
    kelas: 'SD 5',
    domain: 'Numerasi',
    subdomain: 'Geometri dan pengukuran',
    kompetensi: 'Menghitung keliling dan estimasi biaya pemasangan pagar taman persegi panjang.',
    konten: 'Keliling Bangun Datar dan Aritmetika Sosial Sederhana',
    konteks: 'Sekolah',
    level_kognitif: 'Menerapkan',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Taman bunga di halaman sekolah berbentuk persegi panjang dengan ukuran panjang 12 meter dan lebar 8 meter. Di sekeliling taman tersebut akan dipasang pagar bambu hias. Tepat di salah satu sisi panjang taman, disisakan pintu masuk selebar 2 meter yang tidak dipasang pagar bambu. Harga bambu hias beserta ongkos pasangnya adalah Rp50.000,00 per meter.`,
    pertanyaan: 'Berapakah total biaya yang diperlukan untuk memasang pagar bambu taman tersebut?',
    opsi: {
      A: 'Rp1.900.000,00',
      B: 'Rp2.000.000,00',
      C: 'Rp2.100.000,00',
      D: 'Rp4.800.000,00'
    },
    kunci: 'A',
    pembahasan: 'Langkah berpikir:\n1. Hitung keliling penuh taman: Keliling = 2 × (p + l) = 2 × (12 + 8) = 2 × 20 = 40 meter.\n2. Kurangkan bagian pintu masuk yang tidak dipagari: Panjang pagar = 40 m - 2 m = 38 meter.\n3. Hitung total biaya: 38 meter × Rp50.000,00/meter = Rp1.900.000,00.',
    tips_trik: 'Trik Cepat (Pengurangan Sisi Terbuka): Jangan buru-buru mengalikan keliling dengan biaya! Hitung keliling: 2 × (12 + 8) = 40 m, kurangi pintu 2 m = 38 m. Trik hitung kilat: 38 × 50.000 = (38 ÷ 2) × 100.000 = 19 × 100.000 = Rp1.900.000,00.',
    indikator: 'Siswa mampu mengaplikasikan rumus keliling persegi panjang dengan pengurangan pintu masuk dan perkalian biaya.',
    tag: ['Numerasi', 'Geometri', 'SD 5', 'Keliling dan Biaya'],
    kemampuan_diukur: 'Pemecahan masalah multi-langkah geometri terapan.',
    kesalahan_umum: 'Siswa lupa mengurangkan 2 meter pintu masuk (langsung mengalikan 40 × 50.000 = 2.000.000).',
    alasan_distraktor: {
      B: 'Hasil jika siswa lupa mengurangi lebar pintu masuk (40 × 50.000).',
      C: 'Kesalahan perhitungan penambahan pintu masuk (42 × 50.000).',
      D: 'Siswa salah menggunakan rumus luas (12 × 8 = 96 m²) lalu mengalikan Rp50.000.'
    }
  },
  {
    id: 'SD6-NUM-003',
    jenjang: 'SD',
    kelas: 'SD 6',
    domain: 'Numerasi',
    subdomain: 'Data dan ketidakpastian',
    kompetensi: 'Membaca dan membandingkan data penjualan koperasi sekolah dalam diagram batang serta menghitung rata-rata.',
    konten: 'Statistika Sederhana (Tabel dan Rata-rata)',
    konteks: 'Ekonomi sederhana',
    level_kognitif: 'Menganalisis',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Koperasi sekolah mencatat penjualan buku tulis selama lima hari kerja sebagai berikut:
- Senin: 35 buku
- Selasa: 40 buku
- Rabu: 50 buku
- Kamis: 30 buku
- Jumat: 45 buku
Pengurus koperasi menargetkan rata-rata penjualan per hari minimal 40 buku agar mendapatkan potongan harga dari distributor buku.`,
    stimulus_visual: {
      tipe: 'diagram_batang',
      judul: 'Diagram Batang Penjualan Buku Tulis Harian Koperasi Sekolah',
      satuan: 'Buku',
      catatan: 'Laporan Penjualan Mingguan Koperasi Siswa',
      batang: [
        { label: 'Senin', nilai: 35, unit: 'buku', warna: 'bg-blue-500' },
        { label: 'Selasa', nilai: 40, unit: 'buku', warna: 'bg-indigo-500' },
        { label: 'Rabu', nilai: 50, unit: 'buku', warna: 'bg-emerald-500' },
        { label: 'Kamis', nilai: 30, unit: 'buku', warna: 'bg-amber-500' },
        { label: 'Jumat', nilai: 45, unit: 'buku', warna: 'bg-purple-500' }
      ]
    },
    pertanyaan: 'Berdasarkan data tersebut, berapakah rata-rata penjualan buku tulis per hari dan apakah target koperasi tercapai?',
    opsi: {
      A: 'Rata-rata 38 buku per hari, target belum tercapai.',
      B: 'Rata-rata 40 buku per hari, target berhasil tercapai.',
      C: 'Rata-rata 42 buku per hari, target berhasil terlampaui.',
      D: 'Rata-rata 45 buku per hari, target berhasil terlampaui.'
    },
    kunci: 'B',
    pembahasan: 'Langkah berpikir:\n1. Jumlah total buku selama 5 hari = 35 + 40 + 50 + 30 + 45 = 200 buku.\n2. Rata-rata per hari = Total buku ÷ 5 hari = 200 ÷ 5 = 40 buku.\n3. Karena target minimal 40 buku, maka target tepat tercapai (40 = 40). Jawaban B benar.',
    tips_trik: 'Trik Cepat (Pasangan Angka Bulat / Rounding): Untuk menjumlahkan cepat 35 + 40 + 50 + 30 + 45, pasangkan (35 + 45 = 80) + (50 + 30 + 40 = 120) = 200. Bagi dengan 5 hari: 200 ÷ 5 = 40. Karena target minimal 40, jawabannya langsung tercapai tanpa coretan panjang.',
    indikator: 'Siswa dapat menghitung mean data tunggal dan menarik kesimpulan berdasarkan kriteria batas.',
    tag: ['Numerasi', 'Data dan Ketidakpastian', 'SD 6', 'Statistika'],
    kemampuan_diukur: 'Perhitungan rata-rata dan pengambilan keputusan analitis.',
    kesalahan_umum: 'Siswa salah menjumlahkan angka atau salah menentukan jumlah hari pembagi.',
    alasan_distraktor: {
      A: 'Kesalahan jumlah data (misal 190 ÷ 5).',
      C: 'Kesalahan perhitungan (misal 210 ÷ 5).',
      D: 'Siswa hanya mengambil nilai modus/median atau hari Jumat.'
    }
  },

  // ===================== SMP LITERASI =====================
  {
    id: 'SMP7-LIT-001',
    jenjang: 'SMP',
    kelas: 'SMP 7',
    domain: 'Literasi',
    subdomain: 'Menganalisis informasi',
    kompetensi: 'Menganalisis hubungan sebab-akibat fenomena lingkungan berdasarkan teks eksplanasi ilmiah populer.',
    konten: 'Teks Eksplanasi Sains Lingkungan',
    konteks: 'Sains',
    level_kognitif: 'Menganalisis',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Intrusi air laut merupakan peristiwa perembesan air laut ke dalam lapisan air tanah tawar di daratan. Di kota-kota pesisir padat penduduk seperti Semarang dan Jakarta bagian utara, intrusi air laut semakin parah seiring maraknya pengeboran air tanah dalam oleh gedung komersial dan pemukiman. Ketika akuifer air tawar terkuras tanpa waktu pemulihan yang cukup, tekanan hidrostatis air tanah turun drastis. Akibatnya, air laut yang memiliki massa jenis lebih tinggi merangsek mengisi kekosongan rongga batuan di daratan. Air sumur warga berubah menjadi payau dan tidak lagi layak dikonsumsi. Upaya revitalisasi tangkapan air hujan dan penyediaan jaringan perpipaan air bersih dinilai krusial untuk menahan laju intrusi ini.`,
    pertanyaan: 'Faktor utama apakah yang secara langsung memicu masuknya air laut ke dalam lapisan air tanah tawar menurut teks?',
    opsi: {
      A: 'Kenaikan suhu rata-rata air laut yang mempercepat penguapan di pesisir.',
      B: 'Pembangunan tanggul laut raksasa di sepanjang pantai utara pulau Jawa.',
      C: 'Turunnya tekanan hidrostatis air tanah akibat pengambilan air sumur dalam yang berlebihan.',
      D: 'Penanaman bibit pohon mangrove yang berlebihan di sepanjang muara sungai.'
    },
    kunci: 'C',
    pembahasan: 'Proses berpikir: Teks menjelaskan mekanisme sebab-akibat pada kalimat: "Ketika akuifer air tawar terkuras... tekanan hidrostatis air tanah turun drastis. Akibatnya, air laut yang memiliki massa jenis lebih tinggi merangsek mengisi kekosongan rongga batuan di daratan." Jawaban C menangkap hubungan kausalitas fisika dan lingkungan ini dengan tepat.',
    tips_trik: 'Trik Cepat (Identifikasi Konjungsi Kausalitas): Temukan kata transisi sebab-akibat "Akibatnya" pada teks. Kalimat tepat sebelum "akibatnya" menyebutkan "tekanan hidrostatis air tanah turun drastis", yang langsung mengarahkan Anda ke Opsi C tanpa ragu.',
    indikator: 'Siswa mampu menelaah hubungan sebab-akibat proses ilmiah pada teks eksplanasi.',
    tag: ['Literasi', 'Menganalisis Informasi', 'SMP 7', 'Eksplanasi'],
    kemampuan_diukur: 'Pemahaman kausalitas ilmiah dalam teks eksplanasi.',
    kesalahan_umum: 'Siswa memilih opsi yang menyebut kenaikan permukaan air laut padahal tidak dibahas dalam teks.',
    alasan_distraktor: {
      A: 'Tidak disebutkan sebagai mekanisme pendorong dalam stimulus.',
      B: 'Tanggul laut adalah upaya mitigasi, bukan pemicu intrusi.',
      D: 'Pohon mangrove justru melindungi pesisir, bukan pemicu intrusi.'
    }
  },
  {
    id: 'SMP8-LIT-002',
    jenjang: 'SMP',
    kelas: 'SMP 8',
    domain: 'Literasi',
    subdomain: 'Mengevaluasi informasi',
    kompetensi: 'Menilai keandalan argumen dan kekuatan bukti dalam teks tanggapan kritis pemanfaatan gawai anak.',
    konten: 'Teks Diskusi & Opini Argumentatif',
    konteks: 'Teknologi',
    level_kognitif: 'Mengevaluasi',
    kesulitan: 'Sulit',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Sebuah unggahan di media sosial menyatakan: "Melarang total anak remaja memegang ponsel pintar adalah langkah paling efektif menjamin prestasi belajar peringkat satu di kelas." Penulis mendasarkan klaimnya semata pada cerita seorang kerabatnya yang tidak memiliki gawai dan berhasil lulus dengan nilai terbaik. Namun, kajian dari Pusat Studi Literasi Digital Remaja (2024) terhadap 1.200 pelajar SMP di lima provinsi menunjukkan hasil berbeda. Pelajar dengan bimbingan waktu layar (screen time) terarah 1–2 jam per hari untuk mengakses ensiklopedia digital dan materi interaktif justru memiliki skor kemampuan bernalar kritis 18% lebih tinggi daripada pelajar yang dilarang menggunakan gawai sama sekali.`,
    pertanyaan: 'Berdasarkan prinsip evaluasi informasi yang valid, mengapa klaim pada unggahan media sosial tersebut dinilai lemah dan bias?',
    opsi: {
      A: 'Karena disampaikan melalui platform media sosial yang sering mengalami gangguan server.',
      B: 'Karena hanya bertumpu pada bukti anekdotal satu orang tanpa dukungan metodologi riset yang representatif.',
      C: 'Karena seluruh anak di Indonesia telah memiliki gawai dengan waktu pemakaian lebih dari 10 jam sehari.',
      D: 'Karena penelitian hanya dilakukan di lima provinsi sehingga tidak boleh dipercaya.'
    },
    kunci: 'B',
    pembahasan: 'Proses berpikir evaluatif: Klaim unggahan media sosial menggunakan generalisasi terburu-buru (hasty generalization) dari satu contoh kerabat (anekdotal) untuk menyimpulkan semua remaja. Sebaliknya, kajian ilmiah melibatkan 1.200 responden lintas provinsi. Jawaban B secara tepat mengidentifikasi kelemahan validitas bukti tersebut.',
    tips_trik: 'Trik Cepat (Cek Validitas Metodologi): Klaim yang hanya bersumber dari "cerita satu kerabat" disebut bukti anekdotal (lemah). Begitu melihat kata "hanya bertumpu pada bukti anekdotal satu orang" di Opsi B, ini adalah pola baku jawaban soal evaluasi literasi kritis.',
    indikator: 'Siswa mampu mengevaluasi kekuatan bukti pendukung suatu klaim atau argumen.',
    tag: ['Literasi', 'Mengevaluasi Informasi', 'SMP 8', 'Argumen Kritis'],
    kemampuan_diukur: 'Evaluasi kritis terhadap validitas sumber informasi.',
    kesalahan_umum: 'Siswa menganggap media sosial selalu salah hanya karena masalah teknis platform (opsi A).',
    alasan_distraktor: {
      A: 'Faktor teknis server tidak berhubungan dengan substansi kebenaran logika argumen.',
      C: 'Generalisasi berlebihan yang tidak didukung data teks.',
      D: 'Kajian 1.200 sampel di 5 provinsi justru jauh lebih kuat daripada cerita 1 kerabat.'
    }
  },
  {
    id: 'SMP9-LIT-003',
    jenjang: 'SMP',
    kelas: 'SMP 9',
    domain: 'Literasi',
    subdomain: 'Merefleksikan informasi',
    kompetensi: 'Merefleksikan nilai kearifan lokal dalam mengatasi krisis pangan dan menerapkannya dalam solusi modern.',
    konten: 'Teks Kebudayaan Tradisional Nusantara',
    konteks: 'Budaya lokal',
    level_kognitif: 'Mencipta',
    kesulitan: 'Sulit',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Masyarakat Kasepuhan Ciptagelar di lereng Gunung Halimun memiliki tradisi lumbung padi komunal yang disebut 'Leuit'. Padi yang dipanen disimpan dalam lumbung kayu bertiang tinggi dengan pelapis daun anti-hama tradisional. Cadangan padi ini tidak boleh diperjualbelikan sembarangan, melainkan dialokasikan khusus untuk mengantisipasi paceklik, gagal panen, atau bantuan bagi warga yang sedang tertimpa musibah. Pola ini terbukti menjaga ketahanan pangan Kasepuhan Ciptagelar selama ratusan tahun tanpa pernah mengalami krisis beras, bahkan saat krisis ekonomi melanda negeri.`,
    pertanyaan: 'Bagaimanakah prinsip lumbung "Leuit" tersebut dapat direfleksikan dan diadaptasi oleh generasi muda di lingkungan sekolah perkotaan saat ini?',
    opsi: {
      A: 'Mewajibkan setiap siswa membangun lumbung kayu bertiang tinggi di atas atap ruang kelas.',
      B: 'Membentuk bank tabungan makanan/alat tulis kelas bersama untuk saling membantu saat ada kawan membutuhkan.',
      C: 'Menghentikan seluruh transaksi jual beli di kantin sekolah selamanya.',
      D: 'Menyimpan seluruh makanan bekal siswa di lemari guru hingga masa libur semester tiba.'
    },
    kunci: 'B',
    pembahasan: 'Proses berpikir reflektif: Esensi dari tradisi Leuit adalah solidaritas sosial, kesiapsiagaan cadangan darurat, dan gotong royong komunal. Menghadirkan bank tabungan kelas bersama (solidaritas sosial darurat) adalah adaptasi nilai kearifan lokal yang paling rasional, kontekstual, dan aplikatif bagi siswa sekolah kota.',
    tips_trik: 'Trik Cepat (Uji Rasionalitas Konteks Modern): Coret opsi yang menerapkan tradisi masa lalu secara harfiah ke sekolah modern (membangun lumbung di genteng / melarang kantin). Pilih opsi yang mengambil esensi nilai (solidaritas dan tabungan darurat bersama) yang aplikatif.',
    indikator: 'Siswa mampu merefleksikan nilai budaya lokal ke dalam pemecahan masalah kontekstual kekinian.',
    tag: ['Literasi', 'Merefleksikan Informasi', 'SMP 9', 'Kearifan Lokal'],
    kemampuan_diukur: 'Transfer konsep dan pemikiran reflektif-kreatif.',
    kesalahan_umum: 'Menerapkan tradisi secara fisik mentah-mentah (membuat lumbung kayu di atas genteng sekolah).',
    alasan_distraktor: {
      A: 'Meniru fisik secara tidak realistis dan membahayakan konstruksi bangunan.',
      C: 'Ekstrem dan keliru memahami larangan jual-beli lumbung darurat.',
      D: 'Tidak mendidik dan merusak kesegaran makanan bekal harian.'
    }
  },

  // ===================== SMP NUMERASI =====================
  {
    id: 'SMP7-NUM-001',
    jenjang: 'SMP',
    kelas: 'SMP 7',
    domain: 'Numerasi',
    subdomain: 'Aljabar',
    kompetensi: 'Memodelkan dan menyelesaikan persamaan linear satu variabel dari tarif layanan pengantaran paket.',
    konten: 'Persamaan Linear Satu Variabel',
    konteks: 'Ekonomi sederhana',
    level_kognitif: 'Menerapkan',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Jasa kurir "Kilat Express" menerapkan tarif pengiriman barang antarkota sebagai berikut:
- Biaya dasar pengemasan dan administrasi tetap: Rp15.000,00 per paket.
- Biaya tambahan per kilogram berat barang: Rp8.000,00/kg.
Andi mengirim sebuah paket buku bacaan untuk perpustakaan desa dan membayar total biaya sebesar Rp71.000,00.`,
    stimulus_visual: {
      tipe: 'tabel',
      judul: 'Struktur Skema Tarif Layanan Kilat Express Antarkota',
      satuan: 'Rupiah (IDR)',
      catatan: 'Tarif Reguler Ekspedisi Logistik Darat 2026',
      kolom: ['Komponen Biaya Pengiriman', 'Besaran Tarif', 'Ketentuan Penerapan'],
      baris: [
        ['Biaya Administrasi & Kemasan', 'Rp15.000,00', 'Biaya tetap sekali per paket'],
        ['Tarif Berat Barang (Variabel)', 'Rp8.000,00 / kg', 'Dihitung proporsional per kilogram'],
        ['Total Pembayaran Paket Andi', 'Rp71.000,00', 'Total nominal yang dibayarkan di kasir']
      ]
    },
    pertanyaan: 'Berapakah berat paket buku ($x$) yang dikirim oleh Andi tersebut?',
    opsi: {
      A: '5 kg',
      B: '6 kg',
      C: '7 kg',
      D: '8 kg'
    },
    kunci: 'C',
    pembahasan: 'Langkah pemecahan masalah model aljabar:\n1. Misalkan berat paket = $x\\text{ kg}$.\n2. Bentuk model persamaan linear satu variabel (PLSV):\n   $$\\text{Total Biaya} = \\text{Biaya Tetap} + (\\text{Tarif/kg} \\times x)$$\n   $$71.000 = 15.000 + 8.000x$$\n3. Kurangkan kedua ruas dengan $15.000$:\n   $$8.000x = 71.000 - 15.000$$\n   $$8.000x = 56.000$$\n4. Selesaikan nilai $x$:\n   $$x = \\frac{56.000}{8.000} = 7\\text{ kg}$$\nJadi berat paket buku yang dikirim Andi adalah $7\\text{ kg}$.',
    tips_trik: 'Trik Cepat (Operasi Mundur): Kurangkan dulu total biaya dengan biaya tetap: Rp71.000 - Rp15.000 = Rp56.000. Lalu bagi dengan tarif per kg: 56.000 ÷ 8.000 = 7 kg. Dalam hitungan detik Anda mendapatkan angka 7 tanpa perlu menyusun aljabar rumit.',
    indikator: 'Siswa mampu memodelkan masalah kontekstual ke dalam persamaan linear satu variabel dan menyelesaikannya.',
    tag: ['Numerasi', 'Aljabar', 'SMP 7', 'PLSV'],
    kemampuan_diukur: 'Pemodelan matematika dan penyelesaian persamaan linear.',
    kesalahan_umum: 'Siswa langsung membagi 71.000 dengan 8.000 tanpa mengurangkan biaya tetap 15.000 terlebih dahulu.',
    alasan_distraktor: {
      A: 'Hasil dari (71.000 - 31.000) ÷ 8.000.',
      B: 'Kesalahan hitung pembagian (48.000 ÷ 8.000).',
      D: 'Kesalahan hitung perkalian 8 × 8 = 64.000.'
    }
  },
  {
    id: 'SMP8-NUM-002',
    jenjang: 'SMP',
    kelas: 'SMP 8',
    domain: 'Numerasi',
    subdomain: 'Geometri dan pengukuran',
    kompetensi: 'Menerapkan teorema Pythagoras dalam konteks keselamatan pemasangan tangga darurat.',
    konten: 'Teorema Pythagoras Terapan',
    konteks: 'Kehidupan sehari-hari',
    level_kognitif: 'Menerapkan',
    kesulitan: 'Sedang',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Regu pemadam kebakaran menempatkan tangga darurat untuk menjangkau jendela lantai dua gedung yang berada pada ketinggian 12 meter dari permukaan tanah datar. Sesuai standar keselamatan ergonomi, jarak aman antara kaki tangga di tanah dengan dinding gedung harus tepat 5 meter agar tangga tidak tergelincir atau terlalu tegak.`,
    stimulus_visual: {
      tipe: 'infografis',
      judul: 'Spesifikasi Ergonomi Penempatan Tangga Penyelamat',
      catatan: 'Pedoman Keselamatan Pemadam Kebakaran & Evakuasi Gedung',
      poinInfografis: [
        { label: 'Tinggi Jendela (a)', nilai: '12 meter', sublabel: 'Tegak Lurus Dinding' },
        { label: 'Jarak Kaki Tangga (b)', nilai: '5 meter', sublabel: 'Jarak Aman Landasan' },
        { label: 'Sudut Bidang Datar', nilai: '90° Siku-siku', sublabel: 'Titik Temu Gedung-Tanah' },
        { label: 'Panjang Tangga (c)', nilai: '? meter', sublabel: 'Hipotenusa (Sisi Miring)' }
      ]
    },
    pertanyaan: 'Berapakah panjang minimum tangga darurat ($c$) yang dibutuhkan regu penyelamat tersebut?',
    opsi: {
      A: '13 meter',
      B: '14 meter',
      C: '15 meter',
      D: '17 meter'
    },
    kunci: 'A',
    pembahasan: 'Langkah berpikir geometri & Teorema Pythagoras:\n1. Dinding gedung dan permukaan tanah membentuk sudut siku-siku ($90^\\circ$).\n2. Tangga berperan sebagai sisi miring (hipotenusa, $c$):\n   - Sisi tegak / tinggi jendela ($a$) = $12\\text{ m}$\n   - Sisi alas / jarak kaki tangga ($b$) = $5\\text{ m}$\n3. Menurut Teorema Pythagoras:\n   $$c^2 = a^2 + b^2$$\n   $$c^2 = 12^2 + 5^2 = 144 + 25 = 169$$\n   $$c = \\sqrt{169} = 13\\text{ meter}$$\nMaka panjang tangga minimum adalah $13\\text{ meter}$.',
    tips_trik: 'Trik Cepat (Hafalan Tripel Pythagoras): Sisi tegak 12 m dan jarak 5 m merupakan pasangan tripel Pythagoras legendaris: (5, 12, 13). Tanpa perlu menghitung kuadrat dan akar, Anda bisa langsung memilih 13 meter!',
    indikator: 'Siswa dapat menentukan panjang hipotenusa menggunakan teorema Pythagoras dalam situasi nyata.',
    tag: ['Numerasi', 'Geometri', 'SMP 8', 'Pythagoras'],
    kemampuan_diukur: 'Penerapan relasi kuadrat sisi segitiga siku-siku.',
    kesalahan_umum: 'Siswa menjumlahkan langsung 12 + 5 = 17 meter (opsi D) tanpa mengkuadratkan.',
    alasan_distraktor: {
      B: 'Kesalahan perhitungan akar kuadrat.',
      C: 'Menebak angka kelipatan 5.',
      D: 'Kesalahan konsepsi dasar: menjumlahkan panjang sisi linear secara langsung (12 + 5).'
    }
  },
  {
    id: 'SMP9-NUM-003',
    jenjang: 'SMP',
    kelas: 'SMP 9',
    domain: 'Numerasi',
    subdomain: 'Data dan ketidakpastian',
    kompetensi: 'Menganalisis diagram lingkaran anggaran energi dan menghitung efisiensi penghematan listrik.',
    konten: 'Peluang dan Analisis Data Diagram',
    konteks: 'Data dan informasi',
    level_kognitif: 'Menganalisis',
    kesulitan: 'Sulit',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Sebuah sekolah menengah mengaudit konsumsi energi listrik bulanan sebesar 12.000 kWh. Berdasarkan diagram lingkaran penggunaan listrik:
- Pendingin Ruangan (AC): 50%
- Penerangan Lampu: 25%
- Laboratorium Komputer: 15%
- Pompa Air dan Lain-lain: 10%
Sekolah mengganti seluruh lampu neon konvensional dengan lampu LED hemat energi yang mampu memangkas konsumsi daya penerangan sebesar 40%.`,
    pertanyaan: 'Berapakah total energi listrik (dalam kWh) yang berhasil dihemat oleh sekolah per bulan setelah program penggantian lampu tersebut?',
    opsi: {
      A: '1.200 kWh',
      B: '1.800 kWh',
      C: '3.000 kWh',
      D: '4.800 kWh'
    },
    kunci: 'A',
    pembahasan: 'Langkah pemecahan masalah data bertingkat:\n1. Hitung konsumsi awal lampu penerangan:\n   Konsumsi lampu = 25% dari total = 0,25 × 12.000 kWh = 3.000 kWh.\n2. Hitung jumlah penghematan dari pemangkasan 40%:\n   Penghematan = 40% × 3.000 kWh = 0,40 × 3.000 = 1.200 kWh.\nJadi, energi listrik yang berhasil dihemat sekolah per bulan adalah 1.200 kWh.',
    tips_trik: 'Trik Cepat (Gabungan Persen Bertingkat): Daya lampu = 25% = 1/4 bagian total. Penghematan 40% = 0,4. Kalikan langsung: 0,4 × 1/4 × 12.000 kWh = 0,1 × 12.000 = 1.200 kWh. Cukup satu langkah perkalian kilat!',
    indikator: 'Siswa mampu menghitung persentase bertingkat dari representasi data diagram konsumsi.',
    tag: ['Numerasi', 'Data dan Ketidakpastian', 'SMP 9', 'Persentase dan Data'],
    kemampuan_diukur: 'Keterampilan komputasi data persentase multi-langkah kontekstual.',
    kesalahan_umum: 'Siswa menghitung konsumsi sisa penerangan (1.800 kWh) atau hanya mengalikan 40% × 12.000 kWh.',
    alasan_distraktor: {
      B: 'Merupakan sisa pemakaian listrik lampu setelah penghematan (3.000 - 1.200 = 1.800 kWh).',
      C: 'Merupakan total pemakaian lampu sebelum dihemat (25% dari 12.000).',
      D: 'Hasil jika siswa langsung menghitung 40% dari total 12.000 kWh sekolah.'
    }
  },
  {
    id: 'SMP9-NUM-004',
    jenjang: 'SMP',
    kelas: 'SMP 9',
    domain: 'Numerasi',
    subdomain: 'Pemecahan masalah',
    kompetensi: 'Memilih strategi terbaik perbandingan diskon bertingkat pada transaksi perlengkapan sekolah.',
    konten: 'Aritmetika Sosial & Perbandingan Harga',
    konteks: 'Ekonomi sederhana',
    level_kognitif: 'Mengevaluasi',
    kesulitan: 'Sulit',
    bentuk_soal: 'Pilihan Ganda',
    stimulus: `Dua toko alat tulis menawarkan promo untuk paket perlengkapan sekolah seharga normal Rp200.000,00:
- Toko "Cerdas": Diskon langsung 30%, lalu jika membayar dengan uang elektronik mendapat tambahan diskon 10% dari harga setelah diskon pertama.
- Toko "Pintar": Diskon tunggal langsung sebesar 35% tanpa syarat metode pembayaran.
Rani memiliki saldo uang elektronik yang cukup dan ingin memilih toko yang paling hemat.`,
    pertanyaan: 'Manakah kesimpulan dan rekomendasi yang paling tepat bagi Rani?',
    opsi: {
      A: 'Toko Cerdas lebih murah karena total diskonnya setara 40%.',
      B: 'Toko Pintar lebih murah Rp6.000,00 dibandingkan Toko Cerdas.',
      C: 'Toko Cerdas lebih murah Rp4.000,00 dibandingkan Toko Pintar.',
      D: 'Kedua toko menghasilkan harga akhir yang sama persis yaitu Rp130.000,00.'
    },
    kunci: 'C',
    pembahasan: 'Langkah evaluasi matematis:\n1. Perhitungan Toko Cerdas:\n   - Diskon 1 = 30% × Rp200.000 = Rp60.000 → Harga = Rp140.000.\n   - Diskon 2 = 10% × Rp140.000 = Rp14.000.\n   - Harga akhir di Toko Cerdas = Rp140.000 - Rp14.000 = Rp126.000,00.\n2. Perhitungan Toko Pintar:\n   - Diskon = 35% × Rp200.000 = Rp70.000.\n   - Harga akhir di Toko Pintar = Rp200.000 - Rp70.000 = Rp130.000,00.\n3. Selisih harga: Rp130.000 - Rp126.000 = Rp4.000,00 lebih murah di Toko Cerdas.\nKesimpulan: Rani sebaiknya berbelanja di Toko Cerdas (opsi C).',
    tips_trik: 'Trik Cepat (Faktor Sisa Pengali Diskon): Toko Pintar: bayar 65% × 200.000 = Rp130.000. Toko Cerdas: bayar (0,70 × 0,90) = 63% × 200.000 = Rp126.000. Selisih = 2% × 200.000 = Rp4.000 lebih murah Toko Cerdas.',
    indikator: 'Siswa dapat mengevaluasi dan membandingkan diskon bertingkat dengan diskon tunggal dalam pengambilan keputusan finansial.',
    tag: ['Numerasi', 'Pemecahan Masalah', 'SMP 9', 'Aritmetika Sosial'],
    kemampuan_diukur: 'Analisis kritis pengambilan keputusan transaksi berbasis data numerik.',
    kesalahan_umum: 'Siswa menjumlahkan diskon bertingkat secara linear (30% + 10% = 40%).',
    alasan_distraktor: {
      A: 'Miskonsepsi bahwa diskon 30% + 10% sama dengan 40%.',
      B: 'Terbalik menghitung selisih atau keliru menentukan toko yang lebih murah.',
      D: 'Mengasumsikan kedua toko menjual dengan harga sama.'
    }
  },
  // ===================== SOAL URAIAN (TKA STANDAR NASIONAL) =====================
  {
    id: 'SMP8-LIT-UR01',
    jenjang: 'SMP',
    kelas: 'SMP 8',
    domain: 'Literasi',
    subdomain: 'Mengevaluasi dan merefleksi',
    kompetensi: 'Mengevaluasi efektivitas pesan dan argumen penulis dengan menyertakan bukti tekstual yang relevan.',
    konten: 'Teks Opini: Dilema Sampah Plastik Sekali Pakai',
    konteks: 'Sosial budaya dan lingkungan',
    level_kognitif: 'Mengevaluasi',
    kesulitan: 'Sedang',
    bentuk_soal: 'Uraian',
    stimulus: `Sebuah kota pesisir memberlakukan larangan kantong plastik sekali pakai di pasar tradisional. Beberapa pedagang ikan dan sayur mengeluhkan kebijakan tersebut karena belum tersedianya kemasan pengganti yang tahan air dan murah. Akibatnya, sebagian pembeli mengurungkan niat belanja karena tidak membawa wadah sendiri dari rumah.

Di sisi lain, data dinas kebersihan menunjukkan bahwa dalam tiga bulan sejak kebijakan diberlakukan, volume sampah plastik yang menyumbat muara sungai berkurang hingga 38%. Nelayan setempat juga melaporkan bahwa jaring mereka tidak lagi sering robek akibat tersangkut sampah karung plastik.`,
    pertanyaan: 'Apakah kebijakan larangan kantong plastik di kota pesisir tersebut layak dipertahankan? Jelaskan pendapat Anda dengan menyertakan setidaknya dua bukti pendukung dari teks di atas!',
    kunci: 'Kebijakan layak dipertahankan karena: (1) Volume sampah plastik di muara sungai berkurang hingga 38%, dan (2) Nelayan tidak lagi mengalami kerusakan jaring akibat sampah plastik. Meskipun demikian, pemerintah kota perlu menyediakan alternatif wadah murah tahan air bagi pedagang ikan dan sayur.',
    pembahasan: 'Proses berpikir evaluasi teks argumentatif:\n1. Siswa merumuskan posisi/pendapat (layak atau bersyarat) secara logis.\n2. Siswa mengutip bukti dampak positif dari paragraf ke-2 (pengurangan 38% sampah muara sungai dan berkurangnya kerusakan jaring nelayan).\n3. Siswa dapat menyertakan solusi penyeimbang terkait keluhan pedagang pada paragraf ke-1.',
    tips_trik: 'Trik Cepat Uraian Literasi (Skor Maksimal 2): Rumus jitu: [Sikap Tegas] + [Bukti Angka 1: 38% sampah berkurang] + [Bukti 2: jaring nelayan aman] + [Solusi Penyeimbang bagi pedagang]. Selalu sertakan data persentase spesifik dari teks agar penilai langsung memberikan poin sempurna.',
    indikator: 'Siswa mampu mempertahankan argumen evaluatif berbasis teks dengan minimal dua bukti konkret.',
    tag: ['Literasi', 'Uraian', 'Mengevaluasi', 'SMP 8', 'Lingkungan'],
    kemampuan_diukur: 'Penalaran kritis, sintesis argumen multi-sudut pandang, dan kutipan bukti teks.',
    kesalahan_umum: 'Siswa hanya menjawab "layak" atau "tidak layak" tanpa menyertakan bukti dari teks sama sekali.',
    rubrik: {
      skor_maksimal: 2,
      pedoman_penskoran: 'Pedoman penilai dalam menentukan kualitas penalaran argumentatif siswa berdasarkan bukti tekstual.',
      kriteria: [
        {
          skor: 2,
          label: 'Skor 2: Penalaran Lengkap & Bukti Valid',
          deskripsi: 'Menyatakan simpulan/posisi yang jelas DAN menyertakan minimal dua bukti faktual dari teks (misal: pengurangan sampah muara sungai 38% dan jaring nelayan tidak robek).',
          contoh_jawaban: 'Ya, kebijakan sangat layak dipertahankan karena berhasil mengurangi 38% sampah yang menyumbat muara sungai serta jaring nelayan tidak lagi sering robek akibat sampah, meski pemerintah tetap harus mencari solusi wadah murah untuk pedagang basah.'
        },
        {
          skor: 1,
          label: 'Skor 1: Penalaran Parsial / Bukti Kurang Lengkap',
          deskripsi: 'Menyatakan simpulan yang benar namun hanya menyertakan satu bukti dari teks, ATAU menyebutkan fakta teks tanpa menarik simpulan argumen yang jelas.',
          contoh_jawaban: 'Layak dipertahankan karena sampah di muara sungai berkurang 38%.'
        },
        {
          skor: 0,
          label: 'Skor 0: Tidak Tepat / Miskonsepsi / Kosong',
          deskripsi: 'Jawaban hanya opini subjektif tanpa dasar teks (misal: "Saya setuju saja"), informasi yang dikutip bertentangan dengan teks, atau lembar jawaban kosong.',
          contoh_jawaban: 'Tidak tahu / karena plastik warnanya jelek.'
        }
      ]
    }
  },
  {
    id: 'SMP8-NUM-UR02',
    jenjang: 'SMP',
    kelas: 'SMP 8',
    domain: 'Numerasi',
    subdomain: 'Geometri dan pengukuran',
    kompetensi: 'Menyelesaikan masalah kontekstual yang melibatkan volume dan perbandingan laju aliran air.',
    konten: 'Geometri Bangun Ruang: Bak Penampungan Air Hujan',
    konteks: 'Saintifik lingkungan',
    level_kognitif: 'Penalaran',
    kesulitan: 'Sulit',
    bentuk_soal: 'Uraian',
    stimulus: `Sebuah sekolah ramah lingkungan memasang bak penampungan air hujan berbentuk balok dengan ukuran bagian dalam: panjang 2 meter, lebar 1,5 meter, dan tinggi 1 meter. 

Air hujan dialirkan dari talang atap ke dalam bak tersebut dengan debit rata-rata 25 liter per menit. Bak tersebut awalnya dalam keadaan kosong. Ketika hujan lebat berlangsung selama 1,5 jam (90 menit), sekolah ingin mengetahui apakah kapasitas bak penampungan tersebut cukup untuk menampung seluruh air hujan yang masuk. (Catatan: 1 m³ = 1.000 liter).`,
    pertanyaan: 'Tentukan apakah bak penampungan tersebut akan meluap (melebihi kapasitas)! Tuliskan langkah perhitungan volume bak, total volume air hujan yang masuk, serta simpulan akhir Anda secara lengkap!',
    kunci: 'Bak TIDAK meluap. Volume bak = 3.000 liter. Air hujan yang masuk = 2.250 liter. Sisa kapasitas bak yang masih kosong = 750 liter.',
    pembahasan: 'Langkah penyelesaian matematis:\n1. Menghitung kapasitas volume bak:\n   Volume = panjang × lebar × tinggi\n   Volume = 2 m × 1,5 m × 1 m = 3 m³\n   Konversi ke liter: 3 m³ × 1.000 liter/m³ = 3.000 liter.\n\n2. Menghitung volume air hujan yang masuk selama 90 menit:\n   Waktu = 1,5 jam = 90 menit.\n   Volume air = Debit × Waktu\n   Volume air = 25 liter/menit × 90 menit = 2.250 liter.\n\n3. Perbandingan dan Simpulan:\n   2.250 liter < 3.000 liter. Karena volume air hujan yang masuk (2.250 liter) lebih kecil daripada kapasitas bak (3.000 liter), maka bak penampungan TIDAK akan meluap (tersisa ruang kosong 750 liter).',
    tips_trik: 'Trik Cepat Uraian Numerasi: Samakan semua satuan ke Liter dan Menit di awal (1 m³ = 1.000 L, 1,5 jam = 90 menit). Bandingkan Volume Bak (2×1,5×1 = 3 m³ = 3.000 L) dengan Air Masuk (25 × 90 = 2.250 L). Tuliskan simpulan tegas "TIDAK MELUAP" di kalimat pertama untuk mempermudah pemeriksaan.',
    indikator: 'Siswa mampu menghitung volume balok, konversi satuan m³ ke liter, menghitung debit volume, dan menarik simpulan perbandingan.',
    tag: ['Numerasi', 'Uraian', 'Geometri', 'SMP 8', 'Debit Air'],
    kemampuan_diukur: 'Pemodelan matematis multi-langkah, konversi satuan metrik, dan penalaran inferensial.',
    kesalahan_umum: 'Siswa lupa mengonversi 1,5 jam menjadi 90 menit (hanya mengalikan 25 × 1,5 = 37,5 liter), atau salah konversi 1 m³ menjadi liter.',
    rubrik: {
      skor_maksimal: 2,
      pedoman_penskoran: 'Pedoman penilai dalam memberikan skor analitik bertingkat pada soal uraian numerasi penalaran.',
      kriteria: [
        {
          skor: 2,
          label: 'Skor 2: Prosedur Lengkap & Simpulan Tepat',
          deskripsi: 'Menghitung volume bak dengan benar (3.000 liter), menghitung volume air yang masuk dengan benar (2.250 liter), dan menyimpulkan bahwa bak tidak meluap.',
          contoh_jawaban: 'Volume bak = 2 × 1,5 × 1 = 3 m³ = 3.000 liter. Air masuk = 25 liter/menit × 90 menit = 2.250 liter. Simpulan: Bak tidak meluap karena 2.250 liter < 3.000 liter.'
        },
        {
          skor: 1,
          label: 'Skor 1: Prosedur Parsial / Terdapat Kesalahan Perhitungan',
          deskripsi: 'Langkah perhitungan volume bak atau air sudah benar namun terdapat kekeliruan konversi jam atau salah kalkulasi aritmetika, ATAU menulis simpulan "tidak meluap" tanpa menuliskan rumus/langkah perhitungan.',
          contoh_jawaban: 'Bak tidak meluap karena volumenya 3.000 liter dan air yang masuk hanya sedikit.'
        },
        {
          skor: 0,
          label: 'Skor 0: Rumus Salah / Tidak Relevan / Kosong',
          deskripsi: 'Metode perhitungan salah mendasar (misal: hanya menjumlahkan panjang + lebar + tinggi), salah menarik simpulan, atau lembar jawaban kosong.',
          contoh_jawaban: 'Bak meluap karena hujan sangat deras.'
        }
      ]
    }
  }
];
