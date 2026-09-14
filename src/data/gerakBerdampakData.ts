export interface PilarGerakBerdampak {
  id: string;
  huruf: string;
  kataKunci: string;
  judulLengkap: string;
  deskripsi: string;
  peranPengawas: string;
  peranSekolah: string;
  fiturWebTerkait: {
    namaFitur: string;
    tabTarget: 'generator' | 'soal_list' | 'cbt' | 'cat' | 'laporan' | 'bank_kurasi' | 'rekap_nilai';
    deskripsiAksi: string;
  };
  outputKonkret: string;
  tag: string;
}

export const DATA_GERAK_BERDAMPAK: PilarGerakBerdampak[] = [
  {
    id: 'G',
    huruf: 'G',
    kataKunci: 'Gali Masalah',
    judulLengkap: 'Gali Masalah Berbasis Data',
    deskripsi: 'Melakukan observasi kelas, analisis hasil belajar, dan dialog dengan kepala sekolah untuk menemukan masalah nyata pembelajaran tanpa asumsi subjektif.',
    peranPengawas: 'Mendampingi sekolah membaca baseline data capaian literasi dan numerasi murid menggunakan instrumen tes terstandar.',
    peranSekolah: 'Mengidentifikasi akar miskonsepsi siswa dan kesulitan belajar pada topik esensial.',
    fiturWebTerkait: {
      namaFitur: 'Simulasi CBT & Asesmen Adaptif (CAT)',
      tabTarget: 'cbt',
      deskripsiAksi: 'Laksanakan tes diagnostik awal untuk memetakan sebaran kemampuan nyata siswa di kelas.',
    },
    outputKonkret: 'Data dasar (baseline) skor, grafik ketuntasan awal, dan daftar miskonsepsi siswa.',
    tag: 'Fase Diagnosa',
  },
  {
    id: 'E1',
    huruf: 'E',
    kataKunci: 'Evaluasi & Refleksi',
    judulLengkap: 'Evaluasi & Refleksi Bersama',
    deskripsi: 'Memfasilitasi diskusi reflektif dengan kepala sekolah berbasis data tanpa menyalahkan, untuk membangun kesadaran bersama.',
    peranPengawas: 'Menjadi fasilitator apresiatif yang memandu kepala sekolah dan guru merefleksikan hasil asesmen secara jujur dan empatik.',
    peranSekolah: 'Menyadari area yang memerlukan perbaikan pedagogis tanpa rasa tertekan atau defensif.',
    fiturWebTerkait: {
      namaFitur: 'Rekap Nilai Kelas (Class Ledger)',
      tabTarget: 'rekap_nilai',
      deskripsiAksi: 'Buka leger rekapitulasi kelas untuk membedah persentase tuntas dan butir soal yang paling banyak dijawab salah.',
    },
    outputKonkret: 'Catatan refleksi bersama antara Pengawas, Kepala Sekolah, dan Guru mata pelajaran.',
    tag: 'Fase Reflektif',
  },
  {
    id: 'R1',
    huruf: 'R',
    kataKunci: 'Rancang Solusi',
    judulLengkap: 'Rancang Solusi Pendampingan',
    deskripsi: 'Menyusun strategi perbaikan pembelajaran yang sederhana, kontekstual, dan dapat langsung diterapkan oleh guru di ruang kelas.',
    peranPengawas: 'Memberikan alternatif intervensi pembelajaran, pemilihan materi esensial, dan rubrik asesmen yang relevan.',
    peranSekolah: 'Menyusun rencana aksi perbaikan pembelajaran (RPP/Modul Ajar) yang terarah.',
    fiturWebTerkait: {
      namaFitur: 'Tips & Trik Cepat TKA (Pedagogi Guru)',
      tabTarget: 'soal_list',
      deskripsiAksi: 'Gunakan panduan bimbingan guru dan logika konseptual pada setiap butir soal untuk merancang intervensi kelas.',
    },
    outputKonkret: 'Rencana aksi pendampingan berbasis topik spesifik dan lembar panduan bimbingan guru.',
    tag: 'Fase Perencanaan',
  },
  {
    id: 'A1',
    huruf: 'A',
    kataKunci: 'Aksi Nyata',
    judulLengkap: 'Aksi Pendampingan Nyata',
    deskripsi: 'Mendampingi kepala sekolah dalam melakukan supervisi akademik dan pembinaan guru di kelas secara langsung.',
    peranPengawas: 'Hadir langsung di kelas bersama Kepala Sekolah untuk mempraktikkan supervisi klinis yang memberdayakan.',
    peranSekolah: 'Menerapkan pembelajaran berdiferensiasi dan teknik scaffolding pemecahan masalah TKA.',
    fiturWebTerkait: {
      namaFitur: 'Cetak Naskah Pegangan Guru & Rubrik Analitik',
      tabTarget: 'generator',
      deskripsiAksi: 'Cetak instrumen soal lengkap dengan rubrik analitik skala bertingkat (2, 1, 0) sebagai panduan observasi kelas.',
    },
    outputKonkret: 'Lembar observasi supervisi akademik berbasis rubrik analitik bertingkat.',
    tag: 'Fase Eksekusi',
  },
  {
    id: 'K1',
    huruf: 'K',
    kataKunci: 'Kolaborasi',
    judulLengkap: 'Kolaborasi Lintas Sekolah',
    deskripsi: 'Mengembangkan komunitas belajar antar kepala sekolah dan guru (KKG/MGMP/MKKS) untuk berbagi praktik baik dan saling menguatkan.',
    peranPengawas: 'Mengorkestrasi jejaring komunitas belajar antarsatuan pendidikan binaan di Kabupaten Sidrap.',
    peranSekolah: 'Berbagi modul soal kurasi terstandar, kiat mengatasi miskonsepsi, dan keberhasilan metode ajar.',
    fiturWebTerkait: {
      namaFitur: 'Bank Kurasi Standar & Ekspor Word (.doc)',
      tabTarget: 'bank_kurasi',
      deskripsiAksi: 'Gunakan paket kurasi terkalibrasi dan ekspor naskah berformat Word untuk didiseminasikan dalam forum KKG/MGMP.',
    },
    outputKonkret: 'Bank soal bersama lintas sekolah dan notula berbagi praktik baik komunitas belajar.',
    tag: 'Fase Kolaboratif',
  },
  {
    id: 'B',
    huruf: 'B',
    kataKunci: 'Berbasis Data',
    judulLengkap: 'Berbasis Data Perubahan',
    deskripsi: 'Menggunakan data sebagai dasar untuk melihat perkembangan pembelajaran sebelum dan sesudah intervensi dilakukan.',
    peranPengawas: 'Menganalisis delta (selisih) peningkatan skor dan penurunan tingkat kesalahan siswa.',
    peranSekolah: 'Memverifikasi apakah strategi remedial yang diterapkan memberikan lonjakan pemahaman nyata pada siswa.',
    fiturWebTerkait: {
      namaFitur: 'Laporan Profil & Rekomendasi Belajar',
      tabTarget: 'laporan',
      deskripsiAksi: 'Bandingkan grafik skor pre-test dan post-test untuk memastikan intervensi membuahkan hasil nyata.',
    },
    outputKonkret: 'Laporan komparasi data perubahan (Pre-test vs Post-test).',
    tag: 'Fase Data & Metrik',
  },
  {
    id: 'E2',
    huruf: 'E',
    kataKunci: 'Evaluasi Berkelanjutan',
    judulLengkap: 'Evaluasi Berkelanjutan',
    deskripsi: 'Melakukan evaluasi secara terus-menerus terhadap proses dan hasil pendampingan pada setiap tahapan semester.',
    peranPengawas: 'Memantau kepatuhan siklus mutu dan memastikan kepala sekolah konsisten menjalankan pendampingan internal.',
    peranSekolah: 'Mencatat hambatan teknis dan pedagogis selama proses pembelajaran berlangsung.',
    fiturWebTerkait: {
      namaFitur: 'Riwayat & Multi-Sesi Asesmen Kelas',
      tabTarget: 'rekap_nilai',
      deskripsiAksi: 'Simpan rekapitulasi nilai setiap periode ujian untuk melacak rekam jejak mutu akademik kelas secara konsisten.',
    },
    outputKonkret: 'Log buku catatan supervisi berkala dan tren perkembangan nilai kelas.',
    tag: 'Fase Monitoring',
  },
  {
    id: 'R2',
    huruf: 'R',
    kataKunci: 'Refleksi Mendalam',
    judulLengkap: 'Refleksi Mendalam',
    deskripsi: 'Mendorong guru dan kepala sekolah melakukan refleksi terhadap praktik pembelajaran yang telah dilakukan.',
    peranPengawas: 'Mengajukan pertanyaan pemantik mendalam: "Konsep apa yang masih membingungkan murid kita?" dan "Bagaimana cara kita membantunya?".',
    peranSekolah: 'Mengubah pola pengajaran dari transfer rumus hafalan menjadi pembiasaan stimulus nalar dan pemahaman konsep.',
    fiturWebTerkait: {
      namaFitur: 'Analisis Miskonsepsi & Distraktor',
      tabTarget: 'soal_list',
      deskripsiAksi: 'Bedah alasan pilihan pengecoh (distraktor) dan waspadai jebakan soal bersama rekan sejawat.',
    },
    outputKonkret: 'Jurnal refleksi guru mengenai perubahan pola interaksi dan pertanyaan di kelas.',
    tag: 'Fase Reflektif',
  },
  {
    id: 'D',
    huruf: 'D',
    kataKunci: 'Dampak Pembelajaran',
    judulLengkap: 'Dampak pada Pembelajaran',
    deskripsi: 'Memastikan perubahan terlihat nyata pada aktivitas siswa dan kualitas proses belajar di ruang kelas.',
    peranPengawas: 'Mengamati keterlibatan aktif siswa dalam memecahkan masalah kontekstual selama kunjungan kelas.',
    peranSekolah: 'Menciptakan suasana belajar yang memacu rasa ingin tahu, diskusi kritis, dan eksplorasi data numerasi.',
    fiturWebTerkait: {
      namaFitur: 'Simulasi CBT Interaktif Berbasis Stimulus Kontekstual',
      tabTarget: 'cbt',
      deskripsiAksi: 'Siswa merasakan pengalaman tes interaktif dengan stimulus bacaan dunia nyata (saintifik, sosial budaya, personal).',
    },
    outputKonkret: 'Portofolio karya siswa dan dokumentasi peningkatan keaktifan diskusi nalar di kelas.',
    tag: 'Fase Dampak',
  },
  {
    id: 'A2',
    huruf: 'A',
    kataKunci: 'Aksi Lanjutan',
    judulLengkap: 'Aksi Lanjutan',
    deskripsi: 'Melakukan tindak lanjut berdasarkan hasil evaluasi untuk memperbaiki kekurangan dan menuntaskan kompetensi yang belum tercapai.',
    peranPengawas: 'Memastikan tidak ada siswa yang tertinggal dengan mengawal pelaksanaan program remedial yang terstruktur.',
    peranSekolah: 'Membagikan paket soal pemulihan khusus yang ditargetkan hanya pada butir yang dijawab salah oleh siswa.',
    fiturWebTerkait: {
      namaFitur: 'Generator Otomatis Paket Remedial Siswa',
      tabTarget: 'laporan',
      deskripsiAksi: 'Klik "Buat Paket Remedial Otomatis" dari hasil tes siswa dan unduh naskah tindak lanjut resmi bertanda tangan.',
    },
    outputKonkret: 'Lembar kerja remedial siswa bertanda tangan orang tua, guru, dan pengawas.',
    tag: 'Fase Pemulihan',
  },
  {
    id: 'M',
    huruf: 'M',
    kataKunci: 'Monitoring Rutin',
    judulLengkap: 'Monitoring Rutin',
    deskripsi: 'Melaksanakan pemantauan secara berkala untuk menjaga konsistensi perubahan dan keberlangsungan iklim belajar positif.',
    peranPengawas: 'Menjadwalkan siklus kunjungan supervisi terjadwal dengan target indikator capaian yang disepakati bersama.',
    peranSekolah: 'Menjaga keteraturan evaluasi dan memastikan umpan balik selalu diberikan kepada setiap siswa.',
    fiturWebTerkait: {
      namaFitur: 'Indikator & Level Kognitif Soal (L1/L2/L3)',
      tabTarget: 'generator',
      deskripsiAksi: 'Pantau proporsi level kognitif soal (Menemukan Informasi, Memahami, Mengevaluasi/Menerapkan) agar seimbang.',
    },
    outputKonkret: 'Jadwal dan lembar ceklis pemantauan berkala pengawasan satuan pendidikan.',
    tag: 'Fase Pengawalan',
  },
  {
    id: 'P',
    huruf: 'P',
    kataKunci: 'Perbaikan Berkelanjutan',
    judulLengkap: 'Perbaikan Berkelanjutan (Continuous Improvement)',
    deskripsi: 'Mengembangkan dan menyempurnakan strategi pendampingan sesuai kebutuhan dinamis sekolah binaan.',
    peranPengawas: 'Menyesuaikan intensitas pendampingan: memberikan bimbingan intensif bagi sekolah yang membutuhkan dan fasilitasi mandiri bagi yang telah maju.',
    peranSekolah: 'Terus menguji coba pendekatan ajar baru yang lebih efektif.',
    fiturWebTerkait: {
      namaFitur: 'Pilihan Mode Generator (Latihan, Asesmen, Pengayaan, Remedial)',
      tabTarget: 'generator',
      deskripsiAksi: 'Ubah mode paket soal sesuai fase perkembangan belajar siswa untuk perbaikan tiada henti.',
    },
    outputKonkret: 'Roadmap pengembangan mutu literasi dan numerasi satuan pendidikan.',
    tag: 'Fase Inovasi',
  },
  {
    id: 'A3',
    huruf: 'A',
    kataKunci: 'Aktivasi Ekosistem',
    judulLengkap: 'Aktivasi Ekosistem Belajar',
    deskripsi: 'Mendorong keterlibatan aktif guru, kepala sekolah, orang tua, dan siswa dalam ekosistem pembelajaran yang suportif.',
    peranPengawas: 'Menghubungkan sekolah dengan Dinas Pendidikan dan pemangku kepentingan untuk mendukung program prioritas literasi/numerasi.',
    peranSekolah: 'Melibatkan siswa sebagai subjek belajar yang aktif dan menginformasikan capaian belajar secara transparan kepada orang tua.',
    fiturWebTerkait: {
      namaFitur: 'Bagikan Link Simulasi CBT/CAT ke Ponsel Siswa',
      tabTarget: 'cbt',
      deskripsiAksi: 'Sebarkan tautan asesmen interaktif ke WhatsApp grup kelas agar siswa dapat berlatih secara fleksibel di sekolah maupun di rumah.',
    },
    outputKonkret: 'Ekosistem belajar digital yang melibatkan siswa, guru, pimpinan sekolah, dan orang tua.',
    tag: 'Fase Kolaboratif',
  },
  {
    id: 'K2',
    huruf: 'K',
    kataKunci: 'Kinerja Nyata',
    judulLengkap: 'Kinerja Nyata',
    deskripsi: 'Menunjukkan hasil konkret berupa peningkatan mutu pembelajaran, kenaikan Rapor Pendidikan, dan peningkatan hasil belajar siswa.',
    peranPengawas: 'Menyusun laporan kinerja pengawasan berbasis dampak (*impact report*) yang dapat dipertanggungjawabkan kepada Kepala Dinas Pendidikan.',
    peranSekolah: 'Merayakan capaian lonjakan literasi & numerasi serta mempertahankan budaya mutu akademik.',
    fiturWebTerkait: {
      namaFitur: 'Cetak Laporan Rapor & Ekspor Ledger Nilai Resmi',
      tabTarget: 'rekap_nilai',
      deskripsiAksi: 'Cetak laporan nilai kelas dan dokumen supervisi berformat profesional untuk pertanggungjawaban dinas.',
    },
    outputKonkret: 'Laporan Kinerja Pengawasan Berdampak dan Peningkatan Indikator Rapor Pendidikan Daerah.',
    tag: 'Fase Akuntabilitas',
  },
];

