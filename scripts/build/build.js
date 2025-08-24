#!/usr/bin/env node

// Production build with bundling - like React
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const SOURCE_DIR = path.resolve(__dirname, '../../');
const DIST_DIR = path.resolve(__dirname, '../../dist');

function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

async function bundleJS() {
  console.log('📦 Bundling JavaScript...');
  
  // Read all JS files
  const components = await fs.readFile(path.join(SOURCE_DIR, 'js/components.js'), 'utf8');
  const router = await fs.readFile(path.join(SOURCE_DIR, 'js/router.js'), 'utf8');
  const analytics = await fs.readFile(path.join(SOURCE_DIR, 'js/analytics.js'), 'utf8');
  
  // Bundle them together
  const bundle = `// AutomateMeetings Production Bundle\n${components}\n\n${router}\n\n${analytics}`;
  
  // Generate hash and write
  const hash = generateHash(bundle);
  const filename = `bundle.${hash}.js`;
  await fs.writeFile(path.join(DIST_DIR, filename), bundle);
  
  console.log(`✅ Created ${filename}`);
  return filename;
}

async function bundleCSS() {
  console.log('🎨 Bundling CSS...');
  
  const cssFiles = {};
  
  // Create separate CSS files for each HTML file
  const htmlFiles = [
    { src: 'index.html', name: 'main' },
    { src: 'pages/privacy.html', name: 'privacy' },
    { src: 'pages/terms.html', name: 'terms' },
    { src: 'pages/404.html', name: '404' }
  ];
  
  for (const htmlFile of htmlFiles) {
    const content = await fs.readFile(path.join(SOURCE_DIR, htmlFile.src), 'utf8');
    const cssMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    
    if (cssMatch) {
      const css = cssMatch[1].trim();
      if (css) {
        const hash = generateHash(css);
        const filename = `${htmlFile.name}.${hash}.css`;
        await fs.writeFile(path.join(DIST_DIR, filename), css);
        cssFiles[htmlFile.src] = filename;
        console.log(`✅ Created ${filename}`);
      }
    }
  }
  
  return cssFiles;
}

async function processHTML(jsFile, cssFiles) {
  console.log('📄 Processing HTML files...');
  
  const htmlFiles = [
    { src: 'index.html', dest: 'index.html' },
    { src: 'pages/privacy.html', dest: 'privacy.html' },
    { src: 'pages/terms.html', dest: 'terms.html' },
    { src: 'pages/404.html', dest: '404.html' },
    { src: 'pages/visithealth/index.html', dest: 'visithealth.html', skipProcessing: true },
    { src: 'pages/visithealth/tree.html', dest: 'visithealth/tree.html', skipProcessing: true }
  ];
  
  for (const file of htmlFiles) {
    let content = await fs.readFile(path.join(SOURCE_DIR, file.src), 'utf8');
    
    // Create directory if needed for nested files
    const destDir = path.dirname(path.join(DIST_DIR, file.dest));
    await fs.mkdir(destDir, { recursive: true });
    
    // Skip processing for visithealth page
    if (file.skipProcessing) {
      await fs.writeFile(path.join(DIST_DIR, file.dest), content);
      console.log(`✅ Copied ${file.dest} (no processing)`);
      continue;
    }
    
    // Get the specific CSS file for this HTML file
    const specificCssFile = cssFiles[file.src];
    if (specificCssFile) {
      // Replace ANY inline styles with specific CSS link
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/g, `<link rel="stylesheet" href="${specificCssFile}">`);
    }
    
    // Replace JS script tags with bundled JS
    content = content.replace(
      /<!-- Centralized components and router -->\s*<script src="[^"]*components\.js"><\/script>\s*<script src="[^"]*router\.js"><\/script>\s*<script src="[^"]*analytics\.js"><\/script>/g,
      `<script src="${jsFile}"></script>`
    );
    
    // Also replace the script tags without the comment (for privacy/terms pages)
    content = content.replace(
      /<script src="[^"]*components\.js"><\/script>\s*<script src="[^"]*router\.js"><\/script>/g,
      `<script src="${jsFile}"></script>`
    );
    
    // Fix relative paths for sub-pages
    if (file.src.includes('pages/')) {
      content = content.replace(/src="\.\.\/js\//g, 'src="');
      content = content.replace(/href="\.\.\/index\.html/g, 'href="index.html');
    }
    
    await fs.writeFile(path.join(DIST_DIR, file.dest), content);
    console.log(`✅ Processed ${file.dest}${specificCssFile ? ' with ' + specificCssFile : ''}`);
  }
}

