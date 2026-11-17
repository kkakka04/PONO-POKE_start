import React, { useEffect, useId, useRef } from 'react';
import { INGREDIENTS } from '../data/menu';
import { IngredientKey, PortionLevel } from '../types/kiosk';
import { IngredientPatterns } from './IngredientPatterns';

const CFG = {
  cx: 540,
  cy: 500,
  R: 374,        // Larger centerpiece bowl radius without colliding with top/bottom typography
  R0: 118,
  RINGS: 4,
  RING_GAP: 7,
  COLS: 48,
  MIN_SPAN: 4.2,
  DUR: 1850,
  HOLD: 1350,
  RING_DELAY: 150,
  TILE: 480,
  GAP: 5,
};

const N = CFG.COLS;
const n = INGREDIENTS.length;
const ringT = (CFG.R - CFG.R0 - CFG.RING_GAP * (CFG.RINGS - 1)) / CFG.RINGS;

function ringR(k: number): [number, number] {
  const a = CFG.R0 + k * (ringT + CFG.RING_GAP);
  return [a, a + ringT];
}

function polar(r: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  return [CFG.cx + r * Math.sin(t), CFG.cy - r * Math.cos(t)];
}

function sectorPath(a0: number, a1: number, ri: number, ro: number, insetDeg = 0.35): string {
  const start = a0 + insetDeg;
  const end = a1 - insetDeg;
  const span = end - start;
  if (span <= 0.4) return '';
  if (span >= 359.2) {
    const [x0, y0] = polar(ro, 0);
    const [x1, y1] = polar(ro, 180);
    const [x2, y2] = polar(ri, 180);
    const [x3, y3] = polar(ri, 0);
    return `M${x0},${y0}A${ro},${ro} 0 1 1 ${x1},${y1}A${ro},${ro} 0 1 1 ${x0},${y0}M${x3},${y3}A${ri},${ri} 0 1 0 ${x2},${y2}A${ri},${ri} 0 1 0 ${x3},${y3}Z`;
  }
  const big = span > 180 ? 1 : 0;
  const [x0, y0] = polar(ro, start);
  const [x1, y1] = polar(ro, end);
  const [x2, y2] = polar(ri, end);
  const [x3, y3] = polar(ri, start);
  return `M${x0.toFixed(2)},${y0.toFixed(2)}A${ro},${ro} 0 ${big} 1 ${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}A${ri},${ri} 0 ${big} 0 ${x3.toFixed(2)},${y3.toFixed(2)}Z`;
}

/**
 * Chewy ease-in-out curve with subtle damped elastic settle (~2.8%).
 */
function chewyEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const quint = t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
  if (t > 0.55) {
    const u = (t - 0.55) / 0.45;
    const settle = Math.sin(u * Math.PI * 1.35) * Math.exp(-u * 4.2) * 0.048;
    return quint + settle;
  }
  return quint;
}

function smoothEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 8 * Math.pow(t, 4) : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

const rndRange = (a: number, b: number) => a + Math.random() * (b - a);

function computeInteractiveTargets(portions: Record<IngredientKey, PortionLevel>) {
  const weights: number[] = INGREDIENTS.map((ing): number => {
    const lvl = portions[ing.k] ?? 0;
    if (lvl === 0) return 3.2;
    if (lvl === 1) return 5.5;
    if (lvl === 2) return 7.8;
    return 10.5;
  });

  const totalW = weights.reduce((a, b) => a + b, 0);
  const spans = weights.map((w) => (w / totalW) * N);
  const ringOffsets = [0, 1.4, -0.9, 2.0];
  const baseStart = -N / n;

  const boundaries: number[][] = [];
  const fills: number[][] = [];

  for (let k = 0; k < CFG.RINGS; k++) {
    const row: number[] = [];
    const fillRow: number[] = [];
    let acc = baseStart + ringOffsets[k];
    for (let i = 0; i < n; i++) {
      row.push(acc);
      acc += spans[i];
      const lvl = portions[INGREDIENTS[i].k] ?? 0;
      const activeRings = lvl === 0 ? 0 : lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
      fillRow.push(k < activeRings ? 1 : 0);
    }
    boundaries.push(row);
    fills.push(fillRow);
  }
  return { boundaries, fills };
}

interface KineticWheelProps {
  mode?: 'attract' | 'interactive';
  exiting?: boolean;
  portions?: Record<IngredientKey, PortionLevel>;
  highlightedKey?: IngredientKey | null;
  onSelectIngredient?: (key: IngredientKey) => void;
  className?: string;
}

