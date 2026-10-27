const fs = require('fs');

const snippet = fs.readFileSync('scripts/view_informasi_snippet.html', 'utf8');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

if (!indexHtml.includes('id="viewInformasi"')) {
  const targetEnd = '      </div>\r\n    </main>';
  if (indexHtml.includes(targetEnd)) {
    indexHtml = indexHtml.replace(targetEnd, '      </div>\r\n' + snippet + '\r\n    </main>');
  } else {
    indexHtml = indexHtml.replace('      </div>\n    </main>', '      </div>\n' + snippet + '\n    </main>');
  }
}

// Add script tag in index.html
if (!indexHtml.includes('assets/informasi_data.js')) {
  indexHtml = indexHtml.replace(
    '<script src="assets/penggunaan_data.js?v=20261020_penggunaan_fix"></script>',
    '<script src="assets/penggunaan_data.js?v=20261020_penggunaan_fix"></script>\n  <script src="assets/informasi_data.js?v=20261020_info_fix"></script>'
  );
}
// Update css and js version
indexHtml = indexHtml.replace(/css\/style\.css\?v=[^"]+/g, 'css/style.css?v=20261020_info_fix');
indexHtml = indexHtml.replace(/js\/app\.js\?v=[^"]+/g, 'js/app.js?v=20261020_info_fix');

fs.writeFileSync('index.html', indexHtml);
console.log('index.html updated! Has viewInformasi?', indexHtml.includes('id="viewInformasi"'));

// 2. Update welcome.blade.php
let bladeHtml = fs.readFileSync('pbb-p2/resources/views/welcome.blade.php', 'utf8');

bladeHtml = bladeHtml.replace(
  /@php\s+\$isPenggunaan = \(\$initialView \?\? ''\) === 'penggunaan';\s+@endphp/,
  `@php
  $isPenggunaan = ($initialView ?? '') === 'penggunaan';
  $isInformasi = ($initialView ?? '') === 'informasi';
@endphp`
);

bladeHtml = bladeHtml.replace(
  'class="menu-item {{ $isPenggunaan ? \'\' : \'active\' }}" id="menu-peta"',
  'class="menu-item {{ (!$isPenggunaan && !$isInformasi) ? \'active\' : \'\' }}" id="menu-peta"'
);

bladeHtml = bladeHtml.replace(
  '<a href="#informasi" class="menu-item" id="menu-informasi">',
  '<a href="#informasi" class="menu-item {{ $isInformasi ? \'active\' : \'\' }}" id="menu-informasi" data-view="informasi">'
);

bladeHtml = bladeHtml.replace(
  '<div id="viewKabupaten" class="dashboard-view {{ $isPenggunaan ? \'\' : \'active\' }}" @if($isPenggunaan) style="display: none;" @endif>',
  '<div id="viewKabupaten" class="dashboard-view {{ (!$isPenggunaan && !$isInformasi) ? \'active\' : \'\' }}" @if($isPenggunaan || $isInformasi) style="display: none;" @endif>'
);

const bladeSnippet = snippet.replace(
  '<div id="viewInformasi" class="dashboard-view" style="display: none;">',
  '<div id="viewInformasi" class="dashboard-view {{ $isInformasi ? \'active\' : \'\' }}" @if(!$isInformasi) style="display: none;" @endif>'
);

if (!bladeHtml.includes('id="viewInformasi"')) {
  const targetEnd = '      </div>\r\n    </main>';
  if (bladeHtml.includes(targetEnd)) {
    bladeHtml = bladeHtml.replace(targetEnd, '      </div>\r\n' + bladeSnippet + '\r\n    </main>');
  } else {
    bladeHtml = bladeHtml.replace('      </div>\n    </main>', '      </div>\n' + bladeSnippet + '\n    </main>');
  }
}

if (!bladeHtml.includes('assets/informasi_data.js')) {
  bladeHtml = bladeHtml.replace(
    '<script src="assets/penggunaan_data.js?v=20261020_penggunaan_fix"></script>',
    '<script src="assets/penggunaan_data.js?v=20261020_penggunaan_fix"></script>\n  <script src="assets/informasi_data.js?v=20261020_info_fix"></script>'
  );
}

bladeHtml = bladeHtml.replace(/css\/style\.css\?v=[^"]+/g, 'css/style.css?v=20261020_info_fix');
bladeHtml = bladeHtml.replace(/js\/app\.js\?v=[^"]+/g, 'js/app.js?v=20261020_info_fix');

fs.writeFileSync('pbb-p2/resources/views/welcome.blade.php', bladeHtml);
console.log('welcome.blade.php updated! Has viewInformasi?', bladeHtml.includes('id="viewInformasi"'));
