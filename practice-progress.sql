CREATE TABLE practice_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  status JSONB NOT NULL DEFAULT '{}',
  notes JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE practice_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice progress" ON practice_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice progress" ON practice_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice progress" ON practice_progress
  FOR UPDATE USING (auth.uid() = user_id);
