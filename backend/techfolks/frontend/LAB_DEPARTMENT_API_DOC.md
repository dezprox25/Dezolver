# API Requirement Document: Lab Management & Department Analytics

**Author**: dezprox
**Status**: Draft / Production-Ready
**Version**: 1.0.0
**Base URL**: `/api/v1`

---

## 1. Overview
This document specifies the RESTful API requirements for the Lab Management system and Department Analytics dashboard. It covers lab creation, problem management, student progress tracking, and departmental performance telemetry.

### Roles & Access Control
- **Super Admin**: Full access to all department metrics and administrative tools.
- **Admin / Manager**: Create and manage labs, view student progress, and download reports.
- **User (Student)**: View assigned labs, solve problems, and track personal progress.

---

## 2. API Endpoints: Lab Management

### 2.1 List Labs
**Description**: Retrieve a list of available labs for the authenticated user.
- **Method**: `GET`
- **URL**: `/labs`
- **Auth Required**: Yes (JWT)
- **Query Parameters**:
  - `page` (optional): Page number.
  - `limit` (optional): Items per page.
  - `search` (optional): Filter by name.
- **Success Response**:
```json
{
  "success": true,
  "message": "Labs retrieved successfully",
  "data": {
    "labs": [
      {
        "id": "uuid-1",
        "name": "Python Fundamentals Lab",
        "description": "Learn the basics of Python programming.",
        "lab_hrs": 3,
        "group_name": "python",
        "total_problems": 12,
        "created_at": "2024-03-20T10:00:00Z"
      }
    ],
    "pagination": { "total": 1, "page": 1, "pages": 1 }
  }
}
```

### 2.2 Create Lab
**Description**: Create a new lab instance.
- **Method**: `POST`
- **URL**: `/labs`
- **Auth Required**: Yes (Admin/Manager)
- **Request Body**:
```json
{
  "name": "Advanced JavaScript",
  "description": "Mastering Async/Await and Closures.",
  "lab_hrs": 4,
  "group_name": "javascript"
}
```
- **Validation Rules**:
  - `name`: Required, String, Min 3 chars.
  - `lab_hrs`: Required, Number, Min 1.
  - `group_name`: Required, Enum (python, javascript, java, cpp, etc.).

---

## 3. API Endpoints: Department Analytics

### 3.1 Department Overview Stats
**Description**: High-level metrics for the department dashboard.
- **Method**: `GET`
- **URL**: `/department/stats`
- **Auth Required**: Yes (Super Admin/Admin)
- **Success Response**:
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "totalStaffs": 45,
    "totalStudents": 1250,
    "totalLabs": 12,
    "totalContests": 8,
    "totalGroups": 24
  }
}
```

### 3.2 Student Leaderboard
**Description**: Rankings based on performance scores.
- **Method**: `GET`
- **URL**: `/department/leaderboard`
- **Auth Required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": [
    { "rank": 1, "name": "Alice Johnson", "score": 2850, "performance": "+12%" }
  ]
}
```

---

## 4. Error Handling Standard Format
All error responses follow this structure:
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## 5. Status Code Standards
- `200 OK`: Request successful.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: Insufficient permissions.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Unknown backend failure.

---

## 6. Security Considerations
1. **JWT Expiration**: Access tokens must expire within 1 hour; use Refresh Tokens for persistent sessions.
2. **Rate Limiting**: Apply limit of 100 requests per 15 minutes per IP.
3. **Role Validation**: Every sensitive endpoint must verify the `user.role` from the decoded JWT.

---

## 7. Database Schema Suggestion

### Tables (PostgreSQL Example)
```sql
CREATE TABLE labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lab_hrs INTEGER DEFAULT 2,
    group_name VARCHAR(50),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100),
    difficulty_level VARCHAR(20), -- easy, medium, hard
    content JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```



----------------------------------------
other changes 

### 8. Detailed Role Account Specifications

#### 8.1 Student
- **Data Required**: Email, Student Name, College Name, Register Number, Mobile Number, Official Mail (Optional), Password.
- **Profile Edit Options**: Name, Email, College, Register Number, Mobile, Official Mail (Opt), Password, Districts, State, Pincode.
- **Removals**: All Payroll, HR, and Employee management options.

