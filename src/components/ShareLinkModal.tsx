import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Smartphone,
  Monitor,
  MessageCircle,
  QrCode,
  Sparkles,
  Play,
  Layers,
} from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  judulPaket?: string;
  totalSoal?: number;
  waktuMenit?: number;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  judulPaket = 'Simulasi Asesmen Akademik Siswa',
  totalSoal = 10,
  waktuMenit = 20,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'cbt' | 'cat'>('cbt');
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Base URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://ais-pre-7loxfa6wvn4qubhi5scxvg-226613123890.asia-southeast1.run.app';

  const cbtUrl = `${baseUrl}?tab=cbt`;
  const catUrl = `${baseUrl}?tab=cat`;

  const activeUrl = selectedMode === 'cbt' ? cbtUrl : catUrl;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // WhatsApp Message Template
  const waText = `*SIMULASI UJIAN ASESMEN SISWA*\n` +
    `Judul: ${judulPaket}\n` +
    `Jumlah: ${totalSoal} Soal | Waktu: ${waktuMenit} Menit\n\n` +
    `Anak-anak, silakan klik tautan di bawah ini untuk mengerjakan simulasi CBT secara langsung dari HP/Laptop tanpa perlu login:\n` +
    `${activeUrl}\n\n` +
    `Selamat mengerjakan dan junjung tinggi kejujuran! ✨`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(activeUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bagikan Tautan Simulasi Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Siswa dapat langsung mengerjakan di HP, tablet, atau laptop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Pilihan Mode Simulasi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Mode Simulasi Ujian
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode('cbt')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedMode === 'cbt'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                    <span>Mode CBT Standar</span>
                  </div>
                  {selectedMode === 'cbt' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Timer hitung mundur, navigasi butir soal, &amp; ragu-ragu
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('cat')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedMode === 'cat'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mode CAT Adaptif</span>
                  </div>
                  {selectedMode === 'cat' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Soal multi-tahap dinamis mengikuti kemampuan siswa (AN)
                </p>
              </button>
            </div>
          </div>

          {/* Kotak Tautan URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Tautan Langsung ({selectedMode === 'cbt' ? 'CBT Standar' : 'CAT Adaptif'}):
              </label>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Siap dikirimkan
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                id="btn-copy-share-url"
                onClick={() => handleCopy(activeUrl, 'url')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                  copiedType === 'url'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copiedType === 'url' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Buka pratinjau di tab baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Opsi Kirim WhatsApp & Tampilkan QR Code */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Format Pesan WhatsApp / Google Classroom</span>
              </div>
              <button
                id="btn-copy-wa-text"
                onClick={() => handleCopy(waText, 'wa')}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                {copiedType === 'wa' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Pesan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Pesan</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 font-mono whitespace-pre-line leading-relaxed">
              {waText}
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>{showQr ? 'Sembunyikan QR Code' : 'Tampilkan QR Code untuk Proyektor / Layar'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Kirim via WhatsApp</span>
              </a>
            </div>

            {/* Tampilan QR Code */}
            {showQr && (
              <div className="pt-3 border-t border-slate-200 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center animate-fadeIn">
                <img
                  src={qrImageUrl}
                  alt="QR Code Simulasi Siswa"
                  className="w-44 h-44 rounded-lg border border-slate-200 p-1 bg-white mb-2 shadow-xs"
                />
                <p className="text-xs font-bold text-slate-800">
                  Scan QR Code Menggunakan Kamera HP / Tablet
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  Bagus ditayangkan di layar proyektor kelas agar seluruh siswa dapat membuka soal secara bersamaan.
                </p>
              </div>
            )}
          </div>

          {/* Info Panduan Praktis */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-indigo-950 font-semibold mb-0.5">Responsif di Smartphone</strong>
                <span className="text-[11px] text-slate-500">
                  Siswa dapat membuka langsung dari browser Chrome, Safari, atau browser bawaan HP.
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2">
              <Monitor className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-blue-950 font-semibold mb-0.5">Tanpa Perlu Login</strong>
                <span className="text-[11px] text-slate-500">
                  Siswa langsung masuk ke sesi pengerjaan ujian tanpa hambatan registrasi atau akun.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tautan selalu aktif selama aplikasi berjalan di AI Studio</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
