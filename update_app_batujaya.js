const fs = require('fs');

let content = fs.readFileSync('js/app.js', 'utf8');

// 1. Update validKecs (all instances)
const oldValidKecs = `'karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya'`;
const newValidKecs = `'karawang-barat', 'kutawaluya', 'rawamerta', 'tirtamulya', 'lemahabang', 'talagasari', 'majalaya', 'karawang-timur', 'telukjambe-timur', 'telukjambe-barat', 'pangkalan', 'klari', 'ciampel', 'tegalwaru', 'purwasari', 'cikampek', 'kotabaru', 'jatisari', 'banyusari', 'cilamaya-wetan', 'cilamaya-kulon', 'tempuran', 'cilebar', 'rengasdengklok', 'pedes', 'jayakerta', 'cibuaya', 'tirtajaya', 'batujaya'`;

let count = 0;
while (content.includes(oldValidKecs)) {
  content = content.replace(oldValidKecs, newValidKecs);
  count++;
}
console.log('Replaced validKecs count:', count);

// 2. Add batujaya block in initKecamatanView
const targetBlock = `    } else if (kecId === 'tirtajaya') {
      activeKecamatanId = 'tirtajaya';
      activeDesaData = typeof TIRTAJAYA_DESA_DATA !== 'undefined' ? TIRTAJAYA_DESA_DATA : [];
      activeSummary = typeof TIRTAJAYA_SUMMARY !== 'undefined' ? TIRTAJAYA_SUMMARY : {};
      activeViewBoxWidth = typeof TIRTAJAYA_VIEWBOX_WIDTH !== 'undefined' ? TIRTAJAYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof TIRTAJAYA_VIEWBOX_HEIGHT !== 'undefined' ? TIRTAJAYA_VIEWBOX_HEIGHT : 627;`;

const replacementBlock = `    } else if (kecId === 'batujaya') {
      activeKecamatanId = 'batujaya';
      activeDesaData = typeof BATUJAYA_DESA_DATA !== 'undefined' ? BATUJAYA_DESA_DATA : [];
      activeSummary = typeof BATUJAYA_SUMMARY !== 'undefined' ? BATUJAYA_SUMMARY : {};
      activeViewBoxWidth = typeof BATUJAYA_VIEWBOX_WIDTH !== 'undefined' ? BATUJAYA_VIEWBOX_WIDTH : 600;
      activeViewBoxHeight = typeof BATUJAYA_VIEWBOX_HEIGHT !== 'undefined' ? BATUJAYA_VIEWBOX_HEIGHT : 653;
` + targetBlock;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, replacementBlock);
  console.log('Added batujaya block in initKecamatanView');
} else {
  console.error('ERROR: targetBlock not found');
}

// 3. Add batujaya in kecName ternary
const kecNameTarget = `    const kecName = activeKecamatanId === 'karawang-barat' ? 'Karawang Barat'
      : activeKecamatanId === 'tirtajaya' ? 'Tirtajaya'`;

const kecNameReplacement = `    const kecName = activeKecamatanId === 'karawang-barat' ? 'Karawang Barat'
      : activeKecamatanId === 'batujaya' ? 'Batujaya'
      : activeKecamatanId === 'tirtajaya' ? 'Tirtajaya'`;

if (content.includes(kecNameTarget)) {
  content = content.replace(kecNameTarget, kecNameReplacement);
  console.log('Added batujaya in kecName ternary');
} else {
  console.error('ERROR: kecNameTarget not found');
}

// 4. Add batujaya in initialDesa ternary
const initialDesaTarget = `    const initialDesa = activeKecamatanId === 'karawang-barat' ? 'karangpawitan'
      : activeKecamatanId === 'tirtajaya' ? 'medankarya'`;

const initialDesaReplacement = `    const initialDesa = activeKecamatanId === 'karawang-barat' ? 'karangpawitan'
      : activeKecamatanId === 'batujaya' ? 'segarjaya'
      : activeKecamatanId === 'tirtajaya' ? 'medankarya'`;

if (content.includes(initialDesaTarget)) {
  content = content.replace(initialDesaTarget, initialDesaReplacement);
  console.log('Added batujaya in initialDesa ternary');
} else {
  console.error('ERROR: initialDesaTarget not found');
}

// 5. Add inBatujaya in handleHash
const inTirtajayaTarget = `        const inTirtajaya = typeof TIRTAJAYA_DESA_DATA !== 'undefined' && TIRTAJAYA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));`;
const inTirtajayaReplacement = `        const inBatujaya = typeof BATUJAYA_DESA_DATA !== 'undefined' && BATUJAYA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));
        const inTirtajaya = typeof TIRTAJAYA_DESA_DATA !== 'undefined' && TIRTAJAYA_DESA_DATA.some(d => d.id === desaId || (d.aliases && d.aliases.includes(desaId)));`;

if (content.includes(inTirtajayaTarget)) {
  content = content.replace(inTirtajayaTarget, inTirtajayaReplacement);
  console.log('Added inBatujaya in handleHash');
} else {
  console.error('ERROR: inTirtajayaTarget not found');
}

// targetKec in handleHash
const targetKecTarget = `        const targetKec = inKarawangBarat ? 'karawang-barat'
          : inTirtajaya ? 'tirtajaya'`;

const targetKecReplacement = `        const targetKec = inKarawangBarat ? 'karawang-barat'
          : inBatujaya ? 'batujaya'
          : inTirtajaya ? 'tirtajaya'`;

if (content.includes(targetKecTarget)) {
  content = content.replace(targetKecTarget, targetKecReplacement);
  console.log('Added batujaya in targetKec handleHash');
} else {
  console.error('ERROR: targetKecTarget not found');
}

// 6. Click delegator for Batujaya
const triggerTarget = `    // Specific trigger for Tirtajaya
    const tirtajayaTrigger = e.target.closest('#menu-tirtajaya, .btn-tirtajaya, [data-kecamatan="tirtajaya"], a[href*="tirtajaya"]');
    if (tirtajayaTrigger) {
      e.preventDefault();
      selectKecamatan('tirtajaya');
      switchView('kecamatan', 'tirtajaya');
      return;
    }`;

const triggerReplacement = `    // Specific trigger for Batujaya
    const batujayaTrigger = e.target.closest('#menu-batujaya, .btn-batujaya, [data-kecamatan="batujaya"], a[href*="batujaya"]');
    if (batujayaTrigger) {
      e.preventDefault();
      selectKecamatan('batujaya');
      switchView('kecamatan', 'batujaya');
      return;
    }

` + triggerTarget;

if (content.includes(triggerTarget)) {
  content = content.replace(triggerTarget, triggerReplacement);
  console.log('Added Batujaya trigger in click delegator');
} else {
  console.error('ERROR: triggerTarget not found');
}

fs.writeFileSync('js/app.js', content, 'utf8');
fs.writeFileSync('pbb-p2/public/js/app.js', content, 'utf8');
console.log('Successfully updated js/app.js and pbb-p2/public/js/app.js');
