const { spawn } = require('child_process');
const fs = require('fs');

async function measurePage(url, screenshotName) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\58e592e0-0d5d-4867-9d40-ee758ddad000\\scratch\\edge_compare_' + Date.now();
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1100',
    `--user-data-dir=${profileDir}`,
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const res = await fetch('http://127.0.0.1:9222/json');
  const targets = await res.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };
  await new Promise(resolve => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  const measurements = await send('Runtime.evaluate', {
    expression: `(() => {
      const bottomSection = document.getElementById('detailDesaBottomSection');
      const bRect = bottomSection ? bottomSection.getBoundingClientRect() : null;

      const summaryBar = document.querySelector('.desa-metric-summary-bar');
      const sRect = summaryBar ? summaryBar.getBoundingClientRect() : null;

      const pill = document.getElementById('selectedDesaPill');
      const pRect = pill ? pill.getBoundingClientRect() : null;
      const pillTitle = document.getElementById('desaPillTitle')?.textContent?.trim();
      const pillTag = document.getElementById('desaPillStatusTag')?.textContent?.trim();

      const miniCards = Array.from(document.querySelectorAll('.desa-metric-summary-bar .mini-stat-card')).map(el => {
        const r = el.getBoundingClientRect();
        const label = el.querySelector('.m-label')?.textContent?.trim();
        const val = el.querySelector('.m-val')?.textContent?.trim();
        return { label, val, width: Math.round(r.width), height: Math.round(r.height) };
      });

      const advisory = document.querySelector('.desa-info-advisory-box');
      const aRect = advisory ? advisory.getBoundingClientRect() : null;
      const advText = document.getElementById('desaAdvisoryText')?.textContent?.trim();

      const breakdownGrid = document.querySelector('.desa-tax-breakdown-grid');
      const bgRect = breakdownGrid ? breakdownGrid.getBoundingClientRect() : null;

      const bCards = Array.from(document.querySelectorAll('.desa-tax-breakdown-grid .breakdown-card')).map(el => {
        const r = el.getBoundingClientRect();
        const label = el.querySelector('.b-label')?.textContent?.trim();
        const val = el.querySelector('.b-val')?.textContent?.trim();
        return { label, val, width: Math.round(r.width), height: Math.round(r.height) };
      });

      // Scroll to bottom section for screenshot
      if (bottomSection) {
        bottomSection.scrollIntoView({ block: 'start' });
      }

      return {
        bottomSection: bRect ? { width: Math.round(bRect.width), height: Math.round(bRect.height) } : null,
        summaryBar: sRect ? { width: Math.round(sRect.width), height: Math.round(sRect.height) } : null,
        pill: pRect ? { width: Math.round(pRect.width), height: Math.round(pRect.height), pillTitle, pillTag } : null,
        miniCards,
        advisory: aRect ? { width: Math.round(aRect.width), height: Math.round(aRect.height), advText } : null,
        breakdownGrid: bgRect ? { width: Math.round(bgRect.width), height: Math.round(bgRect.height) } : null,
        bCards
      };
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 600));

  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\58e592e0-0d5d-4867-9d40-ee758ddad000';
  fs.writeFileSync(`${artifactDir}\\${screenshotName}.png`, Buffer.from(screenshotRes.result.data, 'base64'));

  ws.close();
  edgeProcess.kill();

  return measurements.result?.result?.value || measurements.result?.value;
}

async function main() {
  console.log('Measuring Lemahabang...');
  const lemahabang = await measurePage('http://localhost/pbb-p2-1/#kecamatan-lemahabang', 'lemahabang_bottom');

  console.log('\nMeasuring Karawang Barat...');
  const karawangBarat = await measurePage('http://localhost/pbb-p2-1/#kecamatan-karawang-barat', 'karawang_barat_bottom');

  console.log('\n=== COMPARISON LEMAHABANG VS KARAWANG BARAT ===');
  console.log('LEMAHABANG:');
  console.log(JSON.stringify(lemahabang, null, 2));

  console.log('\nKARAWANG BARAT:');
  console.log(JSON.stringify(karawangBarat, null, 2));
}

main().catch(console.error);
