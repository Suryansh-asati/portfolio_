/*
 Express backend for the portfolio site
 - Serves static files from current directory
 - APIs: /api/contact, /api/projects, /sitemap.xml, /robots.txt, /api/health
*/

const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { z } = require('zod');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;
const IS_PROD = process.env.NODE_ENV === 'production';

// View engine (EJS)
app.set('view engine', 'ejs');
// Search templates in project root (for projects.ejs) and in ./views (for index.ejs)
app.set('views', [
  __dirname,
  path.join(__dirname, 'views')
]);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // keep simple; can be tightened later
}));

// CORS: Allow requests from the frontend URL and handle Vercel previews
const corsOptions = {
  origin: (origin, callback) => {
    const frontendUrl = process.env.FRONTEND_URL || SITE_URL;
    const allowlist = [frontendUrl];
    if (!IS_PROD) {
      // Allow common dev origins
      allowlist.push('http://localhost:5500', 'http://127.0.0.1:5500');
    }
    
    // Allow Vercel preview deployments
    if (origin && (origin.endsWith('.vercel.app') || allowlist.includes(origin))) {
      return callback(null, true);
    }
    
    // Allow requests with no origin (like Postman, mobile apps) in non-prod
    if (!origin && !IS_PROD) {
        return callback(null, true);
    }

    if (!origin) {
        return callback(new Error('Not allowed by CORS: No origin specified.'));
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  }
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));

// Static files (serve the existing static site)
// Note: Place static after APIs so dynamic sitemap/robots take precedence

// Basic rate limiter for APIs
const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
app.use('/api/', limiter);

// Contact API
const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
  _hp: z.string().optional() // honeypot field
});

function buildTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return null;
}

app.post('/api/contact', async (req, res) => {
  try {
    const data = ContactSchema.parse(req.body);
    // honeypot
    if (data._hp) return res.status(200).json({ ok: true });

    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const to = process.env.EMAIL_TO || process.env.SMTP_USER;
    const transport = buildTransport();
    if (!transport || !from || !to) {
      return res.status(500).json({ ok: false, error: 'Email transport not configured' });
    }

    const subject = `Portfolio contact from ${data.name}`;
    const text = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
    await transport.sendMail({ from, to, subject, text });
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
});

// Projects API
const PROJECTS_PATH = path.join(__dirname, 'data', 'projects.json');
app.get('/api/projects', (req, res) => {
  try {
    const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
    const projects = JSON.parse(raw);
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ projects });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Unable to load projects' });
  }
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  let urls = ['/', '/projects'];
  try {
    const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
    const projects = JSON.parse(raw);
    // Keep it simple; we only list the projects page for now
  } catch {}
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  res.type('application/xml').send(xml);
});

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  res.type('text/plain').send(robots);
});

// Normalize trailing slash only for the exact URL /projects/
app.use((req, res, next) => {
  if (req.originalUrl === '/projects/') {
    return res.redirect(IS_PROD ? 301 : 302, '/projects');
  }
  next();
});

// Pretty URL for Projects: render /projects
app.get('/projects', (req, res) => {
  res.render('projects');
});

// Redirect legacy /projects.html to canonical /projects
app.get('/projects.html', (req, res) => {
  res.redirect(IS_PROD ? 301 : 302, '/projects');
});

// Redirect legacy EJS path (if linked anywhere) to /projects
app.get('/views/projects.ejs', (req, res) => {
  res.redirect(IS_PROD ? 301 : 302, '/projects');
});

// Render home with EJS as well (optional, keeps parity)
app.get(['/', '/index.html'], (req, res, next) => {
  // Render EJS and pass projects from data/projects.json
  try {
    let projects = [];
    try {
      const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
      projects = JSON.parse(raw);
    } catch {}
    return res.render('index', { projects });
  } catch (e) {
    next();
  }
});

// Finally, serve static files (disable directory redirect to avoid /path -> /path/ redirects)
app.use(express.static(__dirname, { redirect: false }));

app.listen(PORT, () => {
  console.log(`Server running at ${SITE_URL}`);
});
