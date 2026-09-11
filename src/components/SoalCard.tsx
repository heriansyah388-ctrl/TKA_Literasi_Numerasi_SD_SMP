import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Tag,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FileSpreadsheet,
  Link2,
  Layers,
  CheckSquare,
  Zap,
} from 'lucide-react';
import { SoalItem } from '../types';
import { getRubrikForSoal } from '../utils/rubrikHelper';
import { RubrikAnalitikTable } from './RubrikAnalitikTable';
import { getFallbackTipsTrik } from '../utils/tkaTipsHelper';
import {
  isPgkSoal,
  isMenjodohkanSoal,
  isUraianSoal,
  getNormalizedPernyataan,
  getNormalizedJodohkanPairs,
  formatKunciJawaban,
} from '../utils/soalFormatHelper';

interface SoalCardProps {
  soal: SoalItem;
  nomor: number;
}

export const SoalCard: React.FC<SoalCardProps> = ({ soal, nomor }) => {
  const [showPembahasan, setShowPembahasan] = useState(false);
  const [showRubrik, setShowRubrik] = useState(false);
  const [copied, setCopied] = useState(false);

  const rubrik = getRubrikForSoal(soal);
  const isUraian = soal.bentuk_soal === 'Uraian' || !soal.opsi || Object.keys(soal.opsi).length === 0;

  const handleCopy = () => {
    let rubricText = '';
    if (rubrik && rubrik.kriteria) {
      rubricText = `\nRUBRIK PENSKORAN ANALITIK (SKALA BERTINGKAT):\n` +
        rubrik.kriteria.map(k => `- Skor ${k.skor} (${k.label}): ${k.deskripsi}${k.contoh_jawaban ? ` [Contoh: "${k.contoh_jawaban}"]` : ''}`).join('\n');
    }

    const text = `
[SOAL NO ${nomor}]
ID: ${soal.id}
Domain: ${soal.domain} (${soal.subdomain})
Bentuk Soal: ${soal.bentuk_soal || 'Pilihan Ganda'}
Tingkat: ${soal.jenjang || 'SD/SMP'} ${soal.kelas || ''} | Kesulitan: ${soal.kesulitan} | Level: ${soal.level_kognitif}

STIMULUS:
${soal.stimulus}

PERTANYAAN:
${soal.pertanyaan}

${soal.opsi && Object.keys(soal.opsi).length > 0 ? `PILIHAN JAWABAN:\n${Object.entries(soal.opsi).map(([k, v]) => `${k}. ${v}`).join('\n')}\n` : ''}
KUNCI / INTI JAWABAN: ${soal.kunci}

LANGKAH PEMBAHASAN & PEMBUKTIAN:
${soal.pembahasan}

TIPS & TRIK CEPAT MENJAWAB SOAL TKA:
${getFallbackTipsTrik(soal)}

INDIKATOR:
${soal.indikator}
${rubricText}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    Mudah: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Sedang: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Sulit: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  const domainColors = {
    Literasi: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Numerasi: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  };

  return (
    <div
      id={`soal-card-${soal.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 mb-5"
    >
      {/* Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
            {nomor}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
              domainColors[soal.domain]
            }`}
          >
            {soal.domain === 'Literasi' ? (
              <BookOpen className="w-3 h-3 mr-1" />
            ) : (
              <Calculator className="w-3 h-3 mr-1" />
            )}
            {soal.domain}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {soal.subdomain}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
              difficultyColors[soal.kesulitan] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {soal.kesulitan}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {soal.level_kognitif}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {soal.bentuk_soal || (isUraian ? 'Uraian' : 'Pilihan Ganda')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{soal.id}</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Salin teks butir soal lengkap beserta rubrik"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Kompetensi & Konteks Bar */}
      <div className="mb-4 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Kompetensi yang Diukur:</span>
          <span className="text-slate-600 dark:text-slate-400">{soal.kompetensi}</span>
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Konteks: <strong className="text-slate-700 dark:text-slate-200">{soal.konteks}</strong></span>
          <span>Konten: <strong className="text-slate-700 dark:text-slate-200">{soal.konten}</strong></span>
        </div>
      </div>

      {/* Stimulus */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          Stimulus:
        </span>
        <div className="bg-amber-50/40 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-r-xl text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-serif">
          {soal.stimulus}
        </div>
      </div>

      {/* Pertanyaan */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
          Pertanyaan:
        </span>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          {soal.pertanyaan}
        </p>
      </div>

      {/* Area Tampilan Berdasarkan Bentuk Soal: Menjodohkan, PGK, Uraian, atau PG */}
      {isMenjodohkanSoal(soal) ? (
        (() => {
          const pairs = getNormalizedJodohkanPairs(soal);
          const responChoices = Array.from(new Set(pairs.map((p) => p.respon)));

          return (
            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-200/80 dark:border-indigo-800">
                <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Format Menjodohkan (Matching): Pasangkan setiap pernyataan di Kolom A dengan jawaban yang tepat di Kolom B.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/40 dark:bg-slate-950/40 text-xs">
                {/* Kolom A */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-[11px] pb-1 border-b border-slate-200 dark:border-slate-800">
                    KOLOM A: Pernyataan / Kasus
                  </span>
                  {pairs.map((pair, pIdx) => {
                    const matchIdx = responChoices.indexOf(pair.respon);
                    const letterCode = matchIdx !== -1 ? String.fromCharCode(65 + matchIdx) : '?';
                    return (
                      <div key={pIdx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {pIdx + 1}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 leading-snug flex-1">{pair.premis}</span>
                        </div>
                        {showPembahasan && (
                          <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Pasangan Kunci: <strong>[{letterCode}] {pair.respon}</strong></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Kolom B */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-[11px] pb-1 border-b border-slate-200 dark:border-slate-800">
                    KOLOM B: Pilihan Jawaban
                  </span>
                  {responChoices.map((resp, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {String.fromCharCode(65 + rIdx)}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 leading-snug flex-1">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()
      ) : isPgkSoal(soal) ? (
        (() => {
          const statements = getNormalizedPernyataan(soal);
          const hasStatements = statements.length > 0;

          if (hasStatements) {
            return (
              <div className="mb-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-200/80 dark:border-indigo-800">
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Format Pilihan Ganda Kompleks (Matriks Benar / Salah)</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px]">
                        <th className="p-2.5 text-center w-10">No</th>
                        <th className="p-2.5 text-left">Pernyataan Berdasarkan Stimulus</th>
                        <th className="p-2.5 text-center w-24">Benar</th>
                        <th className="p-2.5 text-center w-24">Salah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {statements.map((stmt, sIdx) => {
                        const isBenar = stmt.kunci.toLowerCase() === 'benar' || stmt.kunci.toLowerCase() === 'true';
                        return (
                          <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors">
                            <td className="p-2.5 text-center font-bold text-slate-500 dark:text-slate-400">{sIdx + 1}</td>
                            <td className="p-2.5 text-slate-800 dark:text-slate-200 leading-snug">{stmt.teks}</td>
                            <td className={`p-2.5 text-center ${showPembahasan && isBenar ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold' : ''}`}>
                              {showPembahasan && isBenar ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Kunci
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500">○</span>
                              )}
                            </td>
                            <td className={`p-2.5 text-center ${showPembahasan && !isBenar ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-bold' : ''}`}>
                              {showPembahasan && !isBenar ? (
                                <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Kunci
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500">○</span>
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
          }

          // Multi-Select Checklist
          return (
            <div className="mb-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-200/80 dark:border-indigo-800 mb-2">
                <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Pilihan Ganda Kompleks (Multi-Select): Pilihlah semua pernyataan yang benar.</span>
              </div>
              {soal.opsi &&
                Object.entries(soal.opsi).map(([huruf, teks]) => {
                  const isKunci = showPembahasan && (soal.kunci?.includes(huruf) || soal.kunci?.toUpperCase().includes(huruf.toUpperCase()));
                  return (
                    <div
                      key={huruf}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-xs sm:text-sm ${
                        isKunci
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                          isKunci
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {isKunci ? '✓' : huruf}
                      </span>
                      <span className="flex-1 leading-snug pt-0.5">{teks}</span>
                      {isKunci && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })()
      ) : isUraianSoal(soal) ? (
        <div className="mb-5 p-4 bg-slate-50/80 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Lembar Jawaban Terbuka (Uraian / Penalaran Siswa)
            </span>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
              Skor Maks: {rubrik.skor_maksimal} Poin (Skala Bertingkat 2, 1, 0)
            </span>
          </div>
          <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Siswa menuliskan simpulan, runtutan pembuktian teks, atau rumus &amp; langkah hitung. Penilaian dinilai menggunakan <strong>Rubrik Skor Analitik Bertingkat</strong> (Skor 2: Penalaran Lengkap, Skor 1: Sebagian Benar / Parsial, Skor 0: Tidak Tepat).
          </p>
        </div>
      ) : (
        /* Pilihan Jawaban PG */
        soal.opsi && (
          <div className="mb-5 space-y-2">
            {Object.entries(soal.opsi).map(([huruf, teks]) => {
              const isKunci = showPembahasan && huruf === soal.kunci;
              return (
                <div
                  key={huruf}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-xs sm:text-sm ${
                    isKunci
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                      isKunci
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {huruf}
                  </span>
                  <span className="flex-1 leading-snug pt-0.5">{teks}</span>
                  {isKunci && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4" /> Kunci
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Action Buttons for Rubric and Pedagogical Explanation */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowPembahasan(!showPembahasan)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-200/60 dark:border-indigo-800 transition-colors cursor-pointer"
        >
          {showPembahasan ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Tutup Telaah Pedagogis</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Buka Telaah Pedagogis &amp; Kunci</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowRubrik(!showRubrik)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            showRubrik
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <FileSpreadsheet className={`w-3.5 h-3.5 ${showRubrik ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
          <span>{showRubrik ? 'Tutup Rubrik Analitik' : '📋 Rubrik Skor Analitik Bertingkat'}</span>
        </button>
      </div>

      {/* Rubrik Skor Analitik View (Toggled directly via Rubrik button) */}
      {showRubrik && (
        <div className="mt-4 animate-fadeIn">
          <RubrikAnalitikTable rubrik={rubrik} />
        </div>
      )}

      {/* Pedagogical Analysis View */}
      {showPembahasan && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Kunci / Inti Jawaban: {formatKunciJawaban(soal)}</span>
          </div>

          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Langkah Pembahasan &amp; Pembuktian:
            </span>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              {soal.pembahasan}
            </p>
          </div>

          {/* Tips & Trik Cepat Menjawab Soal TKA Ini */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl border border-amber-200/90 dark:border-amber-800/80 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold mb-1.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              <span>Tips &amp; Trik Cepat Menjawab Soal TKA Ini:</span>
            </div>
            <p className="text-amber-950 dark:text-amber-200 font-medium leading-relaxed bg-white/95 dark:bg-slate-900/95 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              {getFallbackTipsTrik(soal)}
            </p>
          </div>

          {/* If Rubrik not already open above, show it here */}
          {!showRubrik && (
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                Rubrik Penskoran Analitik Bertingkat (Pedoman Guru):
              </span>
              <RubrikAnalitikTable rubrik={rubrik} />
            </div>
          )}

          {soal.indikator && (
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                Indikator Keberhasilan:
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{soal.indikator}</p>
            </div>
          )}

          {soal.kesalahan_umum && (
            <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <span className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Potensi Kesalahan Umum Siswa (Miskonsepsi):
              </span>
              <p className="text-rose-900/90 dark:text-rose-200 leading-relaxed">{soal.kesalahan_umum}</p>
            </div>
          )}

          {soal.alasan_distraktor && Object.keys(soal.alasan_distraktor).length > 0 && (
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Analisis Distraktor (Pengecoh):
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                {Object.entries(soal.alasan_distraktor).map(([opt, desc]) => (
                  <li key={opt} className="flex items-start gap-1.5">
                    <strong className="text-slate-700 dark:text-slate-300 shrink-0">Opsi {opt}:</strong>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {soal.tag && soal.tag.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              {soal.tag.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
