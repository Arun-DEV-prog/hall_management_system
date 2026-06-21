-- ============================================================
-- Hall Management System — PostgreSQL Schema
-- ============================================================

-- Drop tables in reverse dependency order (if re-running)
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS hall_applications CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS halls CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- ────────────────────────────────────────────────────────────
-- 1. students
-- ────────────────────────────────────────────────────────────
CREATE TABLE students (
    student_id     SERIAL PRIMARY KEY,
    student_number VARCHAR(50)  NOT NULL UNIQUE,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL DEFAULT '',
    email          VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    department     VARCHAR(150),
    intake_year    INT,
    phone          VARCHAR(20),
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. staff
-- ────────────────────────────────────────────────────────────
CREATE TABLE staff (
    staff_id   SERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) UNIQUE,
    role       VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. halls
-- ────────────────────────────────────────────────────────────
CREATE TABLE halls (
    hall_id    SERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    location   VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. blocks
-- ────────────────────────────────────────────────────────────
CREATE TABLE blocks (
    block_id   SERIAL PRIMARY KEY,
    hall_id    INT NOT NULL REFERENCES halls(hall_id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 5. rooms
-- ────────────────────────────────────────────────────────────
CREATE TABLE rooms (
    room_id    SERIAL PRIMARY KEY,
    hall_id    INT NOT NULL REFERENCES halls(hall_id)   ON DELETE CASCADE,
    block_id   INT          REFERENCES blocks(block_id) ON DELETE SET NULL,
    room_no    VARCHAR(20)  NOT NULL,
    capacity   INT          NOT NULL DEFAULT 1,
    rent       NUMERIC(10,2),
    status     VARCHAR(20)  NOT NULL DEFAULT 'available'
                            CHECK (status IN ('available','occupied','maintenance')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 6. hall_applications
-- ────────────────────────────────────────────────────────────
CREATE TABLE hall_applications (
    application_id    SERIAL PRIMARY KEY,
    student_id        INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    hall_id           INT NOT NULL REFERENCES halls(hall_id)       ON DELETE CASCADE,
    preferred_room    VARCHAR(20),
    reason            TEXT,
    status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','approved','rejected')),
    applied_at        TIMESTAMP DEFAULT NOW(),
    reviewed_by_staff INT        REFERENCES staff(staff_id) ON DELETE SET NULL,
    reviewed_at       TIMESTAMP,
    remarks           TEXT
);

-- ────────────────────────────────────────────────────────────
-- 7. allocations
-- ────────────────────────────────────────────────────────────
CREATE TABLE allocations (
    allocation_id    SERIAL PRIMARY KEY,
    student_id       INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    room_id          INT NOT NULL REFERENCES rooms(room_id)       ON DELETE CASCADE,
    assigned_by_staff INT         REFERENCES staff(staff_id)      ON DELETE SET NULL,
    assigned_at      TIMESTAMP DEFAULT NOW(),
    move_in          DATE,
    move_out         DATE,
    status           VARCHAR(20) NOT NULL DEFAULT 'active'
                                 CHECK (status IN ('active','inactive','terminated'))
);

-- ────────────────────────────────────────────────────────────
-- 8. payments
-- ────────────────────────────────────────────────────────────
CREATE TABLE payments (
    payment_id       SERIAL PRIMARY KEY,
    student_id       INT  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    allocation_id    INT  NOT NULL REFERENCES allocations(allocation_id) ON DELETE CASCADE,
    month            DATE NOT NULL,
    amount           NUMERIC(10,2) NOT NULL,
    due_date         DATE NOT NULL,
    paid_amount      NUMERIC(10,2) DEFAULT 0,
    payment_date     TIMESTAMP,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','paid','overdue')),
    paid_by_staff    INT REFERENCES staff(staff_id),
    remarks          TEXT,
    created_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, allocation_id, month)
);

-- ────────────────────────────────────────────────────────────
-- 9. complaints
-- ────────────────────────────────────────────────────────────
CREATE TABLE complaints (
    complaint_id SERIAL PRIMARY KEY,
    student_id   INT  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    room_id      INT           REFERENCES rooms(room_id)       ON DELETE SET NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open','in_progress','resolved')),
    raised_at    TIMESTAMP DEFAULT NOW(),
    resolved_at  TIMESTAMP
);
