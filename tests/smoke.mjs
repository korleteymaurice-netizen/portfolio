import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.dev, 'concurrently -k "node server.js" "vite --config vite.config.js"');
assert.equal(pkg.scripts.build, 'vite build --config vite.config.js');

const required = [
  'server.js', 'vercel.json', 'vite.config.js', 'database/schema.sql', 'database/seed.sql',
  'client/index.html', 'client/src/main.jsx', 'lib/auth.js', 'lib/db.js', 'api/upload.js'
];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing ${file}`);

const main = read('client/src/main.jsx');
for (const token of [
  'function ResourceEditor', "method: editingId ? 'PUT' : 'POST'", "method: editingId ? 'PUT' : 'POST'",
  'AppErrorBoundary', 'Project not found', "credentials: 'include'"
]) assert.ok(main.includes(token), `Expected feature missing: ${token}`);

const auth = read('lib/auth.js');
assert.ok(auth.includes('timingSafeEqual'));
assert.ok(auth.includes('return null;}}'));

const upload = read('api/upload.js');
assert.ok(upload.includes('memoryStorage'));
assert.ok(upload.includes('data:${req.file.mimetype};base64'));
assert.ok(upload.includes('2 * 1024 * 1024'));

const vercel = JSON.parse(read('vercel.json'));
assert.equal(vercel.outputDirectory, 'client/dist');
assert.equal(vercel.rewrites.length, 1);

assert.ok(!fs.existsSync(path.join(root, '.env')), 'Secrets must not be included in the deliverable');
console.log('Smoke tests: PASS');
