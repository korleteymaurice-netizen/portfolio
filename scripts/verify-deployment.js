#!/usr/bin/env node

// Pre-deployment verification checklist
// Usage: node scripts/verify-deployment.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

let passed = 0;
let failed = 0;

function check(name, condition) {
    if (condition) {
        console.log(`✓ ${name}`);
        passed++;
    } else {
        console.log(`✗ ${name}`);
        failed++;
    }
}

console.log('='.repeat(60));
console.log('Portfolio Project - Pre-Deployment Verification');
console.log('='.repeat(60));
console.log('');

// Check files exist
console.log('📁 Project Files:');
check('package.json exists', fs.existsSync(path.join(projectRoot, 'package.json')));
check('package-lock.json exists', fs.existsSync(path.join(projectRoot, 'package-lock.json')));
check('README.md exists', fs.existsSync(path.join(projectRoot, 'README.md')));
check('vercel.json exists', fs.existsSync(path.join(projectRoot, 'vercel.json')));
check('vite.config.js exists', fs.existsSync(path.join(projectRoot, 'vite.config.js')));
check('.env.example exists', fs.existsSync(path.join(projectRoot, '.env.example')));
check('client/src/main.jsx exists', fs.existsSync(path.join(projectRoot, 'client/src/main.jsx')));
check('database/schema.sql exists', fs.existsSync(path.join(projectRoot, 'database/schema.sql')));
console.log('');

// Check directories
console.log('📂 Project Directories:');
check('api/ directory exists', fs.existsSync(path.join(projectRoot, 'api')));
check('client/ directory exists', fs.existsSync(path.join(projectRoot, 'client')));
check('lib/ directory exists', fs.existsSync(path.join(projectRoot, 'lib')));
check('database/ directory exists', fs.existsSync(path.join(projectRoot, 'database')));
console.log('');

// Check package.json scripts
console.log('📝 Build Scripts:');
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    check('dev script exists', pkg.scripts && pkg.scripts.dev);
    check('build script exists', pkg.scripts && pkg.scripts.build);
    check('preview script exists', pkg.scripts && pkg.scripts.preview);
    check('start script exists', pkg.scripts && pkg.scripts.start);
    check('test script exists', pkg.scripts && pkg.scripts.test);
} catch (e) {
    console.log(`✗ Could not parse package.json: ${e.message}`);
    failed += 5;
}
console.log('');

// Check for common issues
console.log('🔍 Security Checks:');
const dotenvPath = path.join(projectRoot, '.env');
check('.env not included', !fs.existsSync(dotenvPath));
check('node_modules not included', !fs.existsSync(path.join(projectRoot, 'node_modules')));

// Check .env.example
try {
    const envExample = fs.readFileSync(path.join(projectRoot, '.env.example'), 'utf8');
    check('DATABASE_URL in .env.example', envExample.includes('DATABASE_URL'));
    check('AUTH_SECRET in .env.example', envExample.includes('AUTH_SECRET'));
} catch (e) {
    console.log(`✗ Could not read .env.example`);
    failed += 2;
}
console.log('');

// Check vercel.json
console.log('🚀 Vercel Configuration:');
try {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8'));
    check('buildCommand configured', vercelConfig.buildCommand);
    check('outputDirectory configured', vercelConfig.outputDirectory);
    check('rewrites configured', Array.isArray(vercelConfig.rewrites));
} catch (e) {
    console.log(`✗ Invalid vercel.json: ${e.message}`);
    failed += 3;
}
console.log('');

// Check build output
console.log('🔨 Build Output:');
const distDir = path.join(projectRoot, 'client/dist');
check('client/dist/ exists', fs.existsSync(distDir));
if (fs.existsSync(distDir)) {
    check('index.html generated', fs.existsSync(path.join(distDir, 'index.html')));
    check('assets/ generated', fs.existsSync(path.join(distDir, 'assets')));
}
console.log('');

// Summary
console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
    console.log('✓ All checks passed! Ready for deployment.');
} else {
    console.log(`✗ ${failed} check(s) failed. Review above.`);
}
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
