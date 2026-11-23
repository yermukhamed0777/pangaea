# PANGAEA

**Know what you're buying.**

PANGAEA is an independent shopping-intelligence prototype. It reads what buyers actually wrote, flags manipulated review patterns, and compares the true cost of the same product across shops.

- Editorial, light interface — paper, ink, acid lime, coral
- Next.js 16 static export, deployed to GitHub Pages
- No API keys or credentials in this repository
- Local site is available at `http://127.0.0.1:3004/pangaea/`

## Run locally

```
npm install
npm run dev
```

Then open `http://localhost:3000/pangaea/`.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages.
