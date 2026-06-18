const fs = require('fs');
const path = require('path');

const tomlPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native',
  'gradle-plugin',
  'gradle',
  'libs.versions.toml'
);

if (!fs.existsSync(tomlPath)) {
  console.log('[patch-agp] File not found, skipping:', tomlPath);
  process.exit(0);
}

let content = fs.readFileSync(tomlPath, 'utf8');

if (content.includes('agp = "8.7.3"')) {
  console.log('[patch-agp] AGP already patched to 8.7.3, skipping.');
  process.exit(0);
}

content = content.replace(/^agp = ".*"$/m, 'agp = "8.7.3"');
fs.writeFileSync(tomlPath, content, 'utf8');
console.log('[patch-agp] Patched AGP to 8.7.3 in @react-native/gradle-plugin');