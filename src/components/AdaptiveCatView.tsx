import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
  Compass,
  Zap,
} from 'lucide-react';
import { SoalItem, Jenjang, Kelas, Domain, AnalisisHasil } from '../types';
import { DEFAULT_SOAL_BANK } from '../data/defaultBank';
import { getFallbackTipsTrik } from '../utils/tkaTipsHelper';

interface AdaptiveCatViewProps {
  jenjang: Jenjang;
  kelas: Kelas;
  domain: Domain;
  onFinishCat: (hasil: AnalisisHasil) => void;
}

interface StepHistory {
  step: number;
  soal: SoalItem;
  jawabanUser: string;
  isCorrect: boolean;
  kesulitan: 'Mudah' | 'Sedang' | 'Sulit';
}

export const AdaptiveCatView: React.FC<AdaptiveCatViewProps> = ({
  jenjang,
  kelas,
  domain,
  onFinishCat,
}) => {
  const [step, setStep] = useState(1);
  const maxSteps = 5;
  const [currentSoal, setCurrentSoal] = useState<SoalItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOpsi, setSelectedOpsi] = useState<string>('');
  const [history, setHistory] = useState<StepHistory[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  // Initial load
  React.useEffect(() => {
    fetchNextAdaptive(1, 'Sedang', true, []);
  }, [jenjang, kelas, domain]);

  const fetchNextAdaptive = async (
    stepNumber: number,
    targetDiff: 'Mudah' | 'Sedang' | 'Sulit',
    lastCorrect: boolean,
    historyIds: string[]
  ) => {
    setIsLoading(true);
    setSelectedOpsi('');
    setShowExplanation(false);

    try {
      const res = await fetch('/api/adaptive-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenjang,
          kelas,
          domain: domain === 'Literasi dan Numerasi' ? (stepNumber % 2 === 0 ? 'Numerasi' : 'Literasi') : domain,
          currentDifficulty: targetDiff,
          lastAnswerCorrect: lastCorrect,
          historyIds,
          step: stepNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.soal) {
          setCurrentSoal(data.soal);
          return;
        }
      }
      throw new Error('API returned invalid data');
    } catch (e) {
      console.warn('Adaptive API fallback to client bank:', e);
      // Client-side fallback from curated bank
      const targetDomain = domain === 'Literasi dan Numerasi' ? (stepNumber % 2 === 0 ? 'Numerasi' : 'Literasi') : domain;
      const candidate = DEFAULT_SOAL_BANK.find(
        (s) => s.kesulitan === targetDiff && (targetDomain === 'Campuran' || s.domain === targetDomain) && !historyIds.includes(s.id)
      ) || DEFAULT_SOAL_BANK[stepNumber % DEFAULT_SOAL_BANK.length];

      setCurrentSoal({
        ...candidate,
        id: `ADAPTIF-${stepNumber}`,
        kesulitan: targetDiff,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJawab = () => {
    if (!currentSoal || !selectedOpsi) return;
    const isCorrect = selectedOpsi === currentSoal.kunci;

    const newHistoryEntry: StepHistory = {
      step,
      soal: currentSoal,
      jawabanUser: selectedOpsi,
      isCorrect,
      kesulitan: currentSoal.kesulitan,
    };

    const nextHistory = [...history, newHistoryEntry];
    setHistory(nextHistory);
    setShowExplanation(true);
  };

  const handleLanjut = () => {
    if (step >= maxSteps) {
      // Complete CAT test
      setIsTestCompleted(true);
      generateFinalCatAnalysis();
      return;
    }

    const lastEntry = history[history.length - 1];
    const nextStep = step + 1;
    setStep(nextStep);

    let nextDifficulty: 'Mudah' | 'Sedang' | 'Sulit' = 'Sedang';
    if (lastEntry.isCorrect) {
      nextDifficulty = lastEntry.kesulitan === 'Mudah' ? 'Sedang' : 'Sulit';
    } else {
      nextDifficulty = lastEntry.kesulitan === 'Sulit' ? 'Sedang' : 'Mudah';
    }

    const historyIds = history.map((h) => h.soal.id);
    fetchNextAdaptive(nextStep, nextDifficulty, lastEntry.isCorrect, historyIds);
  };

  const generateFinalCatAnalysis = async () => {
    const soalItems = history.map((h) => h.soal);
    const jawabanMap: Record<string, string> = {};
    history.forEach((h) => {
      jawabanMap[h.soal.id] = h.jawabanUser;
    });

    try {
      const res = await fetch('/api/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soalItems,
          jawabanSiswa: jawabanMap,
          durasiDetik: 300,
          jenjang,
          kelas,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.summary) {
          const feedback = data.aiFeedback || {};
          const total = history.length;
          const benar = history.filter((h) => h.isCorrect).length;

          const hasilAnalisis: AnalisisHasil = {
            totalSoal: total,
            benar,
            salah: total - benar,
            skor: Math.round((benar / total) * 100),
            persentase: Math.round((benar / total) * 100),
            kategori: data.summary.kategori || 'Sedang Berkembang',
            durasiDetik: 300,
            literasiScores: [],
            numerasiScores: [],
            kompetensiDikuasai: feedback.kompetensiDikuasai || [],
            kompetensiPerluPenguatan: feedback.kompetensiPerluPenguatan || [],
            analisisKesalahan: feedback.analisisKesalahan || [],
            rekomendasiMateri: feedback.rekomendasiMateri || [],
            rekomendasiLatihanBerikutnya: feedback.rekomendasiLatihanBerikutnya || 'Latihan lanjutan adaptif.',
            tingkatKesulitanBerikutnya: feedback.tingkatKesulitanBerikutnya || 'Sedang',
          };

          onFinishCat(hasilAnalisis);
          return;
        }
      }
      throw new Error('Analysis response not ok');
    } catch (e) {
      console.warn('Analysis fallback on client:', e);
      const total = history.length || 1;
      const benar = history.filter((h) => h.isCorrect).length;
      const pct = Math.round((benar / total) * 100);

      const fallbackCat: AnalisisHasil = {
        totalSoal: total,
        benar,
        salah: total - benar,
        skor: pct,
        persentase: pct,
        kategori: pct >= 80 ? 'Sudah Menguasai' : pct >= 60 ? 'Sudah Berkembang' : 'Sedang Berkembang',
        durasiDetik: 300,
        literasiScores: [],
        numerasiScores: [],
        kompetensiDikuasai: ['Mengerjakan soal adaptif berbasis konteks dengan baik.'],
        kompetensiPerluPenguatan: ['Penyelesaian soal pada level penalaran HOTS.'],
        analisisKesalahan: ['Perlu ketelitian lebih dalam memahami hubungan konsep dan stimulus.'],
        rekomendasiMateri: ['Pendalaman materi literasi teks informasi dan numerasi konteks nyata.'],
        rekomendasiLatihanBerikutnya: 'Latihan soal bertingkat secara berkala.',
        tingkatKesulitanBerikutnya: pct >= 80 ? 'Sulit' : 'Sedang',
      };
      onFinishCat(fallbackCat);
    }
  };

  const resetTest = () => {
    setStep(1);
    setHistory([]);
    setIsTestCompleted(false);
    setShowExplanation(false);
    fetchNextAdaptive(1, 'Sedang', true, []);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Computerized Adaptive Testing (CAT)</span>
            </div>
            <h2 className="text-xl font-bold">Asesmen Kompetensi Adaptif</h2>
            <p className="text-xs text-indigo-200 mt-1">
              Tingkat kesulitan soal berubah otomatis secara real-time berdasarkan akurasi jawaban Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center border border-white/10">
              <span className="text-xs text-indigo-200 block">Kemajuan</span>
              <span className="text-lg font-bold">
                {step} / {maxSteps}
              </span>
            </div>
            <button
              onClick={resetTest}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Mulai Ulang Tes Adaptif"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Trajectory Timeline */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block mb-2">
            Jalur Kalibrasi Kemampuan Siswa:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Array.from({ length: maxSteps }).map((_, idx) => {
              const h = history[idx];
              const isCurrent = idx === step - 1;

              return (
                <div key={idx} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                      h
                        ? h.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    <span>Soal {idx + 1}</span>
                    {h && (
                      <span>
                        {h.isCorrect ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 inline" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 inline" />
                        )}
                      </span>
                    )}
                    {h && <span className="text-[10px] opacity-75">({h.kesulitan})</span>}
                  </div>
                  {idx < maxSteps - 1 && <span className="text-white/20 text-xs">→</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Mengkalibrasi &amp; Menghasilkan Soal Tingkat Selanjutnya...
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Menyesuaikan tingkat kognitif dan kesulitan terhadap capaian Anda.
          </p>
        </div>
      ) : currentSoal ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7">
          {/* Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {currentSoal.domain}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {currentSoal.subdomain}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold ${
                  currentSoal.kesulitan === 'Sulit'
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : currentSoal.kesulitan === 'Sedang'
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                Tingkat: {currentSoal.kesulitan}
              </span>
            </div>
            <span className="text-slate-400 dark:text-slate-500">
              Konteks: <strong className="text-slate-700 dark:text-slate-300">{currentSoal.konteks}</strong>
            </span>
          </div>

          {/* Stimulus */}
          <div className="mb-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 border-l-4 border-indigo-600 p-4 rounded-r-xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-serif">
              {currentSoal.stimulus}
            </div>
          </div>

          {/* Pertanyaan */}
          <div className="mb-5">
            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {currentSoal.pertanyaan}
            </p>
          </div>

          {/* Options */}
          {currentSoal.opsi && (
            <div className="space-y-2.5 mb-6">
              {Object.entries(currentSoal.opsi).map(([huruf, teks]) => {
                const isSelected = selectedOpsi === huruf;
                const isCorrect = huruf === currentSoal.kunci;
                let btnStyle = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60';

                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 text-indigo-950 dark:text-indigo-200 font-medium ring-1 ring-indigo-600';
                }

                return (
                  <button
                    key={huruf}
                    type="button"
                    disabled={showExplanation}
                    onClick={() => setSelectedOpsi(huruf)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        showExplanation && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {huruf}
                    </span>
                    <span className="flex-1 leading-snug pt-0.5">{teks}</span>
                    {showExplanation && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom Action or Explanation */}
          {!showExplanation ? (
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!selectedOpsi}
                onClick={handleJawab}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Kunci Jawaban Saya
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  selectedOpsi === currentSoal.kunci
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {selectedOpsi === currentSoal.kunci ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-bold text-sm block">
                    {selectedOpsi === currentSoal.kunci
                      ? 'Jawaban Anda Tepat!'
                      : 'Jawaban Belum Tepat'}
                  </span>
                  <span>
                    {selectedOpsi === currentSoal.kunci
                      ? 'Hebat! Kemampuan Anda terverifikasi, sistem akan menaikkan tantangan soal berikutnya.'
                      : 'Jangan khawatir, sistem akan memberikan penguatan konsep pada butir berikutnya.'}
                  </span>
                </div>
              </div>

              {/* Pembahasan */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Langkah Pembahasan &amp; Pembuktian:
                </span>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {currentSoal.pembahasan}
                </p>
              </div>

              {/* Tips & Trik Cepat Menjawab Soal TKA Ini */}
              <div className="p-3.5 bg-linear-to-r from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl border border-amber-200/90 dark:border-amber-800/80 text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold mb-1.5">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500 shrink-0" />
                  <span>Tips &amp; Trik Cepat Menjawab Soal TKA Ini:</span>
                </div>
                <p className="text-amber-950 dark:text-amber-200 font-medium leading-relaxed bg-white/95 dark:bg-slate-900/95 p-3 rounded-lg border border-amber-200 dark:border-amber-800/80 shadow-2xs">
                  {getFallbackTipsTrik(currentSoal)}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleLanjut}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>{step >= maxSteps ? 'Selesaikan & Lihat Analisis' : 'Soal Adaptif Berikutnya'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
