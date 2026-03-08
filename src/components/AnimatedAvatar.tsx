import { useMemo } from 'react';

interface AnimatedAvatarProps {
  name: string;
  gender: 'female' | 'male' | 'other';
  skinTone?: string;
  hairTexture?: string;
  hairDensity?: string;
  avatarStyle?: number;
  size?: number;
  className?: string;
  level?: number;
}

const SKIN_COLORS: Record<string, { base: string; shadow: string; blush: string }> = {
  fair: { base: '#FDEBD0', shadow: '#F5CBA7', blush: '#F8B4B4' },
  light: { base: '#F5D5B8', shadow: '#E8C39E', blush: '#F0A0A0' },
  medium: { base: '#D4A574', shadow: '#C4955E', blush: '#D4887A' },
  olive: { base: '#C4A882', shadow: '#B09770', blush: '#C08878' },
  tan: { base: '#A0785A', shadow: '#8D6B50', blush: '#A07068' },
  dark: { base: '#6B4226', shadow: '#5A3520', blush: '#7A4A3E' },
};

const HAIR_COLORS = ['#1A1A2E', '#3D2B1F', '#8B4513', '#B8860B', '#D4A76A', '#C04030', '#2C1810'];

export default function AnimatedAvatar({
  name, gender, skinTone = 'light', hairTexture = 'straight',
  hairDensity = 'medium', avatarStyle = 0, size = 80, className = '', level = 1,
}: AnimatedAvatarProps) {
  const config = useMemo(() => {
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const skin = SKIN_COLORS[skinTone] || SKIN_COLORS.light;
    const hairColor = HAIR_COLORS[hash % HAIR_COLORS.length];
    const eyeColor = ['#3B5998', '#2E7D32', '#5D4037', '#1A1A2E', '#4A148C'][hash % 5];
    return { skin, hairColor, eyeColor, hash };
  }, [name, skinTone]);

  const { skin, hairColor, eyeColor, hash } = config;
  const isFemale = gender === 'female';
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const faceR = r * 0.7;
  const gradId = `skin-${hash}`;
  const hairId = `hair-${hash}`;
  const bgId = `bg-${hash}`;

  // Level-based accessories
  const showCrown = level >= 5;
  const showSparkles = level >= 3;
  const ringColor = level >= 7 ? '#FFD700' : level >= 4 ? '#C0C0C0' : level >= 2 ? '#CD7F32' : 'transparent';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} style={{ borderRadius: '50%' }}>
      <defs>
        <radialGradient id={bgId} cx="50%" cy="40%">
          <stop offset="0%" stopColor={isFemale ? 'hsl(340,60%,85%)' : 'hsl(210,50%,80%)'} />
          <stop offset="100%" stopColor={isFemale ? 'hsl(320,40%,75%)' : 'hsl(220,40%,70%)'} />
        </radialGradient>
        <radialGradient id={gradId} cx="40%" cy="35%">
          <stop offset="0%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
        <radialGradient id={hairId} cx="50%" cy="30%">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairColor} stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${bgId})`} />

      {/* Level ring */}
      {level >= 2 && (
        <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke={ringColor} strokeWidth={r * 0.04} opacity="0.7" />
      )}

      {/* Neck */}
      <rect x={cx - faceR * 0.22} y={cy + faceR * 0.55} width={faceR * 0.44} height={faceR * 0.3} rx={faceR * 0.1} fill={`url(#${gradId})`} />

      {/* Body/shoulders */}
      <ellipse cx={cx} cy={cy + r * 0.85} rx={faceR * 0.65} ry={faceR * 0.35} fill={isFemale ? 'hsl(340,50%,65%)' : 'hsl(210,45%,55%)'} />

      {/* Face */}
      <ellipse cx={cx} cy={cy - r * 0.05} rx={faceR * 0.58} ry={faceR * 0.65} fill={`url(#${gradId})`} />

      {/* Blush */}
      <ellipse cx={cx - faceR * 0.35} cy={cy + faceR * 0.15} rx={faceR * 0.12} ry={faceR * 0.08} fill={skin.blush} opacity="0.35" />
      <ellipse cx={cx + faceR * 0.35} cy={cy + faceR * 0.15} rx={faceR * 0.12} ry={faceR * 0.08} fill={skin.blush} opacity="0.35" />

      {/* Eyes */}
      <ellipse cx={cx - faceR * 0.2} cy={cy - faceR * 0.12} rx={faceR * 0.09} ry={faceR * 0.11} fill="white" />
      <ellipse cx={cx + faceR * 0.2} cy={cy - faceR * 0.12} rx={faceR * 0.09} ry={faceR * 0.11} fill="white" />
      <circle cx={cx - faceR * 0.2} cy={cy - faceR * 0.1} r={faceR * 0.055} fill={eyeColor} />
      <circle cx={cx + faceR * 0.2} cy={cy - faceR * 0.1} r={faceR * 0.055} fill={eyeColor} />
      {/* Eye shine */}
      <circle cx={cx - faceR * 0.18} cy={cy - faceR * 0.13} r={faceR * 0.02} fill="white" />
      <circle cx={cx + faceR * 0.22} cy={cy - faceR * 0.13} r={faceR * 0.02} fill="white" />

      {/* Eyelashes for female */}
      {isFemale && (
        <g>
          <line x1={cx - faceR * 0.28} y1={cy - faceR * 0.2} x2={cx - faceR * 0.32} y2={cy - faceR * 0.26} stroke={hairColor} strokeWidth={1} strokeLinecap="round" />
          <line x1={cx + faceR * 0.28} y1={cy - faceR * 0.2} x2={cx + faceR * 0.32} y2={cy - faceR * 0.26} stroke={hairColor} strokeWidth={1} strokeLinecap="round" />
        </g>
      )}

      {/* Eyebrows */}
      <path d={`M ${cx - faceR * 0.3} ${cy - faceR * 0.27} Q ${cx - faceR * 0.2} ${cy - faceR * 0.35} ${cx - faceR * 0.1} ${cy - faceR * 0.27}`} fill="none" stroke={hairColor} strokeWidth={faceR * 0.035} strokeLinecap="round" />
      <path d={`M ${cx + faceR * 0.1} ${cy - faceR * 0.27} Q ${cx + faceR * 0.2} ${cy - faceR * 0.35} ${cx + faceR * 0.3} ${cy - faceR * 0.27}`} fill="none" stroke={hairColor} strokeWidth={faceR * 0.035} strokeLinecap="round" />

      {/* Nose */}
      <path d={`M ${cx} ${cy - faceR * 0.02} Q ${cx + faceR * 0.06} ${cy + faceR * 0.08} ${cx} ${cy + faceR * 0.1}`} fill="none" stroke={skin.shadow} strokeWidth={faceR * 0.025} strokeLinecap="round" />

      {/* Mouth — smile */}
      <path d={`M ${cx - faceR * 0.12} ${cy + faceR * 0.22} Q ${cx} ${cy + faceR * 0.33} ${cx + faceR * 0.12} ${cy + faceR * 0.22}`} fill="none" stroke="#C0392B" strokeWidth={faceR * 0.03} strokeLinecap="round" />

      {/* Hair */}
      {isFemale ? (
        <g>
          {/* Long hair */}
          <ellipse cx={cx} cy={cy - r * 0.25} rx={faceR * 0.64} ry={faceR * 0.55} fill={`url(#${hairId})`} />
          {/* Side hair strands */}
          <path d={`M ${cx - faceR * 0.55} ${cy - faceR * 0.2} Q ${cx - faceR * 0.7} ${cy + faceR * 0.3} ${cx - faceR * 0.5} ${cy + faceR * 0.7}`} fill="none" stroke={hairColor} strokeWidth={faceR * 0.15} strokeLinecap="round" />
          <path d={`M ${cx + faceR * 0.55} ${cy - faceR * 0.2} Q ${cx + faceR * 0.7} ${cy + faceR * 0.3} ${cx + faceR * 0.5} ${cy + faceR * 0.7}`} fill="none" stroke={hairColor} strokeWidth={faceR * 0.15} strokeLinecap="round" />
          {hairTexture === 'curly' && (
            <>
              <circle cx={cx - faceR * 0.55} cy={cy + faceR * 0.5} r={faceR * 0.08} fill={hairColor} opacity="0.7" />
              <circle cx={cx + faceR * 0.55} cy={cy + faceR * 0.5} r={faceR * 0.08} fill={hairColor} opacity="0.7" />
            </>
          )}
        </g>
      ) : (
        <g>
          {/* Short hair */}
          <ellipse cx={cx} cy={cy - r * 0.28} rx={faceR * 0.62} ry={faceR * 0.42} fill={`url(#${hairId})`} />
          {hairTexture === 'curly' && (
            <>
              <circle cx={cx - faceR * 0.4} cy={cy - faceR * 0.45} r={faceR * 0.1} fill={hairColor} />
              <circle cx={cx + faceR * 0.4} cy={cy - faceR * 0.45} r={faceR * 0.1} fill={hairColor} />
              <circle cx={cx} cy={cy - faceR * 0.55} r={faceR * 0.1} fill={hairColor} />
            </>
          )}
        </g>
      )}

      {/* Level crown */}
      {showCrown && (
        <g>
          <polygon points={`${cx - faceR * 0.2},${cy - r * 0.65} ${cx - faceR * 0.1},${cy - r * 0.82} ${cx},${cy - r * 0.7} ${cx + faceR * 0.1},${cy - r * 0.82} ${cx + faceR * 0.2},${cy - r * 0.65}`} fill="#FFD700" stroke="#DAA520" strokeWidth={0.5} />
        </g>
      )}

      {/* Level sparkles */}
      {showSparkles && (
        <g>
          <text x={cx + faceR * 0.5} y={cy - faceR * 0.4} fontSize={faceR * 0.18} fill="#FFD700">✦</text>
          <text x={cx - faceR * 0.6} y={cy - faceR * 0.3} fontSize={faceR * 0.14} fill="#FFD700">✦</text>
        </g>
      )}

      {/* Initial badge */}
      <circle cx={cx + r * 0.55} cy={cy + r * 0.55} r={r * 0.18} fill="white" opacity="0.9" />
      <text x={cx + r * 0.55} y={cy + r * 0.55} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.18} fontWeight="bold" fill={isFemale ? 'hsl(340,60%,50%)' : 'hsl(210,50%,45%)'}>
        {name.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}
