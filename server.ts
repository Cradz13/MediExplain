/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Local / self-hosted entry point.
 *
 * All the API routes live in `api/_app.ts` so that the exact same Express app
 * is served here (long-running Node process) and on Vercel (serverless
 * function via `api/index.ts`). This file only adds the frontend layer:
 * Vite middleware in development, static `dist/` files in production.
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import app from './api/_app';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediExplain AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
