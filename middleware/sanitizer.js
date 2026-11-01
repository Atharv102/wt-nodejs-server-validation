/**
 * Input Sanitization Middleware
 * Protects against XSS injection, normalizes whitespaces, and sanitizes input data.
 */

export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const cleanBody = {};

    for (const [key, val] of Object.entries(req.body)) {
      if (typeof val === 'string') {
        // Strip HTML tags to eliminate XSS payloads
        let sanitized = val.replace(/<[^>]*>?/gm, '').trim();

        // Lowercase emails
        if (key === 'email') {
          sanitized = sanitized.toLowerCase();
        }

        cleanBody[key] = sanitized;
      } else {
        cleanBody[key] = val;
      }
    }

    req.body = cleanBody;
  }
  next();
};
