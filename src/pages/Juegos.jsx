import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Brain, Zap, Grid2X2, Anchor, Snowflake, Heart, Flower2, Calculator, BookHeart } from 'lucide-react';
import BreathingGame from '@/components/games/BreathingGame';
import FocusGame from '@/components/games/FocusGame';
import ReactionGame from '@/components/games/ReactionGame';
import MemoryGame from '@/components/games/MemoryGame';
import GroundingGame from '@/components/games/GroundingGame';
import ColdExposureGame from '@/components/games/ColdExposureGame';
import GratitudeGame from '@/components/games/GratitudeGame';
import HRVGame from '@/components/games/HRVGame';
import MindfulnessGame from '@/components/games/MindfulnessGame';
import StressInoculationGame from '@/components/games/StressInoculationGame';

const games = [
  {
    id: 'breathing',
    title: 'Respiración Coherente',
    description: 'Sincronizá tu respiración para calmar el SN',
    icon: Wind,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    tag: 'Regulación',
  },
  {
    id: 'focus',
    title: 'Atención Sostenida',
    description: 'Efecto Stroop para entrenar el foco ejecutivo',
    icon: Brain,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    tag: 'Cognición',
  },
  {
    id: 'reaction',
    title: 'Tiempo de Reacción',
    description: 'Medí la velocidad de respuesta de tu SN',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    tag: 'Velocidad',
  },
  {
    id: 'memory',
    title: 'Memoria de Trabajo',
    description: 'Secuencias de colores para la memoria ejecutiva',
    icon: Grid2X2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    tag: 'Memoria',
  },
  {
    id: 'grounding',
    title: 'Técnica 5-4-3-2-1',
    description: 'Anclaje sensorial para salir de la ansiedad',
    icon: Anchor,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    tag: 'Ansiedad',
  },
  {
    id: 'cold',
    title: 'Ducha Fría',
    description: 'Timer para exposición al frío y resiliencia del SN',
    icon: Snowflake,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    tag: 'Resiliencia',
  },
  {
    id: 'gratitude',
    title: 'Diario de Gratitud',
    description: 'Activa el circuito de bienestar con 3 preguntas',
    icon: BookHeart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    tag: 'Bienestar',
  },
  {
    id: 'hrv',
    title: 'Coherencia Cardíaca',
    description: '5 min de respiración sincronizada para mejorar el HRV',
    icon: Heart,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    tag: 'HRV',
  },
  {
    id: 'mindfulness',
    title: 'Meditación',
    description: 'Sesión guiada con contador de pensamientos',
    icon: Flower2,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    tag: 'Mindfulness',
  },
  {
    id: 'stress',
    title: 'Inoculación de Estrés',
    description: 'Matemática bajo presión para entrenar el SN activado',
    icon: Calculator,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    tag: 'Estrés',
  },
];

export default function Juegos() {
  const [activeGame, setActiveGame] = useState(null);
  const game = games.find(g => g.id === activeGame);

  return (
    <div className="px-6 pt-12 pb-8">
      {!activeGame ? (
        <>
          <div className="mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Entrenamiento</p>
            <h1 className="text-2xl font-serif text-foreground mt-0.5">Juegos</h1>
            <p className="text-sm text-muted-foreground mt-1">Entrenás tu sistema nervioso jugando</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {games.map((g, i) => (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setActiveGame(g.id)}
                className={`w-full text-left ${g.bg} border ${g.border} rounded-2xl p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white/70 ${g.color} flex-shrink-0`}>
                    <g.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{g.title}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/70 ${g.color}`}>{g.tag}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>
                  </div>
                  <span className="text-muted-foreground text-sm flex-shrink-0">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setActiveGame(null)}
            className="text-xs text-muted-foreground mb-4 flex items-center gap-1 hover:text-foreground"
          >
            ← Volver a juegos
          </button>
          <div className="flex items-center gap-2 mb-6">
            {game && (
              <div className={`p-2 rounded-xl ${game.bg} ${game.color}`}>
                <game.icon size={18} />
              </div>
            )}
            <h2 className="font-serif text-xl text-foreground">{game?.title}</h2>
          </div>

          {activeGame === 'breathing' && <BreathingGame />}
          {activeGame === 'focus' && <FocusGame />}
          {activeGame === 'reaction' && <ReactionGame />}
          {activeGame === 'memory' && <MemoryGame />}
          {activeGame === 'grounding' && <GroundingGame />}
          {activeGame === 'cold' && <ColdExposureGame />}
          {activeGame === 'gratitude' && <GratitudeGame />}
          {activeGame === 'hrv' && <HRVGame />}
          {activeGame === 'mindfulness' && <MindfulnessGame />}
          {activeGame === 'stress' && <StressInoculationGame />}
        </div>
      )}
    </div>
  );
}