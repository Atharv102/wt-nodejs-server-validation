/**
 * In-Memory Academic Enrollment Store
 * Simulates a database repository with initial seed data and CRUD operations.
 */

class EnrollmentStore {
  constructor() {
    this.enrollments = [
      {
        id: 'ENR-2026-1001',
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@mitaoe.ac.in',
        phone: '9876543210',
        dob: '2004-06-15',
        age: 21,
        gender: 'Male',
        course: 'B.Tech Computer Engineering',
        semester: 6,
        percentage: 88.5,
        nationalId: '987612345678',
        city: 'Pune',
        statementOfPurpose: 'Eager to pursue advanced full-stack systems and cloud architectural patterns.',
        agreement: true,
        submittedAt: '2026-10-30T10:15:00.000Z',
        status: 'Approved'
      },
      {
        id: 'ENR-2026-1002',
        fullName: 'Pooja Kulkarni',
        email: 'pooja.kulkarni@mitaoe.ac.in',
        phone: '8765432109',
        dob: '2003-11-20',
        age: 22,
        gender: 'Female',
        course: 'B.Tech Artificial Intelligence & Data Science',
        semester: 6,
        percentage: 91.2,
        nationalId: '876512345678',
        city: 'Mumbai',
        statementOfPurpose: 'Interested in applied machine learning algorithms and neural network design.',
        agreement: true,
        submittedAt: '2026-10-30T14:30:00.000Z',
        status: 'Approved'
      }
    ];
  }

  getAll() {
    return this.enrollments;
  }

  getById(id) {
    return this.enrollments.find((e) => e.id === id);
  }

  add(record) {
    const newRecord = {
      ...record,
      id: `ENR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      status: 'Approved'
    };
    this.enrollments.unshift(newRecord);
    return newRecord;
  }

  delete(id) {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index !== -1) {
      const removed = this.enrollments.splice(index, 1)[0];
      return removed;
    }
    return null;
  }

  clear() {
    this.enrollments = [];
  }
}

export const store = new EnrollmentStore();
