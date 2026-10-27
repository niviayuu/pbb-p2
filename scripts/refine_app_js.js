const fs = require('fs');

let raw = fs.readFileSync('js/app.js', 'utf8');
const isCRLF = raw.includes('\r\n');
let lines = raw.split(/\r?\n/);

console.log(`Read ${lines.length} lines from js/app.js`);

// 1. In switchView('penggunaan'), ensure targetViewInformasi is hidden
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("viewName === 'penggunaan'")) {
    // Look for targetViewPenggunaan
    for (let j = i; j < i + 15; j++) {
      if (lines[j].includes("const targetViewPenggunaan = viewPenggunaan")) {
        const hideInfoBlock = [
          '      const targetViewInformasiPj = viewInformasi || document.getElementById(\'viewInformasi\');',
          '      if (targetViewInformasiPj) {',
          '        targetViewInformasiPj.style.display = \'none\';',
          '        targetViewInformasiPj.classList.remove(\'active\');',
          '      }'
        ];
        lines.splice(j, 0, ...hideInfoBlock);
        console.log('Added targetViewInformasiPj hide at line', j);
        break;
      }
    }
    break;
  }
}

// 2. In switchView('kecamatan'), ensure targetViewInformasiKec is hidden
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("viewName === 'kecamatan'")) {
    for (let j = i; j < i + 20; j++) {
      if (lines[j].includes("viewPenggunaan.style.display = 'none';")) {
        const hideInfoKecBlock = [
          '      const targetViewInformasiKec = viewInformasi || document.getElementById(\'viewInformasi\');',
          '      if (targetViewInformasiKec) {',
          '        targetViewInformasiKec.style.display = \'none\';',
          '        targetViewInformasiKec.classList.remove(\'active\');',
          '      }'
        ];
        lines.splice(j + 2, 0, ...hideInfoKecBlock);
        console.log('Added targetViewInformasiKec hide at line', j + 2);
        break;
      }
    }
    break;
  }
}

// 3. Fix document click delegator: place Informasi event handlers BEFORE early return
let clickIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const infoTrigger = e.target.closest('#menu-informasi")) {
    clickIdx = i;
    break;
  }
}

if (clickIdx !== -1) {
  // Find where the trigger return ends
  let triggerEnd = -1;
  for (let j = clickIdx; j < clickIdx + 8; j++) {
    if (lines[j].trim() === '}') {
      triggerEnd = j;
      break;
    }
  }

  // Find the old if (e.target.closest('#viewKecamatan') ... block and remove it
  let oldBlockStart = -1;
  let oldBlockEnd = -1;
  for (let j = triggerEnd; j < triggerEnd + 80; j++) {
    if (lines[j] && lines[j].includes("if (e.target.closest('#viewKecamatan')")) {
      oldBlockStart = j;
      // find the end of this block
      for (let k = j; k < lines.length; k++) {
        if (lines[k] && lines[k].includes("if (e.target.closest('#btnInfoModalClose')")) {
          // find closing of this modal close
          for (let m = k; m < k + 6; m++) {
            if (lines[m].trim() === '}') {
              oldBlockEnd = m + 2; // includes the return; and }
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  if (oldBlockStart !== -1 && oldBlockEnd !== -1) {
    console.log(`Replacing old click block lines ${oldBlockStart + 1} to ${oldBlockEnd + 1}`);
    const replacement = [
      '    // Informasi Tab Buttons',
      '    const infoTabBtn = e.target.closest(\'.info-tab-btn\');',
      '    if (infoTabBtn) {',
      '      e.preventDefault();',
      '      const tab = infoTabBtn.getAttribute(\'data-tab\');',
      '      renderInformasi(tab, currentFilterStart, currentFilterEnd);',
      '      return;',
      '    }',
      '',
      '    // Informasi "Lihat Semua" buttons',
      '    const infoViewAll = e.target.closest(\'.info-btn-view-all\');',
      '    if (infoViewAll) {',
      '      e.preventDefault();',
      '      const targetTab = infoViewAll.getAttribute(\'data-target-tab\');',
      '      renderInformasi(targetTab, currentFilterStart, currentFilterEnd);',
      '      return;',
      '    }',
      '',
      '    // Informasi "Kembali ke Semua" button',
      '    const infoBackSemua = e.target.closest(\'#btnBackToSemua\');',
      '    if (infoBackSemua) {',
      '      e.preventDefault();',
      '      renderInformasi(\'semua\', currentFilterStart, currentFilterEnd);',
      '      return;',
      '    }',
      '',
      '    // Informasi FAQ Accordion Toggle',
      '    const faqBtn = e.target.closest(\'.info-faq-question-btn\');',
      '    if (faqBtn) {',
      '      e.preventDefault();',
      '      const itemEl = faqBtn.closest(\'.info-faq-accordion-item\');',
      '      if (itemEl) {',
      '        const faqId = itemEl.getAttribute(\'data-faq-id\');',
      '        const isOpen = itemEl.classList.contains(\'is-open\');',
      '        if (isOpen) {',
      '          itemEl.classList.remove(\'is-open\');',
      '          faqBtn.setAttribute(\'aria-expanded\', \'false\');',
      '          activeFaqAccordionId = null;',
      '        } else {',
      '          itemEl.parentElement.querySelectorAll(\'.info-faq-accordion-item\').forEach(it => {',
      '            it.classList.remove(\'is-open\');',
      '            const b = it.querySelector(\'.info-faq-question-btn\');',
      '            if (b) b.setAttribute(\'aria-expanded\', \'false\');',
      '          });',
      '          itemEl.classList.add(\'is-open\');',
      '          faqBtn.setAttribute(\'aria-expanded\', \'true\');',
      '          activeFaqAccordionId = faqId;',
      '        }',
      '      }',
      '      return;',
      '    }',
      '',
      '    // Informasi Item Detail Clicks (berita, pengumuman, regulasi)',
      '    const infoItemClick = e.target.closest(\'[data-type="berita"], [data-type="pengumuman"], [data-type="regulasi"]\');',
      '    if (infoItemClick && !e.target.closest(\'.info-btn-view-all\')) {',
      '      e.preventDefault();',
      '      const id = infoItemClick.getAttribute(\'data-id\');',
      '      const type = infoItemClick.getAttribute(\'data-type\');',
      '      openInformasiModal(id, type);',
      '      return;',
      '    }',
      '',
      '    // Informasi Modal Close',
      '    if (e.target.closest(\'#btnInfoModalClose\') || e.target.id === \'infoDetailModal\') {',
      '      e.preventDefault();',
      '      closeInformasiModal();',
      '      return;',
      '    }',
      '',
      '    if (e.target.closest(\'#viewKecamatan\') || e.target.closest(\'#viewPenggunaan\') || e.target.closest(\'#viewInformasi\')) return;'
    ];

    lines.splice(oldBlockStart, oldBlockEnd - oldBlockStart + 1, ...replacement);
  }
}

const newContent = lines.join(isCRLF ? '\r\n' : '\n');
fs.writeFileSync('js/app.js', newContent, 'utf8');
fs.writeFileSync('pbb-p2/public/js/app.js', newContent, 'utf8');

console.log('Refined js/app.js and pbb-p2/public/js/app.js successfully!');
