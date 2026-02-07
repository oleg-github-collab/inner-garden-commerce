# 🎨 Inner Garden Art - Premium Abstract Art Gallery

Modern art gallery website with AR preview, full localization (Ukrainian, English, German), and e-commerce functionality.

## ✨ Features

- 🖼️ **AR Preview** - View artworks in your space using augmented reality
- 🌍 **Full Localization** - Ukrainian, English, German
- 📱 **Perfect Mobile** - Optimized for mobile devices with AR support
- 🎨 **Custom Cursor** - Beautiful animated cursor
- 📧 **Email Orders** - Automatic email notifications
- 🚀 **High Performance** - Optimized for speed and reliability
- 🔒 **Secure** - Rate limiting, CORS, security headers

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start server
npm start
```

## 📧 Email Setup (Gmail)

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Create app password for "Mail"
5. Add to .env:

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

## ⚙️ Integrations (Optional)

Add these to `.env` if you плануєте AI-примірку, Cloudinary або Stripe:

```env
# Admin access
ADMIN_PASSWORD=your-strong-password
# or ADMIN_TOKEN=your-admin-token
ADMIN_ROUTE=/studio-9f3c1b
ADMIN_ACCESS_KEY=your-admin-access-key

# OpenAI try-on
OPENAI_API_KEY=your-openai-key
OPENAI_VISION_MODEL=gpt-4o-mini

# Cloudinary media library
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Stripe payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_SUCCESS_URL=https://your-domain.com/?checkout=success
STRIPE_CANCEL_URL=https://your-domain.com/?checkout=cancel
PUBLIC_URL=https://your-domain.com
```

## 🚂 Deploy to Railway

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Add environment variables
5. Deploy!

Visit README for full deployment guide.

---

Made with ❤️ by Marina Kaminska
