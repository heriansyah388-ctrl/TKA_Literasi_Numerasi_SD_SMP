import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  Calculator,
  Target,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Printer,
  RotateCcw,
  Sparkles,
  Zap,
  User,
  GraduationCap,
  CreditCard,
  FileText,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AnalisisHasil, SoalItem, JawabanSiswaMap, PaketSoalResponse, PaketSoalMetadata } from '../types';
import { checkJawaban, formatJawabanSiswa, formatKunciJawaban } from '../utils/soalFormatHelper';
import { getFallbackTipsTrik } from '../utils/tkaTipsHelper';
import { TipsTrikCard } from './TipsTrikCard';
import { generatePaketRemedial, exportRemedialToWordDoc } from '../utils/remedialHelper';
import { RemedialPackageModal } from './RemedialPackageModal';

interface CompetencyReportViewProps {
  analisis: AnalisisHasil;
  soalList: SoalItem[];
  jawabanSiswa: JawabanSiswaMap;
  metadataAsal?: PaketSoalMetadata;
  onUlangiTes: () => void;
  onPrint: () => void;
  onGenerateRemedial?: (paketRemedial: PaketSoalResponse) => void;
  onStartRemedialExam?: (paketRemedial: PaketSoalResponse) => void;
}

export const CompetencyReportView: React.FC<CompetencyReportViewProps> = ({
  analisis,
  soalList,
  jawabanSiswa,
  metadataAsal,
  onUlangiTes,
  onPrint,
  onGenerateRemedial,
  onStartRemedialExam,
}) => {
  const [isRemedialModalOpen, setIsRemedialModalOpen] = useState(false);

  // Generate remedial report from current results
  const remedialReport = React.useMemo(() => {
    return generatePaketRemedial(soalList, jawabanSiswa, metadataAsal, analisis.identitasSiswa);
  }, [soalList, jawabanSiswa, metadataAsal, analisis.identitasSiswa]);
  const {
    totalSoal,
    benar,
    salah,
    skor,
    persentase,
    kategori,
    durasiDetik,
    literasiScores,
    numerasiScores,
    kompetensiDikuasai,
    kompetensiPerluPenguatan,
    analisisKesalahan,
    rekomendasiMateri,
    rekomendasiLatihanBerikutnya,
    tingkatKesulitanBerikutnya,
  } = analisis;

  const getKategoriBadgeColor = (kat: string) => {
    switch (kat) {
      case 'Sangat Baik':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Sudah Menguasai':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Sudah Berkembang':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'Sedang Berkembang':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  const formatMenit = (detik: number) => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${m} menit ${s} detik`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Laporan Asesmen Diagnostik Akademik</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Profil Kompetensi &amp; Rekomendasi Belajar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Evaluasi ketercapaian kompetensi literasi dan numerasi berdasarkan jawaban siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Paket Remedial Otomatis */}
            {remedialReport && remedialReport.jumlahSalah > 0 && (
              <button
                id="btn-open-remedial-modal"
                type="button"
                onClick={() => setIsRemedialModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 transition-all shadow-xs cursor-pointer animate-pulse"
                title="Buka Paket Remedial Otomatis untuk mengintervensi butir soal yang dijawab salah oleh siswa"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Paket Remedial ({remedialReport.jumlahSalah} Soal)</span>
              </button>
            )}

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil</span>
            </button>
            <button
              onClick={onUlangiTes}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Latihan Lagi</span>
            </button>
          </div>
        </div>

        {/* Identitas Siswa Banner if available */}
        {analisis.identitasSiswa?.nama && (
          <div className="mt-5 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                  Identitas Peserta Asesmen
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {analisis.identitasSiswa.nama}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Kelas:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {analisis.identitasSiswa.kelas}
                </span>
              </div>

              {analisis.identitasSiswa.nis && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                  <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">NIS:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {analisis.identitasSiswa.nis}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score & Metric Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Skor Akhir</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{skor}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">dari 100 poin</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium block mb-1">Jawaban Benar</span>
            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">{benar}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-500 block mt-0.5">dari {totalSoal} butir</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
            <span className="text-xs text-rose-800 dark:text-rose-400 font-medium block mb-1">Perlu Perbaikan</span>
            <span className="text-3xl font-extrabold text-rose-700 dark:text-rose-300">{salah}</span>
            <span className="text-[11px] text-rose-600 dark:text-rose-500 block mt-0.5">butir belum tepat</span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center flex flex-col justify-center">
            <span className="text-xs text-indigo-800 dark:text-indigo-300 font-medium block mb-1">Kategori Capaian</span>
            <span
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getKategoriBadgeColor(
                kategori
              )}`}
            >
              {kategori}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Waktu: {formatMenit(durasiDetik)}</span>
          </div>
        </div>
      </div>

      {/* Profil Subdomain Kompetensi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Literasi Profil */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Domain Literasi Membaca</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pencapaian 5 subdomain kompetensi literasi teks
              </p>
            </div>
          </div>

          {literasiScores.length === 0 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
              Tidak ada butir soal literasi pada paket tes ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {literasiScores.map((sub, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.nama}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {sub.benar}/{sub.totalSoal} ({sub.persentase}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sub.persentase >= 80
                          ? 'bg-blue-600'
                          : sub.persentase >= 50
                          ? 'bg-blue-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(5, sub.persentase)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 inline-block">
                    Capaian: <strong className="text-slate-600 dark:text-slate-300">{sub.kategori}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Numerasi Profil */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Domain Penalaran Numerasi</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pencapaian 5 subdomain penalaran matematika
              </p>
            </div>
          </div>

          {numerasiScores.length === 0 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
              Tidak ada butir soal numerasi pada paket tes ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {numerasiScores.map((sub, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.nama}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {sub.benar}/{sub.totalSoal} ({sub.persentase}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sub.persentase >= 80
                          ? 'bg-emerald-600'
                          : sub.persentase >= 50
                          ? 'bg-emerald-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(5, sub.persentase)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 inline-block">
                    Capaian: <strong className="text-slate-600 dark:text-slate-300">{sub.kategori}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bagian M: Rekomendasi Pembelajaran Pedagogis */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7 mb-8">
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Rencana Tindak Lanjut &amp; Rekomendasi Belajar
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Kompetensi yang Dikuasai */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1. Kompetensi yang Sudah Dikuasai
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-900/90 dark:text-emerald-200/90 list-disc list-inside">
              {kompetensiDikuasai.map((k, i) => (
                <li key={i} className="leading-relaxed">
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Kompetensi yang Perlu Diperkuat */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              2. Kompetensi yang Perlu Diperkuat
            </span>
            <ul className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200/90 list-disc list-inside">
              {kompetensiPerluPenguatan.map((k, i) => (
                <li key={i} className="leading-relaxed">
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kesalahan Umum & Rekomendasi Materi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Kesalahan Umum */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              3. Analisis Kesalahan / Miskonsepsi
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
              {analisisKesalahan.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rekomendasi Materi Belajar */}
          <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-850">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              4. Rekomendasi Materi Belajar Siswa
            </span>
            <ul className="space-y-1.5 text-xs text-indigo-900/90 dark:text-indigo-200/90 list-disc list-inside">
              {rekomendasiMateri.map((m, i) => (
                <li key={i} className="leading-relaxed">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latihan Berikutnya */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div>
            <span className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider block">
              5. Saran Latihan Berikutnya
            </span>
            <p className="text-xs sm:text-sm font-medium text-white mt-1">
              {rekomendasiLatihanBerikutnya}
            </p>
          </div>
          <div className="bg-white/10 px-3.5 py-1.5 rounded-lg text-center border border-white/10 shrink-0">
            <span className="text-[10px] text-indigo-200 block">Tingkat Disarankan</span>
            <span className="text-sm font-bold text-white">{tingkatKesulitanBerikutnya}</span>
          </div>
        </div>

        {/* Tindak Lanjut: Paket Remedial Otomatis Callout */}
        {remedialReport && remedialReport.jumlahSalah > 0 && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 border-2 border-dashed border-amber-300 dark:border-amber-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>TINDAK LANJUT BERDIFERENSIASI</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Paket Remedial Otomatis Siap Digunakan ({remedialReport.jumlahSalah} Butir Soal Terisolasi)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Sistem telah mengidentifikasi {remedialReport.jumlahSalah} butir soal yang dijawab salah oleh siswa. 
                  Anda dapat meninjau matriks miskonsepsi, mencetak lembar remedial Word (.doc), atau langsung memulai ujian perbaikan khusus butir tersebut.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                id="btn-remedial-callout-view"
                type="button"
                onClick={() => setIsRemedialModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Buka Paket Remedial</span>
              </button>

              <button
                id="btn-remedial-callout-doc"
                type="button"
                onClick={() => exportRemedialToWordDoc(remedialReport)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                title="Unduh langsung naskah remedial format Microsoft Word"
              >
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Unduh .DOC</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Soal Siswa */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          Ulasan Jawaban &amp; Pembahasan Setiap Soal
        </h3>

        <div className="space-y-6">
          {soalList.map((soal, idx) => {
            const userAns = jawabanSiswa[soal.id];
            const evalResult = checkJawaban(soal, userAns);
            const isCorrect = evalResult.isCorrect;
            const displayUserAns = formatJawabanSiswa(soal, userAns);
            const displayKunci = formatKunciJawaban(soal);

            return (
              <div
                key={soal.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-850'
                    : 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200 dark:border-rose-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {soal.domain} • {soal.subdomain}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {soal.bentuk_soal || 'Pilihan Ganda'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Kurang Tepat
                      </span>
                    )}
                  </div>
                </div>

                {/* Stimulus Quote */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mb-3 font-serif">
                  {soal.stimulus}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  {soal.pertanyaan}
                </p>

                {/* Selected vs Correct Key */}
                <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                  <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 min-w-[200px]">
                    <span className="text-slate-500 dark:text-slate-400 mr-1 block sm:inline">Jawaban Anda:</span>
                    <strong className={isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                      {displayUserAns}
                    </strong>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex-1 min-w-[200px]">
                    <span className="text-emerald-700 dark:text-emerald-300 mr-1 block sm:inline">Kunci Jawaban Benar:</span>
                    <strong>{displayKunci}</strong>
                  </div>
                </div>

                {/* Pembahasan Detail */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100 block mb-1">Langkah Pembahasan &amp; Pembuktian:</strong>
                  <p className="whitespace-pre-line leading-relaxed">{soal.pembahasan}</p>
                </div>

                {/* Tips & Trik Cepat Menjawab Soal TKA Ini */}
                <div className="mt-3">
                  <TipsTrikCard soal={soal} defaultExpanded={true} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Paket Remedial Otomatis */}
      {remedialReport && (
        <RemedialPackageModal
          report={remedialReport}
          isOpen={isRemedialModalOpen}
          onClose={() => setIsRemedialModalOpen(false)}
          onSetAsActivePacket={(paket) => {
            if (onGenerateRemedial) {
              onGenerateRemedial(paket);
            }
          }}
          onStartExamNow={(paket) => {
            if (onStartRemedialExam) {
              onStartRemedialExam(paket);
            } else if (onGenerateRemedial) {
              onGenerateRemedial(paket);
            }
          }}
        />
      )}
    </div>
  );
};
