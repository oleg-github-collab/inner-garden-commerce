/**
 * ═══════════════════════════════════════════════════════════════
 * INNER GARDEN - Production Server with Email Integration
 * ═══════════════════════════════════════════════════════════════
 */

import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════════
// SECURITY & MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      workerSrc: ["'self'", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 orders per hour per IP
  message: 'Too many order requests. Please try again in an hour.'
});

app.use('/api/', limiter);

// Static files with cache
app.use(express.static(__dirname, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Cache CSS, JS, fonts for 1 week
    if (filePath.match(/\.(css|js|woff2?|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    // Cache images for 1 month
    if (filePath.match(/\.(jpg|jpeg|png|webp|svg|gif)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
    // No cache for HTML
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// ═══════════════════════════════════════════════════════════════
// EMAIL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready');
  }
});

// ═══════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════

/**
 * Order submission endpoint
 */
app.post('/api/order', orderLimiter, async (req, res) => {
  try {
    const {
      artwork,
      price,
      name,
      email,
      phone,
      country,
      frame,
      message
    } = req.body;

    // Validation
    if (!artwork || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: artwork, name, email'
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🎨 New Order: ${artwork}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .value { color: #333; }
            .price { font-size: 24px; font-weight: bold; color: #e67e22; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎨 New Artwork Order</h1>
              <p>${artwork}</p>
            </div>
            <div class="content">
              <div class="price">💰 ${price}</div>

              <div class="field">
                <div class="label">👤 Customer Name</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>

              ${phone ? `
              <div class="field">
                <div class="label">📱 Phone</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">🌍 Country</div>
                <div class="value">${country}</div>
              </div>

              <div class="field">
                <div class="label">🖼️ Frame Option</div>
                <div class="value">${frame === 'no-frame' ? 'No frame (canvas on stretcher)' : frame === 'wooden-frame' ? 'Wooden frame (+€200)' : 'Metal frame (+€350)'}</div>
              </div>

              ${message ? `
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value">${message}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">🕐 Order Time</div>
                <div class="value">${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}</div>
              </div>
            </div>
            <div class="footer">
              Inner Garden Art • Premium Abstract Art Gallery
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email to customer
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Thank you for your order - ${artwork}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .artwork { font-size: 20px; font-weight: bold; color: #e67e22; margin: 20px 0; text-align: center; }
            .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <div class="artwork">🎨 ${artwork}</div>

              <div class="message">
                <p>Dear ${name},</p>
                <p>Thank you for your interest in <strong>${artwork}</strong>!</p>
                <p>We have received your order request and will contact you within 24 hours to discuss the details, delivery, and payment options.</p>
                <p><strong>Your order details:</strong></p>
                <ul>
                  <li>Artwork: ${artwork}</li>
                  <li>Price: ${price}</li>
                  <li>Frame: ${frame === 'no-frame' ? 'No frame' : frame === 'wooden-frame' ? 'Wooden frame (+€200)' : 'Metal frame (+€350)'}</li>
                </ul>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>Best regards,<br>Marina Kaminska<br>Inner Garden Art</p>
              </div>
            </div>
            <div class="footer">
              Inner Garden Art • <a href="mailto:${process.env.SMTP_USER}">${process.env.SMTP_USER}</a>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log(`✅ Order email sent for: ${artwork} by ${name}`);

    res.json({
      success: true,
      message: 'Order received successfully'
    });

  } catch (error) {
    console.error('❌ Order submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process order. Please try again.'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ═══════════════════════════════════════════════════════════════
// SPA ROUTING - Always serve index.html for client-side routing
// ═══════════════════════════════════════════════════════════════

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║            🎨 INNER GARDEN ART - Server Running              ║
║                                                               ║
║            🌍 URL: http://localhost:${PORT}                     ║
║            📧 Email: ${process.env.SMTP_USER ? '✅ Configured' : '❌ Not configured'}                           ║
║            🚀 Environment: ${process.env.NODE_ENV || 'development'}                           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
