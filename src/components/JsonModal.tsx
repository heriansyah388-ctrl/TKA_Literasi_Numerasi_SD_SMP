import React, { useState } from 'react';
import { PaketSoalResponse } from '../types';
import { Download, Copy, Check, X, FileCode, Upload } from 'lucide-react';

interface JsonModalProps {
  data: PaketSoalResponse;
  isOpen: boolean;
  onClose: () => void;
  onImportJson?: (imported: PaketSoalResponse) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  data,
  isOpen,
  onClose,
  onImportJson,
}) => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paket-soal-${data.metadata?.domain?.toLowerCase() || 'asesmen'}-${data.metadata?.kelas?.replace(/\s+/g, '-').toLowerCase() || 'akm'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.soal) && parsed.metadata) {
          if (onImportJson) {
            onImportJson(parsed);
            onClose();
          }
        } else {
          setImportError('Format JSON tidak valid. Wajib memiliki properti "metadata" dan array "soal".');
        }
      } catch (err: any) {
        setImportError('Gagal membaca file JSON: ' + (err?.message || 'Sintaks tidak valid.'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Format Data JSON Standar Web</h3>
              <p className="text-xs text-slate-500">
                Sesuai spesifikasi Bagian J (Metadata &amp; Skema Soal Terstruktur)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Import Notification if error */}
        {importError && (
          <div className="mx-4 mt-3 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
            {importError}
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed rounded-b-xl sm:rounded-none">
          <pre>{jsonString}</pre>
        </div>

        {/* Modal Footer with Import Option */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label
              htmlFor="json-file-input"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Impor Paket Soal JSON</span>
            </label>
            <input
              id="json-file-input"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-[11px] text-slate-500">
              Unggah file format .json untuk ditinjau langsung di aplikasi.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
