const fs = require('fs');

let content = fs.readFileSync('js/app.js', 'utf8');

// 1. DOM Element references at the top
const targetViewVar = 'const viewPenggunaan = document.getElementById(\'viewPenggunaan\');';
const addViewVar = `const viewPenggunaan = document.getElementById('viewPenggunaan');
  const viewInformasi = document.getElementById('viewInformasi');
  const filterTahunInformasi = document.getElementById('filterTahunInformasi');
  const filterBulanInformasi = document.getElementById('filterBulanInformasi');
  const filterStartDateInformasi = document.getElementById('filterStartDateInformasi');
  const filterEndDateInformasi = document.getElementById('filterEndDateInformasi');
  const btnResetFilterInformasi = document.getElementById('btnResetFilterInformasi');`;

if (!content.includes('const viewInformasi =')) {
  content = content.replace(targetViewVar, addViewVar);
}

// 2. syncFilters update
const targetSyncStarts = 'const allStarts = [filterStartDateKab, filterStartDateKec, filterStartDatePenggunaan];';
const newSyncStarts = 'const allStarts = [filterStartDateKab, filterStartDateKec, filterStartDatePenggunaan, filterStartDateInformasi];';
if (!content.includes('filterStartDateInformasi];')) {
  content = content.replace(targetSyncStarts, newSyncStarts);
  content = content.replace(
    'const allEnds = [filterEndDateKab, filterEndDateKec, filterEndDatePenggunaan];',
    'const allEnds = [filterEndDateKab, filterEndDateKec, filterEndDatePenggunaan, filterEndDateInformasi];'
  );
  content = content.replace(
    'const allTahuns = [filterTahunKab, filterTahunKec, filterTahunPenggunaan];',
    'const allTahuns = [filterTahunKab, filterTahunKec, filterTahunPenggunaan, filterTahunInformasi];'
  );
  content = content.replace(
    'const allBulans = [filterBulanKab, filterBulanKec, filterBulanPenggunaan];',
    'const allBulans = [filterBulanKab, filterBulanKec, filterBulanPenggunaan, filterBulanInformasi];'
  );
}

const targetDispPenggunaan = "if (dispPenggunaan) dispPenggunaan.textContent = rangeText;";
const addDispInformasi = `if (dispPenggunaan) dispPenggunaan.textContent = rangeText;
    const dispInformasi = document.getElementById('dateRangeTextInformasi') || document.getElementById('dateRangeDisplayInformasi');
    if (dispInformasi) dispInformasi.textContent = rangeText;`;

if (!content.includes('dispInformasi.textContent = rangeText;')) {
  content = content.replace(targetDispPenggunaan, addDispInformasi);
}

// 3. applyPeriodFilter update
const targetApplyPenggunaan = `if (currentView === 'penggunaan' || (viewPenggunaan && viewPenggunaan.style.display !== 'none')) {
      renderPenggunaanPajak(currentFilterStart, currentFilterEnd);
    }`;
const addApplyInformasi = `if (currentView === 'penggunaan' || (viewPenggunaan && viewPenggunaan.style.display !== 'none')) {
      renderPenggunaanPajak(currentFilterStart, currentFilterEnd);
    }

    if (currentView === 'informasi' || (viewInformasi && viewInformasi.style.display !== 'none')) {
      renderInformasi(currentInformasiTab, currentFilterStart, currentFilterEnd);
    }`;

if (!content.includes('currentView === \'informasi\' || (viewInformasi &&')) {
  content = content.replace(targetApplyPenggunaan, addApplyInformasi);
}

// 4. resetPeriodFilters update
const targetResetDisp = "if (dispPenggunaan) dispPenggunaan.textContent = defaultRangeText;";
const addResetDisp = `if (dispPenggunaan) dispPenggunaan.textContent = defaultRangeText;
    const dispInformasi = document.getElementById('dateRangeTextInformasi') || document.getElementById('dateRangeDisplayInformasi');
    if (dispInformasi) dispInformasi.textContent = defaultRangeText;`;

