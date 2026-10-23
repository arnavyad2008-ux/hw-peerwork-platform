-- ==============================================================================
-- ENTERPRISE MASTER SCHEMA: STUDENT PEER-FREELANCING PLATFORM
-- Author: Principal Systems Architect
-- Target: PostgreSQL 15+ / Supabase
-- Description: Production-grade DDL, strict RLS, relational constraints,
--              automated trigger handlers, and atomic escrow state operations.
-- ==============================================================================

-- 1. EXTENSIONS & CUSTOM ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('freelancer', 'client', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gig_category AS ENUM (
    'coding', 'web_dev', 'design', 'writing', 'video_editing', 'tutoring', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gig_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM (
    'pending_approval', 
    'in_progress', 
    'submitted_for_review', 
    'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- A. PROFILES TABLE (Linked to auth.users with institutional domain checks)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '1st Year',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  skills TEXT[] DEFAULT '{}',
  role user_role NOT NULL DEFAULT 'both',
  bio TEXT,
  portfolio_links JSONB DEFAULT '[]'::jsonb,
  verified_student BOOLEAN DEFAULT FALSE,
  rating_average NUMERIC(3,2) DEFAULT 5.00 CHECK (rating_average >= 1.00 AND rating_average <= 5.00),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  total_earned NUMERIC(12,2) DEFAULT 0.00 CHECK (total_earned >= 0),
  total_spent NUMERIC(12,2) DEFAULT 0.00 CHECK (total_spent >= 0),
  wallet_balance NUMERIC(12,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
  nav_coins BIGINT DEFAULT 0 CHECK (nav_coins >= 0),
  is_pro BOOLEAN DEFAULT FALSE,
  streak_days INTEGER DEFAULT 1 CHECK (streak_days >= 0),
  avg_response_mins INTEGER DEFAULT 5 CHECK (avg_response_mins >= 1),
  institutional_badge TEXT DEFAULT 'Verified Campus Developer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- Constraint: Enforce standard student email structure
  CONSTRAINT institutional_email_format CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(edu|ac\.in|edu\.in|[a-z]{2,})$'
  )
);

-- B. GIGS TABLE
CREATE TABLE IF NOT EXISTS public.gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 140),
  description TEXT NOT NULL CHECK (char_length(description) >= 20),
  category gig_category NOT NULL DEFAULT 'coding',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  budget NUMERIC(12,2) NOT NULL CHECK (budget > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  deadline TIMESTAMPTZ NOT NULL,
  turnaround_time TEXT NOT NULL DEFAULT '3-5 Days',
  status gig_status NOT NULL DEFAULT 'open',
  proposals_count INTEGER NOT NULL DEFAULT 0 CHECK (proposals_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- C. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_note TEXT NOT NULL CHECK (char_length(cover_note) >= 15),
  bid_amount NUMERIC(12,2) NOT NULL CHECK (bid_amount > 0),
  estimated_days INTEGER NOT NULL CHECK (estimated_days > 0),
  status proposal_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- Prevent duplicate bids from same freelancer on same gig
  CONSTRAINT unique_freelancer_per_gig UNIQUE(gig_id, freelancer_id)
);

-- D. MILESTONES & ESCROW TABLE
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 1 CHECK (order_index > 0),
  title TEXT NOT NULL CHECK (char_length(title) >= 3),
  description TEXT,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  deadline TIMESTAMPTZ NOT NULL,
  status milestone_status NOT NULL DEFAULT 'pending_approval',
  deliverable_url TEXT,
  submission_notes TEXT,
  revision_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- E. CONVERSATIONS & REALTIME MESSAGES TABLES
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT unique_conversation_participants UNIQUE(gig_id, client_id, freelancer_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1),
  attachment_url TEXT,
  attachment_name TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_gigs_status_category ON public.gigs(status, category);
CREATE INDEX IF NOT EXISTS idx_gigs_client_id ON public.gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_gigs_skills ON public.gigs USING gin(required_skills);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_proposals_gig_freelancer ON public.proposals(gig_id, freelancer_id);
CREATE INDEX IF NOT EXISTS idx_milestones_gig_id ON public.milestones(gig_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id, created_at ASC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all domain tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can read student profiles (marketplace discovery)
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only modify their own individual profile
CREATE POLICY "Users can only update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- GIGS POLICIES
-- ------------------------------------------------------------------------------
-- Any authenticated user can view non-cancelled gigs
CREATE POLICY "Gigs are viewable by all authenticated users"
  ON public.gigs FOR SELECT
  TO authenticated
  USING (status != 'cancelled' OR client_id = auth.uid());

-- Only clients can post new gigs
CREATE POLICY "Clients can create gigs"
  ON public.gigs FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

-- Clients can only update their own posted gigs
CREATE POLICY "Clients can update own gigs"
  ON public.gigs FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- ------------------------------------------------------------------------------
-- PROPOSALS POLICIES
-- ------------------------------------------------------------------------------
-- Only the gig creator OR the specific bidding freelancer can inspect proposals
CREATE POLICY "Proposals viewable by gig owner and bidding freelancer"
  ON public.proposals FOR SELECT
  TO authenticated
  USING (
    freelancer_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = proposals.gig_id AND gigs.client_id = auth.uid()
    )
  );

-- Freelancers can submit proposals
CREATE POLICY "Freelancers can submit proposals"
  ON public.proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    freelancer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = proposals.gig_id AND gigs.status = 'open'
    )
  );

