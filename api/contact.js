const nodemailer = require('nodemailer');
const { z } = require('zod');

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
  _hp: z.string().optional()
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

async function readJson(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const body = await readJson(req);
    const data = ContactSchema.parse(body || {});
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
};
