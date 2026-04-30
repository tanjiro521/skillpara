-- 1. Profiles Table Extension
-- Extending existing profiles/users table with required fields location, referral code, etc.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- 2. CREDITS & WALLET SYSTEM
-- Wallets table to hold balances
CREATE TABLE IF NOT EXISTS public.credits_wallet (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INT DEFAULT 50 NOT NULL, -- 50 free credits upon joining!
  total_earned INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wallet Transactions
CREATE TYPE transaction_type AS ENUM ('teaching', 'learning', 'referral', 'bonus', 'exchange');

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id), -- NULL if system bonus
  receiver_id UUID REFERENCES public.profiles(id), -- NULL if spent to system
  amount INT NOT NULL,
  type transaction_type NOT NULL,
  reference_id UUID, -- E.g. Booking ID
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SOCIAL & COMMUNITY
-- Followers mapping
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- Community Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRUST & VERIFICATION SYSTEM
-- Trust Scores
CREATE TABLE IF NOT EXISTS public.trust_scores (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  score INT DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Trust Score Logs
CREATE TABLE IF NOT EXISTS public.trust_score_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  change_amount INT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Verified Reviews (depends on bookings, assuming bookings exists)
CREATE TABLE IF NOT EXISTS public.verified_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID UNIQUE NOT NULL, -- Assuming references bookings(id)
  reviewer_id UUID REFERENCES public.profiles(id),
  provider_id UUID REFERENCES public.profiles(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Anti-Fraud & Flagged Activities
CREATE TABLE IF NOT EXISTS public.flagged_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'investigating',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Community Endorsements
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  skill_id UUID REFERENCES public.skills(id)
);

CREATE TABLE IF NOT EXISTS public.skill_endorsements (
  endorser_id UUID REFERENCES public.profiles(id),
  user_skill_id UUID REFERENCES public.user_skills(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (endorser_id, user_skill_id)
);

-- 5. UPDATES TO EXISTING TABLES
-- Add IP tracking to profiles (using TEXT for simplicity in Supabase if INET is tricky, but we can use TEXT)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_ip TEXT;

-- Add Trial & Pin to bookings (Assuming bookings table exists)
-- ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS completion_pin VARCHAR(4);
-- ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS proof_status VARCHAR(20) DEFAULT 'pending';
-- ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT FALSE;

-- Add Escrow to wallet
ALTER TABLE public.credits_wallet ADD COLUMN IF NOT EXISTS tokens_in_escrow INT DEFAULT 0;

