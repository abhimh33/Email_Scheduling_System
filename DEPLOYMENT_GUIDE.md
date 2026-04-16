# 🚀 Deployment Guide - ReachInbox Email Scheduler

## ✅ Gmail SMTP Configuration Complete

Your application is now configured to use Gmail SMTP instead of Ethereal for production deployment.

### Current Configuration

**Gmail SMTP Settings:**
- Host: `smtp.gmail.com`
- Port: `587`
- Email: `tryitforeverything1@gmail.com`
- App Password: `onos oewo xsfw hzqy`

**Google OAuth (for user authentication):**
- Client ID: `your_google_client_id.apps.googleusercontent.com`

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Make sure these are set in your production environment:

**Backend (.env):**
```env
# Database (use production PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/reachinbox

# Redis (use production Redis)
REDIS_URL=redis://production-redis-host:6379

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tryitforeverything1@gmail.com
SMTP_PASS=onos oewo xsfw hzqy

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# JWT Secret (CHANGE THIS!)
JWT_SECRET=generate-a-strong-random-secret-here

# Production settings
NODE_ENV=production
PORT=4000
EMAILS_PER_HOUR=100
MIN_DELAY_MS=500
```

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXTAUTH_SECRET=generate-a-strong-random-secret-here
NEXTAUTH_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Security Updates Required

⚠️ **IMPORTANT:** Update these before deploying:

1. **JWT_SECRET**: Generate a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **NEXTAUTH_SECRET**: Generate another strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Google Client Secret**: Add your actual Google OAuth client secret

---

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

#### Backend (Railway)
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Add Redis service
5. Deploy from GitHub
6. Set environment variables in Railway dashboard

### Option 2: Deploy to Render

#### Backend
1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Build Command: `cd backend && npm install && npx prisma generate && npm run build`
5. Start Command: `cd backend && npm start`
6. Add PostgreSQL database
7. Add Redis instance
8. Set environment variables

#### Frontend
1. Create new Static Site
2. Build Command: `cd frontend && npm install && npm run build`
3. Publish Directory: `frontend/.next`
4. Set environment variables

### Option 3: Deploy to AWS/DigitalOcean/VPS

#### Requirements:
- Ubuntu 20.04+ server
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Nginx (reverse proxy)
- PM2 (process manager)

#### Setup Script:
```bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/Email_Scheduling_System.git
cd Email_Scheduling_System

# Backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 start npm --name "reachinbox-backend" -- start

# Frontend setup
cd ../frontend
npm install
npm run build
pm2 start npm --name "reachinbox-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 🔧 Database Migration

Before deploying, run migrations on your production database:

```bash
cd backend
npx prisma migrate deploy
```

---

## 🧪 Testing Gmail SMTP Locally

Test the Gmail configuration before deploying:

1. Start the application (already running)
2. Go to http://localhost:3000
3. Login or register
4. Schedule an email for 1 minute from now
5. Check the backend logs for "📧 Email sent! Message ID: ..."
6. Check the recipient's inbox (real email will be delivered!)

---

## 📊 Monitoring & Logs

### Production Logging

Add a logging service like:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **DataDog** for infrastructure monitoring

### Email Delivery Monitoring

Monitor these metrics:
- Emails scheduled vs sent
- Failed email rate
- Rate limit hits
- Queue depth

---

## 🔐 Security Best Practices

1. **Use HTTPS** for both frontend and backend
2. **Enable CORS** only for your frontend domain
3. **Rate limit** API endpoints
4. **Validate** all user inputs
5. **Use environment variables** for all secrets
6. **Enable** PostgreSQL SSL in production
7. **Use** Redis password authentication
8. **Rotate** JWT secrets periodically

---

## 🚨 Important Notes

### Gmail Sending Limits

- **Free Gmail**: 500 emails/day
- **Google Workspace**: 2,000 emails/day
- Consider using **SendGrid**, **AWS SES**, or **Mailgun** for higher volumes

### App Password Security

- Never commit app passwords to Git
- Use environment variables
- Rotate passwords regularly
- Enable 2FA on your Gmail account

### Rate Limiting

Current settings:
- 100 emails per hour per sender
- 500ms minimum delay between emails

Adjust in production based on your SMTP provider's limits.

---

## 📞 Support

If you encounter issues during deployment:

1. Check backend logs for errors
2. Verify all environment variables are set
3. Test database and Redis connections
4. Verify Gmail app password is correct
5. Check firewall rules for ports 587 (SMTP), 5432 (PostgreSQL), 6379 (Redis)

---

## ✅ Deployment Checklist

- [ ] Update JWT_SECRET
- [ ] Update NEXTAUTH_SECRET
- [ ] Add Google Client Secret
- [ ] Set production DATABASE_URL
- [ ] Set production REDIS_URL
- [ ] Run database migrations
- [ ] Test Gmail SMTP locally
- [ ] Configure domain DNS
- [ ] Set up SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Test email sending in production
- [ ] Set up automated backups
- [ ] Document rollback procedure

---

**Good luck with your deployment! 🚀**
