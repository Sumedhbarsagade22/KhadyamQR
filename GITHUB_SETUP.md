# GitHub Setup Instructions

## ✅ Git Repository Initialized

Your local Git repository is ready with 2 commits:
- Initial commit with all project files
- README documentation

## Step 1: Create GitHub Repository

### Option A: GitHub Web Interface (Easiest)

1. **Go to:** https://github.com/new

2. **Fill in details:**
   - Repository name: `KhadyamQR`
   - Description: `Restaurant menu management with QR codes - React + Vite + Express + Supabase`
   - Visibility: **Public** (or Private if you prefer)
   - ⚠️ **DO NOT** check "Initialize with README" (we already have code)
   - ⚠️ **DO NOT** add .gitignore or license (already exists)

3. **Click "Create repository"**

4. **Copy the commands shown** (should look like this):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/KhadyamQR.git
   git branch -M main
   git push -u origin main
   ```

5. **Run in PowerShell:**
   ```powershell
   cd c:\Users\sumed\Downloads\KhadyamQR
   git remote add origin https://github.com/YOUR_USERNAME/KhadyamQR.git
   git branch -M main
   git push -u origin main
   ```

### Option B: Install GitHub CLI (For Future)

```powershell
winget install --id GitHub.cli
# Then restart terminal and run:
gh auth login
gh repo create KhadyamQR --public --source=. --push
```

## Step 2: Verify Push

After pushing, visit:
```
https://github.com/YOUR_USERNAME/KhadyamQR
```

You should see:
- ✅ All project files
- ✅ README.md displayed on homepage
- ✅ 2 commits in history

## Step 3: Deploy to Netlify

### Quick Deploy Button (After GitHub Push)

1. **Go to:** https://app.netlify.com/start

2. **Click:** "Import from Git" → "GitHub"

3. **Authorize Netlify** to access your GitHub repos

4. **Select:** `KhadyamQR` repository

5. **Build Settings:**
   ```
   Build command: pnpm build
   Publish directory: dist/spa
   ```

6. **Environment Variables** (click "Show advanced"):
   ```
   VITE_SUPABASE_URL = https://dshrfgqoarhwpbhbdobt.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzaHJmZ3FvYXJod3BiaGJkb2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMzNjgsImV4cCI6MjA3NTQ5OTM2OH0.dPjEYMN7IclTS08VUKLaJrwZOo8lXxKtg53tTbXr8DU
   SUPABASE_URL = https://dshrfgqoarhwpbhbdobt.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzaHJmZ3FvYXJod3BiaGJkb2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzM2OCwiZXhwIjoyMDc1NDk5MzY4fQ.N3uUFiN42e5FT3XiOgzNIcZB8tGetbye9hg5U3Ya8VU
   PING_MESSAGE = ping pong
   ```

7. **Click:** "Deploy site"

8. **Wait 2-3 minutes** for build to complete

9. **Your site will be live at:**
   ```
   https://khadyamqr-RANDOM.netlify.app
   ```

### Post-Deployment

1. **Test admin panel:**
   ```
   https://your-site.netlify.app/admin
   ```

2. **Add a test restaurant**

3. **Generate QR code** - it will now point to your production URL!

4. **Test public menu:**
   ```
   https://your-site.netlify.app/menu/test-restaurant
   ```

## Troubleshooting

### Push Rejected: Authentication Failed

**Solution:** Use Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy token
5. When pushing, use token as password:
   ```powershell
   git push -u origin main
   # Username: YOUR_GITHUB_USERNAME
   # Password: ghp_YOUR_TOKEN_HERE
   ```

### Build Fails on Netlify

**Check:**
- Environment variables are set correctly
- Build command is `pnpm build`
- Publish directory is `dist/spa`

### API Routes 404 in Production

**Solution:** Already configured in `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

## Next Steps After Deployment

1. ✅ Update QR codes in admin (regenerate with production URL)
2. ✅ Test all features in production
3. ✅ Share your live site!
4. 🎉 Celebrate your deployed app!

---

**Current Status:**
- ✅ Git repository initialized
- ✅ 2 commits ready
- ⏳ Waiting for GitHub repo creation
- ⏳ Ready to deploy to Netlify
