/**
 * DATA REALISASI PENGGUNAAN DANA PBB-P2
 * BAPENDA KABUPATEN KARAWANG
 * Baseline Tahun Anggaran 2026
 */

const PENGGUNAAN_BASE_DATA = {
  tahun: 2026,
  totalPenerimaan: 292942200000,
  totalPenggunaan: 247560800000,
  sisaDana: 45381400000,
  persenTerserap: 84.5,
  categories: [
    {
      id: "infrastruktur",
      name: "Pembangunan Insfrastruktur",
      realisasi: 104667000000,
      persen: 42.3,
      color: "#2563eb",
      description: "Pembangunan dan pemeliharaan jalan, jembatan, drainase, serta fasilitas fisik wilayah."
    },
    {
      id: "pelayanan",
      name: "Pelayanan Publik",
      realisasi: 70864000000,
      persen: 28.7,
      color: "#06b6d4",
      description: "Peningkatan kualitas layanan administrasi kependudukan, perizinan, dan fasilitas umum."
    },
    {
      id: "pemberdayaan",
      name: "Pemberdayaan Masyarakat",
      realisasi: 39594000000,
      persen: 14.2,
      color: "#eab308",
      description: "Program ketahanan ekonomi lokal, pelatihan wirausaha desa, dan bantuan sosial produktif."
    },
    {
      id: "administrasi",
      name: "Administrasi Pemerintah",
      realisasi: 21992000000,
      persen: 8.9,
      color: "#f97316",
      description: "Operasional tata kelola pemerintahan, integrasi sistem informasi perpajakan daerah."
    },
    {
      id: "lainnya",
      name: "Lainnya",
      realisasi: 10443800000,
      persen: 3.9,
      color: "#a855f7",
      description: "Dana cadangan penanggulangan bencana, pembinaan aparatur dan kegiatan pendukung lainnya."
    }
  ],
  monthlyPoints: [
    { month: 1, label: "Jan", penerimaanKumulatif: 165000000000, penggunaanKumulatif: 72000000000, penerimaanBulanan: 165000000000, penggunaanBulanan: 72000000000 },
    { month: 2, label: "Feb", penerimaanKumulatif: 192000000000, penggunaanKumulatif: 72000000000, penerimaanBulanan: 27000000000, penggunaanBulanan: 0 },
    { month: 3, label: "Mar", penerimaanKumulatif: 192000000000, penggunaanKumulatif: 72000000000, penerimaanBulanan: 0, penggunaanBulanan: 0 },
    { month: 4, label: "Apr", penerimaanKumulatif: 192000000000, penggunaanKumulatif: 72000000000, penerimaanBulanan: 0, penggunaanBulanan: 0 },
    { month: 5, label: "Mei", penerimaanKumulatif: 195000000000, penggunaanKumulatif: 72000000000, penerimaanBulanan: 3000000000, penggunaanBulanan: 0 },
    { month: 6, label: "Jun", penerimaanKumulatif: 230000000000, penggunaanKumulatif: 138000000000, penerimaanBulanan: 35000000000, penggunaanBulanan: 66000000000 },
    { month: 7, label: "Jul", penerimaanKumulatif: 290000000000, penggunaanKumulatif: 195000000000, penerimaanBulanan: 60000000000, penggunaanBulanan: 57000000000 },
    { month: 8, label: "Agust", penerimaanKumulatif: 290000000000, penggunaanKumulatif: 195000000000, penerimaanBulanan: 0, penggunaanBulanan: 0 },
    { month: 9, label: "Sep", penerimaanKumulatif: 310000000000, penggunaanKumulatif: 225000000000, penerimaanBulanan: 20000000000, penggunaanBulanan: 30000000000 },
    { month: 10, label: "Okt", penerimaanKumulatif: 335000000000, penggunaanKumulatif: 255000000000, penerimaanBulanan: 25000000000, penggunaanBulanan: 30000000000 },
    { month: 11, label: "Nov", penerimaanKumulatif: 355000000000, penggunaanKumulatif: 272000000000, penerimaanBulanan: 20000000000, penggunaanBulanan: 17000000000 },
    { month: 12, label: "Des", penerimaanKumulatif: 382000000000, penggunaanKumulatif: 292000000000, penerimaanBulanan: 27000000000, penggunaanBulanan: 20000000000 }
  ]
};

/**
 * Format Rupiah Standar Indonesia: Rp292.942.200.000,00
 */
function formatRupiahId(nominal) {
  if (nominal === null || nominal === undefined || isNaN(nominal)) return "—";
  return "Rp" + Math.round(nominal).toLocaleString("id-ID") + ",00";
}

/**
 * Format Rupiah Ringkas untuk Axis Grafik: Rp100 M, Rp200 M
 */
function formatRupiahShort(nominal) {
  if (nominal === 0) return "Rp0";
  if (nominal >= 1000000000) {
    const m = nominal / 1000000000;
    return `Rp${Math.round(m)} M`;
  }
  if (nominal >= 1000000) {
    return `Rp${Math.round(nominal / 1000000)} jt`;
  }
  return `Rp${nominal}`;
}

/**
 * Format Persentase Indonesia: 84,5%
 */
function formatPersenId(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return "—";
  return pct.toFixed(1).replace(".", ",") + "%";
}

/**
 * Evaluasi data berdasarkan rentang tanggal yang dipilih
 */
