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
  const popupCapaianKab = document.getElementById('popupCapaian');
  const popupBadgeKab = document.getElementById('popupBadge');
  const popupBadgeTextKab = document.getElementById('popupBadgeText');
  const popupHeaderClickable = document.getElementById('popupHeaderClickable');

  const detailBannerKab = document.getElementById('detailBanner');
  const detailTitleKab = document.getElementById('detailKecamatanName');
  const detailBadgeKab = document.getElementById('detailBadge');
  const detailTargetKab = document.getElementById('detailTarget');
  const detailRealisasiKab = document.getElementById('detailRealisasi');
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
  const yearSelectKab = document.getElementById('yearSelectKabupaten');
  const yearSelectKec = document.getElementById('yearSelectKecamatan');

  // Synchronize year selectors across views
  if (yearSelectKab && yearSelectKec) {
    yearSelectKab.addEventListener('change', (e) => {
      yearSelectKec.value = e.target.value;
      if (desaDetailYearText) desaDetailYearText.textContent = e.target.value;
    });
    yearSelectKec.addEventListener('change', (e) => {
      yearSelectKab.value = e.target.value;
      if (desaDetailYearText) desaDetailYearText.textContent = e.target.value;
    });
  }

  // Map Mode Toggle (Peta / Satelit)
  const btnModePeta = document.getElementById('btnModePeta');
  const btnModeSatelit = document.getElementById('btnModeSatelit');
  const btnMapFullscreen = document.getElementById('btnMapFullscreen');

  // Common Utility Functions
  function formatRp(num) {
    return 'Rp. ' + Number(num).toLocaleString('id-ID');
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
  function switchView(viewName, kecId = 'cilebar') {
    currentView = viewName;
    if (viewName === 'kecamatan') {
      viewKabupaten.style.display = 'none';
      viewKabupaten.classList.remove('active');
      viewKecamatan.style.display = 'block';
      viewKecamatan.classList.add('active');

      // Initialize or refresh Kecamatan view
      initKecamatanView(kecId);
      window.location.hash = '#kecamatan-' + kecId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      viewKecamatan.style.display = 'none';
      viewKecamatan.classList.remove('active');
      viewKabupaten.style.display = 'block';
      viewKabupaten.classList.add('active');

      window.location.hash = '#kabupaten';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  btnBackToKabupaten.addEventListener('click', () => {
    switchView('kabupaten');
  });

  btnOpenKecamatanDetail.addEventListener('click', () => {
    const validKecs = ['purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar'];
    const targetKec = validKecs.includes(selectedKecamatanId) ? selectedKecamatanId : 'purwasari';
    switchView('kecamatan', targetKec);
  });

  if (popupHeaderClickable) {
    popupHeaderClickable.addEventListener('click', () => {
      const validKecs = ['purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar'];
      const targetKec = validKecs.includes(selectedKecamatanId) ? selectedKecamatanId : 'purwasari';
      switchView('kecamatan', targetKec);
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
        const validKecs = ['purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar'];
        const targetKec = validKecs.includes(item.id) ? item.id : 'purwasari';
        switchView('kecamatan', targetKec);
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
    'karawang-barat', 'karawang-timur', 'telukjambe-barat', 'telukjambe-timur',
    'tegalwaru', 'ciampel', 'purwasari', 'cikampek', 'klari', 'pedes', 'kotabaru', 'jatisari', 'banyusari', 'cilebar', 'tempuran', 'cilamaya-kulon', 'cilamaya-wetan'
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
      });

      // Chevron click opens detail view
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        selectKecamatan(item.id);
        const validKecs = ['purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar'];
        const targetKec = validKecs.includes(item.id) ? item.id : 'purwasari';
        switchView('kecamatan', targetKec);
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

    // Update Popup
    popupKecName.textContent = item.name;
    popupTargetKab.textContent = item.targetFormatted;
    popupRealisasiKab.textContent = item.realisasiFormatted;
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

    if (item.id === 'karawang-barat') {
      detailTargetKab.textContent = 'Rp.412.560.000.000';
      detailRealisasiKab.textContent = 'Rp.318.742.500.000';
    } else {
      detailTargetKab.textContent = item.targetFormatted;
      detailRealisasiKab.textContent = item.realisasiFormatted;
    }

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
  let activeKecamatanId = 'purwasari';
  let activeDesaData = [];
  let activeSummary = {};
  let activeViewBoxWidth = 600;
  let activeViewBoxHeight = 1006;
  let currentSortMode = 'default'; // 'default', 'desc', 'asc'

  function initKecamatanView(kecId) {
    if (kecId === 'purwasari') {
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
    } else {
      activeKecamatanId = 'cilebar';
      activeDesaData = typeof CILEBAR_DESA_DATA !== 'undefined' ? CILEBAR_DESA_DATA : [];
      activeSummary = typeof CILEBAR_SUMMARY !== 'undefined' ? CILEBAR_SUMMARY : {};
      activeViewBoxWidth = typeof CILEBAR_VIEWBOX_WIDTH !== 'undefined' ? CILEBAR_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof CILEBAR_VIEWBOX_HEIGHT !== 'undefined' ? CILEBAR_VIEWBOX_HEIGHT : 742;
    }

    const kecName = activeKecamatanId === 'purwasari' ? 'Purwasari'
      : (activeKecamatanId === 'cikampek' ? 'Cikampek'
        : (activeKecamatanId === 'kotabaru' ? 'Kotabaru'
          : (activeKecamatanId === 'jatisari' ? 'Jatisari'
            : (activeKecamatanId === 'banyusari' ? 'Banyusari'
              : (activeKecamatanId === 'cilamaya-wetan' ? 'Cilamaya Wetan'
                : (activeKecamatanId === 'cilamaya-kulon' ? 'Cilamaya Kulon'
                  : (activeKecamatanId === 'tempuran' ? 'Tempuran' : 'Cilebar')))))));

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
    kecSumTarget.textContent = activeSummary.targetFormatted;
    kecSumRealisasi.textContent = activeSummary.realisasiFormatted;
    kecSumSisa.textContent = activeSummary.sisaTagihanFormatted;
    kecSumCapaian.textContent = activeSummary.capaianFormatted;
    donutKecCenterPct.textContent = activeSummary.capaianFormatted;
    donutProgressKec.setAttribute('stroke-dasharray', `${Math.min(100, activeSummary.capaian)}, 100`);

    const donutColor = activeSummary.tier === 'green' ? '#2ea868'
      : activeSummary.tier === 'yellow' ? '#f5d547'
        : activeSummary.tier === 'orange' ? '#f59e42'
          : '#ea3838';
    donutProgressKec.setAttribute('stroke', donutColor);

    kecSumJumlahDesa.textContent = activeSummary.jumlahDesa + ' Desa';

    // 4. Reset Sort state
    currentSortMode = 'default';
    const sortPctIcon = document.getElementById('sortPctIcon');
    if (sortPctIcon) sortPctIcon.textContent = '⇅';

    // 5. Render Village Map
    renderDesaMap();

    // 6. Render Village Table
    renderDesaTable();
    // 7. Default Select initial village
    const initialDesa = activeKecamatanId === 'purwasari' ? 'mekarjaya'
      : (activeKecamatanId === 'cikampek' ? 'cikampek-barat'
        : (activeKecamatanId === 'kotabaru' ? 'cikampek-utara'
          : (activeKecamatanId === 'jatisari' ? 'balonggandu'
            : (activeKecamatanId === 'banyusari' ? 'banyuasih'
              : (activeKecamatanId === 'cilamaya-wetan' ? 'cikalong'
                : (activeKecamatanId === 'cilamaya-kulon' ? 'bayur-kidul'
                  : (activeKecamatanId === 'tempuran' ? 'tempuran' : 'sukaratu')))))));
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



      const textName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textName.setAttribute('x', lx);
      textName.setAttribute('y', ly - 2);
      textName.setAttribute('class', 'desa-label-name');
      textName.textContent = d.name;

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
      filtered = filtered.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
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
    let desa = activeDesaData.find(d => d.id === id);
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
      desaPopupName.textContent = 'Desa ' + desa.name;
      desaPopupTarget.textContent = desa.targetFormatted;
      desaPopupRealisasi.textContent = desa.realisasiFormatted;
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
    const kecName = activeKecamatanId === 'purwasari' ? 'Purwasari'
      : (activeKecamatanId === 'cikampek' ? 'Cikampek'
        : (activeKecamatanId === 'kotabaru' ? 'Kotabaru'
          : (activeKecamatanId === 'jatisari' ? 'Jatisari'
            : (activeKecamatanId === 'banyusari' ? 'Banyusari'
              : (activeKecamatanId === 'cilamaya-wetan' ? 'Cilamaya Wetan'
                : (activeKecamatanId === 'cilamaya-kulon' ? 'Cilamaya Kulon'
                  : (activeKecamatanId === 'tempuran' ? 'Tempuran' : 'Cilebar')))))));

    if (desaDetailHeading) {
      desaDetailHeading.textContent = `Detail Desa ${d.name} - Kecamatan ${kecName}`;
    }
    if (desaDetailKecamatanBadge) {
      desaDetailKecamatanBadge.textContent = `Kecamatan ${kecName}`;
    }
    const currentYear = (yearSelectKec ? yearSelectKec.value : '2026');
    if (desaDetailYearText) {
      desaDetailYearText.textContent = currentYear;
    }

    desaPillTitle.textContent = d.name;
    desaPillDot.className = 'desa-indicator-dot ' + d.statusDotClass;
    desaPillStatusTag.className = 'desa-pill-status-tag tag-' + d.tier;
    desaPillStatusTag.textContent = d.statusText;

    desaDetailTarget.textContent = d.targetFormatted;
    desaDetailRealisasi.textContent = d.realisasiFormatted;
    desaDetailSisa.textContent = d.sisaTagihanFormatted;

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
      if (item.id === 'menu-peta') {
        switchView('kabupaten');
      }
    });
  });

  // Hash Routing support
  function handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#kecamatan')) {
      const kecId = hash.replace('#kecamatan-', '') || 'purwasari';
      switchView('kecamatan', kecId);
    } else if (hash.startsWith('#desa')) {
      const desaId = hash.replace('#desa-', '');
      const inPurwasari = typeof PURWASARI_DESA_DATA !== 'undefined' && PURWASARI_DESA_DATA.some(d => d.id === desaId);
      const inCikampek = typeof CIKAMPEK_DESA_DATA !== 'undefined' && CIKAMPEK_DESA_DATA.some(d => d.id === desaId);
      const inKotabaru = typeof KOTABARU_DESA_DATA !== 'undefined' && KOTABARU_DESA_DATA.some(d => d.id === desaId);
      const inJatisari = typeof JATISARI_DESA_DATA !== 'undefined' && JATISARI_DESA_DATA.some(d => d.id === desaId);
      const inBanyusari = typeof BANYUSARI_DESA_DATA !== 'undefined' && BANYUSARI_DESA_DATA.some(d => d.id === desaId);
      const inCilamayaWetan = typeof CILAMAYA_WETAN_DESA_DATA !== 'undefined' && CILAMAYA_WETAN_DESA_DATA.some(d => d.id === desaId);
      const inCilamayaKulon = typeof CILAMAYA_KULON_DESA_DATA !== 'undefined' && CILAMAYA_KULON_DESA_DATA.some(d => d.id === desaId);
      const inTempuran = typeof TEMPURAN_DESA_DATA !== 'undefined' && TEMPURAN_DESA_DATA.some(d => d.id === desaId);
      const targetKec = inPurwasari ? 'purwasari' : (inCikampek ? 'cikampek' : (inKotabaru ? 'kotabaru' : (inJatisari ? 'jatisari' : (inBanyusari ? 'banyusari' : (inCilamayaWetan ? 'cilamaya-wetan' : (inCilamayaKulon ? 'cilamaya-kulon' : (inTempuran ? 'tempuran' : 'cilebar')))))));
      switchView('kecamatan', targetKec);
      setTimeout(() => selectDesa(desaId), 100);
    } else {
      switchView('kabupaten');
    }
  }

  window.addEventListener('hashchange', handleHash);

  // =========================================================================
  // INITIAL LOAD
  // =========================================================================
  renderKabupatenMap();
  renderKabupatenList();
  selectKecamatan('karawang-barat');

  // Check if initial hash is set
  if (window.location.hash) {
    handleHash();
  }
});