export const KineticWheel: React.FC<KineticWheelProps> = ({
  mode = 'attract',
  exiting = false,
  portions,
  highlightedKey = null,
  onSelectIngredient,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const idPrefix = `tex_${uid}_`;

  const outlineRefs = useRef<(SVGPathElement | null)[][]>(
    Array.from({ length: CFG.RINGS }, () => Array(n).fill(null))
  );
  const fillRefs = useRef<(SVGPathElement | null)[][]>(
    Array.from({ length: CFG.RINGS }, () => Array(n).fill(null))
  );
  const blurRefs = useRef<(SVGFEGaussianBlurElement | null)[]>(
    Array(CFG.RINGS).fill(null)
  );
  const blurSmoothedRef = useRef<number[]>(Array(CFG.RINGS).fill(0));

  const START = -N / n;
  const curRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, () => Array.from({ length: n }, (_, i) => START + (i * N) / n))
  );
  const fromRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, () => Array.from({ length: n }, (_, i) => START + (i * N) / n))
  );
  const toRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, () => Array.from({ length: n }, (_, i) => START + (i * N) / n))
  );

  const fillCurRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, (_, k) =>
      Array.from({ length: n }, (__, i) => ((k + i) % 4 === 0 ? 0 : 1))
    )
  );
  const fillFromRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, (_, k) =>
      Array.from({ length: n }, (__, i) => ((k + i) % 4 === 0 ? 0 : 1))
    )
  );
  const fillToRef = useRef<number[][]>(
    Array.from({ length: CFG.RINGS }, (_, k) =>
      Array.from({ length: n }, (__, i) => ((k + i) % 4 === 0 ? 0 : 1))
    )
  );

  const t0Ref = useRef<number>(0);

  const generateAttractTargets = () => {
    const w = INGREDIENTS.map(() => Math.pow(Math.random(), 1.45) + 0.4);
    const ws = w.reduce((a, b) => a + b, 0);
    const extra = N - CFG.MIN_SPAN * n;
    const span = w.map((x) => CFG.MIN_SPAN + (extra * x) / ws);

    const base = rndRange(-N / 2, N / 2);
    const b: number[] = [];
    let acc = base;
    for (let i = 0; i < n; i++) {
      b[i] = acc;
      acc += span[i];
    }

    const cur = curRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    const fCur = fillCurRef.current;
    const fFrom = fillFromRef.current;
    const fTo = fillToRef.current;

    for (let k = 0; k < CFG.RINGS; k++) {
      const shift = rndRange(-2.6, 2.6);
      for (let i = 0; i < n; i++) {
        from[k][i] = cur[k][i];
        to[k][i] = b[i] + shift;
      }
      for (let i = 0; i < n; i++) {
        const d = to[k][i] - from[k][i];
        if (d > N / 2) to[k][i] -= N;
        else if (d < -N / 2) to[k][i] += N;
      }
      for (let i = 1; i < n; i++) {
        while (to[k][i] < to[k][i - 1] + CFG.MIN_SPAN - 0.01) to[k][i] += N;
      }
      for (let i = 1; i < n; i++) {
        while (from[k][i] < from[k][i - 1]) from[k][i] += N;
      }

      for (let i = 0; i < n; i++) {
        fFrom[k][i] = fCur[k][i];
        fTo[k][i] = Math.random() < 0.74 ? 1 : 0;
      }
    }
    t0Ref.current = performance.now();
  };

  useEffect(() => {
    if (mode !== 'interactive' || !portions) return;
    const { boundaries, fills } = computeInteractiveTargets(portions);
    const cur = curRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    const fCur = fillCurRef.current;
    const fFrom = fillFromRef.current;
    const fTo = fillToRef.current;

    for (let k = 0; k < CFG.RINGS; k++) {
      for (let i = 0; i < n; i++) {
        from[k][i] = cur[k][i];
        to[k][i] = boundaries[k][i];
        fFrom[k][i] = fCur[k][i];
        fTo[k][i] = fills[k][i];
      }
    }
    t0Ref.current = performance.now();
  }, [mode, portions]);

  useEffect(() => {
    let rafId = 0;
    let firstTimer: number | undefined;
    const dur = mode === 'interactive' ? 880 : CFG.DUR;
    const ringDelay = mode === 'interactive' ? 75 : CFG.RING_DELAY;

    const draw = (now: number) => {
      const cur = curRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      const fCur = fillCurRef.current;
      const fFrom = fillFromRef.current;
      const fTo = fillToRef.current;

      for (let k = 0; k < CFG.RINGS; k++) {
        const rawP = Math.min(1, Math.max(0, (now - t0Ref.current - k * ringDelay) / dur));
        const e = chewyEase(rawP);
        const fe = smoothEase(rawP);
        const [ri, ro] = ringR(k);

        let maxStepVel = 0;
        for (let i = 0; i < n; i++) {
          const prevVal = cur[k][i];
          const nextVal = from[k][i] + (to[k][i] - from[k][i]) * e;
          cur[k][i] = nextVal;
          const dv = Math.abs(nextVal - prevVal);
          if (dv > maxStepVel) maxStepVel = dv;

          fCur[k][i] = fFrom[k][i] + (fTo[k][i] - fFrom[k][i]) * fe;
        }

        const targetBlur = rawP > 0 && rawP < 1 ? Math.min(2.4, maxStepVel * 12) : 0;
        const smoothedBlur = blurSmoothedRef.current[k] * 0.72 + targetBlur * 0.28;
        blurSmoothedRef.current[k] = smoothedBlur < 0.04 ? 0 : smoothedBlur;
        const blurEl = blurRefs.current[k];
        if (blurEl) {
          blurEl.setAttribute('stdDeviation', blurSmoothedRef.current[k].toFixed(2));
        }

        for (let i = 0; i < n; i++) {
          const a = cur[k][i];
          const b = i < n - 1 ? cur[k][i + 1] : cur[k][0] + N;
          const dStr = sectorPath((a * 360) / N, (b * 360) / N, ri, ro);

          const outEl = outlineRefs.current[k][i];
          const fillEl = fillRefs.current[k][i];
          const opacity = Math.max(0, Math.min(1, fCur[k][i]));

          if (outEl) {
            outEl.setAttribute('d', dStr);
          }
          if (fillEl) {
            fillEl.setAttribute('d', dStr);
            fillEl.setAttribute('fill-opacity', opacity.toFixed(3));
            fillEl.setAttribute('stroke-opacity', (0.2 + opacity * 0.8).toFixed(3));
          }
        }
      }
    };

    if (mode === 'attract') {
      t0Ref.current = performance.now();
      firstTimer = window.setTimeout(generateAttractTargets, 650);
    }

    const loop = (now: number) => {
      if (mode === 'attract') {
        if (!t0Ref.current) t0Ref.current = now;
        if (now - t0Ref.current > CFG.DUR + CFG.RING_DELAY * CFG.RINGS + CFG.HOLD) {
          generateAttractTargets();
        }
      }
      draw(now);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      if (firstTimer) clearTimeout(firstTimer);
    };
  }, [mode]);

  const radialRayOuterR = CFG.R + 74; // 448 in SVG — thin fading rays around larger wheel
  const radialGuides = Array.from({ length: N }, (_, c) => {
    const a = (c * 360) / N;
    const [x0, y0] = polar(CFG.R0 - 12, a);
    const [x1, y1] = polar(radialRayOuterR, a);
    return { c, x0, y0, x1, y1, strong: c % 6 === 0 };
  });

  const ringOutlines = [
    ...Array.from({ length: CFG.RINGS + 1 }, (_, k) => {
      const r =
        k === 0
          ? CFG.R0 - 12
          : k === CFG.RINGS
            ? CFG.R + 10
            : ringR(k)[0] - CFG.RING_GAP / 2;
      return { id: `inner-${k}`, r, opacity: 0.22 };
    }),
    { id: 'halo-1', r: CFG.R + 28, opacity: 0.14 },
    { id: 'halo-2', r: CFG.R + 48, opacity: 0.08 },
  ];

  const outerTicks = Array.from({ length: 8 }, (_, d) => {
    const a = d * 45;
    const strong = d % 2 === 0;
    const [x0, y0] = polar(CFG.R + 18, a);
    const [x1, y1] = polar(CFG.R + (strong ? 46 : 36), a);
    return { d, x0, y0, x1, y1, strong };
  });

  return (
    <svg viewBox="0 0 1080 1000" className={className} aria-label="PONO POKE Radial Ingredient Wheel">
      <IngredientPatterns idPrefix={idPrefix} tileSize={CFG.TILE} />
      <defs>
        {Array.from({ length: CFG.RINGS }, (_, k) => (
          <filter key={k} id={`${idPrefix}blur${k}`} x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur
              ref={(el) => {
                blurRefs.current[k] = el;
              }}
              in="SourceGraphic"
              stdDeviation="0"
            />
          </filter>
        ))}

        <radialGradient
          id={`${idPrefix}spokeStrong`}
          cx={CFG.cx}
          cy={CFG.cy}
          r={radialRayOuterR}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="20%" stopColor="#77E024" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#77E024" stopOpacity="0.52" />
          <stop offset="84%" stopColor="#77E024" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#77E024" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${idPrefix}spokeSoft`}
          cx={CFG.cx}
          cy={CFG.cy}
          r={radialRayOuterR}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="20%" stopColor="#77E024" stopOpacity="0.22" />
          <stop offset="58%" stopColor="#77E024" stopOpacity="0.34" />
          <stop offset="85%" stopColor="#77E024" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#77E024" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        style={{
          transformOrigin: '540px 500px',
          transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease',
          transform: exiting ? 'scale(1.14) rotate(12deg)' : 'scale(1) rotate(0deg)',
          opacity: exiting ? 0 : 1,
        }}
      >
        {/* Ultra-thin Radiating Spokes & Concentric Architectural Grid (visible inside empty slots) */}
        <g>
          {radialGuides.map((g) => (
            <line
              key={g.c}
              x1={g.x0}
              y1={g.y0}
              x2={g.x1}
              y2={g.y1}
              stroke={`url(#${idPrefix}${g.strong ? 'spokeStrong' : 'spokeSoft'})`}
              strokeWidth={g.strong ? 1.8 : 1.2}
            />
          ))}
          {ringOutlines.map((o) => (
            <circle
              key={o.id}
              cx={CFG.cx}
              cy={CFG.cy}
              r={o.r}
              fill="none"
              stroke="#77E024"
              strokeOpacity={o.opacity}
              strokeWidth={0.55}
            />
          ))}
        </g>

        {/* Per-Ring Cell Layers with Dynamic Velocity Motion Blur & Empty/Filled Architecture */}
        {Array.from({ length: CFG.RINGS }, (_, k) => (
          <g key={k} filter={`url(#${idPrefix}blur${k})`}>
            {INGREDIENTS.map((ing, i) => {
              const isDimmed = highlightedKey !== null && highlightedKey !== ing.k;
              return (
                <g key={`${k}-${ing.k}`}>
                  <path
                    ref={(el) => {
                      outlineRefs.current[k][i] = el;
                    }}
                    fill="none"
                    stroke="#AEE784"
                    strokeWidth={0.65}
                    strokeLinejoin="round"
                  />
                  <path
                    ref={(el) => {
                      fillRefs.current[k][i] = el;
                    }}
                    fill={`url(#${idPrefix}${i})`}
                    stroke="#FFFFFF"
                    strokeWidth={CFG.GAP}
                    strokeLinejoin="round"
                    onClick={
                      onSelectIngredient
                        ? (e) => {
                            e.stopPropagation();
                            onSelectIngredient(ing.k);
                          }
                        : undefined
                    }
                    style={{
                      cursor: onSelectIngredient ? 'pointer' : 'inherit',
                      opacity: isDimmed ? 0.35 : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* Inner Radial Line Pass so the thicker radial spokes stay continuous inside the wheel */}
        <g className="pointer-events-none">
          {radialGuides.map((g) => (
            <line
              key={`over-${g.c}`}
              x1={g.x0}
              y1={g.y0}
              x2={polar(CFG.R, (g.c * 360) / N)[0]}
              y2={polar(CFG.R, (g.c * 360) / N)[1]}
              stroke="#77E024"
              strokeOpacity={g.strong ? 0.28 : 0.16}
              strokeWidth={g.strong ? 1.6 : 1.1}
            />
          ))}
        </g>

        {/* Slim Outer Lime Compass Ticks */}
        <g>
          {outerTicks.map((t) => (
            <line
              key={t.d}
              x1={t.x0}
              y1={t.y0}
              x2={t.x1}
              y2={t.y1}
              stroke={t.strong ? '#77E024' : '#CDEFB9'}
              strokeWidth={t.strong ? 6 : 4.5}
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>
    </svg>
  );
};