if (!content.includes('dispInformasi.textContent = defaultRangeText;')) {
  content = content.replace(targetResetDisp, addResetDisp);
  content = content.replace(
    'if (penggunaanPicker) penggunaanPicker.reset();',
    'if (penggunaanPicker) penggunaanPicker.reset();\n    if (informasiPicker) informasiPicker.reset();'
  );
}

// 5. Picker initialization update
const targetPicker = `kabPicker = new DateRangePicker('Kab');
    kecPicker = new DateRangePicker('Kec');
    penggunaanPicker = new DateRangePicker('Penggunaan');`;
const newPicker = `kabPicker = new DateRangePicker('Kab');
    kecPicker = new DateRangePicker('Kec');
    penggunaanPicker = new DateRangePicker('Penggunaan');
    informasiPicker = new DateRangePicker('Informasi');`;

if (!content.includes('informasiPicker = new DateRangePicker(\'Informasi\');')) {
  content = content.replace('let penggunaanPicker = null;', 'let penggunaanPicker = null;\n  let informasiPicker = null;');
  content = content.replace(targetPicker, newPicker);

  const targetPickerListeners = `if (btnResetFilterPenggunaan) {
    btnResetFilterPenggunaan.addEventListener('click', resetPeriodFilters);
  }`;
  const newPickerListeners = `if (btnResetFilterPenggunaan) {
    btnResetFilterPenggunaan.addEventListener('click', resetPeriodFilters);
  }

  [filterTahunInformasi, filterBulanInformasi, filterStartDateInformasi, filterEndDateInformasi].forEach(el => {
    if (el) el.addEventListener('change', () => syncFilters('informasi'));
  });
  if (btnResetFilterInformasi) {
    btnResetFilterInformasi.addEventListener('click', resetPeriodFilters);
  }`;
  content = content.replace(targetPickerListeners, newPickerListeners);
}

// 6. switchView update
const targetSwitchPenggunaan = `      if (window.location.hash !== '#penggunaan') {
        window.location.hash = '#penggunaan';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {`;

const newSwitchInformasi = `      if (window.location.hash !== '#penggunaan') {
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
    } else {`;

if (!content.includes('viewName === \'informasi\'')) {
  content = content.replace(targetSwitchPenggunaan, newSwitchInformasi);
}

// Hide viewInformasi in other views
const targetKecHide = `      if (viewPenggunaan) {
        viewPenggunaan.style.display = 'none';
        viewPenggunaan.classList.remove('active');
      }`;
const newKecHide = `      if (viewPenggunaan) {
        viewPenggunaan.style.display = 'none';
        viewPenggunaan.classList.remove('active');
      }
      const targetViewInformasiKec = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiKec) {
        targetViewInformasiKec.style.display = 'none';
        targetViewInformasiKec.classList.remove('active');
      }`;
if (!content.includes('targetViewInformasiKec')) {
  content = content.replace(targetKecHide, newKecHide);
}

const targetPenggunaanHide = `      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'block';
        targetViewPenggunaan.classList.add('active');
      }`;
const newPenggunaanHide = `      const targetViewInformasiPj = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiPj) {
        targetViewInformasiPj.style.display = 'none';
        targetViewInformasiPj.classList.remove('active');
      }
      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'block';
        targetViewPenggunaan.classList.add('active');
      }`;
if (!content.includes('targetViewInformasiPj')) {
  content = content.replace(targetPenggunaanHide, newPenggunaanHide);
}

const targetKabHide = `      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'none';
        targetViewPenggunaan.classList.remove('active');
      }`;
const newKabHide = `      const targetViewPenggunaan = viewPenggunaan || document.getElementById('viewPenggunaan');
      if (targetViewPenggunaan) {
        targetViewPenggunaan.style.display = 'none';
        targetViewPenggunaan.classList.remove('active');
      }
      const targetViewInformasiKab = viewInformasi || document.getElementById('viewInformasi');
      if (targetViewInformasiKab) {
        targetViewInformasiKab.style.display = 'none';
        targetViewInformasiKab.classList.remove('active');
      }`;