#### 8.2 Manager
- **Data Required**: Username, Email, Password, Full Name, Phone Number.
- **Permissions**: Access to create contests.
- **Removals**: All Payroll, HR, Employee management, Employee cards, and account-related details.

#### 8.3 Admin
- **Data Required**: College Name, Department Name, HOD/Admin Name, Username, Password, Mobile Number, Email, Address.
- **Limits**: Group, Manager, Contest, Lab, and Student limits.
- **Accounting**: Total payment and Due amount (Optional).
- **Removals**: All Payroll, HR management, Employee management, Bank details. Subscription/Payment details are handled via settings dashboard.

#### 8.4 Super Admin
- **Data Required**: Username, Email, Password.
- **Exclusive Management**: Bank details, HR management, Employee management, Certificate creation.

---

### 9. User Settings & Preferences API
- **Endpoint**: `PATCH /api/v1/user/settings`
- **Fields**:
  - `font_size`: Integer (e.g., 12, 14, 16).
  - `compact_mode`: Boolean.
  - `editor_mode`: String (e.g., "vs-dark", "light").
  - `auto_save_options`: Boolean.
  - `notification_settings`: Boolean.
  - `sound_effects`: Boolean.

---

### 10. Core Application Features

#### 10.1 Code Console (Submission)
- **Requirement**: Must support **two concurrent test runs** per submission request for verification.
- **Endpoint**: `POST /api/v1/problems/:id/run`

#### 10.2 Leaderboard Variants
- **User Leaderboard**: Displays ranking, name, and total score.
- **Admin & Manager Leaderboard**: Specific analytics for staff performance.

#### 10.3 Group & Student Bulk Upload
- **Feature**: Option to upload student register numbers via Excel sheet within the Group Management module.
- **Endpoint**: `POST /api/v1/groups/:id/upload-students`

#### 10.4 System Navigation
- **Top Nav Bar**: Real-time notification polling/socket integration for system alerts.

---

### 11. Refined Database Schema (PostgreSQL Addition)

```sql
-- Role Specific Context & Limits
CREATE TABLE user_role_context (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    college_name VARCHAR(255),
    department_name VARCHAR(255),
    hod_name VARCHAR(255),
    register_number VARCHAR(100),
    official_email VARCHAR(255),
    address TEXT,
    district VARCHAR(100),
    state_pincode VARCHAR(20),
    manager_limit INTEGER,
    contest_limit INTEGER,
    lab_limit INTEGER,
    student_limit INTEGER,
    total_payment DECIMAL(15,2),
    payment_due DECIMAL(15,2)
);

-- User Preferences
CREATE TABLE user_app_settings (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    font_size INTEGER DEFAULT 14,
    compact_mode BOOLEAN DEFAULT FALSE,
    editor_theme VARCHAR(50) DEFAULT 'vs-dark',
    auto_save BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE
);
```

---

## 12. Technical & Architectural Specifications (Enterprise-Grade)

### 12.1 Entity Relationship Definition (ERD)
The system architecture follows a hierarchical multi-tenant structure centered around **Departments**.

- **Departments & Admins**: A 1:1 relationship (One primary Admin per Department).
- **Admins & Managers**: 1:N relationship. Admins create and manage multiple Manager accounts.
- **Managers & Groups**: 1:N relationship. Managers oversee specific student Groups.
- **Groups & Students**: 1:N relationship. Students are assigned to a primary Group via Register Number.
- **Labs & Problems**: 1:N relationship. A Lab consists of multiple ordered Problems.
- **Labs & Groups**: N:M relationship (Group_Labs junction table). Multiple groups can be assigned to the same Lab.
- **Problems & Submissions**: 1:N relationship. A student can submit multiple times for the same problem.
- **Contests**: N:M relationship between Managers and Students. Contests are standalone time-bound events.

