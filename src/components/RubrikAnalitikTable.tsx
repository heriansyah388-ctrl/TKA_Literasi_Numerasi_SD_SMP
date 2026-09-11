import React from 'react';
import { RubrikAnalitik } from '../types';
import { FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface RubrikAnalitikTableProps {
  rubrik: RubrikAnalitik;
  isPrintMode?: boolean;
}

export const RubrikAnalitikTable: React.FC<RubrikAnalitikTableProps> = ({
  rubrik,
  isPrintMode = false,
}) => {
  const getScoreBadge = (skor: number) => {
    if (skor >= 2) {
      return {
        bg: isPrintMode
          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        badgeColor: 'text-emerald-700 dark:text-emerald-400',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      };
    }
    if (skor === 1) {
      return {
        bg: isPrintMode
          ? 'bg-amber-50 text-amber-900 border-amber-300'
          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        badgeColor: 'text-amber-700 dark:text-amber-400',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />,
      };
    }
    return {
      bg: isPrintMode
        ? 'bg-slate-50 text-slate-700 border-slate-300'
        : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      badgeColor: 'text-rose-600 dark:text-rose-400',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />,
    };
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border ${
        isPrintMode
          ? 'border-slate-400 bg-white text-[11px]'
          : 'border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs'
      }`}
    >
      {/* Table Header / Title */}
      <div
        className={`px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
          isPrintMode
            ? 'bg-slate-100 border-slate-300'
            : 'bg-gradient-to-r from-indigo-50/80 to-slate-50 dark:from-slate-850 dark:to-slate-900 border-indigo-100 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <FileSpreadsheet className={`w-4 h-4 ${isPrintMode ? 'text-slate-700' : 'text-indigo-600 dark:text-indigo-400'}`} />
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Rubrik Penskoran Analitik Bertingkat (Soal Uraian / Penalaran)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Skor Maksimal:</span>
          <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-indigo-600 text-white shadow-xs">
            {rubrik.skor_maksimal} Poin
          </span>
        </div>
      </div>

      {rubrik.pedoman_penskoran && (
        <div
          className={`px-3.5 py-2 border-b text-[11px] flex items-start gap-2 ${
            isPrintMode
              ? 'bg-white border-slate-200 text-slate-700'
              : 'bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-50 dark:border-slate-800 text-indigo-900 dark:text-indigo-300'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Pedoman Penilai:</strong> {rubrik.pedoman_penskoran}
          </p>
        </div>
      )}

      {/* Rubric Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b text-[11px] font-semibold ${
                isPrintMode
                  ? 'bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <th className="py-2 px-3 w-16 text-center border-r border-slate-200 dark:border-slate-800">Skor</th>
              <th className="py-2 px-3 w-48 border-r border-slate-200 dark:border-slate-800">Tingkat Capaian</th>
              <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-800">Kriteria &amp; Indikator Analitik</th>
              <th className="py-2 px-3 w-64">Contoh Respon Siswa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rubrik.kriteria.map((item) => {
              const badgeStyle = getScoreBadge(item.skor);
              return (
                <tr key={item.skor} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Skor Column */}
                  <td className="py-2.5 px-3 text-center align-top border-r border-slate-200 dark:border-slate-800">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs border ${badgeStyle.bg}`}
                    >
                      {item.skor}
                    </span>
                  </td>

                  {/* Tingkat Capaian */}
                  <td className="py-2.5 px-3 align-top border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                      {badgeStyle.icon}
                      <span>{item.label}</span>
                    </div>
                  </td>

                  {/* Kriteria & Indikator */}
                  <td className="py-2.5 px-3 align-top border-r border-slate-200 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.deskripsi}</p>
                  </td>

                  {/* Contoh Respon Siswa */}
                  <td className="py-2.5 px-3 align-top bg-slate-50/40 dark:bg-slate-950/30">
                    {item.contoh_jawaban ? (
                      <p className="text-slate-600 dark:text-slate-400 font-mono text-[10.5px] leading-relaxed italic bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                        &ldquo;{item.contoh_jawaban}&rdquo;
                      </p>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic text-[10px]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
