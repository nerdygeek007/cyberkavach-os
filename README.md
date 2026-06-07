# cyberkavach-os
State and access control infrastructure for the CyberKavach Club. Next.js / Express / Postgres / Redis.

### ❯ System Architecture
- **State & Persistence:** PostgreSQL (Relational integrity) + Redis (Session/Cache)
- **API & Access Control:** Node.js + Express (Zero-trust middleware layer)
- **Client & I/O:** Next.js + Tailwind (Role-specific dashboard routing)
- **Telemetry & Media:** Socket.io (Real-time tracking) + pdf-lib (Automated certificate generation)

**Maintainers:** Maharshi & Palak

---

## 🚀 Features Implemented in this Branch (Module 2 & Module 5)

This branch contains the production-ready implementation of **Module 2 (Smart Certificate Generation & Verification)** and **Module 5 (Appreciation, Reward Points & Recognition System)**.

---

### 🎓 Module 2: Smart Certificate Generation System
Provides full cryptographic credential generation, bulk issuing operations, and public validation mechanisms.

#### 1. Template & Participant Management
- **Template Uploads:** Express controller handles PNG/PDF template backgrounds.
- **Bulk Spreadsheet Processing:** Integrated SheetJS (`xlsx`) on the frontend to parse CSV/Excel files directly with a **Field Mapping UI** matching custom headers to participant details.
- **Pre-flight Validation:** Automatic error flag boundaries to check email structures and empty names before triggering generation.

#### 2. Bulk PDF Engine & Mail Dispatcher
- **Dynamic Text Overlay:** Leverages `pdf-lib` to overlay event name, participant name, unique credential code, date, and verification details onto templates.
- **ZIP Compilation:** Employs `archiver` streams to bundle 300+ certificates in one job on the backend.
- **Nodemailer Dispatch with Logo:** Sends high-fidelity HTML emails utilizing inline attachments (`cid:cyberkavach_logo`) and a clean cyber-themed design, pointing to the download URL and attached PDF.
- **Progress Telemetry:** Live state feedback and progress fraction polling.

#### 3. Cryptographic Verification & Tamper Detection
- **Auto-Generated Verification ID:** Unique code scheme `CK-[EVENT-INITIALS]-[RANDOM-HEX]-[INDEX]`.
- **Public Verification Router:** Interactive public endpoint validating the recipient, event name, issue date, and issuing authority without requiring login.
- **Public File Downloads:** Instant single certificate fetching by verification ID.

---

### 🏆 Module 5: Appreciation, Reward Points & Recognition System
Manages coordinator appreciation assignments, member scoreboards, and automated milestone recognition.

#### 1. Point Assignment Protocol
- **Allocation Rules:** Faculty and Student Coordinators can award point values (+XP) to members with category tags and mandatory remarks.
- **Policy Violations:** Deductions (-XP) are strictly verified, requiring mandatory remarks and mapping only to the `'Policy Violation'` category.
- **Explicit Recognition Categories:** `Best Coordinator`, `Best Volunteer`, `Technical Contribution`, `Creative Contribution`, `Event Management Excellence`, `Community Builder`, `Innovation Award`.

#### 2. Recognition Dashboard & Milestones
- **Live Leaderboard:** Unified club standings ordered by total accumulated points.
- **Dashboard Profile:** Displays current point balances, badge milestones, point transaction ledgers, and check-in participation logs (linked from `attendance_logs`).
- **Milestone Badges:** Automatically maps point balances to rank medals:
  - `Bronze Cyber Badge` (>= 100 XP)
  - `Silver Shield Badge` (>= 250 XP)
  - `Gold Sentinel Badge` (>= 500 XP)
  - `Diamond Kavach Badge` (>= 1000 XP)

#### 3. Annual Report Export
- **CSV Export:** Generates downloadable semiannual/annual summary tables containing Student ID, Full Name, Email, Total Points, and Earned Badges.

---

### 🛠️ Developer Verification & Testing

#### 1. Local Testing Environment Launcher
Run the standalone launcher batch file to set up Docker infrastructure (PostgreSQL, Redis) and launch development environments in separate command windows:
```bash
run_project.bat
```

#### 2. Comprehensive Test Suite
Execute the unified TypeScript unit and integration tests covering all routes and validations:
```bash
cd backend
npx ts-node src/tests/run_all_tests.ts
```
The test runner executes:
- **Unit Tests:** Validates controller boundary checks (missing parameters, illegal categories, missing violation remarks) using mock Express request/response calls.
- **Integration Tests:** Hits active server endpoints (file upload, generation, polling, verification, mail dispatch, points assignments, deductions, and CSV exports) using native `fetch` requests.