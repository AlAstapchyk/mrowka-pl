-- 1. Create Custom Types (Enums)
CREATE TYPE user_role AS ENUM ('admin', 'company_owner', 'job_seeker');
CREATE TYPE company_verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE company_member_role AS ENUM ('owner', 'admin', 'recruiter');
CREATE TYPE company_size AS ENUM ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE job_level AS ENUM ('junior', 'mid', 'senior', 'lead');
CREATE TYPE working_mode AS ENUM ('remote', 'office', 'hybrid');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'interviewing', 'accepted', 'rejected');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avatar_url TEXT
);

-- 3. Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    description VARCHAR(255),
    created_by UUID REFERENCES users(id),
    verification_status company_verification_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Company Members
CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role company_member_role NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Company Profiles
CREATE TABLE company_profiles (
    company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    industry VARCHAR(255),
    website VARCHAR(255),
    company_size company_size,
    company_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Job Seeker Profiles
CREATE TABLE job_seeker_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    skills TEXT[],
    education VARCHAR(255),
    location_preference VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resume_path TEXT
);

-- 7. Job Offers
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    employment_type employment_type NOT NULL,
    job_level job_level NOT NULL,
    working_mode working_mode NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    min_salary INT4,
    max_salary INT4,
    currency TEXT DEFAULT 'USD'
);

-- 8. Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES job_offers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT
);

-- 9. Saved Jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_offers(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
