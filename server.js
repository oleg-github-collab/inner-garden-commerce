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
import Stripe from 'stripe';
import fs from 'fs/promises';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const ARTWORKS_DB_PATH = path.join(__dirname, 'artworks-database.json');
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const adminSessions = new Map();

const safeTrim = (value) => (typeof value === 'string' ? value.trim() : value);
const toNumber = (value, fallback = null) => {
  if (value === '' || value === null || typeof value === 'undefined') return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};
const toArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.map((item) => safeTrim(item)).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => safeTrim(item)).filter(Boolean);
  }
  return fallback;
};
const normalizeStatus = (value) => {
  const status = String(value || '').trim().toLowerCase();
  if (['available', 'sold', 'reserved', 'commission'].includes(status)) {
    return status;
  }
  return 'available';
};

const readArtworksDb = async () => {
  try {
    const raw = await fs.readFile(ARTWORKS_DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return {
      artworks: Array.isArray(data.artworks) ? data.artworks : [],
      updated_at: data.updated_at || null
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { artworks: [], updated_at: null };
    }
    console.error('Failed to read artworks database:', error);
    throw error;
  }
};

const writeArtworksDb = async (data) => {
  const payload = {
    artworks: Array.isArray(data.artworks) ? data.artworks : [],
    updated_at: data.updated_at || new Date().toISOString()
  };
  await fs.writeFile(ARTWORKS_DB_PATH, JSON.stringify(payload, null, 2), 'utf-8');
};

const normalizeArtwork = (input = {}, existing = {}) => {
  const now = new Date().toISOString();
  const width = toNumber(input.width_cm ?? existing.width_cm, existing.width_cm ?? null);
  const height = toNumber(input.height_cm ?? existing.height_cm, existing.height_cm ?? null);
  const computedSize = width && height ? `${width} × ${height} см` : existing.size;

  return {
    id: existing.id || safeTrim(input.id) || crypto.randomBytes(10).toString('hex'),
    title_uk: safeTrim(input.title_uk ?? existing.title_uk ?? ''),
    title_en: safeTrim(input.title_en ?? existing.title_en ?? ''),
    title_de: safeTrim(input.title_de ?? existing.title_de ?? ''),
    description_uk: safeTrim(input.description_uk ?? existing.description_uk ?? ''),
    description_en: safeTrim(input.description_en ?? existing.description_en ?? ''),
    description_de: safeTrim(input.description_de ?? existing.description_de ?? ''),
    price: toNumber(input.price ?? existing.price, existing.price ?? null),
    currency: safeTrim(input.currency ?? existing.currency ?? 'EUR'),
    size: safeTrim(input.size ?? computedSize ?? ''),
    technique_uk: safeTrim(input.technique_uk ?? existing.technique_uk ?? ''),
    technique_en: safeTrim(input.technique_en ?? existing.technique_en ?? ''),
    technique_de: safeTrim(input.technique_de ?? existing.technique_de ?? ''),
    cloudinary_id: safeTrim(input.cloudinary_id ?? existing.cloudinary_id ?? ''),
    width_cm: width,
    height_cm: height,
    segments: toArray(input.segments ?? existing.segments, existing.segments ?? []),
    mood: safeTrim(input.mood ?? existing.mood ?? ''),
    status: normalizeStatus(input.status ?? existing.status ?? 'available'),
    created_at: existing.created_at || now,
    updated_at: now
  };
};

const isAdminConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) || Boolean(process.env.ADMIN_TOKEN);

