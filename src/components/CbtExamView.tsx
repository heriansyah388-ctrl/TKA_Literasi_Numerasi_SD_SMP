import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calculator,
  Type,
  Send,
  X,
  FileSpreadsheet,
  Link2,
  Layers,
  Share2,
  Check,
} from 'lucide-react';
import { SoalItem, JawabanSiswaMap } from '../types';
import { isPgkSoal, isMenjodohkanSoal, isUraianSoal } from '../utils/soalFormatHelper';
import { CbtPgkInput } from './CbtPgkInput';
import { CbtMenjodohkanInput } from './CbtMenjodohkanInput';

interface CbtExamViewProps {
  soalList: SoalItem[];
  judul?: string;
  waktuMenit?: number;
  onSubmitExam: (jawaban: JawabanSiswaMap, durasiDetik: number) => void;
  onCancel: () => void;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({
  soalList,
  judul = 'Simulasi Asesmen Akademik Siswa',
  waktuMenit = 20,
  onSubmitExam,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState<JawabanSiswaMap>({});
  const [raguRagu, setRaguRagu] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [detikTersisa, setDetikTersisa] = useState(waktuMenit * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [waktuMulai] = useState<number>(Date.now());
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=cbt`
      : 'https://ais-pre-7loxfa6wvn4qubhi5scxvg-226613123890.asia-southeast1.run.app?tab=cbt';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDetikTersisa((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleForceSubmit = () => {
    const durasi = Math.round((Date.now() - waktuMulai) / 1000);
    onSubmitExam(jawaban, durasi);
  };

  const isSoalAnswered = (soalId: string) => {
    const val = jawaban[soalId];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return true;
  };

  const handleUpdateJawaban = (val: any) => {
    const currentSoal = soalList[currentIndex];
    if (!currentSoal) return;
    setJawaban((prev) => ({
      ...prev,
      [currentSoal.id]: val,
    }));
  };

  const handleToggleRagu = () => {
    const currentSoal = soalList[currentIndex];
    if (!currentSoal) return;
    setRaguRagu((prev) => ({
      ...prev,
      [currentSoal.id]: !prev[currentSoal.id],
    }));
  };

  const currentSoal = soalList[currentIndex];
  const totalSoal = soalList.length;

  const jumlahDijawab = soalList.filter((s) => isSoalAnswered(s.id)).length;
  const jumlahRagu = Object.values(raguRagu).filter(Boolean).length;
  const jumlahBelum = totalSoal - jumlahDijawab;

  const menit = Math.floor(detikTersisa / 60);
  const detik = detikTersisa % 60;
  const timeFormatted = `${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;

  const textSizeClass =
    fontSize === 'xl' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Test Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
            {currentSoal?.domain === 'Numerasi' ? (
              <Calculator className="w-5 h-5" />
            ) : (
              <BookOpen className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{judul}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Soal {currentIndex + 1} dari {totalSoal} • Domain: {currentSoal?.domain} ({currentSoal?.subdomain})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end md:self-center flex-wrap">
          {/* Share Link button */}
          <button
            id="btn-cbt-copy-link"
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              copiedLink
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Salin tautan langsung ujian CBT ini untuk dikirim ke siswa"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Link Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Bagikan Link Siswa</span>
                <span className="sm:hidden">Share</span>
              </>
            )}
          </button>

          {/* Font scale buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-md font-medium cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-md font-medium cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-1 rounded-md font-medium cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              A++
            </button>
          </div>

          {/* Countdown timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border ${
              detikTersisa < 300
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Jawaban</span>
          </button>
        </div>
      </div>

      {/* Main Examination Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: Question & Stimulus */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Question Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                  {currentIndex + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentSoal?.subdomain}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {currentSoal?.level_kognitif}
                </span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                Konteks: <strong className="text-slate-600 dark:text-slate-300">{currentSoal?.konteks}</strong>
              </div>
            </div>

            {/* Stimulus Box */}
            <div className="mb-5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                Bacaan / Stimulus Masalah:
              </span>
              <div
                className={`bg-slate-50/70 dark:bg-slate-950/60 border-l-4 border-indigo-500 p-4 rounded-r-xl text-slate-800 dark:text-slate-200 ${textSizeClass} leading-relaxed whitespace-pre-line font-serif`}
              >
                {currentSoal?.stimulus}
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Pertanyaan:
              </span>
              <p className={`font-semibold text-slate-900 dark:text-slate-100 ${textSizeClass} leading-relaxed`}>
                {currentSoal?.pertanyaan}
              </p>
            </div>

            {/* Response Area: Menjodohkan, PG Kompleks, Uraian, or Pilihan Ganda */}
            {isMenjodohkanSoal(currentSoal) ? (
              <CbtMenjodohkanInput
                soal={currentSoal}
                value={jawaban[currentSoal.id]}
                onChange={handleUpdateJawaban}
                textSizeClass={textSizeClass}
              />
            ) : isPgkSoal(currentSoal) ? (
              <CbtPgkInput
                soal={currentSoal}
                value={jawaban[currentSoal.id]}
                onChange={handleUpdateJawaban}
                textSizeClass={textSizeClass}
              />
            ) : isUraianSoal(currentSoal) ? (
              <div className="space-y-3 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Lembar Uraian Terbuka (Rubrik Skor Bertingkat 0 - 2)
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {typeof jawaban[currentSoal.id] === 'string' ? (jawaban[currentSoal.id] as string).length : 0} karakter tertulis
                  </span>
                </div>
                <textarea
                  id={`input-uraian-${currentSoal.id}`}
                  rows={5}
                  value={(jawaban[currentSoal.id] as string) || ''}
                  onChange={(e) => handleUpdateJawaban(e.target.value)}
                  placeholder="Tuliskan uraian jawaban, langkah pemikiran/penalaran, atau pembuktian Anda di sini..."
                  className={`w-full p-4 rounded-xl border ${
                    jawaban[currentSoal.id]
                      ? 'border-indigo-400 ring-2 ring-indigo-50 dark:ring-indigo-950/50 bg-indigo-50/10 dark:bg-indigo-950/20'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  } focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${textSizeClass} leading-relaxed font-sans resize-y`}
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Catatan: Jawaban uraian akan dinilai berdasarkan Rubrik Skor Analitik Bertingkat: Skor 2 (Penalaran Lengkap), Skor 1 (Sebagian Benar / Parsial), dan Skor 0 (Tidak Tepat).
                </p>
              </div>
            ) : (
              currentSoal?.opsi && (
                <div className="space-y-2.5 mb-6">
                  {Object.entries(currentSoal.opsi).map(([huruf, teks]) => {
                    const isSelected = jawaban[currentSoal.id] === huruf;
                    return (
                      <button
                        key={huruf}
                        type="button"
                        id={`btn-opsi-${currentSoal.id}-${huruf}`}
                        onClick={() => handleUpdateJawaban(huruf)}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-600 text-indigo-950 dark:text-indigo-200 font-medium ring-1 ring-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {huruf}
                        </span>
                        <span className={`pt-0.5 leading-snug flex-1 ${textSizeClass}`}>{teks}</span>
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleToggleRagu}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                raguRagu[currentSoal?.id]
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Flag className={`w-4 h-4 ${raguRagu[currentSoal?.id] ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
              <span>{raguRagu[currentSoal?.id] ? 'Tandai Ragu-Ragu (Aktif)' : 'Tandai Ragu-Ragu'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < totalSoal - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalSoal - 1, prev + 1))}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Number Navigation Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5 h-fit">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Daftar Nomor Soal
          </h3>

          {/* Quick stats summary */}
          <div className="grid grid-cols-3 gap-1.5 mb-4 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-850 text-emerald-800 dark:text-emerald-300">
              <span className="font-bold text-sm block">{jumlahDijawab}</span>
              Dijawab
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-850 text-amber-800 dark:text-amber-300">
              <span className="font-bold text-sm block">{jumlahRagu}</span>
              Ragu
            </div>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <span className="font-bold text-sm block">{jumlahBelum}</span>
              Belum
            </div>
          </div>

          {/* Grid Buttons */}
          <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
            {soalList.map((s, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = isSoalAnswered(s.id);
              const isFlagged = Boolean(raguRagu[s.id]);

              let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
              if (isFlagged) {
                btnStyle = 'bg-amber-400 dark:bg-amber-500 text-amber-950 font-bold border-amber-500';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
              }

              if (isCurrent) {
                btnStyle += ' ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900';
              }

              return (
                <button
                  key={s.id}
                  id={`nav-soal-${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Sudah dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400 dark:bg-amber-500 inline-block" />
              <span>Ragu-ragu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 inline-block" />
              <span>Belum dijawab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Konfirmasi Penyelesaian Ujian
              </h4>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menyelesaikan simulasi asesmen ini? Sistem akan langsung
              menganalisis profil kompetensi dan rekomendasi belajar Anda.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs mb-5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Butir Soal:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{totalSoal} butir</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Sudah Dijawab:</span>
                <span>{jumlahDijawab} butir</span>
              </div>
              {jumlahRagu > 0 && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400 font-medium">
                  <span>Masih Ragu-ragu:</span>
                  <span>{jumlahRagu} butir</span>
                </div>
              )}
              {jumlahBelum > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                  <span>Belum Terjawab:</span>
                  <span>{jumlahBelum} butir</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Kembali Periksa
              </button>
              <button
                onClick={handleForceSubmit}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Ya, Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
