/**
 * DATA INFORMASI (BERITA, PENGUMUMAN, REGULASI, FAQ)
 * BAPENDA KABUPATEN KARAWANG
 */

const INFORMASI_BASE_DATA = {
  berita: [
    {
      id: "berita-1",
      date: "2026-10-16",
      dateFormatted: "16 Okt 2026",
      title: "Sosialisasi PBB-P2 di Kecamatan Tirtamulya",
      excerpt: "Bapenda Karawang menggelar sosialisasi terkait tata cara pembayaran dan pengamanan PBB-P2 di Kecamatan Tirtamulya",
      image: "assets/berita_tirtamulya.jpg",
      author: "Humas BAPENDA Karawang",
      category: "berita",
      content: `Badan Pendapatan Daerah (BAPENDA) Kabupaten Karawang melaksanakan kegiatan sosialisasi optimalisasi penerimaan Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2) di Aula Kantor Kecamatan Tirtamulya pada Jumat, 16 Oktober 2026.

Kegiatan ini dihadiri langsung oleh jajaran pejabat BAPENDA, Camat Tirtamulya, serta para Kepala Desa dan kolektor pajak se-Kecamatan Tirtamulya. Materi utama yang disampaikan meliputi tata cara pembayaran digital melalui QRIS dan kanal perbankan mitra, percepatan distribusi SPPT, serta rekonsiliasi data ketetapan dan penerimaan desa.

Kepala BAPENDA Karawang menekankan pentingnya sinergi antara pemerintah kecamatan, desa, dan masyarakat agar kepatuhan wajib pajak terus meningkat sehingga pembangunan fasilitas umum di Tirtamulya dan wilayah sekitarnya dapat terealisasi secara maksimal.`
    },
    {
      id: "berita-2",
      date: "2026-10-10",
      dateFormatted: "10 Okt 2026",
      title: "Peningkatan Layanan Cek PBB Online",
      excerpt: "Kini masyarakat dapat mengecek tagihan PBB-P2 secara lebih mudah melalui website resmi Bapenda Karawang",
      image: "assets/berita_cek_online.jpg",
      author: "Pusat Data & IT BAPENDA",
      category: "berita",
      content: `Dalam rangka meningkatkan kemudahan pelayanan perpajakan daerah kepada masyarakat, BAPENDA Kabupaten Karawang merilis pembaruan antarmuka dan infrastruktur server portal Cek PBB Online.

Melalui sistem baru ini, wajib pajak cukup memasukkan 18 digit Nomor Objek Pajak (NOP) untuk langsung melihat informasi ketetapan pajak tahun berjalan, riwayat pembayaran tahun-tahun sebelumnya, status lunas, hingga link pembayaran digital instan.

Pembaruan ini juga terintegrasi langsung dengan database Geographic Information System (GIS) pemetaan wilayah Karawang, sehingga data batas wilayah dan ketetapan per kecamatan kini tersaji secara transparan dan akuntabel.`
    },
    {
      id: "berita-3",
      date: "2026-10-05",
      dateFormatted: "05 Okt 2026",
      title: "Realisasi PBB-P2 Triwulan III Capai 76,6%",
      excerpt: "Realisasi penerimaan PBB-P2 hingga Triwulan III tahun 2026 mencapai 76,6% dari target yang ditetapkan",
      image: "assets/berita_realisasi.jpg",
      author: "Bidang Pengendalian & Evaluasi Pendapatan",
      category: "berita",
      content: `Hingga akhir Triwulan III Tahun Anggaran 2026, Badan Pendapatan Daerah Kabupaten Karawang mencatatkan capaian realisasi penerimaan PBB-P2 sebesar 76,6% dari total target APBD Kabupaten Karawang yang ditetapkan.

Capaian positif ini ditopang oleh tingginya kesadaran wajib pajak sektor industri, komersial, serta percepatan pelunasan di tingkat perdesaan. Sejumlah kecamatan telah menembus target di atas 80%, bahkan beberapa desa telah mencapai status lunas 100%.

BAPENDA menyampaikan apresiasi kepada seluruh wajib pajak dan jajaran aparatur desa yang terus berupaya menjaga tren positif ini hingga batas akhir penutupan tahun anggaran pada Desember 2026.`
    }
  ],

  pengumuman: [
    {
      id: "pengumuman-1",
      date: "2026-10-14",
      dateFormatted: "14 Okt 2026",
      title: "Jadwal Pembayaran PBB-P2 Tahap IV Tahun 2026",
      category: "pengumuman",
      summary: "BAPENDA mengumumkan pembukaan loket khusus pembayaran PBB-P2 Tahap IV Tahun Anggaran 2026 bagi seluruh wajib pajak individu dan badan.",
      content: `Diberitahukan kepada seluruh Wajib Pajak PBB-P2 di Kabupaten Karawang bahwa loket layanan pembayaran Pajak Bumi dan Bangunan Tahap IV dibuka mulai tanggal 15 Oktober 2026 hingga 15 Desember 2026.

Pembayaran dapat dilakukan melalui loket kantor BAPENDA Karawang, mobil layanan keliling di setiap kantor kecamatan, Bank BJB (teller, ATM, mobile banking), serta seluruh minimarket mitra (Indomaret dan Alfamart). Pastikan melakukan pembayaran sebelum jatuh tempo guna menghindari denda keterlambatan administrasi.`
    },
    {
      id: "pengumuman-2",
      date: "2026-10-08",
      dateFormatted: "08 Okt 2026",
      title: "Perpanjangan Layanan Cek PBB Online (Info Maintanance)",
      category: "pengumuman",
      summary: "Informasi pemeliharaan sistem data center BAPENDA Karawang dan perpanjangan jam layanan cek digital.",
      content: `Sehubungan dengan peningkatan kapasitas bandwidth dan keamanan basis data pajak daerah, layanan server Cek PBB Online akan menjalani pemeliharaan berkala (system maintenance) pada hari Sabtu, 10 Oktober 2026 pukul 22.00 WIB hingga Minggu, 11 Oktober 2026 pukul 04.00 WIB.

Selama periode tersebut, beberapa fitur pengecekan NOP mungkin mengalami jeda sesaat. Seluruh layanan akan kembali beroperasi normal penuh pada hari Minggu pagi. Mohon maaf atas ketidaknyamanan yang terjadi.`
    },
    {
      id: "pengumuman-3",
      date: "2026-10-01",
      dateFormatted: "01 Okt 2026",
      title: "Himbauan Pembayaran PBB-P2 Tepat Waktu",
      category: "pengumuman",
      summary: "Himbauan resmi BAPENDA Karawang untuk melunasi kewajiban PBB-P2 guna mendukung kelancaran program pembangunan daerah.",
      content: `Pemerintah Kabupaten Karawang melalui BAPENDA menghimbau seluruh masyarakat pemilik tanah dan bangunan di Kabupaten Karawang untuk melunasi PBB-P2 tepat waktu sebelum tanggal jatuh tempo.

Dana penerimaan PBB-P2 yang terkumpul dikembalikan sepenuhnya kepada masyarakat dalam bentuk pembangunan infrastruktur jalan, fasilitas kesehatan gratis, penerangan jalan umum, dan peningkatan pelayanan publik di seluruh kecamatan Kabupaten Karawang. Pajak Kita, Untuk Pembangunan Karawang!`
    }
  ],

  regulasi: [
    {
      id: "regulasi-1",
      number: "Perda No. 11 Tahun 2021",
      year: 2021,
      title: "Perda Kab.Karawang No. 11 Tahun 2021 (Perubahan atas Perda No. 16 Tahun 2016)",
      category: "regulasi",
      summary: "Peraturan Daerah Kabupaten Karawang Nomor 11 Tahun 2021 tentang Perubahan Atas Peraturan Daerah Nomor 16 Tahun 2016 tentang Pajak Daerah, khususnya penyesuaian tarif dan klasifikasi PBB-P2.",
      content: `Peraturan Daerah Kabupaten Karawang No. 11 Tahun 2021 mengatur tentang:
1. Ketentuan umum dan subjek Pajak Bumi dan Bangunan Perdesaan dan Perkotaan.
2. Penyesuaian Nilai Jual Objek Pajak Tidak Kena Pajak (NJOPTKP) di Kabupaten Karawang.
3. Struktur tarif proporsional berdasarkan klasifikasi peruntukan tanah dan bangunan.
4. Tata cara pemberian keringanan dan pembebasan pajak bagi lahan pertanian produktif dan warga berpenghasilan rendah.
Dokumen resmi dapat diakses dan diunduh di JDIH Kabupaten Karawang.`
    },
    {
      id: "regulasi-2",
      number: "Perbup No. 77 Tahun 2021",
      year: 2021,
      title: "Perbup Karawang No. 77 Tahun 2021",
      category: "regulasi",
      summary: "Peraturan Bupati Karawang Nomor 77 Tahun 2021 tentang Petunjuk Pelaksanaan Pemungutan dan Pengelolaan Pajak Bumi dan Bangunan Perdesaan dan Perkotaan.",
      content: `Peraturan Bupati Karawang No. 77 Tahun 2021 mengatur:
1. Prosedur pendaftaran dan pendataan objek pajak baru.
2. Tata cara pembetulan, pembatalan, dan pengurangan ketetapan pada SPPT PBB-P2.
3. Mekanisme pelimpahan dan verifikasi data mutasi kepemilikan tanah.
4. Standar operasional prosedur penagihan dan pengawasan kepatuhan wajib pajak di tingkat kecamatan dan desa.`
    },
    {
      id: "regulasi-3",
      number: "Peraturan Bupati PBB-P2",
      year: 2020,
      title: "Peraturan Bupati tentang PBB-P2",
      category: "regulasi",
      summary: "Peraturan Bupati Karawang mengenai Petunjuk Teknis Penilaian dan Pemutakhiran Zona Nilai Tanah (ZNT) untuk penetapan PBB-P2.",
      content: `Peraturan Bupati tentang Pedoman Teknis Penilaian dan Pemutakhiran Zona Nilai Tanah memuat:
1. Metode penentuan Nilai Indikasi Rata-rata (NIR) pada setiap zona wilayah.
2. Klasifikasi nilai bangunan berdasarkan bahan konstruksi dan fungsi peruntukan.
3. Transparansi perhitungan tagihan PBB-P2 yang adil dan berkeadilan bagi seluruh lapisan masyarakat.`
    }
  ],

  faq: [
    {
      id: "faq-1",
      question: "Bagaimana cara cek PBB Online?",
      answer: `Untuk mengecek tagihan PBB-P2 secara online di Kabupaten Karawang:
1. Kunjungi portal resmi BAPENDA Karawang atau menu Peta PBB-P2 pada dashboard ini.
2. Masukkan 18 digit Nomor Objek Pajak (NOP) yang tercantum pada lembar SPPT PBB Anda.
3. Pilih tahun pajak yang ingin diperiksa (misalnya 2026).
4. Klik tombol "Cari" atau "Cek Tagihan" untuk melihat rincian jumlah ketetapan, realisasi pembayaran, dan sisa tagihan secara real-time.`
    },
    {
      id: "faq-2",
      question: "Bagaimana cara melihat tagihan PBB-P2?",
      answer: `Tagihan PBB-P2 dapat dilihat melalui:
1. Surat Pemberitahuan Pajak Terhutang (SPPT) fisik yang dibagikan oleh petugas desa/kelurahan atau RT/RW setempat setiap awal tahun pajak.
2. Fitur Cek Tagihan PBB Online pada portal BAPENDA Kabupaten Karawang.
3. Aplikasi perbankan digital (Mobile Banking Bank BJB, Mandiri, BCA, BRI, BNI) dengan memasukkan NOP pada menu Pembayaran Pajak Daerah.`
    },
    {
      id: "faq-3",
      question: "Bagaimana cara melakukan pembayaran?",
      answer: `Pembayaran PBB-P2 Kabupaten Karawang dapat dilakukan melalui berbagai kanal resmi yang mudah diakses:
1. Bank BJB (Teller, ATM, BJB Digi, dan QRIS)
2. Kantor Pos Indonesia di seluruh cabang
3. Gerai minimarket retail (Indomaret dan Alfamart)
4. Platform E-Commerce dan Dompet Digital (Tokopedia, Bukalapak, Shopee, GoPay, OVO, Dana)
5. Petugas Kolektor Pajak resmi di kantor Desa/Kelurahan setempat.`
    },
    {
      id: "faq-4",
      question: "Bagaimana jika data objek pajak tidak sesuai?",
      answer: `Apabila nama wajib pajak, alamat objek, atau luas tanah/bangunan pada SPPT tidak sesuai dengan kondisi riil:
1. Siapkan dokumen pendukung: Fotokopi KTP, fotokopi Sertifikat Tanah/AJB/Girik, dan bukti lunas PBB tahun sebelumnya.
2. Isi formulir permohonan pembetulan/mutasi SPPT (SPOP dan LSPOP) yang tersedia di kantor desa atau BAPENDA.
3. Serahkan berkas ke loket pelayanan BAPENDA Kabupaten Karawang untuk diverifikasi dan diterbitkan SPPT pembetulan.`
    }
  ]
};

