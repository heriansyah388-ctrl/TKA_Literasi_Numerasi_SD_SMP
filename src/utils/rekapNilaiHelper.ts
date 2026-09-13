import { RekapNilaiSiswa, KategoriKemampuan, IdentitasSiswa } from '../types';

const STORAGE_KEY = 'tka_rekap_nilai_kelas_v1';

/**
 * Mendapatkan seluruh riwayat rekap nilai siswa dari localStorage
 */
export function getRekapNilaiList(): RekapNilaiSiswa[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca rekap nilai:', err);
    return [];
  }
}

/**
 * Menyimpan hasil tes siswa baru ke dalam rekap kolektif
 */
export function saveRekapNilai(
  entry: Omit<RekapNilaiSiswa, 'id' | 'timestamp' | 'tanggalStr'>
): RekapNilaiSiswa {
  const now = new Date();
  const id = `REKAP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const tanggalStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newRecord: RekapNilaiSiswa = {
    ...entry,
    id,
    timestamp: Date.now(),
    tanggalStr,
  };

  const list = getRekapNilaiList();
  // Tambah di awal (paling baru)
  const updated = [newRecord, ...list];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Gagal menyimpan rekap nilai:', err);
  }

  return newRecord;
}

/**
 * Menghapus satu data rekap siswa berdasarkan ID
 */
export function deleteRekapNilai(id: string): RekapNilaiSiswa[] {
  const list = getRekapNilaiList();
  const filtered = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Gagal menghapus rekap:', err);
  }
  return filtered;
}

/**
 * Mengosongkan seluruh rekap nilai
 */
export function clearAllRekapNilai(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Gagal mengosongkan rekap:', err);
  }
}

/**
 * Ekspor kolektif ke file CSV Excel-ready dengan UTF-8 BOM
 */
export function exportRekapToCsv(list: RekapNilaiSiswa[], paketName: string = 'TKA'): void {
  if (list.length === 0) return;

  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'No',
    'Nama Siswa',
    'Kelas',
    'NIS',
    'Paket Asesmen',
    'Skor Akhir (0-100)',
    'Kategori Capaian',
    'Benar',
    'Salah',
    'Total Soal',
    'Literasi (%)',
    'Numerasi (%)',
    'Durasi Pengerjaan',
    'Waktu Selesai',
  ];

  const rows = list.map((item, idx) => {
    const menit = Math.floor(item.durasiDetik / 60);
    const detik = item.durasiDetik % 60;
    const durasiText = `${menit}m ${detik}s`;

    const litPct =
      item.literasiTotal && item.literasiTotal > 0
        ? Math.round(((item.literasiBenar || 0) / item.literasiTotal) * 100)
        : '-';

    const numPct =
      item.numerasiTotal && item.numerasiTotal > 0
        ? Math.round(((item.numerasiBenar || 0) / item.numerasiTotal) * 100)
        : '-';

    return [
      idx + 1,
      item.identitas.nama || 'Anonim',
      item.identitas.kelas || '-',
      item.identitas.nis || '-',
      item.paketJudul || paketName,
      item.skor,
      item.kategori,
      item.benar,
      item.salah,
      item.totalSoal,
      litPct,
      numPct,
      durasiText,
      item.tanggalStr,
    ]
      .map(escapeCsv)
      .join(';'); // Gunakan titik koma ';' untuk kompatibilitas otomatis Microsoft Excel regional Indonesia
  });

  const csvContent =
    '\uFEFF' + // UTF-8 BOM agar Excel menampilkan aksen dan karakter bahasa Indonesia dengan tepat
    [headers.map(escapeCsv).join(';'), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const nowStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute('download', `Rekap_Nilai_Kelas_${paketName.replace(/\s+/g, '_')}_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Mengisi data contoh 10 siswa rombel untuk pengujian cepat guru
 */
export function seedSampleRekapData(): RekapNilaiSiswa[] {
  const sampleStudents = [
    { nama: 'Ahmad Faiz Al-Ghifari', nis: '20260401', kelas: 'SD 5-A', skor: 95, benar: 19, salah: 1, total: 20, kat: 'Sangat Baik' as KategoriKemampuan, durasi: 1140 },
    { nama: 'Siti Nur Azizah', nis: '20260402', kelas: 'SD 5-A', skor: 90, benar: 18, salah: 2, total: 20, kat: 'Sangat Baik' as KategoriKemampuan, durasi: 1220 },
    { nama: 'Budi Kurniawan Pratama', nis: '20260403', kelas: 'SD 5-A', skor: 85, benar: 17, salah: 3, total: 20, kat: 'Sudah Menguasai' as KategoriKemampuan, durasi: 1350 },
    { nama: 'Dewi Ayu Lestari', nis: '20260404', kelas: 'SD 5-A', skor: 80, benar: 16, salah: 4, total: 20, kat: 'Sudah Menguasai' as KategoriKemampuan, durasi: 1400 },
    { nama: 'Rian Syahputra', nis: '20260405', kelas: 'SD 5-A', skor: 75, benar: 15, salah: 5, total: 20, kat: 'Sudah Berkembang' as KategoriKemampuan, durasi: 1480 },
    { nama: 'Nadia Putri Khairunnisa', nis: '20260406', kelas: 'SD 5-A', skor: 70, benar: 14, salah: 6, total: 20, kat: 'Sudah Berkembang' as KategoriKemampuan, durasi: 1500 },
    { nama: 'Dimas Aditya Nugraha', nis: '20260407', kelas: 'SD 5-A', skor: 65, benar: 13, salah: 7, total: 20, kat: 'Sedang Berkembang' as KategoriKemampuan, durasi: 1580 },
    { nama: 'Zahra Amelia', nis: '20260408', kelas: 'SD 5-A', skor: 60, benar: 12, salah: 8, total: 20, kat: 'Sedang Berkembang' as KategoriKemampuan, durasi: 1620 },
    { nama: 'Fajar Ramadhan', nis: '20260409', kelas: 'SD 5-A', skor: 55, benar: 11, salah: 9, total: 20, kat: 'Perlu Penguatan' as KategoriKemampuan, durasi: 1690 },
    { nama: 'Kirana Maulida', nis: '20260410', kelas: 'SD 5-A', skor: 50, benar: 10, salah: 10, total: 20, kat: 'Perlu Penguatan' as KategoriKemampuan, durasi: 1720 },
  ];

  const now = new Date();
  const created: RekapNilaiSiswa[] = sampleStudents.map((s, idx) => {
    const t = new Date(now.getTime() - idx * 3600000);
    return {
      id: `SAMPLE-${idx + 1}`,
      timestamp: t.getTime(),
      tanggalStr: t.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      paketJudul: 'Simulasi Terpadu TKA Literasi & Numerasi SD',
      identitas: {
        nama: s.nama,
        kelas: s.kelas,
        nis: s.nis,
      },
      totalSoal: s.total,
      benar: s.benar,
      salah: s.salah,
      skor: s.skor,
      persentase: s.skor,
      kategori: s.kat,
      durasiDetik: s.durasi,
      literasiBenar: Math.round(s.benar * 0.55),
      literasiTotal: 10,
      numerasiBenar: Math.round(s.benar * 0.45),
      numerasiTotal: 10,
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
  } catch (err) {
    console.error('Gagal mengisi sample rekap:', err);
  }

  return created;
}
