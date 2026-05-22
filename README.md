# DevPulse Explorer

## Overview
DevPulse Explorer is a production-style frontend assessment project that aggregates npm package metadata and weekly download analytics into a clean reviewer-friendly interface.
Check it Live deployed: https://newspulse-ecru.vercel.app/

## Features
- Debounced package search
- Request caching
- Timeout-safe fetch wrapper
- Graceful error handling
- Responsive UI
- Lightweight architecture
- Vercel-ready deployment
- Manual GitHub upload compatibility

## Stack
- React
- TypeScript
- Vite
- TailwindCSS
- Vitest

## Local Setup
1. Install Node.js 20+
2. Extract the project zip
3. Run:
   - npm install
   - npm run dev

## Build
npm run build

## Testing
npm run test

# MANUAL GITHUB UPLOAD GUIDE

1. Go to github.com
2. Click New Repository
3. Name repository: devpulse-explorer
4. Click Create Repository
5. Click Upload Files
6. Drag entire extracted project folder contents
7. Wait for upload completion
8. Verify package.json appears in repository root
9. Commit changes

# VERCEL DEPLOYMENT GUIDE

1. Login to vercel.com
2. Click Add New Project
3. Import GitHub repository
4. Framework preset: Vite
5. Build command: npm run build
6. Output directory: dist
7. Click Deploy

## Troubleshooting
- Ensure package.json exists in repository root
- Ensure Node version >= 20
- Ensure all files uploaded completely