if (!content.includes('targetViewInformasiKab')) {
  content = content.replace(targetKabHide, newKabHide);
}

// 7. Insert renderInformasi and handlers
const renderInformasiBlock = `
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
        if (alertMsg) alertMsg.textContent = \`Tidak ada berita atau pengumuman pada periode \${rangeText}.\`;
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
          beritaContainer.innerHTML = \`
            <div style="text-align: center; padding: 36px 20px; color: #94a3b8; font-size: 14px;">
              Tidak ada berita pada rentang tanggal yang dipilih (\${rangeText}).
            </div>
          \`;
        } else {
          beritaContainer.innerHTML = data.berita.map(item => \`
            <div class="info-berita-item" data-id="\${item.id}" data-type="berita" role="button" tabindex="0">
              <img src="\${item.image}" alt="\${item.title}" class="info-berita-thumb" loading="lazy" />
              <div class="info-berita-details">
                <span class="info-berita-date">\${item.dateFormatted}</span>
                <h3 class="info-berita-item-title">\${item.title}</h3>
                <p class="info-berita-excerpt">\${item.excerpt}</p>
              </div>
            </div>
          \`).join('');
        }
      }

      // B. Render Right Column: Pengumuman
      const pengumumanContainer = document.getElementById('infoPengumumanList');
      if (pengumumanContainer) {
        if (data.pengumuman.length === 0) {
          pengumumanContainer.innerHTML = \`
            <div style="text-align: center; padding: 24px 10px; color: #94a3b8; font-size: 13px;">
              Tidak ada pengumuman pada rentang tanggal ini.
            </div>
          \`;
        } else {
          pengumumanContainer.innerHTML = data.pengumuman.map(item => \`
            <div class="info-pengumuman-item" data-id="\${item.id}" data-type="pengumuman" role="button" tabindex="0">
              <div class="info-pengumuman-bell">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <span class="info-pengumuman-date">\${item.dateFormatted}</span>
              <h4 class="info-pengumuman-item-title">\${item.title}</h4>
            </div>
          \`).join('');
        }
      }

      // C. Render Right Column: Regulasi
      const regulasiContainer = document.getElementById('infoRegulasiList');
      if (regulasiContainer) {
        regulasiContainer.innerHTML = data.regulasi.map(item => \`
          <div class="info-regulasi-item" data-id="\${item.id}" data-type="regulasi" role="button" tabindex="0">
            <div class="info-regulasi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h4 class="info-regulasi-item-title">\${item.title}</h4>
          </div>
        \`).join('');
      }

      // D. Render Right Column: FAQ Accordion
      const faqContainer = document.getElementById('infoFaqList');
      if (faqContainer) {
        faqContainer.innerHTML = data.faq.map((item, idx) => \`
          <div class="info-faq-accordion-item \${activeFaqAccordionId === item.id ? 'is-open' : ''}" data-faq-id="\${item.id}">
            <button type="button" class="info-faq-question-btn" aria-expanded="\${activeFaqAccordionId === item.id ? 'true' : 'false'}">
              <svg class="info-faq-q-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="info-faq-q-text">\${item.question}</span>
              <svg class="info-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div class="info-faq-answer">\${item.answer}</div>
          </div>
        \`).join('');
      }
    } else {
      // TAB IS NOT 'SEMUA': Dedicated single category view
      if (layoutGrid) layoutGrid.style.display = 'none';
      if (fullscreenContainer) fullscreenContainer.style.display = 'flex';

      if (tab === 'berita') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Berita PBB-P2';
        if (fullscreenContent) {
          if (data.berita.length === 0) {
            fullscreenContent.innerHTML = \`
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:48px 24px; text-align:center; color:#94a3b8;">
                <p style="font-size:16px; font-weight:600; margin-bottom:8px;">Tidak ada berita pada rentang tanggal yang dipilih (\${rangeText}).</p>
                <p style="font-size:13.5px;">Gunakan filter tanggal di kanan atas atau klik tombol Reset untuk melihat semua publikasi.</p>
              </div>
            \`;
          } else {
            fullscreenContent.innerHTML = \`
              <div class="info-grid-berita-full">
                \${data.berita.map(item => \`
                  <div class="info-card-berita-full" data-id="\${item.id}" data-type="berita" role="button" tabindex="0">
                    <img src="\${item.image}" alt="\${item.title}" loading="lazy" />
                    <div class="info-card-berita-full-body">
                      <span class="info-berita-date">\${item.dateFormatted} • \${item.author || 'BAPENDA'}</span>
                      <h3 class="info-berita-item-title" style="margin-top:6px; font-size:16px;">\${item.title}</h3>
                      <p class="info-berita-excerpt" style="margin-top:6px;">\${item.excerpt}</p>
                      <div style="margin-top:auto; padding-top:14px;">
                        <span style="color:#2563eb; font-size:13px; font-weight:600;">Baca Selengkapnya &rarr;</span>
                      </div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            \`;
          }
        }
      } else if (tab === 'pengumuman') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Pengumuman Resmi PBB-P2';
        if (fullscreenContent) {
          if (data.pengumuman.length === 0) {
            fullscreenContent.innerHTML = \`
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:48px 24px; text-align:center; color:#94a3b8;">
                <p style="font-size:16px; font-weight:600; margin-bottom:8px;">Tidak ada pengumuman pada rentang tanggal yang dipilih (\${rangeText}).</p>
                <p style="font-size:13.5px;">Gunakan filter tanggal di kanan atas atau klik tombol Reset untuk melihat semua publikasi.</p>
              </div>
            \`;
          } else {
            fullscreenContent.innerHTML = \`
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px 24px;">
                \${data.pengumuman.map(item => \`
                  <div class="info-pengumuman-item" data-id="\${item.id}" data-type="pengumuman" style="padding:18px 12px;" role="button" tabindex="0">
                    <div class="info-pengumuman-bell" style="width:40px; height:40px;">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div style="flex:1;">
                      <div style="display:flex; gap:12px; align-items:center; margin-bottom:4px;">
                        <span class="info-pengumuman-date" style="font-size:12.5px;">\${item.dateFormatted}</span>
                        <span style="font-size:11px; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; font-weight:600;">RESMI</span>
                      </div>
                      <h4 class="info-pengumuman-item-title" style="font-size:15px; font-weight:700;">\${item.title}</h4>
                      <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">\${item.summary || ''}</p>
                    </div>
                    <div style="color:#2563eb; font-size:13px; font-weight:600; white-space:nowrap;">Lihat Rincian &rarr;</div>
                  </div>
                \`).join('')}
              </div>
            \`;
          }
        }
      } else if (tab === 'regulasi') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Daftar Regulasi & Dasar Hukum PBB-P2';
        if (fullscreenContent) {
          fullscreenContent.innerHTML = \`
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px 24px;">
              \${data.regulasi.map(item => \`
                <div class="info-regulasi-item" data-id="\${item.id}" data-type="regulasi" style="padding:18px 12px;" role="button" tabindex="0">
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
                      <span style="font-size:11px; background:#eff6ff; color:#1d4ed8; padding:2px 8px; border-radius:4px; font-weight:700;">TAHUN \${item.year}</span>
                      <span style="font-size:12px; color:#64748b; font-weight:600;">\${item.number}</span>
                    </div>
                    <h4 class="info-regulasi-item-title" style="font-size:15px; font-weight:700;">\${item.title}</h4>
                    <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">\${item.summary || ''}</p>
                  </div>
                  <div style="color:#2563eb; font-size:13px; font-weight:600; white-space:nowrap;">Buka Dokumen &rarr;</div>
                </div>
              \`).join('')}
            </div>
          \`;
        }
      } else if (tab === 'faq') {
        if (fullscreenTitle) fullscreenTitle.textContent = 'Pertanyaan yang Sering Diajukan (FAQ)';
        if (fullscreenContent) {
          fullscreenContent.innerHTML = \`
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:24px;">
              <div class="info-faq-list" style="padding:0;">
                \${data.faq.map((item, idx) => \`
                  <div class="info-faq-accordion-item is-open" data-faq-id="\${item.id}">
                    <button type="button" class="info-faq-question-btn" aria-expanded="true">
                      <svg class="info-faq-q-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span class="info-faq-q-text" style="font-size:14.5px;">\${item.question}</span>
                      <svg class="info-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div class="info-faq-answer" style="display:block; font-size:13.5px;">\${item.answer}</div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;
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
        mediaHtml = \`<img src="\${item.image}" alt="\${item.title}" class="info-modal-img" />\`;
      }
      let metaHtml = '';
      if (item.dateFormatted) {
        metaHtml += \`<span>Tanggal: <strong>\${item.dateFormatted}</strong></span>\`;
      }
      if (item.author) {
        metaHtml += \`<span>Penulis: <strong>\${item.author}</strong></span>\`;
      }
      if (item.number) {
        metaHtml += \`<span>Nomor: <strong>\${item.number}</strong></span>\`;
      }

      body.innerHTML = \`
        <h2 class="info-modal-title">\${item.title}</h2>
        <div class="info-modal-meta">\${metaHtml}</div>
        \${mediaHtml}
        <div class="info-modal-content">\${item.content || item.summary || item.excerpt || ''}</div>
      \`;
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
`;

