import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import CheckInWizard from '@/components/neuro/CheckInWizard';
import DiagnosisCard from '@/components/neuro/DiagnosisCard';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUser } from '@clerk/clerk-react';

export default function Estado() {
  const { user: clerkUser } = useUser();
  const [checkIn, setCheckIn] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (userEmail) {
      base44.entities.CheckIn.filter({ user_email: userEmail }, '-created_date', 5)
        .then(setHistory);
    }
  }, [userEmail]);

  async function handleComplete(data) {
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const saved = await base44.entities.CheckIn.create({
      ...data,
      user_email: userEmail,
      date: today,
    });
    setCheckIn(saved);
    setDone(true);
    setSaving(false);
    base44.entities.CheckIn.filter({ user_email: userEmail }, '-created_date', 5).then(setHistory);
  }

  function reset() {
    setCheckIn(null);
    setDone(false);
  }

  const nervousLabels = { regulado: '🟢', activado: '🟡', colapsado: '🔴' };

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Check-in</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Mi Estado</h1>
        <p className="text-sm text-muted-foreground mt-1">El núcleo de tu práctica neuro</p>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-card border border-border rounded-3xl p-6">
              <CheckInWizard onComplete={handleComplete} loading={saving} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <DiagnosisCard checkIn={checkIn} />
            <Button variant="outline" onClick={reset} className="w-full gap-2 rounded-xl">
              <RotateCcw size={15} /> Nuevo check-in
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historial */}
      {history.length > 0 && !done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="mt-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-widest">Historial reciente</h2>
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{nervousLabels[item.nervous_system] || '⚪'}</span>
                  <div>
                    <p className="text-sm font-medium capitalize">{item.nervous_system}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.emotion} · {item.mind}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.date ? format(new Date(item.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
