import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_SOAL_BANK } from './src/data/defaultBank.ts';
import { PaketSoalResponse, SoalItem } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasGeminiKey: hasKey,
    bankKurasiActive: true,
    bankKurasiCount: DEFAULT_SOAL_BANK.length,
  });
});

// Get full curated question bank
app.get('/api/bank-kurasi', (req, res) => {
  res.json({
    success: true,
    total: DEFAULT_SOAL_BANK.length,
    soal: DEFAULT_SOAL_BANK,
  });
});

// Diverse context themes for high variation and strict non-repetition
const THEMATIC_PALETTE = [
  'Teknologi Pembangkit Listrik Tenaga Bayu (PLTB) Sidrap & Pemanfaatan Energi Angin Terbarukan',
  'Pengolahan Kuliner Tradisional Bugis-Nusantara (Barongko, Kue Bolu Peca, Kapurung, Jalangkote)',
  'Konservasi Ekologi Danau Sidenreng, Habitat Burung Migran & Pelestarian Ikan Air Tawar',
  'Tata Kelola Lumbung Padi Modern, Efisiensi Saluran Irigasi Persawahan & Panen Raya Organik',
  'Arsitektur Rumah Panggung Kayu Nusantara Tahan Gempa & Prinsip Kesetimbangan Struktur',
  'Tradisi Gotong Royong Mappalette Bola (Pindah Rumah Adat) & Analisis Dinamika Gaya Fisika',
  'Kerajinan Tenun Sutera Motif Sengkang & Perhitungan Geometri Simetri Lipat serta Pola Fraktal',
  'Navigasi Pelayaran Tradisional Perahu Phinisi Menggunakan Rasi Bintang Pari dan Bintang Salib',
  'Ekosistem Hutan Mangrove Pesisir, Penahan Gelombang Tsunami & Habitat Kepiting Bakau',
  'Sistem Tata Surya: Lintasan Komet, Orbit Satelit Cuaca, dan Analisis Gerhana Bulan',
  'Pelestarian Satwa Endemik Kawasan Wallacea (Anoa Pegunungan, Babirusa, Burung Maleo)',
  'Pengelolaan Sampah Terpadu Sekolah, Bank Sampah Mandiri & Pembuatan Daur Ulang Ecobrick',
  'Efisiensi Penggunaan Air Bersih Rumah Tangga & Pembuatan Sumur Lubang Biopori Resapan Hujan',
  'Budidaya Hidroponik Sayuran Daun Hijau (Selada, Kangkung) di Green House Kebun Sekolah',
  'Pedoman Pola Gizi Seimbang Kemenkes "Isi Piringku" & Pemilihan Jajanan Sehat Bergizi',
  'Pengukuran Kebugaran Jasmani Siswa: Frekuensi Denyut Nadi Istirahat vs Pasca Lari Cepat',
  'Koperasi Siswa Sekolah: Pembukuan Kas Sederhana, Diskon Bazar Buku & Perhitungan Laba Jujur',
  'Literasi Keuangan Siswa: Membandingkan Harga Satuan Belanja Grosir vs Eceran',
  'Logistik Distribusi Bahan Pokok Pedesaan & Perhitungan Rute Terpendek Berbantuan Peta Digital',
  'Pemanfaatan Sensor Kelembaban Tanah Otomatis untuk Penyiraman Bibit Padi Cerdas Berbasis IoT',
  'Pengamatan Mikroskopis Stomata Daun & Proses Fotosintesis Menghasilkan Karbohidrat dan Oksigen',
  'Kecepatan Arus Aliran Sungai & Perhitungan Debit Aliran Air Bendungan Pengairan Pertanian',
  'Eksperimen Gaya Gesek Permukaan Kasar vs Licin dan Sudut Kemiringan Papan Luncur',
  'Siklus Daur Air Alami: Evaporasi, Transpirasi, Kondensasi, dan Pembentukan Awan Hujan',
  'Pendakian Jalur Wisata Alam & Pengukuran Penurunan Suhu Udara Berdasarkan Ketinggian Tempat',
  'Keanekaragaman Terumbu Karang Kepulauan Selayar & Jaring-jaring Rantai Makanan Laut Dangkal',
  'Etika Berselancar di Ruang Digital: Kekuatan Kata Sandi Akun, Privasi Data & Literasi Berita Fakta',
  'Pemberdayaan Usaha Mikro Pembuatan Keripik Pisang Lokal: Perhitungan Bahan Baku & Kemasan',
  'Pembuatan Pupuk Kompos Organik dari Daun Kering Guguran Sekolah & Grafik Suhu Fermentasi',
  'Peta Pembagian Tiga Zona Waktu Indonesia (WIB, WITA, WIT) & Analisis Jadwal Perjalanan Kapal',
  'Statistik Hasil Panen Kebun Buah Naga & Analisis Diagram Batang Penjualan Mingguan',
  'Perhitungan Luas Bidang Atap Panel Surya Sekolah untuk Efisiensi Penghematan Tagihan Listrik',
  'Pola Barisan Bilangan Aritmetika pada Penomoran Kursi Tribun Gelanggang Olahraga',
  'Analisis Kandungan Gula pada Minuman Kemasan Berdasarkan Tabel Informasi Nilai Gizi',
  'Keseimbangan Ekosistem Padang Savana & Peran Predator Puncak dalam Piramida Makanan',
  'Jadwal dan Kecepatan Rata-Rata Kereta Cepat Antar-Kota Modern Melintasi Lintasan Rel',
  'Penaksiran Tinggi Pohon Beringin Rindang Sekolah Menggunakan Teori Panjang Bayangan Matahari',
  'Pengolahan Minyak Kelapa Murni (Virgin Coconut Oil) Skala Rumah Tangga Ramah Lingkungan',
  'Eksplorasi Palung Laut Dalam: Adaptasi Tekanan Hidrostatis Ekstrem & Organisme Bioluminesensi',
  'Perjalanan Menembus Jalur Wisata Hutan Edukasi: Penentuan Derajat Sudut Kompas Magnetik',
];

