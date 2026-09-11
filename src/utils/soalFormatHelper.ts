import { SoalItem } from '../types';

export function isPgkSoal(soal: SoalItem): boolean {
  if (soal.pernyataan_kompleks && soal.pernyataan_kompleks.length > 0) return true;
  return soal.bentuk_soal === 'Pilihan Ganda Kompleks' || soal.bentuk_soal === 'Benar/Salah';
}

export function isMenjodohkanSoal(soal: SoalItem): boolean {
  if (soal.jodohkan_pairs && soal.jodohkan_pairs.length > 0) return true;
  return soal.bentuk_soal === 'Menjodohkan';
}

export function isUraianSoal(soal: SoalItem): boolean {
  if (isPgkSoal(soal) || isMenjodohkanSoal(soal)) return false;
  if (soal.bentuk_soal === 'Uraian') return true;
  return !soal.opsi || Object.keys(soal.opsi).length === 0;
}

/**
 * Normalisasi pernyataan kompleks jika ada atau jika bentuknya Benar/Salah / PGK
 */
export function getNormalizedPernyataan(soal: SoalItem): Array<{ id: string; teks: string; kunci: string }> {
  if (soal.pernyataan_kompleks && soal.pernyataan_kompleks.length > 0) {
    return soal.pernyataan_kompleks.map((p, idx) => ({
      id: p.id || `p_${idx + 1}`,
      teks: p.teks,
      kunci: typeof p.kunci === 'boolean' ? (p.kunci ? 'Benar' : 'Salah') : String(p.kunci || 'Benar'),
    }));
  }

  // Jika bentuk PGK atau Benar/Salah tapi disimpan dalam bentuk opsi:
  if (soal.opsi && Object.keys(soal.opsi).length > 0) {
    // Cek apakah opsi tersebut mewakili pernyataan-pernyataan
    return Object.entries(soal.opsi).map(([key, val], idx) => {
      // Periksa apakah kunci memuat huruf ini
      const isTrue = soal.kunci && (soal.kunci.includes(key) || soal.kunci.toUpperCase().includes(key.toUpperCase()));
      return {
        id: key || `p_${idx + 1}`,
        teks: val,
        kunci: isTrue ? 'Benar' : 'Salah',
      };
    });
  }

  return [];
}

/**
 * Normalisasi pasangan menjodohkan (Premis -> Respon)
 */
export function getNormalizedJodohkanPairs(soal: SoalItem): Array<{ premis: string; respon: string; keyId?: string }> {
  if (soal.jodohkan_pairs && soal.jodohkan_pairs.length > 0) {
    return soal.jodohkan_pairs;
  }

  // Fallback jika disimpan di opsi (misal "1-A, 2-B" atau premis di opsi)
  if (soal.opsi && Object.keys(soal.opsi).length >= 2) {
    const entries = Object.entries(soal.opsi);
    return entries.map(([k, v], idx) => ({
      premis: `Pernyataan ${idx + 1}: ${k}`,
      respon: v,
    }));
  }

  return [];
}

/**
 * Memeriksa kebenaran jawaban siswa secara akurat untuk semua tipe soal
 */
