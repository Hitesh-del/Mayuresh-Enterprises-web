
-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 500,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can create an enquiry
CREATE POLICY "Allow anyone to create enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own enquiries
CREATE POLICY "Users can view own enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin can view all enquiries
CREATE POLICY "Admin can view all enquiries"
  ON enquiries FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admin can update enquiries
CREATE POLICY "Admin can update enquiries"
  ON enquiries FOR UPDATE
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admin can delete enquiries
CREATE POLICY "Admin can delete enquiries"
  ON enquiries FOR DELETE
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));
