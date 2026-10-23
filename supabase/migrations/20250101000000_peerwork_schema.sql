-- ==============================================================================
-- PEERWORK DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Micro-Freelancing Marketplace Exclusively for University Students
-- ==============================================================================

-- 1. PROFILES TABLE (Public user profile linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  branch TEXT,
  year TEXT, -- '1st Year', '2nd Year', '3rd Year', '4th Year', 'Masters / PhD'
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  role TEXT NOT NULL DEFAULT 'both' CHECK (role IN ('freelancer', 'client', 'both')),
  bio TEXT,
  portfolio_links JSONB DEFAULT '[]'::jsonb, -- [{ "title": "GitHub", "url": "https://github.com/..." }]
  verified_student BOOLEAN DEFAULT TRUE,
  rating_average NUMERIC(3, 2) DEFAULT 5.0,
  rating_count INTEGER DEFAULT 0,
  total_earned NUMERIC(10, 2) DEFAULT 0.00,
  total_spent NUMERIC(10, 2) DEFAULT 0.00,
  wallet_balance NUMERIC(10, 2) DEFAULT 2500.00, -- Starter campus bonus credits
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. GIGS TABLE (Micro-tasks posted by student clients)
CREATE TABLE IF NOT EXISTS public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('coding', 'web_dev', 'design', 'writing', 'video_editing', 'tutoring', 'other')),
  required_skills TEXT[] DEFAULT '{}',
  budget NUMERIC(10, 2) NOT NULL CHECK (budget > 0),
  currency TEXT DEFAULT 'INR',
  deadline TIMESTAMPTZ NOT NULL,
  turnaround_time TEXT, -- e.g. '2 Days', '48 Hours'
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PROPOSALS TABLE (Applications submitted by freelancers)
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_message TEXT NOT NULL,
  bid_amount NUMERIC(10, 2) NOT NULL CHECK (bid_amount > 0),
  estimated_days INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(gig_id, freelancer_id)
);

-- 4. ORDERS TABLE (Active project engagement upon hiring)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'delivered', 'completed', 'disputed', 'cancelled')),
  deliverable_note TEXT,
  deliverable_links JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ORDER MESSAGES TABLE (Realtime chat & collaboration log in project workspace)
CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. REVIEWS TABLE (Post-completion peer ratings and feedback)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(order_id, reviewer_id)
);

-- 7. WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'escrow_hold', 'escrow_release', 'refund')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_gigs_client_id ON public.gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON public.gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON public.gigs(category);
CREATE INDEX IF NOT EXISTS idx_proposals_gig_id ON public.proposals(gig_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_freelancer_id ON public.orders(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON public.order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated or public can read profiles; user can update own profile
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Gigs: Anyone can view open gigs; Clients can insert/update their gigs
CREATE POLICY "Gigs are viewable by everyone" 
  ON public.gigs FOR SELECT USING (true);

CREATE POLICY "Clients can create gigs" 
  ON public.gigs FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their gigs" 
  ON public.gigs FOR UPDATE USING (auth.uid() = client_id);

-- Proposals: Freelancers can create proposals; Clients of the gig and the author can view
CREATE POLICY "Proposals viewable by gig client or proposal author" 
  ON public.proposals FOR SELECT USING (
    auth.uid() = freelancer_id OR 
    EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = proposals.gig_id AND gigs.client_id = auth.uid())
  );

CREATE POLICY "Freelancers can create proposals" 
  ON public.proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Clients or authors can update proposals" 
  ON public.proposals FOR UPDATE USING (
    auth.uid() = freelancer_id OR 
    EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = proposals.gig_id AND gigs.client_id = auth.uid())
  );

-- Orders: Involved client or freelancer can view and update
CREATE POLICY "Orders viewable by client or freelancer" 
  ON public.orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can create orders upon hiring" 
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Participants can update orders" 
  ON public.orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Order Messages: Participants can read and write
CREATE POLICY "Order messages viewable by participants" 
  ON public.order_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_messages.order_id AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid()))
  );

CREATE POLICY "Participants can send messages" 
  ON public.order_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_messages.order_id AND (orders.client_id = auth.uid() OR orders.freelancer_id = auth.uid()))
  );

-- Reviews: Viewable by all; created by participants
CREATE POLICY "Reviews viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Reviewers can write reviews" 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Transactions: Viewable only by the owner
CREATE POLICY "Transactions viewable by owner" 
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    college_name,
    branch,
    year,
    avatar_url,
    role
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'college_name', 'Campus University'),
    COALESCE(new.raw_user_meta_data->>'branch', 'Computer Science & Engineering'),
    COALESCE(new.raw_user_meta_data->>'year', '3rd Year'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    COALESCE(new.raw_user_meta_data->>'role', 'both')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- REPUTATION UPDATE FUNCTION & TRIGGER
-- Automatically updates user average rating and count upon new review
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET 
    rating_count = (SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id),
    rating_average = (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_rating();
