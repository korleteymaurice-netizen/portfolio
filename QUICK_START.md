# Quick Start Guide

Get your portfolio running in 5 minutes.

## Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)
- Git

## Setup (First Time)

### 1. Extract & Install
```bash
unzip maurice-portfolio-corrected.zip
cd portfolio-fix
npm install
```

### 2. Generate Secrets
```bash
# Generate AUTH_SECRET
npm run generate-secret

# Copy the output and add to .env.local
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with:
# DATABASE_URL=your_postgres_url
# AUTH_SECRET=your_generated_secret
```

### 4. Set Up Database
```bash
# Create PostgreSQL schema
psql $DATABASE_URL -f database/schema.sql

# Generate admin password hash
npm run hash-password "your-admin-password"

# Create admin user (use the hash from above)
psql $DATABASE_URL -c "INSERT INTO users (email, password_hash) VALUES ('admin@example.com', '\$2a\$10...');"
```

### 5. Start Development
```bash
npm run dev
```

Visit: http://localhost:5173/

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build production frontend |
| `npm run preview` | Preview production build |
| `npm run test` | Run smoke tests |
| `npm run generate-secret` | Generate AUTH_SECRET |
| `npm run hash-password "pwd"` | Hash password for admin |
| `npm run verify` | Verify deployment readiness |

## Useful Commands

### Generate Environment Variable
```bash
npm run generate-secret > secret.txt
cat secret.txt
```

### Create Admin User Password Hash
```bash
npm run hash-password "MySecurePassword123"
```

### Verify Deployment Configuration
```bash
npm run verify
```

### Check API Locally
```bash
# In another terminal while `npm run dev` is running:
curl http://localhost:3001/api/about
```

### Build for Production
```bash
npm run build
# Output in: client/dist/
```

### Test Production Build
```bash
npm run build
npm run preview
# Visit: http://localhost:4173/
```

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Failed
```bash
# Check your DATABASE_URL
echo $DATABASE_URL

# Test the connection
psql $DATABASE_URL -c "SELECT 1"
```

### Admin Login Not Working
```bash
# Verify user exists
psql $DATABASE_URL -c "SELECT * FROM users;"

# Create new user with fresh hash
npm run hash-password "newpassword"
psql $DATABASE_URL -c "DELETE FROM users WHERE email='admin@example.com';"
psql $DATABASE_URL -c "INSERT INTO users (email, password_hash) VALUES ('admin@example.com', '\$2a\$10...');"
```

### Port Already in Use
```bash
# Change port in .env.local
PORT=3002

# Or kill existing process
lsof -ti:3001 | xargs kill -9
```

## Common Tasks

### Add New Section to Portfolio
1. Create API endpoint in `api/new-section/`
2. Add database table to `database/schema.sql`
3. Add UI component in `client/src/main.jsx`
4. Add navigation link in Navbar

### Deploy to Vercel
See `DEPLOYMENT_GUIDE.md`

### Create Database Backup
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database from Backup
```bash
psql $DATABASE_URL < backup.sql
```

## File Locations

- **Frontend**: `client/src/main.jsx`
- **Styles**: `client/src/app.css` & `original.css`
- **API Endpoints**: `api/*/`
- **Database**: `database/schema.sql`
- **Config**: `vite.config.js`, `vercel.json`
- **Secrets**: `.env.local` (don't commit!)

## URLs

| URL | Purpose |
|-----|---------|
| http://localhost:5173/ | Frontend (dev) |
| http://localhost:3001/ | Backend API (dev) |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:5173/api/about | API endpoint |

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| DATABASE_URL | ✓ | postgresql://user:pass@host:5432/db |
| AUTH_SECRET | ✓ | abcd1234... (32 chars) |
| NODE_ENV | | development/production |
| PORT | | 3001 |

## Next Steps

1. ✓ Extract and install
2. ✓ Set up database
3. ✓ Run `npm run dev`
4. ✓ Test locally
5. → Deploy to Vercel (see DEPLOYMENT_GUIDE.md)

## Need Help?

- Check `README.md` for full documentation
- Check `DEPLOYMENT_GUIDE.md` for Vercel steps
- Check browser console (F12) for client-side errors
- Check server logs for backend errors
- Run `npm run verify` to check configuration

---

**Happy building! 🚀**
