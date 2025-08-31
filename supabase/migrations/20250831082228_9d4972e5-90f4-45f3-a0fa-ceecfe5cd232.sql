-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public) VALUES ('books', 'books', false);

-- Create policies for book uploads
CREATE POLICY "Users can view books they have access to" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books');

CREATE POLICY "Users can upload books" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'books');

CREATE POLICY "Users can update their own books" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'books');

CREATE POLICY "Users can delete their own books" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'books');