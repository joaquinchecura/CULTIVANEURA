import { jsPDF } from 'jspdf';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { NS_CONFIG } from '@/lib/nervous-system';
import { safeParseDate } from '@/lib/storage';

// ─── Paleta NEURA ─────────────────────────────────────────────────────────────
const C = {
  primaryDk: [41, 78, 54],     
  primary:   [59, 107, 75],    
  sand:      [244, 236, 220],  
  bark:      [92, 72, 52],     
  light:     [248, 246, 242],  
  border:    [220, 212, 198],
  gray:      [120, 120, 120],
  white:     [255, 255, 255],
  regulado:  [107, 203, 119],
  activado:  [233, 196, 106],
  colapsado: [224, 122, 95],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWeekDates(start, end) {
  const days = [];
  const d = new Date(start);
  while (d <= end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function drawKpiBox(doc, x, y, w, h, value, label) {
  doc.setFillColor(...C.light);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setDrawColor(...C.border);
  doc.roundedRect(x, y, w, h, 2, 2, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.primaryDk);
  doc.text(String(value), x + w / 2, y + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(label, x + w / 2, y + 20, { align: 'center' });
}

function drawBar(doc, x, y, w, h, pct, color) {
  doc.setFillColor(...C.light);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
  if (pct > 0) {
    const fillW = Math.max(h, w * pct);
    doc.setFillColor(...color);
    doc.roundedRect(x, y, fillW, h, h / 2, h / 2, 'F');
  }
}

// Gráfico de Torta (Donut) para Estados
function drawDonutChart(doc, data, cx, cy, radius, colors) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2;

  data.forEach((item, index) => {
    if (item.value === 0) return;
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    doc.setFillColor(...colors[index % colors.length]);
    
    const steps = 20;
    const points = [[cx, cy]];
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (i / steps) * sliceAngle;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    
    doc.lines(
      points.slice(1).map((p, i) => [p[0] - points[i][0], p[1] - points[i][1]]),
      points[0][0], points[0][1], [1, 1], 'F'
    );

    startAngle = endAngle;
  });

  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radius * 0.5, 'F');
}

// Gráfico de Barras para Emociones
function drawBarChart(doc, data, x, y, width, height, color) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barWidth = (width / data.length) - 5;

  data.forEach((item, i) => {
    const barHeight = (item.value / max) * height;
    const bx = x + i * (barWidth + 5);
    const by = y + height - barHeight;

    doc.setFillColor(...color);
    doc.roundedRect(bx, by, barWidth, barHeight, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(String(item.value), bx + barWidth / 2, by - 2, { align: 'center' });
    
    doc.text(item.label, bx + barWidth / 2, y + height + 6, { align: 'center' });
  });
}

// ─── Generador principal ──────────────────────────────────────────────────────
export function generarPDFSemanal(checkins, sistemaCheckins, userEmail) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 15;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(now,   { weekStartsOn: 1 });

  const inWeek = (date) => {
    const d = safeParseDate(date);
    return d ? isWithinInterval(d, { start: weekStart, end: weekEnd }) : false;
  };

  const weekCheckins = checkins.filter(c => inWeek(c.date || c.created_date));
  const weekSistema  = sistemaCheckins.filter(c => inWeek(c.date || c.created_date));

  // ─── Header ───────────────────────────────────────────────────────────────
  const H = 34;
  doc.setFillColor(...C.primaryDk);
  doc.rect(0, 0, W, H, 'F');

  doc.setTextColor(...C.white);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('NEURA', M, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Reporte semanal de estado neurofisiológico', M, 21);

  doc.setFontSize(8);
  doc.text(
    `${format(weekStart, "d 'de' MMMM", { locale: es })} — ${format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}`,
    M, 27
  );

  if (userEmail) {
    doc.setFontSize(8);
    doc.text(userEmail, W - M, 27, { align: 'right' });
  }

  let y = H + 10;

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const total = weekCheckins.length + weekSistema.length;
  const avgIntensity = weekSistema.length
    ? (weekSistema.reduce((s, c) => s + (c.intensity || 0), 0) / weekSistema.length).toFixed(1)
    : '—';
  const uniqueDays = new Set(weekCheckins.map(c => c.date).filter(Boolean)).size;

  const kpiW = (W - 2 * M - 8) / 3;
  drawKpiBox(doc, M,                     y, kpiW, 26, total,       'Check-ins');
  drawKpiBox(doc, M + kpiW + 4,          y, kpiW, 26, avgIntensity, 'Intensidad prom.');
  drawKpiBox(doc, M + 2 * (kpiW + 4),    y, kpiW, 26, uniqueDays,  'Días activos');

  y += 36;

  // ─── Distribución de estados ──────────────────────────────────────────────
  if (weekCheckins.length > 0) {
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...C.primaryDk);
    doc.text('Distribución de estados', M, y);
    y += 7;

    const counts = { regulado: 0, activado: 0, colapsado: 0 };
    weekCheckins.forEach(c => {
      if (counts[c.nervous_system] !== undefined) counts[c.nervous_system]++;
    });

    const barMaxW = W - 2 * M - 60;
    Object.entries(counts).forEach(([key, count]) => {
      const cfg = NS_CONFIG[key];
      const pct = weekCheckins.length ? count / weekCheckins.length : 0;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...C.primaryDk);
      doc.text(cfg.label, M, y + 4);

      drawBar(doc, M + 32, y, barMaxW, 5, pct, C[key] || C.primary);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...C.gray);
      doc.text(`${count} (${Math.round(pct * 100)}%)`, W - M, y + 4, { align: 'right' });

      y += 9;
    });
    y += 4;
  }

  // ─── Emociones más frecuentes ─────────────────────────────────────────────
  const emotionCounts = {};
  weekCheckins.forEach(c => {
    if (c.emotion) emotionCounts[c.emotion] = (emotionCounts[c.emotion] || 0) + 1;
  });
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topEmotions.length > 0) {
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...C.primaryDk);
    doc.text('Emociones frecuentes', M, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...C.gray);
    const line = topEmotions
      .map(([name, count]) => `${name.charAt(0).toUpperCase() + name.slice(1)} (${count})`)
      .join('  ·  ');
    doc.text(line, M, y + 3);
    y += 10;
  }

  // ─── Análisis Visual (Gráficos) ───────────────────────────────────────────
  if (weekCheckins.length > 0) {
    if (y > 200) { doc.addPage(); y = 20; }
    
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...C.primaryDk);
    doc.text('Análisis Visual', M, y);
    y += 10;

    // 1. Donut de Estados
    const stateData = [
      { label: 'Regulado', value: counts.regulado },
      { label: 'Activado', value: counts.activado },
      { label: 'Colapsado', value: counts.colapsado },
    ];
    const stateColors = [C.regulado, C.activado, C.colapsado];
    
    drawDonutChart(doc, stateData, M + 30, y + 20, 20, stateColors);
    
    // Leyenda del Donut
    doc.setFontSize(8);
    stateData.forEach((d, i) => {
      doc.setFillColor(...stateColors[i]);
      doc.circle(M + 60, y + 10 + i * 8, 2, 'F');
      doc.setTextColor(...C.gray);
      doc.text(`${d.label}: ${d.value}`, M + 65, y + 11 + i * 8);
    });

    // 2. Barras de Emociones
    const emotionData = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ label: name.slice(0, 4), value: count }));

    if (emotionData.length > 0) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...C.primaryDk);
      doc.text('Top Emociones', M + 90, y + 10);
      drawBarChart(doc, emotionData, M + 90, y + 20, 80, 30, [107, 203, 119]);
    }

    y += 55;
  }

  // ─── Detalle diario ───────────────────────────────────────────────────────
  if (y > 230) { doc.addPage(); y = 20; }
  
  doc.setDrawColor(...C.border);
  doc.line(M, y, W - M, y);
  y += 6;

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C.primaryDk);
  doc.text('Detalle de la semana', M, y);
  y += 7;

  const weekDays = getWeekDates(weekStart, weekEnd);
  const byDate = {};
  weekCheckins.forEach(c => {
    const key = c.date || safeParseDate(c.created_date)?.toISOString().slice(0, 10);
    if (key) (byDate[key] = byDate[key] || []).push(c);
  });

  weekDays.forEach((day, idx) => {
    const key = format(day, 'yyyy-MM-dd');
    const dayCheckins = byDate[key] || [];
    const isToday = key === format(now, 'yyyy-MM-dd');

    if (idx % 2 === 0) {
      doc.setFillColor(...C.light);
      doc.rect(M, y, W - 2 * M, 8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.primaryDk);
    doc.text(format(day, 'EEE d', { locale: es }), M + 2, y + 5.5);

    if (dayCheckins.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...C.gray);
      doc.text('—', M + 25, y + 5.5);
    } else {
      const c = dayCheckins[0];
      const cfg = NS_CONFIG[c.nervous_system];
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...C.primaryDk);
      const parts = [cfg?.label, c.emotion, c.mind].filter(Boolean);
      doc.text(parts.join(' · '), M + 25, y + 5.5);
    }

    if (isToday) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...C.primary);
      doc.text('HOY', W - M - 2, y + 5.5, { align: 'right' });
    }

    y += 8;
  });

  if (weekCheckins.length === 0 && weekSistema.length === 0) {
    y += 10;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...C.gray);
    doc.text('Sin registros esta semana.', W / 2, y, { align: 'center' });
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...C.border);
    doc.line(M, 284, W - M, 284);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    doc.text(
      `Generado ${format(now, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}`,
      M, 288
    );
    doc.text(`NEURA · Página ${p} de ${pageCount}`, W - M, 288, { align: 'right' });
  }

  const filename = `neura-semana-${format(weekStart, 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
  return filename;
}