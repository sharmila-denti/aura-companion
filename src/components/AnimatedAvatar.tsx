import { useMemo } from 'react';

interface AnimatedAvatarProps {
  name: string;
  gender: 'female' | 'male' | 'other';
  skinTone?: string;
  hairTexture?: string;
  hairDensity?: string;
  eyeColor?: string;
  eyeSize?: string;
  hairColor?: string;
  hairLength?: string;
  lipStyle?: string;
  lipColor?: string;
  dressStyle?: string;
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

const EYE_COLORS: Record<string, string> = {
  black: '#1A1A1A',
  brown: '#5D4037',
  hazel: '#8B6914',
  green: '#2E7D32',
  blue: '#1565C0',
  gray: '#607D8B',
};

const HAIR_COLOR_MAP: Record<string, string> = {
  black: '#1A1A2E',
  'dark-brown': '#3D2B1F',
  brown: '#6B4226',
  auburn: '#8B4513',
  blonde: '#D4A76A',
  red: '#C04030',
  gray: '#9E9E9E',
  white: '#E0E0E0',
};

const LIP_COLOR_MAP: Record<string, string> = {
  natural: '#C0776E',
  pink: '#E91E63',
  red: '#C62828',
  berry: '#880E4F',
  nude: '#D4A08A',
};

const DRESS_COLORS: Record<string, { primary: string; pattern?: string }> = {
  modern: { primary: '#37474F' },
  traditional: { primary: '#BF360C', pattern: '#E65100' },
  casual: { primary: '#558B2F' },
  formal: { primary: '#1A237E' },
  sporty: { primary: '#E65100', pattern: '#FF8F00' },
};

export default function AnimatedAvatar({
  name, gender, skinTone = 'light', hairTexture = 'straight',
  hairDensity = 'medium', eyeColor = 'brown', eyeSize = 'medium',
  hairColor = 'black', hairLength = 'medium', lipStyle = 'medium',
  lipColor = 'natural', dressStyle = 'modern',
  avatarStyle = 0, size = 80, className = '', level = 1,
}: AnimatedAvatarProps) {
  const config = useMemo(() => {
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const skin = SKIN_COLORS[skinTone] || SKIN_COLORS.light;
    const hColor = HAIR_COLOR_MAP[hairColor] || HAIR_COLOR_MAP.black;
    const eColor = EYE_COLORS[eyeColor] || EYE_COLORS.brown;
    const lColor = LIP_COLOR_MAP[lipColor] || LIP_COLOR_MAP.natural;
    const dress = DRESS_COLORS[dressStyle] || DRESS_COLORS.modern;
    return { skin, hColor, eColor, lColor, dress, hash };
  }, [name, skinTone, hairColor, eyeColor, lipColor, dressStyle]);

  const { skin, hColor, eColor, lColor, dress, hash } = config;
  const isFemale = gender === 'female';
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const faceR = r * 0.7;
  const gradId = `skin-${hash}-${size}`;
  const hairId = `hair-${hash}-${size}`;
  const bgId = `bg-${hash}-${size}`;

  // Eye size multiplier
  const eyeMult = eyeSize === 'large' ? 1.3 : eyeSize === 'small' ? 0.75 : 1;
  // Lip thickness
  const lipMult = lipStyle === 'full' ? 1.4 : lipStyle === 'thin' ? 0.7 : 1;
  // Hair length factor
  const isLongHair = hairLength === 'long' || (isFemale && hairLength !== 'short');
  const isShortHair = hairLength === 'short';

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
          <stop offset="0%" stopColor={hColor} />
          <stop offset="100%" stopColor={hColor} stopOpacity="0.8" />
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

      {/* Body/shoulders with dress style */}
      <ellipse cx={cx} cy={cy + r * 0.85} rx={faceR * 0.65} ry={faceR * 0.35} fill={dress.primary} />
      {dress.pattern && (
        <ellipse cx={cx} cy={cy + r * 0.85} rx={faceR * 0.55} ry={faceR * 0.25} fill={dress.pattern} opacity="0.3" />
      )}
      {/* Collar for formal */}
      {dressStyle === 'formal' && (
        <g>
          <line x1={cx - faceR * 0.12} y1={cy + faceR * 0.65} x2={cx - faceR * 0.05} y2={cy + faceR * 0.85} stroke="white" strokeWidth={faceR * 0.03} />
          <line x1={cx + faceR * 0.12} y1={cy + faceR * 0.65} x2={cx + faceR * 0.05} y2={cy + faceR * 0.85} stroke="white" strokeWidth={faceR * 0.03} />
        </g>
      )}
      {/* Traditional neckline pattern */}
      {dressStyle === 'traditional' && isFemale && (
        <path d={`M ${cx - faceR * 0.2} ${cy + faceR * 0.65} Q ${cx} ${cy + faceR * 0.75} ${cx + faceR * 0.2} ${cy + faceR * 0.65}`} fill="none" stroke="#FFD700" strokeWidth={faceR * 0.025} />
      )}

      {/* Face */}
      <ellipse cx={cx} cy={cy - r * 0.05} rx={faceR * 0.58} ry={faceR * 0.65} fill={`url(#${gradId})`} />

      {/* Blush */}
      <ellipse cx={cx - faceR * 0.35} cy={cy + faceR * 0.15} rx={faceR * 0.12} ry={faceR * 0.08} fill={skin.blush} opacity="0.35" />
      <ellipse cx={cx + faceR * 0.35} cy={cy + faceR * 0.15} rx={faceR * 0.12} ry={faceR * 0.08} fill={skin.blush} opacity="0.35" />

      {/* Eyes — sized by eyeSize */}
      <ellipse cx={cx - faceR * 0.2} cy={cy - faceR * 0.12} rx={faceR * 0.09 * eyeMult} ry={faceR * 0.11 * eyeMult} fill="white" />
      <ellipse cx={cx + faceR * 0.2} cy={cy - faceR * 0.12} rx={faceR * 0.09 * eyeMult} ry={faceR * 0.11 * eyeMult} fill="white" />
      <circle cx={cx - faceR * 0.2} cy={cy - faceR * 0.1} r={faceR * 0.055 * eyeMult} fill={eColor} />
      <circle cx={cx + faceR * 0.2} cy={cy - faceR * 0.1} r={faceR * 0.055 * eyeMult} fill={eColor} />
      {/* Eye shine */}
      <circle cx={cx - faceR * 0.18} cy={cy - faceR * 0.13} r={faceR * 0.02 * eyeMult} fill="white" />
      <circle cx={cx + faceR * 0.22} cy={cy - faceR * 0.13} r={faceR * 0.02 * eyeMult} fill="white" />

      {/* Eyelashes for female */}
      {isFemale && (
        <g>
          <line x1={cx - faceR * 0.28} y1={cy - faceR * 0.2} x2={cx - faceR * 0.32} y2={cy - faceR * 0.26} stroke={hColor} strokeWidth={1} strokeLinecap="round" />
          <line x1={cx + faceR * 0.28} y1={cy - faceR * 0.2} x2={cx + faceR * 0.32} y2={cy - faceR * 0.26} stroke={hColor} strokeWidth={1} strokeLinecap="round" />
          {eyeSize === 'large' && (
            <>
              <line x1={cx - faceR * 0.25} y1={cy - faceR * 0.22} x2={cx - faceR * 0.27} y2={cy - faceR * 0.28} stroke={hColor} strokeWidth={0.8} strokeLinecap="round" />
              <line x1={cx + faceR * 0.25} y1={cy - faceR * 0.22} x2={cx + faceR * 0.27} y2={cy - faceR * 0.28} stroke={hColor} strokeWidth={0.8} strokeLinecap="round" />
            </>
          )}
        </g>
      )}

      {/* Eyebrows */}
      <path d={`M ${cx - faceR * 0.3} ${cy - faceR * 0.27} Q ${cx - faceR * 0.2} ${cy - faceR * 0.35} ${cx - faceR * 0.1} ${cy - faceR * 0.27}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.035} strokeLinecap="round" />
      <path d={`M ${cx + faceR * 0.1} ${cy - faceR * 0.27} Q ${cx + faceR * 0.2} ${cy - faceR * 0.35} ${cx + faceR * 0.3} ${cy - faceR * 0.27}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.035} strokeLinecap="round" />

      {/* Nose */}
      <path d={`M ${cx} ${cy - faceR * 0.02} Q ${cx + faceR * 0.06} ${cy + faceR * 0.08} ${cx} ${cy + faceR * 0.1}`} fill="none" stroke={skin.shadow} strokeWidth={faceR * 0.025} strokeLinecap="round" />

      {/* Mouth/Lips — customizable */}
      <path
        d={`M ${cx - faceR * 0.14 * lipMult} ${cy + faceR * 0.22} Q ${cx} ${cy + faceR * (0.28 + 0.05 * lipMult)} ${cx + faceR * 0.14 * lipMult} ${cy + faceR * 0.22}`}
        fill={lColor}
        stroke={lColor}
        strokeWidth={faceR * 0.02 * lipMult}
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Upper lip line */}
      <path
        d={`M ${cx - faceR * 0.12 * lipMult} ${cy + faceR * 0.21} Q ${cx - faceR * 0.04} ${cy + faceR * 0.19} ${cx} ${cy + faceR * 0.2} Q ${cx + faceR * 0.04} ${cy + faceR * 0.19} ${cx + faceR * 0.12 * lipMult} ${cy + faceR * 0.21}`}
        fill="none"
        stroke={lColor}
        strokeWidth={faceR * 0.015 * lipMult}
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Hair */}
      {isLongHair ? (
        <g>
          <ellipse cx={cx} cy={cy - r * 0.25} rx={faceR * 0.64} ry={faceR * 0.55} fill={`url(#${hairId})`} />
          <path d={`M ${cx - faceR * 0.55} ${cy - faceR * 0.2} Q ${cx - faceR * 0.7} ${cy + faceR * 0.3} ${cx - faceR * 0.5} ${cy + faceR * (hairLength === 'long' ? 0.9 : 0.7)}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.15} strokeLinecap="round" />
          <path d={`M ${cx + faceR * 0.55} ${cy - faceR * 0.2} Q ${cx + faceR * 0.7} ${cy + faceR * 0.3} ${cx + faceR * 0.5} ${cy + faceR * (hairLength === 'long' ? 0.9 : 0.7)}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.15} strokeLinecap="round" />
          {hairTexture === 'curly' && (
            <>
              <circle cx={cx - faceR * 0.55} cy={cy + faceR * 0.5} r={faceR * 0.08} fill={hColor} opacity="0.7" />
              <circle cx={cx + faceR * 0.55} cy={cy + faceR * 0.5} r={faceR * 0.08} fill={hColor} opacity="0.7" />
              <circle cx={cx - faceR * 0.45} cy={cy + faceR * 0.7} r={faceR * 0.07} fill={hColor} opacity="0.6" />
              <circle cx={cx + faceR * 0.45} cy={cy + faceR * 0.7} r={faceR * 0.07} fill={hColor} opacity="0.6" />
            </>
          )}
          {hairTexture === 'wavy' && (
            <>
              <path d={`M ${cx - faceR * 0.5} ${cy + faceR * 0.4} Q ${cx - faceR * 0.6} ${cy + faceR * 0.5} ${cx - faceR * 0.48} ${cy + faceR * 0.6}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.06} strokeLinecap="round" opacity="0.5" />
              <path d={`M ${cx + faceR * 0.5} ${cy + faceR * 0.4} Q ${cx + faceR * 0.6} ${cy + faceR * 0.5} ${cx + faceR * 0.48} ${cy + faceR * 0.6}`} fill="none" stroke={hColor} strokeWidth={faceR * 0.06} strokeLinecap="round" opacity="0.5" />
            </>
          )}
        </g>
      ) : (
        <g>
          <ellipse cx={cx} cy={cy - r * 0.28} rx={faceR * 0.62} ry={faceR * (isShortHair ? 0.38 : 0.42)} fill={`url(#${hairId})`} />
          {hairTexture === 'curly' && (
            <>
              <circle cx={cx - faceR * 0.4} cy={cy - faceR * 0.45} r={faceR * 0.1} fill={hColor} />
              <circle cx={cx + faceR * 0.4} cy={cy - faceR * 0.45} r={faceR * 0.1} fill={hColor} />
              <circle cx={cx} cy={cy - faceR * 0.55} r={faceR * 0.1} fill={hColor} />
            </>
          )}
          {/* Side burns for short male hair */}
          {isShortHair && !isFemale && (
            <>
              <rect x={cx - faceR * 0.56} y={cy - faceR * 0.2} width={faceR * 0.06} height={faceR * 0.25} rx={faceR * 0.03} fill={hColor} opacity="0.6" />
              <rect x={cx + faceR * 0.5} y={cy - faceR * 0.2} width={faceR * 0.06} height={faceR * 0.25} rx={faceR * 0.03} fill={hColor} opacity="0.6" />
            </>
          )}
        </g>
      )}

      {/* Traditional accessories */}
      {dressStyle === 'traditional' && isFemale && (
        <g>
          {/* Bindi */}
          <circle cx={cx} cy={cy - faceR * 0.35} r={faceR * 0.035} fill="#C62828" />
          {/* Earrings */}
          <circle cx={cx - faceR * 0.52} cy={cy + faceR * 0.1} r={faceR * 0.04} fill="#FFD700" />
          <circle cx={cx + faceR * 0.52} cy={cy + faceR * 0.1} r={faceR * 0.04} fill="#FFD700" />
        </g>
      )}

      {/* Sporty headband */}
      {dressStyle === 'sporty' && (
        <path d={`M ${cx - faceR * 0.55} ${cy - faceR * 0.35} Q ${cx} ${cy - faceR * 0.5} ${cx + faceR * 0.55} ${cy - faceR * 0.35}`} fill="none" stroke={dress.pattern || dress.primary} strokeWidth={faceR * 0.06} strokeLinecap="round" opacity="0.8" />
      )}

      {/* Level crown */}
      {showCrown && (
        <polygon points={`${cx - faceR * 0.2},${cy - r * 0.65} ${cx - faceR * 0.1},${cy - r * 0.82} ${cx},${cy - r * 0.7} ${cx + faceR * 0.1},${cy - r * 0.82} ${cx + faceR * 0.2},${cy - r * 0.65}`} fill="#FFD700" stroke="#DAA520" strokeWidth={0.5} />
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
