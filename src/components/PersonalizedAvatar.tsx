import { useMemo } from 'react';

interface PersonalizedAvatarProps {
  name: string;
  gender: 'female' | 'male' | 'other';
  size?: number;
  avatarStyle?: number;
  className?: string;
}

const PALETTE = {
  female: [
    ['hsl(340, 60%, 65%)', 'hsl(12, 76%, 62%)'],
    ['hsl(300, 40%, 60%)', 'hsl(340, 60%, 65%)'],
    ['hsl(350, 70%, 55%)', 'hsl(20, 80%, 60%)'],
    ['hsl(280, 50%, 60%)', 'hsl(320, 55%, 65%)'],
    ['hsl(10, 70%, 60%)', 'hsl(340, 65%, 55%)'],
  ],
  male: [
    ['hsl(210, 60%, 55%)', 'hsl(190, 50%, 50%)'],
    ['hsl(230, 50%, 55%)', 'hsl(200, 60%, 50%)'],
    ['hsl(180, 45%, 45%)', 'hsl(210, 55%, 55%)'],
    ['hsl(250, 45%, 55%)', 'hsl(220, 50%, 50%)'],
    ['hsl(200, 55%, 50%)', 'hsl(170, 45%, 45%)'],
  ],
  other: [
    ['hsl(150, 45%, 50%)', 'hsl(180, 50%, 45%)'],
    ['hsl(45, 70%, 55%)', 'hsl(30, 65%, 50%)'],
    ['hsl(160, 50%, 45%)', 'hsl(130, 45%, 50%)'],
    ['hsl(60, 60%, 50%)', 'hsl(40, 70%, 55%)'],
    ['hsl(140, 45%, 50%)', 'hsl(100, 40%, 45%)'],
  ],
};

const FACE_SHAPES = [
  // Smiling face
  (cx: number, cy: number, r: number, colors: string[]) => (
    <g key="face1">
      {/* Eyes */}
      <circle cx={cx - r * 0.25} cy={cy - r * 0.1} r={r * 0.08} fill="white" opacity="0.9" />
      <circle cx={cx + r * 0.25} cy={cy - r * 0.1} r={r * 0.08} fill="white" opacity="0.9" />
      {/* Smile */}
      <path
        d={`M ${cx - r * 0.2} ${cy + r * 0.15} Q ${cx} ${cy + r * 0.35} ${cx + r * 0.2} ${cy + r * 0.15}`}
        fill="none"
        stroke="white"
        strokeWidth={r * 0.05}
        strokeLinecap="round"
        opacity="0.8"
      />
    </g>
  ),
  // Star eyes
  (cx: number, cy: number, r: number, colors: string[]) => (
    <g key="face2">
      <text x={cx - r * 0.25} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.25} fill="white" opacity="0.9">✦</text>
      <text x={cx + r * 0.25} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.25} fill="white" opacity="0.9">✦</text>
      <circle cx={cx} cy={cy + r * 0.22} r={r * 0.06} fill="white" opacity="0.7" />
    </g>
  ),
  // Wink
  (cx: number, cy: number, r: number, colors: string[]) => (
    <g key="face3">
      <circle cx={cx - r * 0.25} cy={cy - r * 0.05} r={r * 0.07} fill="white" opacity="0.9" />
      <path
        d={`M ${cx + r * 0.18} ${cy - r * 0.05} L ${cx + r * 0.32} ${cy - r * 0.05}`}
        stroke="white"
        strokeWidth={r * 0.05}
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d={`M ${cx - r * 0.15} ${cy + r * 0.2} Q ${cx} ${cy + r * 0.32} ${cx + r * 0.15} ${cy + r * 0.2}`}
        fill="none"
        stroke="white"
        strokeWidth={r * 0.05}
        strokeLinecap="round"
        opacity="0.8"
      />
    </g>
  ),
  // Cat face
  (cx: number, cy: number, r: number, colors: string[]) => (
    <g key="face4">
      {/* Cat ears */}
      <polygon points={`${cx - r * 0.45},${cy - r * 0.35} ${cx - r * 0.25},${cy - r * 0.65} ${cx - r * 0.1},${cy - r * 0.3}`} fill="white" opacity="0.3" />
      <polygon points={`${cx + r * 0.45},${cy - r * 0.35} ${cx + r * 0.25},${cy - r * 0.65} ${cx + r * 0.1},${cy - r * 0.3}`} fill="white" opacity="0.3" />
      {/* Eyes */}
      <ellipse cx={cx - r * 0.2} cy={cy} rx={r * 0.06} ry={r * 0.09} fill="white" opacity="0.9" />
      <ellipse cx={cx + r * 0.2} cy={cy} rx={r * 0.06} ry={r * 0.09} fill="white" opacity="0.9" />
      {/* Nose + whiskers */}
      <polygon points={`${cx},${cy + r * 0.12} ${cx - r * 0.05},${cy + r * 0.2} ${cx + r * 0.05},${cy + r * 0.2}`} fill="white" opacity="0.7" />
    </g>
  ),
  // Peaceful (closed eyes)
  (cx: number, cy: number, r: number, colors: string[]) => (
    <g key="face5">
      <path d={`M ${cx - r * 0.32} ${cy - r * 0.05} Q ${cx - r * 0.25} ${cy - r * 0.15} ${cx - r * 0.18} ${cy - r * 0.05}`} fill="none" stroke="white" strokeWidth={r * 0.04} strokeLinecap="round" opacity="0.9" />
      <path d={`M ${cx + r * 0.18} ${cy - r * 0.05} Q ${cx + r * 0.25} ${cy - r * 0.15} ${cx + r * 0.32} ${cy - r * 0.05}`} fill="none" stroke="white" strokeWidth={r * 0.04} strokeLinecap="round" opacity="0.9" />
      <path d={`M ${cx - r * 0.12} ${cy + r * 0.2} Q ${cx} ${cy + r * 0.28} ${cx + r * 0.12} ${cy + r * 0.2}`} fill="none" stroke="white" strokeWidth={r * 0.04} strokeLinecap="round" opacity="0.8" />
    </g>
  ),
];

export default function PersonalizedAvatar({ name, gender, size = 64, avatarStyle = 0, className = '' }: PersonalizedAvatarProps) {
  const { colors, faceIndex, initial, patternId } = useMemo(() => {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const palette = PALETTE[gender] || PALETTE.other;
    const colorIdx = hash % palette.length;
    const faceIdx = avatarStyle % FACE_SHAPES.length;
    return {
      colors: palette[colorIdx],
      faceIndex: faceIdx,
      initial: name.charAt(0).toUpperCase(),
      patternId: `avatar-pattern-${hash}`,
    };
  }, [name, gender, avatarStyle]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ borderRadius: '50%' }}
    >
      <defs>
        <radialGradient id={patternId} cx="30%" cy="30%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${patternId})`} />
      {/* Decorative ring */}
      <circle cx={cx} cy={cy} r={r * 0.88} fill="none" stroke="white" strokeWidth={r * 0.03} opacity="0.15" />
      {/* Face */}
      {FACE_SHAPES[faceIndex](cx, cy, r, colors)}
      {/* Initial badge */}
      <circle cx={cx + r * 0.55} cy={cy + r * 0.55} r={r * 0.22} fill="white" opacity="0.25" />
      <text
        x={cx + r * 0.55}
        y={cy + r * 0.55}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={r * 0.22}
        fontWeight="bold"
        fill="white"
        opacity="0.9"
      >
        {initial}
      </text>
    </svg>
  );
}
