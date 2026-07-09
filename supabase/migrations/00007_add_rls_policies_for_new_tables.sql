
-- Enable RLS on all new tables
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery ENABLE ROW LEVEL SECURITY;

-- about_us: everyone can read, only admin can modify
CREATE POLICY "about_us select all" ON about_us FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "about_us admin all" ON about_us FOR ALL TO authenticated USING (is_admin());

-- company_journey: everyone can read, only admin can modify
CREATE POLICY "company_journey select all" ON company_journey FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "company_journey admin all" ON company_journey FOR ALL TO authenticated USING (is_admin());

-- company_gallery: everyone can read, only admin can modify
CREATE POLICY "company_gallery select all" ON company_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "company_gallery admin all" ON company_gallery FOR ALL TO authenticated USING (is_admin());

-- company_statistics: everyone can read, only admin can modify
CREATE POLICY "company_statistics select all" ON company_statistics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "company_statistics admin all" ON company_statistics FOR ALL TO authenticated USING (is_admin());

-- why_choose_us: everyone can read, only admin can modify
CREATE POLICY "why_choose_us select all" ON why_choose_us FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "why_choose_us admin all" ON why_choose_us FOR ALL TO authenticated USING (is_admin());

-- services: everyone can read active, only admin can modify
CREATE POLICY "services select all" ON services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services admin all" ON services FOR ALL TO authenticated USING (is_admin());

-- service_gallery: everyone can read, only admin can modify
CREATE POLICY "service_gallery select all" ON service_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "service_gallery admin all" ON service_gallery FOR ALL TO authenticated USING (is_admin());
