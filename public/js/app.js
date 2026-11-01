/**
 * EduEnroll - Frontend Client Application
 * Communicates with Node.js REST API endpoints (GET, POST, DELETE).
 * Includes seamless fallback simulator for GitHub Pages static deployments.
 */

// Global State
let allCourses = [];
let allEnrollments = [];
let isLocalServer = true;

// Sample Evaluation Personas
const SAMPLE_VALID = {
  fullName: 'Atharv Jadhav',
  email: 'atharv.jadhav@mitaoe.ac.in',
  phone: '9876543210',
  dob: '2004-05-12',
  gender: 'Male',
  course: 'B.Tech Computer Engineering',
  semester: '6',
  percentage: '89.4',
  nationalId: '123456789012',
  city: 'Pune',
  statementOfPurpose: 'Passionate computer engineering student eager to develop scalable Node.js distributed backends and REST architectures.',
  agreement: true
};

const SAMPLE_INVALID = {
  fullName: 'A1', // < 3 chars & contains digits
  email: 'bad-email@gmai.com', // domain typo
  phone: '12345', // < 10 digits & wrong prefix
  dob: '2020-05-10', // Minor (< 18 years)
  gender: '', // Required
  course: '', // Required
  semester: '9', // Out of bounds
  percentage: '105.5', // Out of bounds (> 100%)
  nationalId: '12345', // Not 12 digits
  city: 'Ab', // < 3 chars
  statementOfPurpose: 'Too short', // < 30 chars
  agreement: false // Must be accepted
};

// DOM Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const enrollmentForm = document.getElementById('enrollmentForm');
const courseSelect = document.getElementById('course');
const filterCourseSelect = document.getElementById('filterCourse');
const enrollmentsTableBody = document.getElementById('enrollmentsTableBody');
const searchInput = document.getElementById('searchInput');
const recordCountBadge = document.getElementById('recordCountBadge');
const sopTextarea = document.getElementById('statementOfPurpose');
const sopCounter = document.getElementById('sopCounter');
const responseAlert = document.getElementById('responseAlert');
const alertTitle = document.getElementById('alertTitle');
const alertCode = document.getElementById('alertCode');
const alertMessage = document.getElementById('alertMessage');
const alertErrorList = document.getElementById('alertErrorList');
const jsonRequest = document.getElementById('jsonRequest');
const jsonResponse = document.getElementById('jsonResponse');
const serverStatusText = document.getElementById('serverStatusText');

// 1. Theme Management
const savedTheme = localStorage.getItem('eduenroll_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('eduenroll_theme', next);
  themeToggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
});

// 2. Tab Navigation
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    tabButtons.forEach((b) => b.classList.remove('active'));
    tabPanes.forEach((p) => {
      p.style.display = 'none';
      p.classList.remove('active');
    });

    btn.classList.add('active');
    const pane = document.getElementById(targetTab);
    if (pane) {
      pane.style.display = 'block';
      pane.classList.add('active');
    }

    if (targetTab === 'tab-records') {
      fetchEnrollments();
    }
  });
});

// 3. Statement of Purpose Counter
sopTextarea.addEventListener('input', () => {
  const len = sopTextarea.value.trim().length;
  sopCounter.textContent = `${len} / 500 characters (min 30)`;
  if (len < 30) {
    sopCounter.style.color = 'var(--danger)';
  } else if (len > 500) {
    sopCounter.style.color = 'var(--danger)';
  } else {
    sopCounter.style.color = 'var(--success)';
  }
});

// 4. Fetch Courses (GET /api/courses)
async function fetchCourses() {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    allCourses = data.courses || [];
  } catch {
    // Fallback courses if running statically
    allCourses = [
      'B.Tech Computer Engineering',
      'B.Tech Information Technology',
      'B.Tech Artificial Intelligence & Data Science',
      'B.Tech Electronics & Telecommunication',
      'B.Tech Mechanical Engineering'
    ];
    isLocalServer = false;
    serverStatusText.textContent = 'Demo Mode (Client API Active)';
  }

  // Populate form dropdown
  courseSelect.innerHTML = '<option value="">-- Select Degree Course Program --</option>';
  allCourses.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    courseSelect.appendChild(opt);
  });

  // Populate filter dropdown
  filterCourseSelect.innerHTML = '<option value="all">All Courses</option>';
  allCourses.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCourseSelect.appendChild(opt);
  });
}

