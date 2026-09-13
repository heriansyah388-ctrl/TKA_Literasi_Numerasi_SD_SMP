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
  User,
  GraduationCap,
  CreditCard,
  Edit3,
  Play,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SoalItem, JawabanSiswaMap, IdentitasSiswa } from '../types';
import { isPgkSoal, isMenjodohkanSoal, isUraianSoal } from '../utils/soalFormatHelper';
import { CbtPgkInput } from './CbtPgkInput';
import { CbtMenjodohkanInput } from './CbtMenjodohkanInput';
import { StimulusRenderer } from './StimulusRenderer';
import { MathTextRenderer } from './MathTextRenderer';

interface CbtExamViewProps {
  soalList: SoalItem[];
  judul?: string;
  waktuMenit?: number;
  initialKelas?: string;
  onSubmitExam: (jawaban: JawabanSiswaMap, durasiDetik: number, identitas: IdentitasSiswa) => void;
  onCancel: () => void;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({
  soalList,
  judul = 'Simulasi Asesmen Akademik Siswa',
  waktuMenit = 20,
  initialKelas = 'SD 5',
  onSubmitExam,
  onCancel,
}) => {
  const [identitas, setIdentitas] = useState<IdentitasSiswa>(() => {
    try {
      const saved = localStorage.getItem('tka_cbt_student_id');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.nama === 'string') {
          return {
            nama: parsed.nama,
            kelas: parsed.kelas || initialKelas || 'SD 5',
            nis: parsed.nis || '',
          };
        }
      }
    } catch (e) {}
    return {
      nama: '',
      kelas: initialKelas || 'SD 5',
      nis: '',
    };
  });

  const [isExamStarted, setIsExamStarted] = useState(false);
  const [showEditIdentityModal, setShowEditIdentityModal] = useState(false);
  const [tempIdentitas, setTempIdentitas] = useState<IdentitasSiswa>(identitas);
  const [validationError, setValidationError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState<JawabanSiswaMap>({});
  const [raguRagu, setRaguRagu] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [detikTersisa, setDetikTersisa] = useState(waktuMenit * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [waktuMulai, setWaktuMulai] = useState<number>(Date.now());
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=cbt`
      : 'https://ais-pre-7loxfa6wvn4qubhi5scxvg-226613123890.asia-southeast1.run.app?tab=cbt';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStartExam = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identitas.nama.trim()) {
      setValidationError('Mohon lengkapi kolom Nama Siswa terlebih dahulu.');
      return;
    }
    if (!identitas.kelas.trim()) {
      setValidationError('Mohon lengkapi kolom Kelas siswa.');
      return;
    }
    setValidationError('');
    localStorage.setItem('tka_cbt_student_id', JSON.stringify(identitas));
    setWaktuMulai(Date.now());
    setIsExamStarted(true);
  };

  const handleQuickSample = () => {
    const sample = {
      nama: 'Ahmad Fauzi',
      kelas: initialKelas || 'SD 5',
      nis: '20240188',
    };
    setIdentitas(sample);
    setValidationError('');
  };

  const handleSaveEditedIdentity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempIdentitas.nama.trim()) {
      return;
    }
    setIdentitas(tempIdentitas);
    localStorage.setItem('tka_cbt_student_id', JSON.stringify(tempIdentitas));
    setShowEditIdentityModal(false);
  };

  // Countdown timer only when exam started
  useEffect(() => {
    if (!isExamStarted) return;
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
  }, [isExamStarted]);

  const handleForceSubmit = () => {
    const durasi = Math.round((Date.now() - waktuMulai) / 1000);
    onSubmitExam(jawaban, durasi, identitas);
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

  // SCREEN 1: Registration / Identity Card Before Exam
  if (!isExamStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-200 tracking-wider uppercase">
                  Computer Based Test (CBT) Siswa
                </span>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  Identitas Peserta Ujian
                </h2>
              </div>
            </div>
            <p className="text-xs text-indigo-100 max-w-lg mt-1">
              Mohon isi data diri Anda (Nama, Kelas, dan NIS) sebelum memulai simulasi asesmen akademik.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleStartExam} className="p-6 sm:p-8 space-y-5">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Kolom Nama Siswa */}
            <div className="space-y-1.5">
              <label
                htmlFor="cbt-nama-siswa"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="cbt-nama-siswa"
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap siswa..."
                  value={identitas.nama}
                  onChange={(e) => {
                    setIdentitas({ ...identitas, nama: e.target.value });
                    if (validationError) setValidationError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Nama ini akan tercantum pada lembar asesmen dan laporan hasil kompetensi.
              </span>
            </div>

            {/* Grid: Kolom Kelas & Kolom NIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kolom Kelas */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cbt-kelas-siswa"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Kelas / Rombel <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="cbt-kelas-siswa"
                    type="text"
                    required
                    placeholder="Contoh: SD 5, 5A, SMP 7..."
                    value={identitas.kelas}
                    onChange={(e) => {
                      setIdentitas({ ...identitas, kelas: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Kolom NIS (Nomor Induk Siswa) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cbt-nis-siswa"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Nomor Induk Siswa (NIS / NISN)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="cbt-nis-siswa"
                    type="text"
                    placeholder="Contoh: 20240188 / 0012345678"
                    value={identitas.nis}
                    onChange={(e) => setIdentitas({ ...identitas, nis: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Ringkasan Ujian */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Paket Ujian:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{judul}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Jumlah Butir Soal:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{totalSoal} Butir Soal</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Alokasi Waktu Ujian:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{waktuMenit} Menit</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Sifat Simulasi:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dukungan HOTS &amp; Analisis Diagnostik Otomatis</span>
                </span>
              </div>
            </div>

            {/* Quick Demo Fill & Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleQuickSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
              >
                Gunakan Contoh Data Siswa
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  id="btn-mulai-cbt"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Kerjakan Ujian</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SCREEN 2: Active Exam View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Test Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
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

      {/* Bar Identitas Siswa Peserta Ujian */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">Nama Siswa:</span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">{identitas.nama}</strong>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">Kelas:</span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">{identitas.kelas}</strong>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
            <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">NIS:</span>
            <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">
              {identitas.nis || '-'}
            </strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTempIdentitas(identitas);
            setShowEditIdentityModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-medium transition-colors cursor-pointer"
          title="Ubah Nama, Kelas, atau NIS siswa"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Ubah Identitas</span>
        </button>
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
                className={`bg-slate-50/70 dark:bg-slate-950/60 border-l-4 border-indigo-500 p-4 rounded-r-xl text-slate-800 dark:text-slate-200 ${textSizeClass} leading-relaxed font-serif`}
              >
                {currentSoal && (
                  <StimulusRenderer
                    stimulus={currentSoal.stimulus}
                    visualData={currentSoal.stimulus_visual}
                  />
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Pertanyaan:
              </span>
              <div
                className={`font-semibold text-slate-900 dark:text-slate-100 leading-snug ${
                  fontSize === 'xl' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm sm:text-base'
                }`}
              >
                {currentSoal && <MathTextRenderer text={currentSoal.pertanyaan} />}
              </div>
            </div>

            {/* Answer Input Area */}
            {currentSoal && (
              <div className="mb-6">
                {isPgkSoal(currentSoal) ? (
                  <CbtPgkInput
                    soal={currentSoal}
                    value={jawaban[currentSoal.id]}
                    onChange={handleUpdateJawaban}
                  />
                ) : isMenjodohkanSoal(currentSoal) ? (
                  <CbtMenjodohkanInput
                    soal={currentSoal}
                    value={jawaban[currentSoal.id]}
                    onChange={handleUpdateJawaban}
                  />
                ) : currentSoal.opsi ? (
                  /* Standard Multiple Choice */
                  <div className="space-y-3">
                    {Object.entries(currentSoal.opsi).map(([huruf, teks]) => {
                      const isSelected = jawaban[currentSoal.id] === huruf;
                      return (
                        <button
                          key={huruf}
                          type="button"
                          id={`opsi-${huruf}`}
                          onClick={() => handleUpdateJawaban(huruf)}
                          className={`w-full flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-600/30 font-medium'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {huruf}
                          </span>
                          <div className={`flex-1 leading-relaxed ${textSizeClass}`}>
                            <MathTextRenderer text={teks} inline />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Isian or Uraian text box */
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tuliskan Jawaban atau Langkah Penyelesaian:
                    </label>
                    <textarea
                      rows={4}
                      value={(jawaban[currentSoal.id] as string) || ''}
                      onChange={(e) => handleUpdateJawaban(e.target.value)}
                      placeholder="Ketik jawaban Anda di sini..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleToggleRagu}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                raguRagu[currentSoal?.id || '']
                  ? 'bg-amber-400 dark:bg-amber-500 text-amber-950 shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{raguRagu[currentSoal?.id || ''] ? 'Batalkan Ragu' : 'Ragu-ragu'}</span>
            </button>

            {currentIndex < totalSoal - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalSoal - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span>Selesai</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Question Grid Palette */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5 h-fit">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Nomor Soal
            </h3>
            <span className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
              {jumlahDijawab}/{totalSoal} Dijawab
            </span>
          </div>

          {/* Status Indicator Badges */}
          <div className="grid grid-cols-3 gap-1.5 mb-3 text-center text-xs">
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

      {/* Modal Ubah Identitas Saat Ujian */}
      {showEditIdentityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Ubah Identitas Peserta Ujian
              </h4>
              <button
                type="button"
                onClick={() => setShowEditIdentityModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedIdentity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempIdentitas.nama}
                  onChange={(e) => setTempIdentitas({ ...tempIdentitas, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tempIdentitas.kelas}
                    onChange={(e) => setTempIdentitas({ ...tempIdentitas, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIS / NISN
                  </label>
                  <input
                    type="text"
                    value={tempIdentitas.nis}
                    onChange={(e) => setTempIdentitas({ ...tempIdentitas, nis: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditIdentityModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            {/* Identitas Peserta Ringkas */}
            <div className="bg-indigo-50/60 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/60 text-xs mb-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-indigo-800 dark:text-indigo-300 font-medium">Nama Siswa:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{identitas.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-800 dark:text-indigo-300 font-medium">Kelas / NIS:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {identitas.kelas} • NIS: {identitas.nis || '-'}
                </span>
              </div>
            </div>

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
