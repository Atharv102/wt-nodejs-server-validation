/**
 * Automated Server-Side Validation Test Suite
 * Executes 18 comprehensive test scenarios against the Node.js Express server.
 */

process.env.NODE_ENV = 'test';

import app from '../server.js';
import http from 'http';

let server;
let baseUrl;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const VALID_CANDIDATE = {
  fullName: 'Atharv Jadhav',
  email: 'atharv.jadhav@mitaoe.ac.in',
  phone: '9876543210',
  dob: '2004-05-12',
  gender: 'Male',
  course: 'B.Tech Computer Engineering',
  semester: 6,
  percentage: 89.4,
  nationalId: '123456789012',
  city: 'Pune',
  statementOfPurpose: 'Eager to pursue scalable distributed systems and cloud native architectures in Node.js.',
  agreement: true
};

async function runTests() {
  // Start server on dynamic port for isolated testing
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;

  console.log('===============================================================');
  console.log(`  EduEnroll Node.js Server Test Runner (Listening on :${port})`);
  console.log('===============================================================\n');

  try {
    // 1. GET /api/courses
    console.log('[1] GET /api/courses Endpoint:');
    const coursesRes = await request('/api/courses');
    assert(coursesRes.status === 200, 'Returns HTTP 200 OK');
    assert(Array.isArray(coursesRes.data.courses) && coursesRes.data.courses.length >= 5, 'Returns list of approved courses');

    // 2. GET /api/enrollments
    console.log('\n[2] GET /api/enrollments Endpoint:');
    const listRes = await request('/api/enrollments');
    assert(listRes.status === 200, 'Returns HTTP 200 OK');
    assert(Array.isArray(listRes.data.data) && listRes.data.count >= 2, 'Returns seed enrollment records');

    // 3. POST /api/enroll - Valid Candidate Submission (201 Created)
    console.log('\n[3] POST /api/enroll - Valid Candidate:');
    const validPost = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify(VALID_CANDIDATE)
    });
    assert(validPost.status === 201, 'Responds with HTTP 201 Created on valid input');
    assert(validPost.data.success === true, 'Response contains success: true');
    assert(validPost.data.data.id.startsWith('ENR-2026-'), 'Server generates unique ENR-2026-XXXX ID');

    // 4. POST /api/enroll - Empty Payload (400 Bad Request)
    console.log('\n[4] POST /api/enroll - Empty Payload Rejection:');
    const emptyPost = await request('/api/enroll', { method: 'POST', body: JSON.stringify({}) });
    assert(emptyPost.status === 400, 'Responds with HTTP 400 Bad Request for empty input');
    assert(emptyPost.data.success === false, 'success is false');
    assert(Object.keys(emptyPost.data.errors).length >= 8, 'Flags multiple missing required fields');

    // 5. Full Name Validations
    console.log('\n[5] Server-Side Name Validation:');
    const shortName = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, fullName: 'Al' })
    });
    assert(shortName.status === 400 && shortName.data.errors.fullName, 'Rejects name < 3 characters');

    const numName = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, fullName: 'Atharv123' })
    });
    assert(numName.status === 400 && numName.data.errors.fullName, 'Rejects name containing numeric characters');

    // 6. Email Validations
    console.log('\n[6] Server-Side Email Validation:');
    const badEmail = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, email: 'not-an-email' })
    });
    assert(badEmail.status === 400 && badEmail.data.errors.email, 'Rejects malformed email string');

    const typoEmail = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, email: 'user@gmai.com' })
    });
    assert(typoEmail.status === 400 && typoEmail.data.errors.email.includes('typo'), 'Flags common email domain typo (@gmai.com)');

    // 7. Mobile Phone Validations
    console.log('\n[7] Server-Side Mobile Phone Validation:');
    const shortPhone = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, phone: '98765' })
    });
    assert(shortPhone.status === 400 && shortPhone.data.errors.phone, 'Rejects mobile number shorter than 10 digits');

    const invalidPrefix = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, phone: '1234567890' })
    });
    assert(invalidPrefix.status === 400 && invalidPrefix.data.errors.phone, 'Rejects invalid telecom prefix starting with 1');

    // 8. Temporal Age Constraint (Age >= 18)
    console.log('\n[8] Server-Side Age & Date of Birth Validation:');
    const minorDob = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, dob: '2020-05-10' })
    });
    assert(minorDob.status === 400 && minorDob.data.errors.dob.includes('18'), 'Server rejects minor candidate under 18 years');

    const futureDob = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, dob: '2030-01-01' })
    });
    assert(futureDob.status === 400 && futureDob.data.errors.dob.includes('future'), 'Server rejects future birth date');

    // 9. Academic Course Whitelist
    console.log('\n[9] Course Program Whitelist Validation:');
    const invalidCourse = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, course: 'Invalid Unapproved Course' })
    });
    assert(invalidCourse.status === 400 && invalidCourse.data.errors.course, 'Rejects non-whitelisted course program');

    // 10. Semester Range (1 to 8)
    console.log('\n[10] Semester Range Validation:');
    const badSem = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, semester: 10 })
    });
    assert(badSem.status === 400 && badSem.data.errors.semester, 'Rejects semester out of range (10 > 8)');

    // 11. Qualifying Percentage Range (40.0% to 100.0%)
    console.log('\n[11] Percentage Boundary Validation:');
    const lowPct = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, percentage: 32.5 })
    });
    assert(lowPct.status === 400 && lowPct.data.errors.percentage, 'Rejects percentage below minimum criteria (< 40.0%)');

    // 12. National ID (12-Digit Pattern)
    console.log('\n[12] National ID / Aadhaar Validation:');
    const badId = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, nationalId: '12345' })
    });
    assert(badId.status === 400 && badId.data.errors.nationalId, 'Rejects ID not matching 12-digit numeric pattern');

    // 13. Statement of Purpose (30 to 500 characters)
    console.log('\n[13] Statement of Purpose Boundary Validation:');
    const shortSop = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, statementOfPurpose: 'Too short' })
    });
    assert(shortSop.status === 400 && shortSop.data.errors.statementOfPurpose, 'Rejects statement of purpose shorter than 30 characters');

    // 14. Declaration Checkbox Agreement
    console.log('\n[14] Declaration Agreement Validation:');
    const noAgree = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ ...VALID_CANDIDATE, agreement: false })
    });
    assert(noAgree.status === 400 && noAgree.data.errors.agreement, 'Rejects submission without terms declaration agreement');

    // 15. Input Sanitization (XSS Stripping)
    console.log('\n[15] XSS Sanitization Defense:');
    const xssPost = await request('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({
        ...VALID_CANDIDATE,
        fullName: 'Dr. Jane <b>Noble</b> Doe',
        city: '<i>Mumbai</i>'
      })
    });
    assert(xssPost.status === 201, 'Accepts sanitized payload (201 Created)');
    assert(xssPost.data.data.fullName === 'Dr. Jane Noble Doe', 'HTML bold tags stripped from name');
    assert(xssPost.data.data.city === 'Mumbai', 'HTML italic tags stripped from city');

    // 16. DELETE /api/enrollments/:id
    console.log('\n[16] DELETE /api/enrollments/:id Endpoint:');
    const createdId = validPost.data.data.id;
    const delRes = await request(`/api/enrollments/${createdId}`, { method: 'DELETE' });
    assert(delRes.status === 200, 'Successfully deletes enrollment (HTTP 200 OK)');
    assert(delRes.data.deletedRecord.id === createdId, 'Returns deleted record details');

    // 17. GET /api/stats
    console.log('\n[17] GET /api/stats Analytics Endpoint:');
    const statsRes = await request('/api/stats');
    assert(statsRes.status === 200, 'Returns HTTP 200 OK');
    assert(statsRes.data.nodeVersion.startsWith('v'), 'Returns current Node.js runtime version');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n===============================================================');
    console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
    console.log('===============================================================');
    if (failed > 0) process.exit(1);
  }
}

runTests();
