'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/auth-provider';
import { DEFAULT_PROFILE, type Profile } from '@/lib/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      const { error } = await supabase.from('profiles').upsert({
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
      });
      if (error) throw error;
      toast.success('Settings saved.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your site availability and contact details.</p>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Availability</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="availability_text">Availability Banner Text</Label>
              <Input id="availability_text" value={profile.availability_text} onChange={(e) => update('availability_text', e.target.value)} />
              <p className="text-xs text-muted-foreground">This appears in the top announcement bar on your public site.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Contact Email</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
              <p className="text-xs text-muted-foreground">Used for contact links and message replies.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">Social Links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Check className="h-4 w-4" /> Save Settings</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
