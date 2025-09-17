import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import 'dotenv/config';

export function createApp() {
  const app = express();

  const ROOT = process.cwd();
  const PORTFOLIO_DIR = path.join(ROOT, 'portfolio');
  const VIEWS_DIRS = [path.join(PORTFOLIO_DIR, 'views'), PORTFOLIO_DIR];
  const DATA_DIR = path.join(PORTFOLIO_DIR, 'data');
  const PROJECTS_PATH = path.join(DATA_DIR, 'projects.json');

  const IS_PROD = process.env.NODE_ENV === 'production';
  const SITE_URL = process.env.SITE_URL || '';

  app.set('view engine', 'ejs');
  app.set('views', VIEWS_DIRS);
  console.log('[app:init]', {
    cwd: process.cwd(),
    portfolioDir: PORTFOLIO_DIR,
    portfolioExists: fs.existsSync(PORTFOLIO_DIR),
    viewsDirs: VIEWS_DIRS,
    projectsPath: PROJECTS_PATH,
    projectsExists: fs.existsSync(PROJECTS_PATH),
  });

  app.use(helmet({ contentSecurityPolicy: false }));
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      const allowlist = [process.env.FRONTEND_URL || ''];
      if (!IS_PROD) {
        allowlist.push(
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:5173',
          'http://localhost:5500',
          'http://127.0.0.1:5500'
        );
      }
      if (origin && (origin.endsWith('.vercel.app') || allowlist.includes(origin))) return callback(null, true);
      if (!origin && !IS_PROD) return callback(null, true);
      if (!origin) return callback(new Error('Not allowed by CORS: No origin specified.'));
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  };
  // Apply CORS only for API routes
  app.use('/api', cors(corsOptions));
  app.use(express.json());
  app.use(morgan('tiny'));

  const limiter = rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: 'draft-7' });
  app.use('/api/', limiter);

  const ContactSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    message: z.string().min(5).max(2000),
    _hp: z.string().optional(),
  });

  function buildTransport() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }
    return null;
  }

  app.post('/api/contact', async (req, res) => {
    try {
      const data = ContactSchema.parse(req.body);
      if (data._hp) return res.status(200).json({ ok: true });

      const from = process.env.EMAIL_FROM || process.env.SMTP_USER || '';
      const to = process.env.EMAIL_TO || process.env.SMTP_USER || '';
      const transport = buildTransport();
      if (!transport || !from || !to) {
        if (!IS_PROD) {
          console.log('[contact] Email transport not configured. Dev mode: simulating success.');
          return res.json({ ok: true, simulated: true });
        }
        return res.status(500).json({ ok: false, error: 'Email transport not configured' });
      }

      const subject = `Portfolio contact from ${data.name}`;
      const text = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
      await transport.sendMail({ from, to, subject, text });
      res.json({ ok: true });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ ok: false, error: err.errors.map((e) => e.message).join(', ') });
      }
      res.status(500).json({ ok: false, error: 'Unexpected error' });
    }
  });

  app.get('/api/projects', (_req, res) => {
    try {
      const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
      const projects = JSON.parse(raw);
      res.set('Cache-Control', 'public, max-age=60');
      res.json({ projects });
    } catch (e) {
      res.status(500).json({ ok: false, error: 'Unable to load projects' });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  app.get('/api/ping', (_req, res) => {
    res.status(200).send('ok');
  });

  app.get('/sitemap.xml', (_req, res) => {
    const base = SITE_URL || '';
    const urls = ['/', '/projects'];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (u) => `  <url>\n    <loc>${base}${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  });

  app.get('/robots.txt', (_req, res) => {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${(SITE_URL || '')}/sitemap.xml\n`;
    res.type('text/plain').send(robots);
  });

  app.use((req, res, next) => {
    if (req.originalUrl === '/projects/') {
      return res.redirect(IS_PROD ? 301 : 302, '/projects');
    }
    next();
  });

  app.get('/projects', (req, res, next) => {
    const viewPath = path.join(PORTFOLIO_DIR, 'views', 'projects.ejs');
    if (fs.existsSync(viewPath)) {
      try {
        let projects: any[] = [];
        try {
          const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
          projects = JSON.parse(raw);
        } catch {}
        return res.render('projects', { projects });
      } catch (e) {
        return next(e);
      }
    }
    next();
  });

  app.get('/projects.html', (_req, res) => {
    res.redirect(IS_PROD ? 301 : 302, '/projects');
  });

  app.get(['/', '/index.html'], (req, res, next) => {
    const viewPath = path.join(PORTFOLIO_DIR, 'views', 'index.ejs');
    if (fs.existsSync(viewPath)) {
      try {
        let projects: any[] = [];
        try {
          const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
          projects = JSON.parse(raw);
        } catch {}
        return res.render('index', { projects });
      } catch (e) {
        return next(e);
      }
    }
    next();
  });

  app.use(express.static(PORTFOLIO_DIR, { redirect: false }));

  return app;
}

// Provide a default export so environments that look for a default handler/server
// (like Vercel's Node.js Server runtime) can import this module directly.
export default createApp();
