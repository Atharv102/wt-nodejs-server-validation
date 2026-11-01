/**
 * Academic Enrollment Routing Module
 * Demonstrates modular Express routing, HTTP verb separation, and middleware chaining.
 */

import express from 'express';
import {
  getCourses,
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
  getStats
} from '../controllers/enrollmentController.js';

import { sanitizeInput } from '../middleware/sanitizer.js';
import { validateEnrollment } from '../middleware/validator.js';

const router = express.Router();

// GET routes
router.get('/courses', getCourses);
router.get('/enrollments', getEnrollments);
router.get('/enrollments/:id', getEnrollmentById);
router.get('/stats', getStats);

// POST route with server-side middleware chain
router.post('/enroll', sanitizeInput, validateEnrollment, createEnrollment);

// DELETE route
router.delete('/enrollments/:id', deleteEnrollment);

export default router;
