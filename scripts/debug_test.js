const fs = require('fs');

const appCode = fs.readFileSync('js/app.js', 'utf8');
console.log('1. Has viewName === "informasi":', appCode.includes("viewName === 'informasi'"));
console.log('2. Has renderInformasi:', appCode.includes('function renderInformasi('));
console.log('3. Has menu-informasi click listener:', appCode.includes("id === 'menu-informasi'"));
console.log('4. Has infoTrigger:', appCode.includes('const infoTrigger ='));
console.log('5. Has cleanHash === "informasi":', appCode.includes("cleanHash === 'informasi'"));
console.log('6. Has getInformasiFilteredData call:', appCode.includes('getInformasiFilteredData('));
