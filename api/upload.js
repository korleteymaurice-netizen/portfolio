import multer from 'multer';
import { requireAuth } from '../lib/auth.js';

// Vercel/serverless filesystems are ephemeral. Keep the uploaded profile image as a
// data URL so the image remains available after a deployment/restart. The database
// column is already TEXT and is therefore suitable for the returned URL.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only JPG, PNG, WEBP and GIF images are allowed.'));
  }
});

export const uploadSingle = upload.single('file');

export default async function uploadHandler(req, res) {
  try {
    if (!(await requireAuth(req, res))) return;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.status(200).json({ url, filename: req.file.originalname });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(400).json({ error: error.message || 'Upload failed.' });
  }
}
