import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen, Zap, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const tabs = [
  { id: 'lessons', label: 'Lecciones', icon: BookOpen },
  { id: 'interventions', label: 'Intervenciones', icon: Zap },
];

const emptyLesson = { title: '', summary: '', content: '', category: 'sistema_nervioso', duration_minutes: '', cover_image_url: '', video_url: '', order: 0, is_published: false };
const emptyIntervention = { title: '', description: '', type: 'respiracion', target_state: 'todos', duration_minutes: '', instructions: '', video_url: '', audio_url: '', is_active: true };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    base44.auth.me().then(setUser);
    loadAll();
  }, []);

  async function loadAll() {
    const [ls, ints] = await Promise.all([
      base44.entities.NeuroLesson.list('-created_date', 50),
      base44.entities.Intervention.list('-created_date', 50),
    ]);
    setLessons(ls);
    setInterventions(ints);
  }

  async function saveLesson() {
    const data = { ...editingLesson };
    if (data.duration_minutes) data.duration_minutes = Number(data.duration_minutes);
    if (data.order) data.order = Number(data.order);
    if (data.id) {
      await base44.entities.NeuroLesson.update(data.id, data);
    } else {
      await base44.entities.NeuroLesson.create(data);
    }
    toast({ title: 'Lección guardada ✓' });
    setEditingLesson(null);
    loadAll();
  }

  async function saveIntervention() {
    const data = { ...editingIntervention };
    if (data.duration_minutes) data.duration_minutes = Number(data.duration_minutes);
    if (data.id) {
      await base44.entities.Intervention.update(data.id, data);
    } else {
      await base44.entities.Intervention.create(data);
    }
    toast({ title: 'Intervención guardada ✓' });
    setEditingIntervention(null);
    loadAll();
  }

  async function deleteLesson(id) {
    await base44.entities.NeuroLesson.delete(id);
    toast({ title: 'Lección eliminada' });
    loadAll();
  }

  async function deleteIntervention(id) {
    await base44.entities.Intervention.delete(id);
    toast({ title: 'Intervención eliminada' });
    loadAll();
  }

  if (user?.role !== 'admin') {
    return (
      <div className="px-6 pt-12 text-center">
        <p className="text-muted-foreground">Acceso solo para administradores</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Panel</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Administración</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Lessons tab */}
      {tab === 'lessons' && (
        <div className="space-y-3">
          <Button onClick={() => setEditingLesson({ ...emptyLesson })} className="w-full gap-2 rounded-xl" variant="outline">
            <Plus size={15} /> Nueva lección
          </Button>
          {lessons.map(lesson => (
            <div key={lesson.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {lesson.is_published ? <Eye size={13} className="text-primary" /> : <EyeOff size={13} className="text-muted-foreground" />}
                    <p className="text-sm font-medium text-foreground line-clamp-1">{lesson.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{lesson.category?.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingLesson({ ...lesson })} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteLesson(lesson.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interventions tab */}
      {tab === 'interventions' && (
        <div className="space-y-3">
          <Button onClick={() => setEditingIntervention({ ...emptyIntervention })} className="w-full gap-2 rounded-xl" variant="outline">
            <Plus size={15} /> Nueva intervención
          </Button>
          {interventions.map(i => (
            <div key={i.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{i.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{i.type} · {i.target_state}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingIntervention({ ...i })} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteIntervention(i.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lesson Form Modal */}
      <AnimatePresence>
        {editingLesson && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-t-3xl w-full max-w-md p-6 pb-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-lg">{editingLesson.id ? 'Editar' : 'Nueva'} lección</h2>
                <button onClick={() => setEditingLesson(null)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div><Label>Título *</Label><Input value={editingLesson.title} onChange={e => setEditingLesson(p => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
                <div><Label>Resumen</Label><Input value={editingLesson.summary} onChange={e => setEditingLesson(p => ({ ...p, summary: e.target.value }))} className="mt-1" /></div>
                <div>
                  <Label>Categoría</Label>
                  <Select value={editingLesson.category} onValueChange={v => setEditingLesson(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['sistema_nervioso','emociones','habitos','recuperacion','rendimiento','respiracion'].map(c => (
                        <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Duración (min)</Label><Input type="number" value={editingLesson.duration_minutes} onChange={e => setEditingLesson(p => ({ ...p, duration_minutes: e.target.value }))} className="mt-1" /></div>
                <div><Label>URL imagen de portada</Label><Input value={editingLesson.cover_image_url} onChange={e => setEditingLesson(p => ({ ...p, cover_image_url: e.target.value }))} className="mt-1" /></div>
                <div><Label>URL video</Label><Input value={editingLesson.video_url} onChange={e => setEditingLesson(p => ({ ...p, video_url: e.target.value }))} className="mt-1" /></div>
                <div><Label>Orden</Label><Input type="number" value={editingLesson.order} onChange={e => setEditingLesson(p => ({ ...p, order: e.target.value }))} className="mt-1" /></div>
                <div><Label>Contenido (Markdown)</Label><Textarea rows={6} value={editingLesson.content} onChange={e => setEditingLesson(p => ({ ...p, content: e.target.value }))} className="mt-1 font-mono text-xs" /></div>
                <div className="flex items-center gap-2">
                  <Switch checked={editingLesson.is_published} onCheckedChange={v => setEditingLesson(p => ({ ...p, is_published: v }))} />
                  <Label>Publicada</Label>
                </div>
                <Button onClick={saveLesson} className="w-full rounded-xl" disabled={!editingLesson.title}>Guardar lección</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intervention Form Modal */}
      <AnimatePresence>
        {editingIntervention && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-t-3xl w-full max-w-md p-6 pb-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-lg">{editingIntervention.id ? 'Editar' : 'Nueva'} intervención</h2>
                <button onClick={() => setEditingIntervention(null)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div><Label>Título *</Label><Input value={editingIntervention.title} onChange={e => setEditingIntervention(p => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
                <div><Label>Descripción</Label><Textarea rows={3} value={editingIntervention.description} onChange={e => setEditingIntervention(p => ({ ...p, description: e.target.value }))} className="mt-1" /></div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={editingIntervention.type} onValueChange={v => setEditingIntervention(p => ({ ...p, type: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['respiracion','movimiento','mentalidad','recuperacion','nutricion'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado objetivo</Label>
                  <Select value={editingIntervention.target_state} onValueChange={v => setEditingIntervention(p => ({ ...p, target_state: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['todos','regulado','activado','colapsado'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Duración (min)</Label><Input type="number" value={editingIntervention.duration_minutes} onChange={e => setEditingIntervention(p => ({ ...p, duration_minutes: e.target.value }))} className="mt-1" /></div>
                <div><Label>Instrucciones</Label><Textarea rows={4} value={editingIntervention.instructions} onChange={e => setEditingIntervention(p => ({ ...p, instructions: e.target.value }))} className="mt-1" /></div>
                <div><Label>URL video</Label><Input value={editingIntervention.video_url} onChange={e => setEditingIntervention(p => ({ ...p, video_url: e.target.value }))} className="mt-1" /></div>
                <div><Label>URL audio</Label><Input value={editingIntervention.audio_url} onChange={e => setEditingIntervention(p => ({ ...p, audio_url: e.target.value }))} className="mt-1" /></div>
                <div className="flex items-center gap-2">
                  <Switch checked={editingIntervention.is_active} onCheckedChange={v => setEditingIntervention(p => ({ ...p, is_active: v }))} />
                  <Label>Activa</Label>
                </div>
                <Button onClick={saveIntervention} className="w-full rounded-xl" disabled={!editingIntervention.title}>Guardar intervención</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}