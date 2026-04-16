# 🔐 Google OAuth Setup Guide

## ✅ Current Configuration

**Google OAuth Credentials:**
- Client ID: `your_google_client_id.apps.googleusercontent.com`
- Client Secret: `your_google_client_secret`

**Status:** Credentials are configured in both frontend and backend ✅

---

## 🚨 CRITICAL: Configure Authorized Redirect URIs

For Google login to work, you MUST add the redirect URIs in Google Cloud Console:

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `your_google_client_id.apps.googleusercontent.com`
3. Click on it to edit

### Step 2: Add Authorized Redirect URIs

Add these URIs to the "Authorized redirect URIs" section:

**For Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Production (when deployed):**
```
https://your-domain.com/api/auth/callback/google
https://www.your-domain.com/api/auth/callback/google
```

### Step 3: Add Authorized JavaScript Origins

Add these to "Authorized JavaScript origins":

**For Local Development:**
```
http://localhost:3000
```

**For Production:**
```
https://your-domain.com
https://www.your-domain.com
```

### Step 4: Save Changes

Click "SAVE" at the bottom of the page.

---

## 🧪 Testing Google Login

After configuring the redirect URIs:

1. Go to http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected back and logged in

---

## ⚠️ Common Issues

### Issue 1: "redirect_uri_mismatch" Error

**Cause:** The redirect URI is not configured in Google Cloud Console

**Solution:** 
- Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
- Make sure there are no trailing slashes
- Wait a few minutes for changes to propagate

### Issue 2: "client_id is required" Error

**Cause:** Environment variables not loaded

**Solution:** ✅ Already fixed - credentials are now in `.env.local`

### Issue 3: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured

**Solution:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Configure the OAuth consent screen
3. Add test users if in "Testing" mode
4. Publish the app or add your email as a test user

---

## 🔒 Security Notes

### Gmail App Password vs OAuth Client Secret

**Different credentials for different purposes:**

| Credential | Purpose | Format | Example |
|------------|---------|--------|---------|
| **Gmail App Password** | SMTP email sending | 16 chars with spaces | `onos oewo xsfw hzqy` |
| **OAuth Client Secret** | User authentication | Starts with GOCSPX- | `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` |

### Protect Your Secrets

⚠️ **NEVER commit these to Git:**
- `.env` files
- `.env.local` files
- Any file containing secrets

✅ **Already protected:**
- `.gitignore` includes `.env` and `.env.local`

---

## 📋 Environment Variables Summary

### Backend (.env)
```env
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Frontend (.env.local)
```env
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecret123"
```

---

## 🚀 Production Deployment

When deploying to production:

1. **Update NEXTAUTH_URL** to your production domain:
   ```env
   NEXTAUTH_URL="https://your-domain.com"
   ```

2. **Add production redirect URIs** in Google Cloud Console:
   ```
   https://your-domain.com/api/auth/callback/google
   ```

3. **Generate new NEXTAUTH_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Publish OAuth Consent Screen** (if in Testing mode):
   - Go to OAuth consent screen settings
   - Click "PUBLISH APP"
   - Or add all users as test users

---

## ✅ Checklist

Before testing Google login:

- [x] Google Client ID configured in frontend
- [x] Google Client Secret configured in frontend
- [x] Google Client ID configured in backend
- [x] Google Client Secret configured in backend
- [ ] Redirect URI added in Google Cloud Console
- [ ] JavaScript origins added in Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] Test user added (if in Testing mode)

---

**Next Step:** Add the redirect URI in Google Cloud Console, then test the login!
