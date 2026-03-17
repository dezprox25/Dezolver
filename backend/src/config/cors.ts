import { CorsOptions } from 'cors';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Allowed Origins
// ---------------------------------------------------------------------------
// Reads FRONTEND_URL from the environment (set in render.yaml).
// Supports a comma-separated list for multiple origins, e.g.:
//   FRONTEND_URL=https://dezolver-frontend.onrender.com,https://staging.dezolver.com
//
// Falls back to localhost dev ports when the variable is not set so that
// local development works without any extra configuration.
// ---------------------------------------------------------------------------

const buildAllowedOrigins = (): string[] => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, '')); // trim whitespace + trailing slash
  }

  // Development fallback — covers Vite default ports and common variants
  return [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];
};

// Evaluated once at module load — visible in Render boot logs
export const allowedOrigins: string[] = buildAllowedOrigins();

logger.info(`[CORS] Allowed origins (${allowedOrigins.length}): ${allowedOrigins.join(' | ')}`);

// ---------------------------------------------------------------------------
// CORS Options
// ---------------------------------------------------------------------------

export const corsOptions: CorsOptions = {
  // ── Origin validation ────────────────────────────────────────────────────
  origin: (incomingOrigin, callback) => {
    // Allow server-to-server calls, Postman, curl, and mobile apps that
    // do not send an Origin header.
    if (!incomingOrigin) {
      return callback(null, true);
    }

    // Normalize: strip trailing slash so
    //   "https://dezolver-frontend.onrender.com/"  ===
    //   "https://dezolver-frontend.onrender.com"
    const normalizedOrigin = incomingOrigin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Log the blocked origin — shows up in Render logs for easy debugging
    logger.warn(`[CORS] Blocked request from unlisted origin: "${incomingOrigin}"`);
    return callback(new Error(`Origin "${incomingOrigin}" is not permitted by the CORS policy.`));
  },

  // ── Credentials ──────────────────────────────────────────────────────────
  // Must be true so the browser sends cookies and Authorization headers.
  // When credentials: true the origin header CANNOT be the wildcard "*" —
  // the explicit origin check above satisfies that requirement.
  credentials: true,

  // ── Allowed methods ──────────────────────────────────────────────────────
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // ── Allowed request headers ──────────────────────────────────────────────
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-CSRF-Token'
  ],

  // ── Headers the browser JS is allowed to read from the response ──────────
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],

  // ── Preflight cache ──────────────────────────────────────────────────────
  // Tell the browser to cache the preflight response for 24 hours so it
  // does not fire an OPTIONS request before every single API call.
  maxAge: 86_400,

  // ── Preflight response status ────────────────────────────────────────────
  // 204 (No Content) is the correct status for a successful OPTIONS preflight.
  // Some older browsers/proxies mishandle 200 for preflight — 204 is safer.
  optionsSuccessStatus: 204,

  // ── Preflight pass-through ───────────────────────────────────────────────
  // false → cors() responds to OPTIONS itself and does not call next().
  // This prevents downstream middleware from also trying to handle preflight.
  preflightContinue: false
};
