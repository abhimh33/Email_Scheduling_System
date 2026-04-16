# 🚀 Deployment Guide: Railway + Vercel + Upstash + Supabase

## 🎯 Your Architecture

```
Frontend (Vercel) → Backend (Railway) → Database (Supabase)
                           ↓
                    Redis (Upstash)
```

**Total Cost: ~$5/month** (everything else is FREE!)

---

## Step 1: Create Upstash Redis (5 minutes)

### 1.1 Sign Up
1. Go to https://upstash.com
2. Sign up with GitHub/Google
3. Verify your email

### 1.2 Create Redis Database
1. Click "Create Database"
2. Choose:
   - **Name:** `reachinbox-redis`
   - **Type:** Regional (cheaper) or Global (faster)
   - **Region:** Choose closest to your Railway region
   - **TLS:** Enabled (recommended)
3. Click "Create"

### 1.3 Get Connection String
1. Click on your database
2. Go to "Details" tab
3. Copy the **Redis URL** (looks like this):
   ```
   redis://default:xxxxxxxxxxxxx@us1-xxxxx.upstash.io:6379
   ```
4. Save this for later ✅

**Cost: FREE** (10,000 commands/day)

---

## Step 2: Create Supabase Database (5 minutes)

### 2.1 Sign Up
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new organization

### 2.2 Create Project
1. Click "New Project"
2. Fill in:
   - **Name:** `reachinbox`
   - **Database Password:** (generate strong password)
   - **Region:** Choose closest to Railway
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### 2.3 Get Connection String
1. Go to "Project Settings" → "Database"
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Save this for later ✅

**Cost: FREE** (up to 500MB)

---

## Step 3: Deploy Backend to Railway (10 minutes)

### 3.1 Sign Up & Connect GitHub
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repository

### 3.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will detect it's a monorepo

### 3.3 Configure Backend Service
1. Click "Add Service" → "GitHub Repo"
2. Configure:
   - **Service Name:** `backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Watch Paths:** `backend/**`

### 3.4 Set Environment Variables
Click on the backend service → "Variables" tab → Add all these:

```env
# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Redis (from Upstash)
REDIS_URL=redis://default:xxxxxxxxxxxxx@us1-xxxxx.upstash.io:6379

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security (GENERATE NEW SECRETS!)
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">>

# App Config
NODE_ENV=production
EMAIL_MODE=production
PORT=4000
EMAILS_PER_HOUR=100
MIN_DELAY_MS=500
```

### 3.5 Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Check logs for errors
4. Copy the backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### 3.6 Run Database Migrations
1. In Railway, click on backend service
2. Go to "Settings" → "Deploy"
3. Click "New Deployment"
4. Or use Railway CLI:
   ```bash
   railway run npx prisma migrate deploy
   ```

**Cost: ~$5/month**

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Sign Up & Connect GitHub
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"

### 4.2 Import Repository
1. Select your repository
2. Vercel will auto-detect Next.js

### 4.3 Configure Project
1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `.next` (default)
5. **Install Command:** `npm install` (default)

### 4.4 Set Environment Variables
Add these in the "Environment Variables" section:

```env
# Backend URL (from Railway)
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app
NEXT_PUBLIC_BACKEND_URL=https://backend-production-xxxx.up.railway.app

# NextAuth (GENERATE NEW SECRET!)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4.5 Deploy
1. Click "Deploy"
2. Wait for build (~2 minutes)
3. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)

### 4.6 Update NEXTAUTH_URL
1. Go back to Vercel project settings
2. Update `NEXTAUTH_URL` with your actual Vercel URL
3. Redeploy

**Cost: FREE**

---

## Step 5: Update Google OAuth (2 minutes)

### 5.1 Add Production Redirect URIs
1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
4. Under "Authorized JavaScript origins", add:
   ```
   https://your-project.vercel.app
   ```
5. Click "SAVE"

---

## Step 6: Test Everything (5 minutes)

### 6.1 Test Backend
```bash
curl https://backend-production-xxxx.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'
```

Should return user object with token ✅

### 6.2 Test Frontend
1. Visit `https://your-project.vercel.app`
2. Try to register/login
3. Schedule a test email
4. Check if email is sent

### 6.3 Check Logs
- **Railway:** Check backend logs for errors
- **Vercel:** Check function logs
- **Upstash:** Check Redis dashboard for commands
- **Supabase:** Check database tables

---

## 🎉 You're Live!

Your application is now deployed with:
- ✅ Frontend on Vercel (FREE)
- ✅ Backend on Railway ($5/month)
- ✅ Redis on Upstash (FREE)
- ✅ PostgreSQL on Supabase (FREE)

**Total Cost: $5/month**

---

## 📊 Monitoring

### Upstash Dashboard
- Monitor Redis commands/day
- Check if approaching 10,000 limit
- View latency metrics

### Supabase Dashboard
- Monitor database size
- Check query performance
- View table data

### Railway Dashboard
- Monitor backend CPU/memory
- Check deployment logs
- View metrics

### Vercel Dashboard
- Monitor function invocations
- Check build logs
- View analytics

---

## 🔧 Troubleshooting

### Backend won't connect to Upstash
- Check REDIS_URL format
- Ensure TLS is enabled in Upstash
- Verify firewall rules

### Backend won't connect to Supabase
- Check DATABASE_URL format
- Verify password is correct
- Check connection pooling settings

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Verify Railway backend is running

### Emails not sending
- Check SMTP credentials
- Verify EMAIL_MODE=production
- Check backend logs for errors

---

## 💡 Pro Tips

### 1. Use Railway CLI for Migrations
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

### 2. Monitor Upstash Usage
- Set up alerts at 8,000 commands/day (80%)
- Upgrade to paid tier if needed ($0.20 per 100K commands)

### 3. Optimize Database Size
```sql
-- Run monthly to clean old emails
DELETE FROM "Email" 
WHERE status = 'sent' 
AND "sentAt" < NOW() - INTERVAL '90 days';
```

### 4. Use Vercel Preview Deployments
- Every PR gets a preview URL
- Test before merging to production
- Automatic deployments on push

---

## 🚀 Scaling

### When to Upgrade Upstash (>10K commands/day)
- **Paid tier:** $0.20 per 100K commands
- Still cheaper than Railway Redis
- No action needed, auto-scales

### When to Upgrade Supabase (>500MB)
- **Pro tier:** $25/month for 8GB
- Includes daily backups
- Point-in-time recovery

### When to Scale Railway
- Monitor CPU/memory usage
- Railway auto-scales vertically
- Pay only for what you use

---

## ✅ Final Checklist

- [ ] Upstash Redis created and connected
- [ ] Supabase PostgreSQL created and connected
- [ ] Backend deployed to Railway
- [ ] Database migrations run
- [ ] Frontend deployed to Vercel
- [ ] Google OAuth redirect URIs updated
- [ ] Test registration works
- [ ] Test email scheduling works
- [ ] Test Google login works
- [ ] Monitor dashboards set up

---

**Congratulations! Your app is live on production! 🎉**

**Total Monthly Cost: ~$5** (everything else is FREE!)
