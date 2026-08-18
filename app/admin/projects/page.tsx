'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowUp, ArrowDown, Star, Copy, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/lib/types';
import { toast } from 'sonner';

const EMPTY: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  slug: '',
  category: 'AI',
  short_description: '',
  business_problem: '',
  solution: '',
  how_it_works: '',
  outcome: '',
  technologies: [],
  media_type: 'image',
  media_url: '',
  live_url: '',
  github_url: '',
  featured: false,
  is_visible: true,
  display_order: 0,
};

const CATEGORIES = ['AI', 'Automation', 'Web', 'Backend', 'Mobile', 'Custom Software'];

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('featured', { ascending: false }).order('display_order');
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY, display_order: projects.length });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title, slug: p.slug, category: p.category, short_description: p.short_description,
      business_problem: p.business_problem ?? '', solution: p.solution ?? '', how_it_works: p.how_it_works ?? '',
      outcome: p.outcome ?? '', technologies: p.technologies ?? [], media_type: p.media_type,
      media_url: p.media_url ?? '', live_url: p.live_url ?? '', github_url: p.github_url ?? '',
      featured: p.featured, is_visible: p.is_visible, display_order: p.display_order,
    });
    setEditing(p);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.short_description.trim()) {
      toast.error('Title and short description are required.');
      return;
    }
    if (form.media_type === 'video' && !form.media_url) {
      toast.error('Please upload a video or switch to image type.');
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);
    setSaving(true);
    try {
      const payload = { ...form, slug, technologies: form.technologies };
      if (editing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Project updated.');
      } else {
        const { error } = await supabase.from('projects').insert(payload);
        if (error) throw error;
        toast.success('Project created.');
      }
      close();
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Project deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.');
    }
  };

  const duplicate = async (p: Project) => {
    try {
      const { id, created_at, updated_at, ...rest } = p;
      const newSlug = `${p.slug}-copy`;
      const { error } = await supabase.from('projects').insert({
        ...rest,
        slug: newSlug,
        title: `${p.title} (Copy)`,
        featured: false,
      });
      if (error) throw error;
      toast.success('Project duplicated.');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to duplicate.');
    }
  };

  const toggleVisible = async (p: Project) => {
    await supabase.from('projects').update({ is_visible: !p.is_visible }).eq('id', p.id);
    await load();
  };

  const toggleFeatured = async (p: Project) => {
    await supabase.from('projects').update({ featured: !p.featured }).eq('id', p.id);
    await load();
  };

  const move = async (p: Project, dir: -1 | 1) => {
    const idx = projects.findIndex((x) => x.id === p.id);
    const target = projects[idx + dir];
    if (!target) return;
    await Promise.all([
      supabase.from('projects').update({ display_order: target.display_order }).eq('id', p.id),
      supabase.from('projects').update({ display_order: p.display_order }).eq('id', target.id),
    ]);
    await load();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `project-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('project-media').getPublicUrl(path);
      setForm((f) => ({ ...f, media_url: urlData.publicUrl }));
      toast.success('Media uploaded.');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
    }
    setTechInput('');
  };

  const removeTech = (t: string) => {
    setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) });
  };

  const isOpen = creating || !!editing;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Project</Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No projects yet. Add your first project to showcase your work.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
              <div className="flex flex-col">
                <button onClick={() => move(p, -1)} disabled={i === 0} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(p, 1)} disabled={i === projects.length - 1} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowDown className="h-3.5 w-3.5" /></button>
              </div>
              {p.media_url ? (
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                  {p.media_type === 'video' ? (
                    <video src={p.media_url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={p.media_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground/30">
                  <span className="text-xs font-bold">{p.title.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold">{p.title}</h3>
                  {p.featured && <Star className="h-3.5 w-3.5 fill-warning text-warning" />}
                  {!p.is_visible && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Hidden</span>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.short_description}</p>
              </div>
              <button onClick={() => toggleFeatured(p)} className="text-muted-foreground hover:text-warning" title="Toggle featured">
                <Star className={`h-4 w-4 ${p.featured ? 'fill-warning text-warning' : ''}`} />
              </button>
              <button onClick={() => toggleVisible(p)} className="text-muted-foreground hover:text-foreground">
                {p.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => duplicate(p)} className="text-muted-foreground hover:text-foreground" title="Duplicate">
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleteId(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => {
                  setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) });
                }} placeholder="AI Email Assistant" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="ai-email-assistant" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="A brief, business-focused summary..." />
            </div>

            <div className="space-y-2">
              <Label>Business Problem</Label>
              <Textarea value={form.business_problem ?? ''} onChange={(e) => setForm({ ...form, business_problem: e.target.value })} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Solution</Label>
              <Textarea value={form.solution ?? ''} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>How It Works</Label>
              <Textarea value={form.how_it_works ?? ''} onChange={(e) => setForm({ ...form, how_it_works: e.target.value })} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Outcome (optional)</Label>
              <Textarea value={form.outcome ?? ''} onChange={(e) => setForm({ ...form, outcome: e.target.value })} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="Type and press Enter..." />
                <Button type="button" variant="outline" onClick={addTech}>Add</Button>
              </div>
              {form.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.technologies.map((t) => (
                    <span key={t} className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs">
                      {t}
                      <button onClick={() => removeTech(t)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Project Media</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, media_type: 'image', media_url: '' })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${form.media_type === 'image' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                >Image</button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, media_type: 'video', media_url: '' })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${form.media_type === 'video' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                >Video</button>
              </div>
              {form.media_url ? (
                <div className="relative mt-2 overflow-hidden rounded-lg border border-border bg-background">
                  {form.media_type === 'video' ? (
                    <video src={form.media_url} className="h-40 w-full object-cover" controls muted />
                  ) : (
                    <img src={form.media_url} alt="Preview" className="h-40 w-full object-cover" />
                  )}
                  <button onClick={() => setForm({ ...form, media_url: '' })} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <input ref={fileRef} type="file" accept={form.media_type === 'image' ? 'image/*' : 'video/mp4,video/webm'} onChange={handleUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-card/30 p-6 text-muted-foreground transition-colors hover:border-primary/40"
                  >
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                    <span className="text-sm">{uploading ? 'Uploading...' : `Upload ${form.media_type}`}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input value={form.live_url ?? ''} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input value={form.github_url ?? ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
                <Label>Visible</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The project will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
