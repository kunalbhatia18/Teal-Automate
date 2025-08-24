const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..', '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

function deploy() {
  console.log('🚀 Starting deployment to GitHub Pages...\n');
  
  try {
    // Check if dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      console.log('📦 Building project first...');
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // Check if git is initialized
    try {
      execSync('git status', { stdio: 'ignore' });
    } catch (e) {
      console.error('❌ Error: Not a git repository. Initialize git first with:');
      console.error('   git init');
      console.error('   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
      process.exit(1);
    }
    
    // Check for gh-pages
    try {
      execSync('npx gh-pages --version', { stdio: 'ignore' });
    } catch (e) {
      console.log('📥 Installing gh-pages...');
      execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
    }
    
    console.log('📤 Deploying to GitHub Pages...');
    
    // Deploy using gh-pages to a different branch
    execSync('npx gh-pages -d dist -b gh-pages-teal -m "Deploy Teal Version to GitHub Pages"', { 
      stdio: 'inherit' 
    });
    
    console.log('\n✅ Deployment successful!');
    console.log('🌐 Your site will be available at:');
    console.log('   https://YOUR_USERNAME.github.io/YOUR_REPO');
    console.log('   (This is the teal version without custom domain)\n');
    console.log('⏱️  Note: It may take a few minutes for changes to appear.\n');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();