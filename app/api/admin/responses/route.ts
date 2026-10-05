import { isAdmin } from "@/lib/auth";
import { deleteResult, listResults } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  try {
    return Response.json({ results: await listResults() });
  } catch (e) {
    console.error("blob read failed", e);
    return Response.json({ error: "결과를 불러오지 못했습니다." }, { status: 500 });
  }
}

// 결과 1건 삭제: ?id=<id>&submittedAt=<ISO 시각>
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const sp = new URL(request.url).searchParams;
  try {
    const ok = await deleteResult(sp.get("id") ?? "", sp.get("submittedAt") ?? "");
    if (!ok) return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("blob delete failed", e);
    return Response.json({ error: "삭제하지 못했습니다." }, { status: 500 });
  }
}
