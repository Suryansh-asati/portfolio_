Full‑stack portfolio on Vercel using Express (serverless function) serving EJS views, static assets, and JSON APIs.

## Local development

```powershell
npm install
npx vercel dev
```

Then open http://localhost:3000

## Deploy to Vercel

```powershell
npm install
npx vercel --prod
```

Vercel will use `vercel.json` to route all traffic through `api/index.ts`.

## Environment variables (optional)

- SITE_URL: Public site URL (e.g. https://your-domain.vercel.app)
- FRONTEND_URL: Allowed CORS origin for API calls
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS: Enable contact form email sending
- EMAIL_FROM, EMAIL_TO: From/to addresses for contact email

## Project layout

- `api/index.ts`: Serverless Express app
- `portfolio/`: Static site files, EJS views, assets, and `data/projects.json`
- `vercel.json`: Rewrites and function includeFiles

## Notes

- The function serves EJS views from `portfolio/views` and static files from `portfolio/`.
- APIs: `/api/projects`, `/api/contact`, `/api/health`.
