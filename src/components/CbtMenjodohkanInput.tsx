import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Link2, Sparkles, HelpCircle } from 'lucide-react';
import { SoalItem } from '../types';
import { getNormalizedJodohkanPairs } from '../utils/soalFormatHelper';

interface CbtMenjodohkanInputProps {
  soal: SoalItem;
  value: any; // Record<string, string> mapping `premis_${idx}` to `respon`
  onChange: (newValue: any) => void;
  textSizeClass?: string;
}

export const CbtMenjodohkanInput: React.FC<CbtMenjodohkanInputProps> = ({
  soal,
  value,
  onChange,
  textSizeClass = 'text-xs sm:text-sm',
}) => {
  const pairs = getNormalizedJodohkanPairs(soal);
  const currentPairs: Record<string, string> =
    typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {};

  // Track currently active selected Premis for click-to-pair interaction
  const [activePremisIdx, setActivePremisIdx] = useState<number | null>(0);

  // Derive unique list of response choices on the right
  const responseChoices = Array.from(new Set(pairs.map((p) => p.respon)));

  const handlePair = (premisIdx: number, responText: string) => {
    const updated = {
      ...currentPairs,
      [`premis_${premisIdx}`]: responText,
    };
    onChange(updated);

    // Auto advance to next unpaired premis
    const nextUnpaired = pairs.findIndex(
      (_, i) => i !== premisIdx && !updated[`premis_${i}`]
    );
    setActivePremisIdx(nextUnpaired !== -1 ? nextUnpaired : null);
  };

  const handleUnpair = (premisIdx: number) => {
    const updated = { ...currentPairs };
    delete updated[`premis_${premisIdx}`];
    onChange(updated);
    setActivePremisIdx(premisIdx);
  };

  const handleResetAll = () => {
    onChange({});
    setActivePremisIdx(0);
  };

  const pairedCount = pairs.filter((_, idx) => Boolean(currentPairs[`premis_${idx}`])).length;
  const isComplete = pairedCount === pairs.length && pairs.length > 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Header Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-semibold">
          <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Komponen Menjodohkan (Hubungkan Pernyataan di Kolom Kiri dengan Pasangan di Kolom Kanan)</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
              isComplete
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
          >
            {pairedCount} dari {pairs.length} Terhubung
          </span>

          {pairedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset semua pasangan"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-[11.5px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>
          <strong>Petunjuk:</strong> Klik salah satu kotak di <strong>Kolom A</strong>, lalu klik jawaban yang sesuai di <strong>Kolom B</strong>, atau pilih langsung melalui dropdown menu di setiap kartu.
        </span>
      </div>

      {/* Interactive Two-Column Pairing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Kolom A (Premis) */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Kolom A: Pernyataan / Kasus
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Pilih salah satu</span>
          </div>

          <div className="space-y-2.5">
            {pairs.map((pair, idx) => {
              const matchedRespon = currentPairs[`premis_${idx}`];
              const isActive = activePremisIdx === idx;
              const isPaired = Boolean(matchedRespon);

              return (
                <div
                  key={idx}
                  onClick={() => setActivePremisIdx(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs'
                      : isPaired
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isPaired
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <p className={`text-slate-800 dark:text-slate-200 ${textSizeClass} font-medium leading-snug flex-1`}>
                      {pair.premis}
                    </p>
                  </div>

                  {/* Paired status or dropdown selection */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    {isPaired ? (
                      <div className="flex items-center justify-between w-full gap-2 bg-emerald-50/80 dark:bg-emerald-950/50 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-semibold truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">➔ {matchedRespon}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnpair(idx);
                          }}
                          className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:underline shrink-0 cursor-pointer"
                        >
                          ✕ Lepas
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {isActive ? '● Aktif (Pilih jawaban di kanan)' : 'Klik untuk memilih'}
                        </span>
                        {/* Dropdown alternative for direct selection */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handlePair(idx, e.target.value);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] py-1 px-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Pilih Pasangan...</option>
                          {responseChoices.map((resp, rIdx) => (
                            <option key={rIdx} value={resp}>
                              {String.fromCharCode(65 + rIdx)}. {resp}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom B (Respon / Pilihan Jawaban) */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Kolom B: Pilihan Jawaban / Pasangan
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Klik untuk menjodohkan</span>
          </div>

          <div className="space-y-2.5">
            {responseChoices.map((respText, rIdx) => {
              const letterCode = String.fromCharCode(65 + rIdx);

              // Find which premis is paired with this response, if any
              const pairedPremisIndices = pairs
                .map((_, i) => i)
                .filter((i) => currentPairs[`premis_${i}`] === respText);

              const isAlreadyPaired = pairedPremisIndices.length > 0;

              return (
                <button
                  key={rIdx}
                  type="button"
                  id={`btn-respon-${rIdx}`}
                  onClick={() => {
                    if (activePremisIdx !== null) {
                      handlePair(activePremisIdx, respText);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isAlreadyPaired
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400'
                      : activePremisIdx !== null
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/40 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isAlreadyPaired
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {letterCode}
                  </span>

                  <div className="flex-1">
                    <p className={`text-slate-800 dark:text-slate-200 ${textSizeClass} leading-snug font-medium`}>
                      {respText}
                    </p>

                    {isAlreadyPaired && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        {pairedPremisIndices.map((pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800"
                          >
                            <Link2 className="w-2.5 h-2.5" />
                            Terhubung ke Pernyataan #{pIdx + 1}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
