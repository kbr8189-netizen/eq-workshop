import { randomUUID } from "node:crypto";
import { QUESTIONS, isValidAnswers, scoreAnswers, type ActionPlan, type DiagnosticResult } from "@/lib/diagnostic";
import { readResult, saveResult } from "@/lib/store";

const NAME_MAX = 30;
const PLAN_MAX = 1000;

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// 진단 제출
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    group?: unknown;
    answers?: unknown;
  } | null;

  const name = clean(body?.name, NAME_MAX);
  const group = clean(body?.group, NAME_MAX);
  if (!name) return Response.json({ error: "이름을 입력해주세요." }, { status: 400 });
  if (!isValidAnswers(body?.answers)) {
    return Response.json({ error: "모든 문항에 답해주세요." }, { status: 400 });
  }

  const answers: Record<string, number> = {};
  for (const q of QUESTIONS) answers[q.id] = (body!.answers as Record<string, number>)[q.id];

  const result: DiagnosticResult = {
    id: randomUUID(),
    participant: { name, group },
    submittedAt: new Date().toISOString(),
    answers,
    ...scoreAnswers(answers),
  };

  try {
    await saveResult(result);
  } catch (e) {
    console.error("blob put failed", e);
    return Response.json({ error: "저장 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
  return Response.json({ result });
}

// 액션 플랜 저장
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    submittedAt?: unknown;
    actionPlan?: Partial<Record<keyof ActionPlan, unknown>>;
  } | null;
  if (typeof body?.id !== "string" || typeof body?.submittedAt !== "string") {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  try {
    const existing = await readResult(body.id, body.submittedAt);
    if (!existing) return Response.json({ error: "진단 결과를 찾지 못했습니다." }, { status: 404 });
    existing.actionPlan = {
      strengthen: clean(body.actionPlan?.strengthen, PLAN_MAX),
      improve: clean(body.actionPlan?.improve, PLAN_MAX),
      remember: clean(body.actionPlan?.remember, PLAN_MAX),
    };
    await saveResult(existing);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("plan save failed", e);
    return Response.json({ error: "저장하지 못했습니다." }, { status: 500 });
  }
}
