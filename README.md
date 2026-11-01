# EduEnroll — Node.js Server-Side Validation & Student Admission Portal

> **Web Technology (WT) Lab — Practical No. 4**  
> **Topic:** Design, develop and deploy a web application to demonstrate server-side validation using NodeJS.  
> **GitHub Repository:** [https://github.com/Atharv102/wt-nodejs-server-validation](https://github.com/Atharv102/wt-nodejs-server-validation)  
> **Deployment Link:** [https://Atharv102.github.io/wt-nodejs-server-validation/](https://Atharv102.github.io/wt-nodejs-server-validation/)

---

## 📌 Executive Overview

**EduEnroll** is a modular, full-stack web application developed with **Node.js** and **Express**. It models an enterprise-grade academic admission portal engineered specifically to demonstrate strict **server-side validation**, HTTP request/response handling (`GET`, `POST`, `DELETE`), input sanitization (XSS defense), and RESTful API architecture.

---

## 🎯 Compliance with Practical 4 Instructions

| Requirement | Implementation in EduEnroll | Status |
| :--- | :--- | :---: |
| **1. Individual Web App using NodeJS** | Modular Node.js / Express application with separated routes, controllers, middleware, and models. | ✅ Completed |
| **2. Server-Side Validation** | Backend validation middleware (`middleware/validator.js`) enforcing regex patterns, age temporal constraints ($\ge 18$), percentage boundaries, and data types before processing. | ✅ Completed |
| **3. Handle GET / POST Requests** | Multiple HTTP verbs implemented: `GET /api/courses`, `GET /api/enrollments`, `POST /api/enroll`, `DELETE /api/enrollments/:id`, and `GET /api/stats`. | ✅ Completed |
| **4. Proper Success & Error Messages** | Meaningful HTTP status codes: `HTTP 201 Created` with enrollment receipt on valid input, and `HTTP 400 Bad Request` with structured field-level error messages on invalid input. | ✅ Completed |
| **5. NodeJS Concepts (Modules & Routing)** | Clean ES modules (`import`/`export`), Express routing (`routes/enrollmentRoutes.js`), middleware chaining (`sanitizer` $\rightarrow$ `validator` $\rightarrow$ `controller`), and static file serving. | ✅ Completed |
| **6. Test with Valid & Invalid Inputs** | Automated test suite (`test/server.test.js`) with 31 assertions covering edge cases, minor age rejection, domain typo flags, and boundary checks. | ✅ Completed |

---

## 📋 Server-Side Validation Matrix

| Field | Server-Side Validation Technique | Error Message Triggered | Success / Valid State |
| :--- | :--- | :--- | :--- |
| **Full Name** | Regex: `/^[A-Za-z]+([ A-Za-z.'-]+)*$/`, 3 to 50 chars | *"Name must contain alphabetic characters only"* / *"Min 3 chars"* | Sanitized legal name |
| **Email** | RFC 5322 regex + Domain typo heuristic (@gmai.com) | *"Please provide a valid email"* / *"Common domain typo detected"* | Lowercase normalized email |
| **Mobile Number** | Exact 10 digits starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`) | *"Mobile number must be 10 digits starting with 6, 7, 8, or 9"* | 10 valid telecom digits |
| **Date of Birth** | Server temporal math: Age = (Today - DOB) $\ge 18$; No future dates | *"Candidate must be at least 18 years of age"* / *"Cannot be in the future"* | Computed age recorded |
| **Gender** | Whitelist: `['Male', 'Female', 'Non-Binary', 'Other']` | *"Please select a valid gender option"* | Approved gender option |
| **Course** | Academic course program whitelist verification | *"Please select an approved academic course program"* | Valid degree course |
| **Semester** | Integer range: $1 \le \text{semester} \le 8$ | *"Semester must be an integer between 1 and 8"* | Valid academic semester |
| **Percentage** | Float range: $40.0\% \le \text{percentage} \le 100.0\%$ | *"Qualifying percentage must be between 40.0% and 100.0%"* | Verified percentage |
| **National ID** | Exact 12 numeric digits (`/^\d{12}$/`) | *"National ID must consist of exactly 12 numeric digits"* | Valid Aadhaar pattern |
| **City** | Trimmed string length $\ge 3$ characters | *"City / Location must contain at least 3 characters"* | Clean location string |
| **Statement** | String length range: 30 to 500 characters | *"Statement of purpose is too short (min 30 characters)"* | Approved statement |
| **Agreement** | Boolean truth check (`agreement === true`) | *"You must accept the admission declaration and terms"* | Legally acknowledged |

---

## 🛠️ REST API Endpoints

- `GET /api/courses`: Returns list of available academic degree programs.
- `GET /api/enrollments`: Returns list of all validated candidate records (supports `?course=` and `?search=` filters).
- `GET /api/enrollments/:id`: Returns single candidate application by ID.
- `POST /api/enroll`: Sanitizes and validates candidate application. Returns `201 Created` or `400 Bad Request`.
- `DELETE /api/enrollments/:id`: Removes candidate from server repository (`200 OK`).
- `GET /api/stats`: Returns analytics including application counts, average percentage, and server uptime.

---

## 🧪 Automated Server-Side Validation Tests

Run `npm test` to execute the automated test runner:

```text
===============================================================
  EduEnroll Node.js Server Test Runner (Listening on :54645)
===============================================================

[1] GET /api/courses Endpoint: 2/2 Passed
[2] GET /api/enrollments Endpoint: 2/2 Passed
[3] POST /api/enroll - Valid Candidate (201 Created): 3/3 Passed
[4] POST /api/enroll - Empty Payload Rejection (400 Bad Request): 3/3 Passed
[5] Server-Side Name Validation: 2/2 Passed
[6] Server-Side Email Validation: 2/2 Passed
[7] Server-Side Mobile Phone Validation: 2/2 Passed
[8] Server-Side Age & Date of Birth Validation: 2/2 Passed
[9] Course Program Whitelist Validation: 1/1 Passed
[10] Semester Range Validation: 1/1 Passed
[11] Percentage Boundary Validation: 1/1 Passed
[12] National ID / Aadhaar Validation: 1/1 Passed
[13] Statement of Purpose Boundary Validation: 1/1 Passed
[14] Declaration Agreement Validation: 1/1 Passed
[15] XSS Sanitization Defense: 3/3 Passed
[16] DELETE /api/enrollments/:id Endpoint: 2/2 Passed
[17] GET /api/stats Analytics Endpoint: 2/2 Passed

===============================================================
Test Execution Finished: 31 Passed, 0 Failed
===============================================================
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run automated server test suite
npm test

# 3. Start Node.js server
npm start
# Server runs at http://localhost:3000
```
