import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Trash2,
  Search,
  Filter,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  User,
  GraduationCap,
  CreditCard,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { RekapNilaiSiswa, KategoriKemampuan, SoalItem, PaketSoalResponse } from '../types';
import {
  getRekapNilaiList,
  deleteRekapNilai,
  clearAllRekapNilai,
  exportRekapToCsv,
  seedSampleRekapData,
} from '../utils/rekapNilaiHelper';
import { generatePaketRemedial, exportRemedialToWordDoc } from '../utils/remedialHelper';
import { RemedialPackageModal } from './RemedialPackageModal';

interface RekapNilaiKelasViewProps {
  onBackToExam?: () => void;
  soalList?: SoalItem[];
  onSetAsActivePacket?: (paket: PaketSoalResponse) => void;
  onStartExamNow?: (paket: PaketSoalResponse) => void;
}

export const RekapNilaiKelasView: React.FC<RekapNilaiKelasViewProps> = ({
  onBackToExam,
  soalList = [],
  onSetAsActivePacket,
  onStartExamNow,
}) => {
  const [rekapList, setRekapList] = useState<RekapNilaiSiswa[]>(() => getRekapNilaiList());
  const [searchQuery, setSearchQuery] = useState('');
  const [kelasFilter, setKelasFilter] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState<'tertinggi' | 'terendah' | 'nama' | 'terbaru'>('terbaru');
  const [selectedStudent, setSelectedStudent] = useState<RekapNilaiSiswa | null>(null);
  const [remedialModalReport, setRemedialModalReport] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRefresh = () => {
    setRekapList(getRekapNilaiList());
  };

  const handleDeleteOne = (id: string, nama: string) => {
    if (window.confirm(`Hapus rekaman nilai untuk ${nama}?`)) {
      const updated = deleteRekapNilai(id);
      setRekapList(updated);
      showToast(`Data ${nama} berhasil dihapus.`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin MENGHAPUS SELURUH data rekap nilai kelas? Tindakan ini tidak dapat dibatalkan.')) {
      clearAllRekapNilai();
      setRekapList([]);
      showToast('Seluruh rekap nilai telah dikosongkan.');
    }
  };

  const handleSeedSample = () => {
    const samples = seedSampleRekapData();
    setRekapList(samples);
    showToast('Berhasil memuat 10 contoh data nilai rombel siswa untuk simulasi!');
  };

  const handleExportCsv = () => {
    if (rekapList.length === 0) {
      alert('Belum ada data nilai untuk diekspor.');
      return;
    }
    exportRekapToCsv(filteredList, kelasFilter === 'Semua' ? 'Leger_Kelas' : `Kelas_${kelasFilter}`);
    showToast('File Excel/CSV berhasil diunduh!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Distinct Classes
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    rekapList.forEach((r) => {
      if (r.identitas.kelas) set.add(r.identitas.kelas);
    });
    return Array.from(set).sort();
  }, [rekapList]);

  // Filtering & Sorting
  const filteredList = useMemo(() => {
    return rekapList
      .filter((item) => {
        if (kelasFilter !== 'Semua' && item.identitas.kelas !== kelasFilter) return false;
        if (kategoriFilter !== 'Semua' && item.kategori !== kategoriFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNama = item.identitas.nama.toLowerCase().includes(q);
          const matchNis = item.identitas.nis?.toLowerCase().includes(q);
          if (!matchNama && !matchNis) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'tertinggi') return b.skor - a.skor;
        if (sortBy === 'terendah') return a.skor - b.skor;
        if (sortBy === 'nama') return a.identitas.nama.localeCompare(b.identitas.nama);
        return b.timestamp - a.timestamp;
      });
  }, [rekapList, searchQuery, kelasFilter, kategoriFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    if (rekapList.length === 0) {
      return { total: 0, avg: 0, max: 0, min: 0, maxStudent: '-', tuntasPct: 0 };
    }
    const total = rekapList.length;
    const sum = rekapList.reduce((acc, curr) => acc + curr.skor, 0);
    const avg = Math.round(sum / total);
    let max = -Infinity;
    let min = Infinity;
    let maxStudent = '-';
    let tuntasCount = 0;

    rekapList.forEach((r) => {
      if (r.skor > max) {
        max = r.skor;
        maxStudent = r.identitas.nama;
      }
      if (r.skor < min) {
        min = r.skor;
      }
      if (r.skor >= 70) {
        tuntasCount++;
      }
    });

    const tuntasPct = Math.round((tuntasCount / total) * 100);

    return { total, avg, max, min, maxStudent, tuntasPct };
  }, [rekapList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Rekapitulasi Asesmen Kolektif</span>
            <span>•</span>
            <span>Standar Kurikulum Nasional</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Leger Nilai &amp; Rekap Skor Kelas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Rekapitulasi otomatis pengerjaan simulasi CBT siswa. Guru dapat memantau ketuntasan rombel, memfilter berdasarkan kelas, serta mengunduh format Excel (.csv) siap pakai untuk administrasi nilai sekolah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-export-rekap-excel"
            onClick={handleExportCsv}
            disabled={rekapList.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            title="Unduh seluruh rekap nilai ke format Microsoft Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel (.CSV)</span>
          </button>

          <button
            id="btn-print-leger-kelas"
            onClick={handlePrint}
            disabled={rekapList.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            title="Cetak format cetak leger nilai kelas resmi"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Cetak Leger</span>
          </button>

          {rekapList.length === 0 ? (
            <button
              id="btn-seed-sample-rekap"
              onClick={handleSeedSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Isi Contoh Rombel (10 Siswa)</span>
            </button>
          ) : (
            <button
              id="btn-clear-rekap-all"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 font-semibold text-xs transition-colors cursor-pointer"
              title="Kosongkan seluruh data rekap nilai"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Header for Leger Format (Only visible on print) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900">
            LEGER NILAI ASESMEN KOMPETENSI SISWA (TKA)
          </h1>
          <p className="text-xs text-slate-700">
            Asesmen Literasi Membaca dan Numerasi Berstandar Asesmen Nasional (ANBK/Pusmendik)
          </p>
          <div className="flex justify-center items-center gap-6 text-xs text-slate-600 pt-1">
            <span>Kelas / Rombel: {kelasFilter === 'Semua' ? 'Seluruh Kelas' : kelasFilter}</span>
            <span>•</span>
            <span>Total Peserta: {filteredList.length} Siswa</span>
            <span>•</span>
            <span>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Statistic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
        {/* Total Siswa */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Total Peserta Ujian
            </span>
            <strong className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total} <span className="text-xs font-normal text-slate-400">siswa</span>
            </strong>
          </div>
        </div>

        {/* Nilai Rata-rata */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Rata-rata Rombel
            </span>
            <strong className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {stats.avg} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </strong>
          </div>
        </div>

        {/* Nilai Tertinggi */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Nilai Tertinggi
            </span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.max > 0 ? stats.max : '-'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                {stats.maxStudent}
              </span>
            </div>
          </div>
        </div>

        {/* Ketuntasan Kelas */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Ketuntasan (&ge;70)
            </span>
            <strong className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {stats.tuntasPct}% <span className="text-xs font-normal text-slate-400">capai target</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Filter Kelas */}
          <select
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="Semua">Semua Kelas ({rekapList.length})</option>
            {uniqueClasses.map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>

          {/* Filter Kategori */}
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="Semua">Semua Capaian</option>
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Sudah Menguasai">Sudah Menguasai</option>
            <option value="Sudah Berkembang">Sudah Berkembang</option>
            <option value="Sedang Berkembang">Sedang Berkembang</option>
            <option value="Perlu Penguatan">Perlu Penguatan</option>
          </select>

          {/* Urutkan */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="terbaru">Terbaru Diinput</option>
              <option value="tertinggi">Nilai Tertinggi</option>
              <option value="terendah">Nilai Terendah</option>
              <option value="nama">Nama Siswa (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs"
          />
        </div>
      </div>

      {/* Main Table */}
      {filteredList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Belum Ada Data Rekap Nilai Siswa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
            Setiap kali siswa menyelesaikan simulasi pada menu <strong>Simulasi CBT Siswa</strong>, nilainya akan otomatis tersimpan rapi di halaman ini.
          </p>
          <button
            onClick={handleSeedSample}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Muat 10 Contoh Data Siswa untuk Menguji</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3.5 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-3 py-3">Kelas</th>
                  <th className="px-3 py-3">NIS</th>
                  <th className="px-4 py-3 text-center">Skor Akhir</th>
                  <th className="px-4 py-3">Kategori Capaian</th>
                  <th className="px-3 py-3 text-center">Benar / Salah</th>
                  <th className="px-3 py-3 text-center">Literasi</th>
                  <th className="px-3 py-3 text-center">Numerasi</th>
                  <th className="px-3 py-3 text-center">Durasi</th>
                  <th className="px-4 py-3">Waktu Selesai</th>
                  <th className="px-3 py-3 text-center print:hidden w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredList.map((item, idx) => {
                  const badgeColor =
                    item.skor >= 85
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : item.skor >= 70
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : item.skor >= 55
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';

                  const menit = Math.floor(item.durasiDetik / 60);
                  const detik = item.durasiDetik % 60;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-500 dark:text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {item.identitas.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                          {item.paketJudul}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {item.identitas.kelas}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {item.identitas.nis || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block font-extrabold text-sm px-2.5 py-0.5 rounded-lg border ${badgeColor}`}
                        >
                          {item.skor}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-medium">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.benar}
                        </span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          {item.salah}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        {item.literasiTotal && item.literasiTotal > 0
                          ? `${Math.round(((item.literasiBenar || 0) / item.literasiTotal) * 100)}%`
                          : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        {item.numerasiTotal && item.numerasiTotal > 0
                          ? `${Math.round(((item.numerasiBenar || 0) / item.numerasiTotal) * 100)}%`
                          : '-'}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                        {menit}m {detik}s
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.tanggalStr}
                      </td>
                      <td className="px-3 py-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          {item.salah > 0 && soalList.length > 0 && (
                            <button
                              onClick={() => {
                                const wrongCount = Math.min(item.salah, soalList.length);
                                const subset = soalList.slice(0, wrongCount);
                                const mockAns: Record<string, string> = {};
                                subset.forEach((s) => {
                                  mockAns[s.id] = 'X'; // mock answer to trigger incorrect
                                });
                                const rep = generatePaketRemedial(subset, mockAns, undefined, item.identitas);
                                if (rep) {
                                  setRemedialModalReport(rep);
                                } else {
                                  showToast('Tidak ada butir salah terdeteksi.');
                                }
                              }}
                              className="p-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-md transition-colors cursor-pointer"
                              title={`Paket Remedial (${item.salah} butir salah)`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOne(item.id, item.identitas.nama)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Hapus rekaman ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Table Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div>
              Menampilkan <strong>{filteredList.length}</strong> dari <strong>{rekapList.length}</strong> total data siswa.
            </div>
            <div className="flex items-center gap-3">
              <span>Target Kelulusan Standar: <strong>70.0</strong></span>
              <span>•</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Nilai Rata-rata: {stats.avg}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Signature Section for Print Leger */}
      <div className="hidden print:grid grid-cols-2 pt-10 text-xs text-slate-800 gap-16">
        <div className="text-center space-y-16">
          <p>Mengetahui,<br />Kepala Satuan Pendidikan</p>
          <div className="border-b border-slate-900 mx-auto w-48 font-bold">
            (.......................................................)
          </div>
          <p className="text-[10px] text-slate-500">NIP. ...................................................</p>
        </div>

        <div className="text-center space-y-16">
          <p>Guru Kelas / Pengampu Asesmen</p>
          <div className="border-b border-slate-900 mx-auto w-48 font-bold">
            (.......................................................)
          </div>
          <p className="text-[10px] text-slate-500">NIP. ...................................................</p>
        </div>
      </div>

      {/* Modal Paket Remedial Terpilih */}
      {remedialModalReport && (
        <RemedialPackageModal
          report={remedialModalReport}
          isOpen={true}
          onClose={() => setRemedialModalReport(null)}
          onSetAsActivePacket={(paket) => {
            if (onSetAsActivePacket) {
              onSetAsActivePacket(paket);
            }
            setRemedialModalReport(null);
          }}
          onStartExamNow={(paket) => {
            if (onStartExamNow) {
              onStartExamNow(paket);
            } else if (onSetAsActivePacket) {
              onSetAsActivePacket(paket);
            }
            setRemedialModalReport(null);
          }}
        />
      )}
    </div>
  );
};