async function copyAssets() {
  console.log('📁 Copying assets...');
  
  // Copy assets directory
  await copyDirectory(path.join(SOURCE_DIR, 'assets'), path.join(DIST_DIR, 'assets'));
  
  // Copy og-image
  await fs.copyFile(path.join(SOURCE_DIR, 'og-image.svg'), path.join(DIST_DIR, 'og-image.svg'));
  
  // Copy robots.txt and sitemap.xml
  try {
    await fs.copyFile(path.join(SOURCE_DIR, 'robots.txt'), path.join(DIST_DIR, 'robots.txt'));
    console.log('✅ robots.txt copied');
  } catch (err) {
    // robots.txt doesn't exist, skip
  }
  
  try {
    await fs.copyFile(path.join(SOURCE_DIR, 'sitemap.xml'), path.join(DIST_DIR, 'sitemap.xml'));
    console.log('✅ sitemap.xml copied');
  } catch (err) {
    // sitemap.xml doesn't exist, skip
  }
  
  // Copy CNAME if it exists
  const cnamePath = path.join(SOURCE_DIR, 'CNAME');
  try {
    await fs.access(cnamePath);
    await fs.copyFile(cnamePath, path.join(DIST_DIR, 'CNAME'));
    console.log('✅ CNAME copied');
  } catch (err) {
    // CNAME file doesn't exist, skip
  }
  
  console.log('✅ Assets copied');
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function createCleanUrls() {
  console.log('🔗 Creating clean URL structure...');
  
  // Create directories for clean URLs
  const cleanUrls = [
    { file: 'privacy.html', dir: 'privacy' },
    { file: 'terms.html', dir: 'terms' },
    { file: '404.html', dir: '404' },
    { file: 'visithealth.html', dir: 'visithealth', skipProcessing: true },
    { file: 'visithealth/tree.html', dir: 'visithealth/tree', skipProcessing: true }
  ];
  
  for (const { file, dir, skipProcessing } of cleanUrls) {
    const dirPath = path.join(DIST_DIR, dir);
    await fs.mkdir(dirPath, { recursive: true });
    
    // Read the HTML file
    let content = await fs.readFile(path.join(DIST_DIR, file), 'utf8');
    
    // Skip path fixing for visithealth
    if (!skipProcessing) {
      // Fix paths for being one directory deeper
      content = content.replace(/href="([^"]*\.css)"/g, 'href="../$1"');
      content = content.replace(/src="([^"]*\.js)"/g, 'src="../$1"');
      content = content.replace(/href="index\.html/g, 'href="../index.html');
      content = content.replace(/href="\/"/g, 'href="../"');
      
      // Fix component script references
      content = content.replace(/<script src="\.\.\/components\.js"><\/script>/, '');
      content = content.replace(/<script src="\.\.\/router\.js"><\/script>/, '');
    }
    
    // Write the modified content
    await fs.writeFile(path.join(dirPath, 'index.html'), content);
    console.log(`✅ Created ${dir}/index.html${skipProcessing ? ' (no processing)' : ' with fixed paths'}`);
  }
}

async function build() {
  console.log('🚀 Building AutomateMeetings (Production Bundle)...\n');
  
  try {
    // Clean dist
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    await fs.mkdir(DIST_DIR, { recursive: true });
    
    // Bundle assets
    const jsFile = await bundleJS();
    const cssFiles = await bundleCSS();
    
    // Process HTML with bundled references
    await processHTML(jsFile, cssFiles);
    
    // Copy static assets
    await copyAssets();
    
    // Create clean URL structure for GitHub Pages
    await createCleanUrls();
    
    console.log('\n✅ Production build complete!');
    console.log('📊 Bundled files:');
    Object.values(cssFiles).forEach(cssFile => {
      console.log(`   - ${cssFile}`);
    });
    console.log(`   - ${jsFile} (scripts)`);
    console.log('📂 Ready to deploy from dist/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();