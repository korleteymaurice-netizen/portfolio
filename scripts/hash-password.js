#!/usr/bin/env node

// Generate bcryptjs password hash for admin user creation
// Usage: node scripts/hash-password.js "your-password-here"

import bcryptjs from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-password.js "your-password"');
    console.error('Example: node scripts/hash-password.js "mySecurePassword123"');
    process.exit(1);
}

const hash = bcryptjs.hashSync(password, 10);
console.log('Password hash:');
console.log(hash);
console.log('');
console.log('Copy this hash and use it in your SQL command:');
console.log(`INSERT INTO users (email, password_hash) VALUES ('admin@example.com', '${hash}');`);
