-- APL-platser SaaS Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    school_name VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'trial',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scrape_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    kommun VARCHAR(100) NOT NULL,
    yrkesomraden TEXT[] NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_companies INTEGER DEFAULT 0,
    progress_pct INTEGER DEFAULT 0,
    progress_message TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orgnr VARCHAR(20) UNIQUE,
    name VARCHAR(500) NOT NULL,
    bransch VARCHAR(500),
    sni_codes TEXT,
    yrkesomraden TEXT,
    ort VARCHAR(100),
    adress VARCHAR(500),
    postnummer VARCHAR(10),
    telefon VARCHAR(100),
    epost VARCHAR(255),
    webbplats VARCHAR(500),
    antal_anstallda INTEGER,
    omsattning_sek BIGINT,
    scraped_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_companies (
    job_id UUID REFERENCES scrape_jobs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, company_id)
);

CREATE INDEX idx_scrape_jobs_user_id ON scrape_jobs(user_id);
CREATE INDEX idx_scrape_jobs_status ON scrape_jobs(status);
CREATE INDEX idx_companies_orgnr ON companies(orgnr);
CREATE INDEX idx_companies_ort ON companies(ort);