// 5. Fetch Enrollments (GET /api/enrollments)
async function fetchEnrollments() {
  try {
    const res = await fetch('/api/enrollments');
    if (!res.ok) throw new Error('Failed to fetch records');
    const data = await res.json();
    allEnrollments = data.data || [];
  } catch {
    if (!localStorage.getItem('eduenroll_local_data')) {
      // Seed fallback
      allEnrollments = [
        {
          id: 'ENR-2026-1001',
          fullName: 'Aarav Sharma',
          email: 'aarav.sharma@mitaoe.ac.in',
          phone: '9876543210',
          course: 'B.Tech Computer Engineering',
          semester: 6,
          percentage: 88.5,
          status: 'Approved'
        },
        {
          id: 'ENR-2026-1002',
          fullName: 'Pooja Kulkarni',
          email: 'pooja.kulkarni@mitaoe.ac.in',
          phone: '8765432109',
          course: 'B.Tech Artificial Intelligence & Data Science',
          semester: 6,
          percentage: 91.2,
          status: 'Approved'
        }
      ];
      localStorage.setItem('eduenroll_local_data', JSON.stringify(allEnrollments));
    } else {
      allEnrollments = JSON.parse(localStorage.getItem('eduenroll_local_data'));
    }
  }

  renderEnrollmentsTable();
}

function renderEnrollmentsTable() {
  const q = searchInput.value.toLowerCase();
  const selectedCourse = filterCourseSelect.value;

  const filtered = allEnrollments.filter((r) => {
    const matchSearch =
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);

    const matchCourse = selectedCourse === 'all' || r.course === selectedCourse;

    return matchSearch && matchCourse;
  });

  recordCountBadge.textContent = allEnrollments.length;

  if (filtered.length === 0) {
    enrollmentsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No candidates found matching current filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  enrollmentsTableBody.innerHTML = filtered
    .map(
      (r) => `
    <tr>
      <td><code>${r.id}</code></td>
      <td><strong>${r.fullName}</strong></td>
      <td>
        <div>${r.email}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${r.phone}</div>
      </td>
      <td><span class="badge-pill">${r.course}</span></td>
      <td>Sem ${r.semester}</td>
      <td><strong>${r.percentage}%</strong></td>
      <td><span style="color: var(--success); font-weight: 600;">✓ ${r.status || 'Approved'}</span></td>
      <td>
        <button type="button" class="btn-del" onclick="handleDeleteEnrollment('${r.id}')">Delete</button>
      </td>
    </tr>
  `
    )
    .join('');
}

searchInput.addEventListener('input', renderEnrollmentsTable);
filterCourseSelect.addEventListener('change', renderEnrollmentsTable);
document.getElementById('btnRefreshList').addEventListener('click', fetchEnrollments);

