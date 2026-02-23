-- RLS Policies for CarTrust

-- 1. Users table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

CREATE POLICY "Admins can read all users"
ON "User" FOR SELECT
USING (EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'));

-- 2. Vehicles table
ALTER TABLE "Vehicle" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved listings"
ON "Vehicle" FOR SELECT
USING (is_approved = true AND is_suspended = false);

CREATE POLICY "Sellers can manage their own listings"
ON "Vehicle" FOR ALL
USING (seller_id = auth.uid()::text);

CREATE POLICY "Admins can manage all listings"
ON "Vehicle" FOR ALL
USING (EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'));

-- 3. Vehicle Media table
ALTER TABLE "VehicleMedia" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle media"
ON "VehicleMedia" FOR SELECT
USING (EXISTS (SELECT 1 FROM "Vehicle" WHERE id = vehicle_id AND is_approved = true));

CREATE POLICY "Sellers can manage their own vehicle media"
ON "VehicleMedia" FOR ALL
USING (EXISTS (SELECT 1 FROM "Vehicle" WHERE id = vehicle_id AND seller_id = auth.uid()::text));

-- 4. Storage Policies (Supabase Storage)
-- Assuming 'vehicles' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'vehicles' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'vehicles' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING ( bucket_id = 'vehicles' AND auth.uid()::text = (storage.foldername(name))[1] );