const requireAdmin = (req, res, next) => {
  if (!isAdminConfigured()) {
    return res.status(503).json({ success: false, error: 'Admin is not configured' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (req.headers['x-admin-token'] || '').toString();
  const fallbackToken = process.env.ADMIN_TOKEN;

  if (fallbackToken && token === fallbackToken) {
    return next();
  }

  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const session = adminSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    adminSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Session expired' });
  }

  req.admin = session;
  return next();
};

// ═══════════════════════════════════════════════════════════════
// SECURITY & MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://tile.openstreetmap.org", "https://*.tile.openstreetmap.org"],
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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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

const consultLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10, // Max 10 consultation requests per 30 minutes per IP
  message: 'Too many consultation requests. Please try again later.'
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
 * Public artworks feed
 */
app.get('/api/artworks', async (req, res) => {
  try {
    const data = await readArtworksDb();
    return res.json({
      success: true,
      artworks: data.artworks || [],
      updated_at: data.updated_at || null
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load artworks' });
  }
});

/**
 * Admin auth
 */
app.post('/api/admin/login', (req, res) => {
  try {
    if (!isAdminConfigured()) {
      return res.status(503).json({ success: false, error: 'Admin is not configured' });
    }
    const { email, password } = req.body || {};
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      if (email !== adminEmail || password !== adminPassword) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    } else if (process.env.ADMIN_TOKEN) {
      if (password !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
    adminSessions.set(token, { email, expiresAt });
    return res.json({ success: true, token, expiresAt });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

/**
 * Admin artworks CRUD
 */
app.get('/api/admin/artworks', requireAdmin, async (req, res) => {
  try {
    const data = await readArtworksDb();
    return res.json({ success: true, artworks: data.artworks || [] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load artworks' });
  }
});

app.post('/api/admin/artworks', requireAdmin, async (req, res) => {
  try {
    const data = await readArtworksDb();
    const artwork = normalizeArtwork(req.body || {});
    data.artworks = [artwork, ...(data.artworks || [])];
    data.updated_at = new Date().toISOString();
    await writeArtworksDb(data);
    return res.json({ success: true, artwork });
  } catch (error) {
    console.error('Create artwork error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create artwork' });
  }
});

app.put('/api/admin/artworks/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readArtworksDb();
    const artworks = data.artworks || [];
    const index = artworks.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }
    const updatedArtwork = normalizeArtwork(req.body || {}, artworks[index]);
    artworks[index] = updatedArtwork;
    data.artworks = artworks;
    data.updated_at = new Date().toISOString();
    await writeArtworksDb(data);
    return res.json({ success: true, artwork: updatedArtwork });
  } catch (error) {
    console.error('Update artwork error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update artwork' });
  }
});

app.delete('/api/admin/artworks/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readArtworksDb();
    const artworks = data.artworks || [];
    const nextArtworks = artworks.filter((item) => item.id !== id);
    if (nextArtworks.length === artworks.length) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }
    data.artworks = nextArtworks;
    data.updated_at = new Date().toISOString();
    await writeArtworksDb(data);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete artwork error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete artwork' });
  }
});

/**
 * Consultation request endpoint
 */
app.post('/api/consultation', consultLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      space,
      budget,
      timeline,
      message
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: name, email'
      });
    }

    const payload = {
      name,
      email,
      phone: phone || '',
      space: space || '',
      budget: budget || '',
      timeline: timeline || '',
      message: message || '',
      timestamp: new Date().toISOString()
    };

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK;
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Sheets webhook error:', errorText);
        return res.status(502).json({ success: false, error: 'Failed to forward to Sheets webhook' });
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Consultation error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process consultation request' });
  }
});

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
 * AI-assisted room visualization endpoint
 */
app.post('/api/tryon', async (req, res) => {
  try {
    const { artworkId, wallImage, painting } = req.body || {};

    if (!wallImage || !painting?.imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'wallImage and painting.imageUrl are required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OPENAI_API_KEY is not configured on the server'
      });
    }

    const normalizedImage = wallImage.startsWith('data:')
      ? wallImage
      : `data:image/jpeg;base64,${wallImage}`;

    if (normalizedImage.length > 20_000_000) {
      return res.status(413).json({
        success: false,
        error: 'The uploaded image is too large. Please upload a smaller photo.'
      });
    }

    const model = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';
    const widthCm = painting.widthCm || painting.width || 120;
    const heightCm = painting.heightCm || painting.height || 80;

    const body = {
      model,
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'placement',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              x: { type: 'number', description: 'Left coordinate in pixels' },
              y: { type: 'number', description: 'Top coordinate in pixels' },
              width: { type: 'number', description: 'Width in pixels for the painting placement' },
              height: { type: 'number', description: 'Height in pixels for the placement' },
              confidence: { type: 'number', description: '0-1 confidence score' },
              note: { type: 'string', description: 'Short note on placement reasoning' }
            },
            required: ['width', 'height'],
            additionalProperties: false
          }
        }
      },
      messages: [
        {
          role: 'system',
          content: 'You are an interior visualization assistant. Given a wall photo and painting size, return a single JSON object with numeric coordinates (x,y,width,height) in pixels for realistic placement on the main wall. Keep the painting fully inside bounds, avoid overlapping furniture, keep 5–12% margin from edges, and align at comfortable eye level if possible. Return only JSON.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Painting size: ${widthCm} x ${heightCm} cm. Place it on the primary wall, aligned to the wall plane. Center it if possible, keep safe margins, avoid furniture overlap, and keep it inside the image bounds.`
            },
            {
              type: 'image_url',
              image_url: { url: normalizedImage, detail: 'high' }
            }
          ]
        }
      ]
    };

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI placement error:', errorText);
      return res.status(502).json({
        success: false,
        error: 'AI placement request failed'
      });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData?.choices?.[0]?.message?.content;
    let placement = {};

    if (rawContent) {
      try {
        placement = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
      } catch (parseError) {
        console.warn('Failed to parse placement JSON, using empty fallback');
        placement = {};
      }
    }

    return res.json({
      success: true,
      placement: placement || {}
    });
  } catch (error) {
    console.error('❌ Try-on generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during try-on generation'
    });
  }
});

/**
 * Stripe Checkout for artwork purchase
 */
app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ success: false, error: 'Stripe is not configured' });
    }
    const { artworkId, artworkTitle, price } = req.body || {};
    if (!artworkTitle || typeof price === 'undefined') {
      return res.status(400).json({ success: false, error: 'artworkTitle and price are required' });
    }
    const amount = Math.max(1, Math.round(Number(price) * 100));
    const origin = req.headers.origin || 'http://localhost:' + PORT;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: artworkTitle,
              description: artworkId ? `Artwork ID: ${artworkId}` : 'Artwork'
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });
    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ success: false, error: 'Stripe checkout failed' });
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
