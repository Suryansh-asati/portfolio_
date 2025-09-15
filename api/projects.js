const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(raw);
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ projects }));
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Unable to load projects' });
  }
};
