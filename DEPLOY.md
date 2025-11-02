# Deployment Guide

## Prerequisites
- ✅ Supabase database setup complete
- ✅ Local dev server running successfully
- ⏳ Git repository (need to initialize)
- ⏳ GitHub account
- ⏳ Netlify or Vercel account

## Step 1: Initialize Git

```powershell
cd c:\Users\sumed\Downloads\KhadyamQR
git init
git add .
git commit -m "Initial commit: KhadyamQR MVP with React + Vite + Express + Supabase"
```

## Step 2: Create GitHub Repository

**Option A: Using GitHub CLI**
```powershell
gh repo create KhadyamQR --public --source=. --push
```

**Option B: Manual**
1. Go to https://github.com/new
2. Name: `KhadyamQR`
3. Public repository
4. Don't initialize with README (we have code)
5. Create repository
6. Run:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/KhadyamQR.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Netlify (Recommended)

### Why Netlify?
- ✅ Free tier with serverless functions
- ✅ Automatic deployments from GitHub
- ✅ Built-in CI/CD

### Steps:
1. Go to https://app.netlify.com/start
2. Click "Import from Git" → Select GitHub
3. Choose `KhadyamQR` repository
4. **Build settings:**
   - Build command: `pnpm build`
   - Publish directory: `dist/spa`
   - Functions directory: `netlify/functions` (already configured)

5. **Environment variables:**
   ```
   VITE_SUPABASE_URL=https://dshrfgqoarhwpbhbdobt.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_URL=https://dshrfgqoarhwpbhbdobt.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   PING_MESSAGE=ping pong
   ```

6. Click "Deploy site"

### Post-Deploy:
- Your site will be at: `https://khadyamqr-RANDOM.netlify.app`
- Test: `https://your-site.netlify.app/admin`
- QR codes will work at: `https://your-site.netlify.app/menu/[slug]`

## Alternative: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `KhadyamQR` from GitHub
3. **Framework Preset:** Vite
4. **Build settings:**
   - Build Command: `pnpm build`
   - Output Directory: `dist/spa`
5. Add same environment variables as above
6. Deploy

## Step 4: Update QR Codes

After deployment, regenerate QR codes in admin panel so they point to your production URL instead of `localhost:8080`.

## Troubleshooting

**Build fails: "pnpm not found"**
- Netlify/Vercel auto-detects pnpm from `package.json` packageManager field

**API routes 404 in production**
- Check `netlify.toml` or `vercel.json` for serverless function config

**Database connection fails**
- Verify environment variables are set in deployment platform
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)

**Storage upload fails**
- Verify `khadyamqr` bucket exists in Supabase Storage
- Check RLS policies allow service role access
