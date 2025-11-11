#!/usr/bin/env node
// Cross-platform build script that handles missing DATABASE_URL for Prisma generate
// This is needed for Netlify builds where DATABASE_URL might not be set

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in the project root directory
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Verify index.html exists
const indexHtmlPath = path.join(projectRoot, 'client', 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error(`Error: index.html not found at ${indexHtmlPath}`);
  process.exit(1);
}

// Check if it's a file (not a directory)
const stats = fs.statSync(indexHtmlPath);
if (!stats.isFile()) {
  console.error(`Error: ${indexHtmlPath} exists but is not a file (it's a directory)`);
  process.exit(1);
}

// Set a dummy DATABASE_URL if not provided (only needed for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/db';
}

try {
  console.log('Generating Prisma client...');
  execSync('pnpm prisma generate', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('Building client...');
  execSync('pnpm vite build', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('Building server...');
  execSync('pnpm esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

