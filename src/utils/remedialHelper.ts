import { SoalItem, PaketSoalResponse, PaketSoalMetadata, JawabanSiswaMap, IdentitasSiswa } from '../types';
import { checkJawaban, formatJawabanSiswa, formatKunciJawaban } from './soalFormatHelper';
import { getFallbackTipsTrik, getDetailedTkaTips } from './tkaTipsHelper';

export interface RemedialItemDetail {
  soal: SoalItem;
  nomorAsal: number;
  jawabanSiswa: string;
  kunciJawaban: string;
  diagnosaKesalahan: string;
  panduanBelajar: string;
  tipsTrik: string;
}

export interface PaketRemedialReport {
  paketRemedial: PaketSoalResponse;
  daftarSoalSalah: RemedialItemDetail[];
  totalSoalAsal: number;
  jumlahSalah: number;
  persentasePerluRemedial: number;
  identitasSiswa?: IdentitasSiswa;
  judulAsal: string;
  domainFokus: string[];
}

/**
 * Menganalisis butir soal yang dijawab salah oleh siswa dan
 * membentuk paket tindak lanjut remedial otomatis.
 */
export function generatePaketRemedial(
  soalList: SoalItem[],
  jawabanSiswa: JawabanSiswaMap,
  metadataAsal?: PaketSoalMetadata,
  identitas?: IdentitasSiswa
): PaketRemedialReport | null {
  if (!soalList || soalList.length === 0) return null;

  const daftarSoalSalah: RemedialItemDetail[] = [];
  const remedialSoalItems: SoalItem[] = [];
  const domainSet = new Set<string>();

  soalList.forEach((soal, idx) => {
    const userAns = jawabanSiswa[soal.id];
    const evalResult = checkJawaban(soal, userAns);

    // Siswa salah jika evaluasi isCorrect === false
    if (!evalResult.isCorrect) {
      const userDisplay = formatJawabanSiswa(soal, userAns);
      const kunciDisplay = formatKunciJawaban(soal);

      // Diagnosa spesifik
      let diagnosa = soal.kesalahan_umum || '';
      if (!diagnosa) {
        if (soal.domain === 'Literasi') {
          diagnosa = `Kekeliruan menelaah detail informasi atau menarik simpulan pada subdomain ${soal.subdomain}.`;
        } else {
          diagnosa = `Kekeliruan dalam operasi atau interpretasi representasi data pada konsep ${soal.subdomain}.`;
        }
      }

      // Panduan materi pemulihan
      const panduan = `Fokuskan membaca kembali materi "${soal.subdomain}" (${soal.kompetensi || soal.indikator}). Cermati kata kunci stimulus dan periksa kembali langkah kalkulasi.`;

      const detail: RemedialItemDetail = {
        soal,
        nomorAsal: idx + 1,
        jawabanSiswa: userDisplay,
        kunciJawaban: kunciDisplay,
        diagnosaKesalahan: diagnosa,
        panduanBelajar: panduan,
        tipsTrik: getFallbackTipsTrik(soal),
      };

      daftarSoalSalah.push(detail);
      remedialSoalItems.push(soal);
      domainSet.add(soal.domain);
    }
  });

  if (daftarSoalSalah.length === 0) {
    return null; // Semua benar, tidak ada remedial
  }

  const jenjang = metadataAsal?.jenjang || remedialSoalItems[0]?.jenjang || 'SD';
  const kelas = metadataAsal?.kelas || remedialSoalItems[0]?.kelas || 'SD 5';
  const namaSiswa = identitas?.nama ? ` - ${identitas.nama}` : '';

  const remedialMetadata: PaketSoalMetadata = {
    jenjang,
    kelas,
    domain: domainSet.size > 1 ? 'Literasi dan Numerasi' : (remedialSoalItems[0]?.domain || 'Literasi'),
    jumlah_soal: remedialSoalItems.length,
    tingkat_kesulitan: 'Sedang',
    bentuk_soal: 'Campuran',
    judul: `Paket Remedial Terarah${namaSiswa} (${remedialSoalItems.length} Butir Soal Rekonseptualisasi)`,
    waktu_menit: Math.max(10, Math.round(remedialSoalItems.length * 3)),
    mode: 'REMEDIAL',
  };

  const paketRemedial: PaketSoalResponse = {
    metadata: remedialMetadata,
    soal: remedialSoalItems,
  };

  return {
    paketRemedial,
    daftarSoalSalah,
    totalSoalAsal: soalList.length,
    jumlahSalah: daftarSoalSalah.length,
    persentasePerluRemedial: Math.round((daftarSoalSalah.length / soalList.length) * 100),
    identitasSiswa: identitas,
    judulAsal: metadataAsal?.judul || 'Asesmen TKA Siswa',
    domainFokus: Array.from(domainSet),
  };
}

/**
 * Ekspor dokumen Word khusus naskah remedial & panduan intervensi guru
 */
