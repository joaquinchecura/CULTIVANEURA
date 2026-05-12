import { useState } from 'react';
import { EMOTIONS } from './emotions';

const CENTER_X = 200;
const CENTER_Y = 200;
const INNER_R = 55;
const OUTER_R = 160;

function polarToCart(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx, cy, r1, r2, startDeg, endDeg) {
  const s1 = polarToCart(cx, cy, r1, startDeg);
  const e1 = polarToCart(cx, cy, r1, endDeg);
  const s2 = polarToCart(cx, cy, r2, startDeg);
  const e2 = polarToCart(cx, cy, r2, endDeg);
  return `M ${s1.x} ${s1.y} A ${r1} ${r1} 0 0 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${r2} ${r2} 0 0 0 ${s2.x} ${s2.y} Z`;
}

function labelPos(cx, cy, r, angleDeg) {
  return polarToCart(cx, cy, r, angleDeg);
}

export default function EmotionWheel({ selectedId, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const sliceAngle = 360 / EMOTIONS.length;

  return (
    <div className="flex justify-center">
      <svg width="320" height="320" viewBox="0 0 400 400" style={{ maxWidth: '100%' }}>
        {EMOTIONS.map((emotion, i) => {
          const startDeg = i * sliceAngle;
          const endDeg = startDeg + sliceAngle;
          const midDeg = startDeg + sliceAngle / 2;
          const isSelected = selectedId === emotion.id;
          const isHovered = hovered === emotion.id;

          const innerR = INNER_R + (isSelected || isHovered ? 5 : 0);
          const outerR = OUTER_R + (isSelected ? 12 : isHovered ? 6 : 0);

          const labelP = labelPos(CENTER_X, CENTER_Y, (innerR + outerR) / 2, midDeg);
          const emojiP = labelPos(CENTER_X, CENTER_Y, innerR + (outerR - innerR) * 0.35, midDeg);
          const textP = labelPos(CENTER_X, CENTER_Y, innerR + (outerR - innerR) * 0.68, midDeg);

          return (
            <g key={emotion.id}
              onClick={() => onSelect(emotion.id)}
              onMouseEnter={() => setHovered(emotion.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <path
                d={slicePath(CENTER_X, CENTER_Y, innerR, outerR, startDeg, endDeg)}
                fill={isSelected ? emotion.color : isHovered ? emotion.color + 'dd' : emotion.color + '99'}
                stroke="white"
                strokeWidth="2"
                style={{ transition: 'all 0.2s' }}
              />
              <text x={emojiP.x} y={emojiP.y} textAnchor="middle" dominantBaseline="middle" fontSize="18">
                {emotion.emoji}
              </text>
              <text
                x={textP.x} y={textP.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="9" fontWeight={isSelected ? '800' : '600'}
                fill={isSelected ? 'white' : '#264653'}
                style={{ userSelect: 'none' }}
              >
                {emotion.name}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_R - 4} fill="white" stroke="#E9ECEF" strokeWidth="1.5" />
        <text x={CENTER_X} y={CENTER_Y - 8} textAnchor="middle" fontSize="22" dominantBaseline="middle">
          {selectedId ? EMOTIONS.find(e => e.id === selectedId)?.emoji : '🧠'}
        </text>
        <text x={CENTER_X} y={CENTER_Y + 16} textAnchor="middle" fontSize="9" fill="#6C757D" fontWeight="600">
          {selectedId ? EMOTIONS.find(e => e.id === selectedId)?.name : 'Tocá una emoción'}
        </text>
      </svg>
    </div>
  );
}
