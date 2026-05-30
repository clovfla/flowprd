-- Run ini di Supabase SQL Editor untuk fix user yang belum punya subscription

-- Auto-create subscription untuk user yang belum punya
INSERT INTO subscriptions (user_id, plan)
SELECT id, 'free'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT DO NOTHING;

-- Pastikan RLS policies lengkap (kalau belum ada)
DO $$
BEGIN
  -- Subscription policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own subscription') THEN
    CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own subscription') THEN
    CREATE POLICY "Users can insert own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own subscription') THEN
    CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Usage policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own usage') THEN
    CREATE POLICY "Users can read own usage" ON usage FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own usage') THEN
    CREATE POLICY "Users can insert own usage" ON usage FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own usage') THEN
    CREATE POLICY "Users can update own usage" ON usage FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
```

Copy paste ke Supabase SQL Editor → Run.
