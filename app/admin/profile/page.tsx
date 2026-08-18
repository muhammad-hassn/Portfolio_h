'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, Upload, Trash2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/auth-provider';
import { DEFAULT_PROFILE, type Profile } from '@/lib/types';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').maybeSingle();
      if (data) setProfile(data);
      setLoading(false);
    })();
  }, []);

  const update = (field: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        id: user.id,
        name: profile.name,
        professional_title: profile.professional_title,
        hero_headline: profile.hero_headline,
        hero_description: profile.hero_description,
        about: profile.about,
        profile_image_url: profile.profile_image_url,
        email: profile.email,
        location: profile.location,
        availability_text: profile.availability_text,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        website_url: profile.website_url,
      };

      const { error } = await supabase.from('profiles').upsert(payload);
      if (error) throw error;
      toast.success('Profile saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `profile-${user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-media')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('profile-media').getPublicUrl(path);
      setProfile((p) => ({ ...p, profile_image_url: urlData.publicUrl }));
      toast.success('Image uploaded.');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setProfile((p) => ({ ...p, profile_image_url: null }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your public profile and hero content.</p>

      <div className="mt-8 space-y-8">
        {/* Profile image */}
        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Profile Image</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload</>}
              </Button>
              {profile.profile_image_url && (
                <Button variant="outline" size="sm" onClick={removeImage} className="text-destructive">
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Hero content */}
        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Hero Content</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_headline">Hero Headline</Label>
              <Input id="hero_headline" value={profile.hero_headline} onChange={(e) => update('hero_headline', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_description">Hero Description</Label>
              <Textarea id="hero_description" value={profile.hero_description} onChange={(e) => update('hero_description', e.target.value)} rows={3} />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">About Content</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={profile.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional_title">Professional Title</Label>
              <Input id="professional_title" value={profile.professional_title} onChange={(e) => update('professional_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea id="about" value={profile.about} onChange={(e) => update('about', e.target.value)} rows={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability_text">Availability Text</Label>
              <Input id="availability_text" value={profile.availability_text} onChange={(e) => update('availability_text', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Contact & Social</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={profile.location} onChange={(e) => update('location', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" value={profile.github_url ?? ''} onChange={(e) => update('github_url', e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" value={profile.linkedin_url ?? ''} onChange={(e) => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input id="website_url" value={profile.website_url ?? ''} onChange={(e) => update('website_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Check className="h-4 w-4" /> Save Profile</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