/**
 * Menghasilkan dan mengunduh berkas Microsoft Word (.doc) berisi
 * Naskah Panduan Resmi Inovasi "GERAK BERDAMPAK" Pengawas Satuan Pendidikan Disdikbud Sidrap.
 */
export function exportPanduanGerakBerdampakToWordDoc() {
  const pilarList = DATA_GERAK_BERDAMPAK;

  const htmlPilarRows = pilarList
    .map(
      (item, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; text-align: center; font-weight: bold; font-size: 11pt; color: #1e3a8a; vertical-align: top;">
        ${item.huruf}
      </td>
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; font-weight: bold; color: #0f172a; font-size: 9.5pt; vertical-align: top;">
        ${item.judulLengkap}<br/>
        <span style="font-weight: normal; font-size: 8pt; color: #64748b; background-color: #f1f5f9; padding: 1pt 4pt; border-radius: 2pt;">
          ${item.tag}
        </span>
      </td>
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; font-size: 9pt; color: #334155; vertical-align: top;">
        ${item.deskripsi}
      </td>
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; font-size: 8.5pt; color: #1e293b; vertical-align: top;">
        <strong>Pengawas:</strong> ${item.peranPengawas}<br/>
        <strong>Sekolah:</strong> ${item.peranSekolah}
      </td>
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; font-size: 8.5pt; color: #0369a1; vertical-align: top;">
        <strong>Fitur:</strong> ${item.fiturWebTerkait.namaFitur}<br/>
        <span style="color: #475569;">${item.fiturWebTerkait.deskripsiAksi}</span>
      </td>
      <td style="border: 1pt solid #cbd5e1; padding: 6pt; font-size: 8.5pt; color: #047857; font-weight: 500; vertical-align: top;">
        ${item.outputKonkret}
      </td>
    </tr>
  `
    )
    .join('');

  const docContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Panduan Inovasi GERAK BERDAMPAK - Disdikbud Sidrap</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 9.5pt;
            color: #0f172a;
            line-height: 1.35;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <!-- KOP RESMI INOVASI -->
        <div style="border-bottom: 2pt double #1e3a8a; padding-bottom: 8pt; margin-bottom: 12pt; text-align: center;">
          <div style="font-size: 13pt; font-weight: bold; color: #1e3a8a; letter-spacing: 0.5pt;">
            PEMERINTAH KABUPATEN SIDENRENG RAPPANG (SIDRAP)
          </div>
          <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </div>
          <div style="font-size: 11pt; font-weight: bold; color: #0369a1; margin-top: 2pt;">
            INOVASI PENGAWASAN SATUAN PENDIDIKAN: &quot;GERAK BERDAMPAK&quot;
          </div>
          <div style="font-size: 8.5pt; color: #475569; margin-top: 2pt;">
            Fasilitasi Supervisi Akademik &amp; Pendampingan Literasi-Numerasi Berbasis Data Mutu Siswa
          </div>
        </div>

        <!-- IDENTITAS INOVATOR & PROGRAM -->
        <table style="width: 100%; margin-bottom: 12pt; font-size: 9pt; background-color: #f8fafc; border: 1pt solid #cbd5e1;">
          <tr>
            <td style="padding: 4pt 8pt; width: 22%; font-weight: bold; color: #1e3a8a;">Nama Inovasi</td>
            <td style="padding: 4pt 8pt; width: 2%;">:</td>
            <td style="padding: 4pt 8pt; font-weight: bold; color: #0f172a;">GERAK BERDAMPAK</td>
            <td style="padding: 4pt 8pt; width: 18%; font-weight: bold; color: #1e3a8a;">Penggagas / Inovator</td>
            <td style="padding: 4pt 8pt; width: 2%;">:</td>
            <td style="padding: 4pt 8pt; font-weight: bold;">Heriansyah, S.Si., S.Pd., M.Pd</td>
          </tr>
          <tr>
            <td style="padding: 4pt 8pt; font-weight: bold; color: #1e3a8a;">Instrumen Pendukung</td>
            <td style="padding: 4pt 8pt;">:</td>
            <td style="padding: 4pt 8pt;">Web TKA Literasi &amp; Numerasi SD &amp; SMP</td>
            <td style="padding: 4pt 8pt; font-weight: bold; color: #1e3a8a;">Jabatan / Unit Kerja</td>
            <td style="padding: 4pt 8pt;">:</td>
            <td style="padding: 4pt 8pt;">Pengawas Satuan Pendidikan Disdikbud Sidrap</td>
          </tr>
          <tr>
            <td style="padding: 4pt 8pt; font-weight: bold; color: #1e3a8a;">Sasaran Implementasi</td>
            <td style="padding: 4pt 8pt;">:</td>
            <td style="padding: 4pt 8pt;">Kepala Sekolah, Guru Kelas / Mapel, dan Peserta Didik SD-SMP</td>
            <td style="padding: 4pt 8pt; font-weight: bold; color: #1e3a8a;">Surel Resmi Dinas</td>
            <td style="padding: 4pt 8pt;">:</td>
            <td style="padding: 4pt 8pt;">heriansyah388@dinas.belajar.id</td>
          </tr>
        </table>

        <!-- MATRIKS 14 PILAR GERAK BERDAMPAK -->
        <div style="font-weight: bold; font-size: 10.5pt; color: #1e3a8a; margin-bottom: 6pt;">
          MATRIKS KERANGKA OPERASIONAL 14 PILAR &quot;GERAK BERDAMPAK&quot;
        </div>

        <table>
          <thead>
            <tr style="background-color: #1e3a8a; color: #ffffff;">
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 4%; text-align: center;">Pilar</th>
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 18%; text-align: left;">Nama Pilar</th>
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 24%; text-align: left;">Fokus &amp; Deskripsi Operasional</th>
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 22%; text-align: left;">Peran Pengawas &amp; Sekolah</th>
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 18%; text-align: left;">Integrasi Fitur Web TKA</th>
              <th style="border: 1pt solid #1e3a8a; padding: 6pt; width: 14%; text-align: left;">Output Konkret</th>
            </tr>
          </thead>
          <tbody>
            ${htmlPilarRows}
          </tbody>
        </table>

        <!-- TANDA TANGAN & PENGESAHAN -->
        <div style="margin-top: 24pt; font-size: 9.5pt;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 50%; text-align: center; vertical-align: top;">
                Mengetahui,<br/>
                Kepala Dinas Pendidikan dan Kebudayaan<br/>
                Kabupaten Sidenreng Rappang,<br/><br/><br/><br/>
                <strong>( ........................................................... )</strong><br/>
                NIP. .....................................................
              </td>
              <td style="width: 50%; text-align: center; vertical-align: top;">
                Sidenreng Rappang, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                Pengawas Satuan Pendidikan / Inovator,<br/><br/><br/><br/>
                <strong>( Heriansyah, S.Si., S.Pd., M.Pd )</strong><br/>
                NIP. .....................................................
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([docContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Panduan_Inovasi_GERAK_BERDAMPAK_Disdikbud_Sidrap_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
