'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import type { Problem } from '@/lib/types';
import { toast } from 'sonner';

const EMPTY: Omit<Problem, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: '',
  solution: '',
  display_order: 0,
  is_visible: true,
};

export default function ProblemsAdmin() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Problem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('problems').select('*').order('display_order');
    setProblems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY, display_order: problems.length });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Problem) => {
    setForm({
      title: p.title, description: p.description, solution: p.solution ?? '',
      display_order: p.display_order, is_visible: p.is_visible,
    });
    setEditing(p);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('problems').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Problem updated.');
      } else {
        const { error } = await supabase.from('problems').insert(form);
        if (error) throw error;
        toast.success('Problem created.');
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
      const { error } = await supabase.from('problems').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Problem deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.');
    }
  };

  const toggleVisible = async (p: Problem) => {
    await supabase.from('problems').update({ is_visible: !p.is_visible }).eq('id', p.id);
    await load();
  };

  const move = async (p: Problem, dir: -1 | 1) => {
    const idx = problems.findIndex((x) => x.id === p.id);
    const target = problems[idx + dir];
    if (!target) return;
    await Promise.all([
      supabase.from('problems').update({ display_order: target.display_order }).eq('id', p.id),
      supabase.from('problems').update({ display_order: p.display_order }).eq('id', target.id),
    ]);
    await load();
  };

  const isOpen = creating || !!editing;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Problems</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the business problems you solve.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Problem</Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : problems.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No problems yet. Add problems to help visitors recognize their pain points.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {problems.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
              <div className="flex flex-col">
                <button onClick={() => move(p, -1)} disabled={i === 0} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(p, 1)} disabled={i === problems.length - 1} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowDown className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold">{p.title}</h3>
                  {!p.is_visible && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Hidden</span>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.description}</p>
              </div>
              <button onClick={() => toggleVisible(p)} className="text-muted-foreground hover:text-foreground">
                {p.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleteId(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Problem' : 'Add Problem'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Getting Too Many Repetitive Emails?" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="I can build an AI-powered system that..." />
            </div>
            <div className="space-y-2">
              <Label>Solution</Label>
              <Textarea value={form.solution ?? ''} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} placeholder="AI-powered email classification and routing system..." />
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
              {editing ? 'Save Changes' : 'Create Problem'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete problem?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The problem will be permanently removed.</AlertDialogDescription>
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
