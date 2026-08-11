/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Vercel serverless entry point.
 *
 * Every `/api/*` request is rewritten to this file by `vercel.json`. The
 * Express app already declares the full `/api/...` paths, and Vercel hands the
 * original URL to the handler, so the routes match without any extra mounting.
 *
 * An Express app is itself a `(req, res)` function, which is exactly the
 * signature Vercel's Node runtime expects.
 */
import app from './_app';

export default app;