if (!content.includes('function renderInformasi(')) {
  const targetInsert = "btnBackToKabupaten.addEventListener('click', () => {";
  content = content.replace(targetInsert, renderInformasiBlock + '\n\n  ' + targetInsert);
}

// 8. Event listeners for Informasi interactions
const informasiEventListeners = `
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
          itemEl.parentElement.querySelectorAll('.info-faq-accordion-item').forEach(it => {
            it.classList.remove('is-open');
            const b = it.querySelector('.info-faq-question-btn');
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          itemEl.classList.add('is-open');
          faqBtn.setAttribute('aria-expanded', 'true');
          activeFaqAccordionId = faqId;
        }
      }
      return;
    }

    // Informasi Item Detail Clicks (berita, pengumuman, regulasi)
    const infoItemClick = e.target.closest('[data-type=\"berita\"], [data-type=\"pengumuman\"], [data-type=\"regulasi\"]');
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
`;

// Insert into document.addEventListener('click')
const targetGlobalClick = `if (e.target.closest('#viewKecamatan') || e.target.closest('#viewPenggunaan')) return;`;
const newGlobalClick = `if (e.target.closest('#viewKecamatan') || e.target.closest('#viewPenggunaan') || e.target.closest('#viewInformasi')) {
      // Still allow interaction with modal, faq, view-all, tabs inside viewInformasi:
${informasiEventListeners}
      return;
    }`;

