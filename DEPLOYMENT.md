# 🚀 Deployment Guide - Railway

## Pre-Deployment Checklist

### ✅ 1. Add Real Images

Before deploying, replace all placeholder images:

```bash
assets/images/collection/
├── art-1.jpg  (Inner Peace)
├── art-2.jpg  (Aurora Pulse)
├── art-3.jpg  (Golden Horizon)
...
├── art-12.jpg (Earth Energy)
```

**Image Requirements:**
- Format: JPG or WebP
- Max size: 500KB per image
- Dimensions: 1200x800px recommended
- Quality: 80-85%

### ✅ 2. Configure Email

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=marina@artkaminska.com

# Production settings
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com

# Admin access
ADMIN_PASSWORD=your-strong-password
# альтернативно: ADMIN_TOKEN=your-admin-token
ADMIN_ROUTE=/studio-9f3c1b
ADMIN_ACCESS_KEY=your-admin-access-key

# OpenAI try-on
OPENAI_API_KEY=your-openai-key
OPENAI_VISION_MODEL=gpt-4o-mini

# Cloudinary (admin media library)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Stripe payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_SUCCESS_URL=https://your-domain.com/?checkout=success
STRIPE_CANCEL_URL=https://your-domain.com/?checkout=cancel
PUBLIC_URL=https://your-domain.com
```

**Get Gmail App Password:**
1. https://myaccount.google.com/security
2. Enable 2-Step Verification
3. https://myaccount.google.com/apppasswords
4. Create "Mail" password
5. Copy 16-character password to `SMTP_PASS`

### ✅ 3. Test Locally

```bash
# Install dependencies
npm install

# Start server
npm start

# Test in browser
open http://localhost:3000

# Test order form
# Test AR preview on mobile
# Test language switching
```

## 🚂 Deploy to Railway

### Step 1: Create GitHub Repository

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - Inner Garden Art Gallery"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/inner-garden.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Sign Up/Login**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Choose `inner-garden` repository

3. **Configure Build**
   - Railway auto-detects Node.js
   - Uses `server.js` as entry point
   - Build command: `npm install`
   - Start command: `npm start`

4. **Add Environment Variables**

   In Railway dashboard → Variables tab:

   ```
   PORT=3000
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=marina@artkaminska.com
   ALLOWED_ORIGINS=https://inner-garden-production.up.railway.app
   ADMIN_PASSWORD=your-strong-password
   ADMIN_ROUTE=/studio-9f3c1b
   ADMIN_ACCESS_KEY=your-admin-access-key
   OPENAI_API_KEY=your-openai-key
   OPENAI_VISION_MODEL=gpt-4o-mini
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_SUCCESS_URL=https://inner-garden-production.up.railway.app/?checkout=success
   STRIPE_CANCEL_URL=https://inner-garden-production.up.railway.app/?checkout=cancel
   PUBLIC_URL=https://inner-garden-production.up.railway.app
   ```

5. **Deploy!**
   - Railway automatically deploys
   - Wait 2-3 minutes
   - Check logs for errors

### Step 3: Get Domain

**Option A: Railway Subdomain (Free)**
```
Settings → Domains → Generate Domain
```
You'll get: `inner-garden-production.up.railway.app`

**Option B: Custom Domain**
```
Settings → Domains → Custom Domain
```
Add your domain (e.g., `artkaminska.com`)

Then add DNS records:
```
Type: CNAME
Name: @
Value: <railway-domain>.up.railway.app
```

### Step 4: Update CORS

After getting domain, update `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://artkaminska.com,https://www.artkaminska.com
```

## 📱 Mobile Testing

### iOS Safari
1. Open site on iPhone
2. Test AR preview (requires camera permission)
3. Test order form
4. Test language switching

### Android Chrome
1. Open site on Android
2. Test AR preview
3. Test all features

## 🔍 Post-Deployment Checks

### ✅ Functionality
- [ ] Site loads correctly
- [ ] All images display
- [ ] Language switching works
- [ ] AR preview works on mobile
- [ ] Order form submits
- [ ] Email arrives to admin
- [ ] Email arrives to customer
- [ ] Custom cursor works
- [ ] Responsive design works

### ✅ Performance
- [ ] Page load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] AR loads smoothly

### ✅ SEO
- [ ] Meta tags present
- [ ] Open Graph works
- [ ] Mobile-friendly test passes
- [ ] Sitemap accessible

## 🐛 Troubleshooting

### Email Not Sending

**Error:** "Invalid login"
```
Solution: Check SMTP_USER and SMTP_PASS are correct
Verify 2-Step verification enabled
Regenerate app password
```

**Error:** "Connection timeout"
```
Solution: Check SMTP_HOST and SMTP_PORT
Try SMTP_PORT=465 with secure=true
Check firewall/network settings
```

### AR Not Working

```
Solution:
- Ensure HTTPS is enabled (required for camera)
- Check camera permissions
- Test on real device (not emulator)
- Check browser compatibility
```

### Site Not Loading

```
Solution:
- Check Railway logs for errors
- Verify all environment variables set
- Check PORT is set to 3000
- Restart Railway service
```

## 📊 Monitoring

### Railway Logs
```
Dashboard → Deployments → View Logs
```

### Email Delivery
```
Check admin inbox for test orders
Monitor spam folder
```

### Performance
```
Use Lighthouse in Chrome DevTools
Test on real mobile devices
Monitor Railway metrics
```

## 🔄 Updates

### Deploy New Version

```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push

# Railway auto-deploys on push to main
```

### Rollback

```
Railway Dashboard → Deployments → Select previous version → Redeploy
```

## 📈 Scaling

Railway automatically scales, but you can:

1. **Upgrade Plan** for more resources
2. **Add Database** if storing orders
3. **Add Redis** for caching
4. **CDN** for faster image delivery

## 🆘 Support

**Railway Issues:**
- https://railway.app/help

**Code Issues:**
- Check `server.js` logs
- Test locally first
- Review environment variables

---

✅ **You're ready to deploy!**

Good luck! 🎨🚀
