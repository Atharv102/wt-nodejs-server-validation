import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(student_name="Atharv Jadhav", prn="202401100102", division="B", output_filename="EduEnroll_WT_Practical_Report.pdf"):
    pdf_path = os.path.join(os.getcwd(), output_filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=60,
        rightMargin=60,
        topMargin=60,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()

    # Academic Typography matching reference PDF
    inst_style = ParagraphStyle(
        'InstTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=18,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=3
    )

    inst_sub = ParagraphStyle(
        'InstSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=30
    )

    subject_style = ParagraphStyle(
        'SubjectStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    prac_no_style = ParagraphStyle(
        'PracNoStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    prac_topic_style = ParagraphStyle(
        'PracTopicStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=1,
        textColor=colors.black,
        spaceAfter=60
    )

    project_label_style = ParagraphStyle(
        'ProjectLabel',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    project_title_style = ParagraphStyle(
        'ProjectTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        alignment=1,
        textColor=colors.black,
        spaceAfter=4
    )

    project_sub_style = ParagraphStyle(
        'ProjectSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=1,
        textColor=colors.black,
        spaceAfter=90
    )

    # Section headings
    sec_heading = ParagraphStyle(
        'SecHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=16,
        textColor=colors.black,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_text = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.black,
        spaceAfter=6
    )

    bullet_text = ParagraphStyle(
        'ReportBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.black,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    tbl_header = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.black
    )

    tbl_cell = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.black
    )

    fig_caption = ParagraphStyle(
        'FigCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        alignment=1, # Center
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=5,
        spaceAfter=15
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("MIT ACADEMY OF ENGINEERING", inst_style))
    story.append(Paragraph("ALANDI, PUNE", inst_sub))

    story.append(Spacer(1, 25))
    story.append(Paragraph("WEB TECHNOLOGY", subject_style))
    story.append(Paragraph("PRACTICAL NO. 4", prac_no_style))
    story.append(Paragraph("SERVER-SIDE VALIDATION USING NODEJS", prac_topic_style))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Project:", project_label_style))
    story.append(Paragraph("EDUENROLL", project_title_style))
    story.append(Paragraph("ONLINE STUDENT ADMISSION & ENROLLMENT PORTAL", project_sub_style))

    # Student metadata block
    meta_rows = [
        [Paragraph("<b>Student Name:</b>", body_text), Paragraph(student_name, body_text)],
        [Paragraph("<b>PRN:</b>", body_text), Paragraph(prn, body_text)],
        [Paragraph("<b>Branch:</b>", body_text), Paragraph("Software Engineering", body_text)],
        [Paragraph("<b>Division:</b>", body_text), Paragraph(division, body_text)],
    ]
    student_table = Table(meta_rows, colWidths=[2.2*inch, 4.2*inch])
    student_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(student_table)

    story.append(Spacer(1, 120))

    # Links at bottom of cover page (using Atharv102 account!)
    story.append(Paragraph("<b>GitHub Repository :</b> https://github.com/Atharv102/wt-nodejs-server-validation", body_text))
    story.append(Paragraph("<b>Deployment Link :</b> https://Atharv102.github.io/wt-nodejs-server-validation/", body_text))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: AIM, PROBLEM STATEMENT, OBJECTIVES, INTRODUCTION
    # =========================================================================
    story.append(Paragraph("1. AIM", sec_heading))
    story.append(Paragraph(
        "To design, develop and deploy a NodeJS web application named EduEnroll - Online Student Admission & "
        "Enrollment Portal, demonstrating server-side validation, HTTP GET and POST request handling, modular "
        "routing, request and response management, input sanitization, and data persistence.",
        body_text
    ))

    story.append(Paragraph("2. PROBLEM STATEMENT", sec_heading))
    story.append(Paragraph(
        "The practical requires an individual web application developed using NodeJS. The application must "
        "demonstrate server-side validation for user input, handle GET and POST requests appropriately, display "
        "proper success and error messages, use NodeJS concepts such as modules, routing, and request/response "
        "handling, and be thoroughly tested with valid and invalid inputs. The completed application must also be "
        "deployed and submitted through a public link.",
        body_text
    ))
    story.append(Paragraph(
        "EduEnroll addresses these requirements through an online academic admission system. A candidate submits "
        "personal, academic, and identification details to the server via an HTTP POST request. The Node.js backend "
        "intercepts the payload, sanitizes incoming strings to prevent cross-site scripting (XSS), and executes "
        "multi-factor validation. If invalid input is detected, the server returns an HTTP 400 Bad Request with structured "
        "field-level error messages. Valid inputs produce an HTTP 201 Created response with an assigned enrollment ID. "
        "Enrolled candidates are accessible via HTTP GET and persist in server memory and client storage.",
        body_text
    ))

    story.append(Paragraph("3. OBJECTIVES", sec_heading))
    story.append(Paragraph("&bull; Develop an individual NodeJS web application using a modular architecture.", bullet_text))
    story.append(Paragraph("&bull; Implement server-side validation middleware to verify all incoming request bodies before processing.", bullet_text))
    story.append(Paragraph("&bull; Handle HTTP GET requests for static views, degree courses, and candidate directories.", bullet_text))
    story.append(Paragraph("&bull; Handle HTTP POST requests for admission submissions with JSON and URL-encoded body parsing.", bullet_text))
    story.append(Paragraph("&bull; Return appropriate HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).", bullet_text))
    story.append(Paragraph("&bull; Validate name, email, 10-digit mobile number, date of birth (age &ge; 18), course, semester, percentage, and Aadhaar ID.", bullet_text))
    story.append(Paragraph("&bull; Implement input sanitization middleware to strip dangerous HTML tags and prevent XSS injection.", bullet_text))
    story.append(Paragraph("&bull; Display clear server response messages, status badges, and field-level error highlights.", bullet_text))
    story.append(Paragraph("&bull; Support candidate record deletion using the HTTP DELETE method.", bullet_text))
    story.append(Paragraph("&bull; Create a responsive, accessible user-friendly interface for desktop, tablet, and mobile screens.", bullet_text))
    story.append(Paragraph("&bull; Test the server with automated test assertions covering edge cases and boundary conditions.", bullet_text))
    story.append(Paragraph("&bull; Deploy and host the application repository under the Atharv102 GitHub account.", bullet_text))

    story.append(Paragraph("4. INTRODUCTION", sec_heading))
    story.append(Paragraph(
        "NodeJS is an asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine. It allows "
        "developers to execute JavaScript on the server side to build scalable, high-performance network applications. "
        "Unlike client-side validation which can be bypassed by malicious actors or disabled in browsers, server-side "
        "validation is the primary line of defense in web security.",
        body_text
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: INTRO CONTD & TECHNOLOGIES USED
    # =========================================================================
    story.append(Paragraph(
        "EduEnroll - Online Student Admission & Enrollment Portal is a full-stack web application created for Web "
        "Technology Practical 4. It provides a web interface for entering applicant details, choosing degree courses, "
        "submitting qualifying marks, and supplying a statement of purpose. The Node.js backend intercepts the data, "
        "validates every field against strict business rules, and returns standardized JSON responses.",
        body_text
    ))
    story.append(Paragraph(
        "The application utilizes Express.js for routing and middleware orchestration, body-parser for payload extraction, "
        "and custom validator functions for data verification. Source code is maintained under the Atharv102 GitHub account "
        "and published with continuous deployment.",
        body_text
    ))

    story.append(Paragraph("5. TECHNOLOGIES USED", sec_heading))

    tech_rows = [
        [Paragraph("Technology", tbl_header), Paragraph("Purpose", tbl_header)],
        [Paragraph("NodeJS", tbl_cell), Paragraph("Server runtime environment executing backend JavaScript and managing the HTTP lifecycle.", tbl_cell)],
        [Paragraph("Express.js", tbl_cell), Paragraph("Web application framework facilitating routing, middleware chaining, and request/response dispatching.", tbl_cell)],
        [Paragraph("JavaScript (ES6+)", tbl_cell), Paragraph("Server logic, regular expressions, async/await handlers, temporal date math, and array operations.", tbl_cell)],
        [Paragraph("express.json / body-parser", tbl_cell), Paragraph("Middleware for parsing incoming JSON and URL-encoded request bodies into JavaScript objects.", tbl_cell)],
        [Paragraph("cors", tbl_cell), Paragraph("Middleware to enable Cross-Origin Resource Sharing for API consumers and external clients.", tbl_cell)],
        [Paragraph("Server Validator Middleware", tbl_cell), Paragraph("Custom server-side validation module enforcing schema boundaries and returning HTTP 400 errors.", tbl_cell)],
        [Paragraph("Input Sanitizer Middleware", tbl_cell), Paragraph("Strips malicious HTML tags, eliminates XSS script injection payloads, and normalizes strings.", tbl_cell)],
        [Paragraph("HTML5 / CSS3", tbl_cell), Paragraph("Semantic markup, custom variables, responsive grid/flexbox layouts, and dark/light themes.", tbl_cell)],
        [Paragraph("RESTful Architecture", tbl_cell), Paragraph("Structured API endpoints utilizing HTTP GET, POST, and DELETE methods with standard status codes.", tbl_cell)],
        [Paragraph("In-Memory Data Store", tbl_cell), Paragraph("Server repository simulating a database for storing, retrieving, and deleting candidate records.", tbl_cell)],
        [Paragraph("npm", tbl_cell), Paragraph("Node package manager installing project dependencies and executing test/start scripts.", tbl_cell)],
        [Paragraph("VS Code / Web Browser", tbl_cell), Paragraph("Development, editing, local testing, and demonstration environment.", tbl_cell)],
        [Paragraph("Git / GitHub (Atharv102)", tbl_cell), Paragraph("Version control and public repository hosting under user account Atharv102.", tbl_cell)],
        [Paragraph("GitHub Pages", tbl_cell), Paragraph("Automated deployment providing a live public URL for interactive evaluation.", tbl_cell)],
    ]

    tech_table = Table(tech_rows, colWidths=[2.2*inch, 4.4*inch])
    tech_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SERVER-SIDE VALIDATION & TESTING T1 TO T7
    # =========================================================================
    story.append(Paragraph("6. SERVER-SIDE VALIDATION", sec_heading))

    val_rows = [
        [Paragraph("Field", tbl_header), Paragraph("Validation rule", tbl_header), Paragraph("Example of invalid input", tbl_header)],
        [Paragraph("Full name", tbl_cell), Paragraph("Trimmed name must contain 3-50 alphabetic characters, dots, or hyphens.", tbl_cell), Paragraph("Blank, 'Al', or containing numbers (e.g. 'Atharv123').", tbl_cell)],
        [Paragraph("Email", tbl_cell), Paragraph("RFC-compliant email format with domain check; detects common typos.", tbl_cell), Paragraph("not-an-email, missing '@', or 'user@gmai.com'.", tbl_cell)],
        [Paragraph("Mobile number", tbl_cell), Paragraph("Exact 10-digit Indian mobile number starting with 6, 7, 8, or 9.", tbl_cell), Paragraph("12345, non-digits, or starting with 0-5.", tbl_cell)],
        [Paragraph("Date of Birth", tbl_cell), Paragraph("Server temporal calculation; candidate must be &ge; 18 years old and not future.", tbl_cell), Paragraph("Future date, or minor under 18 (e.g. 2020-05-10).", tbl_cell)],
        [Paragraph("Gender", tbl_cell), Paragraph("Must match one of the server-approved options (Male, Female, Non-Binary, Other).", tbl_cell), Paragraph("Blank or unrecognized value.", tbl_cell)],
        [Paragraph("Course Program", tbl_cell), Paragraph("Must exist in the server-approved degree program whitelist.", tbl_cell), Paragraph("Unapproved course or empty selection.", tbl_cell)],
        [Paragraph("Semester", tbl_cell), Paragraph("Must be an integer value between 1 and 8.", tbl_cell), Paragraph("0, 9, or non-integer string.", tbl_cell)],
        [Paragraph("Percentage", tbl_cell), Paragraph("Floating-point value between 40.0% and 100.0%.", tbl_cell), Paragraph("32.5% (below minimum) or 105.0% (out of bounds).", tbl_cell)],
        [Paragraph("National ID", tbl_cell), Paragraph("Must contain exactly 12 numeric digits (Aadhaar / Gov ID format).", tbl_cell), Paragraph("Fewer than 12 digits (e.g. '12345') or letters.", tbl_cell)],
        [Paragraph("City / Domicile", tbl_cell), Paragraph("Trimmed string containing at least 3 characters.", tbl_cell), Paragraph("Empty or whitespace only (e.g. 'Ab').", tbl_cell)],
        [Paragraph("Statement / SOP", tbl_cell), Paragraph("Must contain between 30 and 500 characters.", tbl_cell), Paragraph("Shorter than 30 chars (e.g. 'Too short') or > 500 chars.", tbl_cell)],
        [Paragraph("Declaration", tbl_cell), Paragraph("Must be a truthy boolean (agreement === true).", tbl_cell), Paragraph("Unchecked declaration agreement (false).", tbl_cell)],
    ]

    val_table = Table(val_rows, colWidths=[1.4*inch, 2.7*inch, 2.5*inch])
    val_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(val_table)

    story.append(Paragraph("7. TESTING AND VALIDATION (T1 to T14)", sec_heading))

    test_rows_part1 = [
        [Paragraph("Test", tbl_header), Paragraph("Input / Action", tbl_header), Paragraph("Expected Result", tbl_header), Paragraph("Observed Result", tbl_header)],
        [Paragraph("T1", tbl_cell), Paragraph("Submit empty POST payload.", tbl_cell), Paragraph("HTTP 400 Bad Request; server returns field errors.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T2", tbl_cell), Paragraph("Enter a very short name (<3 chars).", tbl_cell), Paragraph("Server name validation message appears.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T3", tbl_cell), Paragraph("Enter an invalid email address.", tbl_cell), Paragraph("Server rejects format with 400 Bad Request.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T4", tbl_cell), Paragraph("Enter an invalid mobile number.", tbl_cell), Paragraph("Server rejects non-10-digit number.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T5", tbl_cell), Paragraph("Enter DOB of a minor (<18).", tbl_cell), Paragraph("Server rejects minor age (<18 constraint).", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T6", tbl_cell), Paragraph("Submit unapproved course.", tbl_cell), Paragraph("Server rejects non-whitelisted course.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T7", tbl_cell), Paragraph("Submit valid details (POST).", tbl_cell), Paragraph("HTTP 201 Created; ENR-2026-XXXX assigned.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
    ]

    test_table_1 = Table(test_rows_part1, colWidths=[0.6*inch, 2.2*inch, 2.5*inch, 1.3*inch])
    test_table_1.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(test_table_1)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: TESTING CONTD (T8 to T14)
    # =========================================================================
    test_rows_part2 = [
        [Paragraph("Test", tbl_header), Paragraph("Input / Action", tbl_header), Paragraph("Expected Result", tbl_header), Paragraph("Observed Result", tbl_header)],
        [Paragraph("T8", tbl_cell), Paragraph("Enter percentage < 40% or > 100%.", tbl_cell), Paragraph("Server rejects out-of-range mark.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T9", tbl_cell), Paragraph("Enter non-12-digit Aadhaar ID.", tbl_cell), Paragraph("Server rejects malformed national ID.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T10", tbl_cell), Paragraph("Submit statement < 30 chars.", tbl_cell), Paragraph("Server rejects short statement of purpose.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T11", tbl_cell), Paragraph("Inject HTML tags in name/city.", tbl_cell), Paragraph("Sanitizer strips HTML tags to prevent XSS.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T12", tbl_cell), Paragraph("Leave agreement unchecked.", tbl_cell), Paragraph("Server rejects submission without terms.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T13", tbl_cell), Paragraph("DELETE candidate /api/enrollments/:id.", tbl_cell), Paragraph("HTTP 200 OK; candidate removed from server.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
        [Paragraph("T14", tbl_cell), Paragraph("Query server statistics (GET /stats).", tbl_cell), Paragraph("HTTP 200 OK; server uptime & counts returned.", tbl_cell), Paragraph("PASS (Verified)", tbl_cell)],
    ]

    test_table_2 = Table(test_rows_part2, colWidths=[0.6*inch, 2.2*inch, 2.5*inch, 1.3*inch])
    test_table_2.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(test_table_2)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: SCREENSHOTS (FIGURE 1 & FIGURE 2)
    # =========================================================================
    story.append(Paragraph("8. SCREENSHOTS", sec_heading))

    fig1_img = os.path.join(os.getcwd(), 'fig1_landing.png')
    if os.path.exists(fig1_img):
        story.append(Image(fig1_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 1: EduEnroll desktop landing interface with application form and activity list.", fig_caption))

    story.append(Spacer(1, 10))

    fig2_img = os.path.join(os.getcwd(), 'fig2_validation_errors.png')
    if os.path.exists(fig2_img):
        story.append(Image(fig2_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 2: Real-time server-side validation error messages and highlights for incomplete input.", fig_caption))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SCREENSHOT (FIGURE 3)
    # =========================================================================
    fig3_img = os.path.join(os.getcwd(), 'fig3_success_pass.png')
    if os.path.exists(fig3_img):
        story.append(Spacer(1, 40))
        story.append(Image(fig3_img, width=6.5*inch, height=5.2*inch))
        story.append(Paragraph("Figure 3: Success state, HTTP 201 Created toast notification, and dynamically rendered enrolled candidate card.", fig_caption))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 8: SCREENSHOT (FIGURE 4)
    # =========================================================================
    fig4_img = os.path.join(os.getcwd(), 'fig4_attendees_list.png')
    if os.path.exists(fig4_img):
        story.append(Spacer(1, 40))
        story.append(Image(fig4_img, width=6.5*inch, height=5.2*inch))
        story.append(Paragraph("Figure 4: Server-Side Candidate Database with course filtering and real-time search.", fig_caption))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 9: SCREENSHOT (FIGURE 5) & CONCLUSION
    # =========================================================================
    fig5_img = os.path.join(os.getcwd(), 'fig5_validation_guide.png')
    if os.path.exists(fig5_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig5_img, width=6.5*inch, height=4.6*inch))
        story.append(Paragraph("Figure 5: Live HTTP Request/Response Inspector and server validation rules reference.", fig_caption))

    story.append(Spacer(1, 15))
    story.append(Paragraph("9. CONCLUSION", sec_heading))
    story.append(Paragraph(
        "The EduEnroll project demonstrates the development of a NodeJS server-side web application using "
        "modular routing, request/response lifecycle handling, server-side validation, and dynamic rendering. "
        "The server validates candidate details before accepting a record, displays useful error feedback for invalid "
        "input, and confirms successful submission. Candidate records are managed interactively and "
        "persisted on the server.",
        body_text
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 10: CONCLUSION CONTD (NO SIGNATURE BLOCK)
    # =========================================================================
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "The project also demonstrates a modular Node.js build, source-code management through Git and "
        "GitHub under the Atharv102 account, and automated deployment through GitHub Pages.",
        body_text
    ))

    doc.build(story)
    print(f"Successfully generated matching report: {pdf_path}")

if __name__ == '__main__':
    # 1. Atharv Jadhav (PRN: 202401100102, Div: B)
    build_pdf(
        student_name="Atharv Jadhav",
        prn="202401100102",
        division="B",
        output_filename="EduEnroll_WT_Practical_Report.pdf"
    )
    # 2. Chaitanya Umbarkar (PRN: 202401100080, Div: B)
    build_pdf(
        student_name="Chaitanya Umbarkar",
        prn="202401100080",
        division="B",
        output_filename="EduEnroll_WT_Practical_Report_Chaitanya_Umbarkar.pdf"
    )
