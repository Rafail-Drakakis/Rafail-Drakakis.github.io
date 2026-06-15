# Rafail Drakakis — Portfolio

Personal portfolio site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages.

**Live site:** https://rafail-drakakis.github.io/

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
npm run preview
```

## Deploy

Push to the `main` branch. GitHub Actions builds and deploys automatically via `.github/workflows/deploy.yml`.

Ensure **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**.

## Project structure

- `src/data/` — site content (experience, projects, skills)
- `src/components/` — Astro UI components
- `src/pages/index.astro` — single-page layout
- `public/CV.pdf` — downloadable CV
