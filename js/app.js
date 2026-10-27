/**
 * PBB-P2 Karawang Dashboard
 * Interactive Controller (Kabupaten -> Kecamatan -> Desa)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  let currentView = 'kabupaten'; // 'kabupaten' or 'kecamatan'
  let selectedKecamatanId = 'karawang-barat';
  let selectedDesaId = 'cilebar-total'; // or specific village id e.g. 'sukaratu'

  // Map Pan/Zoom State - Kabupaten
  let kabZoom = 1.0;
  let kabPanX = 0;
  let kabPanY = 0;
  let kabDragging = false;
  let kabStartX, kabStartY;

  // Map Pan/Zoom State - Cilebar
  let cilZoom = 1.0;
  let cilPanX = 0;
  let cilPanY = 0;
  let cilDragging = false;
  let cilStartX, cilStartY;

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const viewKabupaten = document.getElementById('viewKabupaten');
  const viewKecamatan = document.getElementById('viewKecamatan');
  const viewPenggunaan = document.getElementById('viewPenggunaan');
  const viewInformasi = document.getElementById('viewInformasi');
  const filterTahunInformasi = document.getElementById('filterTahunInformasi');
  const filterBulanInformasi = document.getElementById('filterBulanInformasi');
  const filterStartDateInformasi = document.getElementById('filterStartDateInformasi');
  const filterEndDateInformasi = document.getElementById('filterEndDateInformasi');
  const btnResetFilterInformasi = document.getElementById('btnResetFilterInformasi');
  const filterTahunPenggunaan = document.getElementById('filterTahunPenggunaan');
  const filterBulanPenggunaan = document.getElementById('filterBulanPenggunaan');
  const filterStartDatePenggunaan = document.getElementById('filterStartDatePenggunaan');
  const filterEndDatePenggunaan = document.getElementById('filterEndDatePenggunaan');
  const btnResetFilterPenggunaan = document.getElementById('btnResetFilterPenggunaan');

  // Navigation Buttons
  const btnBackToKabupaten = document.getElementById('btnBackToKabupaten');
  const btnBackToDaftarDesa = document.getElementById('btnBackToDaftarDesa');
  const btnOpenKecamatanDetail = document.getElementById('btnOpenKecamatanDetail');

  // Kabupaten View Elements
  const mapSvgKab = document.getElementById('karawangMapSvg');
  const mapContainerKab = document.getElementById('mapSvgContainer');
  const polygonsGroupKab = document.getElementById('mapPolygonsGroup');
  const labelsGroupKab = document.getElementById('mapLabelsGroup');
  const kecamatanList = document.getElementById('kecamatanList');
  const searchInputKab = document.getElementById('searchInput');

  const mapPopupKab = document.getElementById('mapPopupCard');
  const popupKecName = document.getElementById('popupKecamatanName');
  const popupTargetKab = document.getElementById('popupTarget');
  const popupRealisasiKab = document.getElementById('popupRealisasi');
  const popupSisaKab = document.getElementById('popupSisa');
  const popupCapaianKab = document.getElementById('popupCapaian');
  const popupBadgeKab = document.getElementById('popupBadge');
  const popupBadgeTextKab = document.getElementById('popupBadgeText');
  const popupHeaderClickable = document.getElementById('popupHeaderClickable');

  const detailBannerKab = document.getElementById('detailBanner');
  const detailTitleKab = document.getElementById('detailKecamatanName');
  const detailBadgeKab = document.getElementById('detailBadge');
  const detailTargetKab = document.getElementById('detailTarget');
  const detailRealisasiKab = document.getElementById('detailRealisasi');
  const detailSisaKab = document.getElementById('detailSisa');
  const detailCapaianKab = document.getElementById('detailCapaian');
  const detailProgressFillKab = document.getElementById('detailProgressFill');
  const noticeTitleKab = document.getElementById('noticeTitle');
  const noticeDescKab = document.getElementById('noticeDesc');

  // Kecamatan View Elements
  const mapSvgCil = document.getElementById('cilebarMapSvg');
  const mapContainerCil = document.getElementById('desaMapContainer');
  const polygonsGroupCil = document.getElementById('cilebarPolygonsGroup');
  const labelsGroupCil = document.getElementById('cilebarLabelsGroup');
  const desaTableBody = document.getElementById('desaTableBody');
  const searchDesaInput = document.getElementById('searchDesaInput');

  const desaPopup = document.getElementById('desaPopupCard');
  const desaPopupName = document.getElementById('desaPopupName');
  const desaPopupTarget = document.getElementById('desaPopupTarget');
  const desaPopupRealisasi = document.getElementById('desaPopupRealisasi');
  const desaPopupSisa = document.getElementById('desaPopupSisa');
  const desaPopupCapaian = document.getElementById('desaPopupCapaian');
  const desaPopupBadge = document.getElementById('desaPopupBadge');
  const desaPopupBadgeText = document.getElementById('desaPopupBadgeText');

  // Kecamatan 5 Summary Cards
  const kecSumTarget = document.getElementById('kecSumTarget');
  const kecSumRealisasi = document.getElementById('kecSumRealisasi');
  const kecSumSisa = document.getElementById('kecSumSisa');
  const kecSumCapaian = document.getElementById('kecSumCapaian');
  const donutProgressKec = document.getElementById('donutProgressKec');
  const donutKecCenterPct = document.getElementById('donutKecCenterPct');
  const kecSumJumlahDesa = document.getElementById('kecSumJumlahDesa');

  // Bottom Detail Desa Elements
  const desaPillDot = document.getElementById('desaPillDot');
  const desaPillTitle = document.getElementById('desaPillTitle');
  const desaPillStatusTag = document.getElementById('desaPillStatusTag');
  const desaDetailTarget = document.getElementById('desaDetailTarget');
  const desaDetailRealisasi = document.getElementById('desaDetailRealisasi');
  const desaDetailSisa = document.getElementById('desaDetailSisa');
  const donutDesaBottom = document.getElementById('donutDesaBottom');
  const donutDesaBottomCenterPct = document.getElementById('donutDesaBottomCenterPct');
  const desaAdvisoryText = document.getElementById('desaAdvisoryText');
  const valObyekTerdaftar = document.getElementById('valObyekTerdaftar');
  const valObyekLunas = document.getElementById('valObyekLunas');
  const valObyekBelumLunas = document.getElementById('valObyekBelumLunas');
  const valBreakdownPct = document.getElementById('valBreakdownPct');
  const barBreakdownFill = document.getElementById('barBreakdownFill');
  const desaDetailHeading = document.getElementById('desaDetailHeading');
  const desaDetailKecamatanBadge = document.getElementById('desaDetailKecamatanBadge');
  const desaDetailYearText = document.getElementById('desaDetailYearText');

  // Period Filter Elements - Kabupaten
  const filterTahunKab = document.getElementById('filterTahunKab') || document.getElementById('yearSelectKabupaten');
  const filterBulanKab = document.getElementById('filterBulanKab');
  const filterStartDateKab = document.getElementById('filterStartDateKab');
  const filterEndDateKab = document.getElementById('filterEndDateKab');
  const btnResetFilterKab = document.getElementById('btnResetFilterKab');

  // Period Filter Elements - Kecamatan
  const filterTahunKec = document.getElementById('filterTahunKec') || document.getElementById('yearSelectKecamatan');
  const filterBulanKec = document.getElementById('filterBulanKec');
  const filterStartDateKec = document.getElementById('filterStartDateKec');
  const filterEndDateKec = document.getElementById('filterEndDateKec');
  const btnResetFilterKec = document.getElementById('btnResetFilterKec');

  // Backwards compatibility aliases
  const yearSelectKab = filterTahunKab;
  const yearSelectKec = filterTahunKec;

  // Map Mode Toggle (Peta / Satelit)
  const btnModePeta = document.getElementById('btnModePeta');
  const btnModeSatelit = document.getElementById('btnModeSatelit');
  const btnMapFullscreen = document.getElementById('btnMapFullscreen');

  // =========================================================================
  // CENTRALIZED RUPIAH FORMATTER (STANDAR INDONESIA: Rp100.000.000,00)
  // =========================================================================
  function formatRupiah(val) {
    if (val === null || val === undefined || val === '') return '—';
    let num;
    if (typeof val === 'number') {
      num = val;
    } else {
      const str = String(val).trim();
      if (str === '' || str === '—') return '—';
      const cleanStr = str.replace(/[^0-9,-]/g, '').replace(',', '.');
      num = parseFloat(cleanStr);
    }
    if (isNaN(num)) return '—';
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const formatted = absNum.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return (isNegative ? '-Rp' : 'Rp') + formatted;
  }
  window.formatRupiah = formatRupiah;
  window.formatRp = formatRupiah;

  function formatPct(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return Number(num).toFixed(1).replace('.', ',') + '%';
  }

  // =========================================================================
  // KABUPATEN FINANCIAL & RECAP LOGIC
  // =========================================================================
  function updateKabupatenFinancials() {
    let sumTarget = 0;
    let sumRealisasi = 0;

    if (typeof KECAMATAN_DATA !== 'undefined' && Array.isArray(KECAMATAN_DATA)) {
      KECAMATAN_DATA.forEach(k => {
        sumTarget += (Number(k.target) || 0);
        sumRealisasi += (Number(k.realisasi) || 0);
      });
    }

    const sisa = Math.max(0, sumTarget - sumRealisasi);
    const capaianPct = sumTarget > 0 ? (sumRealisasi / sumTarget) * 100 : null;

    const elTarget = document.getElementById('totalTargetVal');
    const elRealisasi = document.getElementById('totalRealisasiVal');
    const elSisa = document.getElementById('totalSisaTagihanVal');
    const elCapaian = document.getElementById('totalCapaianVal');
    const donutKab = document.getElementById('donutProgressKab');

    if (elTarget) elTarget.textContent = formatRupiah(sumTarget);
    if (elRealisasi) elRealisasi.textContent = formatRupiah(sumRealisasi);
    if (elSisa) elSisa.textContent = formatRupiah(sisa);
    if (elCapaian) {
      elCapaian.textContent = capaianPct !== null ? formatPct(capaianPct) : '—';
    }

    if (donutKab && capaianPct !== null) {
      donutKab.setAttribute('stroke-dasharray', `${Math.min(100, capaianPct)}, 100`);
      const donutColor = capaianPct >= 100 ? '#2ea868'
        : capaianPct >= 70 ? '#f5d547'
          : capaianPct >= 30 ? '#f59e42'
            : '#ea3838';
      donutKab.setAttribute('stroke', donutColor);
    }

    updateKabupatenRecap();
  }

  function updateKabupatenRecap() {
    let green = 0, yellow = 0, orange = 0, red = 0;
    if (typeof KECAMATAN_DATA !== 'undefined' && Array.isArray(KECAMATAN_DATA)) {
      KECAMATAN_DATA.forEach(item => {
        const tier = getTierFromPct(item.capaian);
        if (tier === 'green') green++;
        else if (tier === 'yellow') yellow++;
        else if (tier === 'orange') orange++;
        else if (tier === 'red') red++;
      });
    }

    const elGreen = document.getElementById('rekapCountGreen');
    const elYellow = document.getElementById('rekapCountYellow');
    const elOrange = document.getElementById('rekapCountOrange');
    const elRed = document.getElementById('rekapCountRed');

    if (elGreen) elGreen.textContent = `${green} Kecamatan`;
    if (elYellow) elYellow.textContent = `${yellow} Kecamatan`;
    if (elOrange) elOrange.textContent = `${orange} Kecamatan`;
    if (elRed) elRed.textContent = `${red} Kecamatan`;
  }

  // =========================================================================
  // PERIOD FILTER & DATE RANGE PICKER (MODERN TWO-MONTH POPUP CALENDAR)
  // =========================================================================
  const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const MONTH_SHORT_ID = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const WEEKDAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const TODAY_STR = '2026-10-16';

  function formatDateId(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parts[2];
    const monthName = MONTH_SHORT_ID[m] || parts[1];
    return `${d} ${monthName} ${y}`;
  }

  function formatRangeDisplay(startDate, endDate) {
    if (!startDate && !endDate) return 'Pilih Rentang Tanggal';
    if (startDate && !endDate) return `${formatDateId(startDate)} – ...`;
    return `${formatDateId(startDate)} – ${formatDateId(endDate)}`;
  }

  // Active dates state across Kab and Kec
  let currentFilterStart = '2026-01-01';
  let currentFilterEnd = '2026-12-31';

  function syncFilters(source) {
    const allStarts = [filterStartDateKab, filterStartDateKec, filterStartDatePenggunaan, filterStartDateInformasi];
    const allEnds = [filterEndDateKab, filterEndDateKec, filterEndDatePenggunaan, filterEndDateInformasi];
    const allTahuns = [filterTahunKab, filterTahunKec, filterTahunPenggunaan, filterTahunInformasi];
    const allBulans = [filterBulanKab, filterBulanKec, filterBulanPenggunaan, filterBulanInformasi];

    allStarts.forEach(el => { if (el) el.value = currentFilterStart; });
    allEnds.forEach(el => { if (el) el.value = currentFilterEnd; });
    allTahuns.forEach(el => { if (el) el.value = currentFilterStart.slice(0, 4); });
    allBulans.forEach(el => { if (el) el.value = currentFilterStart.slice(5, 7); });

    const currentYear = currentFilterStart ? currentFilterStart.slice(0, 4) : '2026';
    if (desaDetailYearText) desaDetailYearText.textContent = currentYear;

    // Update all display buttons
    const rangeText = formatRangeDisplay(currentFilterStart, currentFilterEnd);
    const dispKab = document.getElementById('dateRangeTextKab') || document.getElementById('dateRangeDisplayKab');
    const dispKec = document.getElementById('dateRangeTextKec') || document.getElementById('dateRangeDisplayKec');
    const dispPenggunaan = document.getElementById('dateRangeTextPenggunaan') || document.getElementById('dateRangeDisplayPenggunaan');
    if (dispKab) dispKab.textContent = rangeText;
    if (dispKec) dispKec.textContent = rangeText;
    if (dispPenggunaan) dispPenggunaan.textContent = rangeText;
    const dispInformasi = document.getElementById('dateRangeTextInformasi') || document.getElementById('dateRangeDisplayInformasi');
    if (dispInformasi) dispInformasi.textContent = rangeText;

    applyPeriodFilter();
  }

  function applyPeriodFilter() {
    const startVal = filterStartDateKab ? filterStartDateKab.value : '';
    const endVal = filterEndDateKab ? filterEndDateKab.value : '';

    // Validate start <= end if both provided
    if (startVal && endVal && startVal > endVal) {
      if (filterEndDateKab) filterEndDateKab.value = startVal;
      if (filterEndDateKec) filterEndDateKec.value = startVal;
      if (filterEndDatePenggunaan) filterEndDatePenggunaan.value = startVal;
    }

    updateKabupatenFinancials();

    if (selectedKecamatanId) {
      selectKecamatan(selectedKecamatanId);
    }

    if (currentView === 'kecamatan' && activeKecamatanId) {
      initKecamatanView(activeKecamatanId);
    }

    if (currentView === 'penggunaan' || (viewPenggunaan && viewPenggunaan.style.display !== 'none')) {
      renderPenggunaanPajak(currentFilterStart, currentFilterEnd);
    }
  }

  function resetPeriodFilters() {
    currentFilterStart = '2026-01-01';
    currentFilterEnd = '2026-12-31';

    [filterTahunKab, filterTahunKec, filterTahunPenggunaan].forEach(el => { if (el) el.value = '2026'; });
    [filterBulanKab, filterBulanKec, filterBulanPenggunaan].forEach(el => { if (el) el.value = 'all'; });
    [filterStartDateKab, filterStartDateKec, filterStartDatePenggunaan].forEach(el => { if (el) el.value = ''; });
    [filterEndDateKab, filterEndDateKec, filterEndDatePenggunaan].forEach(el => { if (el) el.value = ''; });

    const defaultRangeText = '01 Jan 2026 – 31 Des 2026';
    const dispKab = document.getElementById('dateRangeTextKab') || document.getElementById('dateRangeDisplayKab');
    const dispKec = document.getElementById('dateRangeTextKec') || document.getElementById('dateRangeDisplayKec');
    const dispPenggunaan = document.getElementById('dateRangeTextPenggunaan') || document.getElementById('dateRangeDisplayPenggunaan');
    if (dispKab) dispKab.textContent = defaultRangeText;
    if (dispKec) dispKec.textContent = defaultRangeText;
    if (dispPenggunaan) dispPenggunaan.textContent = defaultRangeText;
    const dispInformasi = document.getElementById('dateRangeTextInformasi') || document.getElementById('dateRangeDisplayInformasi');
    if (dispInformasi) dispInformasi.textContent = defaultRangeText;

    if (desaDetailYearText) desaDetailYearText.textContent = '2026';

    if (kabPicker) kabPicker.reset();
    if (kecPicker) kecPicker.reset();
    if (penggunaanPicker) penggunaanPicker.reset();
    if (informasiPicker) informasiPicker.reset();

    applyPeriodFilter();
  }

  // Date Range Picker Class
  class DateRangePicker {
    constructor(prefix) {
      this.prefix = prefix; // 'Kab' or 'Kec'
      this.triggerBtn = document.getElementById(`dateRangeTrigger${prefix}`) || document.getElementById(`btnDateRangePicker${prefix}`);
      this.popupEl = document.getElementById(`dateRangePopup${prefix}`);
      this.displayEl = document.getElementById(`dateRangeText${prefix}`) || document.getElementById(`dateRangeDisplay${prefix}`);
      this.calPrevBtn = document.getElementById(`calPrevBtn${prefix}`) || document.getElementById(`calPrev${prefix}`);
      this.calNextBtn = document.getElementById(`calNextBtn${prefix}`) || document.getElementById(`calNext${prefix}`);
      this.quickMonthSelect = document.getElementById(`calMonthJump${prefix}`) || document.getElementById(`calQuickMonth${prefix}`);
      this.quickYearSelect = document.getElementById(`calYearJump${prefix}`) || document.getElementById(`calQuickYear${prefix}`);
      this.monthsContainer = document.getElementById(`calendarMonths${prefix}`) || document.getElementById(`calendarMonthsContainer${prefix}`);
      this.previewEl = document.getElementById(`calPreviewRange${prefix}`) || document.getElementById(`calSelectionPreview${prefix}`);
      this.cancelBtn = document.getElementById(`calCancelBtn${prefix}`) || document.getElementById(`btnCalCancel${prefix}`);
      this.applyBtn = document.getElementById(`calApplyBtn${prefix}`) || document.getElementById(`btnCalApply${prefix}`);

      // Selection state
      this.draftStart = currentFilterStart;
      this.draftEnd = currentFilterEnd;
      this.hoverDate = null;

      // Calendar view state (starts at October 2026 by default)
      this.viewYear = 2026;
      this.viewMonth = 9; // October (0-indexed)

      if (this.triggerBtn && this.popupEl) {
        this.init();
      }
    }

    init() {
      this.populateJumpOptions();

      // Toggle popup on button click
      this.triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Prevent clicks inside popup from bubbling to document (which closes it)
      this.popupEl.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Prev & Next Month Navigation
      if (this.calPrevBtn) {
        this.calPrevBtn.addEventListener('click', () => {
          this.navigateMonth(-1);
        });
      }
      if (this.calNextBtn) {
        this.calNextBtn.addEventListener('click', () => {
          this.navigateMonth(1);
        });
      }

      // Quick Jump Selectors
      if (this.quickMonthSelect) {
        this.quickMonthSelect.addEventListener('change', () => {
          this.viewMonth = parseInt(this.quickMonthSelect.value, 10);
          this.renderMonths();
        });
      }
      if (this.quickYearSelect) {
        this.quickYearSelect.addEventListener('change', () => {
          this.viewYear = parseInt(this.quickYearSelect.value, 10);
          this.renderMonths();
        });
      }

      // Cancel button
      if (this.cancelBtn) {
        this.cancelBtn.addEventListener('click', () => {
          this.close(false);
        });
      }

      // Apply button
      if (this.applyBtn) {
        this.applyBtn.addEventListener('click', () => {
          this.applySelection();
        });
      }

      // Global click outside to close
      document.addEventListener('click', (e) => {
        const outPop = !this.popupEl || !this.popupEl.contains || !this.popupEl.contains(e.target); const outTrig = !this.triggerBtn || !this.triggerBtn.contains || !this.triggerBtn.contains(e.target); if (outPop && outTrig) {
          if (this.isOpen()) {
            this.close(false);
          }
        }
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close(false);
        }
      });
    }

    populateJumpOptions() {
      if (this.quickMonthSelect && this.quickMonthSelect.children.length === 0) {
        MONTH_NAMES_ID.forEach((name, idx) => {
          const opt = document.createElement('option');
          opt.value = idx;
          opt.textContent = name;
          this.quickMonthSelect.appendChild(opt);
        });
      }

      if (this.quickYearSelect && this.quickYearSelect.children.length === 0) {
        const years = [2024, 2025, 2026, 2027, 2028];
        years.forEach(y => {
          const opt = document.createElement('option');
          opt.value = y;
          opt.textContent = y;
          this.quickYearSelect.appendChild(opt);
        });
      }
    }

    isOpen() {
      return this.popupEl.style.display !== 'none';
    }

    toggle() {
      if (this.isOpen()) {
        this.close(false);
      } else {
        this.open();
      }
    }

    open() {
      // Close other open date pickers
      if (this.prefix === 'Kab') {
        if (kecPicker && kecPicker.isOpen()) kecPicker.close(false);
        if (penggunaanPicker && penggunaanPicker.isOpen()) penggunaanPicker.close(false);
      }
      if (this.prefix === 'Kec') {
        if (kabPicker && kabPicker.isOpen()) kabPicker.close(false);
        if (penggunaanPicker && penggunaanPicker.isOpen()) penggunaanPicker.close(false);
      }
      if (this.prefix === 'Penggunaan') {
        if (kabPicker && kabPicker.isOpen()) kabPicker.close(false);
        if (kecPicker && kecPicker.isOpen()) kecPicker.close(false);
      }

      // Revert draft to current active filter
      this.draftStart = currentFilterStart;
      this.draftEnd = currentFilterEnd;
      this.hoverDate = null;

      // Center view on draft start if available
      if (this.draftStart) {
        const parts = this.draftStart.split('-');
        if (parts.length === 3) {
          this.viewYear = parseInt(parts[0], 10);
          this.viewMonth = parseInt(parts[1], 10) - 1;
        }
      }

      this.popupEl.style.display = 'block';
      this.triggerBtn.classList.add('is-active');
      this.triggerBtn.setAttribute('aria-expanded', 'true');
      this.updateQuickSelectors();
      this.renderMonths();
      this.updatePreviewText();
    }

    close(applied = false) {
      this.popupEl.style.display = 'none';
      this.triggerBtn.classList.remove('is-active');
      this.triggerBtn.setAttribute('aria-expanded', 'false');
      if (!applied) {
        this.draftStart = currentFilterStart;
        this.draftEnd = currentFilterEnd;
      }
    }

    reset() {
      this.draftStart = '2026-01-01';
      this.draftEnd = '2026-12-31';
      this.viewYear = 2026;
      this.viewMonth = 0;
      this.updateQuickSelectors();
      if (this.isOpen()) {
        this.renderMonths();
        this.updatePreviewText();
      }
    }

    navigateMonth(delta) {
      this.viewMonth += delta;
      if (this.viewMonth > 11) {
        this.viewMonth = 0;
        this.viewYear += 1;
      } else if (this.viewMonth < 0) {
        this.viewMonth = 11;
        this.viewYear -= 1;
      }
      this.updateQuickSelectors();
      this.renderMonths();
    }

    updateQuickSelectors() {
      if (this.quickMonthSelect) {
        this.quickMonthSelect.value = this.viewMonth;
      }
      if (this.quickYearSelect) {
        this.quickYearSelect.value = this.viewYear;
      }
    }

    updatePreviewText() {
      if (!this.previewEl) return;
      if (!this.draftStart) {
        this.previewEl.textContent = 'Pilih tanggal mulai';
      } else if (this.draftStart && !this.draftEnd) {
        this.previewEl.textContent = `${formatDateId(this.draftStart)} – (Pilih tanggal akhir)`;
      } else {
        this.previewEl.textContent = formatRangeDisplay(this.draftStart, this.draftEnd);
      }
    }

    renderMonths() {
      if (!this.monthsContainer) return;
      this.monthsContainer.innerHTML = '';

      // Month 1
      const m1Year = this.viewYear;
      const m1Month = this.viewMonth;

      // Month 2 (next month)
      let m2Year = this.viewYear;
      let m2Month = this.viewMonth + 1;
      if (m2Month > 11) {
        m2Month = 0;
        m2Year += 1;
      }

      const m1Block = document.createElement('div');
      m1Block.className = 'calendar-month-block';
      m1Block.id = `calMonth1${this.prefix}`;

      const m2Block = document.createElement('div');
      m2Block.className = 'calendar-month-block';
      m2Block.id = `calMonth2${this.prefix}`;

      this.monthsContainer.appendChild(m1Block);
      this.monthsContainer.appendChild(m2Block);

      this.renderSingleMonth(m1Block, m1Year, m1Month);
      this.renderSingleMonth(m2Block, m2Year, m2Month);
    }

    renderSingleMonth(containerEl, year, month) {
      if (!containerEl) return;
      containerEl.innerHTML = '';

      // Month Title
      const titleEl = document.createElement('div');
      titleEl.className = 'calendar-month-title';
      titleEl.textContent = `${MONTH_NAMES_ID[month]} ${year}`;
      containerEl.appendChild(titleEl);

      // Weekdays Header
      const weekdaysEl = document.createElement('div');
      weekdaysEl.className = 'calendar-weekdays-row';
      WEEKDAY_NAMES_ID.forEach(day => {
        const d = document.createElement('div');
        d.textContent = day;
        weekdaysEl.appendChild(d);
      });
      containerEl.appendChild(weekdaysEl);

      // Days Grid
      const daysGrid = document.createElement('div');
      daysGrid.className = 'calendar-days-grid';

      // First day of month
      const firstDayIdx = new Date(year, month, 1).getDay(); // 0 is Sunday
      for (let i = 0; i < firstDayIdx; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day-cell is-empty';
        daysGrid.appendChild(emptyCell);
      }

      // Total days
      const totalDays = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= totalDays; day++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('button');
        dayCell.type = 'button';
        dayCell.className = 'calendar-day-cell';
        dayCell.textContent = day;
        dayCell.setAttribute('data-date', dayStr);

        this.applyCellClasses(dayCell, dayStr);

        // Hover effect while selecting range
        dayCell.addEventListener('mouseenter', () => {
          if (this.draftStart && !this.draftEnd) {
            this.hoverDate = dayStr;
            this.refreshGridHighlights();
          }
        });

        // Click to select
        dayCell.addEventListener('click', () => {
          this.handleDateClick(dayStr);
        });

        daysGrid.appendChild(dayCell);
      }

      containerEl.appendChild(daysGrid);
    }

    applyCellClasses(cell, dateStr) {
      cell.classList.remove('range-start', 'range-end', 'in-range', 'hover-in-range', 'is-today');

      if (dateStr === TODAY_STR) {
        cell.classList.add('is-today');
        cell.title = 'Hari Ini';
      }

      if (this.draftStart && this.draftEnd) {
        if (dateStr === this.draftStart) cell.classList.add('range-start');
        if (dateStr === this.draftEnd) cell.classList.add('range-end');
        if (dateStr > this.draftStart && dateStr < this.draftEnd) {
          cell.classList.add('in-range');
        }
      } else if (this.draftStart && !this.draftEnd) {
        if (dateStr === this.draftStart) cell.classList.add('range-start');
        if (this.hoverDate) {
          const min = this.draftStart < this.hoverDate ? this.draftStart : this.hoverDate;
          const max = this.draftStart < this.hoverDate ? this.hoverDate : this.draftStart;
          if (dateStr > min && dateStr <= max) {
            cell.classList.add('hover-in-range');
          }
        }
      }
    }

    refreshGridHighlights() {
      const allCells = this.popupEl.querySelectorAll('.calendar-day-cell[data-date]');
      allCells.forEach(cell => {
        const dateStr = cell.getAttribute('data-date');
        this.applyCellClasses(cell, dateStr);
      });
    }

    handleDateClick(dateStr) {
      if (!this.draftStart || (this.draftStart && this.draftEnd)) {
        // Start fresh selection
        this.draftStart = dateStr;
        this.draftEnd = null;
        this.hoverDate = null;
      } else {
        // Finishing range selection
        if (dateStr < this.draftStart) {
          // Auto-swap
          this.draftEnd = this.draftStart;
          this.draftStart = dateStr;
        } else {
          this.draftEnd = dateStr;
        }
        this.hoverDate = null;
      }

      this.refreshGridHighlights();
      this.updatePreviewText();
    }

    applySelection() {
      if (!this.draftStart) {
        this.close(false);
        return;
      }

      if (this.draftStart && !this.draftEnd) {
        // If only start date clicked, treat as single day range
        this.draftEnd = this.draftStart;
      }

      currentFilterStart = this.draftStart;
      currentFilterEnd = this.draftEnd;

      // Update hidden inputs for compatibility
      const targetStartInput = (this.prefix === 'Kab') ? filterStartDateKab : (this.prefix === 'Kec' ? filterStartDateKec : filterStartDatePenggunaan);
      const targetEndInput = (this.prefix === 'Kab') ? filterEndDateKab : (this.prefix === 'Kec' ? filterEndDateKec : filterEndDatePenggunaan);
      const targetTahunInput = (this.prefix === 'Kab') ? filterTahunKab : (this.prefix === 'Kec' ? filterTahunKec : filterTahunPenggunaan);
      const targetBulanInput = (this.prefix === 'Kab') ? filterBulanKab : (this.prefix === 'Kec' ? filterBulanKec : filterBulanPenggunaan);

      if (targetStartInput) targetStartInput.value = currentFilterStart;
      if (targetEndInput) targetEndInput.value = currentFilterEnd;
      if (targetTahunInput) targetTahunInput.value = currentFilterStart.slice(0, 4);
      if (targetBulanInput) targetBulanInput.value = currentFilterStart.slice(5, 7);

      this.close(true);

      // Trigger sync and data update
      syncFilters(this.prefix.toLowerCase());
    }
  }

  // Instantiate pickers
  let kabPicker = null;
  let kecPicker = null;
  let penggunaanPicker = null;
  let informasiPicker = null;
  try {
    kabPicker = new DateRangePicker('Kab');
    kecPicker = new DateRangePicker('Kec');
    penggunaanPicker = new DateRangePicker('Penggunaan');
  } catch (err) {
    console.error('[DateRangePicker Error]', err);
  }

  [filterTahunKab, filterBulanKab, filterStartDateKab, filterEndDateKab].forEach(el => {
    if (el) el.addEventListener('change', () => syncFilters('kab'));
  });
  if (btnResetFilterKab) {
    btnResetFilterKab.addEventListener('click', resetPeriodFilters);
  }

  [filterTahunKec, filterBulanKec, filterStartDateKec, filterEndDateKec].forEach(el => {
    if (el) el.addEventListener('change', () => syncFilters('kec'));
  });
  if (btnResetFilterKec) {
    btnResetFilterKec.addEventListener('click', resetPeriodFilters);
  }

  [filterTahunPenggunaan, filterBulanPenggunaan, filterStartDatePenggunaan, filterEndDatePenggunaan].forEach(el => {
    if (el) el.addEventListener('change', () => syncFilters('penggunaan'));
  });
  if (btnResetFilterPenggunaan) {
    btnResetFilterPenggunaan.addEventListener('click', resetPeriodFilters);
  }

  function formatPct(num) {
    return Number(num).toFixed(1).replace('.', ',') + '%';
  }

  function getTierFromPct(pct) {
    if (pct >= 100) return 'green';
    if (pct >= 70) return 'yellow';
    if (pct >= 30) return 'orange';
    return 'red';
  }

  function getStatusTextFromPct(pct) {
    if (pct >= 100) return 'Tercapai';
    if (pct >= 70) return 'Mendekati Target';
    if (pct >= 30) return 'Capaian Sedang';
    return 'Capaian Rendah';
  }

  // =========================================================================
  // VIEW SWITCHING (KABUPATEN <-> KECAMATAN)
  // =========================================================================
  function switchView(viewName, kecId) {
    currentView = viewName;
    if (viewName === 'kecamatan') {
      const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya', 'batujaya'];
      const targetKec = (kecId && validKecs.includes(kecId)) ? kecId : (validKecs.includes(selectedKecamatanId) ? selectedKecamatanId : null);

      if (!targetKec) {
        console.warn(`[switchView] Kecamatan "${kecId}" tidak valid. Kembali ke peta kabupaten.`);
        switchView('kabupaten');
        return;
      }

      if (viewPenggunaan) {
        viewPenggunaan.style.display = 'none';
        viewPenggunaan.classList.remove('active');
      const targetViewInformasiKec = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiKec) {
        targetViewInformasiKec.style.display = 'none';
        targetViewInformasiKec.classList.remove('active');
      }
      }
      viewKabupaten.style.display = 'none';
      viewKabupaten.classList.remove('active');
      viewKecamatan.style.display = 'block';
      viewKecamatan.classList.add('active');

      // Update sidebar menu
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      const menuPeta = document.getElementById('menu-peta');
      if (menuPeta) menuPeta.classList.add('active');

      // Initialize or refresh Kecamatan view
      initKecamatanView(targetKec);
      if (window.location.hash !== '#kecamatan-' + targetKec) {
        window.location.hash = '#kecamatan-' + targetKec;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'penggunaan') {
      viewKabupaten.style.display = 'none';
      viewKabupaten.classList.remove('active');
      viewKecamatan.style.display = 'none';
      viewKecamatan.classList.remove('active');

      const targetViewInformasiPj = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiPj) {
        targetViewInformasiPj.style.display = 'none';
        targetViewInformasiPj.classList.remove('active');
      }
      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'block';
        targetViewPenggunaan.classList.add('active');
      }

      // Update sidebar menu
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      const menuPenggunaan = document.getElementById('menu-penggunaan') || document.getElementById('menu-pengguna') || document.querySelector('a[href="#penggunaan"]');
      if (menuPenggunaan) menuPenggunaan.classList.add('active');

      // Render Penggunaan Pajak
      renderPenggunaanPajak(currentFilterStart, currentFilterEnd);

      if (window.location.hash !== '#penggunaan') {
        window.location.hash = '#penggunaan';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'informasi') {
      viewKabupaten.style.display = 'none';
      viewKabupaten.classList.remove('active');
      viewKecamatan.style.display = 'none';
      viewKecamatan.classList.remove('active');
      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'none';
        targetViewPenggunaan.classList.remove('active');
      }

      const targetViewInformasi = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasi) {
        targetViewInformasi.style.display = 'block';
        targetViewInformasi.classList.add('active');
      }

      // Update sidebar menu
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      const menuInformasi = document.getElementById('menu-informasi') || document.querySelector('a[href="#informasi"]');
      if (menuInformasi) menuInformasi.classList.add('active');

      // Render Informasi view
      renderInformasi(currentInformasiTab, currentFilterStart, currentFilterEnd);

      if (window.location.hash !== '#informasi') {
        window.location.hash = '#informasi';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'none';
        targetViewPenggunaan.classList.remove('active');
      }
      viewKecamatan.style.display = 'none';
      viewKecamatan.classList.remove('active');
      const targetViewInformasiKab = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiKab) {
        targetViewInformasiKab.style.display = 'none';
        targetViewInformasiKab.classList.remove('active');
      }
      viewKabupaten.style.display = 'block';
      viewKabupaten.classList.add('active');

      // Update sidebar menu
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      const menuPeta = document.getElementById('menu-peta');
      if (menuPeta) menuPeta.classList.add('active');

      if (window.location.hash !== '#kabupaten') {
        window.location.hash = '#kabupaten';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // =========================================================================
  // VIEW 3: PENGGUNAAN PAJAK (RENDERERS & DOWNLOAD)
  // =========================================================================
  function renderPenggunaanPajak(startDate, endDate) {
    if (typeof getPenggunaanDataForRange !== 'function') {
      console.warn('getPenggunaanDataForRange is not defined.');
      return;
    }

    const data = getPenggunaanDataForRange(startDate, endDate);

    const alertBox = document.getElementById('pjAlertBox');
    const alertMessage = document.getElementById('pjAlertMessage');
    const elPenerimaan = document.getElementById('pjTotalPenerimaan');
    const elPenggunaan = document.getElementById('pjTotalPenggunaan');
    const elSisa = document.getElementById('pjSisaDana');
    const donutSvg = document.getElementById('pjDonutSvg');
    const donutPct = document.getElementById('pjDonutPct');
    const donutLegend = document.getElementById('pjDonutLegend');
    const tableBody = document.getElementById('pjTableBody');
    const lineChartSvg = document.getElementById('pjLineChartSvg');
    const btnDownload = document.getElementById('pjBtnDownload');

    if (!data.available) {
      if (alertBox) {
        alertBox.style.display = 'flex';
        if (alertMessage) alertMessage.textContent = data.message || 'Data belum tersedia untuk rentang waktu yang dipilih.';
      }
      if (elPenerimaan) elPenerimaan.textContent = '—';
      if (elPenggunaan) elPenggunaan.textContent = '—';
      if (elSisa) elSisa.textContent = '—';
      if (donutPct) donutPct.textContent = '—';
      if (donutSvg) donutSvg.innerHTML = '<circle cx="80" cy="80" r="60" fill="none" stroke="#e2e8f0" stroke-width="26" />';
      if (donutLegend) donutLegend.innerHTML = '<div style="color:#94a3b8; font-size:13px; text-align:center; padding:12px 0;">Data kategori belum tersedia</div>';
      if (tableBody) tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#94a3b8; padding:24px;">Data belum tersedia untuk rentang waktu ini.</td></tr>';
      if (lineChartSvg) lineChartSvg.innerHTML = '';
      return;
    }

    if (alertBox) alertBox.style.display = 'none';

    // 1. Tiga Kartu Ringkasan
    if (elPenerimaan) elPenerimaan.textContent = data.totalPenerimaanFormatted;
    if (elPenggunaan) elPenggunaan.textContent = data.totalPenggunaanFormatted;
    if (elSisa) elSisa.textContent = data.sisaDanaFormatted;

    // 2. Donut Chart
    if (donutPct) donutPct.textContent = data.persenTerserapFormatted;

    if (donutSvg && Array.isArray(data.categories)) {
      donutSvg.innerHTML = '';
      const R = 60;
      const C = 2 * Math.PI * R; // ~376.99
      let currentOffset = 0;

      const totalCatReal = data.categories.reduce((acc, c) => acc + (c.realisasi || 0), 0);

      data.categories.forEach(cat => {
        const catRatio = totalCatReal > 0 ? (cat.realisasi / totalCatReal) : 0;
        const dashLength = catRatio * C;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '80');
        circle.setAttribute('cy', '80');
        circle.setAttribute('r', R.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', cat.color);
        circle.setAttribute('stroke-width', '24');
        circle.setAttribute('stroke-dasharray', `${dashLength} ${C - dashLength}`);
        circle.setAttribute('stroke-dashoffset', (-currentOffset).toString());
        circle.style.transition = 'stroke-dasharray 0.35s ease, stroke-dashoffset 0.35s ease';

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${cat.name}: ${cat.realisasiFormatted} (${cat.persenFormatted})`;
        circle.appendChild(title);

        donutSvg.appendChild(circle);
        currentOffset += dashLength;
      });
    }

    // 3. Donut Legend List
    if (donutLegend && Array.isArray(data.categories)) {
      donutLegend.innerHTML = '';
      data.categories.forEach(cat => {
        const row = document.createElement('div');
        row.className = 'pj-legend-row';
        row.innerHTML = `
          <div class="pj-legend-label-wrap" title="${cat.description || cat.name}">
            <span class="pj-cat-dot" style="background-color: ${cat.color};"></span>
            <span class="pj-legend-name">${cat.name}</span>
          </div>
          <strong class="pj-legend-pct">${cat.persenFormatted}</strong>
        `;
        donutLegend.appendChild(row);
      });
    }

    // 4. Rincian Penggunaan Table
    if (tableBody && Array.isArray(data.categories)) {
      tableBody.innerHTML = '';
      data.categories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="td-prog" title="${cat.description || cat.name}">
            <span class="pj-cat-dot" style="background-color: ${cat.color};"></span>
            <span>${cat.name}</span>
          </td>
          <td class="td-real">${cat.realisasiFormatted}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    // 5. Line Chart 12 Bulan Terakhir
    renderLineChartPenggunaan(data);

    // 6. Download Laporan Button
    if (btnDownload) {
      btnDownload.onclick = () => downloadLaporanPenggunaan(data);
    }
  }

  function renderLineChartPenggunaan(data) {
    const lineChartSvg = document.getElementById('pjLineChartSvg');
    const tooltip = document.getElementById('pjChartTooltip');
    const wrap = document.getElementById('pjLineChartWrap');
    if (!lineChartSvg || !data || !Array.isArray(data.monthlyPoints)) return;

    lineChartSvg.innerHTML = '';

    const width = 720;
    const height = 220;
    const paddingLeft = 65;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;

    const chartWidth = width - paddingLeft - paddingRight; // 635
    const chartHeight = height - paddingTop - paddingBottom; // 160

    const maxY = 400000000000; // Rp400 M
    const yTicks = [
      { val: 400000000000, label: 'Rp400 M' },
      { val: 300000000000, label: 'Rp300 M' },
      { val: 200000000000, label: 'Rp200 M' },
      { val: 100000000000, label: 'Rp100 M' },
      { val: 0, label: 'Rp0' }
    ];

    // Gridlines & Y-Axis labels
    yTicks.forEach(tick => {
      const y = paddingTop + chartHeight - (tick.val / maxY) * chartHeight;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', paddingLeft.toString());
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', (width - paddingRight).toString());
      line.setAttribute('y2', y.toString());
      line.setAttribute('stroke', '#e2e8f0');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', tick.val === 0 ? 'none' : '3 3');
      lineChartSvg.appendChild(line);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (paddingLeft - 10).toString());
      text.setAttribute('y', (y + 4).toString());
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('fill', '#64748b');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
      text.textContent = tick.label;
      lineChartSvg.appendChild(text);
    });

    const points = data.monthlyPoints;
    const n = points.length;
    const getX = (idx) => paddingLeft + (idx / (n - 1)) * chartWidth;
    const getY = (val) => paddingTop + chartHeight - (Math.min(val, maxY) / maxY) * chartHeight;

    // X-Axis month labels
    points.forEach((p, idx) => {
      const x = getX(idx);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', (height - 10).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', p.isInRange ? '#0f172a' : '#94a3b8');
      text.setAttribute('font-size', '11.5');
      text.setAttribute('font-weight', p.isInRange ? '600' : '400');
      text.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
      text.textContent = p.label;
      lineChartSvg.appendChild(text);
    });

    // Path Blue (Penerimaan)
    let dPenerimaan = '';
    points.forEach((p, idx) => {
      const x = getX(idx);
      const y = getY(p.penerimaanKumulatif);
      dPenerimaan += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });

    const pathPenerimaan = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathPenerimaan.setAttribute('d', dPenerimaan);
    pathPenerimaan.setAttribute('fill', 'none');
    pathPenerimaan.setAttribute('stroke', '#2563eb');
    pathPenerimaan.setAttribute('stroke-width', '2.2');
    pathPenerimaan.setAttribute('stroke-linecap', 'round');
    pathPenerimaan.setAttribute('stroke-linejoin', 'round');
    lineChartSvg.appendChild(pathPenerimaan);

    // Path Green (Penggunaan)
    let dPenggunaan = '';
    points.forEach((p, idx) => {
      const x = getX(idx);
      const y = getY(p.penggunaanKumulatif);
      dPenggunaan += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });

    const pathPenggunaan = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathPenggunaan.setAttribute('d', dPenggunaan);
    pathPenggunaan.setAttribute('fill', 'none');
    pathPenggunaan.setAttribute('stroke', '#10b981');
    pathPenggunaan.setAttribute('stroke-width', '2.2');
    pathPenggunaan.setAttribute('stroke-linecap', 'round');
    pathPenggunaan.setAttribute('stroke-linejoin', 'round');
    lineChartSvg.appendChild(pathPenggunaan);

    // Dots and Hover Interaction
    points.forEach((p, idx) => {
      const x = getX(idx);
      const yPen = getY(p.penerimaanKumulatif);
      const yPeng = getY(p.penggunaanKumulatif);

      const dotPen = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dotPen.setAttribute('cx', x.toString());
      dotPen.setAttribute('cy', yPen.toString());
      dotPen.setAttribute('r', p.isInRange ? '4' : '3');
      dotPen.setAttribute('fill', '#2563eb');
      dotPen.setAttribute('stroke', '#ffffff');
      dotPen.setAttribute('stroke-width', '1.5');
      lineChartSvg.appendChild(dotPen);

      const dotPeng = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dotPeng.setAttribute('cx', x.toString());
      dotPeng.setAttribute('cy', yPeng.toString());
      dotPeng.setAttribute('r', p.isInRange ? '4' : '3');
      dotPeng.setAttribute('fill', '#10b981');
      dotPeng.setAttribute('stroke', '#ffffff');
      dotPeng.setAttribute('stroke-width', '1.5');
      lineChartSvg.appendChild(dotPeng);

      // Hit area for hover
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const step = chartWidth / (n - 1);
      hitArea.setAttribute('x', (x - step / 2).toString());
      hitArea.setAttribute('y', paddingTop.toString());
      hitArea.setAttribute('width', step.toString());
      hitArea.setAttribute('height', chartHeight.toString());
      hitArea.setAttribute('fill', 'transparent');
      hitArea.style.cursor = 'pointer';

      hitArea.addEventListener('mouseenter', () => {
        dotPen.setAttribute('r', '6');
        dotPeng.setAttribute('r', '6');
        if (tooltip && wrap) {
          const sisaBulan = p.penerimaanKumulatif - p.penggunaanKumulatif;
          const pctX = (x / width) * 100;
          tooltip.style.display = 'block';
          tooltip.style.left = `${pctX}%`;
          tooltip.style.top = `${Math.min(yPen, yPeng) - 8}px`;
          tooltip.innerHTML = `
            <strong>Bulan: ${p.label} 2026</strong>
            <div style="color: #93c5fd;">● Penerimaan: ${formatRupiahId(p.penerimaanKumulatif)}</div>
            <div style="color: #6ee7b7;">● Penggunaan: ${formatRupiahId(p.penggunaanKumulatif)}</div>
            <div style="color: #cbd5e1; font-size:11px; margin-top:2px;">Sisa Dana Kumulatif: ${formatRupiahId(sisaBulan)}</div>
          `;
        }
      });

      hitArea.addEventListener('mouseleave', () => {
        dotPen.setAttribute('r', p.isInRange ? '4' : '3');
        dotPeng.setAttribute('r', p.isInRange ? '4' : '3');
        if (tooltip) tooltip.style.display = 'none';
      });

      lineChartSvg.appendChild(hitArea);
    });
  }

  function downloadLaporanPenggunaan(data) {
    if (!data) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up browser untuk mengunduh laporan PDF.');
      return;
    }

    const rowsHtml = (data.categories || []).map((cat, idx) => `
      <tr>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1;"><strong>${cat.name}</strong><br><small style="color: #64748b;">${cat.description || ''}</small></td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">${cat.realisasiFormatted}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: center;">${cat.persenFormatted}</td>
      </tr>
    `).join('');

    const monthlyRowsHtml = (data.monthlyPoints || []).map(p => `
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">${p.label}</td>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right;">${formatRupiahId(p.penerimaanKumulatif)}</td>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right;">${formatRupiahId(p.penggunaanKumulatif)}</td>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right;">${formatRupiahId(p.penerimaanKumulatif - p.penggunaanKumulatif)}</td>
      </tr>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Realisasi Penggunaan Dana PBB-P2 Karawang</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 30px;
      line-height: 1.4;
    }
    .header-table { width: 100%; border-bottom: 3px double #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
    .header-table td { vertical-align: middle; }
    .header-logo { width: 68px; height: auto; }
    .instansi-title { font-size: 16px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin: 0; }
    .instansi-sub { font-size: 13px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; margin: 2px 0; }
    .instansi-address { font-size: 11px; color: #475569; margin: 0; }
    .report-title-box { text-align: center; margin-bottom: 25px; }
    .report-title { font-size: 16px; font-weight: 800; text-transform: uppercase; text-decoration: underline; margin-bottom: 4px; }
    .report-period { font-size: 13px; color: #334155; font-weight: 600; }
    .summary-grid { display: flex; gap: 15px; margin-bottom: 25px; }
    .summary-card { flex: 1; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; background-color: #f8fafc; }
    .summary-label { font-size: 11.5px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
    .summary-val { font-size: 16px; font-weight: 800; color: #0f172a; }
    .table-title { font-size: 14px; font-weight: 700; margin: 20px 0 8px 0; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12.5px; }
    th { background-color: #f1f5f9; padding: 9px 12px; border: 1px solid #cbd5e1; font-weight: 700; text-align: left; }
    .footer-sign { margin-top: 40px; display: flex; justify-content: flex-end; }
    .sign-box { width: 250px; text-align: center; font-size: 12.5px; }
    .sign-space { height: 70px; }
    @media print {
      body { padding: 0; }
      @page { margin: 15mm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 80px; text-align: center;">
        <img src="assets/logo_karawang.png" class="header-logo" alt="Logo Karawang">
      </td>
      <td style="text-align: center;">
        <h1 class="instansi-title">Pemerintah Kabupaten Karawang</h1>
        <h2 class="instansi-sub">Badan Pendapatan Daerah (BAPENDA)</h2>
        <p class="instansi-address">Jl. Jend. A. Yani No. 1, Nagasari, Kec. Karawang Barat, Karawang, Jawa Barat 41314</p>
      </td>
    </tr>
  </table>

  <div class="report-title-box">
    <div class="report-title">Laporan Realisasi Penggunaan Dana Penerimaan PBB-P2</div>
    <div class="report-period">Periode: ${formatDateId(data.startDate)} s/d ${formatDateId(data.endDate)}</div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-label">Total Penerimaan</div>
      <div class="summary-val">${data.totalPenerimaanFormatted}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Penggunaan</div>
      <div class="summary-val">${data.totalPenggunaanFormatted}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Sisa Dana</div>
      <div class="summary-val">${data.sisaDanaFormatted}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Penyerapan</div>
      <div class="summary-val" style="color: #2563eb;">${data.persenTerserapFormatted}</div>
    </div>
  </div>

  <div class="table-title">I. Rincian Realisasi Penggunaan Berdasarkan Program/Kegiatan</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px; text-align: center;">No</th>
        <th>Program / Kegiatan</th>
        <th style="width: 200px; text-align: right;">Realisasi Penggunaan</th>
        <th style="width: 90px; text-align: center;">Proporsi</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background-color: #f8fafc; font-weight: 700;">
        <td colspan="2" style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: right;">TOTAL PENGGUNAAN:</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: right; color: #16a34a;">${data.totalPenggunaanFormatted}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: center;">100,0%</td>
      </tr>
    </tfoot>
  </table>

  <div class="table-title">II. Rekapitulasi Kumulatif Bulanan Penerimaan & Penggunaan (Tahun 2026)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 70px; text-align: center;">Bulan</th>
        <th style="text-align: right;">Penerimaan Kumulatif</th>
        <th style="text-align: right;">Penggunaan Kumulatif</th>
        <th style="text-align: right;">Sisa Dana Kumulatif</th>
      </tr>
    </thead>
    <tbody>
      ${monthlyRowsHtml}
    </tbody>
  </table>

  <div class="footer-sign">
    <div class="sign-box">
      <div>Karawang, ${formatDateId(TODAY_STR)}</div>
      <div style="font-weight: 600;">Kepala BAPENDA Kabupaten Karawang</div>
      <div class="sign-space"></div>
      <div style="font-weight: 700; text-decoration: underline;">Dr. H. Asep Aang Rahmatullah, S.STP., M.P.</div>
      <div style="font-size: 11px; color: #64748b;">NIP. 19780514 199711 1 001</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  
  // =========================================================================
  // VIEW 4: INFORMASI (BERITA, PENGUMUMAN, REGULASI, FAQ)
  // =========================================================================
  let currentInformasiTab = 'semua';
  let activeFaqAccordionId = null;

  function renderInformasi(activeTab, startDate, endDate) {
    if (activeTab) {
      currentInformasiTab = activeTab;
    }
    const tab = currentInformasiTab || 'semua';
    const sDate = startDate || currentFilterStart || '2026-01-01';
    const eDate = endDate || currentFilterEnd || '2026-12-31';

    // 1. Update active tab UI buttons
    document.querySelectorAll('.info-tab-btn').forEach(btn => {
      const bTab = btn.getAttribute('data-tab');
      if (bTab === tab) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    if (typeof getInformasiFilteredData !== 'function') {
      console.warn('[Informasi] getInformasiFilteredData is not available.');
      return;
    }

    const data = getInformasiFilteredData(tab, sDate, eDate);

    // 2. Alert / Date notification
    const alertBox = document.getElementById('infoAlertBox');
    const alertMsg = document.getElementById('infoAlertMessage');
    const rangeText = formatRangeDisplay(sDate, eDate);

    if (data.berita.length === 0 && data.pengumuman.length === 0 && (tab === 'semua' || tab === 'berita' || tab === 'pengumuman')) {
      if (alertBox) {
        alertBox.style.display = 'flex';
        if (alertMsg) alertMsg.textContent = `Tidak ada berita atau pengumuman pada periode ${rangeText}.`;
      }
    } else {
      if (alertBox) alertBox.style.display = 'none';
    }

    const layoutGrid = document.getElementById('infoContentLayout');
    const fullscreenContainer = document.getElementById('infoTabFullscreenContainer');
    const fullscreenContent = document.getElementById('infoFullscreenContent');
    const fullscreenTitle = document.getElementById('infoFullscreenTitle');

    // If 'semua' tab is selected: show 2-column layout matching reference screenshot
    if (tab === 'semua') {
      if (layoutGrid) layoutGrid.style.display = 'grid';
      if (fullscreenContainer) fullscreenContainer.style.display = 'none';

      // A. Render Left Column: Berita Terbaru
      const beritaContainer = document.getElementById('infoBeritaList');
      if (beritaContainer) {
        if (data.berita.length === 0) {
          beritaContainer.innerHTML = `
            <div style="text-align: center; padding: 36px 20px; color: #94a3b8; font-size: 14px;">
              Tidak ada berita pada rentang tanggal yang dipilih (${rangeText}).
            </div>
          `;
        } else {
          beritaContainer.innerHTML = data.berita.map(item => `
            <div class="info-berita-item" data-id="${item.id}" data-type="berita" role="button" tabindex="0">
              <img src="${item.image}" alt="${item.title}" class="info-berita-thumb" loading="lazy" />
              <div class="info-berita-details">
                <span class="info-berita-date">${item.dateFormatted}</span>
                <h3 class="info-berita-item-title">${item.title}</h3>
                <p class="info-berita-excerpt">${item.excerpt}</p>
              </div>
            </div>
          `).join('');
        }
      }

      // B. Render Right Column: Pengumuman
      const pengumumanContainer = document.getElementById('infoPengumumanList');
      if (pengumumanContainer) {
        if (data.pengumuman.length === 0) {
          pengumumanContainer.innerHTML = `
            <div style="text-align: center; padding: 24px 10px; color: #94a3b8; font-size: 13px;">
              Tidak ada pengumuman pada rentang tanggal ini.
            </div>
          `;
        } else {
          pengumumanContainer.innerHTML = data.pengumuman.map(item => `
            <div class="info-pengumuman-item" data-id="${item.id}" data-type="pengumuman" role="button" tabindex="0">
              <div class="info-pengumuman-bell">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <span class="info-pengumuman-date">${item.dateFormatted}</span>
              <h4 class="info-pengumuman-item-title">${item.title}</h4>
            </div>
          `).join('');
        }
      }

      // C. Render Right Column: Regulasi
      const regulasiContainer = document.getElementById('infoRegulasiList');
      if (regulasiContainer) {
        regulasiContainer.innerHTML = data.regulasi.map(item => `
          <div class="info-regulasi-item" data-id="${item.id}" data-type="regulasi" role="button" tabindex="0">
            <div class="info-regulasi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h4 class="info-regulasi-item-title">${item.title}</h4>
          </div>
        `).join('');
      }

      // D. Render Right Column: FAQ Accordion
      const faqContainer = document.getElementById('infoFaqList');
      if (faqContainer) {
        faqContainer.innerHTML = data.faq.map((item, idx) => `
          <div class="info-faq-accordion-item ${activeFaqAccordionId === item.id ? 'is-open' : ''}" data-faq-id="${item.id}">
            <button type="button" class="info-faq-question-btn" aria-expanded="${activeFaqAccordionId === item.id ? 'true' : 'false'}">
              <svg class="info-faq-q-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="info-faq-q-text">${item.question}</span>
              <svg class="info-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div class="info-faq-answer">${item.answer}</div>
          </div>
        `).join('');
      }
    } else {
      // TAB IS NOT 'SEMUA': Dedicated single category view
      if (layoutGrid) layoutGrid.style.display = 'none';
      if (fullscreenContainer) fullscreenContainer.style.display = 'flex';

      if (tab === 'berita') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Berita PBB-P2';
        if (fullscreenContent) {
          if (data.berita.length === 0) {
            fullscreenContent.innerHTML = `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:48px 24px; text-align:center; color:#94a3b8;">
                <p style="font-size:16px; font-weight:600; margin-bottom:8px;">Tidak ada berita pada rentang tanggal yang dipilih (${rangeText}).</p>
                <p style="font-size:13.5px;">Gunakan filter tanggal di kanan atas atau klik tombol Reset untuk melihat semua publikasi.</p>
              </div>
            `;
          } else {
            fullscreenContent.innerHTML = `
              <div class="info-grid-berita-full">
                ${data.berita.map(item => `
                  <div class="info-card-berita-full" data-id="${item.id}" data-type="berita" role="button" tabindex="0">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" />
                    <div class="info-card-berita-full-body">
                      <span class="info-berita-date">${item.dateFormatted} • ${item.author || 'BAPENDA'}</span>
                      <h3 class="info-berita-item-title" style="margin-top:6px; font-size:16px;">${item.title}</h3>
                      <p class="info-berita-excerpt" style="margin-top:6px;">${item.excerpt}</p>
                      <div style="margin-top:auto; padding-top:14px;">
                        <span style="color:#2563eb; font-size:13px; font-weight:600;">Baca Selengkapnya &rarr;</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          }
        }
      } else if (tab === 'pengumuman') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Pengumuman Resmi PBB-P2';
        if (fullscreenContent) {
          if (data.pengumuman.length === 0) {
            fullscreenContent.innerHTML = `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:48px 24px; text-align:center; color:#94a3b8;">
                <p style="font-size:16px; font-weight:600; margin-bottom:8px;">Tidak ada pengumuman pada rentang tanggal yang dipilih (${rangeText}).</p>
                <p style="font-size:13.5px;">Gunakan filter tanggal di kanan atas atau klik tombol Reset untuk melihat semua publikasi.</p>
              </div>
            `;
          } else {
            fullscreenContent.innerHTML = `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px 24px;">
                ${data.pengumuman.map(item => `
                  <div class="info-pengumuman-item" data-id="${item.id}" data-type="pengumuman" style="padding:18px 12px;" role="button" tabindex="0">
                    <div class="info-pengumuman-bell" style="width:40px; height:40px;">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div style="flex:1;">
                      <div style="display:flex; gap:12px; align-items:center; margin-bottom:4px;">
                        <span class="info-pengumuman-date" style="font-size:12.5px;">${item.dateFormatted}</span>
                        <span style="font-size:11px; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; font-weight:600;">RESMI</span>
                      </div>
                      <h4 class="info-pengumuman-item-title" style="font-size:15px; font-weight:700;">${item.title}</h4>
                      <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">${item.summary || ''}</p>
                    </div>
                    <div style="color:#2563eb; font-size:13px; font-weight:600; white-space:nowrap;">Lihat Rincian &rarr;</div>
                  </div>
                `).join('')}
              </div>
            `;
          }
        }
      } else if (tab === 'regulasi') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Regulasi & Dasar Hukum PBB-P2';
        if (fullscreenContent) {
          fullscreenContent.innerHTML = `
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px 24px;">
              ${data.regulasi.map(item => `
                <div class="info-regulasi-item" data-id="${item.id}" data-type="regulasi" style="padding:18px 12px;" role="button" tabindex="0">
                  <div class="info-regulasi-icon" style="width:42px; height:42px;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div style="flex:1;">
                    <div style="display:flex; gap:12px; align-items:center; margin-bottom:4px;">
                      <span style="font-size:11px; background:#eff6ff; color:#1d4ed8; padding:2px 8px; border-radius:4px; font-weight:700;">TAHUN ${item.year}</span>
                      <span style="font-size:12px; color:#64748b; font-weight:600;">${item.number}</span>
                    </div>
                    <h4 class="info-regulasi-item-title" style="font-size:15px; font-weight:700;">${item.title}</h4>
                    <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">${item.summary || ''}</p>
                  </div>
                  <div style="color:#2563eb; font-size:13px; font-weight:600; white-space:nowrap;">Buka Dokumen &rarr;</div>
                </div>
              `).join('')}
            </div>
          `;
        }
      } else if (tab === 'faq') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Pertanyaan yang Sering Diajukan (FAQ)';
        if (fullscreenContent) {
          fullscreenContent.innerHTML = `
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
              <div class="info-faq-list" style="padding:0;">
                ${data.faq.map((item, idx) => `
                  <div class="info-faq-accordion-item is-open" data-faq-id="${item.id}">
                    <button type="button" class="info-faq-question-btn" aria-expanded="true">
                      <svg class="info-faq-q-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span class="info-faq-q-text" style="font-size:14.5px;">${item.question}</span>
                      <svg class="info-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div class="info-faq-answer" style="display:block; font-size:13.5px;">${item.answer}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }
    }
  }

  // Open detail modal helper
  function openInformasiModal(id, type) {
    if (typeof INFORMASI_BASE_DATA === 'undefined') return;
    let item = null;
    let badgeText = 'Informasi';

    if (type === 'berita') {
      item = INFORMASI_BASE_DATA.berita.find(b => b.id === id);
      badgeText = 'Berita';
    } else if (type === 'pengumuman') {
      item = INFORMASI_BASE_DATA.pengumuman.find(p => p.id === id);
      badgeText = 'Pengumuman Resmi';
    } else if (type === 'regulasi') {
      item = INFORMASI_BASE_DATA.regulasi.find(r => r.id === id);
      badgeText = 'Dokumen Regulasi';
    }

    if (!item) return;

    const modal = document.getElementById('infoDetailModal');
    const badge = document.getElementById('infoModalBadge');
    const body = document.getElementById('infoModalBody');

    if (badge) badge.textContent = badgeText;
    if (body) {
      let mediaHtml = '';
      if (item.image) {
        mediaHtml = `<img src="${item.image}" alt="${item.title}" class="info-modal-img" />`;
      }
      let metaHtml = '';
      if (item.dateFormatted) {
        metaHtml += `<span>Tanggal: <strong>${item.dateFormatted}</strong></span>`;
      }
      if (item.author) {
        metaHtml += `<span>Penulis: <strong>${item.author}</strong></span>`;
      }
      if (item.number) {
        metaHtml += `<span>Nomor: <strong>${item.number}</strong></span>`;
      }

      body.innerHTML = `
        <h2 class="info-modal-title">${item.title}</h2>
        <div class="info-modal-meta">${metaHtml}</div>
        ${mediaHtml}
        <div class="info-modal-content">${item.content || item.summary || item.excerpt || ''}</div>
      `;
    }

    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeInformasiModal() {
    const modal = document.getElementById('infoDetailModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }


  btnBackToKabupaten.addEventListener('click', () => {
    switchView('kabupaten');
  });

  btnOpenKecamatanDetail.addEventListener('click', () => {
    const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
    if (validKecs.includes(selectedKecamatanId)) {
      switchView('kecamatan', selectedKecamatanId);
    }
  });

  if (popupHeaderClickable) {
    popupHeaderClickable.addEventListener('click', () => {
      const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
      if (validKecs.includes(selectedKecamatanId)) {
        switchView('kecamatan', selectedKecamatanId);
      }
    });
  }

  // =========================================================================
  // KABUPATEN LEVEL RENDERING & LOGIC
  // =========================================================================
  function renderKabupatenMap() {
    polygonsGroupKab.innerHTML = '';
    labelsGroupKab.innerHTML = '';

    KECAMATAN_DATA.forEach(item => {
      // Path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', item.path);
      path.setAttribute('fill', item.color);
      path.setAttribute('class', 'kecamatan-polygon' + (item.id === selectedKecamatanId ? ' selected' : ''));
      path.setAttribute('id', 'poly-' + item.id);
      path.setAttribute('data-id', item.id);

      path.addEventListener('click', () => {
        selectKecamatan(item.id);
      });

      // Double-click opens detail
      path.addEventListener('dblclick', () => {
        const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
        if (validKecs.includes(item.id)) {
          switchView('kecamatan', item.id);
        }
      });

      polygonsGroupKab.appendChild(path);

      // Label (Name + Percentage)
      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      labelGroup.setAttribute('class', 'map-label-group');

      let lx = item.cx;
      let ly = item.cy;
      if (item.name === 'Karawang Timur') { lx += 10; ly += 5; }
      if (item.name === 'Rawamerta') { lx -= 5; ly += 5; }
      if (item.name === 'Purwasari') { lx += 5; }
      if (item.name === 'Klari') { ly -= 5; }
      if (item.name === 'Ciampel') { ly -= 2; }
      if (item.name === 'Tirtamulya') { lx += 2; }
      if (item.name === 'Telukjambe Timur') { ly -= 2; }

      const textName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textName.setAttribute('x', lx);
      textName.setAttribute('y', ly - 2);
      textName.setAttribute('class', 'map-label-name');
      textName.textContent = item.name;

      const textPct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textPct.setAttribute('x', lx);
      textPct.setAttribute('y', ly + 10);
      textPct.setAttribute('class', 'map-label-pct');
      textPct.textContent = Math.round(item.capaian) + '%';

      labelGroup.appendChild(textName);
      labelGroup.appendChild(textPct);
      labelsGroupKab.appendChild(labelGroup);
    });
  }

  const orderPriorityKab = [
    'karawang-barat', 'karawang-timur', 'majalaya', 'talagasari', 'lemahabang', 'rengasdengklok', 'telukjambe-barat', 'telukjambe-timur',
    'tegalwaru', 'ciampel', 'purwasari', 'cikampek', 'klari', 'pedes', 'kotabaru', 'jatisari', 'banyusari', 'kutawaluya', 'rawamerta', 'tirtamulya', 'cilebar', 'tempuran', 'cilamaya-kulon', 'cilamaya-wetan'
  ];

  function getSortedKabupatenList() {
    const list = [...KECAMATAN_DATA];
    list.sort((a, b) => {
      const idxA = orderPriorityKab.indexOf(a.id);
      const idxB = orderPriorityKab.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
    return list;
  }

  function renderKabupatenList(query = '') {
    kecamatanList.innerHTML = '';
    const sorted = getSortedKabupatenList();
    const filtered = sorted.filter(k => k.name.toLowerCase().includes(query.toLowerCase()));

    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'kecamatan-item' + (item.id === selectedKecamatanId ? ' active' : '');
      row.setAttribute('data-id', item.id);
      row.id = 'list-item-' + item.id;

      const left = document.createElement('div');
      left.className = 'item-left';

      const dot = document.createElement('span');
      dot.className = 'item-dot bg-' + item.tier;

      const name = document.createElement('span');
      name.className = 'item-name';
      name.textContent = item.name;

      left.appendChild(dot);
      left.appendChild(name);

      const right = document.createElement('div');
      right.className = 'item-right';

      const pct = document.createElement('span');
      pct.className = 'item-percent';
      pct.textContent = item.capaianFormatted;

      const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevron.setAttribute('class', 'item-chevron');
      chevron.setAttribute('viewBox', '0 0 24 24');
      chevron.setAttribute('fill', 'none');
      chevron.setAttribute('stroke', 'currentColor');
      chevron.setAttribute('stroke-width', '2');
      chevron.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';

      right.appendChild(pct);
      right.appendChild(chevron);

      row.appendChild(left);
      row.appendChild(right);

      row.addEventListener('click', () => {
        selectKecamatan(item.id);
        const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
        if (validKecs.includes(item.id)) {
          switchView('kecamatan', item.id);
        }
      });

      // Chevron click opens detail view
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        selectKecamatan(item.id);
        const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
        if (validKecs.includes(item.id)) {
          switchView('kecamatan', item.id);
        }
      });

      kecamatanList.appendChild(row);
    });
  }

  function selectKecamatan(id) {
    const item = KECAMATAN_DATA.find(k => k.id === id);
    if (!item) return;

    selectedKecamatanId = id;

    // Polygons selected class
    document.querySelectorAll('.kecamatan-polygon').forEach(poly => poly.classList.remove('selected'));
    const activePoly = document.getElementById('poly-' + id);
    if (activePoly) activePoly.classList.add('selected');

    const sisa = (item.sisaTagihan !== undefined) ? item.sisaTagihan : Math.max(0, item.target - item.realisasi);

    // Update Popup
    popupKecName.textContent = item.name;
    popupTargetKab.textContent = formatRupiah(item.target);
    popupRealisasiKab.textContent = formatRupiah(item.realisasi);
    if (popupSisaKab) popupSisaKab.textContent = formatRupiah(sisa);
    popupCapaianKab.textContent = item.capaianFormatted;
    popupBadgeTextKab.textContent = item.statusText;
    const dot = popupBadgeKab.querySelector('.status-dot');
    if (dot) dot.style.backgroundColor = item.color;

    const percentX = (item.cx / VIEWBOX_WIDTH) * 100;
    const percentY = (item.cy / VIEWBOX_HEIGHT) * 100;
    mapPopupKab.style.left = `${percentX}%`;
    mapPopupKab.style.top = `${percentY}%`;
    mapPopupKab.style.display = 'block';

    // Update List Active
    document.querySelectorAll('.kecamatan-item').forEach(el => el.classList.remove('active'));
    const activeListItem = document.getElementById('list-item-' + id);
    if (activeListItem) {
      activeListItem.classList.add('active');
      activeListItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update Detail Panel
    detailTitleKab.textContent = 'Kecamatan ' + item.name;
    detailBadgeKab.className = 'banner-badge badge-' + item.tier;
    detailBadgeKab.textContent = item.statusText;

    detailTargetKab.textContent = formatRupiah(item.target);
    detailRealisasiKab.textContent = formatRupiah(item.realisasi);
    if (detailSisaKab) detailSisaKab.textContent = formatRupiah(sisa);

    detailCapaianKab.textContent = item.capaianFormatted;
    detailProgressFillKab.style.width = `${Math.min(100, item.capaian)}%`;
    detailProgressFillKab.className = 'progress-bar-fill fill-' + item.tier;

    if (item.capaian >= 100) {
      noticeTitleKab.textContent = 'Target capaian telah terpenuhi!';
      noticeDescKab.textContent = 'Wilayah ini berhasil mencapai dan melampaui target penerimaan PBB-P2.';
    } else {
      noticeTitleKab.textContent = 'Capaian masih di bawah 100%.';
      noticeDescKab.textContent = 'Perlu ditingkatkan pengelolaan dan pembayaran PBB-P2 di wilayah ini.';
    }

    // Update Action Button Text
    btnOpenKecamatanDetail.querySelector('span').textContent = `Lihat Detail Kecamatan ${item.name}`;
  }

  // Pan and Zoom - Kabupaten
  function applyKabTransform() {
    mapSvgKab.style.transform = `translate(${kabPanX}px, ${kabPanY}px) scale(${kabZoom})`;
  }

  document.getElementById('zoomInBtn').addEventListener('click', () => {
    kabZoom = Math.min(2.5, kabZoom + 0.2);
    applyKabTransform();
  });

  document.getElementById('zoomOutBtn').addEventListener('click', () => {
    kabZoom = Math.max(0.8, kabZoom - 0.2);
    applyKabTransform();
  });

  mapContainerKab.addEventListener('wheel', (e) => {
    e.preventDefault();
    kabZoom = (e.deltaY < 0) ? Math.min(2.5, kabZoom + 0.1) : Math.max(0.8, kabZoom - 0.1);
    applyKabTransform();
  }, { passive: false });

  mapContainerKab.addEventListener('mousedown', (e) => {
    if (e.target.closest('#mapPopupCard') || e.target.closest('.map-zoom-controls') || e.target.closest('.map-legend-card')) return;
    kabDragging = true;
    kabStartX = e.clientX - kabPanX;
    kabStartY = e.clientY - kabPanY;
    mapContainerKab.classList.add('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (kabDragging) {
      kabPanX = e.clientX - kabStartX;
      kabPanY = e.clientY - kabStartY;
      applyKabTransform();
    }
    if (cilDragging) {
      cilPanX = e.clientX - cilStartX;
      cilPanY = e.clientY - cilStartY;
      applyCilTransform();
    }
  });

  window.addEventListener('mouseup', () => {
    if (kabDragging) {
      kabDragging = false;
      mapContainerKab.classList.remove('dragging');
    }
    if (cilDragging) {
      cilDragging = false;
      mapContainerCil.classList.remove('dragging');
    }
  });

  searchInputKab.addEventListener('input', (e) => {
    renderKabupatenList(e.target.value.trim());
  });

  // =========================================================================
  // KECAMATAN LEVEL RENDERING & LOGIC (PURWASARI, CIKAMPEK, KOTABARU, JATISARI, BANYUSARI, CILEBAR, TEMPURAN, CILAMAYA KULON & CILAMAYA WETAN)
  // =========================================================================
  let activeKecamatanId = null;
  let activeDesaData = [];
  let activeSummary = {};
  let activeViewBoxWidth = 600;
  let activeViewBoxHeight = 1006;
  let currentSortMode = 'default'; // 'default', 'desc', 'asc'

  function initKecamatanView(kecId) {
    if (typeof kecId === 'string') {
      kecId = kecId.toLowerCase().trim().replace(/^[#\/]+/, '').replace(/^kecamatan[-/]/, '');
    }
    if (!kecId) kecId = 'cilebar';
    if (kecId === 'lemahabang') {
      activeKecamatanId = 'lemahabang';
      activeDesaData = typeof LEMAHABANG_DESA_DATA !== 'undefined' ? LEMAHABANG_DESA_DATA : [];
      activeSummary = typeof LEMAHABANG_SUMMARY !== 'undefined' ? LEMAHABANG_SUMMARY : {};
      activeViewBoxWidth = typeof LEMAHABANG_VIEWBOX_WIDTH !== 'undefined' ? LEMAHABANG_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof LEMAHABANG_VIEWBOX_HEIGHT !== 'undefined' ? LEMAHABANG_VIEWBOX_HEIGHT : 629;
    } else if (kecId === 'talagasari') {
      activeKecamatanId = 'talagasari';
      activeDesaData = typeof TALAGASARI_DESA_DATA !== 'undefined' ? TALAGASARI_DESA_DATA : [];
      activeSummary = typeof TALAGASARI_SUMMARY !== 'undefined' ? TALAGASARI_SUMMARY : {};
      activeViewBoxWidth = typeof TALAGASARI_VIEWBOX_WIDTH !== 'undefined' ? TALAGASARI_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TALAGASARI_VIEWBOX_HEIGHT !== 'undefined' ? TALAGASARI_VIEWBOX_HEIGHT : 595;
    } else if (kecId === 'majalaya') {
      activeKecamatanId = 'majalaya';
      activeDesaData = typeof MAJALAYA_DESA_DATA !== 'undefined' ? MAJALAYA_DESA_DATA : [];
      activeSummary = typeof MAJALAYA_SUMMARY !== 'undefined' ? MAJALAYA_SUMMARY : {};
      activeViewBoxWidth = typeof MAJALAYA_VIEWBOX_WIDTH !== 'undefined' ? MAJALAYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof MAJALAYA_VIEWBOX_HEIGHT !== 'undefined' ? MAJALAYA_VIEWBOX_HEIGHT : 572;
    } else if (kecId === 'klari') {
      activeKecamatanId = 'klari';
      activeDesaData = typeof KLARI_DESA_DATA !== 'undefined' ? KLARI_DESA_DATA : [];
      activeSummary = typeof KLARI_SUMMARY !== 'undefined' ? KLARI_SUMMARY : {};
      activeViewBoxWidth = typeof KLARI_VIEWBOX_WIDTH !== 'undefined' ? KLARI_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof KLARI_VIEWBOX_HEIGHT !== 'undefined' ? KLARI_VIEWBOX_HEIGHT : 770;
    } else if (kecId === 'ciampel') {
      activeKecamatanId = 'ciampel';
      activeDesaData = typeof CIAMPEL_DESA_DATA !== 'undefined' ? CIAMPEL_DESA_DATA : [];
      activeSummary = typeof CIAMPEL_SUMMARY !== 'undefined' ? CIAMPEL_SUMMARY : {};
      activeViewBoxWidth = typeof CIAMPEL_VIEWBOX_WIDTH !== 'undefined' ? CIAMPEL_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CIAMPEL_VIEWBOX_HEIGHT !== 'undefined' ? CIAMPEL_VIEWBOX_HEIGHT : 784;
    } else if (kecId === 'tegalwaru') {
      activeKecamatanId = 'tegalwaru';
      activeDesaData = typeof TEGALWARU_DESA_DATA !== 'undefined' ? TEGALWARU_DESA_DATA : [];
      activeSummary = typeof TEGALWARU_SUMMARY !== 'undefined' ? TEGALWARU_SUMMARY : {};
      activeViewBoxWidth = typeof TEGALWARU_VIEWBOX_WIDTH !== 'undefined' ? TEGALWARU_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TEGALWARU_VIEWBOX_HEIGHT !== 'undefined' ? TEGALWARU_VIEWBOX_HEIGHT : 712;
    } else if (kecId === 'pangkalan') {
      activeKecamatanId = 'pangkalan';
      activeDesaData = typeof PANGKALAN_DESA_DATA !== 'undefined' ? PANGKALAN_DESA_DATA : [];
      activeSummary = typeof PANGKALAN_SUMMARY !== 'undefined' ? PANGKALAN_SUMMARY : {};
      activeViewBoxWidth = typeof PANGKALAN_VIEWBOX_WIDTH !== 'undefined' ? PANGKALAN_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof PANGKALAN_VIEWBOX_HEIGHT !== 'undefined' ? PANGKALAN_VIEWBOX_HEIGHT : 694;
    } else if (kecId === 'karawang-barat') {
      activeKecamatanId = 'karawang-barat';
      activeDesaData = typeof KARAWANG_BARAT_DESA_DATA !== 'undefined' ? KARAWANG_BARAT_DESA_DATA : [];
      activeSummary = typeof KARAWANG_BARAT_SUMMARY !== 'undefined' ? KARAWANG_BARAT_SUMMARY : {};
      activeViewBoxWidth = typeof KARAWANG_BARAT_VIEWBOX_WIDTH !== 'undefined' ? KARAWANG_BARAT_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof KARAWANG_BARAT_VIEWBOX_HEIGHT !== 'undefined' ? KARAWANG_BARAT_VIEWBOX_HEIGHT : 1051;
    } else if (kecId === 'rengasdengklok') {
      activeKecamatanId = 'rengasdengklok';
      activeDesaData = typeof RENGASDENGKLOK_DESA_DATA !== 'undefined' ? RENGASDENGKLOK_DESA_DATA : [];
      activeSummary = typeof RENGASDENGKLOK_SUMMARY !== 'undefined' ? RENGASDENGKLOK_SUMMARY : {};
      activeViewBoxWidth = typeof RENGASDENGKLOK_VIEWBOX_WIDTH !== 'undefined' ? RENGASDENGKLOK_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof RENGASDENGKLOK_VIEWBOX_HEIGHT !== 'undefined' ? RENGASDENGKLOK_VIEWBOX_HEIGHT : 1118;
    } else if (kecId === 'pedes') {
      activeKecamatanId = 'pedes';
      activeDesaData = typeof PEDES_DESA_DATA !== 'undefined' ? PEDES_DESA_DATA : [];
      activeSummary = typeof PEDES_SUMMARY !== 'undefined' ? PEDES_SUMMARY : {};
      activeViewBoxWidth = typeof PEDES_VIEWBOX_WIDTH !== 'undefined' ? PEDES_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof PEDES_VIEWBOX_HEIGHT !== 'undefined' ? PEDES_VIEWBOX_HEIGHT : 756;
    } else if (kecId === 'jayakerta') {
      activeKecamatanId = 'jayakerta';
      activeDesaData = typeof JAYAKERTA_DESA_DATA !== 'undefined' ? JAYAKERTA_DESA_DATA : [];
      activeSummary = typeof JAYAKERTA_SUMMARY !== 'undefined' ? JAYAKERTA_SUMMARY : {};
      activeViewBoxWidth = typeof JAYAKERTA_VIEWBOX_WIDTH !== 'undefined' ? JAYAKERTA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof JAYAKERTA_VIEWBOX_HEIGHT !== 'undefined' ? JAYAKERTA_VIEWBOX_HEIGHT : 490;
    } else if (kecId === 'cibuaya') {
      activeKecamatanId = 'cibuaya';
      activeDesaData = typeof CIBUAYA_DESA_DATA !== 'undefined' ? CIBUAYA_DESA_DATA : [];
      activeSummary = typeof CIBUAYA_SUMMARY !== 'undefined' ? CIBUAYA_SUMMARY : {};
      activeViewBoxWidth = typeof CIBUAYA_VIEWBOX_WIDTH !== 'undefined' ? CIBUAYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CIBUAYA_VIEWBOX_HEIGHT !== 'undefined' ? CIBUAYA_VIEWBOX_HEIGHT : 540;
    } else if (kecId === 'tirtajaya') {
      activeKecamatanId = 'tirtajaya';
      activeDesaData = typeof TIRTAJAYA_DESA_DATA !== 'undefined' ? TIRTAJAYA_DESA_DATA : [];
      activeSummary = typeof TIRTAJAYA_SUMMARY !== 'undefined' ? TIRTAJAYA_SUMMARY : {};
      activeViewBoxWidth = typeof TIRTAJAYA_VIEWBOX_WIDTH !== 'undefined' ? TIRTAJAYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TIRTAJAYA_VIEWBOX_HEIGHT !== 'undefined' ? TIRTAJAYA_VIEWBOX_HEIGHT : 627;
    } else if (kecId === 'karawang-timur') {
      activeKecamatanId = 'karawang-timur';
      activeDesaData = typeof KARAWANG_TIMUR_DESA_DATA !== 'undefined' ? KARAWANG_TIMUR_DESA_DATA : [];
      activeSummary = typeof KARAWANG_TIMUR_SUMMARY !== 'undefined' ? KARAWANG_TIMUR_SUMMARY : {};
      activeViewBoxWidth = typeof KARAWANG_TIMUR_VIEWBOX_WIDTH !== 'undefined' ? KARAWANG_TIMUR_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof KARAWANG_TIMUR_VIEWBOX_HEIGHT !== 'undefined' ? KARAWANG_TIMUR_VIEWBOX_HEIGHT : 1012;
    } else if (kecId === 'telukjambe-timur') {
      activeKecamatanId = 'telukjambe-timur';
      activeDesaData = typeof TELUKJAMBE_TIMUR_DESA_DATA !== 'undefined' ? TELUKJAMBE_TIMUR_DESA_DATA : [];
      activeSummary = typeof TELUKJAMBE_TIMUR_SUMMARY !== 'undefined' ? TELUKJAMBE_TIMUR_SUMMARY : {};
      activeViewBoxWidth = typeof TELUKJAMBE_TIMUR_VIEWBOX_WIDTH !== 'undefined' ? TELUKJAMBE_TIMUR_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TELUKJAMBE_TIMUR_VIEWBOX_HEIGHT !== 'undefined' ? TELUKJAMBE_TIMUR_VIEWBOX_HEIGHT : 999;
    } else if (kecId === 'telukjambe-barat') {
      activeKecamatanId = 'telukjambe-barat';
      activeDesaData = typeof TELUKJAMBE_BARAT_DESA_DATA !== 'undefined' ? TELUKJAMBE_BARAT_DESA_DATA : [];
      activeSummary = typeof TELUKJAMBE_BARAT_SUMMARY !== 'undefined' ? TELUKJAMBE_BARAT_SUMMARY : {};
      activeViewBoxWidth = typeof TELUKJAMBE_BARAT_VIEWBOX_WIDTH !== 'undefined' ? TELUKJAMBE_BARAT_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TELUKJAMBE_BARAT_VIEWBOX_HEIGHT !== 'undefined' ? TELUKJAMBE_BARAT_VIEWBOX_HEIGHT : 1037;
    } else if (kecId === 'purwasari') {
      activeKecamatanId = 'purwasari';
      activeDesaData = typeof PURWASARI_DESA_DATA !== 'undefined' ? PURWASARI_DESA_DATA : [];
      activeSummary = typeof PURWASARI_SUMMARY !== 'undefined' ? PURWASARI_SUMMARY : {};
      activeViewBoxWidth = typeof PURWASARI_VIEWBOX_WIDTH !== 'undefined' ? PURWASARI_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof PURWASARI_VIEWBOX_HEIGHT !== 'undefined' ? PURWASARI_VIEWBOX_HEIGHT : 1006;
    } else if (kecId === 'cikampek') {
      activeKecamatanId = 'cikampek';
      activeDesaData = typeof CIKAMPEK_DESA_DATA !== 'undefined' ? CIKAMPEK_DESA_DATA : [];
      activeSummary = typeof CIKAMPEK_SUMMARY !== 'undefined' ? CIKAMPEK_SUMMARY : {};
      activeViewBoxWidth = typeof CIKAMPEK_VIEWBOX_WIDTH !== 'undefined' ? CIKAMPEK_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CIKAMPEK_VIEWBOX_HEIGHT !== 'undefined' ? CIKAMPEK_VIEWBOX_HEIGHT : 632;
    } else if (kecId === 'kotabaru') {
      activeKecamatanId = 'kotabaru';
      activeDesaData = typeof KOTABARU_DESA_DATA !== 'undefined' ? KOTABARU_DESA_DATA : [];
      activeSummary = typeof KOTABARU_SUMMARY !== 'undefined' ? KOTABARU_SUMMARY : {};
      activeViewBoxWidth = typeof KOTABARU_VIEWBOX_WIDTH !== 'undefined' ? KOTABARU_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof KOTABARU_VIEWBOX_HEIGHT !== 'undefined' ? KOTABARU_VIEWBOX_HEIGHT : 604;
    } else if (kecId === 'jatisari') {
      activeKecamatanId = 'jatisari';
      activeDesaData = typeof JATISARI_DESA_DATA !== 'undefined' ? JATISARI_DESA_DATA : [];
      activeSummary = typeof JATISARI_SUMMARY !== 'undefined' ? JATISARI_SUMMARY : {};
      activeViewBoxWidth = typeof JATISARI_VIEWBOX_WIDTH !== 'undefined' ? JATISARI_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof JATISARI_VIEWBOX_HEIGHT !== 'undefined' ? JATISARI_VIEWBOX_HEIGHT : 840;
    } else if (kecId === 'banyusari') {
      activeKecamatanId = 'banyusari';
      activeDesaData = typeof BANYUSARI_DESA_DATA !== 'undefined' ? BANYUSARI_DESA_DATA : [];
      activeSummary = typeof BANYUSARI_SUMMARY !== 'undefined' ? BANYUSARI_SUMMARY : {};
      activeViewBoxWidth = typeof BANYUSARI_VIEWBOX_WIDTH !== 'undefined' ? BANYUSARI_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof BANYUSARI_VIEWBOX_HEIGHT !== 'undefined' ? BANYUSARI_VIEWBOX_HEIGHT : 458;
    } else if (kecId === 'cilamaya-wetan') {
      activeKecamatanId = 'cilamaya-wetan';
      activeDesaData = typeof CILAMAYA_WETAN_DESA_DATA !== 'undefined' ? CILAMAYA_WETAN_DESA_DATA : [];
      activeSummary = typeof CILAMAYA_WETAN_SUMMARY !== 'undefined' ? CILAMAYA_WETAN_SUMMARY : {};
      activeViewBoxWidth = typeof CILAMAYA_WETAN_VIEWBOX_WIDTH !== 'undefined' ? CILAMAYA_WETAN_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CILAMAYA_WETAN_VIEWBOX_HEIGHT !== 'undefined' ? CILAMAYA_WETAN_VIEWBOX_HEIGHT : 559;
    } else if (kecId === 'cilamaya-kulon') {
      activeKecamatanId = 'cilamaya-kulon';
      activeDesaData = typeof CILAMAYA_KULON_DESA_DATA !== 'undefined' ? CILAMAYA_KULON_DESA_DATA : [];
      activeSummary = typeof CILAMAYA_KULON_SUMMARY !== 'undefined' ? CILAMAYA_KULON_SUMMARY : {};
      activeViewBoxWidth = typeof CILAMAYA_KULON_VIEWBOX_WIDTH !== 'undefined' ? CILAMAYA_KULON_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CILAMAYA_KULON_VIEWBOX_HEIGHT !== 'undefined' ? CILAMAYA_KULON_VIEWBOX_HEIGHT : 938;
    } else if (kecId === 'tempuran') {
      activeKecamatanId = 'tempuran';
      activeDesaData = typeof TEMPURAN_DESA_DATA !== 'undefined' ? TEMPURAN_DESA_DATA : [];
      activeSummary = typeof TEMPURAN_SUMMARY !== 'undefined' ? TEMPURAN_SUMMARY : {};
      activeViewBoxWidth = typeof TEMPURAN_VIEWBOX_WIDTH !== 'undefined' ? TEMPURAN_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TEMPURAN_VIEWBOX_HEIGHT !== 'undefined' ? TEMPURAN_VIEWBOX_HEIGHT : 593;
    } else if (kecId === 'tirtamulya') {
      activeKecamatanId = 'tirtamulya';
      activeDesaData = typeof TIRTAMULYA_DESA_DATA !== 'undefined' ? TIRTAMULYA_DESA_DATA : [];
      activeSummary = typeof TIRTAMULYA_SUMMARY !== 'undefined' ? TIRTAMULYA_SUMMARY : {};
      activeViewBoxWidth = typeof TIRTAMULYA_VIEWBOX_WIDTH !== 'undefined' ? TIRTAMULYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TIRTAMULYA_VIEWBOX_HEIGHT !== 'undefined' ? TIRTAMULYA_VIEWBOX_HEIGHT : 719;
    } else if (kecId === 'rawamerta') {
      activeKecamatanId = 'rawamerta';
      activeDesaData = typeof RAWAMERTA_DESA_DATA !== 'undefined' ? RAWAMERTA_DESA_DATA : [];
      activeSummary = typeof RAWAMERTA_SUMMARY !== 'undefined' ? RAWAMERTA_SUMMARY : {};
      activeViewBoxWidth = typeof RAWAMERTA_VIEWBOX_WIDTH !== 'undefined' ? RAWAMERTA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof RAWAMERTA_VIEWBOX_HEIGHT !== 'undefined' ? RAWAMERTA_VIEWBOX_HEIGHT : 533;
    } else if (kecId === 'kutawaluya') {
      activeKecamatanId = 'kutawaluya';
      activeDesaData = typeof KUTAWALUYA_DESA_DATA !== 'undefined' ? KUTAWALUYA_DESA_DATA : [];
      activeSummary = typeof KUTAWALUYA_SUMMARY !== 'undefined' ? KUTAWALUYA_SUMMARY : {};
      activeViewBoxWidth = typeof KUTAWALUYA_VIEWBOX_WIDTH !== 'undefined' ? KUTAWALUYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof KUTAWALUYA_VIEWBOX_HEIGHT !== 'undefined' ? KUTAWALUYA_VIEWBOX_HEIGHT : 588;
    } else {
      activeKecamatanId = 'cilebar';
      activeDesaData = typeof CILEBAR_DESA_DATA !== 'undefined' ? CILEBAR_DESA_DATA : [];
      activeSummary = typeof CILEBAR_SUMMARY !== 'undefined' ? CILEBAR_SUMMARY : {};
      activeViewBoxWidth = typeof CILEBAR_VIEWBOX_WIDTH !== 'undefined' ? CILEBAR_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CILEBAR_VIEWBOX_HEIGHT !== 'undefined' ? CILEBAR_VIEWBOX_HEIGHT : 742;
    }

    const kecName = activeKecamatanId === 'karawang-barat' ? 'Karawang Barat'
      : activeKecamatanId === 'tirtajaya' ? 'Tirtajaya'
      : activeKecamatanId === 'cibuaya' ? 'Cibuaya'
      : activeKecamatanId === 'jayakerta' ? 'Jayakerta'
      : activeKecamatanId === 'pedes' ? 'Pedes'
      : activeKecamatanId === 'rengasdengklok' ? 'Rengasdengklok'
      : activeKecamatanId === 'lemahabang' ? 'Lemahabang'
      : activeKecamatanId === 'talagasari' ? 'Talagasari'
      : activeKecamatanId === 'majalaya' ? 'Majalaya'
      : activeKecamatanId === 'karawang-timur' ? 'Karawang Timur'
      : activeKecamatanId === 'telukjambe-timur' ? 'Telukjambe Timur'
      : activeKecamatanId === 'telukjambe-barat' ? 'Telukjambe Barat'
      : activeKecamatanId === 'pangkalan' ? 'Pangkalan'
      : activeKecamatanId === 'klari' ? 'Klari'
      : activeKecamatanId === 'ciampel' ? 'Ciampel'
      : activeKecamatanId === 'tegalwaru' ? 'Tegalwaru'
      : activeKecamatanId === 'purwasari' ? 'Purwasari'
      : activeKecamatanId === 'cikampek' ? 'Cikampek'
      : activeKecamatanId === 'kotabaru' ? 'Kotabaru'
      : activeKecamatanId === 'jatisari' ? 'Jatisari'
      : activeKecamatanId === 'banyusari' ? 'Banyusari'
      : activeKecamatanId === 'cilamaya-wetan' ? 'Cilamaya Wetan'
      : activeKecamatanId === 'cilamaya-kulon' ? 'Cilamaya Kulon'
      : activeKecamatanId === 'tempuran' ? 'Tempuran'
      : activeKecamatanId === 'tirtamulya' ? 'Tirtamulya'
      : activeKecamatanId === 'rawamerta' ? 'Rawamerta'
      : activeKecamatanId === 'kutawaluya' ? 'Kutawaluya'
      : 'Cilebar';

    // 1. Update Titles
    const kecViewTitle = document.getElementById('kecViewTitle');
    const kecViewDesc = document.getElementById('kecViewDesc');
    const desaMapTitle = document.getElementById('desaMapTitle');
    const desaTableTitle = document.getElementById('desaTableTitle');

    if (kecViewTitle) kecViewTitle.textContent = 'Kecamatan ' + kecName;
    if (kecViewDesc) kecViewDesc.textContent = `Detail data per desa/kelurahan pada Kecamatan ${kecName}.`;
    if (desaMapTitle) desaMapTitle.textContent = `Peta Desa/Kelurahan - Kecamatan ${kecName}`;
    if (desaTableTitle) desaTableTitle.textContent = `Daftar Desa/Kelurahan - Kecamatan ${kecName}`;

    // 2. Set Map SVG viewBox
    mapSvgCil.setAttribute('viewBox', `0 0 ${activeViewBoxWidth} ${activeViewBoxHeight}`);

    // Reset Pan & Zoom
    cilZoom = 1.0;
    cilPanX = 0;
    cilPanY = 0;
    applyCilTransform();

    // 3. Populate 5 Top Summary Cards
    const kecSisa = (activeSummary.sisaTagihan !== undefined) ? activeSummary.sisaTagihan : Math.max(0, activeSummary.target - activeSummary.realisasi);
    kecSumTarget.textContent = formatRupiah(activeSummary.target);
    kecSumRealisasi.textContent = formatRupiah(activeSummary.realisasi);
    kecSumSisa.textContent = formatRupiah(kecSisa);
    kecSumCapaian.textContent = activeSummary.capaianFormatted;
    donutKecCenterPct.textContent = activeSummary.capaianFormatted;
    donutProgressKec.setAttribute('stroke-dasharray', `${Math.min(100, activeSummary.capaian)}, 100`);

    const donutColor = activeSummary.tier === 'green' ? '#2ea868'
      : activeSummary.tier === 'yellow' ? '#f5d547'
        : activeSummary.tier === 'orange' ? '#f59e42'
          : '#ea3838';
    donutProgressKec.setAttribute('stroke', donutColor);

    kecSumJumlahDesa.textContent = activeSummary.jumlahDesa + (activeKecamatanId === 'karawang-barat' ? ' Kelurahan' : ' Desa');

    // 4. Reset Sort state
    currentSortMode = 'default';
    const sortPctIcon = document.getElementById('sortPctIcon');
    if (sortPctIcon) sortPctIcon.textContent = '⇅';

    // 5. Render Village Map
    renderDesaMap();

    // 6. Render Village Table
    renderDesaTable();
    // 7. Default Select initial village
    const initialDesa = activeKecamatanId === 'karawang-barat' ? 'karangpawitan'
      : activeKecamatanId === 'tirtajaya' ? 'medankarya'
      : activeKecamatanId === 'cibuaya' ? 'sukasari'
      : activeKecamatanId === 'jayakerta' ? 'medangasem'
      : activeKecamatanId === 'pedes' ? 'jatimulya'
      : activeKecamatanId === 'rengasdengklok' ? 'kalangsari'
      : activeKecamatanId === 'lemahabang' ? 'ciwaringin'
      : activeKecamatanId === 'talagasari' ? 'cadaskertajaya'
      : activeKecamatanId === 'majalaya' ? 'bengle'
      : activeKecamatanId === 'karawang-timur' ? 'kondangjaya'
      : activeKecamatanId === 'telukjambe-timur' ? 'pinayungan'
      : activeKecamatanId === 'telukjambe-barat' ? 'karangligar'
      : activeKecamatanId === 'pangkalan' ? 'cintaasih'
      : activeKecamatanId === 'klari' ? 'anggadita'
      : activeKecamatanId === 'ciampel' ? 'kutamekar'
      : activeKecamatanId === 'tegalwaru' ? 'cigunungsari'
      : activeKecamatanId === 'purwasari' ? 'mekarjaya'
      : activeKecamatanId === 'cikampek' ? 'cikampek-barat'
      : activeKecamatanId === 'kotabaru' ? 'cikampek-utara'
      : activeKecamatanId === 'jatisari' ? 'balonggandu'
      : activeKecamatanId === 'banyusari' ? 'banyuasih'
      : activeKecamatanId === 'cilamaya-wetan' ? 'cikalong'
      : activeKecamatanId === 'cilamaya-kulon' ? 'bayur-kidul'
      : activeKecamatanId === 'tempuran' ? 'tempuran'
      : activeKecamatanId === 'tirtamulya' ? 'karangsinom'
      : activeKecamatanId === 'rawamerta' ? 'purwamekar'
      : activeKecamatanId === 'kutawaluya' ? 'sindangkarya'
      : 'sukaratu';
    selectDesa(initialDesa);
  }

  function renderDesaMap() {
    polygonsGroupCil.innerHTML = '';
    labelsGroupCil.innerHTML = '';

    activeDesaData.forEach(d => {
      // Path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d.path);
      path.setAttribute('fill', d.color);
      path.setAttribute('class', 'desa-polygon' + (d.id === selectedDesaId ? ' selected' : ''));
      path.setAttribute('id', 'desa-poly-' + d.id);
      path.setAttribute('data-id', d.id);

      path.addEventListener('click', () => {
        selectDesa(d.id);
      });

      polygonsGroupCil.appendChild(path);

      // Label (Name + Percentage on 2 lines)
      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      labelGroup.setAttribute('class', 'map-label-group');

      let lx = d.cx;
      let ly = d.cy;
      // Cilebar fine-tune offsets
      if (d.name === 'Pusakajaya Utara') { ly -= 6; }
      if (d.name === 'Kertamukti') { lx += 4; }
      if (d.name === 'Rawasari') { lx -= 2; }
      if (d.name === 'Kosambibatu') { lx += 8; }
      if (d.name === 'Mekarpohaci') { ly += 2; }
      if (d.name === 'Tanjungsari') { ly += 4; }

      // Tempuran fine-tune offsets
      if (d.name === 'Ciparagejaya') { ly += 2; lx -= 4; }
      if (d.name === 'Lemahmakmur') { ly += 4; }
      if (d.name === 'Lemahsubur') { lx -= 4; }
      if (d.name === 'Pagadungan') { ly -= 2; }

      // Cilamaya Kulon fine-tune offsets
      if (d.name === 'Bayur Kidul') { ly += 2; }
      if (d.name === 'Muktijaya') { lx += 2; }
      if (d.name === 'Langensari') { ly -= 2; }
      if (d.name === 'Pasirukem') { ly += 2; }
      if (d.name === 'Sukajaya') { ly -= 4; }

      // Cilamaya Wetan fine-tune offsets
      if (d.name === 'Muara Baru') { ly -= 2; }
      if (d.name === 'Rawagempol Kulon') { ly -= 2; }
      if (d.name === 'Rawagempol Wetan') { ly += 2; }
      if (d.name === 'Sukatani') { ly += 2; }
      if (d.name === 'Tegalsari') { ly += 2; }

      // Banyusari fine-tune offsets
      if (d.name === 'Cicinde Selatan') { ly -= 2; }
      if (d.name === 'Gempol Kolot') { lx -= 4; }
      if (d.name === 'Jayamukti') { ly += 2; }
      if (d.name === 'Tanjung') { ly -= 2; }

      // Jatisari fine-tune offsets
      if (d.name === 'Cikalongsari') { ly -= 2; }
      if (d.name === 'Jatiragas') { ly += 2; }
      if (d.name === 'Barugbug') { ly += 2; }
      if (d.name === 'Situdam') { lx -= 4; }

      // Kotabaru fine-tune offsets
      if (d.name === 'Jomin Barat') { lx -= 4; }
      if (d.name === 'Jomin Timur') { lx += 4; }
      if (d.name === 'Sarimulya') { ly += 2; }

      // Cikampek fine-tune offsets
      if (d.name === 'Cikampek Selatan') { lx -= 4; }
      if (d.name === 'Cikampek Kota') { lx += 4; }

      // Purwasari fine-tune offsets
      if (d.name === 'Mekarjaya') { lx -= 4; }
      if (d.name === 'Tamelang') { lx += 4; }

      // Klari fine-tune offsets
      if (d.name === 'Klari') { lx -= 4; }
      if (d.name === 'Duren') { lx += 4; }

      // Ciampel fine-tune offsets
      if (d.name === 'Kutamekar') { ly -= 2; }
      if (d.name === 'Parungmulya') { lx += 2; }

      // Karawang Timur fine-tune offsets
      if (d.name === 'Kelurahan Karawang Wetan') { lx -= 4; }
      if (d.name === 'Kelurahan Adiarsa Timur') { lx -= 2; }
      if (d.name === 'Kondangjaya') { lx += 2; }

      // Tegalwaru fine-tune offsets
      if (d.name === 'Cigunungsari') { lx -= 2; }
      if (d.name === 'Mekarbuana') { ly += 2; }

      // Pangkalan fine-tune offsets
      if (d.name === 'Tamansari') { ly -= 2; }
      if (d.name === 'Ciptasari') { lx += 2; }

      // Telukjambe Timur fine-tune offsets
      if (d.name === 'Sukaharja') { ly -= 2; }
      if (d.name === 'Sukaluyu') { lx -= 2; }

      // Telukjambe Barat fine-tune offsets
      if (d.name === 'Wanakerta') { lx -= 2; }
      if (d.name === 'Wanasari') { lx += 2; }



      const textName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textName.setAttribute('x', lx);
      textName.setAttribute('y', ly - 2);
      textName.setAttribute('class', 'desa-label-name');
      textName.textContent = d.name.replace(/^Kelurahan\s+/, 'Kel. ');

      const textPct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textPct.setAttribute('x', lx);
      textPct.setAttribute('y', ly + 10);
      textPct.setAttribute('class', 'desa-label-pct');
      textPct.textContent = Math.round(d.capaian) + '%';

      labelGroup.appendChild(textName);
      labelGroup.appendChild(textPct);
      labelsGroupCil.appendChild(labelGroup);
    });
  }

  function renderDesaTable(query = '') {
    desaTableBody.innerHTML = '';
    let filtered = [...activeDesaData];

    if (query) {
      filtered = filtered.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || (d.aliases && d.aliases.some(a => a.toLowerCase().includes(query.toLowerCase()))));
    }

    if (currentSortMode === 'desc') {
      filtered.sort((a, b) => b.capaian - a.capaian);
    } else if (currentSortMode === 'asc') {
      filtered.sort((a, b) => a.capaian - b.capaian);
    }

    filtered.forEach(d => {
      const tr = document.createElement('tr');
      tr.className = (d.id === selectedDesaId ? 'active' : '');
      tr.id = 'desa-row-' + d.id;

      // Columns: No, Nama Desa, Persentase, Status, Aksi
      tr.innerHTML = `
        <td>${d.no}</td>
        <td>${d.name}</td>
        <td>${d.capaianFormatted}</td>
        <td>
          <div class="td-status">
            <span class="status-dot-sm ${d.statusDotClass}"></span>
            <span>${d.statusText}</span>
          </div>
        </td>
        <td style="text-align: center;">
          <button class="btn-row-action" title="Lihat detail ${d.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </td>
      `;

      tr.addEventListener('click', () => {
        selectDesa(d.id);
      });

      desaTableBody.appendChild(tr);
    });
  }

  // Sort by Capaian header listener
  const thPersentase = document.getElementById('thPersentase');
  if (thPersentase) {
    thPersentase.addEventListener('click', () => {
      const sortPctIcon = document.getElementById('sortPctIcon');
      if (currentSortMode === 'default') {
        currentSortMode = 'desc';
        if (sortPctIcon) sortPctIcon.textContent = '▼';
      } else if (currentSortMode === 'desc') {
        currentSortMode = 'asc';
        if (sortPctIcon) sortPctIcon.textContent = '▲';
      } else {
        currentSortMode = 'default';
        if (sortPctIcon) sortPctIcon.textContent = '⇅';
      }
      renderDesaTable(searchDesaInput.value.trim());
    });
  }

  function selectDesa(id) {
    selectedDesaId = id;
    let desa = activeDesaData.find(d => d.id === id || (d.aliases && d.aliases.includes(id)));
    if (!desa && activeDesaData.length > 0) {
      desa = activeDesaData[0];
      selectedDesaId = desa.id;
    }

    // 1. Highlight Polygon
    document.querySelectorAll('.desa-polygon').forEach(p => p.classList.remove('selected'));
    const poly = document.getElementById('desa-poly-' + selectedDesaId);
    if (poly) poly.classList.add('selected');

    // 2. Highlight Table Row
    document.querySelectorAll('#desaTableBody tr').forEach(r => r.classList.remove('active'));
    const row = document.getElementById('desa-row-' + selectedDesaId);
    if (row) {
      row.classList.add('active');
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 3. Show Tooltip on Map
    if (desa) {
      const desaSisa = (desa.sisaTagihan !== undefined) ? desa.sisaTagihan : Math.max(0, desa.target - desa.realisasi);
      const prefix = (desa.jenis_kd === 'Kelurahan' || desa.name.startsWith('Kelurahan')) ? '' : 'Desa ';
      desaPopupName.textContent = prefix + desa.name;
      desaPopupTarget.textContent = formatRupiah(desa.target);
      desaPopupRealisasi.textContent = formatRupiah(desa.realisasi);
      if (desaPopupSisa) desaPopupSisa.textContent = formatRupiah(desaSisa);
      desaPopupCapaian.textContent = desa.capaianFormatted;
      desaPopupBadgeText.textContent = desa.statusText;
      const dot = desaPopupBadge.querySelector('.status-dot');
      if (dot) dot.style.backgroundColor = desa.color;

      const px = (desa.cx / activeViewBoxWidth) * 100;
      const py = (desa.cy / activeViewBoxHeight) * 100;
      desaPopup.style.left = `${px}%`;
      desaPopup.style.top = `${py}%`;
      desaPopup.style.display = 'block';

      // 4. Update Bottom Section (Detail Desa/Kelurahan)
      updateBottomDesaSection(desa);
    }
  }

  function updateBottomDesaSection(d) {
    const kecName = activeKecamatanId === 'karawang-barat' ? 'Karawang Barat'
      : activeKecamatanId === 'tirtajaya' ? 'Tirtajaya'
      : activeKecamatanId === 'cibuaya' ? 'Cibuaya'
      : activeKecamatanId === 'jayakerta' ? 'Jayakerta'
      : activeKecamatanId === 'pedes' ? 'Pedes'
      : activeKecamatanId === 'rengasdengklok' ? 'Rengasdengklok'
      : activeKecamatanId === 'lemahabang' ? 'Lemahabang'
      : activeKecamatanId === 'talagasari' ? 'Talagasari'
      : activeKecamatanId === 'majalaya' ? 'Majalaya'
      : activeKecamatanId === 'karawang-timur' ? 'Karawang Timur'
      : activeKecamatanId === 'telukjambe-timur' ? 'Telukjambe Timur'
      : activeKecamatanId === 'telukjambe-barat' ? 'Telukjambe Barat'
      : activeKecamatanId === 'pangkalan' ? 'Pangkalan'
      : activeKecamatanId === 'klari' ? 'Klari'
      : activeKecamatanId === 'ciampel' ? 'Ciampel'
      : activeKecamatanId === 'tegalwaru' ? 'Tegalwaru'
      : activeKecamatanId === 'purwasari' ? 'Purwasari'
      : activeKecamatanId === 'cikampek' ? 'Cikampek'
      : activeKecamatanId === 'kotabaru' ? 'Kotabaru'
      : activeKecamatanId === 'jatisari' ? 'Jatisari'
      : activeKecamatanId === 'banyusari' ? 'Banyusari'
      : activeKecamatanId === 'cilamaya-wetan' ? 'Cilamaya Wetan'
      : activeKecamatanId === 'cilamaya-kulon' ? 'Cilamaya Kulon'
      : activeKecamatanId === 'tempuran' ? 'Tempuran'
      : activeKecamatanId === 'tirtamulya' ? 'Tirtamulya'
      : activeKecamatanId === 'rawamerta' ? 'Rawamerta'
      : activeKecamatanId === 'kutawaluya' ? 'Kutawaluya'
      : 'Cilebar';

    if (desaDetailHeading) {
      const prefix = (d.jenis_kd === 'Kelurahan' || d.name.startsWith('Kelurahan')) ? '' : 'Desa ';
      desaDetailHeading.textContent = `Detail ${prefix}${d.name} - Kecamatan ${kecName}`;
    }
    if (desaDetailKecamatanBadge) {
      desaDetailKecamatanBadge.textContent = `Kecamatan ${kecName}`;
    }
    const currentYear = (yearSelectKec ? yearSelectKec.value : '2026');
    if (desaDetailYearText) {
      desaDetailYearText.textContent = currentYear;
    }

    desaPillTitle.textContent = d.rawName || d.name.replace(/^(Kelurahan|Desa)\s+/i, '');
    desaPillDot.className = 'desa-indicator-dot ' + d.statusDotClass;
    desaPillStatusTag.className = 'desa-pill-status-tag tag-' + d.tier;
    desaPillStatusTag.textContent = d.statusText;

    const dSisa = (d.sisaTagihan !== undefined) ? d.sisaTagihan : Math.max(0, d.target - d.realisasi);
    desaDetailTarget.textContent = formatRupiah(d.target);
    desaDetailRealisasi.textContent = formatRupiah(d.realisasi);
    desaDetailSisa.textContent = formatRupiah(dSisa);

    // Donut Progress & Tier Color
    donutDesaBottom.setAttribute('stroke-dasharray', `${Math.min(100, d.capaian)}, 100`);
    donutDesaBottomCenterPct.textContent = d.capaianFormatted;
    const desaDonutColor = d.tier === 'green' ? '#2ea868'
      : d.tier === 'yellow' ? '#f5d547'
        : d.tier === 'orange' ? '#f59e42'
          : '#ea3838';
    donutDesaBottom.setAttribute('stroke', desaDonutColor);

    // Advisory
    desaAdvisoryText.textContent = d.info;

    // Breakdown Cards
    valObyekTerdaftar.textContent = d.obyekTerdaftar.toLocaleString('id-ID');
    valObyekLunas.textContent = d.obyekLunas.toLocaleString('id-ID');
    valObyekBelumLunas.textContent = d.obyekBelumLunas.toLocaleString('id-ID');

    valBreakdownPct.textContent = d.capaianFormatted;
    barBreakdownFill.style.width = `${Math.min(100, d.capaian)}%`;
    barBreakdownFill.className = 'progress-bar-fill-lg fill-' + d.tier;
  }

  // Pan and Zoom - Cilebar Map
  function applyCilTransform() {
    mapSvgCil.style.transform = `translate(${cilPanX}px, ${cilPanY}px) scale(${cilZoom})`;
  }

  document.getElementById('cilebarZoomIn').addEventListener('click', () => {
    cilZoom = Math.min(2.5, cilZoom + 0.2);
    applyCilTransform();
  });

  document.getElementById('cilebarZoomOut').addEventListener('click', () => {
    cilZoom = Math.max(0.8, cilZoom - 0.2);
    applyCilTransform();
  });

  mapContainerCil.addEventListener('wheel', (e) => {
    e.preventDefault();
    cilZoom = (e.deltaY < 0) ? Math.min(2.5, cilZoom + 0.1) : Math.max(0.8, cilZoom - 0.1);
    applyCilTransform();
  }, { passive: false });

  mapContainerCil.addEventListener('mousedown', (e) => {
    if (e.target.closest('#desaPopupCard') || e.target.closest('.map-zoom-controls') || e.target.closest('.cilebar-legend')) return;
    cilDragging = true;
    cilStartX = e.clientX - cilPanX;
    cilStartY = e.clientY - cilPanY;
    mapContainerCil.classList.add('dragging');
  });

  // Map Mode Toggle (Peta / Satelit)
  btnModePeta.addEventListener('click', () => {
    btnModePeta.classList.add('active');
    btnModeSatelit.classList.remove('active');
    mapContainerCil.classList.remove('satelit-mode');
  });

  btnModeSatelit.addEventListener('click', () => {
    btnModeSatelit.classList.add('active');
    btnModePeta.classList.remove('active');
    mapContainerCil.classList.add('satelit-mode');
  });

  btnMapFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      mapContainerCil.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  });

  searchDesaInput.addEventListener('input', (e) => {
    renderDesaTable(e.target.value.trim());
  });

  btnBackToDaftarDesa.addEventListener('click', () => {
    const tablePanel = document.querySelector('.desa-table-panel');
    if (tablePanel) {
      tablePanel.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // =========================================================================
  // ADMIN DROPDOWN & SIDEBAR TABS
  // =========================================================================
  document.querySelectorAll('.admin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.admin-dropdown-container');
      if (container) container.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.admin-dropdown-container').forEach(c => c.classList.remove('open'));
  });

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      const href = (item.getAttribute('href') || '').toLowerCase();
      const id = (item.id || '').toLowerCase();
      const view = (item.dataset && item.dataset.view ? item.dataset.view : '').toLowerCase();

      if (id === 'menu-penggunaan' || id === 'menu-pengguna' || href === '#penggunaan' || href === '#pengguna' || href === '#penggunaan-pajak' || href === '#pengguna-pajak' || view === 'penggunaan') {
        switchView('penggunaan');
      } else if (id === 'menu-informasi' || href === '#informasi' || href === '#info' || view === 'informasi') {
        switchView('informasi');
      } else if (id === 'menu-peta' || id === 'menu-beranda' || id === 'menu-realisasi' || href === '#beranda' || href === '#peta' || href === '#kabupaten' || href === '#realisasi') {
        switchView('kabupaten');
      }
    });
  });

  // Flag so initial server params are only consumed on cold initial load
  let initialServerParamChecked = false;

  // Hash & Route Routing support
  function handleHash() {
    const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];

    const hash = window.location.hash || '';
    const cleanHash = hash.toLowerCase().trim().replace(/^[#\/]+/, '');

    // 1. TOP PRIORITY: Client-side Hash Navigation
    if (cleanHash) {
      if (cleanHash === 'pengguna' || cleanHash === 'penggunaan' || cleanHash === 'penggunaan-pajak' || cleanHash === 'pengguna-pajak') {
        switchView('penggunaan');
        return;
      }

      if (cleanHash === 'informasi' || cleanHash === 'info') {
        switchView('informasi');
        return;
      }

      if (cleanHash === 'kabupaten' || cleanHash === 'peta' || cleanHash === 'beranda' || cleanHash === 'realisasi') {
        switchView('kabupaten');
        return;
      }

      if (hash.startsWith('#desa') || cleanHash.startsWith('desa-') || cleanHash.startsWith('desa/')) {
        const desaId = cleanHash.replace(/^desa[-/]/, '') || hash.replace('#desa-', '');
        const inTirtajaya = typeof TIRTAJAYA_DESA_DATA !== 'undefined' && TIRTAJAYA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inCibuaya = typeof CIBUAYA_DESA_DATA !== 'undefined' && CIBUAYA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inJayakerta = typeof JAYAKERTA_DESA_DATA !== 'undefined' && JAYAKERTA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inPedes = typeof PEDES_DESA_DATA !== 'undefined' && PEDES_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inRengasdengklok = typeof RENGASDENGKLOK_DESA_DATA !== 'undefined' && RENGASDENGKLOK_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inLemahabang = typeof LEMAHABANG_DESA_DATA !== 'undefined' && LEMAHABANG_DESA_DATA.some(d => d.id === desaId);
        const inTalagasari = typeof TALAGASARI_DESA_DATA !== 'undefined' && TALAGASARI_DESA_DATA.some(d => d.id === desaId);
        const inMajalaya = typeof MAJALAYA_DESA_DATA !== 'undefined' && MAJALAYA_DESA_DATA.some(d => d.id === desaId);
        const inKarawangBarat = typeof KARAWANG_BARAT_DESA_DATA !== 'undefined' && KARAWANG_BARAT_DESA_DATA.some(d => d.id === desaId);
        const inKarawangTimur = typeof KARAWANG_TIMUR_DESA_DATA !== 'undefined' && KARAWANG_TIMUR_DESA_DATA.some(d => d.id === desaId);
        const inTelukjambeTimur = typeof TELUKJAMBE_TIMUR_DESA_DATA !== 'undefined' && TELUKJAMBE_TIMUR_DESA_DATA.some(d => d.id === desaId);
        const inTelukjambeBarat = typeof TELUKJAMBE_BARAT_DESA_DATA !== 'undefined' && TELUKJAMBE_BARAT_DESA_DATA.some(d => d.id === desaId);
        const inPangkalan = typeof PANGKALAN_DESA_DATA !== 'undefined' && PANGKALAN_DESA_DATA.some(d => d.id === desaId);
        const inKlari = typeof KLARI_DESA_DATA !== 'undefined' && KLARI_DESA_DATA.some(d => d.id === desaId);
        const inCiampel = typeof CIAMPEL_DESA_DATA !== 'undefined' && CIAMPEL_DESA_DATA.some(d => d.id === desaId);
        const inTegalwaru = typeof TEGALWARU_DESA_DATA !== 'undefined' && TEGALWARU_DESA_DATA.some(d => d.id === desaId);
        const inPurwasari = typeof PURWASARI_DESA_DATA !== 'undefined' && PURWASARI_DESA_DATA.some(d => d.id === desaId);
        const inCikampek = typeof CIKAMPEK_DESA_DATA !== 'undefined' && CIKAMPEK_DESA_DATA.some(d => d.id === desaId);
        const inKotabaru = typeof KOTABARU_DESA_DATA !== 'undefined' && KOTABARU_DESA_DATA.some(d => d.id === desaId);
        const inJatisari = typeof JATISARI_DESA_DATA !== 'undefined' && JATISARI_DESA_DATA.some(d => d.id === desaId);
        const inBanyusari = typeof BANYUSARI_DESA_DATA !== 'undefined' && BANYUSARI_DESA_DATA.some(d => d.id === desaId);
        const inCilamayaWetan = typeof CILAMAYA_WETAN_DESA_DATA !== 'undefined' && CILAMAYA_WETAN_DESA_DATA.some(d => d.id === desaId);
        const inCilamayaKulon = typeof CILAMAYA_KULON_DESA_DATA !== 'undefined' && CILAMAYA_KULON_DESA_DATA.some(d => d.id === desaId);
        const inTempuran = typeof TEMPURAN_DESA_DATA !== 'undefined' && TEMPURAN_DESA_DATA.some(d => d.id === desaId);
        const inTirtamulya = typeof TIRTAMULYA_DESA_DATA !== 'undefined' && TIRTAMULYA_DESA_DATA.some(d => d.id === desaId);
        const inRawamerta = typeof RAWAMERTA_DESA_DATA !== 'undefined' && RAWAMERTA_DESA_DATA.some(d => d.id === desaId);
        const inKutawaluya = typeof KUTAWALUYA_DESA_DATA !== 'undefined' && KUTAWALUYA_DESA_DATA.some(d => d.id === desaId);
        const targetKec = inKarawangBarat ? 'karawang-barat'
          : inTirtajaya ? 'tirtajaya'
          : inCibuaya ? 'cibuaya'
          : inJayakerta ? 'jayakerta'
          : inPedes ? 'pedes'
          : inRengasdengklok ? 'rengasdengklok'
          : inLemahabang ? 'lemahabang'
          : inTalagasari ? 'talagasari'
          : inMajalaya ? 'majalaya'
          : inKarawangTimur ? 'karawang-timur'
          : inTelukjambeTimur ? 'telukjambe-timur'
          : inTelukjambeBarat ? 'telukjambe-barat'
          : inPangkalan ? 'pangkalan'
          : inKlari ? 'klari'
          : inCiampel ? 'ciampel'
          : inTegalwaru ? 'tegalwaru'
          : inPurwasari ? 'purwasari'
          : inCikampek ? 'cikampek'
          : inKotabaru ? 'kotabaru'
          : inJatisari ? 'jatisari'
          : inBanyusari ? 'banyusari'
          : inCilamayaWetan ? 'cilamaya-wetan'
          : inCilamayaKulon ? 'cilamaya-kulon'
          : inTempuran ? 'tempuran'
          : inTirtamulya ? 'tirtamulya'
          : inRawamerta ? 'rawamerta'
          : inKutawaluya ? 'kutawaluya'
          : 'cilebar';
        switchView('kecamatan', targetKec);
        setTimeout(() => selectDesa(desaId), 100);
        return;
      }

      if (hash.startsWith('#kecamatan') || cleanHash.startsWith('kecamatan-') || cleanHash.startsWith('kecamatan/')) {
        const kecId = cleanHash.replace(/^kecamatan[-/]/, '') || hash.replace('#kecamatan-', '');
        if (validKecs.includes(kecId)) {
          switchView('kecamatan', kecId);
        } else {
          console.warn(`[Route Warning] Kecamatan "${kecId}" tidak ditemukan. Kembali ke peta kabupaten.`);
          switchView('kabupaten');
        }
        return;
      }

      if (validKecs.includes(cleanHash)) {
        switchView('kecamatan', cleanHash);
        return;
      }

      // Any other non-empty hash -> go to kabupaten
      switchView('kabupaten');
      return;
    }

    // 2. SECONDARY: Server-side Initial Param (Only runs on initial cold load if NO hash is present)
    if (!initialServerParamChecked) {
      initialServerParamChecked = true;

      // Query parameter (?kecamatan=... or ?kec=...)
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const qKec = (params.get('kecamatan') || params.get('kec') || '').toLowerCase().trim();
        if (qKec && validKecs.includes(qKec)) {
          switchView('kecamatan', qKec);
          return;
        }
      }

      // Path parameter (/kecamatan/... or /...)
      const pathParts = (window.location.pathname || '').toLowerCase().split('/').filter(Boolean);
      for (const part of pathParts) {
        if (validKecs.includes(part)) {
          switchView('kecamatan', part);
          return;
        }
        if (part === 'penggunaan' || part === 'penggunaan-pajak' || part === 'pengguna' || part === 'pengguna-pajak') {
          switchView('penggunaan');
          return;
        }
        if (part === 'informasi' || part === 'info') {
          switchView('informasi');
          return;
        }
      }

      // Body dataset attribute (e.g. from Laravel blade view)
      if (document.body && document.body.dataset && document.body.dataset.initialView === 'penggunaan') {
        delete document.body.dataset.initialView;
        switchView('penggunaan');
        return;
      }
      if (document.body && document.body.dataset && document.body.dataset.initialView === 'informasi') {
        delete document.body.dataset.initialView;
        switchView('informasi');
        return;
      }

      if (document.body && document.body.dataset && document.body.dataset.initialKecamatan) {
        const bKec = document.body.dataset.initialKecamatan.toLowerCase().trim();
        delete document.body.dataset.initialKecamatan;
        if (validKecs.includes(bKec)) {
          switchView('kecamatan', bKec);
          return;
        }
      }
    }

    // Default: kabupaten view
    switchView('kabupaten');
  }

  window.addEventListener('hashchange', handleHash);
  window.addEventListener('popstate', handleHash);

  // Global click delegator for any menu item, button or link targeting kecamatan or penggunaan
  document.addEventListener('click', (e) => {
    // Penggunaan Pajak trigger
    const penggunaTrigger = e.target.closest('#menu-penggunaan, #menu-pengguna, [data-view="penggunaan"], a[href="#pengguna"], a[href="#penggunaan"], a[href="#penggunaan-pajak"], a[href="#pengguna-pajak"], a[href*="penggunaan"], a[href*="pengguna"]');
    if (penggunaTrigger) {
      e.preventDefault();
      switchView('penggunaan');
      return;
    }

    const infoTrigger = e.target.closest('#menu-informasi, [data-view="informasi"], a[href="#informasi"], a[href="#info"]');
    if (infoTrigger) {
      e.preventDefault();
      switchView('informasi');
      return;
    }

    // Informasi Tab Buttons
    const infoTabBtn = e.target.closest('.info-tab-btn');
    if (infoTabBtn) {
      e.preventDefault();
      const tab = infoTabBtn.getAttribute('data-tab');
      renderInformasi(tab, currentFilterStart, currentFilterEnd);
      return;
    }

    // Informasi "Lihat Semua" buttons
    const infoViewAll = e.target.closest('.info-btn-view-all');
    if (infoViewAll) {
      e.preventDefault();
      const targetTab = infoViewAll.getAttribute('data-target-tab');
      renderInformasi(targetTab, currentFilterStart, currentFilterEnd);
      return;
    }

    // Informasi "Kembali ke Semua" button
    const infoBackSemua = e.target.closest('#btnBackToSemua');
    if (infoBackSemua) {
      e.preventDefault();
      renderInformasi('semua', currentFilterStart, currentFilterEnd);
      return;
    }

    // Informasi FAQ Accordion Toggle
    const faqBtn = e.target.closest('.info-faq-question-btn');
    if (faqBtn) {
      e.preventDefault();
      const itemEl = faqBtn.closest('.info-faq-accordion-item');
      if (itemEl) {
        const faqId = itemEl.getAttribute('data-faq-id');
        const isOpen = itemEl.classList.contains('is-open');
        if (isOpen) {
          itemEl.classList.remove('is-open');
          faqBtn.setAttribute('aria-expanded', 'false');
          activeFaqAccordionId = null;
        } else {
          const parent = itemEl.parentElement || itemEl.parentNode;
          if (parent && parent.querySelectorAll) {
            parent.querySelectorAll('.info-faq-accordion-item').forEach(it => {
              it.classList.remove('is-open');
              const b = it.querySelector('.info-faq-question-btn');
              if (b) b.setAttribute('aria-expanded', 'false');
            });
          }
          itemEl.classList.add('is-open');
          faqBtn.setAttribute('aria-expanded', 'true');
          activeFaqAccordionId = faqId;
        }
      }
      return;
    }

    // Informasi Item Detail Clicks (berita, pengumuman, regulasi)
    const infoItemClick = e.target.closest('[data-type="berita"], [data-type="pengumuman"], [data-type="regulasi"]');
    if (infoItemClick && !e.target.closest('.info-btn-view-all')) {
      e.preventDefault();
      const id = infoItemClick.getAttribute('data-id');
      const type = infoItemClick.getAttribute('data-type');
      openInformasiModal(id, type);
      return;
    }

    // Informasi Modal Close
    if (e.target.closest('#btnInfoModalClose') || e.target.id === 'infoDetailModal') {
      e.preventDefault();
      closeInformasiModal();
      return;
    }

    if (e.target.closest('#viewKecamatan') || e.target.closest('#viewPenggunaan') || e.target.closest('#viewInformasi')) return;

    // Specific trigger for Tirtajaya
    const tirtajayaTrigger = e.target.closest('#menu-tirtajaya, .btn-tirtajaya, [data-kecamatan="tirtajaya"], a[href*="tirtajaya"]');
    if (tirtajayaTrigger) {
      e.preventDefault();
      selectKecamatan('tirtajaya');
      switchView('kecamatan', 'tirtajaya');
      return;
    }

    // Specific trigger for Cibuaya
    const cibuayaTrigger = e.target.closest('#menu-cibuaya, .btn-cibuaya, [data-kecamatan="cibuaya"], a[href*="cibuaya"]');
    if (cibuayaTrigger) {
      e.preventDefault();
      selectKecamatan('cibuaya');
      switchView('kecamatan', 'cibuaya');
      return;
    }

    // Specific trigger for Jayakerta
    const jayakertaTrigger = e.target.closest('#menu-jayakerta, .btn-jayakerta, [data-kecamatan="jayakerta"], a[href*="jayakerta"]');
    if (jayakertaTrigger) {
      e.preventDefault();
      selectKecamatan('jayakerta');
      switchView('kecamatan', 'jayakerta');
      return;
    }

    // Specific trigger for Pedes
    const pedesTrigger = e.target.closest('#menu-pedes, .btn-pedes, [data-kecamatan="pedes"], a[href*="pedes"]');
    if (pedesTrigger) {
      e.preventDefault();
      selectKecamatan('pedes');
      switchView('kecamatan', 'pedes');
      return;
    }

    // Specific trigger for Rengasdengklok
    const rengasdengklokTrigger = e.target.closest('#menu-rengasdengklok, .btn-rengasdengklok, [data-kecamatan="rengasdengklok"], a[href*="rengasdengklok"]');
    if (rengasdengklokTrigger) {
      e.preventDefault();
      selectKecamatan('rengasdengklok');
      switchView('kecamatan', 'rengasdengklok');
      return;
    }

    // Specific trigger for Kutawaluya
    const kutawaluyaTrigger = e.target.closest('#menu-kutawaluya, .btn-kutawaluya, [data-kecamatan="kutawaluya"], a[href*="kutawaluya"]');
    if (kutawaluyaTrigger) {
      e.preventDefault();
      selectKecamatan('kutawaluya');
      switchView('kecamatan', 'kutawaluya');
      return;
    }

    // Specific trigger for Rawamerta
    const rawamertaTrigger = e.target.closest('#menu-rawamerta, .btn-rawamerta, [data-kecamatan="rawamerta"], a[href*="rawamerta"]');
    if (rawamertaTrigger) {
      e.preventDefault();
      selectKecamatan('rawamerta');
      switchView('kecamatan', 'rawamerta');
      return;
    }

    // Specific trigger for Tirtamulya
    const tirtamulyaTrigger = e.target.closest('#menu-tirtamulya, .btn-tirtamulya, [data-kecamatan="tirtamulya"], a[href*="tirtamulya"]');
    if (tirtamulyaTrigger) {
      e.preventDefault();
      selectKecamatan('tirtamulya');
      switchView('kecamatan', 'tirtamulya');
      return;
    }

    // Specific trigger for Purwasari
    const purwasariTrigger = e.target.closest('#menu-purwasari, .btn-purwasari, [data-kecamatan="purwasari"], a[href*="purwasari"]');
    if (purwasariTrigger) {
      e.preventDefault();
      selectKecamatan('purwasari');
      switchView('kecamatan', 'purwasari');
      return;
    }

    // Generic trigger for other kecamatan
    const genericTrigger = e.target.closest('[data-kecamatan]');
    if (genericTrigger) {
      const kec = genericTrigger.getAttribute('data-kecamatan');
      const validKecs = ['karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'];
      if (validKecs.includes(kec)) {
        e.preventDefault();
        selectKecamatan(kec);
        switchView('kecamatan', kec);
        return;
      }
    }
  });

  // =========================================================================
  // INITIAL LOAD
  // =========================================================================
  updateKabupatenFinancials();
  renderKabupatenMap();
  renderKabupatenList();
  selectKecamatan('karawang-barat');

  // Check if initial hash, search query, or path is set
  handleHash();
});

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInformasiModal();
  });
