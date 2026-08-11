/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Vercel serverless entry point.
 *
 * `vercel.json` rewrites every `/api/*` request to this function, and the
 * Express app in `_app.ts` declares its routes with their full `/api/...`
 * paths. An Express app is itself a `(req, res)` handler, which is exactly the
 * signature Vercel's Node runtime expects.
 *
 * The `.js` extension on the import is deliberate: `package.json` sets
 * `"type": "module"`, so the compiled output is ESM and Node's ESM resolver
 * requires an explicit extension for relative imports. TypeScript maps the
 * `.js` specifier back to `_app.ts` at compile time.
 *
 * The `_` prefix on `_app.ts` keeps Vercel from treating it as its own route:
 * it is a shared module imported by both this function and the local
 * `server.ts`, not an endpoint.
 */
import type { IncomingMessage, ServerResponse } from 'http';

import app from './_app.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Depending on how the platform applies the rewrite, the function can be
  // invoked with the original path (`/api/health`) or with the destination
  // path (`/api/index`, sometimes carrying the real path in `x-forwarded-uri`
  // or the `?path=` query). Normalizing here means the Express routes match in
  // every case instead of silently falling through to a 404.
  const original =
    (req.headers['x-forwarded-uri'] as string | undefined) ??
    (req.headers['x-vercel-original-path'] as string | undefined);

  if (original && original.startsWith('/api/')) {
    req.url = original;
  } else if (req.url && !req.url.startsWith('/api/')) {
    // A bare path such as `/health` (prefix stripped by the platform).
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return (app as unknown as (rq: IncomingMessage, rs: ServerResponse) => void)(req, res);
}
