/**
 * EduEnroll - Node.js Server-Side Validation Application
 * Web Technology Practical No. 4
 *
 * Demonstrates:
 * 1. Modular architecture (routes, controllers, middleware, models)
 * 2. HTTP GET / POST / DELETE request handling
 * 3. Server-side validation with status codes (201 Created vs 400 Bad Request)
 * 4. Input sanitization (XSS defense)
 * 5. Static asset serving and RESTful API architecture
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON and URL-encoded request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', enrollmentRoutes);

// Root route fallback to serve frontend SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `API endpoint '${req.originalUrl}' not found on server.`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start listening if run directly
if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'))) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  EduEnroll Server running at: http://localhost:${PORT}`);
    console.log(`  Node.js Version: ${process.version}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

export default app;
