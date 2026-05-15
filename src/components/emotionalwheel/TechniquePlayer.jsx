import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Check } from 'lucide-react';

export default function TechniquePlayer({ technique, color, onComplete, onClose }) {
  const [seconds, setSeconds] = useState(technique.durationSeconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setCompleted(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const totalSec = technique.durationSeconds;
  const progress = ((totalSec - seconds) / totalSec) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (progress / 100) * circumference;

  const reset = () => {
    setSeconds(technique.durationSeconds);
    setRunning(false);
    setCompleted(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(38,70,83,0.5)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white w-full max-w-md mx-4 rounded-3xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#264653' }}>{technique.name}</p>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F8F9FA' }}>
            <X className="w-4 h-4" style={{ color: '#6C757D' }} />
          </button>
        </div>

        {/* Timer circle */}
        <div className="flex justify-center mb-6">
          <div style={{ position: 'relative', width: '180px', height: '180px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="none" stroke="#E9ECEF" strokeWidth="8" />
              <circle cx="90" cy="90" r="80" fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                strokeLinecap="round" transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {completed ? (
                <Check className="w-12 h-12" style={{ color }} />
              ) : (
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#264653', fontVariantNumeric: 'tabular-nums' }}>
                  {mm}:{ss}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
          <p style={{ fontSize: '14px', color: '#264653', lineHeight: 1.65 }}>{technique.instructions}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', cursor: 'pointer' }}>
            <RotateCcw className="w-5 h-5" style={{ color: '#6C757D' }} />
          </button>

          {completed ? (
            <button onClick={() => onComplete()} className="px-8 py-3 rounded-2xl flex items-center gap-2"
              style={{ background: color, color: 'white', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              <Check className="w-5 h-5" /> Completar
            </button>
          ) : (
            <button onClick={() => setRunning(!running)}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: color, border: 'none', cursor: 'pointer', boxShadow: `0 4px 16px ${color}44` }}>
              {running
                ? <Pause className="w-7 h-7 text-white" />
                : <Play className="w-7 h-7 text-white" style={{ marginLeft: '3px' }} />
              }
            </button>
          )}

          <div style={{ width: '48px' }} />
        </div>
      </div>
    </div>
  );
}