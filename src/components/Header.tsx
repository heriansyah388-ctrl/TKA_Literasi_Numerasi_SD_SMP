import React from 'react';
import {
  BookOpen,
  Sparkles,
  Printer,
  Download,
  GraduationCap,
  CheckCircle2,
  FileText,
  ChevronDown,
  Share2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi';
  setActiveTab: (tab: 'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi') => void;
  totalSoal: number;
  onPrintStudent: () => void;
  onPrintTeacher: () => void;
  onExportDocStudent?: () => void;
  onExportDocTeacher?: () => void;
  onOpenShare?: () => void;
  onOpenJson: () => void;
  hasGeminiKey: boolean;
  totalBankKurasi?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalSoal,
  onPrintStudent,
  onPrintTeacher,
  onExportDocStudent,
  onExportDocTeacher,
  onOpenShare,
  onOpenJson,
  hasGeminiKey,
  totalBankKurasi = 10,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  TKA Literasi & Numerasi
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SD &amp; SMP
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Generator Tes Kemampuan Akademik Berstandar Kurikulum Nasional
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px] border border-slate-200">
                  Pengembang
                </span>
                <span className="font-semibold text-slate-800">Heriansyah., S.Si., S.Pd., M.Pd</span>
                <span className="text-slate-500 hidden sm:inline">(Pengawas Satuan Pendidikan Disdikbud Sidrap)</span>
              </div>
            </div>
          </div>

          {/* Engine Status Indicators & Utility Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Gemini */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                hasGeminiKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={hasGeminiKey ? 'Gemini 3.8 Flash AI Aktif' : 'Gemini AI Belum Dikonfigurasi'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasGeminiKey ? 'Gemini AI Aktif' : 'Gemini AI Standby'}</span>
            </div>

            {/* Status Bank Kurasi Standar (Selalu Aktif) */}
            <button
              type="button"
              id="header-btn-bank-kurasi"
              onClick={() => setActiveTab('bank_kurasi')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                activeTab === 'bank_kurasi'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Klik untuk membuka Bank Kurasi Standar Terkalibrasi"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bank Kurasi Aktif ({totalBankKurasi} Soal)</span>
            </button>

            {totalSoal > 0 && (
              <>
                <button
                  id="btn-print-student"
                  onClick={onPrintStudent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
                  title="Cetak Lembar Soal Ujian Siswa (tanpa kunci jawaban)"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Soal</span>
                </button>

                <button
                  id="btn-print-teacher"
                  onClick={onPrintTeacher}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
                  title="Cetak Dokumen Guru (lengkap pembahasan & kunci)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pegangan Guru</span>
                </button>

                {/* Tombol Simpan DOC */}
                <div className="relative group">
                  <button
                    id="btn-header-export-doc"
                    type="button"
                    onClick={onExportDocStudent}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                    title="Simpan naskah ke format Microsoft Word (.doc)"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Simpan DOC</span>
                    <ChevronDown className="w-3 h-3 text-blue-500" />
                  </button>

                  <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs">
                    <button
                      type="button"
                      onClick={onExportDocStudent}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50/70 flex items-center gap-2 text-slate-700 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900">DOC Lembar Siswa</strong>
                        <span className="text-[10px] text-slate-500">Soal ujian siap cetak/edit</span>
                      </div>
                    </button>
                    <div className="border-t border-slate-100 my-0.5" />
                    <button
                      type="button"
                      onClick={onExportDocTeacher}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/70 flex items-center gap-2 text-slate-700 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900">DOC Pegangan Guru</strong>
                        <span className="text-[10px] text-slate-500">Lengkap kunci &amp; rubrik</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tombol Bagikan Link Siswa */}
                <button
                  id="btn-header-share-link"
                  type="button"
                  onClick={onOpenShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer shadow-2xs"
                  title="Dapatkan link langsung simulasi ujian untuk dikirimkan ke siswa (CBT / CAT)"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bagikan Link Siswa</span>
                </button>

                <button
                  id="btn-open-json"
                  onClick={onOpenJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-300 cursor-pointer"
                  title="Lihat & Unduh Data JSON Soal"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Format JSON</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 pt-2 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-generator"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Generator &amp; Parameter
          </button>

          <button
            id="tab-btn-soal-list"
            onClick={() => setActiveTab('soal_list')}
            className={`relative px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'soal_list'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Paket Aktif &amp; Telaah
            {totalSoal > 0 && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'soal_list' ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {totalSoal}
              </span>
            )}
          </button>

          <button
            id="tab-btn-bank-kurasi"
            onClick={() => setActiveTab('bank_kurasi')}
            className={`relative px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bank_kurasi'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100'
            }`}
          >
            3. Bank Kurasi Standar
            <span
              className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'bank_kurasi' ? 'bg-white text-indigo-700' : 'bg-indigo-200/80 text-indigo-800'
              }`}
            >
              {totalBankKurasi}
            </span>
          </button>

          <button
            id="tab-btn-cbt"
            onClick={() => setActiveTab('cbt')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'cbt'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            4. Simulasi CBT Siswa
          </button>

          <button
            id="tab-btn-cat"
            onClick={() => setActiveTab('cat')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'cat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            5. Asesmen Adaptif (CAT)
          </button>

          <button
            id="tab-btn-laporan"
            onClick={() => setActiveTab('laporan')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'laporan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            6. Profil &amp; Rekomendasi
          </button>
        </nav>
      </div>
    </header>
  );
};