export function exportRemedialToWordDoc(report: PaketRemedialReport) {
  const { paketRemedial, daftarSoalSalah, identitasSiswa, totalSoalAsal, jumlahSalah } = report;
  const metadata = paketRemedial.metadata;
  const safeNama = (identitasSiswa?.nama || 'Siswa').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

  let htmlBody = `
    <div style="text-align: center; border-bottom: 2.5pt solid #4338ca; padding-bottom: 12pt; margin-bottom: 16pt;">
      <h1 style="font-size: 15pt; font-weight: bold; margin: 0; text-transform: uppercase; color: #1e1b4b; font-family: 'Calibri', 'Arial', sans-serif;">
        PROGRAM TINDAK LANJUT &amp; REMEDIAL TERARAH
      </h1>
      <h2 style="font-size: 12pt; font-weight: bold; margin: 4pt 0 0 0; color: #4338ca; font-family: 'Calibri', 'Arial', sans-serif;">
        ${escapeXml(metadata.judul || 'Naskah Remedial')}
      </h2>
      <p style="font-size: 9.5pt; color: #64748b; margin: 3pt 0 0 0; font-family: 'Calibri', 'Arial', sans-serif;">
        Berdasarkan Hasil Asesmen Kemampuan Akademik (TKA) • Kurikulum Nasional 2026/2027
      </p>
      <p style="font-size: 9pt; color: #334155; margin: 3pt 0 0 0; font-family: 'Calibri', 'Arial', sans-serif;">
        Pengembang: <strong>Heriansyah., S.Si., S.Pd., M.Pd</strong> (Pengawas Satuan Pendidikan Disdikbud Sidrap)
      </p>
    </div>

    <!-- Identitas Siswa -->
    <table style="width: 100%; border: 1.5pt solid #4338ca; border-collapse: collapse; margin-bottom: 16pt; font-size: 10pt; font-family: 'Calibri', 'Arial', sans-serif;">
      <tr style="background-color: #eef2ff;">
        <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;"><strong>Nama Siswa:</strong></td>
        <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;">${escapeXml(identitasSiswa?.nama || '-')}</td>
        <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;"><strong>Kelas / NIS:</strong></td>
        <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;">${escapeXml(identitasSiswa?.kelas || '-')} / ${escapeXml(identitasSiswa?.nis || '-')}</td>
      </tr>
      <tr>
        <td style="border: 1pt solid #cbd5e1; padding: 6pt 8pt;"><strong>Status Asesmen Awal:</strong></td>
        <td style="border: 1pt solid #cbd5e1; padding: 6pt 8pt;" colspan="3">
          Memerlukan penguatan pada <strong style="color: #b91c1c;">${jumlahSalah} dari ${totalSoalAsal} butir soal</strong> (${Math.round((jumlahSalah / totalSoalAsal) * 100)}%).
        </td>
      </tr>
    </table>

    <!-- Petunjuk Remedial -->
    <div style="background-color: #f8fafc; border-left: 3pt solid #4338ca; padding: 8pt 12pt; margin-bottom: 16pt; font-size: 9.5pt; font-family: 'Calibri', 'Arial', sans-serif; color: #334155;">
      <strong>Petunjuk Intervensi Belajar Siswa:</strong>
      <ol style="margin: 3pt 0 0 0; padding-left: 16pt; line-height: 1.4;">
        <li>Cermati kembali stimulus dan diagnosa penyebab kekeliruan pada lembar review di bawah.</li>
        <li>Pelajari "Tips &amp; Trik Cepat" untuk memahami pola penarikan simpulan atau strategi hitung efektif.</li>
        <li>Kerjakan kembali butir soal tindak lanjut dengan teliti sebelum diverifikasi oleh guru pembimbing.</li>
      </ol>
    </div>
  `;

  // Render soal-soal remedial
  daftarSoalSalah.forEach((item, idx) => {
    const soal = item.soal;
    const no = idx + 1;

    htmlBody += `
      <div style="margin-bottom: 22pt; page-break-inside: avoid; font-family: 'Calibri', 'Arial', sans-serif; border: 1pt solid #e2e8f0; padding: 12pt; border-radius: 6pt; background-color: #ffffff;">
        <div style="background-color: #f1f5f9; padding: 4pt 8pt; margin-bottom: 8pt; font-size: 9.5pt; font-weight: bold; color: #0f172a; border-radius: 4pt;">
          Nomor ${no} (Asal Soal #${item.nomorAsal}) • [${escapeXml(soal.domain)} - ${escapeXml(soal.subdomain)}] • Level: ${escapeXml(soal.level_kognitif)}
        </div>

        <!-- Stimulus -->
        <div style="background-color: #f8fafc; border-left: 3pt solid #64748b; padding: 8pt 10pt; margin-bottom: 8pt; font-size: 9.5pt; line-height: 1.45; color: #1e293b;">
          ${escapeXml(soal.stimulus).replace(/\n/g, '<br/>')}
        </div>

        <!-- Pertanyaan -->
        <p style="font-size: 10.5pt; font-weight: bold; margin: 4pt 0 8pt 0; color: #0f172a; line-height: 1.35;">
          ${escapeXml(soal.pertanyaan)}
        </p>
    `;

    // Opsi Jawaban bila ada
    if (soal.opsi && Object.keys(soal.opsi).length > 0) {
      htmlBody += `<table style="width: 100%; border: none; margin-bottom: 10pt; font-size: 9.5pt;">`;
      Object.entries(soal.opsi).forEach(([optKey, optVal]) => {
        htmlBody += `
          <tr>
            <td style="width: 24pt; vertical-align: top; font-weight: bold; color: #334155; padding: 2pt 0;">${optKey}.</td>
            <td style="vertical-align: top; padding: 2pt 0; color: #1e293b;">${escapeXml(optVal)}</td>
          </tr>
        `;
      });
      htmlBody += `</table>`;
    }

    // Kotak Evaluasi dan Pembelajaran Remedial
    htmlBody += `
        <table style="width: 100%; border-collapse: collapse; margin-top: 8pt; font-size: 9pt; border: 1pt solid #cbd5e1;">
          <tr style="background-color: #fef2f2;">
            <td style="padding: 4pt 8pt; width: 30%; border: 1pt solid #fca5a5; color: #991b1b; font-weight: bold;">
              Jawaban Siswa Saat Ujian:
            </td>
            <td style="padding: 4pt 8pt; border: 1pt solid #fca5a5; color: #991b1b; font-weight: bold;">
              ${escapeXml(item.jawabanSiswa)}
            </td>
          </tr>
          <tr style="background-color: #f0fdf4;">
            <td style="padding: 4pt 8pt; border: 1pt solid #86efac; color: #166534; font-weight: bold;">
              Kunci Jawaban Sebenarnya:
            </td>
            <td style="padding: 4pt 8pt; border: 1pt solid #86efac; color: #166534; font-weight: bold;">
              ${escapeXml(item.kunciJawaban)}
            </td>
          </tr>
          <tr style="background-color: #fffbeb;">
            <td style="padding: 4pt 8pt; border: 1pt solid #fde68a; color: #92400e; font-weight: bold;">
              Diagnosa Kesalahan:
            </td>
            <td style="padding: 4pt 8pt; border: 1pt solid #fde68a; color: #92400e;">
              ${escapeXml(item.diagnosaKesalahan)}
            </td>
          </tr>
          ${(() => {
            const tips = getDetailedTkaTips(soal);
            return `
              <tr style="background-color: #fffbeb;">
                <td style="padding: 4pt 8pt; border: 1pt solid #fde68a; color: #92400e; font-weight: bold; vertical-align: top;">
                  Tips &amp; Trik Cepat TKA:
                </td>
                <td style="padding: 4pt 8pt; border: 1pt solid #fde68a; color: #78350f;">
                  <strong>${escapeXml(tips.judulTrik)}:</strong> ${escapeXml(tips.strategiSingkat)}<br/>
                  <span style="font-size: 8pt; color: #1e293b;"><strong>Langkah Cepat Siswa:</strong> ${tips.langkahSiswa.map((l) => `${l.nomor}. ${escapeXml(l.judul)}`).join(' • ')}</span><br/>
                  <span style="font-size: 8pt; color: #3730a3;"><strong>💡 Logika Konseptual:</strong> ${escapeXml(tips.penjelasanKonsep)}</span><br/>
                  <span style="font-size: 8pt; color: #065f46;"><strong>👨‍🏫 Bimbingan Guru:</strong> ${escapeXml(tips.panduanGuru)}</span><br/>
                  <span style="font-size: 8pt; color: #991b1b;"><strong>⚠️ Waspada Jebakan:</strong> ${escapeXml(tips.waspadaJebakan)}</span>
                </td>
              </tr>
            `;
          })()}
        </table>

        <!-- Pembahasan Lengkap -->
        <div style="background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 6pt 8pt; margin-top: 8pt; font-size: 8.5pt; color: #334155; border-radius: 4pt;">
          <strong>Pembahasan &amp; Pembuktian:</strong><br/>
          ${escapeXml(soal.pembahasan).replace(/\n/g, '<br/>')}
        </div>
      </div>
    `;
  });

  // Tanda tangan lembar remedial
  htmlBody += `
    <div style="margin-top: 24pt; font-size: 9.5pt; font-family: 'Calibri', 'Arial', sans-serif;">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top;">
            Siswa Bersangkutan,<br/><br/><br/><br/>
            <strong>( ${escapeXml(identitasSiswa?.nama || '...........................................')} )</strong><br/>
            NIS: ${escapeXml(identitasSiswa?.nis || '............................')}
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top;">
            Mengetahui Guru Pembimbing / Wali Kelas,<br/><br/><br/><br/>
            <strong>( ........................................................... )</strong><br/>
            NIP: .....................................................
          </td>
        </tr>
      </table>
    </div>
  `;

  const fullDocument = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Paket Remedial Siswa</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.35;
            color: #1e293b;
          }
          table {
            border-collapse: collapse;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${htmlBody}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', fullDocument], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Paket_Remedial_${safeNama}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
