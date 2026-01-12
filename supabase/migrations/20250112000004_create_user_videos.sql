-- Migration: Create user_videos table
-- Description: History of generated videos

CREATE TABLE IF NOT EXISTS public.user_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  title TEXT,
  duration INTEGER,
  file_size TEXT,
  template TEXT,
  articles_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_videos_user_id ON public.user_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_videos_created_at ON public.user_videos(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_videos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own videos" ON public.user_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos" ON public.user_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON public.user_videos
  FOR DELETE USING (auth.uid() = user_id);

-- Comment
COMMENT ON TABLE public.user_videos IS 'History of generated videos';
