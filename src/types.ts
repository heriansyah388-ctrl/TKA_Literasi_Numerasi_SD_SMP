export type Jenjang = 'SD' | 'SMP';

export type Kelas =
  | 'SD 1' | 'SD 2' | 'SD 3' | 'SD 4' | 'SD 5' | 'SD 6'
  | 'SMP 7' | 'SMP 8' | 'SMP 9';

export type Domain = 'Literasi' | 'Numerasi' | 'Literasi dan Numerasi';

export type BentukSoal =
  | 'Pilihan Ganda'
  | 'Pilihan Ganda Kompleks'
  | 'Benar/Salah'
  | 'Menjodohkan'
  | 'Isian Singkat'
  | 'Uraian'
  | 'Campuran';

export type TingkatKesulitan = 'Mudah' | 'Sedang' | 'Sulit' | 'Campuran';

export type LevelKognitif =
  | 'Memahami'
  | 'Menerapkan'
  | 'Menganalisis'
  | 'Mengevaluasi'
  | 'Mencipta'
  | 'Campuran';

export type Konteks =
  | 'Kehidupan sehari-hari'
  | 'Sekolah'
  | 'Rumah'
  | 'Lingkungan'
  | 'Sosial'
  | 'Ekonomi sederhana'
  | 'Sains'
  | 'Teknologi'
  | 'Budaya lokal'
  | 'Data dan informasi'
  | 'Konteks bebas';

export type Bahasa =
  | 'Bahasa Indonesia sederhana'
  | 'Bahasa Indonesia akademik'
  | 'Sesuai tingkat perkembangan siswa';

export type ModeGenerator =
  | 'LATIHAN'
  | 'ASESMEN'
  | 'DIAGNOSTIK'
  | 'HOTS'
  | 'SIMULASI'
  | 'ADAPTIF'
  | 'REMEDIAL';

export type EngineSumber = 'gemini' | 'bank_kurasi';

export type SubdomainLiterasi =
  | 'Menemukan informasi'
  | 'Memahami informasi'
  | 'Menganalisis informasi'
  | 'Mengevaluasi informasi'
  | 'Merefleksikan informasi';

export type SubdomainNumerasi =
  | 'Bilangan'
  | 'Aljabar'
  | 'Geometri dan pengukuran'
  | 'Data dan ketidakpastian'
  | 'Pemecahan masalah';

export interface KriteriaRubrik {
  skor: number;
  label: string;
  deskripsi: string;
  contoh_jawaban?: string;
}

export interface RubrikAnalitik {
  skor_maksimal: number;
  pedoman_penskoran?: string;
  kriteria: KriteriaRubrik[];
}

export interface VisualDiagramData {
  tipe: 'diagram_batang' | 'tabel' | 'infografis' | 'perbandingan';
  judul?: string;
  satuan?: string;
  catatan?: string;
  // Untuk diagram batang
  batang?: Array<{ label: string; nilai: number; unit?: string; warna?: string }>;
  // Untuk tabel data
  kolom?: string[];
  baris?: Array<string[]>;
  // Untuk infografis metriks
  poinInfografis?: Array<{ label: string; nilai: string | number; sublabel?: string; icon?: string }>;
}

export interface SoalItem {
  id: string;
  jenjang?: Jenjang;
  kelas?: Kelas;
  domain: 'Literasi' | 'Numerasi';
  subdomain: string;
  kompetensi: string;
  konten: string;
  konteks: string;
  level_kognitif: string;
  kesulitan: 'Mudah' | 'Sedang' | 'Sulit';
  bentuk_soal: BentukSoal;
  stimulus: string;
  stimulus_visual?: VisualDiagramData;
  pertanyaan: string;
  opsi?: Record<string, string>; // For PG: { A: "...", B: "...", C: "...", D: "..." }
  pernyataan_kompleks?: Array<{ id: string; teks: string; kunci: string | boolean }>; // For PGK or Benar/Salah
  jodohkan_pairs?: Array<{ premis: string; respon: string }>; // For Menjodohkan
  kunci: string; // "A", "B", "C", "D" or string answer
  pembahasan: string;
  indikator: string;
  tag: string[];
  kemampuan_diukur?: string;
  kesalahan_umum?: string;
  alasan_distraktor?: Record<string, string>;
  rubrik?: RubrikAnalitik;
  tips_trik?: string;
}

export interface PaketSoalMetadata {
  jenjang: Jenjang;
  kelas: Kelas;
  domain: Domain;
  jumlah_soal: number;
  tingkat_kesulitan: TingkatKesulitan;
  bentuk_soal: BentukSoal;
  level_kognitif?: LevelKognitif;
  konteks?: Konteks;
  bahasa?: Bahasa;
  mode?: ModeGenerator;
  judul?: string;
  waktu_menit?: number;
}

export interface IdentitasSiswa {
  nama: string;
  kelas: string;
  nis: string;
}

export interface PaketSoalResponse {
  metadata: PaketSoalMetadata;
  soal: SoalItem[];
}

export interface JawabanSiswaMap {
  [soalId: string]: string | string[] | Record<string, string>;
}

export type KategoriKemampuan =
  | 'Perlu Penguatan'
  | 'Sedang Berkembang'
  | 'Sudah Berkembang'
  | 'Sudah Menguasai'
  | 'Sangat Baik';

export interface SubdomainScore {
  nama: string;
  domain: 'Literasi' | 'Numerasi';
  totalSoal: number;
  benar: number;
  persentase: number;
  kategori: KategoriKemampuan;
}

export interface AnalisisHasil {
  totalSoal: number;
  benar: number;
  salah: number;
  skor: number;
  persentase: number;
  kategori: KategoriKemampuan;
  durasiDetik: number;
  identitasSiswa?: IdentitasSiswa;
  literasiScores: SubdomainScore[];
  numerasiScores: SubdomainScore[];
  kompetensiDikuasai: string[];
  kompetensiPerluPenguatan: string[];
  analisisKesalahan: string[];
  rekomendasiMateri: string[];
  rekomendasiLatihanBerikutnya: string;
  tingkatKesulitanBerikutnya: 'Mudah' | 'Sedang' | 'Sulit';
}

export interface RekapNilaiSiswa {
  id: string;
  timestamp: number;
  tanggalStr: string;
  paketJudul: string;
  identitas: IdentitasSiswa;
  totalSoal: number;
  benar: number;
  salah: number;
  skor: number;
  persentase: number;
  kategori: KategoriKemampuan;
  durasiDetik: number;
  literasiBenar?: number;
  literasiTotal?: number;
  numerasiBenar?: number;
  numerasiTotal?: number;
}

export type AppTab =
  | 'generator'
  | 'soal_list'
  | 'cbt'
  | 'cat'
  | 'laporan'
  | 'bank_kurasi'
  | 'rekap_nilai'
  | 'gerak_berdampak';
