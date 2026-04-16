# ✅ Deployment Checklist

## Pre-Deployment

- [ ] All features tested locally
- [ ] Email sending works (both test and production modes)
- [ ] Google OAuth login works
- [ ] Database migrations are up to date
- [ ] Environment variables documented

## Security

- [ ] Generate new JWT_SECRET for production
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Generate new NEXTAUTH_SECRET for production
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Gmail App Password is secure: `onos oewo xsfw hzqy`
- [ ] Google OAuth Client Secret is secure: `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`
- [ ] Never commit `.env` files to Git

## Database (Supabase)

- [ ] Create Supabase project
- [ ] Copy connection string
- [ ] Test connection locally
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify tables are created

## Backend (Railway)

- [ ] Create Railway project
- [ ] Connect GitHub repository
- [ ] Add Redis service
- [ ] Set all environment variables:
  - [ ] DATABASE_URL
  - [ ] REDIS_URL
  - [ ] SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  - [ ] GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - [ ] JWT_SECRET
  - [ ] EMAIL_MODE=production
  - [ ] NODE_ENV=production
- [ ] Deploy backend
- [ ] Run database migrations
- [ ] Test backend API endpoints
- [ ] Copy backend URL

## Frontend (Vercel)

- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Set all environment variables:
  - [ ] NEXT_PUBLIC_API_URL
  - [ ] NEXT_PUBLIC_BACKEND_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
- [ ] Deploy frontend
- [ ] Copy frontend URL

## Google OAuth Configuration

- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Add production redirect URI:
  ```
  https://your-vercel-domain.vercel.app/api/auth/callback/google
  ```
- [ ] Add JavaScript origin:
  ```
  https://your-vercel-domain.vercel.app
  ```
- [ ] Save changes

## Testing Production

- [ ] Visit production frontend URL
- [ ] Test user registration
- [ ] Test email/password login
- [ ] Test Google OAuth login
- [ ] Schedule a test email
- [ ] Verify email is sent
- [ ] Check backend logs
- [ ] Test email cancellation
- [ ] Test email duplication
- [ ] Test search functionality

## Post-Deployment

- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up automated backups
- [ ] Document deployment process
- [ ] Share credentials with team (securely)

## Environment Variables Reference

### Backend (Railway)
```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
REDIS_URL=${{Redis.REDIS_URL}}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=[generate-new-32-byte-hex]
NODE_ENV=production
EMAIL_MODE=production
EMAILS_PER_HOUR=100
MIN_DELAY_MS=500
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=[generate-new-32-byte-hex]
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Check REDIS_URL is correct
- Check all required env vars are set
- Check Railway logs

### Frontend won't build
- Check NEXT_PUBLIC_API_URL is set
- Check all env vars are set
- Check Vercel build logs

### Google login fails
- Check redirect URI is configured
- Check GOOGLE_CLIENT_ID and SECRET are correct
- Check NEXTAUTH_URL matches your domain

### Emails not sending
- Check SMTP credentials are correct
- Check EMAIL_MODE=production
- Check backend logs for errors
- Verify Gmail app password is active

## Cost Monitoring

### Railway
- Monitor usage in Railway dashboard
- Set spending limits
- Check monthly bills

### Supabase
- Monitor database size
- Upgrade if approaching 500MB limit

### Vercel
- Should stay free for hobby projects
- Monitor bandwidth usage

---

**Estimated Monthly Cost: $5-10**

Good luck with your deployment! 🚀