function getPenggunaanDataForRange(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) {
    startDateStr = "2026-01-01";
    endDateStr = "2026-12-31";
  }

  const startYear = parseInt(startDateStr.slice(0, 4), 10);
  const endYear = parseInt(endDateStr.slice(0, 4), 10);

  // Jika tahun di luar 2026, berikan status data belum tersedia
  if (startYear !== 2026 && endYear !== 2026) {
    return {
      available: false,
      message: `Data realisasi penggunaan dana untuk tahun ${startYear}${startYear !== endYear ? ' - ' + endYear : ''} belum tersedia di sistem. Silakan pilih Tahun Anggaran 2026.`,
      startDate: startDateStr,
      endDate: endDateStr,
      totalPenerimaan: null,
      totalPenggunaan: null,
      sisaDana: null,
      persenTerserap: null,
      categories: [],
      monthlyPoints: []
    };
  }

  const startMonth = (startYear < 2026) ? 1 : Math.max(1, parseInt(startDateStr.slice(5, 7), 10));
  const endMonth = (endYear > 2026) ? 12 : Math.min(12, parseInt(endDateStr.slice(5, 7), 10));

  // Jika rentang meliputi full 12 bulan 2026, gunakan angka baseline persis screenshot
  const isFullYear = (startMonth === 1 && endMonth === 12);

  if (isFullYear) {
    return {
      available: true,
      isFullYear: true,
      startDate: startDateStr,
      endDate: endDateStr,
      startMonth: 1,
      endMonth: 12,
      totalPenerimaan: PENGGUNAAN_BASE_DATA.totalPenerimaan,
      totalPenerimaanFormatted: formatRupiahId(PENGGUNAAN_BASE_DATA.totalPenerimaan),
      totalPenggunaan: PENGGUNAAN_BASE_DATA.totalPenggunaan,
      totalPenggunaanFormatted: formatRupiahId(PENGGUNAAN_BASE_DATA.totalPenggunaan),
      sisaDana: PENGGUNAAN_BASE_DATA.sisaDana,
      sisaDanaFormatted: formatRupiahId(PENGGUNAAN_BASE_DATA.sisaDana),
      persenTerserap: PENGGUNAAN_BASE_DATA.persenTerserap,
      persenTerserapFormatted: formatPersenId(PENGGUNAAN_BASE_DATA.persenTerserap),
      categories: PENGGUNAAN_BASE_DATA.categories.map(cat => ({
        ...cat,
        realisasiFormatted: formatRupiahId(cat.realisasi),
        persenFormatted: formatPersenId(cat.persen)
      })),
      monthlyPoints: PENGGUNAAN_BASE_DATA.monthlyPoints.map(p => ({
        ...p,
        isInRange: true
      }))
    };
  }

  // Hitung proporsional kumulatif untuk sub-rentang bulan
  // Ambil penerimaan kumulatif & penggunaan kumulatif hingga endMonth
  const targetPoint = PENGGUNAAN_BASE_DATA.monthlyPoints[endMonth - 1];
  const prevPoint = startMonth > 1 ? PENGGUNAAN_BASE_DATA.monthlyPoints[startMonth - 2] : null;

  let penerimaanRange = targetPoint.penerimaanKumulatif - (prevPoint ? prevPoint.penerimaanKumulatif : 0);
  let penggunaanRange = targetPoint.penggunaanKumulatif - (prevPoint ? prevPoint.penggunaanKumulatif : 0);

  // Jika range start = 1, sesuaikan proporsi terhadap baseline screenshot
  if (startMonth === 1) {
    const ratio = targetPoint.penerimaanKumulatif / PENGGUNAAN_BASE_DATA.monthlyPoints[11].penerimaanKumulatif;
    penerimaanRange = Math.round(PENGGUNAAN_BASE_DATA.totalPenerimaan * ratio);
    penggunaanRange = Math.round(PENGGUNAAN_BASE_DATA.totalPenggunaan * (targetPoint.penggunaanKumulatif / PENGGUNAAN_BASE_DATA.monthlyPoints[11].penggunaanKumulatif));
  }

  const sisa = penerimaanRange - penggunaanRange;
  const persen = penerimaanRange > 0 ? (penggunaanRange / penerimaanRange) * 100 : 0;

  // Proporsi kategori terhadap penggunaanRange
  const categories = PENGGUNAAN_BASE_DATA.categories.map(cat => {
    const catRatio = cat.realisasi / PENGGUNAAN_BASE_DATA.totalPenggunaan;
    const catRealisasi = Math.round(penggunaanRange * catRatio);
    return {
      ...cat,
      realisasi: catRealisasi,
      realisasiFormatted: formatRupiahId(catRealisasi),
      persenFormatted: formatPersenId(cat.persen)
    };
  });

  return {
    available: true,
    isFullYear: false,
    startDate: startDateStr,
    endDate: endDateStr,
    startMonth,
    endMonth,
    totalPenerimaan: penerimaanRange,
    totalPenerimaanFormatted: formatRupiahId(penerimaanRange),
    totalPenggunaan: penggunaanRange,
    totalPenggunaanFormatted: formatRupiahId(penggunaanRange),
    sisaDana: sisa,
    sisaDanaFormatted: formatRupiahId(sisa),
    persenTerserap: persen,
    persenTerserapFormatted: formatPersenId(persen),
    categories,
    monthlyPoints: PENGGUNAAN_BASE_DATA.monthlyPoints.map(p => ({
      ...p,
      isInRange: p.month >= startMonth && p.month <= endMonth
    }))
  };
}
