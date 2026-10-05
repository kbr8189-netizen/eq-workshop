"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, HeartHandshake, Lightbulb, RotateCcw } from "lucide-react";
import ResultView from "@/components/ResultView";
import {
  DIAGNOSTIC,
  FACTORS,
  QUESTIONS,
  SCALE,
  type ActionPlan,
  type DiagnosticResult,
} from "@/lib/diagnostic";

const KEYS = { draft: "eq_draft", result: "eq_result" };

type Draft = { name: string; group: string; answers: Record<string, number>; step: number };
const EMPTY: Draft = { name: "", group: "", answers: {}, step: -1 };

function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function store(key: string, value: unknown) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(load<Draft>(KEYS.draft) ?? EMPTY);
    setResult(load<DiagnosticResult>(KEYS.result));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) store(KEYS.draft, draft);
  }, [draft, ready]);

  const pages = useMemo(() => FACTORS.map((f) => QUESTIONS.filter((q) => q.factorId === f.id)), []);
  const answeredCount = QUESTIONS.filter((q) => draft.answers[q.id] != null).length;

  function setStep(step: number) {
    setDraft((d) => ({ ...d, step }));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: draft.name, group: draft.group, answers: draft.answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "제출하지 못했어요.");
      setResult(data.result);
      store(KEYS.result, data.result);
      setDraft(EMPTY);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function savePlan(actionPlan: ActionPlan) {
    if (!result) return;
    const res = await fetch("/api/submit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: result.id, submittedAt: result.submittedAt, actionPlan }),
    });
    if (!res.ok) throw new Error("save failed");
    const next = { ...result, actionPlan };
    setResult(next);
    store(KEYS.result, next);
  }

  function restart() {
    if (!window.confirm("진단을 처음부터 다시 하시겠어요? 이 기기에 저장된 결과가 지워집니다.")) return;
    setResult(null);
    store(KEYS.result, null);
    setDraft(EMPTY);
  }

  if (!ready) return null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold tracking-wide text-indigo-600">{DIAGNOSTIC.courseTitle}</div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{DIAGNOSTIC.title}</h1>
        </div>
        <div className="no-print flex shrink-0 flex-col items-end gap-2 sm:flex-row">
          <Link
            href="/grow"
            className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          >
            <Lightbulb className="h-4 w-4" /> 기르는 방법
          </Link>
          {result && (
            <button
              onClick={restart}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" /> 다시 하기
            </button>
          )}
        </div>
      </header>

      {result ? (
        <ResultView result={result} onSavePlan={savePlan} />
      ) : draft.step < 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-indigo-600">
            <HeartHandshake className="h-6 w-6" />
            <span className="font-bold">{DIAGNOSTIC.subtitle}</span>
          </div>
          <p className="mt-4 leading-relaxed text-slate-700">
            총 {QUESTIONS.length}문항, {FACTORS.length}개 파트로 되어 있어요. 각 문장을 읽고 평소 나의 모습에 가장 가까운
            답을 골라주세요. 정답은 없으니 떠오르는 대로 솔직하게 답하면 됩니다.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">이름</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={draft.name}
                maxLength={30}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="홍길동"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">조 / 소속 (선택)</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={draft.group}
                maxLength={30}
                onChange={(e) => setDraft({ ...draft, group: e.target.value })}
                placeholder="1조"
              />
            </label>
          </div>
          <button
            disabled={!draft.name.trim()}
            onClick={() => setStep(0)}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-lg font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            {answeredCount > 0 ? "이어서 진단하기" : "진단 시작하기"}
          </button>
        </section>
      ) : (
        <section>
          <div className="mb-4">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>
                파트 {draft.step + 1} / {FACTORS.length}
              </span>
              <span>
                {answeredCount} / {QUESTIONS.length} 문항
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {pages[draft.step].map((q, i) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <p className="font-medium leading-relaxed text-slate-800">
                  <span className="mr-1 font-extrabold text-indigo-600">{i + 1}.</span>
                  {q.text}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {SCALE.map((s) => {
                    const on = draft.answers[q.id] === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setDraft({ ...draft, answers: { ...draft.answers, [q.id]: s.value } })}
                        className={`rounded-xl border py-2.5 text-sm font-bold transition ${
                          on
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400"
                        }`}
                      >
                        {s.label}
                        <span className={`ml-1 text-xs ${on ? "text-indigo-200" : "text-slate-400"}`}>{s.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setStep(draft.step - 1)}
              className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-5 w-5" /> 이전
            </button>
            {draft.step < FACTORS.length - 1 ? (
              <button
                disabled={pages[draft.step].some((q) => draft.answers[q.id] == null)}
                onClick={() => setStep(draft.step + 1)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                다음 파트 <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                disabled={busy || answeredCount < QUESTIONS.length}
                onClick={submit}
                className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                {busy ? "결과 계산 중…" : "결과 보기"}
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
