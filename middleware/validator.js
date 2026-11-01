/**
 * Server-Side Validation Middleware
 * Enforces business logic, regex patterns, temporal constraints, and range checks on the server.
 */

export const APPROVED_COURSES = [
  'B.Tech Computer Engineering',
  'B.Tech Information Technology',
  'B.Tech Artificial Intelligence & Data Science',
  'B.Tech Electronics & Telecommunication',
  'B.Tech Mechanical Engineering'
];

export const validateEnrollment = (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    course,
    semester,
    percentage,
    nationalId,
    city,
    statementOfPurpose,
    agreement
  } = req.body;

  const errors = {};

  // 1. Full Name Validation
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.fullName = 'Full legal name is required.';
  } else {
    const trimmed = fullName.trim();
    if (trimmed.length < 3) {
      errors.fullName = 'Name must be at least 3 characters long.';
    } else if (trimmed.length > 50) {
      errors.fullName = 'Name cannot exceed 50 characters.';
    } else if (!/^[A-Za-z]+([ A-Za-z.'-]+)*$/.test(trimmed)) {
      errors.fullName = 'Name must contain alphabetic characters, spaces, dots or hyphens only.';
    }
  }

  // 2. Email Validation
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email address (e.g. student@mitaoe.ac.in).';
    } else if (trimmedEmail.endsWith('@gmai.com') || trimmedEmail.endsWith('@yaho.com')) {
      errors.email = 'Common domain typo detected. Please verify your email domain.';
    }
  }

  // 3. Mobile Number Validation
  if (!phone || typeof phone !== 'string') {
    errors.phone = '10-digit mobile number is required.';
  } else {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^\d+$/.test(cleanPhone)) {
      errors.phone = 'Mobile number must contain digits only.';
    } else if (cleanPhone.length !== 10) {
      errors.phone = `Mobile number must be exactly 10 digits (received ${cleanPhone.length}).`;
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Mobile number must begin with standard telecom prefixes 6, 7, 8, or 9.';
    }
  }

  // 4. Date of Birth & Temporal Age Validation (Age >= 18)
  if (!dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      errors.dob = 'Invalid date format provided for date of birth.';
    } else {
      const today = new Date();
      if (birthDate > today) {
        errors.dob = 'Date of birth cannot be in the future.';
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          errors.dob = `Candidate must be at least 18 years of age (computed age: ${age} years).`;
        } else if (age > 100) {
          errors.dob = 'Please provide a realistic date of birth.';
        } else {
          // Attach computed age to request body for record storage
          req.body.age = age;
        }
      }
    }
  }

  // 5. Gender Identification
  const validGenders = ['Male', 'Female', 'Non-Binary', 'Other'];
  if (!gender || !validGenders.includes(gender)) {
    errors.gender = 'Please select a valid gender option.';
  }

  // 6. Course Program Whitelist
  if (!course || !APPROVED_COURSES.includes(course)) {
    errors.course = 'Please select an approved academic course program.';
  }

  // 7. Semester (1 to 8)
  const semNum = parseInt(semester, 10);
  if (isNaN(semNum) || semNum < 1 || semNum > 8) {
    errors.semester = 'Semester must be an integer between 1 and 8.';
  } else {
    req.body.semester = semNum;
  }

  // 8. Qualifying Percentage (40.0 to 100.0)
  const pctNum = parseFloat(percentage);
  if (isNaN(pctNum) || pctNum < 40.0 || pctNum > 100.0) {
    errors.percentage = 'Qualifying percentage must be between 40.0% and 100.0%.';
  } else {
    req.body.percentage = Number(pctNum.toFixed(2));
  }

  // 9. National Identification (12-digit Aadhaar pattern)
  if (!nationalId || typeof nationalId !== 'string') {
    errors.nationalId = '12-digit National Identification (Aadhaar / Gov ID) is required.';
  } else {
    const cleanId = nationalId.replace(/[\s-]/g, '');
    if (!/^\d{12}$/.test(cleanId)) {
      errors.nationalId = 'National ID must consist of exactly 12 numeric digits.';
    } else {
      req.body.nationalId = cleanId;
    }
  }

  // 10. City / Domicile
  if (!city || typeof city !== 'string' || city.trim().length < 3) {
    errors.city = 'City / Location must contain at least 3 characters.';
  }

  // 11. Statement of Purpose (30 to 500 characters)
  if (!statementOfPurpose || typeof statementOfPurpose !== 'string') {
    errors.statementOfPurpose = 'Statement of purpose / motivation is required.';
  } else {
    const len = statementOfPurpose.trim().length;
    if (len < 30) {
      errors.statementOfPurpose = `Statement of purpose is too short (${len}/30 characters minimum).`;
    } else if (len > 500) {
      errors.statementOfPurpose = `Statement of purpose exceeds the maximum limit (${len}/500 characters).`;
    }
  }

  // 12. Terms & Declaration Agreement
  if (agreement !== true && agreement !== 'true' && agreement !== 'on') {
    errors.agreement = 'You must accept the admission declaration and code of conduct.';
  }

  // Check validation outcome
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Server-side validation failed. Please correct the highlighted errors.',
      errorCount: Object.keys(errors).length,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  next();
};
