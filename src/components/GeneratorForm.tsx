import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  Calculator,
  Sliders,
  Compass,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
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
} from '../types';

interface GeneratorFormProps {
  onGenerate: (params: {
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
  }) => Promise<void>;
  isLoading: boolean;
  onOpenBankCatalog?: () => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  isLoading,
  onOpenBankCatalog,
}) => {
  const [engine, setEngine] = useState<EngineSumber>('gemini');
  const [jenjang, setJenjang] = useState<Jenjang>('SD');
  const [kelas, setKelas] = useState<Kelas>('SD 5');
  const [domain, setDomain] = useState<Domain>('Literasi dan Numerasi');
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [customJumlah, setCustomJumlah] = useState<string>('');
  const [bentukSoal, setBentukSoal] = useState<BentukSoal>('Pilihan Ganda');
  const [tingkatKesulitan, setTingkatKesulitan] = useState<TingkatKesulitan>('Campuran');
  const [levelKognitif, setLevelKognitif] = useState<LevelKognitif>('Campuran');
  const [konteks, setKonteks] = useState<Konteks>('Kehidupan sehari-hari');
  const [bahasa, setBahasa] = useState<Bahasa>('Sesuai tingkat perkembangan siswa');
  const [mode, setMode] = useState<ModeGenerator>('ASESMEN');
  const [topikKhusus, setTopikKhusus] = useState<string>('');

  // Handle jenjang change to update default kelas
  const handleJenjangChange = (newJenjang: Jenjang) => {
    setJenjang(newJenjang);
    if (newJenjang === 'SD') {
      setKelas('SD 5');
    } else {
      setKelas('SMP 8');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalJumlah = customJumlah ? Math.max(1, Math.min(50, parseInt(customJumlah) || 5)) : jumlahSoal;

    await onGenerate({
      jenjang,
      kelas,
      domain,
      jumlah_soal: finalJumlah,
      bentuk_soal: bentukSoal,
      tingkat_kesulitan: tingkatKesulitan,
      level_kognitif: levelKognitif,
      konteks,
      bahasa,
      mode,
      topikKhusus: topikKhusus.trim() || undefined,
      sumber: engine,
    });
  };

  const sdKelasOptions: Kelas[] = ['SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6'];
  const smpKelasOptions: Kelas[] = ['SMP 7', 'SMP 8', 'SMP 9'];

  const modeDescriptions: Record<ModeGenerator, { label: string; desc: string }> = {
    LATIHAN: {
      label: 'Mode 1: Latihan Bertahap',
      desc: 'Disusun bertahap dari tingkat mudah, sedang, hingga sulit untuk membangun kepercayaan diri siswa.',
    },
    ASESMEN: {
      label: 'Mode 2: Asesmen Seimbang',
      desc: 'Komposisi proporsional seluruh subdomain kompetensi sesuai standar evaluasi belajar.',
    },
    DIAGNOSTIK: {
      label: 'Mode 3: Diagnostik Kompetensi',
      desc: 'Dirancang khusus mendeteksi miskonsepsi dan kelemahan spesifik siswa untuk remedial terarah.',
    },
    HOTS: {
      label: 'Mode 4: Penalaran Tinggi (HOTS)',
      desc: 'Fokus pada level menganalisis, mengevaluasi, dan pemecahan masalah kontekstual multi-tahap.',
    },
    SIMULASI: {
      label: 'Mode 5: Simulasi TKA / Ujian Resmi',
      desc: 'Paket komprehensif berstandar Tes Kemampuan Akademik (TKA) dengan alokasi waktu dan stimulus terstruktur.',
    },
    ADAPTIF: {
      label: 'Mode 6: Asesmen Adaptif (CAT)',
      desc: 'Menghasilkan butir uji yang siap dieksekusi dengan Computerized Adaptive Testing secara dinamis.',
    },
    REMEDIAL: {
      label: 'Mode 7: Remedial Terarah',
      desc: 'Paket tindak lanjut khusus menuntaskan butir soal yang belum dikuasai siswa.',
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 max-w-5xl mx-auto transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Sliders className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Panel Generator Soal</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Konfigurasi Asesmen Akademik Siswa
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pilih jenjang, domain literasi/numerasi, bentuk soal, dan mode pedagogis. Sistem AI akan
          memproduksi butir soal valid sesuai 15 prinsip asesmen berkualitas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sumber / Mesin Pembuat Soal */}
        <div className="bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Sumber &amp; Mesin Pembuat Soal (Engine)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih apakah ingin menghasilkan variasi soal baru dengan AI atau memuat soal kurasi terstandar.
              </span>
            </div>

            {onOpenBankCatalog && (
              <button
                type="button"
                id="btn-open-catalog-from-form"
                onClick={onOpenBankCatalog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Katalog Bank Kurasi (Terkalibrasi)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opsi 1: Gemini AI */}
            <div
              onClick={() => setEngine('gemini')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                engine === 'gemini'
                  ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${engine === 'gemini' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Gemini 3.8 Flash AI</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Aktif • Generasi Baru</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="engine"
                  checked={engine === 'gemini'}
                  onChange={() => setEngine('gemini')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Membuat butir soal baru, segar, dan unik secara cerdas sesuai kurikulum nasional, kisi-kisi TKA, dan topik spesifik yang Anda minta.
              </p>
            </div>

            {/* Opsi 2: Bank Kurasi Standar */}
            <div
              onClick={() => setEngine('bank_kurasi')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                engine === 'bank_kurasi'
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 shadow-sm ring-1 ring-indigo-600/30'
                  : 'bg-white/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${engine === 'bank_kurasi' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Bank Kurasi Standar</h4>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Aktif • 100% Terkalibrasi</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="engine"
                  checked={engine === 'bank_kurasi'}
                  onChange={() => setEngine('bank_kurasi')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Memuat langsung butir soal baku yang telah divalidasi pakar kurikulum. 100% akurat, respons instan tanpa kuota AI.
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: Jenjang & Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Jenjang */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              1. Jenjang Pendidikan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-jenjang-sd"
                onClick={() => handleJenjangChange('SD')}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium border text-center transition-all cursor-pointer ${
                  jenjang === 'SD'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Sekolah Dasar (SD)
              </button>
              <button
                type="button"
                id="btn-jenjang-smp"
                onClick={() => handleJenjangChange('SMP')}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium border text-center transition-all cursor-pointer ${
                  jenjang === 'SMP'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Sekolah Menengah Pertama (SMP)
              </button>
            </div>
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              2. Tingkat Kelas ({jenjang})
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(jenjang === 'SD' ? sdKelasOptions : smpKelasOptions).map((k) => (
                <button
                  type="button"
                  key={k}
                  id={`btn-kelas-${k.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setKelas(k)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    kelas === k
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
              {jenjang === 'SD'
                ? 'SD 1-3: kalimat pendek konkret; SD 4-6: pemahaman teks terstruktur.'
                : 'SMP 7-9: penalaran multi-langkah, analisis data, teks argumentatif.'}
            </p>
          </div>
        </div>

        {/* Row 2: Domain Kompetensi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            3. Domain Kompetensi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              id="btn-domain-literasi"
              onClick={() => setDomain('Literasi')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                domain === 'Literasi'
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-600'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">LITERASI</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed mt-0.5">
                  Menemukan, memahami, menganalisis, mengevaluasi, &amp; merefleksikan ragam teks.
                </span>
              </div>
            </button>

            <button
              type="button"
              id="btn-domain-numerasi"
              onClick={() => setDomain('Numerasi')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                domain === 'Numerasi'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-600'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">NUMERASI</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed mt-0.5">
                  Bilangan, aljabar, geometri &amp; pengukuran, data, dan pemecahan masalah kontekstual.
                </span>
              </div>
            </button>

            <button
              type="button"
              id="btn-domain-campuran"
              onClick={() => setDomain('Literasi dan Numerasi')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                domain === 'Literasi dan Numerasi'
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">LITERASI &amp; NUMERASI</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed mt-0.5">
                  Paket gabungan terintegrasi untuk asesmen komprehensif.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Row 3: Mode Generator */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            4. Mode Generator Asesmen
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(['LATIHAN', 'ASESMEN', 'DIAGNOSTIK', 'HOTS', 'SIMULASI', 'ADAPTIF'] as ModeGenerator[]).map(
              (m) => (
                <button
                  type="button"
                  key={m}
                  id={`btn-mode-${m.toLowerCase()}`}
                  onClick={() => setMode(m)}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    mode === m
                      ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mr-1">
                {modeDescriptions[mode].label}:
              </span>
              <span>{modeDescriptions[mode].desc}</span>
            </div>
          </div>
        </div>

        {/* Row 4: Jumlah Soal, Bentuk Soal & Kesulitan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Jumlah Soal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                5. Jumlah Soal
              </label>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Maksimal 50 Soal
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
                <button
                  type="button"
                  key={num}
                  id={`btn-jumlah-${num}`}
                  onClick={() => {
                    setJumlahSoal(num);
                    setCustomJumlah('');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    jumlahSoal === num && !customJumlah
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="number"
              id="input-custom-jumlah"
              min="1"
              max="50"
              placeholder="Atau masukkan jumlah khusus (1-50 butir)"
              value={customJumlah}
              onChange={(e) => setCustomJumlah(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Pilihan 40-50 nomor ideal untuk Tryout TKA, PAT, atau Ujian Sekolah.
            </p>
          </div>

          {/* Bentuk Soal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              6. Bentuk Soal
            </label>
            <select
              id="select-bentuk-soal"
              value={bentukSoal}
              onChange={(e) => setBentukSoal(e.target.value as BentukSoal)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Pilihan Ganda">Pilihan Ganda (4 Opsi: A, B, C, D)</option>
              <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
              <option value="Benar/Salah">Benar / Salah</option>
              <option value="Menjodohkan">Menjodohkan</option>
              <option value="Isian Singkat">Isian Singkat</option>
              <option value="Uraian">Uraian / Penalaran Bebas</option>
              <option value="Campuran">Campuran Beragam Bentuk</option>
            </select>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Standar ANBK menitikberatkan pada Pilihan Ganda &amp; PG Kompleks.
            </p>
          </div>

          {/* Tingkat Kesulitan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              7. Tingkat Kesulitan
            </label>
            <select
              id="select-tingkat-kesulitan"
              value={tingkatKesulitan}
              onChange={(e) => setTingkatKesulitan(e.target.value as TingkatKesulitan)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Campuran">Campuran (Mudah 30%, Sedang 40%, Sulit 30%)</option>
              <option value="Mudah">Mudah (Pengenalan &amp; Pemahaman Dasar)</option>
              <option value="Sedang">Sedang (Penerapan &amp; Pengorganisasian)</option>
              <option value="Sulit">Sulit (Penalaran Kompleks &amp; Evaluasi)</option>
            </select>
          </div>
        </div>

        {/* Row 5: Level Kognitif, Konteks & Gaya Bahasa */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Level Kognitif */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              8. Level Kognitif
            </label>
            <select
              id="select-level-kognitif"
              value={levelKognitif}
              onChange={(e) => setLevelKognitif(e.target.value as LevelKognitif)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Campuran">Campuran Seluruh Level (L1 - L3)</option>
              <option value="Memahami">Memahami (Level 1: Menemukan &amp; Mengingat)</option>
              <option value="Menerapkan">Menerapkan (Level 2: Aplikasi &amp; Perhitungan)</option>
              <option value="Menganalisis">Menganalisis (Level 3: Relasi, Sebab-Akibat)</option>
              <option value="Mengevaluasi">Mengevaluasi (Level 3: Menilai Bukti/Metode)</option>
              <option value="Mencipta">Mencipta (Level 3: Desain Solusi Baru)</option>
            </select>
          </div>

          {/* Konteks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              9. Konteks Stimulus
            </label>
            <select
              id="select-konteks"
              value={konteks}
              onChange={(e) => setKonteks(e.target.value as Konteks)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Kehidupan sehari-hari">Kehidupan sehari-hari</option>
              <option value="Sekolah">Lingkungan Sekolah &amp; Belajar</option>
              <option value="Rumah">Keluarga &amp; Rumah Tangga</option>
              <option value="Lingkungan">Kelestarian Alam &amp; Lingkungan</option>
              <option value="Sosial">Interaksi Sosial &amp; Komunitas</option>
              <option value="Ekonomi sederhana">Ekonomi sederhana (Kantin, Pasar, Tabungan)</option>
              <option value="Sains">Sains &amp; Fenomena Alam</option>
              <option value="Teknologi">Teknologi &amp; Literasi Digital</option>
              <option value="Budaya lokal">Kearifan Budaya Lokal Nusantara</option>
              <option value="Data dan informasi">Data dan Informasi (Tabel/Grafik)</option>
              <option value="Konteks bebas">Konteks Bebas Variatif</option>
            </select>
          </div>

          {/* Gaya Bahasa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              10. Bahasa &amp; Kosakata
            </label>
            <select
              id="select-bahasa"
              value={bahasa}
              onChange={(e) => setBahasa(e.target.value as Bahasa)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="Sesuai tingkat perkembangan siswa">
                Sesuai tingkat perkembangan siswa ({jenjang})
              </option>
              <option value="Bahasa Indonesia sederhana">Bahasa Indonesia sederhana &amp; lugas</option>
              <option value="Bahasa Indonesia akademik">Bahasa Indonesia akademik &amp; formal</option>
            </select>
          </div>
        </div>

        {/* Topik Khusus (Opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            11. Fokus Topik Spesifik (Opsional)
          </label>
          <input
            type="text"
            id="input-topik-khusus"
            placeholder="Contoh: Ekosistem Hutan Mangrove, Daur Ulang Plastik, Pecahan Campuran, Tradisi Gotong Royong..."
            value={topikKhusus}
            onChange={(e) => setTopikKhusus(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 15 Prinsip Checklist Badge */}
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-semibold text-xs mb-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Kepatuhan 15 Prinsip Pedagogis &amp; 10 Internal Quality Checks</span>
          </div>
          <p className="text-[11px] text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
            Semua soal yang dihasilkan dijamin mengukur kompetensi nyata, bebas bias, distraktor
            berakar dari miskonsepsi siswa, dilengkapi stimulus kontekstual realistis, serta pembuktian
            pembahasan langkah demi langkah.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            id="btn-submit-generate"
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer w-full sm:w-auto ${
              engine === 'gemini'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {engine === 'gemini'
                    ? 'Memproses & Menelaah Butir Soal AI...'
                    : 'Memuat Butir Soal Kurasi Terstandar...'}
                </span>
              </>
            ) : (
              <>
                {engine === 'gemini' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Hasilkan Soal Baru (Gemini AI)</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Muat dari Bank Kurasi Standar (Instan)</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
