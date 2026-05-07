import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { nervousSystemConfig } from './StateCard';

const diagnoses = {
  regulado: {
    title: 'Tu sistema nervioso está regulado',
    body: 'Estás en un estado óptimo para aprender, conectar y rendir. Es el momento ideal para trabajar en objetivos exigentes.',
    cta: 'Explorar lecciones',
    ctaTo: '/aprender',
  },
  activado: {
    title: 'Alta activación detectada',
    body: 'Tenés energía disponible pero tu sistema está en modo alerta. Con técnicas correctas podés convertir esa activación en rendimiento.',
    cta: 'Regular ahora',
    ctaTo: '/regular',
  },
  colapsado: {
    title: 'Tu sistema necesita recuperación',
    body: 'Estás en modo supervivencia. No es el momento de exigirte. Priorizá técnicas suaves de regulación y recuperación.',
    cta: 'Iniciar regulación',
    ctaTo: '/regular',
  },
};

export default function DiagnosisCard({ checkIn }) {
  const config = nervousSystemConfig[checkIn.nervous_system];
  const diagnosis = diagnoses[checkIn.nervous_system];
  if (!config || !diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden bg-card border border-border shadow-sm"
    >
      <div className={`px-6 pt-6 pb-4 ${
        checkIn.nervous_system === 'regulado' ? 'bg-emerald-50' :
        checkIn.nervous_system === 'activado' ? 'bg-amber-50' : 'bg-rose-50'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Diagnóstico</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 rounded-full ${config.dot}`} />
          <span className="font-semibold text-sm">{config.label}</span>
        </div>
        <h3 className="font-serif text-xl text-foreground">{diagnosis.title}</h3>
      </div>

      <div className="px-6 py-4 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{diagnosis.body}</p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: 'Emoción', value: checkIn.emotion },
            { label: 'Cuerpo', value: checkIn.body },
            { label: 'Mente', value: checkIn.mind },
          ].filter(x => x.value).map(({ label, value }) => (
            <div key={label} className="bg-muted rounded-xl p-2.5 text-center">
              <div className="text-muted-foreground mb-0.5">{label}</div>
              <div className="font-medium capitalize text-foreground">{value}</div>
            </div>
          ))}
        </div>

        <Button asChild className="w-full gap-1 rounded-xl">
          <Link to={diagnosis.ctaTo}>
            {diagnosis.cta} <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}