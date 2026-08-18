'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/lib/types';
import { SKILL_CATEGORIES } from '@/lib/types';
import { toast } from 'sonner';

const EMPTY: Omit<Skill, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  category: 'AI',
  icon_url: '',
  display_order: 0,
  is_visible: true,
};

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('category').order('display_order');
    setSkills(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY, display_order: skills.length });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (s: Skill) => {
    setForm({
      name: s.name, category: s.category, icon_url: s.icon_url ?? '',
      display_order: s.display_order, is_visible: s.is_visible,
    });
    setEditing(s);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Skill name is required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('skills').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Skill updated.');
      } else {
        const { error } = await supabase.from('skills').insert(form);
        if (error) throw error;
        toast.success('Skill created.');
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
      const { error } = await supabase.from('skills').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Skill deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.');
    }
  };

  const toggleVisible = async (s: Skill) => {
    await supabase.from('skills').update({ is_visible: !s.is_visible }).eq('id', s.id);
    await load();
  };

  const move = async (s: Skill, dir: -1 | 1) => {
    const sameCategory = skills.filter((x) => x.category === s.category);
    const idx = sameCategory.findIndex((x) => x.id === s.id);
    const target = sameCategory[idx + dir];
    if (!target) return;
    await Promise.all([
      supabase.from('skills').update({ display_order: target.display_order }).eq('id', s.id),
      supabase.from('skills').update({ display_order: s.display_order }).eq('id', target.id),
    ]);
    await load();
  };

  const isOpen = creating || !!editing;
  const grouped = SKILL_CATEGORIES.map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your technology skills.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Skill</Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : skills.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No skills yet. Add skills to showcase your technology stack.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {grouped.map(({ cat, items }) => items.length > 0 && (
            <div key={cat}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
              <div className="space-y-2">
                {items.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
                    <div className="flex flex-col">
                      <button onClick={() => move(s, -1)} disabled={i === 0} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => move(s, 1)} disabled={i === items.length - 1} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex-1">
                      <span className="font-display text-sm font-semibold">{s.name}</span>
                    </div>
                    {!s.is_visible && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Hidden</span>}
                    <button onClick={() => toggleVisible(s)} className="text-muted-foreground hover:text-foreground">
                      {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Next.js" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon URL (optional)</Label>
              <Input value={form.icon_url ?? ''} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
              <Label>Visible on public site</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? 'Save Changes' : 'Create Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete skill?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The skill will be permanently removed.</AlertDialogDescription>
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