// Helper to shuffle array and pick distinct context themes
function getShuffledUniqueThemes(
  count: number,
  excludeKeywords: string[] = [],
  topikKhusus?: string
): string[] {
  const cleanExclude = excludeKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
  const eligible = THEMATIC_PALETTE.filter((t) => {
    const tLower = t.toLowerCase();
    return !cleanExclude.some((k) => tLower.includes(k));
  });

  const source = eligible.length >= count ? eligible : THEMATIC_PALETTE;
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const baseTheme = copy[i % copy.length];
    if (topikKhusus && i === 0) {
      result.push(`${topikKhusus} (Fokus Utama)`);
    } else if (i < copy.length) {
      result.push(baseTheme);
    } else {
      result.push(`${baseTheme} - Studi Kasus Berbeda ${Math.floor(i / copy.length) + 1}`);
    }
  }
  return result;
}

// Prompt builder for Indonesian Literacy and Numeracy questions
function buildGeneratorPrompt(params: {
  jenjang: string;
  kelas: string;
  domain: string;
  jumlah_soal: number;
  bentuk_soal: string;
  tingkat_kesulitan: string;
  level_kognitif: string;
  konteks: string;
  bahasa: string;
  mode: string;
  topikKhusus?: string;
  randomSeed?: string;
  excludeTopics?: string[];
  variasiTema?: string[];
}): string {
  const {
    jenjang,
    kelas,
    domain,
    jumlah_soal,
    bentuk_soal,
    tingkat_kesulitan,
    level_kognitif,
    konteks,
    bahasa,
    mode,
    topikKhusus,
    randomSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    excludeTopics = [],
  } = params;

  const assignedThemes = getShuffledUniqueThemes(jumlah_soal, excludeTopics, topikKhusus);

  return `
Anda adalah AI Generator Soal Tes Kemampuan Akademik (TKA) Siswa SD dan SMP di Indonesia yang sangat ahli dan berdedikasi tinggi.
Tugas utama Anda adalah menghasilkan TEPAT ${jumlah_soal} butir soal asesmen yang VALID, KONTEKSTUAL, ORISINAL, BERVARIASI TINGGI, dan TIDAK PERNAH MENGULANG BUTIR/TOPIK YANG SAMA.

================================================================================
ATURAN EMAS ANTI-DUPLIKASI & DIVERSIFIKASI MAKSIMAL (SANGAT PENTING):
================================================================================
1. IDENTITAS SESI GENERATOR ACAK: #${randomSeed}
2. LARANGAN KERAS: JANGAN PERNAH membuat butir soal yang berulang, mirip, atau memiliki alur cerita dan angka yang sama, baik antar-butir di dalam paket ini maupun terhadap soal yang pernah ada!
3. DIVERSIFIKASI KONTEKS BUTIR PER BUTIR:
   Setiap butir soal (${1} s.d. ${jumlah_soal}) WAJIB MENGGUNAKAN TOPIK, LATAR CERITA, DAN STIMULUS DUNIA NYATA BERIKUT (1 BUTIR = 1 TOPIK BERBEDA):
${assignedThemes.map((t, idx) => `   * Butir #${idx + 1}: Wajib berlatar "${t}"`).join('\n')}
${
  excludeTopics.length > 0
    ? `4. TOPIK YANG DILARANG DIGUNAKAN KARENA SUDAH ADA DI SESI SEBELUMNYA:
   ${excludeTopics.slice(0, 10).join(', ')}`
    : ''
}
5. DIVERSIFIKASI NAMA DAN ANGKA:
   - Dilarang hanya menggunakan nama "Pak Budi", "Siti", atau "Ani" secara seragam! Gunakan variasi nama Nusantara yang beragam (misal: Rahmat, Nurhalizah, Andi Tenri, Dewa, Wayan, Eka, Putu, Meutia, Farhan, Fatimah, Daeng Rewa, dsb).
   - Pada Numerasi: Gunakan angka-angka realistis yang berbeda di setiap soal. Jangan gunakan pola perkalian atau pecahan yang identik di beberapa soal.
   - Pada Literasi: Gunakan ragam teks yang berbeda untuk tiap butir (teks narasi sastra anak, teks eksplanasi sains, kutipan dialog wawancara, infografis fakta, tabel data, poster himbauan).

PARAMETER INPUT:
- Jenjang: ${jenjang}
- Kelas: ${kelas}
- Domain: ${domain} (Literasi / Numerasi / Campuran)
- Jumlah Soal: ${jumlah_soal}
- Bentuk Soal: ${bentuk_soal} (Pilihan Ganda 4 opsi A, B, C, D)
- Tingkat Kesulitan: ${tingkat_kesulitan}
- Level Kognitif: ${level_kognitif}
- Konteks: ${konteks}
- Gaya Bahasa: ${bahasa}
- Mode Generator: ${mode}
${topikKhusus ? `- Fokus Topik Khusus Tambahan: ${topikKhusus}` : ''}

PEDOMAN DOMAIN:
1. LITERASI:
   Subdomain: Menemukan informasi, Memahami informasi, Menganalisis informasi, Mengevaluasi informasi, Merefleksikan informasi.
   Untuk SD: teks konkret dekat dengan kehidupan anak, kalimat runtut dan edukatif.
   Untuk SMP: teks lebih analitis, kosakata kaya, butuh penalaran dan perbandingan multi-informasi.

2. NUMERASI:
   Subdomain: Bilangan, Aljabar, Geometri dan pengukuran, Data dan ketidakpastian, Pemecahan masalah.
   PENTING: Jangan membuat soal numerasi hanya berupa hitungan aritmatika mentah tanpa cerita! Wajib berupa pemecahan masalah kontekstual yang merangsang nalar berpikir kritis siswa.

PRINSIP PENYUSUNAN BUTIR:
- Distraktor opsi (A, B, C, D) harus masuk akal, homogen panjangnya, dan berasal dari kemungkinan miskonsepsi berpikir siswa.
- Kunci jawaban mutlak akurat dan dapat dibuktikan kebenarannya secara logis dari stimulus.
- Pembahasan harus mendalam dan terstruktur: berikan "Langkah Pembahasan & Pembuktian" (proses berpikir langkah demi langkah, kutipan kalimat bukti stimulus untuk Literasi, dan prosedur matematis/penalaran sistematis untuk Numerasi).
- WAJIB MENAMBAHKAN TIPS & TRIK CEPAT DENGAN PENJELASAN PEDAGOGIS LENGKAP: Setiap butir soal WAJIB memiliki properti "tips_trik" berisi penjelasan terstruktur yang mudah dipahami guru dan siswa:
  1. Trik Kilat & Strategi Cepat (hemat waktu, eliminasi pembatas mutlak, scanning kata kunci, pola angka/rumus praktis).
  2. Langkah Cepat Siswa (tindakan praktis langkah 1, 2, 3).
  3. Penjelasan Logika Konseptual (alasan mendasar mengapa trik ini valid secara akademis, bukan tebak-tebakan).
  4. Catatan Bimbingan Guru (panduan pedagogis bagi guru dalam menerangkan konsep & mengatasi miskonsepsi).
  5. Waspada Jebakan Soal (trik menghindari distraktor pengecoh yang mengecoh).
- Cantumkan indikator keberhasilan, kemampuan yang diukur, kesalahan umum siswa, serta alasan distraktor.
- PENTING UNTUK SOAL URAIAN: Jika bentuk_soal adalah 'Uraian' atau 'Campuran', WAJIB menyertakan objek 'rubrik' (Rubrik Skor Analitik Bertingkat skala 2, 1, 0) lengkap dengan deskripsi kriteria dan contoh jawaban siswa.

OUTPUT HARUS DALAM FORMAT JSON VALID:
{
  "metadata": {
    "jenjang": "${jenjang}",
    "kelas": "${kelas}",
    "domain": "${domain}",
    "jumlah_soal": ${jumlah_soal},
    "tingkat_kesulitan": "${tingkat_kesulitan}",
    "bentuk_soal": "${bentuk_soal}",
    "level_kognitif": "${level_kognitif}",
    "konteks": "${konteks}",
    "mode": "${mode}"
  },
  "soal": [
    {
      "id": "SOAL-01",
      "domain": "Literasi atau Numerasi",
      "subdomain": "Nama Subdomain",
      "kompetensi": "Deskripsi kompetensi yang diukur",
      "konten": "Judul atau materi pokok konten",
      "konteks": "${konteks}",
      "level_kognitif": "Memahami/Menerapkan/Menganalisis/Mengevaluasi/Mencipta",
      "kesulitan": "Mudah/Sedang/Sulit",
      "bentuk_soal": "Pilihan Ganda atau Uraian",
      "stimulus": "Teks bacaan, dialog, tabel data, atau narasi situasi kontekstual yang kaya dan jelas",
      "pertanyaan": "Kalimat pertanyaan yang jelas, tidak ambigu",
      "opsi": {
        "A": "Pilihan A",
        "B": "Pilihan B",
        "C": "Pilihan C",
        "D": "Pilihan D"
      },
      "kunci": "A/B/C/D (atau uraian kunci jika Uraian)",
      "pembahasan": "Langkah Pembahasan & Pembuktian: Proses berpikir runtut, kutipan kalimat bukti teks untuk literasi atau langkah kalkulasi sistematis untuk numerasi.",
      "tips_trik": "Tips & Trik cepat menjawab soal TKA ini: Strategi praktis kilat, metode eliminasi distraktor, kata kunci scanning, atau trik hitung efisien.",
      "indikator": "Indikator pencapaian kompetensi siswa",
      "tag": ["Literasi", "SD 5", "..."],
      "kemampuan_diukur": "Uraian kemampuan",
      "kesalahan_umum": "Miskonsepsi umum siswa",
      "alasan_distraktor": {
        "A": "Mengapa opsi ini salah/benar...",
        "B": "Mengapa opsi ini salah...",
        "C": "Mengapa opsi ini salah...",
        "D": "Mengapa opsi ini salah..."
      },
      "rubrik": {
        "skor_maksimal": 2,
        "pedoman_penskoran": "Pedoman penilai dalam memberikan skor analitik bertingkat 2, 1, atau 0.",
        "kriteria": [
          {
            "skor": 2,
            "label": "Skor 2: Penalaran Lengkap",
            "deskripsi": "Jawaban benar dan menyertakan bukti teks / langkah matematis lengkap dan logis.",
            "contoh_jawaban": "Contoh kalimat respon siswa yang layak mendapatkan skor penuh."
          },
          {
            "skor": 1,
            "label": "Skor 1: Sebagian Benar / Parsial",
            "deskripsi": "Jawaban benar tanpa langkah/alasan, ATAU langkah benar namun hasil akhir salah.",
            "contoh_jawaban": "Contoh respon siswa dengan penalaran parsial."
          },
          {
            "skor": 0,
            "label": "Skor 0: Tidak Tepat / Kosong",
            "deskripsi": "Jawaban salah total, tidak relevan dengan stimulus, atau tidak dijawab.",
            "contoh_jawaban": "Contoh respon yang tidak memenuhi kriteria."
          }
        ]
      }
    }
  ]
}
`;
}

// Helper to synthesize fresh question variants for fallback or when count exceeds pre-curated pool
function createDivergentSoal(base: SoalItem, index: number, kelas: string, jenjang: string): SoalItem {
  if (index === 0) {
    return {
      ...base,
      id: `SOAL-${jenjang}-${index + 1}`,
      kelas: kelas as any,
      jenjang: jenjang as any,
    };
  }

  const nameVariants = [
    { from: /Pak Budi/gi, to: 'Pak Rahmat' },
    { from: /Siti/gi, to: 'Nurhalizah' },
    { from: /Andi/gi, to: 'Andi Tenri' },
    { from: /Ani/gi, to: 'Meutia' },
    { from: /SDN Pertiwi/gi, to: 'SD Inpres Sidrap' },
    { from: /SMP Negeri 1/gi, to: 'SMP Unggulan Sidrap' },
  ];

  let mutatedStimulus = base.stimulus;
  let mutatedPertanyaan = base.pertanyaan;
  let mutatedPembahasan = base.pembahasan;
  let mutatedOpsi = { ...base.opsi };

  // If numeracy, scale numbers slightly or vary parameters
  if (base.domain === 'Numerasi') {
    const scaleFactor = 1 + ((index % 3) + 1) * 0.5; // 1.5, 2.0, 2.5
    mutatedStimulus = mutatedStimulus.replace(/\b(\d{2,5})\b/g, (match) => {
      const val = parseInt(match, 10);
      return String(Math.round(val * scaleFactor));
    });
  }

  const variant = nameVariants[index % nameVariants.length];
  mutatedStimulus = mutatedStimulus.replace(variant.from, variant.to);
  mutatedPertanyaan = mutatedPertanyaan.replace(variant.from, variant.to);
  mutatedPembahasan = mutatedPembahasan.replace(variant.from, variant.to);

  return {
    ...base,
    id: `SOAL-${jenjang}-${index + 1}`,
    kelas: kelas as any,
    jenjang: jenjang as any,
    stimulus: mutatedStimulus,
    pertanyaan: mutatedPertanyaan,
    opsi: mutatedOpsi,
    pembahasan: mutatedPembahasan,
  };
}

// Generate Questions API
app.post('/api/generate', async (req, res) => {
  const {
    jenjang = 'SD',
    kelas = 'SD 5',
    domain = 'Literasi dan Numerasi',
    jumlah_soal = 5,
    bentuk_soal = 'Pilihan Ganda',
    tingkat_kesulitan = 'Campuran',
    level_kognitif = 'Campuran',
    konteks = 'Kehidupan sehari-hari',
    bahasa = 'Sesuai tingkat perkembangan siswa',
    mode = 'ASESMEN',
    topikKhusus = '',
    sumber = 'gemini', // 'gemini' | 'bank_kurasi'
    randomSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    excludeTopics = [],
    variasiTema = [],
  } = req.body;

  const count = Math.min(Math.max(Number(jumlah_soal) || 5, 1), 50);

  // If user explicitly chooses Bank Kurasi Standar, skip AI and serve immediately
  if (sumber === 'bank_kurasi') {
    const filtered = DEFAULT_SOAL_BANK.filter((item) => {
      if (domain === 'Literasi' && item.domain !== 'Literasi') return false;
      if (domain === 'Numerasi' && item.domain !== 'Numerasi') return false;
      if (jenjang && item.jenjang !== jenjang) return false;
      return true;
    });

    const pool = filtered.length > 0 ? filtered : DEFAULT_SOAL_BANK;
    const picked: SoalItem[] = [];

    for (let i = 0; i < count; i++) {
      const base = pool[i % pool.length];
      picked.push(createDivergentSoal(base, i, kelas, jenjang));
    }

    const bankResult: PaketSoalResponse = {
      metadata: {
        jenjang: jenjang as any,
        kelas: kelas as any,
        domain: domain as any,
        jumlah_soal: picked.length,
        tingkat_kesulitan: tingkat_kesulitan as any,
        bentuk_soal: bentuk_soal as any,
        level_kognitif: level_kognitif as any,
        konteks: konteks as any,
        bahasa: bahasa as any,
        mode: mode as any,
        judul: `Paket Kurasi Standar ${domain} - ${kelas} (${mode})`,
        waktu_menit: Math.round(picked.length * 2.5),
      },
      soal: picked,
    };

    return res.json({
      success: true,
      data: bankResult,
      source: 'bank_kurasi',
      message: 'Soal berhasil dimuat dari Bank Kurasi Standar Terkalibrasi Kurikulum Nasional & ANBK.',
    });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      let rawSoalList: any[] = [];

      if (count <= 25) {
        const prompt = buildGeneratorPrompt({
          jenjang,
          kelas,
          domain,
          jumlah_soal: count,
          bentuk_soal,
          tingkat_kesulitan,
          level_kognitif,
          konteks,
          bahasa,
          mode,
          topikKhusus,
          randomSeed,
          excludeTopics,
          variasiTema,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.85,
            maxOutputTokens: 65536,
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.soal)) {
          rawSoalList = parsed.soal;
        }
      } else {
        // High count (26-50 questions): parallel batch generation to prevent latency timeout and preserve depth
        const countA = Math.ceil(count / 2);
        const countB = count - countA;

        const promptA = buildGeneratorPrompt({
          jenjang,
          kelas,
          domain,
          jumlah_soal: countA,
          bentuk_soal,
          tingkat_kesulitan,
          level_kognitif,
          konteks,
          bahasa,
          mode,
          topikKhusus: topikKhusus ? `${topikKhusus} (Bagian 1)` : undefined,
          randomSeed: `${randomSeed}-A`,
          excludeTopics,
          variasiTema,
        });

        const promptB = buildGeneratorPrompt({
          jenjang,
          kelas,
          domain,
          jumlah_soal: countB,
          bentuk_soal,
          tingkat_kesulitan,
          level_kognitif,
          konteks,
          bahasa,
          mode,
          topikKhusus: topikKhusus ? `${topikKhusus} (Bagian 2)` : undefined,
          randomSeed: `${randomSeed}-B`,
          excludeTopics: [...excludeTopics, 'bagian-1'],
          variasiTema,
        });

        const [resA, resB] = await Promise.allSettled([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptA,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.85,
              maxOutputTokens: 65536,
            },
          }),
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptB,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.9,
              maxOutputTokens: 65536,
            },
          }),
        ]);

        if (resA.status === 'fulfilled') {
          try {
            const parsedA = JSON.parse(resA.value.text?.trim() || '');
            if (parsedA && Array.isArray(parsedA.soal)) {
              rawSoalList.push(...parsedA.soal);
            }
          } catch (e) {
            console.warn('Batch A parse warning:', e);
          }
        }

        if (resB.status === 'fulfilled') {
          try {
            const parsedB = JSON.parse(resB.value.text?.trim() || '');
            if (parsedB && Array.isArray(parsedB.soal)) {
              rawSoalList.push(...parsedB.soal);
            }
          } catch (e) {
            console.warn('Batch B parse warning:', e);
          }
        }
      }

      // STRICT ANTI-DUPLICATION FILTER
      // Verify questions are non-repetitive by checking cleaned question & stimulus signatures
      const seenSignatures = new Set<string>();
      const deduplicatedRaw: any[] = [];

      for (const item of rawSoalList) {
        if (!item || !item.pertanyaan) continue;
        const qClean = String(item.pertanyaan).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 45);
        const sClean = String(item.stimulus || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 45);
        const sig = `${qClean}#${sClean}`;

        if (seenSignatures.has(sig) || (qClean.length > 15 && seenSignatures.has(qClean))) {
          // Duplicate found, discard item
          continue;
        }

        seenSignatures.add(sig);
        if (qClean.length > 15) {
          seenSignatures.add(qClean);
        }
        deduplicatedRaw.push(item);
      }

      if (deduplicatedRaw.length > 0) {
        // Ensure every question has required keys and clean sequential numbering
        const sanitizedSoal: SoalItem[] = deduplicatedRaw.slice(0, count).map((item: any, idx: number) => ({
          id: `SOAL-${jenjang}-${idx + 1}`,
          jenjang: item.jenjang || jenjang,
          kelas: item.kelas || kelas,
          domain: item.domain === 'Numerasi' ? 'Numerasi' : 'Literasi',
          subdomain: item.subdomain || (item.domain === 'Numerasi' ? 'Bilangan' : 'Memahami informasi'),
          kompetensi: item.kompetensi || 'Pengukuran kompetensi kontekstual.',
          konten: item.konten || 'Materi Pokok',
          konteks: item.konteks || konteks,
          level_kognitif: item.level_kognitif || 'Menerapkan',
          kesulitan: item.kesulitan || 'Sedang',
          bentuk_soal: item.bentuk_soal || 'Pilihan Ganda',
          stimulus: item.stimulus || 'Stimulus bacaan atau situasi numerasi.',
          pertanyaan: item.pertanyaan || 'Pertanyaan pemantik kompetensi.',
          opsi: item.opsi || {
            A: 'Pilihan A',
            B: 'Pilihan B',
            C: 'Pilihan C',
            D: 'Pilihan D',
          },
          kunci: item.kunci || 'A',
          pembahasan: item.pembahasan || 'Pembahasan langkah pemikiran.',
          indikator: item.indikator || 'Siswa mampu menyelesaikan permasalahan.',
          tag: Array.isArray(item.tag) ? item.tag : [domain, jenjang, kelas],
          kemampuan_diukur: item.kemampuan_diukur || '',
          kesalahan_umum: item.kesalahan_umum || '',
          alasan_distraktor: item.alasan_distraktor || {},
          rubrik: item.rubrik && item.rubrik.kriteria ? item.rubrik : undefined,
          tips_trik: item.tips_trik || undefined,
        }));

        // If deduplication caused fewer questions than requested, supplement with differentiated items
        if (sanitizedSoal.length < count) {
          const filtered = DEFAULT_SOAL_BANK.filter((item) => {
            if (domain === 'Literasi' && item.domain !== 'Literasi') return false;
            if (domain === 'Numerasi' && item.domain !== 'Numerasi') return false;
            if (jenjang && item.jenjang !== jenjang) return false;
            return true;
          });
          const pool = filtered.length > 0 ? filtered : DEFAULT_SOAL_BANK;
          let fillIndex = 0;
          while (sanitizedSoal.length < count) {
            const base = pool[fillIndex % pool.length];
            sanitizedSoal.push(createDivergentSoal(base, sanitizedSoal.length, kelas, jenjang));
            fillIndex++;
          }
        }

        const result: PaketSoalResponse = {
          metadata: {
            jenjang: jenjang as any,
            kelas: kelas as any,
            domain: domain as any,
            jumlah_soal: sanitizedSoal.length,
            tingkat_kesulitan: tingkat_kesulitan as any,
            bentuk_soal: bentuk_soal as any,
            level_kognitif: level_kognitif as any,
            konteks: konteks as any,
            bahasa: bahasa as any,
            mode: mode as any,
            judul: `Paket Asesmen ${domain} - ${kelas} (${mode})`,
            waktu_menit: Math.round(sanitizedSoal.length * 2.5),
          },
          soal: sanitizedSoal,
        };

        return res.json({
          success: true,
          data: result,
          source: 'gemini',
          antiDuplikasi: true,
          message: `Berhasil membuat ${sanitizedSoal.length} butir soal orisinal dan bervariasi dengan Gemini AI.`,
        });
      }
    } catch (err: any) {
      console.warn('Gemini generation failed, falling back to curated bank:', err?.message || err);
    }
  }

  // Fallback to high quality pre-curated default bank with divergent variations
  const filtered = DEFAULT_SOAL_BANK.filter((item) => {
    if (domain === 'Literasi' && item.domain !== 'Literasi') return false;
    if (domain === 'Numerasi' && item.domain !== 'Numerasi') return false;
    if (jenjang && item.jenjang !== jenjang) return false;
    return true;
  });

  const pool = filtered.length > 0 ? filtered : DEFAULT_SOAL_BANK;
  const picked: SoalItem[] = [];

  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    picked.push(createDivergentSoal(base, i, kelas, jenjang));
  }

  const fallbackResult: PaketSoalResponse = {
    metadata: {
      jenjang: jenjang as any,
      kelas: kelas as any,
      domain: domain as any,
      jumlah_soal: picked.length,
      tingkat_kesulitan: tingkat_kesulitan as any,
      bentuk_soal: bentuk_soal as any,
      level_kognitif: level_kognitif as any,
      konteks: konteks as any,
      bahasa: bahasa as any,
      mode: mode as any,
      judul: `Paket Asesmen ${domain} - ${kelas} (${mode})`,
      waktu_menit: Math.round(picked.length * 2.5),
    },
    soal: picked,
  };

  return res.json({
    success: true,
    data: fallbackResult,
    source: 'bank_fallback',
    antiDuplikasi: true,
    message: ai ? 'Menggunakan bank kurasi terkalibrasi beraneka ragam' : 'Mode offline / bank kurasi terstandar',
  });
});