// 6. Delete Candidate
window.handleDeleteEnrollment = async function (id) {
  if (!confirm(`Are you sure you want to remove enrollment record '${id}' from the server?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/enrollments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed on server');
  } catch {
    allEnrollments = allEnrollments.filter((r) => r.id !== id);
    localStorage.setItem('eduenroll_local_data', JSON.stringify(allEnrollments));
  }

  fetchEnrollments();
};

// 7. Form Submission (POST /api/enroll)
enrollmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value,
    course: document.getElementById('course').value,
    semester: document.getElementById('semester').value,
    percentage: document.getElementById('percentage').value,
    nationalId: document.getElementById('nationalId').value,
    city: document.getElementById('city').value,
    statementOfPurpose: document.getElementById('statementOfPurpose').value,
    agreement: document.getElementById('agreement').checked
  };

  jsonRequest.textContent = JSON.stringify(formData, null, 2);

  try {
    let status;
    let resData;

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      status = res.status;
      resData = await res.json();
    } catch {
      // Local fallback server validation simulator if server is offline/static
      const sim = simulateServerValidation(formData);
      status = sim.status;
      resData = sim.data;
    }

    jsonResponse.textContent = JSON.stringify(resData, null, 2);

    if (status === 201) {
      showSuccessBanner(resData);
      enrollmentForm.reset();
      sopCounter.textContent = '0 / 500 characters (min 30)';
      fetchEnrollments();
    } else {
      showErrorBanner(resData);
    }
  } catch (err) {
    console.error('Submission error:', err);
  }
});

function clearErrors() {
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((el) => {
    el.classList.remove('error');
  });
  document.querySelectorAll('.field-error-msg').forEach((el) => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  responseAlert.style.display = 'none';
  responseAlert.className = 'response-alert';
}

function showErrorBanner(resData) {
  responseAlert.className = 'response-alert danger';
  responseAlert.style.display = 'block';

  alertTitle.textContent = 'Server-Side Validation Failed';
  alertCode.textContent = `HTTP ${resData.status || 400} Bad Request`;
  alertMessage.textContent = resData.message || 'Please correct the server validation errors below.';

  alertErrorList.innerHTML = '';
  if (resData.errors) {
    alertErrorList.style.display = 'block';

    for (const [field, msg] of Object.entries(resData.errors)) {
      const inputEl = document.getElementById(field);
      if (inputEl) {
        inputEl.classList.add('error');
      }

      const errEl = document.getElementById(`err_${field}`);
      if (errEl) {
        errEl.textContent = `⚠️ ${msg}`;
        errEl.classList.add('visible');
      }

      const li = document.createElement('li');
      li.textContent = `${field}: ${msg}`;
      alertErrorList.appendChild(li);
    }
  }

  responseAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showSuccessBanner(resData) {
  responseAlert.className = 'response-alert success';
  responseAlert.style.display = 'block';

  alertTitle.textContent = 'Server Validation Passed & Enrolled!';
  alertCode.textContent = `HTTP ${resData.status || 201} Created`;
  alertMessage.textContent = `${resData.message} [Generated ID: ${resData.enrollmentId || resData.data.id}]`;
  alertErrorList.style.display = 'none';

  responseAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 8. Quick Fill Testing Handlers
document.getElementById('btnFillValid').addEventListener('click', () => {
  clearErrors();
  populateForm(SAMPLE_VALID);
  sopCounter.textContent = `${SAMPLE_VALID.statementOfPurpose.length} / 500 characters (min 30)`;
  sopCounter.style.color = 'var(--success)';
});

document.getElementById('btnFillInvalid').addEventListener('click', () => {
  clearErrors();
  populateForm(SAMPLE_INVALID);
  sopCounter.textContent = `${SAMPLE_INVALID.statementOfPurpose.length} / 500 characters (min 30)`;
  sopCounter.style.color = 'var(--danger)';
});

document.getElementById('btnClearForm').addEventListener('click', () => {
  clearErrors();
  enrollmentForm.reset();
  sopCounter.textContent = '0 / 500 characters (min 30)';
});

function populateForm(data) {
  document.getElementById('fullName').value = data.fullName;
  document.getElementById('email').value = data.email;
  document.getElementById('phone').value = data.phone;
  document.getElementById('dob').value = data.dob;
  document.getElementById('gender').value = data.gender;
  document.getElementById('course').value = data.course;
  document.getElementById('semester').value = data.semester;
  document.getElementById('percentage').value = data.percentage;
  document.getElementById('nationalId').value = data.nationalId;
  document.getElementById('city').value = data.city;
  document.getElementById('statementOfPurpose').value = data.statementOfPurpose;
  document.getElementById('agreement').checked = data.agreement;
}

// Client simulator fallback for static deployment environments
function simulateServerValidation(body) {
  const errors = {};

  if (!body.fullName || body.fullName.trim().length < 3) errors.fullName = 'Name must be at least 3 characters long.';
  if (body.fullName && !/^[A-Za-z]+([ A-Za-z.'-]+)*$/.test(body.fullName)) errors.fullName = 'Name must contain alphabetic letters only.';

  if (!body.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(body.email)) {
    errors.email = 'Valid email is required.';
  } else if (body.email.endsWith('@gmai.com')) {
    errors.email = 'Common domain typo detected. Please verify your email domain.';
  }

  if (!body.phone || !/^[6-9]\d{9}$/.test(body.phone)) errors.phone = '10-digit mobile number starting with 6-9 is required.';

  if (!body.dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const age = new Date().getFullYear() - new Date(body.dob).getFullYear();
    if (age < 18) errors.dob = `Candidate must be at least 18 years of age (computed age: ${age} years).`;
  }

  if (!body.gender) errors.gender = 'Gender selection is required.';
  if (!body.course) errors.course = 'Please select an approved course.';
  if (!body.semester || body.semester < 1 || body.semester > 8) errors.semester = 'Semester must be between 1 and 8.';
  if (!body.percentage || body.percentage < 40 || body.percentage > 100) errors.percentage = 'Percentage must be between 40.0% and 100.0%.';
  if (!body.nationalId || !/^\d{12}$/.test(body.nationalId)) errors.nationalId = 'National ID must consist of exactly 12 numeric digits.';
  if (!body.city || body.city.trim().length < 3) errors.city = 'City must be at least 3 characters long.';
  if (!body.statementOfPurpose || body.statementOfPurpose.trim().length < 30) errors.statementOfPurpose = 'Statement of purpose is too short (min 30 characters).';
  if (!body.agreement) errors.agreement = 'You must accept the admission declaration and terms.';

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      data: {
        success: false,
        status: 400,
        message: 'Server-side validation failed. Please correct the highlighted errors.',
        errorCount: Object.keys(errors).length,
        errors,
        timestamp: new Date().toISOString()
      }
    };
  }

  const newRec = {
    ...body,
    id: `ENR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Approved',
    submittedAt: new Date().toISOString()
  };

  allEnrollments.unshift(newRec);
  localStorage.setItem('eduenroll_local_data', JSON.stringify(allEnrollments));

  return {
    status: 201,
    data: {
      success: true,
      status: 201,
      message: 'Candidate application successfully validated and enrolled on server.',
      enrollmentId: newRec.id,
      data: newRec,
      timestamp: new Date().toISOString()
    }
  };
}

// Initialize on page load
fetchCourses();
fetchEnrollments();
