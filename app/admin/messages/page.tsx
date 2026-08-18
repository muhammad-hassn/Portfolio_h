'use client';

import { useEffect, useState } from 'react';
import { Archive, Trash2, Reply, Loader2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import type { ContactMessage } from '@/lib/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FILTERS = ['All', 'Unread', 'Website', 'AI', 'Automation', 'API', 'Mobile', 'Custom Software'];

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = messages.filter((m) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return m.status === 'unread';
    return m.project_type.toLowerCase().includes(filter.toLowerCase());
  });

  const openMessage = async (m: ContactMessage) => {
    setSelected(m);
    if (m.status === 'unread') {
      await supabase.from('contact_messages').update({ status: 'read' }).eq('id', m.id);
      await load();
    }
  };

  const archive = async (m: ContactMessage) => {
    await supabase.from('contact_messages').update({ status: 'archived' }).eq('id', m.id);
    setSelected(null);
    await load();
    toast.success('Message archived.');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await supabase.from('contact_messages').delete().eq('id', deleteId);
      toast.success('Message deleted.');
      setDeleteId(null);
      setSelected(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.');
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inbox of client inquiries from your contact form.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
              filter === f
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/30 p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No messages yet. New client inquiries will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => openMessage(m)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 p-4 text-left transition-colors hover:border-primary/30"
            >
              <div className={`flex h-2 w-2 shrink-0 rounded-full ${m.status === 'unread' ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold truncate ${m.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {m.name}
                  </span>
                  {m.status === 'unread' && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">New</span>}
                  {m.status === 'archived' && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Archived</span>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">{m.message}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">{m.project_type}</p>
                <p className="text-[10px] text-muted-foreground/60">{format(new Date(m.created_at), 'MMM d, yyyy')}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Project Type: </span>
                    <span>{selected.project_type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Received: </span>
                    <span>{format(new Date(selected.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</span>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{selected.message}</p>
                </div>
              </div>
              <DialogFooter className="flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: Your project inquiry`}>
                  <Button variant="outline"><Reply className="h-4 w-4" /> Reply via Email</Button>
                </a>
                {selected.status !== 'archived' && (
                  <Button variant="outline" onClick={() => archive(selected)}><Archive className="h-4 w-4" /> Archive</Button>
                )}
                <Button variant="destructive" onClick={() => setDeleteId(selected.id)}><Trash2 className="h-4 w-4" /> Delete</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The message will be permanently removed.</AlertDialogDescription>
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
