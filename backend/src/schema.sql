CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'client'
                  CHECK (role IN ('admin','staff','client')),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_attempts (
    id             SERIAL PRIMARY KEY,
    ip_address     VARCHAR(45)  NOT NULL,
    email          VARCHAR(100) NOT NULL,
    was_successful BOOLEAN      NOT NULL DEFAULT FALSE,
    attempted_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attempts ON login_attempts (email, ip_address, attempted_at);

CREATE TABLE IF NOT EXISTS memorials (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name     VARCHAR(150) NOT NULL,
    age           VARCHAR(20),
    dates         VARCHAR(100),
    eulogy        TEXT,
    faith         VARCHAR(50),
    relationship  VARCHAR(50),
    tone          VARCHAR(50),
    survived_by   TEXT,
    photos        JSONB DEFAULT '[]'::jsonb,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    client_name    VARCHAR(150) NOT NULL,
    contact_phone  VARCHAR(30),
    burial_date    DATE,
    casket_name    VARCHAR(150),
    hearse_name    VARCHAR(150),
    total_quote    NUMERIC(12,2) DEFAULT 0,
    amount_paid    NUMERIC(12,2) DEFAULT 0,
    status         VARCHAR(20) DEFAULT 'PENDING',
    transport      JSONB,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);