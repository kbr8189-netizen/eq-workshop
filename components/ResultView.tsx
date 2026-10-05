"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Lightbulb, NotebookPen, PieChart, Scale } from "lucide-react";
import Pentagon from "@/components/Pentagon";
import {
  FACTORS,
  FACTOR_MAX,
  balanceOf,
  getFactor,
  levelOf,
  type ActionPlan,
  type DiagnosticResult,
} from "@/lib/diagnostic";

type Tab = "result" | "grow" | "plan";

const TABS: { id: Tab; label: string; icon: typeof PieChart }[] = [
  { id: "result", label: "나의 결과", icon: PieChart },
  { id: "grow", label: "기르는 방법", icon: Lightbulb },
  { id: "plan", label: "액션 플랜", icon: NotebookPen },
];

const LEVEL_STYLE = {
  high: "bg-emerald-100 text-emerald-800",
  mid: "bg-slate-100 text-slate-700",
  low: "bg-amber-100 text-amber-800",
};

export default function ResultView({
  result,
  onSavePlan,
  compareScores,
}: {
  result: DiagnosticResult;
  onSavePlan?: (plan: ActionPlan) => Promise<void>;
  compareScores?: { label: string; scores: Record<string, number> };
}) {
  const [tab, setTab] = useState<Tab>("result");
  const top = getFactor(result.topFactorId)!;
  const low = getFactor(result.lowFactorId)!;
  const balance = balanceOf(result.range);

  return (
    <div>
      <div className="no-print mb-5 flex gap-1 rounded-xl bg-slate-200/70 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-bold transition ${
              tab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "result" && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-extrabold">
                {result.participant.name}님의 감성지능 오각형
                {result.participant.group && (
                  <span className="ml-2 text-sm font-medium text-slate-500">{result.participant.group}</span>
                )}
              </h2>
              <div className="text-sm text-slate-500">
                총점 <b className="text-xl text-indigo-700">{result.total}</b> / {FACTOR_MAX * FACTORS.length}
              </div>
            </div>
            <div className="mt-3">
              <Pentagon
                series={[
                  { label: result.participant.name, color: "#4f46e5", scores: result.factorScores },
                  ...(compareScores
                    ? [{ label: compareScores.label, color: "#94a3b8", scores: compareScores.scores, dashed: true }]
                    : []),
                ]}
              />
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Scale className="h-4 w-4" /> 균형
              </div>
              <div className="mt-1 text-lg font-extrabold">{balance.label}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                최고·최저 영역 차이 {result.range}점. {balance.text}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <ArrowUpCircle className="h-4 w-4" /> 가장 높은 영역
              </div>
              <div className="mt-1 text-lg font-extrabold" style={{ color: top.color }}>
                {top.name} {result.factorScores[top.id]}점
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{top.high[0]}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <ArrowDownCircle className="h-4 w-4" /> 가장 낮은 영역
              </div>
              <div className="mt-1 text-lg font-extrabold" style={{ color: low.color }}>
                {low.name} {result.factorScores[low.id]}점
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{low.low[0]}</p>
            </div>
          </section>

          <section className="space-y-3">
            {FACTORS.map((f) => {
              const score = result.factorScores[f.id];
              const level = levelOf(score);
              return (
                <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-extrabold">
                      <span style={{ color: f.color }}>{f.no}.</span> {f.name}
                      <span className="ml-1.5 text-xs font-medium text-slate-400">{f.english}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${LEVEL_STYLE[level.tone]}`}>
                        {level.label}
                      </span>
                      <span className="font-extrabold">
                        {score}
                        <span className="text-xs font-medium text-slate-400"> / {FACTOR_MAX}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(score / FACTOR_MAX) * 100}%`, background: f.color }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{f.summary}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {(level.tone === "low" ? f.low : f.high).map((t) => (
                      <li key={t}>· {t}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {tab === "grow" && <GrowGuide highlightId={low.id} />}

      {tab === "plan" && <PlanForm result={result} onSave={onSavePlan} />}
    </div>
  );
}

export function GrowGuide({ highlightId }: { highlightId?: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        감성지능은 타고나는 것이 아니라 연습으로 기를 수 있는 능력입니다. 높은 영역은 더 강화하고, 낮은 영역은 작은
        행동부터 꾸준히 보완해 보세요.
      </p>
      {FACTORS.map((f) => (
        <section
          key={f.id}
          className={`rounded-2xl border bg-white p-5 ${f.id === highlightId ? "border-amber-300 ring-2 ring-amber-200" : "border-slate-200"}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: f.color }} />
            <h3 className="text-lg font-extrabold">
              {f.no}. {f.name}
            </h3>
            <span className="text-xs text-slate-400">{f.english}</span>
            {f.id === highlightId && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                나의 보완 영역
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-slate-600">{f.summary}</p>
          <ol className="mt-3 space-y-2">
            {f.grow.map((g, i) => (
              <li key={g} className="flex gap-2.5 text-sm text-slate-800">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: f.color }}
                >
                  {i + 1}
                </span>
                {g}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function PlanForm({ result, onSave }: { result: DiagnosticResult; onSave?: (plan: ActionPlan) => Promise<void> }) {
  const top = getFactor(result.topFactorId)!;
  const low = getFactor(result.lowFactorId)!;
  const [plan, setPlan] = useState<ActionPlan>(
    result.actionPlan ?? { strengthen: "", improve: "", remember: "" },
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const readOnly = !onSave;

  const fields: { key: keyof ActionPlan; title: string; hint: string }[] = [
    {
      key: "strengthen",
      title: `높은 영역 강화: ${top.name}`,
      hint: `${top.name}을(를) 업무와 관계에서 더 살리려면 무엇을 해 볼까요?`,
    },
    {
      key: "improve",
      title: `낮은 영역 보완: ${low.name}`,
      hint: `${low.name}을(를) 기르기 위해 이번 주부터 실천할 작은 행동은?`,
    },
    { key: "remember", title: "Remember Point", hint: "오늘 진단에서 꼭 기억하고 싶은 한 가지" },
  ];

  async function save() {
    if (!onSave) return;
    setStatus("saving");
    try {
      await onSave(plan);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <label key={f.key} className="block rounded-2xl border border-slate-200 bg-white p-5">
          <div className="font-extrabold">{f.title}</div>
          <div className="mt-0.5 text-sm text-slate-500">{f.hint}</div>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            value={plan[f.key]}
            disabled={readOnly}
            maxLength={1000}
            placeholder={readOnly ? "작성하지 않음" : ""}
            onChange={(e) => {
              setPlan({ ...plan, [f.key]: e.target.value });
              setStatus("idle");
            }}
          />
        </label>
      ))}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {status === "saving" ? "저장 중…" : "액션 플랜 저장"}
          </button>
          {status === "saved" && <span className="text-sm font-bold text-emerald-600">저장했어요</span>}
          {status === "error" && <span className="text-sm font-bold text-rose-600">저장하지 못했어요. 다시 눌러주세요.</span>}
        </div>
      )}
    </div>
  );
}
