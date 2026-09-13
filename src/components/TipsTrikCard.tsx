import React, { useState } from 'react';
import { SoalItem } from '../types';
import { getDetailedTkaTips } from '../utils/tkaTipsHelper';
import {
  Zap,
  CheckCircle2,
  Lightbulb,
  GraduationCap,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

interface TipsTrikCardProps {
  soal: Partial<SoalItem>;
  compact?: boolean;
  defaultExpanded?: boolean;
}

export const TipsTrikCard: React.FC<TipsTrikCardProps> = ({
  soal,
  compact = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'all' | 'siswa' | 'konsep' | 'guru' | 'jebakan'>('all');
  const [copied, setCopied] = useState(false);

  const tipsDetail = getDetailedTkaTips(soal);

  const handleCopy = () => {
    const textToCopy = `=== ${tipsDetail.judulTrik} ===
Strategi Kilat:
${tipsDetail.strategiSingkat}

Langkah Siswa:
${tipsDetail.langkahSiswa.map((l) => `${l.nomor}. ${l.judul}: ${l.deskripsi}`).join('\n')}

Logika & Pemahaman Konsep:
${tipsDetail.penjelasanKonsep}

Catatan Bimbingan Guru:
${tipsDetail.panduanGuru}

Waspada Jebakan Soal:
${tipsDetail.waspadaJebakan}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20 shadow-xs overflow-hidden transition-all text-xs">
      {/* Header bar */}
      <div className="p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Zap className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-amber-950 dark:text-amber-200 text-xs sm:text-sm">
                Tips &amp; Trik Cepat Menjawab Soal TKA Ini:
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-[10px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
                <Sparkles className="w-2.5 h-2.5" />
                {tipsDetail.kategoriStrategi}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 font-medium">
              {tipsDetail.judulTrik}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            title="Salin Tips & Trik ke Clipboard"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium shadow-2xs hover:bg-amber-50/50 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Ringkas' : 'Detail Penjelasan'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Strategi Singkat (Selalu Ditampilkan) */}
        <div className="p-3 bg-white/95 dark:bg-slate-900/95 rounded-lg border border-amber-200/90 dark:border-amber-800/60 shadow-2xs">
          <div className="flex items-start gap-2">
            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wide shrink-0 mt-0.5">
              Trik Kilat
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {tipsDetail.strategiSingkat}
            </p>
          </div>
        </div>

        {/* Bagian Penjelasan Mendalam (Expanded) */}
        {isExpanded && (
          <div className="space-y-3.5 pt-1 animate-fadeIn">
            {/* Filter Tabs Penjelasan */}
            {!compact && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Semua Penjelasan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('siswa')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'siswa'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    🎯 Langkah Siswa
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('konsep')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'konsep'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    💡 Logika Konsep
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('guru')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'guru'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    👨‍🏫 Pedoman Guru
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('jebakan')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'jebakan'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    ⚠️ Waspada Jebakan
                  </span>
                </button>
              </div>
            )}

            {/* 1. Langkah Siswa */}
            {(activeTab === 'all' || activeTab === 'siswa') && (
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-900/50 p-3 sm:p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Langkah Cepat Siswa (Aksi Praktis 1-2-3):</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {tipsDetail.langkahSiswa.map((step) => (
                    <div
                      key={step.nomor}
                      className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-200/80 dark:border-amber-800/50 shadow-2xs flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {step.nomor}
                        </span>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold leading-tight">
                          {step.judul}
                        </strong>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.deskripsi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Logika Konsep & 3. Pedoman Guru */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Logika & Mengapa Trik Ini Bekerja */}
              {(activeTab === 'all' || activeTab === 'konsep') && (
                <div className="bg-indigo-50/60 dark:bg-indigo-950/25 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 p-3 sm:p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-200">
                    <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Logika Konseptual (Mengapa Trik Ini Bekerja):</span>
                  </div>
                  <p className="text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                    {tipsDetail.penjelasanKonsep}
                  </p>
                </div>
              )}

              {/* Pedoman Guru di Kelas */}
              {(activeTab === 'all' || activeTab === 'guru') && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/25 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 p-3 sm:p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-200">
                    <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Catatan Bimbingan Guru (Pedagogi Kelas):</span>
                  </div>
                  <p className="text-[11px] text-emerald-950 dark:text-emerald-200 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                    {tipsDetail.panduanGuru}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Waspada Jebakan Soal */}
            {(activeTab === 'all' || activeTab === 'jebakan') && (
              <div className="bg-rose-50/60 dark:bg-rose-950/25 rounded-xl border border-rose-200/80 dark:border-rose-900/50 p-3 sm:p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Waspadai Jebakan Pengecoh (Distractor Trap):</span>
                </div>
                <p className="text-[11px] text-rose-950 dark:text-rose-200 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                  {tipsDetail.waspadaJebakan}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