export function checkJawaban(soal: SoalItem, jawaban: any): { isCorrect: boolean; scorePct: number } {
  if (jawaban === undefined || jawaban === null || jawaban === '') {
    return { isCorrect: false, scorePct: 0 };
  }

  // 1. Tipe Menjodohkan
  if (isMenjodohkanSoal(soal)) {
    const pairs = getNormalizedJodohkanPairs(soal);
    if (pairs.length === 0) return { isCorrect: true, scorePct: 100 };

    if (typeof jawaban !== 'object') return { isCorrect: false, scorePct: 0 };

    let benarCount = 0;
    pairs.forEach((pair, idx) => {
      const premisKey = `premis_${idx}`;
      const userSelectedRespon = jawaban[premisKey] ?? jawaban[pair.premis];
      if (userSelectedRespon === pair.respon) {
        benarCount++;
      }
    });

    const pct = Math.round((benarCount / pairs.length) * 100);
    return { isCorrect: benarCount === pairs.length, scorePct: pct };
  }

  // 2. Tipe Pilihan Ganda Kompleks
  if (isPgkSoal(soal)) {
    const pernyataanList = getNormalizedPernyataan(soal);

    // Kasus A: Matrix Benar/Salah
    if (pernyataanList.length > 0 && typeof jawaban === 'object' && !Array.isArray(jawaban)) {
      let benarCount = 0;
      pernyataanList.forEach((p) => {
        const userChoice = jawaban[p.id];
        const normalizedUserChoice = String(userChoice || '').trim().toLowerCase();
        const normalizedKey = String(p.kunci || '').trim().toLowerCase();

        const match =
          normalizedUserChoice === normalizedKey ||
          (normalizedUserChoice === 'benar' && (normalizedKey === 'true' || normalizedKey === 'ya' || normalizedKey === 'sesuai')) ||
          (normalizedUserChoice === 'salah' && (normalizedKey === 'false' || normalizedKey === 'tidak' || normalizedKey === 'tidak sesuai'));

        if (match) benarCount++;
      });

      const pct = Math.round((benarCount / pernyataanList.length) * 100);
      return { isCorrect: benarCount === pernyataanList.length, scorePct: pct };
    }

    // Kasus B: Multi-Select Checkboxes (Array of selected keys or comma-separated string)
    if (Array.isArray(jawaban)) {
      const selected = [...jawaban].map((s) => String(s).trim().toUpperCase()).sort();
      const expected = String(soal.kunci || '')
        .split(/[,\s]+/)
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .sort();

      const isMatch = selected.length === expected.length && selected.every((v, i) => v === expected[i]);
      return { isCorrect: isMatch, scorePct: isMatch ? 100 : 0 };
    }

    if (typeof jawaban === 'string') {
      const isMatch = jawaban.trim().toUpperCase() === String(soal.kunci || '').trim().toUpperCase();
      return { isCorrect: isMatch, scorePct: isMatch ? 100 : 0 };
    }
  }

  // 3. Tipe Uraian
  if (isUraianSoal(soal)) {
    const text = String(jawaban).trim();
    // Siswa memberikan jawaban jika menuliskan argumen > 10 karakter
    const hasThought = text.length >= 10;
    return { isCorrect: hasThought, scorePct: hasThought ? 100 : 0 };
  }

  // 4. Tipe Pilihan Ganda Tunggal
  const userAns = String(jawaban).trim().toUpperCase();
  const keyAns = String(soal.kunci || '').trim().toUpperCase();
  const isCorrect = userAns === keyAns;
  return { isCorrect, scorePct: isCorrect ? 100 : 0 };
}

/**
 * Format jawaban siswa menjadi teks yang mudah dibaca di layar laporan asesmen
 */
export function formatJawabanSiswa(soal: SoalItem, jawaban: any): string {
  if (jawaban === undefined || jawaban === null || jawaban === '') {
    return 'Tidak Dijawab';
  }

  if (isMenjodohkanSoal(soal)) {
    const pairs = getNormalizedJodohkanPairs(soal);
    if (typeof jawaban === 'object' && !Array.isArray(jawaban)) {
      const entries = pairs.map((pair, idx) => {
        const userRespon = jawaban[`premis_${idx}`] ?? jawaban[pair.premis] ?? 'Belum dijodohkan';
        return `[P${idx + 1}] ➔ ${userRespon}`;
      });
      return entries.join(' • ');
    }
    return String(jawaban);
  }

  if (isPgkSoal(soal)) {
    const statements = getNormalizedPernyataan(soal);
    if (statements.length > 0 && typeof jawaban === 'object' && !Array.isArray(jawaban)) {
      return statements
        .map((p, idx) => {
          const val = jawaban[p.id] || '-';
          return `Pernyataan ${idx + 1}: [${val}]`;
        })
        .join(' • ');
    }

    if (Array.isArray(jawaban)) {
      return `Pilihan: [${jawaban.join(', ')}]`;
    }
  }

  if (typeof jawaban === 'object') {
    return JSON.stringify(jawaban);
  }

  return String(jawaban);
}

/**
 * Format kunci jawaban menjadi teks terstruktur yang rapi untuk ulasan & guru
 */
export function formatKunciJawaban(soal: SoalItem): string {
  if (isMenjodohkanSoal(soal)) {
    const pairs = getNormalizedJodohkanPairs(soal);
    if (pairs.length > 0) {
      return pairs.map((p, i) => `(${i + 1}) ${p.premis} ➔ "${p.respon}"`).join(' | ');
    }
  }

  if (isPgkSoal(soal)) {
    const statements = getNormalizedPernyataan(soal);
    if (statements.length > 0) {
      return statements.map((p, i) => `(${i + 1}) ${p.kunci}`).join(' | ');
    }
  }

  return String(soal.kunci || '-');
}