if (!content.includes('e.target.closest(\'#viewInformasi\')')) {
  content = content.replace(targetGlobalClick, newGlobalClick);
}

// Add ESC key listener for modal
if (!content.includes('Escape\' && closeInformasiModal')) {
  content += `\n  document.addEventListener('keydown', (e) => {\n    if (e.key === 'Escape') closeInformasiModal();\n  });\n`;
}

// 9. Menu click listener for menu-informasi
const targetMenuPeta = `} else if (id === 'menu-peta' || id === 'menu-beranda' || id === 'menu-realisasi' || href === '#beranda' || href === '#peta' || href === '#kabupaten' || href === '#realisasi') {`;
const newMenuInformasi = `} else if (id === 'menu-informasi' || href === '#informasi' || href === '#info' || view === 'informasi') {
        switchView('informasi');
      } else if (id === 'menu-peta' || id === 'menu-beranda' || id === 'menu-realisasi' || href === '#beranda' || href === '#peta' || href === '#kabupaten' || href === '#realisasi') {`;

if (!content.includes('id === \'menu-informasi\'')) {
  content = content.replace(targetMenuPeta, newMenuInformasi);
}

// 10. Global click delegator for menu-informasi
const targetPenggunaTrigger = `    const penggunaTrigger = e.target.closest('#menu-penggunaan, #menu-pengguna, [data-view="penggunaan"], a[href="#pengguna"], a[href="#penggunaan"], a[href="#penggunaan-pajak"], a[href="#pengguna-pajak"], a[href*="penggunaan"], a[href*="pengguna"]');
    if (penggunaTrigger) {
      e.preventDefault();
      switchView('penggunaan');
      return;
    }`;
