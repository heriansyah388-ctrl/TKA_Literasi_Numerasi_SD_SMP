import React from 'react';
import { Check, X, CheckSquare, Square, Layers } from 'lucide-react';
import { SoalItem } from '../types';
import { getNormalizedPernyataan } from '../utils/soalFormatHelper';

interface CbtPgkInputProps {
  soal: SoalItem;
  value: any; // Record<string, string> or string[] or string
  onChange: (newValue: any) => void;
  textSizeClass?: string;
}

export const CbtPgkInput: React.FC<CbtPgkInputProps> = ({
  soal,
  value,
  onChange,
  textSizeClass = 'text-xs sm:text-sm',
}) => {
  const pernyataanList = getNormalizedPernyataan(soal);
  const isMatrixMode = pernyataanList.length > 0;

  // Kasus A: Matrix Pernyataan (Benar / Salah)
  if (isMatrixMode) {
    const currentValues: Record<string, string> =
      typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {};

    const handleSelectPilihan = (pernyataanId: string, pilihan: 'Benar' | 'Salah') => {
      const updated = {
        ...currentValues,
        [pernyataanId]: pilihan,
      };
      onChange(updated);
    };

    const countAnswered = pernyataanList.filter((p) => Boolean(currentValues[p.id])).length;
    const isAllAnswered = countAnswered === pernyataanList.length;

    return (
      <div className="space-y-4 mb-6">
        {/* Header & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold">
            <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Pilihan Ganda Kompleks (Tentukan Benar atau Salah untuk Setiap Pernyataan)</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
              isAllAnswered
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {countAnswered} dari {pernyataanList.length} Dijawab
          </span>
        </div>

        {/* Matrix Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="grid grid-cols-12 bg-slate-100/80 border-b border-slate-200 p-3 text-xs font-bold text-slate-700">
            <div className="col-span-8 sm:col-span-8">Pernyataan Berdasarkan Stimulus</div>
            <div className="col-span-4 sm:col-span-4 text-center">Pilihan Jawaban</div>
          </div>

          <div className="divide-y divide-slate-100">
            {pernyataanList.map((p, idx) => {
              const selected = currentValues[p.id];
              return (
                <div
                  key={p.id}
                  className={`grid grid-cols-12 items-center p-3 sm:p-4 gap-3 transition-colors ${
                    selected ? 'bg-indigo-50/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="col-span-8 sm:col-span-8 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className={`text-slate-800 ${textSizeClass} leading-relaxed font-medium`}>
                      {p.teks}
                    </p>
                  </div>

                  <div className="col-span-4 sm:col-span-4 flex items-center justify-center gap-2">
                    {/* Tombol Benar */}
                    <button
                      type="button"
                      id={`btn-pgk-${p.id}-benar`}
                      onClick={() => handleSelectPilihan(p.id, 'Benar')}
                      className={`flex-1 max-w-[110px] py-2 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selected === 'Benar'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Benar</span>
                    </button>

                    {/* Tombol Salah */}
                    <button
                      type="button"
                      id={`btn-pgk-${p.id}-salah`}
                      onClick={() => handleSelectPilihan(p.id, 'Salah')}
                      className={`flex-1 max-w-[110px] py-2 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selected === 'Salah'
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs ring-2 ring-rose-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/50'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Salah</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Kasus B: Multi-Select Checkboxes (Pilihan Opsi Ganda Lebih dari Satu)
  const opsi = soal.opsi || {};
  const currentSelected: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
    ? value.split(',').map((s) => s.trim())
    : [];

  const handleToggleOption = (huruf: string) => {
    let updated: string[];
    if (currentSelected.includes(huruf)) {
      updated = currentSelected.filter((h) => h !== huruf);
    } else {
      updated = [...currentSelected, huruf].sort();
    }
    onChange(updated);
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-indigo-900 font-semibold">
          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Pilihan Ganda Kompleks (Bisa Memilih Lebih dari 1 Jawaban yang Benar)</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-indigo-100 text-indigo-800 border border-indigo-300">
          {currentSelected.length} Opsi Dipilih
        </span>
      </div>

      <div className="space-y-2.5">
        {Object.entries(opsi).map(([huruf, teks]) => {
          const isSelected = currentSelected.includes(huruf);
          return (
            <button
              key={huruf}
              type="button"
              id={`btn-pgk-multi-${soal.id}-${huruf}`}
              onClick={() => handleToggleOption(huruf)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-600 text-indigo-950 font-medium ring-1 ring-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                }`}
              >
                {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
              </span>
              <span className="font-bold text-xs w-5 shrink-0 pt-0.5">{huruf}.</span>
              <span className={`pt-0.5 leading-snug flex-1 ${textSizeClass}`}>{teks}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
