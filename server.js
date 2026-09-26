import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import aboutHandler from './api/about/index.js';
import skillsListHandler from './api/skills/index.js';
import skillsIdHandler from './api/skills/[id].js';
import experienceListHandler from './api/experience/index.js';
import experienceIdHandler from './api/experience/[id].js';
import educationListHandler from './api/education/index.js';
import educationIdHandler from './api/education/[id].js';
import certificationsListHandler from './api/certifications/index.js';
import certificationsIdHandler from './api/certifications/[id].js';
import servicesListHandler from './api/services/index.js';
import servicesIdHandler from './api/services/[id].js';
import projectsListHandler from './api/projects/index.js';
import projectsIdHandler from './api/projects/[id].js';
import messagesHandler from './api/messages/index.js';
import resumeHandler from './api/resume/index.js';
import loginHandler from './api/auth/login.js';
import logoutHandler from './api/auth/logout.js';
import meHandler from './api/auth/me.js';
import uploadHandler, { uploadSingle } from './api/upload.js';
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3001);


// Increase payload size limit to 10MB for large images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const withQueryParam = (handler, key) => (req, res, next) => {
  if (req.params?.[key] !== undefined) {
    req.query = { ...(req.query || {}), [key]: req.params[key] };
  }
  return handler(req, res, next);
};

app.post('/api/auth/login', loginHandler);
app.post('/api/auth/logout', logoutHandler);
app.get('/api/auth/me', meHandler);
app.post('/api/upload', (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    return next();
  });
}, uploadHandler);

app.all('/api/about', aboutHandler);
app.all('/api/resume', resumeHandler);
app.all('/api/messages', messagesHandler);

app.all('/api/skills', skillsListHandler);
app.all('/api/skills/:id', withQueryParam(skillsIdHandler, 'id'));

app.all('/api/experience', experienceListHandler);
app.all('/api/experience/:id', withQueryParam(experienceIdHandler, 'id'));

app.all('/api/education', educationListHandler);
app.all('/api/education/:id', withQueryParam(educationIdHandler, 'id'));

app.all('/api/certifications', certificationsListHandler);
app.all('/api/certifications/:id', withQueryParam(certificationsIdHandler, 'id'));

app.all('/api/services', servicesListHandler);
app.all('/api/services/:id', withQueryParam(servicesIdHandler, 'id'));

app.all('/api/projects', projectsListHandler);
app.all('/api/projects/:id', withQueryParam(projectsIdHandler, 'id'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const distDir = path.join(__dirname, 'client', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
