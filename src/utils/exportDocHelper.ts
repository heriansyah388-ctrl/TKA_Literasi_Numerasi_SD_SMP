import { SoalItem, PaketSoalMetadata } from '../types';
import {
  isPgkSoal,
  isMenjodohkanSoal,
  isUraianSoal,
  getNormalizedPernyataan,
  getNormalizedJodohkanPairs,
  formatKunciJawaban,
} from './soalFormatHelper';
import { getRubrikForSoal } from './rubrikHelper';

function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Menghasilkan dan mengunduh berkas Microsoft Word (.doc) lengkap dengan tata letak rapi,
 * kop surat, stimulus berbingkai, opsi/tabel soal, serta pembahasan dan rubrik analitik untuk pegangan guru.
 */
export function exportToWordDoc(
  metadata: PaketSoalMetadata,
  soalList: SoalItem[],
  mode: 'siswa' | 'guru' = 'siswa'
) {
  const isGuru = mode === 'guru';
  const jenjang = metadata.jenjang || 'SD';
  const kelas = metadata.kelas || 'Kelas 5';
  const domain = metadata.domain || 'Literasi & Numerasi';
  const judul = metadata.judul || `Tes Kemampuan Akademik (TKA) ${domain}`;

  // Bersihkan teks untuk nama berkas yang valid
  const safeTitle = `TKA_${jenjang}_${kelas}_${isGuru ? 'Pegangan_Guru' : 'Lembar_Siswa'}`
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  let htmlBody = `
    <!-- Header / Kop Dokumen Asesmen -->
    <div style="text-align: center; border-bottom: 2.5pt solid #0f172a; padding-bottom: 12pt; margin-bottom: 16pt;">
      <h1 style="font-size: 15pt; font-weight: bold; margin: 0; text-transform: uppercase; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
        TES KEMAMPUAN AKADEMIK (TKA) — ${escapeHtml(domain.toUpperCase())}
      </h1>
      <h2 style="font-size: 12pt; font-weight: bold; margin: 4pt 0 0 0; color: #334155; font-family: 'Calibri', 'Arial', sans-serif;">
        JENJANG ${escapeHtml(jenjang)} — ${escapeHtml(kelas)} • MODE ${escapeHtml(metadata.mode || 'Standard')}
      </h2>
      <p style="font-size: 9.5pt; color: #64748b; margin: 3pt 0 0 0; font-family: 'Calibri', 'Arial', sans-serif;">
        Tahun Ajaran 2026/2027 • Berstandar Asesmen Nasional &amp; Kurikulum Nasional • Total ${soalList.length} Butir Soal
      </p>
      <p style="font-size: 9pt; color: #334155; margin: 3pt 0 0 0; font-family: 'Calibri', 'Arial', sans-serif;">
        Pengembang: <strong>Heriansyah., S.Si., S.Pd., M.Pd</strong> (Pengawas Satuan Pendidikan Disdikbud Sidrap)
      </p>
    </div>
  `;

  if (!isGuru) {
    // Identitas Siswa
    htmlBody += `
      <table style="width: 100%; border: 1.5pt solid #475569; border-collapse: collapse; margin-bottom: 16pt; font-size: 10pt; font-family: 'Calibri', 'Arial', sans-serif;">
        <tr>
          <td style="width: 30%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;">
            <strong style="color: #475569;">Nama Siswa:</strong><br/>
            <div style="margin-top: 14pt; border-bottom: 1pt dotted #475569; width: 90%;">&nbsp;</div>
          </td>
          <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;">
            <strong style="color: #475569;">NISN / No. Absen:</strong><br/>
            <div style="margin-top: 14pt; border-bottom: 1pt dotted #475569; width: 90%;">&nbsp;</div>
          </td>
          <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 6pt 8pt;">
            <strong style="color: #475569;">Kelas / Ruang:</strong><br/>
            <div style="margin-top: 14pt; border-bottom: 1pt dotted #475569; width: 90%;">&nbsp;</div>
          </td>
          <td style="width: 20%; border: 1pt solid #cbd5e1; padding: 6pt 8pt; text-align: center; background-color: #f8fafc;">
            <strong style="color: #475569;">Nilai / Skor Akhir</strong><br/>
            <div style="border: 1pt solid #94a3b8; height: 26pt; margin-top: 4pt; background: #ffffff;">&nbsp;</div>
          </td>
        </tr>
      </table>

      <!-- Petunjuk Umum -->
      <div style="background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 8pt 10pt; margin-bottom: 16pt; font-size: 9.5pt; font-family: 'Calibri', 'Arial', sans-serif; color: #334155;">
        <strong style="color: #0f172a;">Petunjuk Pengerjaan:</strong>
        <ol style="margin: 3pt 0 0 0; padding-left: 16pt; line-height: 1.4;">
          <li>Tuliskan identitas Anda secara lengkap dan teliti pada kolom yang disediakan di atas.</li>
          <li>Bacalah dengan cermat setiap teks stimulus, data, atau narasi kasus sebelum menjawab pertanyaan.</li>
          <li>Untuk soal Pilihan Ganda, silang (X) atau beri tanda pada huruf A, B, C, atau D yang paling tepat.</li>
          <li>Untuk soal Menjodohkan dan PGK, ikuti instruksi khusus pada masing-masing nomor.</li>
          <li>Periksa kembali semua jawaban sebelum mengumpulkan naskah kepada guru pengawas.</li>
        </ol>
      </div>
    `;
  } else {
    // Banner Guru
    htmlBody += `
      <div style="background-color: #eef2ff; border: 1.5pt solid #6366f1; padding: 8pt 12pt; margin-bottom: 16pt; font-size: 10pt; font-family: 'Calibri', 'Arial', sans-serif; color: #312e81;">
        <strong>DOKUMEN PEGANGAN RESMI GURU / TIM PENGUJI:</strong><br/>
        Naskah ini memuat stimulus lengkap, butir soal, kunci jawaban resmi, pemetaan domain/subdomain, indikator keberhasilan, telaah proses berpikir matematis/kebahasaan, dan tabel rubrik analitik bertingkat.
      </div>
    `;
  }

  // Render daftar soal
  soalList.forEach((soal, idx) => {
    const no = idx + 1;
    const bentuk = soal.bentuk_soal || 'Pilihan Ganda';

    htmlBody += `
      <div style="margin-bottom: 20pt; page-break-inside: avoid; font-family: 'Calibri', 'Arial', sans-serif;">
        <table style="width: 100%; border: none; border-collapse: collapse;">
          <tr>
            <td style="width: 26pt; vertical-align: top; border: none; padding: 0;">
              <strong style="font-size: 11pt; color: #0f172a;">${no}.</strong>
            </td>
            <td style="vertical-align: top; border: none; padding: 0;">
              <!-- Stimulus -->
              <div style="background-color: #f8fafc; border-left: 3pt solid #334155; padding: 8pt 10pt; margin-bottom: 7pt; font-size: 10pt; line-height: 1.45; color: #1e293b; font-style: normal;">
                ${escapeHtml(soal.stimulus).replace(/\n/g, '<br/>')}
              </div>

              <!-- Pertanyaan -->
              <p style="font-size: 10.5pt; font-weight: bold; margin: 4pt 0 8pt 0; color: #0f172a; line-height: 1.35;">
                ${escapeHtml(soal.pertanyaan)}
              </p>
    `;

    // Respon per bentuk soal
    if (isMenjodohkanSoal(soal)) {
      const pairs = getNormalizedJodohkanPairs(soal);
      const responChoices = Array.from(new Set(pairs.map((p) => p.respon)));

      if (!isGuru) {
        htmlBody += `
          <div style="font-size: 9pt; font-style: italic; color: #475569; margin-bottom: 6pt;">
            Petunjuk: Pasangkan pernyataan di Kolom A dengan pilihan di Kolom B dengan menuliskan huruf pilihan pada kotak [ ... ] atau menarik garis lurus penghubung.
          </div>
        `;
      }

      htmlBody += `
        <table style="width: 100%; border: 1pt solid #94a3b8; border-collapse: collapse; margin-bottom: 8pt; font-size: 9.5pt;">
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <th style="width: 50%; border: 1pt solid #94a3b8; padding: 5pt 7pt; text-align: left;">KOLOM A: Pernyataan / Kasus</th>
            <th style="width: 50%; border: 1pt solid #94a3b8; padding: 5pt 7pt; text-align: left;">KOLOM B: Pilihan Jawaban</th>
          </tr>
      `;

      const maxRows = Math.max(pairs.length, responChoices.length);
      for (let r = 0; r < maxRows; r++) {
        const pair = pairs[r];
        const resp = responChoices[r];
        const letter = resp !== undefined ? String.fromCharCode(65 + r) : '';

        let matchCode = '[ &nbsp;&nbsp; ]';
        if (isGuru && pair) {
          const rIdx = responChoices.indexOf(pair.respon);
          matchCode = `[ <strong>${rIdx !== -1 ? String.fromCharCode(65 + rIdx) : '-'}</strong> ]`;
        }

        htmlBody += `
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 7pt; vertical-align: top;">
              ${pair ? `<strong>${r + 1}.</strong> ${escapeHtml(pair.premis)} <span style="float: right; font-family: monospace; color: #1e293b;">${matchCode}</span>` : '&nbsp;'}
            </td>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 7pt; vertical-align: top;">
              ${resp !== undefined ? `<strong>${letter}.</strong> ${escapeHtml(resp)}` : '&nbsp;'}
            </td>
          </tr>
        `;
      }
      htmlBody += `</table>`;

      // Kunci guru untuk menjodohkan
      if (isGuru) {
        htmlBody += `
          <div style="background-color: #ecfdf5; border: 1pt solid #6ee7b7; padding: 6pt 8pt; margin-bottom: 8pt; font-size: 9pt; color: #065f46;">
            <strong>Kunci Pasangan Lengkap:</strong><br/>
            ${pairs.map((p, pIdx) => {
              const rIdx = responChoices.indexOf(p.respon);
              const code = rIdx !== -1 ? String.fromCharCode(65 + rIdx) : '?';
              return `• Kasus ${pIdx + 1} dipasangkan dengan pilihan <strong>[${code}] ${escapeHtml(p.respon)}</strong><br/>`;
            }).join('')}
          </div>
        `;
      }
    } else if (isPgkSoal(soal)) {
      const statements = getNormalizedPernyataan(soal);
      if (statements.length > 0) {
        if (!isGuru) {
          htmlBody += `
            <div style="font-size: 9pt; font-style: italic; color: #475569; margin-bottom: 6pt;">
              Petunjuk: Beri tanda centang (✓) atau silang pada kolom Benar atau Salah untuk masing-masing pernyataan berikut.
            </div>
          `;
        }

        htmlBody += `
          <table style="width: 100%; border: 1pt solid #94a3b8; border-collapse: collapse; margin-bottom: 8pt; font-size: 9.5pt;">
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <th style="width: 6%; border: 1pt solid #94a3b8; padding: 5pt; text-align: center;">No</th>
              <th style="width: 74%; border: 1pt solid #94a3b8; padding: 5pt 8pt; text-align: left;">Pernyataan Berdasarkan Teks Stimulus</th>
              <th style="width: 10%; border: 1pt solid #94a3b8; padding: 5pt; text-align: center;">Benar</th>
              <th style="width: 10%; border: 1pt solid #94a3b8; padding: 5pt; text-align: center;">Salah</th>
            </tr>
        `;

        statements.forEach((stmt, sIdx) => {
          const isBenar = stmt.kunci.toLowerCase() === 'benar' || stmt.kunci.toLowerCase() === 'true';
          const markBenar = isGuru ? (isBenar ? '● [BENAR]' : '○') : '○';
          const markSalah = isGuru ? (!isBenar ? '● [SALAH]' : '○') : '○';

          htmlBody += `
            <tr>
              <td style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: center; font-weight: bold;">${sIdx + 1}</td>
              <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt;">${escapeHtml(stmt.teks)}</td>
              <td style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: center; ${isGuru && isBenar ? 'background-color: #d1fae5; font-weight: bold;' : ''}">${markBenar}</td>
              <td style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: center; ${isGuru && !isBenar ? 'background-color: #ffe4e6; font-weight: bold;' : ''}">${markSalah}</td>
            </tr>
          `;
        });
        htmlBody += `</table>`;
      } else {
        // Multi-select PGK
        htmlBody += `<div style="margin-bottom: 8pt;">`;
        if (soal.opsi) {
          Object.entries(soal.opsi).forEach(([huruf, teks]) => {
            const isCorrect = isGuru && (soal.kunci?.includes(huruf) || soal.kunci?.toUpperCase().includes(huruf.toUpperCase()));
            htmlBody += `
              <div style="margin-bottom: 4pt; font-size: 10pt; ${isCorrect ? 'color: #065f46; font-weight: bold;' : ''}">
                [ ${isCorrect ? '✓' : '&nbsp;&nbsp;'} ] <strong>${huruf}.</strong> ${escapeHtml(teks)}
              </div>
            `;
          });
        }
        htmlBody += `</div>`;
      }
    } else if (isUraianSoal(soal)) {
      if (!isGuru) {
        htmlBody += `
          <div style="border: 1pt solid #94a3b8; background-color: #fafafa; padding: 8pt; min-height: 80pt; margin-bottom: 8pt; font-size: 9pt; color: #94a3b8;">
            <em>Lembar Jawaban Siswa (Tuliskan langkah pemikiran, perhitungan, atau simpulan):</em>
            <div style="border-bottom: 1pt dashed #cbd5e1; height: 22pt;">&nbsp;</div>
            <div style="border-bottom: 1pt dashed #cbd5e1; height: 22pt;">&nbsp;</div>
            <div style="border-bottom: 1pt dashed #cbd5e1; height: 22pt;">&nbsp;</div>
          </div>
        `;
      }
    } else {
      // Standard Pilihan Ganda
      htmlBody += `
        <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 8pt; font-size: 10pt;">
      `;
      if (soal.opsi) {
        Object.entries(soal.opsi).forEach(([huruf, teks]) => {
          const isKunci = isGuru && huruf.trim().toUpperCase() === String(soal.kunci).trim().toUpperCase();
          htmlBody += `
            <tr>
              <td style="width: 22pt; vertical-align: top; border: none; padding: 3pt 0; font-weight: bold; ${isKunci ? 'color: #065f46;' : ''}">
                ${huruf}.
              </td>
              <td style="vertical-align: top; border: none; padding: 3pt 0; ${isKunci ? 'color: #065f46; font-weight: bold;' : ''}">
                ${escapeHtml(teks)} ${isKunci ? ' <span style="color: #059669;">(Kunci Jawaban Benar)</span>' : ''}
              </td>
            </tr>
          `;
        });
      }
      htmlBody += `</table>`;
    }

    // Telaah Guru
    if (isGuru) {
      const rubrik = getRubrikForSoal(soal);

      htmlBody += `
        <div style="background-color: #f8fafc; border: 1pt solid #cbd5e1; padding: 8pt 10pt; margin-top: 6pt; font-size: 9pt; color: #1e293b;">
          <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 6pt;">
            <tr>
              <td style="border: none; padding: 0;">
                <strong>Kunci / Inti Jawaban:</strong> <span style="color: #065f46; font-weight: bold;">${escapeHtml(formatKunciJawaban(soal))}</span>
              </td>
              <td style="border: none; padding: 0; text-align: right; color: #475569;">
                Bentuk: <strong>${escapeHtml(bentuk)}</strong> | Subdomain: <strong>${escapeHtml(soal.subdomain)}</strong> | Level: <strong>${escapeHtml(soal.level_kognitif)}</strong>
              </td>
            </tr>
          </table>

          <div style="margin-bottom: 4pt;">
            <strong>Indikator Pencapaian:</strong> ${escapeHtml(soal.indikator)}
          </div>

          <div style="margin-bottom: 6pt;">
            <strong>Langkah Pembahasan &amp; Bukti Penalaran:</strong><br/>
            <span style="color: #334155; line-height: 1.4;">${escapeHtml(soal.pembahasan).replace(/\n/g, '<br/>')}</span>
          </div>
      `;

      // Rubrik Analitik Uraian
      if (isUraianSoal(soal) && rubrik?.kriteria) {
        htmlBody += `
          <div style="margin-top: 6pt; border-top: 1pt solid #e2e8f0; pt-2;">
            <strong style="color: #0f172a;">Rubrik Skor Analitik Bertingkat (Maks. ${rubrik.skor_maksimal || 2} Poin):</strong>
            <table style="width: 100%; border: 1pt solid #94a3b8; border-collapse: collapse; margin-top: 4pt; font-size: 8.5pt;">
              <tr style="background-color: #f1f5f9;">
                <th style="width: 12%; border: 1pt solid #94a3b8; padding: 4pt; text-align: center;">Skor</th>
                <th style="width: 38%; border: 1pt solid #94a3b8; padding: 4pt 6pt; text-align: left;">Kategori / Label</th>
                <th style="width: 50%; border: 1pt solid #94a3b8; padding: 4pt 6pt; text-align: left;">Deskripsi &amp; Indikator Penilaian</th>
              </tr>
              ${rubrik.kriteria.map((k) => `
                <tr>
                  <td style="border: 1pt solid #cbd5e1; padding: 4pt; text-align: center; font-weight: bold; color: #312e81;">${k.skor} Poin</td>
                  <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; font-weight: bold;">${escapeHtml(k.label)}</td>
                  <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${escapeHtml(k.deskripsi)}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
      }

      htmlBody += `</div>`;
    }

    htmlBody += `
            </td>
          </tr>
        </table>
      </div>
    `;
  });

  // Footer
  htmlBody += `
    <div style="margin-top: 24pt; border-top: 1pt solid #94a3b8; padding-top: 8pt; text-align: center; font-size: 8.5pt; color: #64748b; font-family: 'Calibri', 'Arial', sans-serif;">
      <div>Naskah Soal Asesmen Standar Nasional • Digenerate via Platform AI Generator TKA Literasi &amp; Numerasi</div>
      <div style="font-weight: bold; color: #334155; margin-top: 2pt;">Pengembang: Heriansyah., S.Si., S.Pd., M.Pd (Pengawas Satuan Pendidikan Disdikbud Sidrap)</div>
    </div>
  `;

  // Bungkus seluruh konten dalam format HTML standar Microsoft Word
  const fullDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${escapeHtml(judul)}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 21.0cm 29.7cm;
            margin: 2.0cm 2.0cm 2.0cm 2.0cm;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.Section1 {
            page: Section1;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
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

  // Download berkas dengan MIME application/msword dan ekstensi .doc
  const blob = new Blob(['\ufeff', fullDocument], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
