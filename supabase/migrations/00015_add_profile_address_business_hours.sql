ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS business_hours text;

UPDATE public.user_profiles
SET address = COALESCE(address, 'Shop No. 2, Govind Smruti, Somjai Nagar Road, Khopoli, Taluka Khalapur, District Raigad, Maharashtra – 410203, India'),
    business_hours = COALESCE(business_hours, 'Mon - Sat: 9:00 AM - 7:00 PM')
WHERE address IS NULL OR business_hours IS NULL;