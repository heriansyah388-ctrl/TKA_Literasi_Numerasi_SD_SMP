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
  } = params;

  return `
Anda adalah AI Generator Soal Kompetensi Akademik Siswa SD dan SMP di Indonesia.
Tugas utama Anda adalah menghasilkan ${jumlah_soal} butir soal asesmen yang valid, kontekstual, bervariasi, tidak monoton, dan mampu mengukur kompetensi akademik siswa sesuai kurikulum nasional dan standar Tes Kemampuan Akademik (TKA).

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
${topikKhusus ? `- Fokus Topik Khusus: ${topikKhusus}` : ''}

PEDOMAN DOMAIN:
1. LITERASI:
   Subdomain: Menemukan informasi, Memahami informasi, Menganalisis informasi, Mengevaluasi informasi, Merefleksikan informasi.
   Gunakan jenis teks beragam (narasi, deskripsi, eksposisi, prosedur, berita sederhana, data tabel, poster/infografis singkat).
   Untuk SD: teks konkret dekat dengan kehidupan anak, kalimat relatif pendek.
   Untuk SMP: teks lebih kompleks, kosakata kaya, butuh penalaran dan perbandingan multi-informasi.

2. NUMERASI:
   Subdomain: Bilangan, Aljabar, Geometri dan pengukuran, Data dan ketidakpastian, Pemecahan masalah.
   PENTING: Jangan membuat soal numerasi hanya berupa operasi hitung murni! Wajib menggunakan konteks realistis dan penalaran siswa.

PRINSIP WAJIB:
- Distraktor opsi (A, B, C, D) harus masuk akal dan berasal dari kemungkinan kesalahan konsepsi siswa.
- Kunci jawaban mutlak tepat dan dapat dibuktikan dari stimulus / perhitungan.
- Pembahasan harus mendalam dan terstruktur: berikan "Langkah Pembahasan & Pembuktian" (proses berpikir langkah demi langkah, bukti kalimat dari stimulus untuk Literasi, dan prosedur matematis/logis untuk Numerasi).
- WAJIB MENAMBAHKAN TIPS & TRIK CEPAT: Setiap butir soal WAJIB memiliki properti "tips_trik" berisi "Tips & Trik cepat menjawab soal TKA ini" (strategi cerdas, eliminasi opsi ekstrem/pembatas mutlak, teknik scanning kata kunci pada stimulus, rumus praktis, tripel pythagoras, faktor pengali persentase, atau trik hemat waktu bagi siswa).
- Cantumkan indikator keberhasilan, kemampuan yang diukur, kesalahan umum siswa, serta alasan distraktor.
- PENTING UNTUK SOAL URAIAN: Jika bentuk_soal adalah 'Uraian' atau 'Campuran', WAJIB menyertakan objek 'rubrik' (Rubrik Skor Analitik Bertingkat skala 2, 1, 0) lengkap dengan deskripsi kriteria dan contoh jawaban siswa.
- Terapkan 10 Internal Quality Checks sebelum menghasilkan output.

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
      picked.push({
        ...base,
        id: `${base.id}-${i + 1}`,
        kelas: kelas as any,
        jenjang: jenjang as any,
      });
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
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
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
          topikKhusus: topikKhusus ? `${topikKhusus} (Bagian 2)` : 'Variasi konteks dan stimulus lanjutan',
        });

        const [resA, resB] = await Promise.allSettled([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptA,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 65536,
            },
          }),
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptB,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
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

      if (rawSoalList.length > 0) {
        // Ensure every question has required keys and clean sequential numbering
        const sanitizedSoal: SoalItem[] = rawSoalList.slice(0, count).map((item: any, idx: number) => ({
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

        return res.json({ success: true, data: result, source: 'gemini' });
      }
    } catch (err: any) {
      console.warn('Gemini generation failed, falling back to curated bank:', err?.message || err);
    }
  }

  // Fallback to high quality pre-curated default bank
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
    picked.push({
      ...base,
      id: `${base.id}-${i + 1}`,
      kelas: kelas as any,
      jenjang: jenjang as any,
    });
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
      waktu_menit: picked.length * 2.5,
    },
    soal: picked,
  };

  return res.json({
    success: true,
    data: fallbackResult,
    source: 'bank_fallback',
    message: ai ? 'Menggunakan bank kurasi terkalibrasi' : 'Mode offline / bank kurasi terstandar',
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
  } = req.body;

  // Determine next target difficulty
  let nextDifficulty: 'Mudah' | 'Sedang' | 'Sulit' = 'Sedang';
  if (lastAnswerCorrect) {
    nextDifficulty = currentDifficulty === 'Mudah' ? 'Sedang' : 'Sulit';
  } else {
    nextDifficulty = currentDifficulty === 'Sulit' ? 'Sedang' : 'Mudah';
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `
Hasilkan TEPAT 1 butir soal adaptif (Computerized Adaptive Testing) untuk siswa ${jenjang} (${kelas}).
Domain: ${domain}
Tingkat Kesulitan Target: ${nextDifficulty}
Nomor Soal: Ke-${step}
Karakteristik:
- Sangat kontekstual, menarik, realistis.
- Menguji penalaran (bukan sekadar rumus/hafalan).
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
  "konteks": "Lingkungan/Sekolah/Sehari-hari",
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
          temperature: 0.7,
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

  // Fallback from pool
  const candidate = DEFAULT_SOAL_BANK.find(
    (s) => s.kesulitan === nextDifficulty && (domain === 'Campuran' || s.domain === domain) && !historyIds.includes(s.id)
  ) || DEFAULT_SOAL_BANK[step % DEFAULT_SOAL_BANK.length];

  return res.json({
    success: true,
    soal: {
      ...candidate,
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
