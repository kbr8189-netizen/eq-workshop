"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, LogOut, RefreshCw, Trash2, Users, X } from "lucide-react";
import Pentagon from "@/components/Pentagon";
import ResultView, { GrowGuide } from "@/components/ResultView";
import {
  DIAGNOSTIC,
  FACTORS,
  FACTOR_MAX,
  QUESTIONS,
  balanceOf,
  getFactor,
  type DiagnosticResult,
} from "@/lib/diagnostic";

const ALL = "__all__";

function average(results: DiagnosticResult[]) {
  const scores: Record<string, number> = {};
  for (const f of FACTORS) {
    const sum = results.reduce((a, r) => a + r.factorScores[f.id], 0);
    scores[f.id] = results.length ? Math.round((sum / results.length) * 10) / 10 : 0;
  }
  return scores;
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function Dashboard() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [group, setGroup] = useState(ALL);
  const [view, setView] = useState<"stats" | "guide">("stats");
  const [selected, setSelected] = useState<DiagnosticResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/responses", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return window.location.reload();
    if (!res.ok) setError(data.error || "결과를 불러오지 못했습니다.");
    else setResults(data.results);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(
    () => [...new Set(results.map((r) => r.participant.group).filter(Boolean))].sort(),
    [results],
  );
  const filtered = group === ALL ? results : results.filter((r) => r.participant.group === group);
  const allAvg = useMemo(() => average(results), [results]);
  const avg = useMemo(() => average(filtered), [filtered]);
  const avgTotal = filtered.length
    ? Math.round((filtered.reduce((a, r) => a + r.total, 0) / filtered.length) * 10) / 10
    : 0;
  const lowCounts = FACTORS.map((f) => ({ f, n: filtered.filter((r) => r.lowFactorId === f.id).length }));
  const topCounts = FACTORS.map((f) => ({ f, n: filtered.filter((r) => r.topFactorId === f.id).length }));

  async function remove(r: DiagnosticResult) {
    if (!window.confirm(`${r.participant.name}님의 결과를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const qs = new URLSearchParams({ id: r.id, submittedAt: r.submittedAt });
    const res = await fetch(`/api/admin/responses?${qs}`, { method: "DELETE" });
    if (res.ok) {
      setResults((prev) => prev.filter((x) => x.id !== r.id));
      setSelected(null);
    } else window.alert("삭제하지 못했습니다.");
  }

  function downloadCsv() {
    const header = [
      "제출시각",
      "이름",
      "조/소속",
      ...FACTORS.map((f) => f.name),
      "총점",
      "가장 높은 영역",
      "가장 낮은 영역",
      "균형",
      "강화 계획",
      "보완 계획",
      "Remember Point",
      ...QUESTIONS.map((q) => q.id),
    ];
    const rows = filtered.map((r) => [
      new Date(r.submittedAt).toLocaleString("ko-KR"),
      r.participant.name,
      r.participant.group,
      ...FACTORS.map((f) => r.factorScores[f.id]),
      r.total,
      getFactor(r.topFactorId)?.name,
      getFactor(r.lowFactorId)?.name,
      balanceOf(r.range).label,
      r.actionPlan?.strengthen,
      r.actionPlan?.improve,
      r.actionPlan?.remember,
      ...QUESTIONS.map((q) => r.answers[q.id]),
    ]);
    const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `감성지수진단_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-indigo-600">강사 화면 · {DIAGNOSTIC.courseTitle}</div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{DIAGNOSTIC.title} 결과</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-600">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 새로고침
          </button>
          <button
            onClick={downloadCsv}
            disabled={!filtered.length}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> 엑셀(CSV)
          </button>
          <button onClick={logout} className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-600">
            <LogOut className="h-4 w-4" /> 로그아웃
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex gap-2">
          {(
            [
              ["stats", "진단 결과"],
              ["guide", "영역별 기르는 방법"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold shadow-sm transition ${
                view === id
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {view === "stats" && (
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold"
          >
            <option value={ALL}>전체 ({results.length}명)</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g} ({results.filter((r) => r.participant.group === g).length}명)
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

      {view === "guide" ? (
        <div className="mt-5 max-w-3xl">
          <GrowGuide />
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-extrabold">{group === ALL ? "전체" : group} 평균 오각형</h2>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Users className="h-4 w-4" /> {filtered.length}명 · 평균 총점 <b className="text-indigo-700">{avgTotal}</b>
                </span>
              </div>
              {filtered.length ? (
                <Pentagon
                  series={[
                    { label: group === ALL ? "전체 평균" : `${group} 평균`, color: "#4f46e5", scores: avg },
                    ...(group !== ALL ? [{ label: "전체 평균", color: "#94a3b8", scores: allAvg, dashed: true }] : []),
                  ]}
                />
              ) : (
                <p className="py-16 text-center text-sm text-slate-400">{loading ? "불러오는 중…" : "아직 제출된 결과가 없어요."}</p>
              )}
            </section>

            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-extrabold">영역별 평균</h2>
                <div className="mt-3 space-y-2.5">
                  {FACTORS.map((f) => (
                    <div key={f.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{f.name}</span>
                        <span className="font-extrabold">
                          {avg[f.id]} <span className="text-xs font-medium text-slate-400">/ {FACTOR_MAX}</span>
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full" style={{ width: `${(avg[f.id] / FACTOR_MAX) * 100}%`, background: f.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "강점 영역 분포", counts: topCounts },
                  { title: "보완 영역 분포", counts: lowCounts },
                ].map((box) => (
                  <div key={box.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-extrabold">{box.title}</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      {box.counts.map(({ f, n }) => (
                        <li key={f.id} className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                            {f.name}
                          </span>
                          <b>{n}명</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">이름</th>
                  <th className="px-2 py-3">조/소속</th>
                  {FACTORS.map((f) => (
                    <th key={f.id} className="px-2 py-3 text-center">
                      {f.name}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-center">총점</th>
                  <th className="px-2 py-3">균형</th>
                  <th className="px-2 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="cursor-pointer border-t border-slate-100 hover:bg-indigo-50/50" onClick={() => setSelected(r)}>
                    <td className="px-4 py-2.5 font-bold">{r.participant.name}</td>
                    <td className="px-2 py-2.5 text-slate-600">{r.participant.group}</td>
                    {FACTORS.map((f) => (
                      <td
                        key={f.id}
                        className={`px-2 py-2.5 text-center ${
                          f.id === r.topFactorId ? "font-extrabold text-emerald-700" : f.id === r.lowFactorId ? "font-extrabold text-amber-700" : ""
                        }`}
                      >
                        {r.factorScores[f.id]}
                      </td>
                    ))}
                    <td className="px-2 py-2.5 text-center font-extrabold">{r.total}</td>
                    <td className="px-2 py-2.5 text-slate-600">{balanceOf(r.range).label}</td>
                    <td className="px-2 py-2.5 text-right">
                      <button
                        aria-label="삭제"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(r);
                        }}
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !loading && <p className="py-8 text-center text-sm text-slate-400">표시할 결과가 없어요.</p>}
          </section>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-8" onClick={() => setSelected(null)}>
          <div className="h-fit w-full max-w-3xl rounded-2xl bg-slate-50 p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex justify-end">
              <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200" aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ResultView result={selected} compareScores={{ label: "전체 평균", scores: allAvg }} />
          </div>
        </div>
      )}
    </main>
  );
}
