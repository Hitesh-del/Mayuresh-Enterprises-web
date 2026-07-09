
-- Create images bucket if not exists
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('images', 'images', true, false)
ON CONFLICT (id) DO NOTHING;
