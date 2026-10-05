import { FACTORS, FACTOR_MAX } from "@/lib/diagnostic";

export type PentagonSeries = {
  label: string;
  color: string;
  scores: Record<string, number>;
  dashed?: boolean;
};

const W = 420;
const H = 350;
const CX = W / 2;
const CY = 185;
const R = 120;
const RINGS = [5, 10, 15, 20];

function point(i: number, value: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / FACTORS.length;
  const r = (value / FACTOR_MAX) * R;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)] as const;
}

function polygon(values: number[]) {
  return values.map((v, i) => point(i, v).join(",")).join(" ");
}

export default function Pentagon({ series, showValues = true }: { series: PentagonSeries[]; showValues?: boolean }) {
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-[440px]" role="img" aria-label="감성지능 오각형 차트">
        {RINGS.map((ring) => (
          <g key={ring}>
            <polygon
              points={polygon(FACTORS.map(() => ring))}
              fill={ring === FACTOR_MAX ? "#f8fafc" : "none"}
              stroke="#cbd5e1"
              strokeWidth={ring === FACTOR_MAX ? 1.5 : 1}
            />
            <text x={CX + 4} y={point(0, ring)[1] + 4} fontSize="9" fill="#94a3b8">
              {ring}
            </text>
          </g>
        ))}
        {FACTORS.map((f, i) => {
          const [x, y] = point(i, FACTOR_MAX);
          return <line key={f.id} x1={CX} y1={CY} x2={x} y2={y} stroke="#e2e8f0" />;
        })}
        {series.map((s) => {
          const values = FACTORS.map((f) => s.scores[f.id] ?? 0);
          return (
            <g key={s.label}>
              <polygon
                points={polygon(values)}
                fill={s.dashed ? "none" : s.color}
                fillOpacity={0.18}
                stroke={s.color}
                strokeWidth={2.5}
                strokeDasharray={s.dashed ? "6 4" : undefined}
                strokeLinejoin="round"
              />
              {values.map((v, i) => {
                const [x, y] = point(i, v);
                return <circle key={i} cx={x} cy={y} r={3.5} fill={s.color} />;
              })}
            </g>
          );
        })}
        {FACTORS.map((f, i) => {
          const [x, y] = point(i, FACTOR_MAX + 4.2);
          const main = series[0];
          const v = main?.scores[f.id];
          return (
            <g key={f.id}>
              <text x={x} y={y} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#334155">
                {f.name}
              </text>
              {showValues && v != null && (
                <text x={x} y={y + 15} textAnchor="middle" fontSize="12" fontWeight="700" fill={f.color}>
                  {Number.isInteger(v) ? v : v.toFixed(1)}점
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-slate-600">
          {series.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-5"
                style={{ background: s.color, borderTop: s.dashed ? `2px dashed ${s.color}` : undefined }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
