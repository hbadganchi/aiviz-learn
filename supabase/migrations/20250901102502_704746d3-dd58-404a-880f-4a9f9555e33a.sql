-- Create notes table for the Digital Library Books Lab
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject_id TEXT NOT NULL,
  file_path TEXT,
  file_type TEXT,
  file_size INTEGER,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  content_preview TEXT,
  ai_summary TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own notes" 
ON public.notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_subject_id ON public.notes(subject_id);
CREATE INDEX idx_notes_tags ON public.notes USING GIN(tags);
CREATE INDEX idx_notes_upload_date ON public.notes(upload_date DESC);
CREATE INDEX idx_notes_title_search ON public.notes USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Create subjects table for better organization
CREATE TABLE public.subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default subjects
INSERT INTO public.subjects (id, name, icon, color, description) VALUES
  ('mathematics', 'Mathematics', 'Calculator', 'bg-blue-500', 'Numbers, equations, and mathematical concepts'),
  ('science', 'Science', 'Atom', 'bg-green-500', 'Physics, chemistry, biology, and scientific methods'),
  ('geography', 'Geography', 'Globe', 'bg-yellow-500', 'World geography, maps, and earth sciences'),
  ('history', 'History', 'Users', 'bg-red-500', 'Historical events, dates, and civilizations'),
  ('art', 'Art', 'Palette', 'bg-purple-500', 'Visual arts, drawing, painting, and creativity'),
  ('music', 'Music', 'Music', 'bg-pink-500', 'Musical theory, instruments, and compositions'),
  ('health', 'Health', 'Heart', 'bg-orange-500', 'Health education, wellness, and medical knowledge'),
  ('literature', 'Literature', 'BookOpen', 'bg-indigo-500', 'Books, poetry, and literary analysis'),
  ('language', 'Language', 'Languages', 'bg-teal-500', 'Foreign languages and linguistics'),
  ('technology', 'Technology', 'Computer', 'bg-gray-500', 'Computer science, programming, and tech concepts');