import React from 'react';
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
} from 'lucide-react';
import { AnalisisHasil, SoalItem, JawabanSiswaMap } from '../types';
import { checkJawaban, formatJawabanSiswa, formatKunciJawaban } from '../utils/soalFormatHelper';

interface CompetencyReportViewProps {
  analisis: AnalisisHasil;
  soalList: SoalItem[];
  jawabanSiswa: JawabanSiswaMap;
  onUlangiTes: () => void;
  onPrint: () => void;
}

export const CompetencyReportView: React.FC<CompetencyReportViewProps> = ({
  analisis,
  soalList,
  jawabanSiswa,
  onUlangiTes,
  onPrint,
}) => {
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
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Sudah Menguasai':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Sudah Berkembang':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'Sedang Berkembang':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300';
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Laporan Asesmen Diagnostik Akademik</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Profil Kompetensi &amp; Rekomendasi Belajar
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Evaluasi ketercapaian kompetensi literasi dan numerasi berdasarkan jawaban siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
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

        {/* Score & Metric Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium block mb-1">Skor Akhir</span>
            <span className="text-3xl font-extrabold text-slate-900">{skor}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">dari 100 poin</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-medium block mb-1">Jawaban Benar</span>
            <span className="text-3xl font-extrabold text-emerald-700">{benar}</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">dari {totalSoal} butir</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-center">
            <span className="text-xs text-rose-800 font-medium block mb-1">Perlu Perbaikan</span>
            <span className="text-3xl font-extrabold text-rose-700">{salah}</span>
            <span className="text-[11px] text-rose-600 block mt-0.5">butir belum tepat</span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-center flex flex-col justify-center">
            <span className="text-xs text-indigo-800 font-medium block mb-1">Kategori Capaian</span>
            <span
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getKategoriBadgeColor(
                kategori
              )}`}
            >
              {kategori}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Waktu: {formatMenit(durasiDetik)}</span>
          </div>
        </div>
      </div>

      {/* Profil Subdomain Kompetensi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Literasi Profil */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Domain Literasi Membaca</h3>
              <p className="text-[11px] text-slate-500">
                Pencapaian 5 subdomain kompetensi literasi teks
              </p>
            </div>
          </div>

          {literasiScores.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
              Tidak ada butir soal literasi pada paket tes ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {literasiScores.map((sub, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{sub.nama}</span>
                    <span className="text-slate-500">
                      {sub.benar}/{sub.totalSoal} ({sub.persentase}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
                  <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                    Capaian: <strong className="text-slate-600">{sub.kategori}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Numerasi Profil */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Domain Penalaran Numerasi</h3>
              <p className="text-[11px] text-slate-500">
                Pencapaian 5 subdomain penalaran matematika
              </p>
            </div>
          </div>

          {numerasiScores.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
              Tidak ada butir soal numerasi pada paket tes ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {numerasiScores.map((sub, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{sub.nama}</span>
                    <span className="text-slate-500">
                      {sub.benar}/{sub.totalSoal} ({sub.persentase}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
                  <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                    Capaian: <strong className="text-slate-600">{sub.kategori}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bagian M: Rekomendasi Pembelajaran Pedagogis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 mb-8">
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Rencana Tindak Lanjut &amp; Rekomendasi Belajar
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Kompetensi yang Dikuasai */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Kompetensi yang Sudah Dikuasai
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-900/90 list-disc list-inside">
              {kompetensiDikuasai.map((k, i) => (
                <li key={i} className="leading-relaxed">
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Kompetensi yang Perlu Diperkuat */}
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
              <Target className="w-4 h-4 text-amber-600" />
              2. Kompetensi yang Perlu Diperkuat
            </span>
            <ul className="space-y-1.5 text-xs text-amber-900/90 list-disc list-inside">
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
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-slate-600" />
              3. Analisis Kesalahan / Miskonsepsi
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {analisisKesalahan.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rekomendasi Materi Belajar */}
          <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              4. Rekomendasi Materi Belajar Siswa
            </span>
            <ul className="space-y-1.5 text-xs text-indigo-900/90 list-disc list-inside">
              {rekomendasiMateri.map((m, i) => (
                <li key={i} className="leading-relaxed">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latihan Berikutnya */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      </div>

      {/* Review Soal Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
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
                    ? 'bg-emerald-50/20 border-emerald-200'
                    : 'bg-rose-50/20 border-rose-200'
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
                    <span className="text-xs font-semibold text-slate-800">
                      {soal.domain} • {soal.subdomain}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      {soal.bentuk_soal || 'Pilihan Ganda'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Kurang Tepat
                      </span>
                    )}
                  </div>
                </div>

                {/* Stimulus Quote */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mb-3 font-serif">
                  {soal.stimulus}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
                  {soal.pertanyaan}
                </p>

                {/* Selected vs Correct Key */}
                <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex-1 min-w-[200px]">
                    <span className="text-slate-500 mr-1 block sm:inline">Jawaban Anda:</span>
                    <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                      {displayUserAns}
                    </strong>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-900 flex-1 min-w-[200px]">
                    <span className="text-emerald-700 mr-1 block sm:inline">Kunci Jawaban Benar:</span>
                    <strong>{displayKunci}</strong>
                  </div>
                </div>

                {/* Pembahasan Detail */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-1">Pembahasan &amp; Pembuktian:</strong>
                  <p className="whitespace-pre-line leading-relaxed">{soal.pembahasan}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