/**
 * Filter data Informasi berdasarkan kategori dan rentang tanggal
 */
function getInformasiFilteredData(activeTab, startDateStr, endDateStr) {
  const filterTab = (activeTab || 'semua').toLowerCase();
  const start = startDateStr || '2026-01-01';
  const end = endDateStr || '2026-12-31';

  // Filter items by date
  const filterByDate = (item) => {
    if (!item.date) return true;
    return item.date >= start && item.date <= end;
  };

  const beritaFiltered = INFORMASI_BASE_DATA.berita.filter(filterByDate);
  const pengumumanFiltered = INFORMASI_BASE_DATA.pengumuman.filter(filterByDate);
  const regulasiList = INFORMASI_BASE_DATA.regulasi; // regulations are permanent
  const faqList = INFORMASI_BASE_DATA.faq; // FAQs are permanent

  return {
    tab: filterTab,
    startDate: start,
    endDate: end,
    berita: beritaFiltered,
    pengumuman: pengumumanFiltered,
    regulasi: regulasiList,
    faq: faqList,
    hasContent: (filterTab === 'semua' && (beritaFiltered.length > 0 || pengumumanFiltered.length > 0)) ||
                (filterTab === 'berita' && beritaFiltered.length > 0) ||
                (filterTab === 'pengumuman' && pengumumanFiltered.length > 0) ||
                (filterTab === 'regulasi' && regulasiList.length > 0) ||
                (filterTab === 'faq' && faqList.length > 0)
  };
}

if (typeof window !== 'undefined') {
  window.INFORMASI_BASE_DATA = INFORMASI_BASE_DATA;
  window.getInformasiFilteredData = getInformasiFilteredData;
}
if (typeof globalThis !== 'undefined') {
  globalThis.INFORMASI_BASE_DATA = INFORMASI_BASE_DATA;
  globalThis.getInformasiFilteredData = getInformasiFilteredData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INFORMASI_BASE_DATA, getInformasiFilteredData };
}
