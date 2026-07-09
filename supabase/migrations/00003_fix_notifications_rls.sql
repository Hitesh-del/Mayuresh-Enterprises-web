
-- Create SECURITY DEFINER function for admin notification creation
CREATE OR REPLACE FUNCTION create_notification(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS SETOF notifications
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO notifications (title, message, type, user_id, is_read)
  VALUES (p_title, p_message, p_type, p_user_id, false)
  RETURNING *;
END;
$$;

-- Grant execute permission to anon and authenticated
GRANT EXECUTE ON FUNCTION create_notification(TEXT, TEXT, TEXT, UUID) TO anon, authenticated;
