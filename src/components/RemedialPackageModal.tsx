import React, { useState } from 'react';
import {
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Zap,
  HelpCircle,
  User,
  GraduationCap,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SoalItem, PaketSoalResponse } from '../types';
import { PaketRemedialReport, RemedialItemDetail, exportRemedialToWordDoc } from '../utils/remedialHelper';
import { StimulusRenderer } from './StimulusRenderer';
import { MathTextRenderer } from './MathTextRenderer';
import { TipsTrikCard } from './TipsTrikCard';

interface RemedialPackageModalProps {
  report: PaketRemedialReport;
  isOpen: boolean;
  onClose: () => void;
  onSetAsActivePacket: (paket: PaketSoalResponse) => void;
  onStartExamNow: (paket: PaketSoalResponse) => void;
}

export const RemedialPackageModal: React.FC<RemedialPackageModalProps> = ({
  report,
  isOpen,
  onClose,
  onSetAsActivePacket,
  onStartExamNow,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeSubTab, setActiveSubTab] = useState<'ringkasan' | 'daftar_soal'>('ringkasan');

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    report.daftarSoalSalah.forEach((item) => {
      all[item.soal.id] = true;
    });
    setExpandedItems(all);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const handleExportDoc = () => {
    exportRemedialToWordDoc(report);
  };

  const handleApplyToActive = () => {
    onSetAsActivePacket(report.paketRemedial);
    onClose();
  };

  const handleDirectExam = () => {
    onStartExamNow(report.paketRemedial);
    onClose();
  };

  return (
    <div
      id="modal-paket-remedial"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Paket Remedial Otomatis Terkalibrasi</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                Program Tindak Lanjut Siswa
              </h2>
            </div>
          </div>

          <button
            id="btn-close-modal-remedial"
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Student Info & Stats Ribbon */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {report.identitasSiswa?.nama || 'Siswa Peserta Asesmen'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Kelas: {report.identitasSiswa?.kelas || report.paketRemedial.metadata.kelas} • NIS: {report.identitasSiswa?.nis || '-'}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800">
              {report.jumlahSalah} Butir Salah ({report.persentasePerluRemedial}%)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
              Estimasi: {report.paketRemedial.metadata.waktu_menit} Menit
            </span>
          </div>
        </div>

        {/* Modal Subtabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-5 pt-3 bg-white dark:bg-slate-900 shrink-0 gap-2">
          <button
            id="tab-remedial-ringkasan"
            onClick={() => setActiveSubTab('ringkasan')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'ringkasan'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            1. Matriks Diagnosa &amp; Intervensi
          </button>
          <button
            id="tab-remedial-daftar-soal"
            onClick={() => setActiveSubTab('daftar_soal')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'daftar_soal'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            2. Naskah Butir Soal Remedial ({report.jumlahSalah})
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeSubTab === 'ringkasan' ? (
            <div className="space-y-4">
              {/* Pedagogical Directive Card */}
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Prinsip Intervensi Berdiferensiasi (Kurikulum Merdeka)
                  </h4>
                  <p className="leading-relaxed">
                    Paket ini mengisolasi {report.jumlahSalah} butir soal yang belum tuntas, disertai diagnosa miskonsepsi spesifik, tips eliminasi jebakan, serta rekomendasi materi pemulihan. Guru dapat mencetak lembar kerja ini atau langsung membimbing siswa mengulang ujian dalam mode adaptif.
                  </p>
                </div>
              </div>

              {/* Tabel Matriks Diagnosa */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3 w-28">Domain / Sub</th>
                      <th className="p-3 w-32">Jawaban vs Kunci</th>
                      <th className="p-3">Diagnosa Miskonsepsi &amp; Panduan Belajar</th>
                      <th className="p-3 w-40">Tips Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.daftarSoalSalah.map((item, idx) => (
                      <tr key={item.soal.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                            {item.soal.domain}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.soal.subdomain}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800 text-[11px]">
                              Siswa: {item.jawabanSiswa}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 text-[11px]">
                              Kunci: {item.kunciJawaban}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-slate-800 dark:text-slate-200 font-medium mb-1">
                            {item.diagnosaKesalahan}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            {item.panduanBelajar}
                          </p>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {item.tipsTrik}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Total {report.daftarSoalSalah.length} butir soal remedial teridentifikasi
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAll}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Buka Semua
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={collapseAll}
                    className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              {report.daftarSoalSalah.map((item, idx) => {
                const soal = item.soal;
                const isExpanded = expandedItems[soal.id] ?? true;

                return (
                  <div
                    key={soal.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-850 shadow-2xs transition-all"
                  >
                    {/* Header item */}
                    <div
                      onClick={() => toggleExpand(soal.id)}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {soal.domain} • {soal.subdomain}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                            (Asal Soal #{item.nomorAsal} • {soal.level_kognitif})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[11px]">
                          Jawaban Anda: {item.jawabanSiswa}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Body item */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-3 text-xs">
                        {/* Stimulus Visual if available */}
                        {soal.stimulus_visual && (
                          <div className="mb-2">
                            <StimulusRenderer visual={soal.stimulus_visual} />
                          </div>
                        )}

                        {/* Stimulus Text */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                          <MathTextRenderer text={soal.stimulus} />
                        </div>

                        {/* Pertanyaan */}
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 pt-1">
                          <MathTextRenderer text={soal.pertanyaan} />
                        </div>

                        {/* Opsi Jawaban bila ada */}
                        {soal.opsi && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {Object.entries(soal.opsi).map(([k, v]) => {
                              const isStudentPick = String(item.jawabanSiswa).includes(k);
                              const isCorrectKey = String(item.kunciJawaban).includes(k);

                              return (
                                <div
                                  key={k}
                                  className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                                    isCorrectKey
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-semibold'
                                      : isStudentPick
                                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <span className="font-bold shrink-0">{k}.</span>
                                  <div className="flex-1">
                                    <MathTextRenderer text={v} />
                                  </div>
                                  {isCorrectKey && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  )}
                                  {isStudentPick && !isCorrectKey && (
                                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Diagnosa & Pembahasan */}
                        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200">
                          <strong className="block font-bold mb-0.5">Diagnosa &amp; Solusi Miskonsepsi:</strong>
                          <p className="leading-relaxed">{item.diagnosaKesalahan}</p>
                        </div>

                        {/* Tips & Trik Cepat Menjawab Soal TKA Ini */}
                        <TipsTrikCard soal={soal} defaultExpanded={false} />

                        {/* Pembahasan */}
                        <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-slate-700 dark:text-slate-300">
                          <strong className="block font-bold mb-0.5 text-slate-900 dark:text-slate-100">Pembahasan Lengkap:</strong>
                          <div className="leading-relaxed whitespace-pre-line">
                            <MathTextRenderer text={soal.pembahasan} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Siap ditindaklanjuti sebagai <strong>Paket Remedial Resmi</strong> ({report.jumlahSalah} butir soal).
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {/* Ekspor Word Doc */}
            <button
              id="btn-export-remedial-word"
              type="button"
              onClick={handleExportDoc}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Unduh naskah soal dan panduan intervensi format Microsoft Word (.doc)"
            >
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>DOC Lembar Remedial</span>
            </button>

            {/* Jadikan Paket Aktif */}
            <button
              id="btn-apply-remedial-active"
              type="button"
              onClick={handleApplyToActive}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              title="Muat butir soal salah ini ke Tab 2 (Paket Aktif & Telaah) untuk ditelaah atau diedit"
            >
              <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Jadikan Paket Aktif</span>
            </button>

            {/* Mulai Simulasi Ujian Remedial Sekarang */}
            <button
              id="btn-start-remedial-exam"
              type="button"
              onClick={handleDirectExam}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Buka langsung simulasi CBT khusus soal remedial ini untuk siswa"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Ujian Remedial Siswa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
