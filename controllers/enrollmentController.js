/**
 * Enrollment Controller
 * Handles incoming HTTP requests and structures HTTP responses with standard status codes.
 */

import { store } from '../models/enrollmentStore.js';
import { APPROVED_COURSES } from '../middleware/validator.js';

export const getCourses = (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    count: APPROVED_COURSES.length,
    courses: APPROVED_COURSES
  });
};

export const getEnrollments = (req, res) => {
  const { course, search } = req.query;
  let records = store.getAll();

  if (course && course !== 'all') {
    records = records.filter((r) => r.course === course);
  }

  if (search) {
    const q = search.toLowerCase();
    records = records.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    status: 200,
    count: records.length,
    data: records,
    timestamp: new Date().toISOString()
  });
};

export const getEnrollmentById = (req, res) => {
  const { id } = req.params;
  const record = store.getById(id);

  if (!record) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: `Enrollment record '${id}' not found on server.`
    });
  }

  res.status(200).json({
    success: true,
    status: 200,
    data: record
  });
};

export const createEnrollment = (req, res) => {
  // Input has been sanitized and validated by middleware
  const newRecord = store.add(req.body);

  res.status(201).json({
    success: true,
    status: 201,
    message: 'Candidate application successfully validated and enrolled on server.',
    enrollmentId: newRecord.id,
    data: newRecord,
    timestamp: new Date().toISOString()
  });
};

export const deleteEnrollment = (req, res) => {
  const { id } = req.params;
  const deleted = store.delete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: `Record '${id}' not found.`
    });
  }

  res.status(200).json({
    success: true,
    status: 200,
    message: `Record '${id}' successfully removed from server database.`,
    deletedRecord: deleted
  });
};

export const getStats = (req, res) => {
  const records = store.getAll();
  const total = records.length;
  const avgPercentage = total > 0
    ? Number((records.reduce((acc, r) => acc + r.percentage, 0) / total).toFixed(1))
    : 0;

  res.status(200).json({
    success: true,
    status: 200,
    totalApplications: total,
    averagePercentage: avgPercentage,
    serverUptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
};
