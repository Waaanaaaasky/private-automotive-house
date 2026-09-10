CREATE TABLE public.private_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 5 AND 30),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('acquire', 'sell', 'consignment', 'general')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.private_inquiries TO anon, authenticated;
GRANT ALL ON public.private_inquiries TO service_role;
ALTER TABLE public.private_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit private inquiries"
ON public.private_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND char_length(name) BETWEEN 1 AND 100
  AND char_length(whatsapp) BETWEEN 5 AND 30
  AND char_length(email) BETWEEN 3 AND 255
  AND inquiry_type IN ('acquire', 'sell', 'consignment', 'general')
  AND char_length(message) BETWEEN 1 AND 2000
);