#!/usr/bin/env node

// Generate a secure random secret for AUTH_SECRET
// Usage: node scripts/generate-secret.js

import crypto from 'crypto';

const secret = crypto.randomBytes(32).toString('hex');
console.log('Generated AUTH_SECRET:');
console.log(secret);
console.log('');
console.log('Add this to your .env.local:');
console.log(`AUTH_SECRET=${secret}`);