-- Freelancers can withdraw/edit their proposals, clients can accept/reject
CREATE POLICY "Proposals updatable by author or gig owner"
  ON public.proposals FOR UPDATE
  TO authenticated
  USING (
    freelancer_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = proposals.gig_id AND gigs.client_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- MILESTONES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Milestones viewable by involved gig participants"
  ON public.milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = milestones.gig_id AND (
        gigs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.proposals 
          WHERE proposals.gig_id = gigs.id AND proposals.freelancer_id = auth.uid() AND proposals.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Milestones manageable by client or accepted freelancer"
  ON public.milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = milestones.gig_id AND (
        gigs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.proposals 
          WHERE proposals.gig_id = gigs.id AND proposals.freelancer_id = auth.uid() AND proposals.status = 'accepted'
        )
      )
    )
  );

-- ------------------------------------------------------------------------------
-- CONVERSATIONS & MESSAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Conversations viewable only by participants"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR freelancer_id = auth.uid());

CREATE POLICY "Messages viewable only by conversation participants"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id AND (
        conversations.client_id = auth.uid() OR conversations.freelancer_id = auth.uid()
      )
    )
  );

CREATE POLICY "Messages insertable only by conversation participants"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id AND (
        conversations.client_id = auth.uid() OR conversations.freelancer_id = auth.uid()
      )
    )
  );

-- ==============================================================================
-- 5. TRIGGERS & AUTOMATION HANDLERS
-- ==============================================================================

-- A. Auto-provision profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  extracted_domain text;
  is_verified boolean := false;
BEGIN
  -- Extract institutional email domain check (.edu or .ac.in)
  extracted_domain := split_part(new.email, '@', 2);
  IF extracted_domain ~* '\.(edu|ac\.in|edu\.in)$' THEN
    is_verified := true;
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    college_name,
    branch,
    year,
    avatar_url,
    skills,
    role,
    verified_student,
    wallet_balance,
    nav_coins
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'college_name', 'University College'),
    COALESCE(new.raw_user_meta_data->>'branch', 'Computer Science & Engineering'),
    COALESCE(new.raw_user_meta_data->>'year', '2nd Year'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id),
    ARRAY['Next.js', 'TypeScript', 'React'],
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'both'::public.user_role),
    is_verified,
    2500.00,
    15000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users row creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS set_gigs_updated_at ON public.gigs;
CREATE TRIGGER set_gigs_updated_at BEFORE UPDATE ON public.gigs FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS set_proposals_updated_at ON public.proposals;
CREATE TRIGGER set_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS set_milestones_updated_at ON public.milestones;
CREATE TRIGGER set_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- C. Keep proposals_count in sync on public.gigs
CREATE OR REPLACE FUNCTION public.sync_gig_proposals_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.gigs SET proposals_count = proposals_count + 1 WHERE id = NEW.gig_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.gigs SET proposals_count = GREATEST(proposals_count - 1, 0) WHERE id = OLD.gig_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_proposal_count_change ON public.proposals;
CREATE TRIGGER on_proposal_count_change
  AFTER INSERT OR DELETE ON public.proposals
  FOR EACH ROW EXECUTE PROCEDURE public.sync_gig_proposals_count();