const newInformasiTrigger = `    const penggunaTrigger = e.target.closest('#menu-penggunaan, #menu-pengguna, [data-view="penggunaan"], a[href="#pengguna"], a[href="#penggunaan"], a[href="#penggunaan-pajak"], a[href="#pengguna-pajak"], a[href*="penggunaan"], a[href*="pengguna"]');
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
    }`;

if (!content.includes('const infoTrigger =')) {
  content = content.replace(targetPenggunaTrigger, newInformasiTrigger);
}

// 11. Hash & route handling
const targetHashPenggunaan = `      if (cleanHash === 'pengguna' || cleanHash === 'penggunaan' || cleanHash === 'penggunaan-pajak' || cleanHash === 'pengguna-pajak') {
        switchView('penggunaan');
        return;
      }`;
const newHashInformasi = `      if (cleanHash === 'pengguna' || cleanHash === 'penggunaan' || cleanHash === 'penggunaan-pajak' || cleanHash === 'pengguna-pajak') {
        switchView('penggunaan');
        return;
      }

      if (cleanHash === 'informasi' || cleanHash === 'info') {
        switchView('informasi');
        return;
      }`;

if (!content.includes("cleanHash === 'informasi'")) {
  content = content.replace(targetHashPenggunaan, newHashInformasi);
}

// Path parts check
const targetPathPenggunaan = `        if (part === 'penggunaan' || part === 'penggunaan-pajak' || part === 'pengguna' || part === 'pengguna-pajak') {
          switchView('penggunaan');
          return;
        }`;
const newPathInformasi = `        if (part === 'penggunaan' || part === 'penggunaan-pajak' || part === 'pengguna' || part === 'pengguna-pajak') {
          switchView('penggunaan');
          return;
        }
        if (part === 'informasi' || part === 'info') {
          switchView('informasi');
          return;
        }`;

if (!content.includes("part === 'informasi'")) {
  content = content.replace(targetPathPenggunaan, newPathInformasi);
}

// Body dataset check
const targetBodyPenggunaan = `      if (document.body && document.body.dataset && document.body.dataset.initialView === 'penggunaan') {
        delete document.body.dataset.initialView;
        switchView('penggunaan');
        return;
      }`;
const newBodyInformasi = `      if (document.body && document.body.dataset && document.body.dataset.initialView === 'penggunaan') {
        delete document.body.dataset.initialView;
        switchView('penggunaan');
        return;
      }
      if (document.body && document.body.dataset && document.body.dataset.initialView === 'informasi') {
        delete document.body.dataset.initialView;
        switchView('informasi');
        return;
      }`;

if (!content.includes("dataset.initialView === 'informasi'")) {
  content = content.replace(targetBodyPenggunaan, newBodyInformasi);
}

// Write to js/app.js
fs.writeFileSync('js/app.js', content, 'utf8');

// Also write to pbb-p2/public/js/app.js for Laravel
fs.writeFileSync('pbb-p2/public/js/app.js', content, 'utf8');

console.log('Updated js/app.js and pbb-p2/public/js/app.js successfully!');
