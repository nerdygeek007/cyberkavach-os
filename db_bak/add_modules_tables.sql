-- D:\MT-CK\MT-CK\db_bak\add_modules_tables.sql

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: requests (For approvals)
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    request_type CHARACTER VARYING(50) NOT NULL, -- 'EVENT', 'VENUE', 'BUDGET', 'SOCIAL', 'CONTENT', 'CERTIFICATE', 'COLLAB'
    title CHARACTER VARYING(150) NOT NULL,
    details JSONB,
    status CHARACTER VARYING(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    current_approver_role_level INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: request_history (Approval timeline)
CREATE TABLE IF NOT EXISTS public.request_history (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    previous_status CHARACTER VARYING(20),
    new_status CHARACTER VARYING(20),
    remarks TEXT,
    acted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    certificate_code CHARACTER VARYING(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    recipient_name CHARACTER VARYING(100) NOT NULL,
    event_name CHARACTER VARYING(150) NOT NULL,
    issued_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    template_url CHARACTER VARYING(255),
    file_url CHARACTER VARYING(255),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: appreciation_points
CREATE TABLE IF NOT EXISTS public.appreciation_points (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    category CHARACTER VARYING(50) NOT NULL, -- e.g., 'Best Coordinator', 'Best Volunteer', etc.
    remarks TEXT NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: teams (For event registration and check-in)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    team_name CHARACTER VARYING(100) NOT NULL,
    leader_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_code CHARACTER VARYING(100) UNIQUE NOT NULL, -- QR code payload
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_team_name UNIQUE (event_id, team_name)
);

-- 6. Table: team_members
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_team_member UNIQUE (team_id, user_id)
);

-- 7. Table: attendance_logs (Check-in/out tracking)
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    status CHARACTER VARYING(20) DEFAULT 'ABSENT' CHECK (status IN ('ABSENT', 'PRESENT', 'LATE', 'EARLY_EXIT')),
    marked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table: audit_logs (System compliance audit)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action CHARACTER VARYING(100) NOT NULL,
    details TEXT,
    ip_address CHARACTER VARYING(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
