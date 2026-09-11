import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import { SoalItem, PaketSoalResponse } from '../types';
import { DEFAULT_SOAL_BANK } from '../data/defaultBank';

interface BankKurasiCatalogProps {
  onLoadAsActivePacket: (paket: PaketSoalResponse) => void;
  onSelectSingleSoal?: (soal: SoalItem) => void;
}

export const BankKurasiCatalog: React.FC<BankKurasiCatalogProps> = ({
  onLoadAsActivePacket,
}) => {
  const [jenjangFilter, setJenjangFilter] = useState<'All' | 'SD' | 'SMP'>('All');
  const [domainFilter, setDomainFilter] = useState<'All' | 'Literasi' | 'Numerasi'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Mudah' | 'Sedang' | 'Sulit'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = DEFAULT_SOAL_BANK.filter((item) => {
    if (jenjangFilter !== 'All' && item.jenjang !== jenjangFilter) return false;
    if (domainFilter !== 'All' && item.domain !== domainFilter) return false;
    if (difficultyFilter !== 'All' && item.kesulitan !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.stimulus.toLowerCase().includes(q) ||
        item.pertanyaan.toLowerCase().includes(q) ||
        item.kompetensi.toLowerCase().includes(q) ||
        item.subdomain.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUseAllFiltered = () => {
    if (filteredItems.length === 0) return;
    const packet: PaketSoalResponse = {
      metadata: {
        jenjang: jenjangFilter === 'All' ? 'SD' : jenjangFilter,
        kelas: jenjangFilter === 'SMP' ? 'SMP 8' : 'SD 5',
        domain: domainFilter === 'All' ? 'Literasi dan Numerasi' : domainFilter,
        jumlah_soal: filteredItems.length,
        tingkat_kesulitan: 'Campuran',
        bentuk_soal: 'Pilihan Ganda',
        level_kognitif: 'Campuran',
        konteks: 'Kehidupan sehari-hari',
        bahasa: 'Sesuai tingkat perkembangan siswa',
        mode: 'ASESMEN',
        judul: `Paket Kurasi Terstandar (${filteredItems.length} Soal)`,
        waktu_menit: filteredItems.length * 2.5,
      },
      soal: filteredItems,
    };
    onLoadAsActivePacket(packet);
  };

  const handleCopyText = (soal: SoalItem) => {
    const text = `[${soal.id}] ${soal.domain} - ${soal.jenjang} (${soal.subdomain})\n\nSTIMULUS:\n${soal.stimulus}\n\nPERTANYAAN:\n${soal.pertanyaan}\n\nOPSI:\nA. ${soal.opsi?.A}\nB. ${soal.opsi?.B}\nC. ${soal.opsi?.C}\nD. ${soal.opsi?.D}\n\nKUNCI JAWABAN: ${soal.kunci}\n\nPEMBAHASAN:\n${soal.pembahasan}`;
    navigator.clipboard.writeText(text);
    setCopiedId(soal.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Overview Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Bank Soal Terkalibrasi Standar Kemendikbudristek &amp; TKA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Bank Kurasi Standar (Aktif &amp; Siap Digunakan)
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Koleksi butir soal Literasi dan Numerasi yang telah divalidasi oleh pakar kurikulum.
              Memiliki kisi-kisi lengkap, indikator kompetensi, stimulus kontekstual realistis,
              serta analisis distraktor miskonsepsi siswa 100% tanpa ketergantungan koneksi AI.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5">
            <button
              id="btn-use-all-curated"
              onClick={handleUseAllFiltered}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <span>Gunakan {filteredItems.length} Soal Terfilter Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-indigo-200/80">
              Langsung siap untuk Ujian CBT atau Cetak PDF
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mr-1">
              <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Penyaringan:</span>
            </div>

            {/* Jenjang */}
            <select
              value={jenjangFilter}
              onChange={(e) => setJenjangFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">Semua Jenjang (SD &amp; SMP)</option>
              <option value="SD">Jenjang SD Saja</option>
              <option value="SMP">Jenjang SMP Saja</option>
            </select>

            {/* Domain */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">Semua Domain</option>
              <option value="Literasi">Literasi</option>
              <option value="Numerasi">Numerasi</option>
            </select>

            {/* Kesulitan */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">Semua Tingkat Kesulitan</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Cari kata kunci materi, stimulus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada butir soal yang sesuai filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Coba ubah opsi jenjang, domain, atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          filteredItems.map((soal, idx) => {
            const isExpanded = expandedId === soal.id;
            return (
              <div
                key={soal.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                {/* Item Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
                      #{idx + 1} • {soal.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        soal.domain === 'Literasi'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {soal.domain}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {soal.jenjang} ({soal.kelas})
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Subdomain: <strong className="text-slate-800 dark:text-slate-200">{soal.subdomain}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyText(soal)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Salin butir soal & pembahasan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === soal.id ? 'Tersalin!' : 'Salin'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : soal.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Tutup Telaah' : 'Lihat Kisi-kisi & Telaah'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Stimulus */}
                  <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                    <div className="text-[11px] font-sans font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>Stimulus / Teks Bacaan Kontekstual ({soal.konten}):</span>
                    </div>
                    <p className="whitespace-pre-line">{soal.stimulus}</p>
                  </div>

                  {/* Pertanyaan */}
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {soal.pertanyaan}
                    </h4>

                    {/* Opsi Jawaban */}
                    {soal.opsi && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {Object.entries(soal.opsi).map(([optKey, optText]) => {
                          const isCorrect = optKey === soal.kunci;
                          return (
                            <div
                              key={optKey}
                              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-medium'
                                  : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                {optKey}
                              </span>
                              <span className="pt-0.5">{optText}</span>
                              {isCorrect && (
                                <span className="ml-auto text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                                  Kunci Jawaban
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Expanded Pedagogical Analysis */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/80 dark:bg-slate-950/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Kompetensi yang Diukur:
                            </span>
                            <p className="text-slate-600 dark:text-slate-400">{soal.kompetensi}</p>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Indikator Soal:
                            </span>
                            <p className="text-slate-600 dark:text-slate-400">{soal.indikator}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Miskonsepsi / Kesalahan Umum Siswa:
                            </span>
                            <p className="text-amber-800 dark:text-amber-300">{soal.kesalahan_umum || 'Siswa terkecoh distraktor berbasis informasi tersirat tanpa verifikasi.'}</p>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Konteks &amp; Level Kognitif:
                            </span>
                            <p className="text-slate-600 dark:text-slate-400">
                              Konteks: <strong className="text-slate-800 dark:text-slate-200">{soal.konteks}</strong> • Level: <strong className="text-slate-800 dark:text-slate-200">{soal.level_kognitif}</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pembahasan Detail */}
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold block mb-1 text-emerald-900 dark:text-emerald-300">
                          Langkah Berpikir &amp; Pembahasan Kunci:
                        </span>
                        <p className="whitespace-pre-line leading-relaxed">{soal.pembahasan}</p>
                      </div>

                      {/* Alasan Distraktor */}
                      {soal.alasan_distraktor && Object.keys(soal.alasan_distraktor).length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                            Analisis Distraktor Pilihan Jawaban:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(soal.alasan_distraktor).map(([dKey, dDesc]) => (
                              <div key={dKey} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="font-bold text-slate-700 dark:text-slate-300 mr-1.5">Opsi {dKey}:</span>
                                <span className="text-slate-600 dark:text-slate-400">{dDesc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
