import React from 'react';
import { SoalItem, PaketSoalMetadata } from '../types';
import { Printer, X, FileSpreadsheet, Check, CheckSquare, Square, Link2, HelpCircle, FileText } from 'lucide-react';
import { getRubrikForSoal } from '../utils/rubrikHelper';
import { RubrikAnalitikTable } from './RubrikAnalitikTable';
import {
  isPgkSoal,
  isMenjodohkanSoal,
  isUraianSoal,
  getNormalizedPernyataan,
  getNormalizedJodohkanPairs,
  formatKunciJawaban,
} from '../utils/soalFormatHelper';
import { exportToWordDoc } from '../utils/exportDocHelper';

interface PrintableViewProps {
  mode: 'siswa' | 'guru';
  metadata: PaketSoalMetadata;
  soalList: SoalItem[];
  onClose: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  mode,
  metadata,
  soalList,
  onClose,
}) => {
  const isGuru = mode === 'guru';

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto print:static print:overflow-visible">
      {/* Non-print toolbar */}
      <div className="sticky top-0 bg-slate-900 text-white p-3 flex items-center justify-between shadow-md print:hidden z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">
            {isGuru ? 'Dokumen Asesmen Guru & Kunci Jawaban' : 'Lembar Soal Ujian Siswa (Siap Cetak)'}
          </span>
          <span className="text-xs text-slate-300">({soalList.length} Butir Soal)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-export-doc-preview"
            onClick={() => exportToWordDoc(metadata, soalList, mode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            title="Unduh dan simpan naskah ke format Microsoft Word (.doc)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Simpan DOC</span>
          </button>
          <button
            id="btn-print-pdf-preview"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
            title="Tutup lembar cetak"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Content */}
      <div className="max-w-4xl mx-auto p-8 sm:p-12 text-slate-900 font-sans leading-normal">
        {/* Kop Surat / Header Asesmen */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-900">
            TES KEMAMPUAN AKADEMIK (TKA) SISWA ({metadata.domain?.toUpperCase()})
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-slate-800 mt-1">
            JENJANG {metadata.jenjang} — KELAS {metadata.kelas} • MODE {metadata.mode}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tahun Ajaran 2026/2027 • Standar TKA Literasi &amp; Numerasi Kurikulum Nasional
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Pengembang: <strong>Heriansyah., S.Si., S.Pd., M.Pd</strong> (Pengawas Satuan Pendidikan Disdikbud Sidrap)
          </p>
        </div>

        {/* Student Identity Box (for student view) */}
        {!isGuru ? (
          <div className="border border-slate-400 rounded-lg p-3.5 mb-6 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-500 block">Nama Siswa:</span>
              <div className="border-b border-dotted border-slate-400 mt-3" />
            </div>
            <div>
              <span className="text-slate-500 block">Nomor Absen / NISN:</span>
              <div className="border-b border-dotted border-slate-400 mt-3" />
            </div>
            <div>
              <span className="text-slate-500 block">Kelas / Ruang:</span>
              <div className="border-b border-dotted border-slate-400 mt-3" />
            </div>
            <div>
              <span className="text-slate-500 block">Nilai / Skor:</span>
              <div className="border border-slate-400 h-8 rounded-sm mt-1" />
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6 text-xs text-indigo-900">
            <strong>DOKUMEN PEGANGAN GURU:</strong> Berisi butir stimulus, pertanyaan, opsi, kunci
            jawaban resmi, indikator keberhasilan, dan telaah proses berpikir.
          </div>
        )}

        {/* Petunjuk Pengerjaan */}
        {!isGuru && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-6 text-slate-700">
            <strong className="block mb-1 text-slate-900">Petunjuk Umum:</strong>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
              <li>Tuliskan identitas Anda secara lengkap pada kolom yang telah disediakan.</li>
              <li>Bacalah setiap teks stimulus bacaan atau data dengan saksama sebelum menjawab.</li>
              <li>Pilihlah salah satu jawaban yang paling tepat dengan menyilang (X) atau melingkari huruf A, B, C, atau D.</li>
              <li>Periksa kembali seluruh jawaban Anda sebelum dikumpulkan kepada guru pengawas.</li>
            </ol>
          </div>
        )}

        {/* Question Items List */}
        <div className="space-y-6">
          {soalList.map((soal, idx) => (
            <div key={soal.id} className="text-xs break-inside-avoid">
              <div className="flex items-start gap-2">
                <span className="font-bold text-sm w-6 shrink-0">{idx + 1}.</span>
                <div className="flex-1 space-y-2.5">
                  {/* Stimulus Box */}
                  <div className="p-3 bg-slate-50 border-l-2 border-slate-700 text-slate-800 whitespace-pre-line leading-relaxed font-serif">
                    {soal.stimulus}
                  </div>

                  {/* Pertanyaan */}
                  <p className="font-semibold text-slate-900 text-sm leading-snug">
                    {soal.pertanyaan}
                  </p>

                  {/* Render based on Question Type: Menjodohkan, PGK, Uraian, or PG */}
                  {isMenjodohkanSoal(soal) ? (
                    (() => {
                      const pairs = getNormalizedJodohkanPairs(soal);
                      const responChoices = Array.from(new Set(pairs.map((p) => p.respon)));

                      return (
                        <div className="space-y-2.5 pt-1">
                          {!isGuru && (
                            <div className="p-2 bg-slate-100 rounded text-[11px] text-slate-700 italic border border-slate-200">
                              Petunjuk: Tuliskan huruf pasangan pilihan pada kotak <strong>[ .... ]</strong> di Kolom A, atau tarik garis lurus penghubung dari titik Kolom A ke titik Kolom B yang tepat.
                            </div>
                          )}

                          {/* Two column grid */}
                          <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-3 bg-white">
                            {/* Kolom A: Premis */}
                            <div className="space-y-2 border-r border-slate-200 pr-3">
                              <div className="font-bold text-[11px] text-slate-800 pb-1 border-b border-slate-200 uppercase tracking-wide">
                                KOLOM A: Pernyataan / Kasus
                              </div>
                              {pairs.map((pair, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex items-start justify-between gap-2 p-2 rounded border border-slate-200 bg-slate-50/50"
                                >
                                  <div className="flex items-start gap-1.5 flex-1">
                                    <span className="font-bold text-slate-800 shrink-0">{pIdx + 1}.</span>
                                    <span className="leading-snug text-slate-800">{pair.premis}</span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                    <span className="border border-slate-400 bg-white px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600">
                                      {isGuru ? (
                                        <span className="text-emerald-800 font-bold">
                                          [{String.fromCharCode(65 + responChoices.indexOf(pair.respon))}]
                                        </span>
                                      ) : (
                                        <span className="text-slate-400">[ &nbsp;&nbsp;&nbsp; ]</span>
                                      )}
                                    </span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block"></span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Kolom B: Respon */}
                            <div className="space-y-2 pl-1">
                              <div className="font-bold text-[11px] text-slate-800 pb-1 border-b border-slate-200 uppercase tracking-wide">
                                KOLOM B: Pilihan Jawaban
                              </div>
                              {responChoices.map((resp, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="flex items-start gap-2 p-2 rounded border border-slate-200 bg-slate-50/30"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block shrink-0 mt-1"></span>
                                  <span className="font-bold text-slate-800 text-[11px] shrink-0">
                                    {String.fromCharCode(65 + rIdx)}.
                                  </span>
                                  <span className="leading-snug flex-1 text-slate-800">{resp}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Teacher Key Table for Menjodohkan */}
                          {isGuru && (
                            <div className="p-2.5 bg-emerald-50/60 rounded border border-emerald-300">
                              <span className="font-bold text-emerald-950 block mb-1">
                                Kunci Pasangan Menjodohkan Lengkap:
                              </span>
                              <table className="w-full border-collapse text-[11px]">
                                <thead>
                                  <tr className="bg-emerald-100/70 border-b border-emerald-300 text-emerald-900">
                                    <th className="p-1.5 text-left w-8">No</th>
                                    <th className="p-1.5 text-left">Pernyataan (Kolom A)</th>
                                    <th className="p-1.5 text-center w-16">Pasangan</th>
                                    <th className="p-1.5 text-left">Jawaban (Kolom B)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pairs.map((p, idx) => {
                                    const rIdx = responChoices.indexOf(p.respon);
                                    const code = rIdx !== -1 ? String.fromCharCode(65 + rIdx) : '-';
                                    return (
                                      <tr key={idx} className="border-b border-emerald-200/50">
                                        <td className="p-1.5 font-bold text-slate-800">{idx + 1}</td>
                                        <td className="p-1.5 text-slate-800">{p.premis}</td>
                                        <td className="p-1.5 text-center font-bold text-emerald-900 bg-emerald-100/60">
                                          [{code}]
                                        </td>
                                        <td className="p-1.5 font-medium text-slate-800">{p.respon}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : isPgkSoal(soal) ? (
                    (() => {
                      const statements = getNormalizedPernyataan(soal);
                      const hasStatements = statements.length > 0;

                      if (hasStatements) {
                        return (
                          <div className="space-y-2 pt-1">
                            {!isGuru && (
                              <div className="p-1.5 bg-slate-100 rounded text-[11px] text-slate-700 italic border border-slate-200">
                                Petunjuk: Beri tanda centang (✓) atau bulatan hitam pada kolom <strong>Benar</strong> atau <strong>Salah</strong> untuk setiap pernyataan berikut.
                              </div>
                            )}

                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                              <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                                  <th className="p-2 text-center w-8 border-r border-slate-300">No</th>
                                  <th className="p-2 text-left border-r border-slate-300">Pernyataan Berdasarkan Stimulus</th>
                                  <th className="p-2 text-center w-16 border-r border-slate-300">Benar</th>
                                  <th className="p-2 text-center w-16">Salah</th>
                                </tr>
                              </thead>
                              <tbody>
                                {statements.map((stmt, sIdx) => {
                                  const isBenar = stmt.kunci.toLowerCase() === 'benar' || stmt.kunci.toLowerCase() === 'true';
                                  return (
                                    <tr key={sIdx} className="border-b border-slate-200">
                                      <td className="p-2 text-center font-bold border-r border-slate-200">{sIdx + 1}</td>
                                      <td className="p-2 border-r border-slate-200 text-slate-800 leading-snug">{stmt.teks}</td>
                                      <td className={`p-2 text-center border-r border-slate-200 ${isGuru && isBenar ? 'bg-emerald-100 font-bold text-emerald-900' : ''}`}>
                                        {isGuru ? (isBenar ? '● [BENAR]' : '○') : '○'}
                                      </td>
                                      <td className={`p-2 text-center ${isGuru && !isBenar ? 'bg-rose-100 font-bold text-rose-900' : ''}`}>
                                        {isGuru ? (!isBenar ? '● [SALAH]' : '○') : '○'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      // Multi-Select Checkboxes
                      return (
                        <div className="space-y-2 pt-1">
                          {!isGuru && (
                            <div className="p-1.5 bg-slate-100 rounded text-[11px] text-slate-700 italic border border-slate-200">
                              Petunjuk: Beri tanda centang (✓) pada semua kotak pilihan yang benar (jawaban bisa lebih dari satu).
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {soal.opsi && Object.entries(soal.opsi).map(([huruf, teks]) => {
                              const isCorrect = soal.kunci && (soal.kunci.includes(huruf) || soal.kunci.toUpperCase().includes(huruf.toUpperCase()));
                              return (
                                <div
                                  key={huruf}
                                  className={`flex items-start gap-2 p-2 rounded border ${
                                    isGuru && isCorrect
                                      ? 'border-emerald-600 bg-emerald-50 font-semibold text-emerald-950'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded border border-slate-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                                    {isGuru && isCorrect ? '✓' : ''}
                                  </span>
                                  <span className="pt-0.5 leading-snug">
                                    <strong>{huruf}.</strong> {teks}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  ) : isUraianSoal(soal) ? (
                    /* Lembar Jawab Uraian Siswa */
                    <div className="pt-1">
                      {!isGuru ? (
                        <div className="border border-slate-400 rounded-lg p-3 min-h-[110px] bg-slate-50/30 text-[11px] text-slate-400 flex flex-col justify-between">
                          <span className="italic">
                            Lembar Jawaban Siswa (Tuliskan langkah pengerjaan, penalaran, atau perhitungan):
                          </span>
                          <div className="border-b border-dashed border-slate-300 h-6"></div>
                          <div className="border-b border-dashed border-slate-300 h-6"></div>
                          <div className="border-b border-dashed border-slate-300 h-6"></div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    /* Standard Pilihan Ganda Tunggal */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {soal.opsi && Object.entries(soal.opsi).map(([huruf, teks]) => (
                        <div
                          key={huruf}
                          className={`flex items-start gap-2 p-2 rounded border ${
                            isGuru && huruf === soal.kunci
                              ? 'border-emerald-600 bg-emerald-50/50 font-semibold text-emerald-950'
                              : 'border-slate-300'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {huruf}
                          </span>
                          <span className="pt-0.5 leading-snug">{teks}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Teacher metadata, explanation & Analytic Rubric Table */}
                  {isGuru && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-300 text-[11px] space-y-2.5 text-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div>
                          <strong>Kunci/Inti Jawaban:</strong>{' '}
                          <span className="text-emerald-800 font-bold">{formatKunciJawaban(soal)}</span>
                        </div>
                        <div className="text-slate-500">
                          Bentuk: <strong>{soal.bentuk_soal || 'Pilihan Ganda'}</strong> • Subdomain: <strong>{soal.subdomain}</strong> • Level: <strong>{soal.level_kognitif}</strong>
                        </div>
                      </div>

                      <div>
                        <strong>Indikator Pencapaian:</strong> {soal.indikator}
                      </div>

                      <div>
                        <strong>Langkah Pembahasan &amp; Pembuktian:</strong>
                        <p className="mt-0.5 text-slate-700 whitespace-pre-line leading-relaxed">
                          {soal.pembahasan}
                        </p>
                      </div>

                      {/* Tabel Rubrik Skor Analitik Bertingkat untuk Pegangan Guru jika soal Uraian atau berbobot analitik */}
                      {isUraianSoal(soal) && (
                        <div className="pt-1">
                          <RubrikAnalitikTable rubrik={getRubrikForSoal(soal)} isPrintMode={true} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 space-y-0.5">
          <div>Lembar Asesmen Akademik Siswa Indonesia • Dicetak secara mandiri melalui AI Generator Soal Literasi &amp; Numerasi</div>
          <div className="font-semibold text-slate-700">Pengembang: Heriansyah., S.Si., S.Pd., M.Pd (Pengawas Satuan Pendidikan Disdikbud Sidrap)</div>
        </div>
      </div>
    </div>
  );
};
