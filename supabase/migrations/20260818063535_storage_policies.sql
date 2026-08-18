/*
# Storage policies for portfolio media buckets

## Overview
Sets public read access and authenticated write access for the three media buckets: profile-media, project-media, skill-media.

## Security
- Public (anon) can SELECT (read) objects in all three buckets.
- Authenticated users can INSERT/UPDATE/DELETE objects.
*/

-- profile-media
DROP POLICY IF EXISTS "public_read_profile_media" ON storage.objects;
CREATE POLICY "public_read_profile_media" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'profile-media');

DROP POLICY IF EXISTS "admin_insert_profile_media" ON storage.objects;
CREATE POLICY "admin_insert_profile_media" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'profile-media');

DROP POLICY IF EXISTS "admin_update_profile_media" ON storage.objects;
CREATE POLICY "admin_update_profile_media" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'profile-media') WITH CHECK (bucket_id = 'profile-media');

DROP POLICY IF EXISTS "admin_delete_profile_media" ON storage.objects;
CREATE POLICY "admin_delete_profile_media" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'profile-media');

-- project-media
DROP POLICY IF EXISTS "public_read_project_media" ON storage.objects;
CREATE POLICY "public_read_project_media" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "admin_insert_project_media" ON storage.objects;
CREATE POLICY "admin_insert_project_media" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'project-media');

DROP POLICY IF EXISTS "admin_update_project_media" ON storage.objects;
CREATE POLICY "admin_update_project_media" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'project-media') WITH CHECK (bucket_id = 'project-media');

DROP POLICY IF EXISTS "admin_delete_project_media" ON storage.objects;
CREATE POLICY "admin_delete_project_media" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'project-media');

-- skill-media
DROP POLICY IF EXISTS "public_read_skill_media" ON storage.objects;
CREATE POLICY "public_read_skill_media" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'skill-media');

DROP POLICY IF EXISTS "admin_insert_skill_media" ON storage.objects;
CREATE POLICY "admin_insert_skill_media" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'skill-media');

DROP POLICY IF EXISTS "admin_update_skill_media" ON storage.objects;
CREATE POLICY "admin_update_skill_media" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'skill-media') WITH CHECK (bucket_id = 'skill-media');

DROP POLICY IF EXISTS "admin_delete_skill_media" ON storage.objects;
CREATE POLICY "admin_delete_skill_media" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'skill-media');