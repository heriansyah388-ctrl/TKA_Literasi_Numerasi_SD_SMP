import React, { useState } from 'react';
import {
  DATA_GERAK_BERDAMPAK,
  PilarGerakBerdampak,
  exportPanduanGerakBerdampakToWordDoc,
} from '../data/gerakBerdampakData';
import {
  Sparkles,
  GraduationCap,
  Download,
  Printer,
  Compass,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  FileText,
  Layers,
  Search,
  BookOpen,
  Award,
  CheckSquare,
  Square,
  ChevronRight,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';

interface GerakBerdampakViewProps {
  onNavigateTab: (tab: 'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi' | 'rekap_nilai') => void;
}

export const GerakBerdampakView: React.FC<GerakBerdampakViewProps> = ({ onNavigateTab }) => {
  const [selectedTag, setSelectedTag] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({
    step1: true,
    step2: true,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
  });

  const toggleChecklist = (key: string) => {
    setActiveChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tagList = ['Semua', 'Fase Diagnosa', 'Fase Reflektif', 'Fase Perencanaan', 'Fase Eksekusi', 'Fase Kolaboratif', 'Fase Data & Metrik', 'Fase Monitoring', 'Fase Dampak', 'Fase Pemulihan', 'Fase Inovasi', 'Fase Akuntabilitas'];

  const filteredPilar = DATA_GERAK_BERDAMPAK.filter((pilar) => {
    if (selectedTag !== 'Semua' && pilar.tag !== selectedTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pilar.huruf.toLowerCase().includes(q) ||
        pilar.judulLengkap.toLowerCase().includes(q) ||
        pilar.deskripsi.toLowerCase().includes(q) ||
        pilar.fiturWebTerkait.namaFitur.toLowerCase().includes(q) ||
        pilar.outputKonkret.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 dark:text-slate-200">
      {/* Hero Banner Inovasi */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-indigo-700/50">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Inovasi Pengawasan Satuan Pendidikan Disdikbud Kabupaten Sidrap</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              GERAK BERDAMPAK
            </h2>
            <p className="text-sm sm:text-base font-medium text-indigo-200">
              Gerakan Reflektif, Kolaboratif, dan Berkelanjutan Berbasis Data untuk Transformasi Mutu Pembelajaran
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Inovasi kepengawasan oleh <strong>Heriansyah, S.Si., S.Pd., M.Pd</strong> yang mengalihkan paradigma supervisi dari sekadar kepatuhan administratif menjadi <em>pendampingan bermakna berbasis data objektif hasil belajar murid</em>. Aplikasi Web TKA ini merupakan mesin digital operasional untuk merealisasikan seluruh 14 pilar GERAK BERDAMPAK.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-unduh-panduan-doc"
              onClick={exportPanduanGerakBerdampakToWordDoc}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Naskah Panduan Resmi (.doc Word)</span>
            </button>

            <button
              type="button"
              id="btn-cetak-panduan-window"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-300" />
              <span>Cetak Matriks 14 Pilar</span>
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none text-9xl font-black tracking-tighter text-white">
          GERAK
        </div>
      </div>

      {/* Nilai Utama & Integrasi Web TKA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">Berbasis Data Nyata</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Menghilangkan asumsi subjektif dengan data diagnostik literasi &amp; numerasi murid dari simulasi CBT dan CAT.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">Reflektif Tanpa Menyalahkan</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Membangun kemitraan apresiatif bersama Kepala Sekolah dan Guru untuk bersama-sama mengurai akar masalah.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">Solutif &amp; Kontekstual</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Dilengkapi tips pedagogis guru, rubrik analitik bertingkat, dan paket remedial otomatis yang siap eksekusi di kelas.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">Dampak Terukur</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Melacak kurva pertumbuhan kompetensi siswa sebelum dan sesudah intervensi melalui ledger rekapitulasi kelas.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar Matriks */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              14
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Matriks Operasional 14 Pilar &quot;GERAK BERDAMPAK&quot;
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Klik pilar untuk melihat peran operasional dan langsung hubungkan ke fitur aplikasi
              </p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pilar, fitur, atau peran..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px]">
          {tagList.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 14 Pilar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPilar.map((pilar, index) => (
          <div
            key={pilar.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-3.5"
          >
            {/* Header Pilar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {pilar.huruf}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {pilar.judulLengkap}
                    </h4>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {pilar.tag}
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-mono">#{index + 1}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pilar.deskripsi}
              </p>
            </div>

            {/* Peran Pengawas vs Sekolah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <strong className="text-indigo-900 dark:text-indigo-300 flex items-center gap-1 font-semibold">
                  <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Peran Pengawas:
                </strong>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  {pilar.peranPengawas}
                </p>
              </div>
              <div className="space-y-0.5">
                <strong className="text-emerald-900 dark:text-emerald-300 flex items-center gap-1 font-semibold">
                  <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Peran Sekolah/Guru:
                </strong>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  {pilar.peranSekolah}
                </p>
              </div>
            </div>

            {/* Hubungan ke Fitur Web & Output */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Fitur Eksekusi Web TKA:
                  </span>
                  <div className="font-semibold text-indigo-700 dark:text-indigo-300">
                    {pilar.fiturWebTerkait.namaFitur}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {pilar.fiturWebTerkait.deskripsiAksi}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <strong>Bukti:</strong> {pilar.outputKonkret}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateTab(pilar.fiturWebTerkait.tabTarget)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  <span>Buka Fitur</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instrumen Ceklis Supervisi Pendampingan Lapangan */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Instrumen Ceklis Pendampingan Pengawas di Satuan Pendidikan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Panduan praktis langkah pengawas saat hadir melakukan supervisi di sekolah binaan
              </p>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
            Siklus Mutu Berkelanjutan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'step1',
              title: '1. Pra-Kunjungan: Bedah Baseline Data',
              desc: 'Unduh rekap nilai atau laksanakan tes diagnostik singkat menggunakan Web TKA untuk melihat profil awal literasi-numerasi kelas.',
            },
            {
              id: 'step2',
              title: '2. Temu Awal: Dialog Reflektif Bersama Kepala Sekolah',
              desc: 'Diskusikan grafik sebaran capaian tanpa menyalahkan; rumuskan prioritas domain yang membutuhkan penguatan mendesak.',
            },
            {
              id: 'step3',
              title: '3. Observasi Kelas Berbasis Rubrik Bertingkat',
              desc: 'Dampingi guru di kelas saat siswa menyelesaikan soal berbasis stimulus; amati pola penalaran siswa dan teknik scaffolding guru.',
            },
            {
              id: 'step4',
              title: '4. Bedah Miskonsepsi & Distractor Trap',
              desc: 'Gunakan fitur "Tips & Trik Pedagogis" pada aplikasi untuk melatih guru mengenali jebakan pengecoh yang sering menjebak siswa.',
            },
            {
              id: 'step5',
              title: '5. Eksekusi Tindak Lanjut: Paket Remedial Otomatis',
              desc: 'Pastikan butir yang dijawab salah oleh siswa ditindaklanjuti dengan lembar pemulihan khusus yang ditandatangani siswa dan guru.',
            },
            {
              id: 'step6',
              title: '6. Pasca-Kunjungan: Berbagi Praktik Baik di Komunitas',
              desc: 'Dorong paket kurasi soal dan kiat mengatasi miskonsepsi didiseminasikan dalam forum KKG/MGMP antarsekolah di Kabupaten Sidrap.',
            },
          ].map((item) => {
            const isChecked = !!activeChecklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                  aria-label={isChecked ? 'Selesai' : 'Belum'}
                >
                  {isChecked ? <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" /> : <Square className="w-4 h-4" />}
                </button>
                <div className="space-y-0.5">
                  <strong className="block text-slate-900 dark:text-slate-100 font-semibold text-xs">
                    {item.title}
                  </strong>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
