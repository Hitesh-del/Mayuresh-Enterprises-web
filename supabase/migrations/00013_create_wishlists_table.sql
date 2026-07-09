CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- SELECT: users can view their own wishlist
CREATE POLICY select_own_wishlist
  ON wishlists
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT: users can add to their own wishlist
CREATE POLICY insert_own_wishlist
  ON wishlists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- DELETE: users can remove from their own wishlist
CREATE POLICY delete_own_wishlist
  ON wishlists
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Anon: no access
CREATE POLICY anon_no_wishlist_select
  ON wishlists
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY anon_no_wishlist_insert
  ON wishlists
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY anon_no_wishlist_delete
  ON wishlists
  FOR DELETE
  TO anon
  USING (false);