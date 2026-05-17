import { jsPDF } from 'jspdf';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart2, Zap, BookOpen, TrendingUp, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUser } from '@clerk/clerk-react';

// ─── Keys localStorage (deben coincidir con Estado.jsx y RuedaEmocional.jsx) ──

const LS_CHECKIN_KEY = 'cultiva_checkins';          // check-ins SN rápidos
const LS_SISTEMA_KEY = 'cultiva_sistema_checkins';  // estados del sistema
const LS_EMOCIONAL_KEY = 'neura_emotional_checkins'; // rueda emocional

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

function lsFilter(key, filterObj = {}, limitN = 200) {
  let all = lsGet(key);
  Object.entries(filterObj).forEach(([k, v]) => {
    all = all.filter(item => item[k] === v);
  });
  all.sort((a, b) => new Date(b.created_date || b.created_at) - new Date(a.created_date || a.created_at));
  return all.slice(0, limitN);
}

// ─── Colors ──────────────────────────────────────────────────────────────────

const nsColors = {
  regulado: '#4ade80',
  activado:  '#fbbf24',
  colapsado: '#f87171',
};

// ─── PDF Generator ────────────────────────────────────────────────────────────

function generarPDFTotal({ checkins, sistemaCheckins, emocionales, userEmail }) {
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W      = 210;
  const now    = new Date();
  const weekStart = subDays(now, 6);

  const fmtD   = d => format(typeof d === 'string' ? parseISO(d.length === 10 ? d + 'T12:00:00' : d) : d, "d MMM yyyy", { locale: es });
  const fmtDay = d => format(typeof d === 'string' ? parseISO(d.length === 10 ? d + 'T12:00:00' : d) : d, 'EEEE d MMM', { locale: es });

  const inWeek = raw => {
    try {
      const d = typeof raw === 'string' ? parseISO(raw.length === 10 ? raw + 'T12:00:00' : raw) : raw;
      return d >= weekStart;
    } catch { return false; }
  };

  const weekCI  = checkins.filter(c => inWeek(c.date || c.created_date));
  const weekSIS = sistemaCheckins.filter(c => inWeek(c.date || c.created_date));
  const weekEM  = emocionales.filter(c => inWeek(c.date || c.created_at));

  // Palette
  const ACCENT = [38, 70, 83];
  const DARK   = [20, 20, 20];
  const GRAY   = [110, 110, 110];
  const LIGHT  = [245, 245, 245];
  const GOLD   = [233, 196, 106];

  // ── Helper: section header ──
  function sectionHeader(title, y) {
    doc.setFillColor(...ACCENT);
    doc.roundedRect(10, y, W - 20, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 16, y + 6);
    return y + 14;
  }

  // ── Helper: stat box ──
  function statBox(label, value, x, y, w, color) {
    doc.setFillColor(...LIGHT);
    doc.roundedRect(x, y, w, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.text(String(value), x + w / 2, y + 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(label, x + w / 2, y + 15.5, { align: 'center' });
  }

  // ── Helper: mini bar chart (pure jsPDF) ──
  function miniBarChart(data, colors, x, y, w, h) {
    const max = Math.max(...data.map(d => d.v), 1);
    const barW = (w - (data.length - 1) * 2) / data.length;
    data.forEach((d, i) => {
      const bh = Math.max((d.v / max) * h, 1);
      const bx = x + i * (barW + 2);
      const by = y + h - bh;
      const rgb = colors[i] || ACCENT;
      doc.setFillColor(...rgb);
      doc.roundedRect(bx, by, barW, bh, 1, 1, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...GRAY);
      doc.text(d.label, bx + barW / 2, y + h + 5, { align: 'center' });
    });
  }

  // ── Helper: donut/pie ──
  function pieChart(slices, cx, cy, r) {
    // slices: [{value, rgb, label}]
    const total = slices.reduce((s, sl) => s + sl.value, 0);
    if (total === 0) return;
    let angle = -Math.PI / 2;
    slices.forEach(sl => {
      const sweep = (sl.value / total) * 2 * Math.PI;
      // jsPDF doesn't have arc, so we approximate with filled polygon
      const steps = Math.max(Math.round(sweep / 0.15), 4);
      const pts = [[cx, cy]];
      for (let i = 0; i <= steps; i++) {
        const a = angle + (i / steps) * sweep;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      doc.setFillColor(...sl.rgb);
      doc.lines(
        pts.slice(1).map((p, i) => [p[0] - (i === 0 ? pts[0][0] : pts[i][0]), p[1] - (i === 0 ? pts[0][1] : pts[i][1])]),
        pts[0][0], pts[0][1], [1, 1], 'F'
      );
      angle += sweep;
    });
    // white center (donut)
    doc.setFillColor(255, 255, 255);
    doc.circle(cx, cy, r * 0.55, 'F');
  }

  let y = 0;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — PORTADA + RESUMEN
  // ══════════════════════════════════════════════════════════════════════════

  // Header band
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, W, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Cultiva Neura', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Reporte Semanal Completo', 14, 24);
  doc.setFontSize(8.5);
  doc.text(`${fmtD(weekStart)} — ${fmtD(now)}`, 14, 31);
  if (userEmail) {
    doc.text(userEmail, W - 14, 31, { align: 'right' });
  }
  doc.text(`Generado: ${format(now, "d MMM yyyy HH:mm", { locale: es })}`, W - 14, 38, { align: 'right' });

  y = 54;

  // ── Resumen global (3 columnas) ──
  const colW = (W - 20 - 8) / 3;
  statBox('Check-ins SN',    weekCI.length,  10,          y, colW, ACCENT);
  statBox('Estados Sistema', weekSIS.length, 10 + colW + 4, y, colW, [107, 203, 119]);
  statBox('Rueda Emocional', weekEM.length,  10 + (colW + 4) * 2, y, colW, [229, 107, 107]);
  y += 26;

  // ── SN Rápido — distribución por estado ──
  y = sectionHeader('Sistema Nervioso · Check-ins Rápidos', y);

  // Bar chart últimos 7 días (SN rápido)
  const last7SN = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(now, 6 - i);
    const ds = format(d, 'yyyy-MM-dd');
    const ci = checkins.find(c => c.date === ds);
    return {
      label: format(d, 'EEE', { locale: es }).slice(0, 2),
      v: ci ? 1 : 0,
      rgb: ci ? (nsColors[ci.nervous_system] || '#999').match(/\d+/g)?.map(Number) || ACCENT : [220, 220, 220],
    };
  });

  miniBarChart(last7SN, last7SN.map(d => d.rgb), 14, y, 80, 24);

  // NS distribution donut
  const nsCount = { regulado: 0, activado: 0, colapsado: 0 };
  weekCI.forEach(c => { if (c.nervous_system) nsCount[c.nervous_system]++; });
  const nsSlices = [
    { value: nsCount.regulado,  rgb: [74, 222, 128], label: 'Regulado' },
    { value: nsCount.activado,  rgb: [251, 191, 36],  label: 'Activado' },
    { value: nsCount.colapsado, rgb: [248, 113, 113], label: 'Colapsado' },
  ].filter(s => s.value > 0);

  if (nsSlices.length > 0) {
    pieChart(nsSlices, 160, y + 12, 16);
    // legend
    nsSlices.forEach((s, i) => {
      doc.setFillColor(...s.rgb);
      doc.circle(140, y + 4 + i * 7, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...DARK);
      doc.text(`${s.label}: ${s.value}`, 144, y + 5.5 + i * 7);
    });
  }

  y += 36;

  // List of SN check-ins
  if (weekCI.length > 0) {
    weekCI.slice(0, 7).forEach((item, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      const bg = i % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
      doc.setFillColor(...bg);
      doc.rect(10, y - 3, W - 20, 13, 'F');

      const nsRgb = item.nervous_system === 'regulado' ? [74, 222, 128]
        : item.nervous_system === 'activado' ? [251, 191, 36] : [248, 113, 113];
      doc.setFillColor(...nsRgb);
      doc.circle(16, y + 3, 2.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(fmtDay(item.date || item.created_date), 22, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...GRAY);
      const detail = [item.nervous_system, item.emotion, item.mind].filter(Boolean).join(' · ');
      doc.text(detail, 22, y + 9.5);
      y += 14;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Sin check-ins rápidos esta semana.', 14, y + 4);
    y += 12;
  }

  y += 4;

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN — ESTADO DEL SISTEMA
  // ══════════════════════════════════════════════════════════════════════════

  if (y > 220) { doc.addPage(); y = 20; }
  y = sectionHeader('Estado del Sistema Nervioso', y);

  // Distribution by state
  const stateCount = {};
  weekSIS.forEach(s => { stateCount[s.stateName] = (stateCount[s.stateName] || 0) + 1; });
  const stateColors = { 'Activación Alta': [255, 107, 107], 'Regulado': [107, 203, 119], 'Activación Baja': [77, 150, 255] };

  if (weekSIS.length > 0) {
    // Summary chips
    Object.entries(stateCount).forEach(([name, count], i) => {
      const rgb = stateColors[name] || ACCENT;
      doc.setFillColor(...rgb.map(c => Math.min(c + 180, 255)));
      doc.roundedRect(14 + i * 62, y, 56, 14, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...rgb);
      doc.text(String(count), 42 + i * 62, y + 7, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GRAY);
      doc.text(name, 42 + i * 62, y + 11.5, { align: 'center' });
    });
    y += 20;

    weekSIS.slice(0, 7).forEach((item, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      const bg = i % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
      doc.setFillColor(...bg);
      doc.rect(10, y - 3, W - 20, 15, 'F');

      const rgb = stateColors[item.stateName] || ACCENT;
      doc.setFillColor(...rgb);
      doc.roundedRect(13, y - 1, 3, 11, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(`${item.nuanceEmoji || ''} ${item.nuanceName || ''}`, 20, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const intensityLabel = ['', 'Leve', 'Moderado', 'Intenso'][item.intensity] || '';
      doc.text(`${item.stateName} · ${intensityLabel}`, 20, y + 10);

      const dateStr = fmtDay(item.date || item.created_date);
      doc.text(dateStr, W - 14, y + 4, { align: 'right' });
      y += 16;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Sin estados del sistema esta semana.', 14, y + 4);
    y += 12;
  }

  y += 6;

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN — RUEDA EMOCIONAL
  // ══════════════════════════════════════════════════════════════════════════

  if (y > 200) { doc.addPage(); y = 20; }
  y = sectionHeader('Rueda Emocional', y);

  // Emotion distribution donut
  const emotionCount = {};
  weekEM.forEach(e => {
    emotionCount[e.emotion_name] = (emotionCount[e.emotion_name] || 0) + 1;
  });

  const emColors = [
    [255, 107, 107], [255, 166, 77], [255, 213, 77],
    [107, 203, 119], [77, 150, 255], [180, 107, 255],
    [255, 107, 200], [107, 220, 220],
  ];
  const emSlices = Object.entries(emotionCount).map(([name, v], i) => ({
    value: v, rgb: emColors[i % emColors.length], label: name,
  }));

  if (emSlices.length > 0) {
    pieChart(emSlices, 40, y + 20, 18);

    // Legend
    emSlices.slice(0, 6).forEach((s, i) => {
      const col = i < 3 ? 80 : 140;
      const row = i % 3;
      doc.setFillColor(...s.rgb);
      doc.circle(col, y + 4 + row * 8, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...DARK);
      doc.text(`${s.label}: ${s.value}`, col + 4, y + 5.5 + row * 8);
    });

    y += 44;

    // Intensity distribution bar
    const intCount = [0, 0, 0];
    weekEM.forEach(e => { intCount[e.intensity] = (intCount[e.intensity] || 0) + 1; });
    const intData = [
      { label: 'Suave', v: intCount[0], rgb: [107, 203, 119] },
      { label: 'Moderada', v: intCount[1], rgb: [255, 166, 77] },
      { label: 'Intensa', v: intCount[2], rgb: [255, 107, 107] },
    ];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('Distribución de intensidad', 14, y);
    y += 5;
    miniBarChart(intData, intData.map(d => d.rgb), 14, y, 60, 20);
    y += 32;

    // Technique usage
    const withTechnique = weekEM.filter(e => e.technique_name).length;
    doc.setFillColor(...LIGHT);
    doc.roundedRect(10, y, W - 20, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...ACCENT);
    doc.text(`${withTechnique} de ${weekEM.length} registros incluyeron técnica de regulación`, W / 2, y + 9, { align: 'center' });
    y += 20;

    // List
    weekEM.slice(0, 8).forEach((item, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      const bg = i % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
      doc.setFillColor(...bg);
      doc.rect(10, y - 3, W - 20, 15, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`${item.emotion_emoji || ''} ${item.emotion_name || ''}`, 16, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const techStr = item.technique_name ? ` · ✓ ${item.technique_name}` : '';
      doc.text(`${item.intensity_label || ''}${techStr}`, 16, y + 10);

      const ds = item.date || (item.created_at ? item.created_at.slice(0, 10) : '');
      if (ds) doc.text(fmtDay(ds), W - 14, y + 4, { align: 'right' });
      y += 16;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Sin registros emocionales esta semana.', 14, y + 4);
    y += 12;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER en todas las páginas
  // ══════════════════════════════════════════════════════════════════════════

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFillColor(...ACCENT);
    doc.rect(0, 289, W, 8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Cultiva Neura · Reporte Semanal', 14, 294);
    doc.text(`Página ${p}/${pages}`, W - 14, 294, { align: 'right' });
  }

  doc.save(`cultiva-reporte-${format(weekStart, 'yyyy-MM-dd')}.pdf`);
}

// ─── Main component ───────────────────────────────────────────────────────────

const nsColorsMap = {
  regulado: '#4ade80',
  activado:  '#fbbf24',
  colapsado: '#f87171',
};

export default function Progreso() {
  const { user: clerkUser } = useUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  const [checkIns,        setCheckIns]        = useState([]);
  const [sistemaCheckins, setSistemaCheckins] = useState([]);
  const [emocionales,     setEmocionales]     = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [pdfLoading,      setPdfLoading]      = useState(false);

  useEffect(() => {
    const ci  = lsFilter(LS_CHECKIN_KEY,  userEmail ? { user_email: userEmail } : {}, 200);
    const sis = lsFilter(LS_SISTEMA_KEY,  userEmail ? { user_email: userEmail } : {}, 200);
    const em  = lsGet(LS_EMOCIONAL_KEY);
    setCheckIns(ci);
    setSistemaCheckins(sis);
    setEmocionales(em);
    setLoading(false);
  }, [userEmail]);

  // ── Derived stats ──────────────────────────────────────────────────────────

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const ds = format(d, 'yyyy-MM-dd');
    const ci = checkIns.find(c => c.date === ds);
    return {
      day:   format(d, 'EEE', { locale: es }),
      state: ci?.nervous_system || null,
      fill:  ci ? nsColorsMap[ci.nervous_system] || '#e5e7eb' : '#e5e7eb',
      value: ci ? 1 : 0,
    };
  });

  const nsCount = checkIns.reduce((acc, ci) => {
    acc[ci.nervous_system] = (acc[ci.nervous_system] || 0) + 1;
    return acc;
  }, {});
  const dominantState = Object.entries(nsCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  const emotionCount = emocionales.reduce((acc, e) => {
    acc[e.emotion_name] = (acc[e.emotion_name] || 0) + 1;
    return acc;
  }, {});
  const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];

  // Streak (días consecutivos con al menos un check-in)
  function calcStreak() {
    const dates = [...new Set([
      ...checkIns.map(c => c.date),
      ...sistemaCheckins.map(c => c.date),
    ])].filter(Boolean).sort().reverse();
    let streak = 0;
    let expected = format(new Date(), 'yyyy-MM-dd');
    for (const d of dates) {
      if (d === expected) {
        streak++;
        expected = format(subDays(parseISO(d + 'T12:00:00'), 1), 'yyyy-MM-dd');
      } else break;
    }
    return streak;
  }
  const streak = calcStreak();

  const statsCards = [
    { label: 'Check-ins SN',    value: checkIns.length,        icon: Zap,       color: 'text-primary' },
    { label: 'Estados Sistema', value: sistemaCheckins.length,  icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Reg. Emocional',  value: emocionales.length,      icon: BookOpen,   color: 'text-rose-500' },
    { label: 'Racha (días)',    value: streak,                  icon: BarChart2,  color: 'text-violet-600' },
  ];

  // ── PDF handler ────────────────────────────────────────────────────────────

  function handleExportPDF() {
    setPdfLoading(true);
    try {
      generarPDFTotal({ checkins: checkIns, sistemaCheckins, emocionales, userEmail });
    } catch (e) {
      console.error(e);
      alert('Error al generar el PDF. Revisá la consola.');
    } finally {
      setPdfLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 pt-12 pb-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Tu recorrido</p>
          <h1 className="text-2xl font-serif text-foreground mt-0.5">Progreso</h1>
          <p className="text-sm text-muted-foreground mt-1">Evolución de tu sistema nervioso</p>
        </div>

        {/* PDF button */}
        <button
          onClick={handleExportPDF}
          disabled={pdfLoading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
          title="Descargar reporte semanal completo"
        >
          <FileDown className="w-4 h-4" />
          {pdfLoading ? 'Generando...' : 'Reporte PDF'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {statsCards.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <Icon size={18} className={color} />
                <p className="text-2xl font-serif mt-2 text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Weekly SN chart */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Últimos 7 días · Sistema Nervioso</h2>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={last7} barCategoryGap="20%">
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length || !payload[0].payload.state) return null;
                    return (
                      <div className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs shadow-lg capitalize">
                        {payload[0].payload.state}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {last7.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-3 justify-center">
              {Object.entries(nsColorsMap).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v }} />
                  <span className="text-xs text-muted-foreground capitalize">{k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dominant NS state */}
          {dominantState && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Estado SN dominante</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nsColorsMap[dominantState] }} />
                <p className="font-semibold text-foreground capitalize">{dominantState}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {nsCount[dominantState]} de {checkIns.length} check-ins
              </p>
            </div>
          )}

          {/* Dominant emotion */}
          {dominantEmotion && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Emoción dominante</p>
              <p className="font-semibold text-foreground mt-1">{dominantEmotion[0]}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{dominantEmotion[1]} registros</p>
            </div>
          )}

          {/* Recent SN check-ins */}
          {checkIns.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">Historial · Check-ins SN</h2>
              <div className="space-y-2">
                {checkIns.slice(0, 10).map(ci => (
                  <div key={ci.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nsColorsMap[ci.nervous_system] || '#d1d5db' }} />
                      <div>
                        <p className="text-sm capitalize text-foreground">{ci.nervous_system}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ci.emotion} · {ci.mind}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {ci.date ? format(parseISO(ci.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent emotional check-ins */}
          {emocionales.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">Historial · Rueda Emocional</h2>
              <div className="space-y-2">
                {emocionales.slice(0, 6).map((e, i) => (
                  <div key={i} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{e.emotion_emoji}</span>
                      <div>
                        <p className="text-sm text-foreground">{e.emotion_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.intensity_label}
                          {e.technique_name ? ` · ✓ ${e.technique_name}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {e.date ? format(parseISO(e.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {checkIns.length === 0 && sistemaCheckins.length === 0 && emocionales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">Todavía no hay datos</p>
              <p className="text-xs text-muted-foreground mt-1">Hacé tu primer check-in para ver tu progreso</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
