const fs = require('fs');

let raw = fs.readFileSync('js/app.js', 'utf8');
const isCRLF = raw.includes('\r\n');
let lines = raw.split(/\r?\n/);

console.log(`Read ${lines.length} lines from js/app.js (isCRLF: ${isCRLF})`);

// 1. Patch switchView (around line 881: "} else {")
let switchIdx = -1;
for (let i = 800; i < 950 && i < lines.length; i++) {
  if (lines[i].trim() === '} else {' && lines[i-1] && lines[i-1].includes('scrollTo')) {
    switchIdx = i;
    break;
  }
}

if (switchIdx !== -1) {
  console.log(`Found switchView else at line ${switchIdx + 1}`);
  const switchInformasiLines = [
    '    } else if (viewName === \'informasi\') {',
    '      viewKabupaten.style.display = \'none\';',
    '      viewKabupaten.classList.remove(\'active\');',
    '      viewKecamatan.style.display = \'none\';',
    '      viewKecamatan.classList.remove(\'active\');',
    '      const targetViewPenggunaan = viewPenggunaan || document.getElementById(\'viewPenggunaan\');',
    '      if (targetViewPenggunaan) {',
    '        targetViewPenggunaan.style.display = \'none\';',
    '        targetViewPenggunaan.classList.remove(\'active\');',
    '      }',
    '',
    '      const targetViewInformasi = viewInformasi || document.getElementById(\'viewInformasi\');',
    '      if (targetViewInformasi) {',
    '        targetViewInformasi.style.display = \'block\';',
    '        targetViewInformasi.classList.add(\'active\');',
    '      }',
    '',
    '      // Update sidebar menu',
    '      document.querySelectorAll(\'.menu-item\').forEach(m => m.classList.remove(\'active\'));',
    '      const menuInformasi = document.getElementById(\'menu-informasi\') || document.querySelector(\'a[href="#informasi"]\');',
    '      if (menuInformasi) menuInformasi.classList.add(\'active\');',
    '',
    '      // Render Informasi view',
    '      renderInformasi(currentInformasiTab, currentFilterStart, currentFilterEnd);',
    '',
    '      if (window.location.hash !== \'#informasi\') {',
    '        window.location.hash = \'#informasi\';',
    '      }',
    '      window.scrollTo({ top: 0, behavior: \'smooth\' });'
  ];

  // Replace "} else {" with switchInformasiLines + "} else {"
  lines.splice(switchIdx, 1, ...switchInformasiLines, '    } else {');
} else {
  console.warn('Could not locate switchView else line');
}

// Ensure viewInformasi is hidden in other views (kabupaten and kecamatan)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('viewKabupaten.style.display = \'block\';')) {
    if (!lines[i-1] || !lines[i-1].includes('targetViewInformasiKab')) {
      const hideCode = [
        '      const targetViewInformasiKab = viewInformasi || document.getElementById(\'viewInformasi\');',
        '      if (targetViewInformasiKab) {',
        '        targetViewInformasiKab.style.display = \'none\';',
        '        targetViewInformasiKab.classList.remove(\'active\');',
        '      }'
      ];
      lines.splice(i, 0, ...hideCode);
      i += hideCode.length;
    }
  }
}

// 2. Patch cleanHash routing
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("cleanHash === 'pengguna'") || lines[i].includes("cleanHash === 'penggunaan'")) {
    // Check if the next return is there
    let retIdx = -1;
    for (let j = i; j < i + 6; j++) {
      if (lines[j].trim() === 'return;') {
        retIdx = j;
        break;
      }
    }
    if (retIdx !== -1 && lines[retIdx + 1] && lines[retIdx + 1].trim() === '}') {
      const hashBlock = [
        '',
        '      if (cleanHash === \'informasi\' || cleanHash === \'info\') {',
        '        switchView(\'informasi\');',
        '        return;',
        '      }'
      ];
      lines.splice(retIdx + 2, 0, ...hashBlock);
      break;
    }
  }
}

// 3. Patch path routing
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("part === 'penggunaan'")) {
    let retIdx = -1;
    for (let j = i; j < i + 6; j++) {
      if (lines[j].trim() === 'return;') {
        retIdx = j;
        break;
      }
    }
    if (retIdx !== -1 && lines[retIdx + 1] && lines[retIdx + 1].trim() === '}') {
      const pathBlock = [
        '        if (part === \'informasi\' || part === \'info\') {',
        '          switchView(\'informasi\');',
        '          return;',
        '        }'
      ];
      lines.splice(retIdx + 2, 0, ...pathBlock);
      break;
    }
  }
}

// 4. Patch initialView dataset routing
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("dataset.initialView === 'penggunaan'")) {
    let retIdx = -1;
    for (let j = i; j < i + 6; j++) {
      if (lines[j].trim() === 'return;') {
        retIdx = j;
        break;
      }
    }
    if (retIdx !== -1 && lines[retIdx + 1] && lines[retIdx + 1].trim() === '}') {
      const bodyBlock = [
        '      if (document.body && document.body.dataset && document.body.dataset.initialView === \'informasi\') {',
        '        delete document.body.dataset.initialView;',
        '        switchView(\'informasi\');',
        '        return;',
        '      }'
      ];
      lines.splice(retIdx + 2, 0, ...bodyBlock);
      break;
    }
  }
}

// 5. Patch global click delegator for menu-informasi
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const penggunaTrigger =')) {
    let retIdx = -1;
    for (let j = i; j < i + 7; j++) {
      if (lines[j].trim() === 'return;') {
        retIdx = j;
        break;
      }
    }
    if (retIdx !== -1 && lines[retIdx + 1] && lines[retIdx + 1].trim() === '}') {
      const triggerBlock = [
        '',
        '    const infoTrigger = e.target.closest(\'#menu-informasi, [data-view="informasi"], a[href="#informasi"], a[href="#info"]\');',
        '    if (infoTrigger) {',
        '      e.preventDefault();',
        '      switchView(\'informasi\');',
        '      return;',
        '    }'
      ];
      lines.splice(retIdx + 2, 0, ...triggerBlock);
      break;
    }
  }
}

// Join lines with original line endings
const newContent = lines.join(isCRLF ? '\r\n' : '\n');
fs.writeFileSync('js/app.js', newContent, 'utf8');
fs.writeFileSync('pbb-p2/public/js/app.js', newContent, 'utf8');

console.log('Patched js/app.js and pbb-p2/public/js/app.js successfully!');
