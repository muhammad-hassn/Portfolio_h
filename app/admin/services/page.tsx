'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/lib/types';
import { toast } from 'sonner';

const EMPTY: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  short_description: '',
  description: '',
  icon: '',
  cta_text: '',
  display_order: 0,
  is_visible: true,
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order');
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY, display_order: services.length });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (s: Service) => {
    setForm({
      title: s.title, short_description: s.short_description, description: s.description ?? '',
      icon: s.icon ?? '', cta_text: s.cta_text ?? '', display_order: s.display_order, is_visible: s.is_visible,
    });
    setEditing(s);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.short_description.trim()) {
      toast.error('Title and short description are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('services').update(form).eq('id', editing.id);
        if (error) throw error;
        toast.success('Service updated.');
      } else {
        const { error } = await supabase.from('services').insert(form);
        if (error) throw error;
        toast.success('Service created.');
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
      const { error } = await supabase.from('services').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Service deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.');
    }
  };

  const toggleVisible = async (s: Service) => {
    await supabase.from('services').update({ is_visible: !s.is_visible }).eq('id', s.id);
    await load();
  };

  const move = async (s: Service, dir: -1 | 1) => {
    const idx = services.findIndex((x) => x.id === s.id);
    const target = services[idx + dir];
    if (!target) return;
    await Promise.all([
      supabase.from('services').update({ display_order: target.display_order }).eq('id', s.id),
      supabase.from('services').update({ display_order: s.display_order }).eq('id', target.id),
    ]);
    await load();
  };

  const isOpen = creating || !!editing;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your service offerings.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : services.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No services yet. Add services to start building your public offer.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {services.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
              <div className="flex flex-col">
                <button onClick={() => move(s, -1)} disabled={i === 0} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(s, 1)} disabled={i === services.length - 1} className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20"><ArrowDown className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold">{s.title}</h3>
                  {!s.is_visible && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Hidden</span>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{s.short_description}</p>
              </div>
              <button onClick={() => toggleVisible(s)} className="text-muted-foreground hover:text-foreground">
                {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AI Applications" />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Build custom AI-powered tools..." />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon (lucide name)</Label>
                <Input value={form.icon ?? ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="BrainCircuit" />
              </div>
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input value={form.cta_text ?? ''} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="Build an AI Solution" />
              </div>
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
              {editing ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The service will be permanently removed.</AlertDialogDescription>
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
