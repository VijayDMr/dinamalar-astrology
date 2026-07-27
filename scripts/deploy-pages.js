// scripts/deploy-pages.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiPath = path.join(__dirname, '../src/app/api');
const tempApiPath = path.join(__dirname, '../src/app/_api');

console.log('\n🏁 [DEVOPS] Starting Platform-Independent Static Compiler...');

let renamed = false;

try {
  // 1. Rename src/app/api to src/app/_api so Next.js doesn't crash on server-side route compile during output: 'export'
  if (fs.existsSync(apiPath)) {
    console.log('🔄 [DEVOPS] Temporarily renaming API folder to hide server-side routes...');
    fs.renameSync(apiPath, tempApiPath);
    renamed = true;
  }

  // 2. Execute Next.js build compilation
  console.log('🏗️  [DEVOPS] Compiling Next.js Static HTML Export (next build)...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ [DEVOPS] Static Export successfully generated in /out directory.');

} catch (err) {
  console.error('❌ [DEVOPS] Compilation failed:', err.message);
  process.exitCode = 1;
} finally {
  // 3. Restore _api back to api immediately to preserve local enterprise route files in source control
  if (renamed && fs.existsSync(tempApiPath)) {
    console.log('🔄 [DEVOPS] Restoring API folder to enable local server development...');
    fs.renameSync(tempApiPath, apiPath);
    console.log('✅ [DEVOPS] Enterprise backend route files successfully restored.');
  }
}

// 4. Trigger gh-pages publisher
if (process.exitCode !== 1) {
  try {
    console.log('🚀 [DEVOPS] Publishing compiled static files to GitHub Pages...');
    execSync('npx gh-pages -t -d out', { stdio: 'inherit' });
    console.log('\n🎉 [DEVOPS] SUCCESSFULLY PUBLISHED TO: https://VijayDMr.github.io/dinamalar-astrology/\n');
  } catch (err) {
    console.error('❌ [DEVOPS] Publication to GitHub Pages failed:', err.message);
    process.exitCode = 1;
  }
}
