# Senior Data Engineering Interview & Architecture Guide

A structured, technical interview-preparation and architecture platform for Data Engineers targeting 5–10 YOE senior roles.

## Getting Started

To install dependencies and start the development environment:

```bash
# Install dependencies using npm (do NOT use bun install)
npm install

# Start the local development server
npm run dev
```

## Build & Verification

```bash
# Production build
npm run build

# Run TypeScript type-checking locally
npm run typecheck

# Preview production build locally
npm run preview
```

## Deployment to Vercel

This repository is pre-configured for seamless deployment to Vercel:
- **Build Command:** `npm run build` (or `vite build`)
- **Install Command:** `npm install`
- **Output Directory:** `dist`
- **Node Version:** Node 20 (configured via `.nvmrc`)
- **SPA Rewrites:** Pre-configured in `vercel.json`
