# Portfolio Project - Full Stack Application

A modern, full-stack portfolio application built with React, Node.js, Express, and PostgreSQL. This application showcases professional work with a public-facing portfolio website and a secure admin dashboard for managing portfolio content.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / End User                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  React + Vite Frontend (Vercel)    │
        │  - Public portfolio pages          │
        │  - Admin login page                │
        │  - Client-side routing             │
        │  - Responsive design               │
        └────────────┬───────────────────────┘
                     │
                     │ API Requests (/api/*)
                     │ Uploads (/uploads/*)
                     │
        ┌────────────▼───────────────────────┐
        │  Serverless API (Vercel Functions) │
        │  - Authentication endpoints        │
        │  - CRUD operations                 │
        │  - File uploads                    │
        │  - Session management              │
        └────────────┬───────────────────────┘
                     │
                     │ SQL Queries
                     │
        ┌────────────▼───────────────────────┐
        │     PostgreSQL Database            │
        │  (Hosted externally or locally)    │
        │  - Users & authentication          │
        │  - Portfolio content               │
        │  - Messages                        │
        └────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + React Router | Dynamic UI, client-side routing |
| **Build** | Vite | Fast, modern build tool |
| **Backend** | Express.js | API server, serverless functions |
| **Database** | PostgreSQL | Persistent data storage |
| **Authentication** | JWT (custom implementation) | Secure admin access |
| **Deployment** | Vercel Hobby | Serverless hosting |
| **Animation** | Framer Motion | Smooth UI animations |
| **File Handling** | Multer | File upload processing |

## 📁 Project Structure

```
portfolio/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── main.jsx          # React entry point with routing
│   │   ├── app.css           # Tailored component styles
│   │   └── original.css      # Design system & typography
│   ├── dist/                 # Built output (generated)
│   ├── public/               # Static assets
│   ├── index.html            # HTML template
│   └── package.json
│
├── api/                       # Serverless function handlers
│   ├── about/                # Profile information
│   ├── skills/               # Skills management
│   ├── experience/           # Work experience
│   ├── education/            # Education history
│   ├── certifications/       # Certifications
│   ├── services/             # Services offered
│   ├── projects/             # Portfolio projects
│   ├── messages/             # Contact form submissions
│   ├── resume/               # Resume/CV file
│   ├── auth/                 # Authentication endpoints
│   │   ├── login.js
│   │   ├── logout.js
│   │   └── me.js
│   ├── upload.js             # File upload handler
│   ├── _crud.js              # Shared CRUD utilities
│   └── [id].js patterns      # Dynamic route handlers
│
├── lib/                       # Shared utilities
│   ├── db.js                 # Database connection pooling
│   ├── auth.js               # Authentication & cookie handling
│   ├── password.js           # Password hashing utilities
│   ├── response.js           # Response formatting
│   └── validation.js         # Input validation
│
├── database/                  # Database configuration
│   ├── schema.sql            # PostgreSQL schema definitions
│   └── seed.sql              # Initial data (optional)
│
├── uploads/                   # Uploaded files directory
├── server.js                 # Express server (local development only)
├── vite.config.js            # Vite build configuration
├── vercel.json               # Vercel deployment configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or remote)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
   AUTH_SECRET=generate-a-long-random-string-here
   NODE_ENV=development
   PORT=3001
   ```

4. **Set up database**
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -U your_user -d your_database -f database/schema.sql
   
   # Optionally seed initial data:
   psql -U your_user -d your_database -f database/seed.sql
   ```

5. **Create admin user** (if needed)
   ```bash
   # Access PostgreSQL and insert:
   INSERT INTO users (email, password_hash) VALUES (
     'admin@example.com',
     '$2a$10$...'  -- Use a bcryptjs hash
   );
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```
   
   - Frontend: http://localhost:5173/
   - Backend API: http://localhost:3001/
   - Admin: http://localhost:5173/admin/login

### Production Build

```bash
# Build frontend only
npm run build

# Output: client/dist/
# Then deploy to Vercel
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Environment | Purpose |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | Both | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Both | Secret key for JWT signing (min 32 chars) |
| `NODE_ENV` | ❌ | Both | Set to `production` for production builds |
| `PORT` | ❌ | Development | Express server port (default: 3001) |

**Important:** Never commit `.env` files with real secrets. Use `.env.example` as a template.

### Vite Configuration (`vite.config.js`)

- **Root**: Points to `client/` directory
- **Output**: Builds to `client/dist/`
- **Dev Server**: Runs on port 5173
- **API Proxy**: Routes `/api` requests to Express server during development

### Express Server (`server.js`)

- Runs on port 3001 (or `PORT` environment variable)
- Serves static frontend assets from `client/dist`
- Provides SPA fallback for client-side routing
- Handles file uploads to `uploads/` directory
- Note: In production (Vercel), this is not used. Vercel uses serverless functions instead.

## 🗄️ Database

### Schema Overview

The PostgreSQL database includes tables for:

- **users** - Admin authentication
- **about** - Profile/bio information
- **skills** - Technical skills with proficiency levels
- **experience** - Work history
- **education** - Academic background
- **certifications** - Professional certifications
- **services** - Services offered
- **projects** - Portfolio projects
- **messages** - Contact form submissions
- **resume** - Resume file reference

### Connection Pooling

- Maximum 5 concurrent connections
- 10-second idle timeout
- SSL enabled for remote databases
- Local databases use unencrypted connections

## 🔐 Authentication

### Admin Login

1. Navigate to `/admin/login`
2. Enter email and password
3. JWT token stored in `oc_admin` cookie
4. Token valid for 8 hours

### Authentication Flow

```
User → Login Form → /api/auth/login → Verify Password → Set Cookie → Admin Access
```

### Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: HMAC-SHA256 signed tokens
- **Cookies**: HttpOnly, SameSite=Lax, Secure (in production)
- **Time-safe Comparison**: Prevents timing attacks
- **User Verification**: Each request verifies user exists in database

### Setting Admin Credentials

```sql
-- Add new admin user (use bcryptjs hash)
INSERT INTO users (email, password_hash) 
VALUES ('admin@example.com', '$2a$10$...');
```

## 📤 Uploads

### File Upload Handling

- **Location**: `/uploads/` directory
- **Handler**: `/api/upload` endpoint
- **Middleware**: Multer for multipart/form-data parsing
- **Size Limit**: 2MB (configurable)

### Vercel Limitations

**Important**: On Vercel, the serverless filesystem is **ephemeral** (temporary). Files uploaded to `/uploads/` will not persist between deployments or function invocations.

**Solution**: For production, configure external file storage:
- AWS S3
- Vercel KV (for small files)
- Cloudinary (image hosting)
- Custom file service

Update the upload handler to use external storage instead of local filesystem.

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login with email/password |
| POST | `/api/auth/logout` | ✅ | Clear session |
| GET | `/api/auth/me` | ✅ | Get current user info |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/about` | ❌ | Get profile information |
| PUT | `/api/about` | ✅ | Update profile (admin) |

### Portfolio Content (CRUD operations follow this pattern)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/{resource}` | ❌ | List all items |
| POST | `/api/{resource}` | ✅ | Create new item |
| PUT | `/api/{resource}/:id` | ✅ | Update item |
| DELETE | `/api/{resource}/:id` | ✅ | Delete item |

**Resources**: `skills`, `experience`, `education`, `certifications`, `services`, `projects`, `messages`, `resume`

### Example: Skills

```bash
# Get all skills
GET /api/skills

# Create skill (admin)
POST /api/skills
Content-Type: application/json
{
  "name": "React",
  "category": "Frontend",
  "proficiency": 90,
  "icon": "react"
}

# Update skill
PUT /api/skills/abc-123
Content-Type: application/json
{
  "proficiency": 95
}

# Delete skill
DELETE /api/skills/abc-123
```

## 🚢 Deployment to Vercel

### Prerequisites

- GitHub repository with this code
- Vercel account (free)
- PostgreSQL database (external service)

### Step-by-Step Deployment

#### 1. Prepare GitHub Repository

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel auto-detects the project type

#### 3. Configure Build Settings

Vercel should auto-detect these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

Verify these in "Build & Development Settings":
- Root Directory: (leave empty or `/`)
- Environment: Node.js

#### 4. Add Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

```
DATABASE_URL=postgresql://user:password@host:5432/database
AUTH_SECRET=your-generated-secret-key
NODE_ENV=production
```

⚠️ **Security**: Never hardcode secrets. Always use Vercel's environment variables.

#### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Visit your deployed site

#### 6. Verify Deployment

- ✅ Frontend loads at https://your-project.vercel.app
- ✅ Navigation works (try visiting `/about`, `/projects`, etc.)
- ✅ Login accessible at `/admin/login`
- ✅ API working: Check browser DevTools Network tab
- ✅ Static assets loading (CSS, images)

### Troubleshooting Vercel Deployment

See the **Troubleshooting** section below for common issues.

## 🏃 Running Scripts

```bash
# Development (frontend + backend together)
npm run dev

# Build frontend only
npm run build

# Preview production build locally
npm run preview

# Start production server (local testing)
npm start

# Run smoke tests
npm run test
```

## 🧪 Testing

Basic smoke tests verify:
- Server starts without errors
- Database connects
- API endpoints respond
- Frontend builds successfully

```bash
npm run test
```

## 🐛 Troubleshooting

### Frontend Issues

#### Blank Page / Cannot See Content

**Symptoms**: White screen, no portfolio content visible

**Solutions**:
1. Check browser console (F12) for JavaScript errors
2. Verify `client/dist` exists: `ls client/dist/`
3. Verify API is accessible: Open DevTools → Network tab
4. Check Vite build output for errors: `npm run build`

#### Routing Not Working (404 on Refresh)

**Symptoms**: Works in development but 404 on Vercel when refreshing

**Solution**: The vercel.json SPA fallback might not be configured. Verify:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

#### CSS Not Loading / Styles Missing

**Symptoms**: Page loads but styling is broken

**Solutions**:
1. Verify `client/dist/assets/` files exist
2. Check CSS import in `client/src/main.jsx`
3. Run `npm run build` to regenerate assets

### Backend / API Issues

#### API 404 Errors

**Symptoms**: Frontend can't reach API endpoints (404 errors in DevTools)

**Solutions**:
1. **Local development**: Ensure Express server is running (`npm run dev`)
2. **Vercel**: Verify API routes are deployed as serverless functions
3. **API path**: Check that requests use `/api/` prefix
4. **CORS**: If cross-origin issues, verify headers in Express server

#### "Cannot GET /api/about"

**Symptoms**: API endpoint returns 404

**Solutions**:
1. Verify endpoint exists in `server.js` (for local dev)
2. Verify API file exists: `ls api/about/`
3. Check for typos in API path
4. Ensure database is connected

#### "Database connection failed"

**Symptoms**: API returns 500, logs show connection error

**Solutions**:
1. Verify `DATABASE_URL` is set: `echo $DATABASE_URL`
2. Test connection locally: `psql $DATABASE_URL -c "SELECT 1"`
3. Verify credentials are correct
4. If remote database, check firewall/security groups
5. Ensure database server is running

### Authentication Issues

#### Admin Login Always Fails

**Symptoms**: Cannot login with correct credentials

**Solutions**:
1. Verify user exists: `SELECT * FROM users WHERE email='admin@example.com';`
2. Reset password hash in database
3. Ensure `AUTH_SECRET` is set and consistent
4. Check browser cookies are enabled
5. Verify cookie settings in `lib/auth.js`

#### Session Lost / Logged Out Unexpectedly

**Symptoms**: Redirected to login after page refresh

**Solutions**:
1. Verify `AUTH_SECRET` is set (not using default)
2. Check cookie settings (HttpOnly, SameSite)
3. Ensure browser allows cookies
4. Verify token expiration (8 hours default)

### Build Issues

#### Build Fails with Module Error

**Symptoms**: `npm run build` fails with "Cannot find module"

**Solutions**:
1. Clean and reinstall: `rm -rf node_modules && npm install`
2. Verify all files are present: `ls api/` `ls client/src/`
3. Check for missing imports in source files
4. Verify package.json has all dependencies

#### Vite Build Hangs

**Symptoms**: Build command takes too long or doesn't complete

**Solutions**:
1. Check available disk space: `df -h`
2. Check system memory: `free -h`
3. Clear Vite cache: `rm -rf .vite client/dist`
4. Try again: `npm run build`

### Deployment Issues

#### Vercel Build Fails

**Symptoms**: Vercel deployment fails with build error

**Solutions**:
1. Check Vercel logs: Click deployment → "View Logs"
2. Ensure `package.json` scripts are correct
3. Verify build command: `npm run build`
4. Ensure all environment variables are set
5. Check for hardcoded localhost URLs

#### Vercel 500 Error on API Calls

**Symptoms**: Frontend loads but API calls fail

**Solutions**:
1. Check Vercel function logs
2. Verify `DATABASE_URL` is set in Vercel environment
3. Verify database allows connections from Vercel IP ranges
4. Check API route files for syntax errors

#### Cannot Upload Files on Vercel

**Symptoms**: Upload endpoint fails or file doesn't persist

**Note**: This is expected! Vercel serverless functions have ephemeral filesystems.

**Solutions**:
1. Use external storage (AWS S3, Cloudinary, etc.)
2. Store file reference in database only
3. Implement upload to external service in `api/upload.js`

## 📋 Deployment Checklist

Before deploying to Vercel:

- [ ] Code committed to Git
- [ ] All dependencies in `package.json`
- [ ] `.env.example` includes all required variables
- [ ] No hardcoded secrets in code
- [ ] `package.json` scripts are correct
- [ ] `vercel.json` exists and configured
- [ ] `vite.config.js` configured correctly
- [ ] Database schema created and ready
- [ ] Admin user created in database
- [ ] Local build succeeds: `npm run build`
- [ ] Local dev works: `npm run dev`
- [ ] No console errors in development
- [ ] Static assets in `client/public/` are referenced correctly

## 📞 Support & Issues

- Check **Troubleshooting** section above
- Review Vercel logs in deployment dashboard
- Check browser console (F12) for client-side errors
- Check server logs for backend errors
- Verify all environment variables are set
- Ensure database is accessible

## 📝 Notes

- The frontend automatically fetches data from the API on load
- Navigation between pages is handled by React Router
- Admin functionality is separate from public portfolio
- Light/dark theme preference is saved to localStorage
- Portfolio data is cached locally for offline viewing
- Animations use Framer Motion with smooth transitions

## 📜 License

[Add your license here]