// Single Adaptive Question Generator (CAT)
app.post('/api/adaptive-next', async (req, res) => {
  const {
    jenjang = 'SD',
    kelas = 'SD 5',
    domain = 'Numerasi',
    currentDifficulty = 'Sedang',
    lastAnswerCorrect = true,
    historyIds = [],
    step = 1,
    randomSeed = `${Date.now()}-${step}`,
  } = req.body;

  // Determine next target difficulty
  let nextDifficulty: 'Mudah' | 'Sedang' | 'Sulit' = 'Sedang';
  if (lastAnswerCorrect) {
    nextDifficulty = currentDifficulty === 'Mudah' ? 'Sedang' : 'Sulit';
  } else {
    nextDifficulty = currentDifficulty === 'Sulit' ? 'Sedang' : 'Mudah';
  }

  // Pick a dynamic theme from palette for this adaptive step
  const themeIndex = (step * 7 + Math.floor(Math.random() * 5)) % THEMATIC_PALETTE.length;
  const targetTheme = THEMATIC_PALETTE[themeIndex];

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `
Hasilkan TEPAT 1 butir soal adaptif (Computerized Adaptive Testing) untuk siswa ${jenjang} (${kelas}).
Domain: ${domain}
Tingkat Kesulitan Target: ${nextDifficulty}
Nomor Langkah Soal: Ke-${step} (Sesi Acak #${randomSeed})
Tema Konteks Spesifik: "${targetTheme}"

ATURAN ANTI-DUPLIKASI KETAT:
- DILARANG mengulang pertanyaan atau stimulus dari langkah sebelumnya.
- Gunakan stimulus dunia nyata yang baru, segar, dan orisinal berlatar konteks "${targetTheme}".
- Jangan gunakan tokoh klise berulang.

Karakteristik:
- Sangat kontekstual, menarik, realistis.
- Menguji penalaran mendalam (bukan sekadar rumus mentah/hafalan).
- 4 opsi pilihan ganda A, B, C, D dengan distraktor bermakna.
- Pembahasan lengkap langkah demi langkah ("Langkah Pembahasan & Pembuktian").
- WAJIB berikan "tips_trik": Tips dan trik cepat menjawab soal TKA ini.

Keluarkan dalam format JSON:
{
  "id": "ADAPTIF-${step}",
  "domain": "${domain}",
  "subdomain": "Subdomain relevan",
  "kompetensi": "Uraian kompetensi spesifik",
  "konten": "Konten materi",
  "konteks": "${targetTheme}",
  "level_kognitif": "${nextDifficulty === 'Sulit' ? 'Menganalisis' : nextDifficulty === 'Sedang' ? 'Menerapkan' : 'Memahami'}",
  "kesulitan": "${nextDifficulty}",
  "bentuk_soal": "Pilihan Ganda",
  "stimulus": "Stimulus teks/data menarik",
  "pertanyaan": "Pertanyaan",
  "opsi": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "kunci": "A",
  "pembahasan": "Langkah Pembahasan & Pembuktian: Proses berpikir runtut...",
  "tips_trik": "Tips & Trik cepat menjawab soal TKA ini: Strategi eliminasi, scanning, atau jalan pintas...",
  "indikator": "...",
  "tag": ["Adaptif", "${domain}", "${nextDifficulty}"],
  "kemampuan_diukur": "...",
  "kesalahan_umum": "..."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '');
      if (parsed && parsed.pertanyaan) {
        return res.json({ success: true, soal: parsed, nextDifficulty, source: 'gemini' });
      }
    } catch (e: any) {
      console.warn('Adaptive gemini failed:', e?.message || e);
    }
  }

  // Fallback from pool with divergence
  const candidate =
    DEFAULT_SOAL_BANK.find(
      (s) => s.kesulitan === nextDifficulty && (domain === 'Campuran' || s.domain === domain) && !historyIds.includes(s.id)
    ) || DEFAULT_SOAL_BANK[step % DEFAULT_SOAL_BANK.length];

  const divergent = createDivergentSoal(candidate, step, kelas, jenjang);

  return res.json({
    success: true,
    soal: {
      ...divergent,
      id: `ADAPTIF-${step}`,
      kesulitan: nextDifficulty,
    },
    nextDifficulty,
    source: 'fallback',
  });
});

// Deep Pedagogical Analysis API
app.post('/api/deep-analysis', async (req, res) => {
  const {
    soalItems = [],
    jawabanSiswa = {},
    durasiDetik = 0,
    jenjang = 'SD',
    kelas = 'SD 5',
  } = req.body;

  let totalBenar = 0;
  let totalSalah = 0;
  const itemAnalyses: any[] = [];

  for (const item of soalItems) {
    const userAns = jawabanSiswa[item.id];
    const isCorrect = userAns === item.kunci;
    if (isCorrect) totalBenar++;
    else totalSalah++;

    itemAnalyses.push({
      id: item.id,
      domain: item.domain,
      subdomain: item.subdomain,
      kompetensi: item.kompetensi,
      kesulitan: item.kesulitan,
      isCorrect,
      jawabanSiswa: userAns || 'Tidak Dijawab',
      kunci: item.kunci,
      kesalahanUmum: item.kesalahan_umum || '',
    });
  }

  const total = soalItems.length || 1;
  const persentase = Math.round((totalBenar / total) * 100);

  let kategori = 'Perlu Penguatan';
  if (persentase >= 90) kategori = 'Sangat Baik';
  else if (persentase >= 80) kategori = 'Sudah Menguasai';
  else if (persentase >= 70) kategori = 'Sudah Berkembang';
  else if (persentase >= 50) kategori = 'Sedang Berkembang';

  const ai = getGeminiClient();
  if (ai && itemAnalyses.length > 0) {
    try {
      const prompt = `
Sebagai pakar asesmen pendidikan dan kurikulum Indonesia, buatlah evaluasi profil kompetensi dan rekomendasi pembelajaran konstruktif berdasarkan hasil tes siswa berikut:
- Jenjang: ${jenjang} (${kelas})
- Jumlah Soal: ${total}
- Benar: ${totalBenar}, Salah: ${totalSalah}, Persentase: ${persentase}% (Kategori: ${kategori})
- Rekap Jawaban Siswa: ${JSON.stringify(itemAnalyses)}

ATURAN REKOMENDASI:
1. Gunakan bahasa yang ramah, konstruktif, dan memberdayakan siswa.
2. JANGAN menggunakan label negatif seperti "bodoh" atau "rendah".
3. Gunakan istilah: "sudah berkembang", "perlu penguatan", "sedang berkembang", "sudah menguasai", "sangat baik".
4. Berikan rekomendasi materi belajar yang spesifik dan rekomendasi latihan berikutnya.

Keluarkan dalam format JSON:
{
  "kompetensiDikuasai": ["...", "..."],
  "kompetensiPerluPenguatan": ["...", "..."],
  "analisisKesalahan": ["...", "..."],
  "rekomendasiMateri": ["...", "..."],
  "rekomendasiLatihanBerikutnya": "Rencana latihan bertahap...",
  "tingkatKesulitanBerikutnya": "Mudah" | "Sedang" | "Sulit"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '');
      return res.json({
        success: true,
        summary: {
          totalSoal: total,
          benar: totalBenar,
          salah: totalSalah,
          skor: persentase,
          persentase,
          kategori,
          durasiDetik,
        },
        aiFeedback: parsed,
      });
    } catch (e: any) {
      console.warn('Deep analysis gemini failed, using rule-based fallback:', e?.message || e);
    }
  }

  // Rule-based fallback feedback
  const dikuasai = itemAnalyses.filter((i) => i.isCorrect).map((i) => `${i.domain}: ${i.kompetensi}`);
  const penguatan = itemAnalyses.filter((i) => !i.isCorrect).map((i) => `${i.domain}: ${i.kompetensi}`);
  const kesalahan = itemAnalyses
    .filter((i) => !i.isCorrect && i.kesalahanUmum)
    .map((i) => i.kesalahanUmum);

  const fallbackFeedback = {
    kompetensiDikuasai: dikuasai.length > 0 ? Array.from(new Set(dikuasai)) : ['Memahami instruksi dasar pengerjaan soal.'],
    kompetensiPerluPenguatan: penguatan.length > 0 ? Array.from(new Set(penguatan)) : ['Pertahankan performa dan eksplorasi soal HOTS lebih lanjut.'],
    analisisKesalahan: kesalahan.length > 0 ? Array.from(new Set(kesalahan)) : ['Terburu-buru memilih opsi atau kurang mencermati detail stimulus teks.'],
    rekomendasiMateri: [
      'Membaca teks cerita dan infografis sains kontekstual secara teliti.',
      'Melatih penalaran matematika multi-langkah melalui permasalahan kehidupan sehari-hari.',
      'Menganalisis hubungan sebab-akibat dan memeriksa data tabel sebelum menjawab.',
    ],
    rekomendasiLatihanBerikutnya:
      persentase >= 80
        ? 'Lanjutkan ke latihan soal HOTS tingkat penalaran analisis dan evaluasi.'
        : 'Perbanyak latihan soal tingkat pemahaman dan penerapan berkonteks lingkungan sekolah.',
    tingkatKesulitanBerikutnya: persentase >= 80 ? 'Sulit' : persentase >= 50 ? 'Sedang' : 'Mudah',
  };

  return res.json({
    success: true,
    summary: {
      totalSoal: total,
      benar: totalBenar,
      salah: totalSalah,
      skor: persentase,
      persentase,
      kategori,
      durasiDetik,
    },
    aiFeedback: fallbackFeedback,
  });
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the continuous HTTP server when not running in Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