**Foreign Key Integrity**: 
- `ON DELETE CASCADE` is expected for Problems when a Lab is deleted.
- `ON DELETE RESTRICT` for Departments with active Admins to prevent data orphaning.

### 12.2 Submission Architecture & Lifecycle
Submissions are the core transaction of the student experience.

- **Status Lifecycle**: 
  1. `QUEUED`: Submission received, awaiting runner availability.
  2. `RUNNING`: Code is being executed against test cases.
  3. `PASSED`: All required test cases cleared.
  4. `FAILED`: Compilation error, Runtime error, or Test case mismatch.
- **Scoring Logic**: Total Score = (Passed_Tests / Total_Tests) * Problem_Weight.
- **Concurrent Test Runs**: The execution engine MUST execute exactly two concurrent test processes per submission to optimize throughput and verify consistency.
- **Leaderboard Integration**: Only the **Highest Score** (Best Submission) per problem per student is considered for leaderboard calculation.

### 12.3 Leaderboard Computation Rules
- **Sorting Rank**: 
  1. Primary: Total Points (Descending).
  2. Secondary: Accuracy Rate (Total Passed / Total Attempts).
  3. Tertiary: Time to Completion (Ascending).
- **Tie-Breaking**: If points and time are identical, the user with the earlier `First_Correct_Submission` timestamp takes precedence.
- **Pagination**: Standard limit of 50 per page with `cursor-based` pagination for high-volume student lists.
- **Caching**: Leaderboards for high-traffic Contests are cached in **Redis** with a 60-second TTL (Time-To-Live).

### 12.4 Soft Delete Strategy
- **Applicability**: Users, Labs, Problems, and Groups.
- **Pattern**: `is_deleted` (Boolean) and `deleted_at` (Timestamp) columns.
- **Filtering**: All default `GET` queries must append `WHERE is_deleted = false`.
- **Recovery**: Only **Super Admin** can trigger a RESTORE operation via `/api/v1/admin/restore/:entity/:id`.

### 12.5 Limit Enforcement Logic
Limits are defined per Admin in the `admin_configs` table.

- **Enforcement Layers**:
  - **Service Layer**: Pre-flight check against current counts before processing.
  - **DB Layer**: Conditional triggers to prevent insertion if `COUNT(*) >= limit`.
- **Transaction Safety**: Limit checks must occur within a `SERIALIZABLE` or `REPEATABLE READ` transaction block to avoid race conditions during bulk registration.
- **Over-Limit Response**:
```json
{
  "success": false,
  "message": "Limit Exceeded",
  "data": { "limit_type": "student_limit", "max": 500, "current": 500 }
}
```

### 12.6 Audit Logging Strategy
All state-changing actions MUST be logged for security and accountability.

- **Table**: `audit_logs`
- **Schema**: `id, user_id, action, entity_type, entity_id, old_value (json), new_value (json), ip_address, timestamp`.
- **Logged Actions**: `ACCOUNT_CREATE`, `LIMIT_UPDATE`, `PAYMENT_RECORD`, `ROLE_CHANGE`, `LAB_DELETE`.

### 12.7 API Versioning Policy
- **Strategy**: URL-based versioning prefixed as `/api/v1`.
- **Backward Compatibility**: Any breaking change (removing fields/renaming) requires a version bump to `/api/v2` with a 3-month sunset period for v1.

### 12.8 Real-Time System Specification
- **Notifications**: Polling (60s) for standard updates; **WebSockets** for Lab Sessions and Contest leaderboards.
- **Trigger Events**:
  - Problem status changed (Passed/Failed).
  - New Lab assigned to Group.
  - Contest starting in 15 minutes.
  - Payment Due date approaching.

### 12.9 Performance & Scaling
- **Indexing**: Composite indexes on `(department_id, is_deleted)` and `(student_id, problem_id, score)`.
- **High-Traffic Endpoints**: `/api/v1/problems/:id/run` and `/api/v1/leaderboard`.
- **Rate Limiting**: 
  - API level: 100 req/15min.
  - Code Execution: Max 5 runs per minute per student.
- **Caching Strategy**: Shared settings and static problem data should be cached in Redis for <10ms response times.