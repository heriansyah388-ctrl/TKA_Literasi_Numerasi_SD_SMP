import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { SoalCard } from './components/SoalCard';
import { CbtExamView } from './components/CbtExamView';
import { AdaptiveCatView } from './components/AdaptiveCatView';
import { CompetencyReportView } from './components/CompetencyReportView';
import { PrintableView } from './components/PrintableView';
import { JsonModal } from './components/JsonModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { BankKurasiCatalog } from './components/BankKurasiCatalog';
import { DEFAULT_SOAL_BANK } from './data/defaultBank';
import {
  PaketSoalResponse,
  SoalItem,
  JawabanSiswaMap,
  AnalisisHasil,
  SubdomainScore,
  KategoriKemampuan,
  Jenjang,
  Kelas,
  Domain,
  BentukSoal,
  TingkatKesulitan,
  LevelKognitif,
  Konteks,
  Bahasa,
  ModeGenerator,
  EngineSumber,
} from './types';
import { checkJawaban } from './utils/soalFormatHelper';
import { exportToWordDoc } from './utils/exportDocHelper';
import {
  Play,
  BookOpen,
  Calculator,
  Search,
  Filter,
  Sparkles,
  Info,
  CheckCircle,
  PlusCircle,
  HelpCircle,
  RotateCcw,
  FileText,
  Share2,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi'
  >(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('tab') || params.get('mode');
        if (mode === 'cbt' || mode === 'cat' || mode === 'soal_list' || mode === 'bank_kurasi' || mode === 'generator') {
          return mode as 'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi';
        }
      }
    } catch {
      // fallback
    }
    return 'generator';
  });
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [bankKurasiCount, setBankKurasiCount] = useState<number>(DEFAULT_SOAL_BANK.length);
  const [isLoading, setIsLoading] = useState(false);
  const [printMode, setPrintMode] = useState<'siswa' | 'guru' | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Default initial packet from high-quality curated bank
  const [currentPaket, setCurrentPaket] = useState<PaketSoalResponse>(() => {
    return {
      metadata: {
        jenjang: 'SD',
        kelas: 'SD 5',
        domain: 'Literasi dan Numerasi',
        jumlah_soal: DEFAULT_SOAL_BANK.length,
        tingkat_kesulitan: 'Campuran',
        bentuk_soal: 'Pilihan Ganda',
        level_kognitif: 'Campuran',
        konteks: 'Kehidupan sehari-hari',
        bahasa: 'Sesuai tingkat perkembangan siswa',
        mode: 'ASESMEN',
        judul: 'Paket Asesmen Literasi & Numerasi Terkalibrasi',
        waktu_menit: 25,
      },
      soal: DEFAULT_SOAL_BANK,
    };
  });

  // Test state
  const [jawabanSiswa, setJawabanSiswa] = useState<JawabanSiswaMap>({});
  const [analisisHasil, setAnalisisHasil] = useState<AnalisisHasil | null>(null);

  // Filter & Search in Soal List
  const [domainFilter, setDomainFilter] = useState<'All' | 'Literasi' | 'Numerasi'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Mudah' | 'Sedang' | 'Sulit'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Check health & key
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
        if (data && typeof data.bankKurasiCount === 'number') {
          setBankKurasiCount(data.bankKurasiCount);
        }
      })
      .catch(() => setHasGeminiKey(false));
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Client-side fallback generator
  const generateClientFallback = (params: any) => {
    const {
      jenjang = 'SD',
      kelas = 'SD 5',
      domain = 'Literasi dan Numerasi',
      jumlah_soal = 5,
      bentuk_soal = 'Pilihan Ganda',
      tingkat_kesulitan = 'Campuran',
      level_kognitif = 'Campuran',
      konteks = 'Kehidupan sehari-hari',
      bahasa = 'Sesuai tingkat perkembangan siswa',
      mode = 'ASESMEN',
    } = params;

    const count = Math.min(Math.max(Number(jumlah_soal) || 5, 1), 50);
    const filtered = DEFAULT_SOAL_BANK.filter((item) => {
      if (domain === 'Literasi' && item.domain !== 'Literasi') return false;
      if (domain === 'Numerasi' && item.domain !== 'Numerasi') return false;
      if (jenjang && item.jenjang !== jenjang) return false;
      return true;
    });

    const pool = filtered.length > 0 ? filtered : DEFAULT_SOAL_BANK;
    const picked: SoalItem[] = [];

    for (let i = 0; i < count; i++) {
      const base = pool[i % pool.length];
      picked.push({
        ...base,
        id: `${base.id}-${i + 1}`,
        kelas: kelas as any,
        jenjang: jenjang as any,
      });
    }

    const fallbackResult: PaketSoalResponse = {
      metadata: {
        jenjang: jenjang as any,
        kelas: kelas as any,
        domain: domain as any,
        jumlah_soal: picked.length,
        tingkat_kesulitan: tingkat_kesulitan as any,
        bentuk_soal: bentuk_soal as any,
        level_kognitif: level_kognitif as any,
        konteks: konteks as any,
        bahasa: bahasa as any,
        mode: mode as any,
        judul: `Paket Asesmen ${domain} - ${kelas} (${mode})`,
        waktu_menit: Math.round(picked.length * 2.5),
      },
      soal: picked,
    };

    setCurrentPaket(fallbackResult);
    setActiveTab('soal_list');
    showToast(`Berhasil memuat ${picked.length} butir soal terkalibrasi kurikulum!`);
  };

  // Generate Questions
  const handleGenerate = async (params: {
    jenjang: Jenjang;
    kelas: Kelas;
    domain: Domain;
    jumlah_soal: number;
    bentuk_soal: BentukSoal;
    tingkat_kesulitan: TingkatKesulitan;
    level_kognitif: LevelKognitif;
    konteks: Konteks;
    bahasa: Bahasa;
    mode: ModeGenerator;
    topikKhusus?: string;
    sumber?: EngineSumber;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data) {
          setCurrentPaket(json.data);
          setActiveTab('soal_list');
          showToast(
            json.source === 'gemini'
              ? `Berhasil membuat ${json.data.soal.length} soal baru dengan Gemini AI!`
              : `Berhasil memuat ${json.data.soal.length} butir soal terkalibrasi kurikulum!`
          );
          return;
        }
      }
      generateClientFallback(params);
    } catch (e: any) {
      console.warn('Network/API fallback to client generator:', e);
      generateClientFallback(params);
    } finally {
      setIsLoading(false);
    }
  };

  // Process CBT Exam Submission
  const handleSubmitExam = async (jawaban: JawabanSiswaMap, durasiDetik: number) => {
    setJawabanSiswa(jawaban);
    const soalItems = currentPaket.soal;

    let benar = 0;
    let salah = 0;

    // Subdomain counters
    const literasiSubMap: Record<string, { total: number; benar: number }> = {
      'Menemukan informasi': { total: 0, benar: 0 },
      'Memahami informasi': { total: 0, benar: 0 },
      'Menganalisis informasi': { total: 0, benar: 0 },
      'Mengevaluasi informasi': { total: 0, benar: 0 },
      'Merefleksikan informasi': { total: 0, benar: 0 },
    };

    const numerasiSubMap: Record<string, { total: number; benar: number }> = {
      'Bilangan': { total: 0, benar: 0 },
      'Aljabar': { total: 0, benar: 0 },
      'Geometri dan pengukuran': { total: 0, benar: 0 },
      'Data dan ketidakpastian': { total: 0, benar: 0 },
      'Pemecahan masalah': { total: 0, benar: 0 },
    };

    soalItems.forEach((s) => {
      const { isCorrect } = checkJawaban(s, jawaban[s.id]);
      if (isCorrect) benar++;
      else salah++;

      if (s.domain === 'Literasi') {
        if (!literasiSubMap[s.subdomain]) {
          literasiSubMap[s.subdomain] = { total: 0, benar: 0 };
        }
        literasiSubMap[s.subdomain].total++;
        if (isCorrect) literasiSubMap[s.subdomain].benar++;
      } else {
        if (!numerasiSubMap[s.subdomain]) {
          numerasiSubMap[s.subdomain] = { total: 0, benar: 0 };
        }
        numerasiSubMap[s.subdomain].total++;
        if (isCorrect) numerasiSubMap[s.subdomain].benar++;
      }
    });

    const total = soalItems.length || 1;
    const skor = Math.round((benar / total) * 100);

    const getKategori = (pct: number): KategoriKemampuan => {
      if (pct >= 90) return 'Sangat Baik';
      if (pct >= 80) return 'Sudah Menguasai';
      if (pct >= 70) return 'Sudah Berkembang';
      if (pct >= 50) return 'Sedang Berkembang';
      return 'Perlu Penguatan';
    };

    const literasiScores: SubdomainScore[] = Object.entries(literasiSubMap)
      .filter(([_, data]) => data.total > 0)
      .map(([nama, data]) => {
        const pct = Math.round((data.benar / data.total) * 100);
        return {
          nama,
          domain: 'Literasi',
          totalSoal: data.total,
          benar: data.benar,
          persentase: pct,
          kategori: getKategori(pct),
        };
      });

    const numerasiScores: SubdomainScore[] = Object.entries(numerasiSubMap)
      .filter(([_, data]) => data.total > 0)
      .map(([nama, data]) => {
        const pct = Math.round((data.benar / data.total) * 100);
        return {
          nama,
          domain: 'Numerasi',
          totalSoal: data.total,
          benar: data.benar,
          persentase: pct,
          kategori: getKategori(pct),
        };
      });

    // Request deep pedagogical analysis from backend
    try {
      const res = await fetch('/api/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soalItems,
          jawabanSiswa: jawaban,
          durasiDetik,
          jenjang: currentPaket.metadata.jenjang,
          kelas: currentPaket.metadata.kelas,
        }),
      });

      const resData = await res.json();
      const aiFeedback = resData?.aiFeedback || {};

      const finalAnalisis: AnalisisHasil = {
        totalSoal: total,
        benar,
        salah,
        skor,
        persentase: skor,
        kategori: getKategori(skor),
        durasiDetik,
        literasiScores,
        numerasiScores,
        kompetensiDikuasai: aiFeedback.kompetensiDikuasai || [
          'Memahami teks narasi dan menemukan informasi tersurat secara cermat.',
        ],
        kompetensiPerluPenguatan: aiFeedback.kompetensiPerluPenguatan || [
          'Penalaran soal multi-langkah dan analisis kritis perbedaan fakta vs opini.',
        ],
        analisisKesalahan: aiFeedback.analisisKesalahan || [
          'Kecenderungan memilih distraktor yang mirip dengan kata kunci teks tanpa menelaah makna hubungan kalimat.',
        ],
        rekomendasiMateri: aiFeedback.rekomendasiMateri || [
          'Latihan membaca tabel data infografis secara runtut.',
          'Penerapan rumus keliling dan luas pada konteks lingkungan sekolah.',
        ],
        rekomendasiLatihanBerikutnya:
          aiFeedback.rekomendasiLatihanBerikutnya ||
          'Tingkatkan latihan soal pemecahan masalah (Problem Solving) kontekstual.',
        tingkatKesulitanBerikutnya: aiFeedback.tingkatKesulitanBerikutnya || (skor >= 75 ? 'Sulit' : 'Sedang'),
      };

      setAnalisisHasil(finalAnalisis);
      setActiveTab('laporan');
    } catch (e) {
      console.error('Analysis failed:', e);
      // Fallback
      const fallbackAnalisis: AnalisisHasil = {
        totalSoal: total,
        benar,
        salah,
        skor,
        persentase: skor,
        kategori: getKategori(skor),
        durasiDetik,
        literasiScores,
        numerasiScores,
        kompetensiDikuasai: ['Membaca teks stimulus dan menyelesaikan soal pemahaman dasar.'],
        kompetensiPerluPenguatan: ['Pemeriksaan kembali langkah perhitungan dan evaluasi bukti teks.'],
        analisisKesalahan: ['Kurang teliti memperhatikan satuan dan kata kunci pertanyaan.'],
        rekomendasiMateri: ['Penguatan konsep bilangan pecahan dan telaah ide pokok paragraf.'],
        rekomendasiLatihanBerikutnya: 'Latihan soal berjenjang dari sedang ke sulit.',
        tingkatKesulitanBerikutnya: skor >= 80 ? 'Sulit' : 'Sedang',
      };
      setAnalisisHasil(fallbackAnalisis);
      setActiveTab('laporan');
    }
  };

  const handleFinishCat = (hasil: AnalisisHasil) => {
    setAnalisisHasil(hasil);
    setActiveTab('laporan');
  };

  // Filtered soal list for Tab 2
  const filteredSoal = currentPaket.soal.filter((s) => {
    if (domainFilter !== 'All' && s.domain !== domainFilter) return false;
    if (difficultyFilter !== 'All' && s.kesulitan !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        s.stimulus.toLowerCase().includes(q) ||
        s.pertanyaan.toLowerCase().includes(q) ||
        s.subdomain.toLowerCase().includes(q) ||
        s.kompetensi.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-slideUp">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSoal={currentPaket.soal.length}
        totalBankKurasi={bankKurasiCount}
        onPrintStudent={() => setPrintMode('siswa')}
        onPrintTeacher={() => setPrintMode('guru')}
        onExportDocStudent={() => {
          exportToWordDoc(currentPaket.metadata, currentPaket.soal, 'siswa');
          showToast('Naskah Soal Siswa berhasil diunduh dalam format Word (.doc)!');
        }}
        onExportDocTeacher={() => {
          exportToWordDoc(currentPaket.metadata, currentPaket.soal, 'guru');
          showToast('Naskah Pegangan Guru & Kunci berhasil diunduh dalam format Word (.doc)!');
        }}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenJson={() => setIsJsonModalOpen(true)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Tab Content */}
      <main className="py-6 sm:py-8">
        {/* TAB 1: Generator Form */}
        {activeTab === 'generator' && (
          <div className="px-4">
            <GeneratorForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onOpenBankCatalog={() => setActiveTab('bank_kurasi')}
            />
          </div>
        )}

        {/* TAB 2: Soal List & Review */}
        {activeTab === 'soal_list' && (
          <div className="max-w-5xl mx-auto px-4">
            {/* Packet Info Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  <span>{currentPaket.metadata?.jenjang}</span>
                  <span>•</span>
                  <span>{currentPaket.metadata?.kelas}</span>
                  <span>•</span>
                  <span>Mode: {currentPaket.metadata?.mode}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {currentPaket.metadata?.judul || 'Daftar Butir Soal Asesmen Terpilih'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Total {currentPaket.soal.length} butir soal • Alokasi waktu standar: ~
                  {Math.round(currentPaket.metadata?.waktu_menit || currentPaket.soal.length * 2.5)} menit
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-share-link-banner"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Dapatkan link langsung ujian CBT untuk dibagikan ke siswa"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Bagikan Link Siswa</span>
                </button>

                <button
                  id="btn-export-doc-siswa-banner"
                  onClick={() => {
                    exportToWordDoc(currentPaket.metadata, currentPaket.soal, 'siswa');
                    showToast('Naskah Siswa berhasil diunduh dalam format Word (.doc)!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Simpan naskah soal ujian siswa ke format Microsoft Word (.doc)"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Simpan DOC Siswa</span>
                </button>

                <button
                  id="btn-export-doc-guru-banner"
                  onClick={() => {
                    exportToWordDoc(currentPaket.metadata, currentPaket.soal, 'guru');
                    showToast('Naskah Pegangan Guru berhasil diunduh dalam format Word (.doc)!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Simpan dokumen pegangan guru beserta pembahasan dan rubrik ke Word (.doc)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Simpan DOC Guru</span>
                </button>

                <button
                  id="btn-start-cbt-from-list"
                  onClick={() => setActiveTab('cbt')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mulai CBT</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </div>

                {/* Domain filter */}
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="All">Semua Domain</option>
                  <option value="Literasi">Literasi Saja</option>
                  <option value="Numerasi">Numerasi Saja</option>
                </select>

                {/* Difficulty filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="All">Semua Kesulitan</option>
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari teks stimulus, pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* List of Questions */}
            {filteredSoal.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-500 dark:text-slate-400">
                Tidak ada butir soal yang sesuai dengan kriteria filter saat ini.
              </div>
            ) : (
              <div>
                {filteredSoal.map((soal, idx) => (
                  <SoalCard key={soal.id} soal={soal} nomor={idx + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Bank Kurasi Standar */}
        {activeTab === 'bank_kurasi' && (
          <BankKurasiCatalog
            onLoadAsActivePacket={(pkt) => {
              setCurrentPaket(pkt);
              setActiveTab('soal_list');
              showToast(`Berhasil memuat ${pkt.soal.length} butir soal dari Bank Kurasi Standar ke Paket Aktif!`);
            }}
          />
        )}

        {/* TAB 3: CBT Exam Simulation */}
        {activeTab === 'cbt' && (
          <CbtExamView
            soalList={currentPaket.soal}
            judul={currentPaket.metadata?.judul}
            waktuMenit={Math.round(currentPaket.metadata?.waktu_menit || currentPaket.soal.length * 2.5)}
            onSubmitExam={handleSubmitExam}
            onCancel={() => setActiveTab('soal_list')}
          />
        )}

        {/* TAB 4: Adaptive Testing (CAT) */}
        {activeTab === 'cat' && (
          <AdaptiveCatView
            jenjang={currentPaket.metadata?.jenjang || 'SD'}
            kelas={currentPaket.metadata?.kelas || 'SD 5'}
            domain={currentPaket.metadata?.domain || 'Literasi dan Numerasi'}
            onFinishCat={handleFinishCat}
          />
        )}

        {/* TAB 5: Competency Report & Recommendations */}
        {activeTab === 'laporan' && (
          <div>
            {analisisHasil ? (
              <CompetencyReportView
                analisis={analisisHasil}
                soalList={currentPaket.soal}
                jawabanSiswa={jawabanSiswa}
                onUlangiTes={() => setActiveTab('cbt')}
                onPrint={() => window.print()}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xs">
                <Info className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Belum Ada Hasil Ujian</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Selesaikan simulasi CBT atau tes adaptif untuk melihat laporan profil kompetensi dan
                  rekomendasi belajar siswa.
                </p>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Ujian Siswa Sekarang</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Identitas Pengembang */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 print:hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">TKA Literasi &amp; Numerasi SD &amp; SMP</span>
            <span>•</span>
            <span>Kurikulum Nasional</span>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-slate-500 dark:text-slate-400">Pengembang: </span>
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">Heriansyah., S.Si., S.Pd., M.Pd</strong>{' '}
            <span className="text-indigo-700 dark:text-indigo-400 font-medium">(Pengawas Satuan Pendidikan Disdikbud Sidrap)</span>
          </div>
        </div>
      </footer>

      {/* Printable Sheet Modal */}
      {printMode && (
        <PrintableView
          mode={printMode}
          metadata={currentPaket.metadata}
          soalList={currentPaket.soal}
          onClose={() => setPrintMode(null)}
        />
      )}

      {/* JSON Viewer & Importer Modal */}
      <JsonModal
        data={currentPaket}
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onImportJson={(imported) => {
          setCurrentPaket(imported);
          setActiveTab('soal_list');
          showToast(`Berhasil mengimpor ${imported.soal.length} butir soal dari file JSON.`);
        }}
      />

      {/* Share Direct Link Modal for Students */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        judulPaket={currentPaket.metadata?.judul}
        totalSoal={currentPaket.soal.length}
        waktuMenit={currentPaket.metadata?.waktu_menit || 25}
      />
    </div>
  );
}
