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

## 🚂 Deploy to Railway

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Add environment variables
5. Deploy!

Visit README for full deployment guide.

---

Made with ❤️ by Marina Kaminska
