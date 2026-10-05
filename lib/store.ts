import { promises as fs } from "node:fs";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";
import type { DiagnosticResult } from "@/lib/diagnostic";

const PREFIX = "results/";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function pathOf(id: string, submittedAt: string) {
  const ts = Date.parse(submittedAt);
  if (!UUID.test(id) || Number.isNaN(ts)) return null;
  return `${PREFIX}${ts}-${id}.json`;
}

// 로컬 개발에서 Blob 토큰이 없으면 .data/ 폴더에 저장
const LOCAL = !process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production";
const LOCAL_DIR = path.join(process.cwd(), ".data");
const localFile = (p: string) => path.join(LOCAL_DIR, p.replace(/\//g, "_"));

export async function saveResult(result: DiagnosticResult) {
  const key = pathOf(result.id, result.submittedAt);
  if (!key) throw new Error("invalid result key");
  if (LOCAL) {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    return void (await fs.writeFile(localFile(key), JSON.stringify(result)));
  }
  await put(key, JSON.stringify(result), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readResult(id: string, submittedAt: string) {
  const key = pathOf(id, submittedAt);
  if (!key) return null;
  if (LOCAL) {
    try {
      return JSON.parse(await fs.readFile(localFile(key), "utf8")) as DiagnosticResult;
    } catch {
      return null;
    }
  }
  const res = await get(key, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200 || !res.stream) return null;
  try {
    return JSON.parse(await new Response(res.stream).text()) as DiagnosticResult;
  } catch {
    return null;
  }
}

export async function deleteResult(id: string, submittedAt: string) {
  const key = pathOf(id, submittedAt);
  if (!key) return false;
  if (LOCAL) await fs.rm(localFile(key), { force: true });
  else await del(key);
  return true;
}

export async function listResults() {
  if (LOCAL) {
    const files = await fs.readdir(LOCAL_DIR).catch(() => [] as string[]);
    const results = await Promise.all(
      files.map(async (f) => JSON.parse(await fs.readFile(path.join(LOCAL_DIR, f), "utf8")) as DiagnosticResult),
    );
    return results.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    pathnames.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const results: DiagnosticResult[] = [];
  const BATCH = 20;
  for (let i = 0; i < pathnames.length; i += BATCH) {
    const chunk = await Promise.all(
      pathnames.slice(i, i + BATCH).map(async (p) => {
        const res = await get(p, { access: "private", useCache: false });
        if (!res || res.statusCode !== 200 || !res.stream) return null;
        try {
          return JSON.parse(await new Response(res.stream).text()) as DiagnosticResult;
        } catch {
          return null;
        }
      }),
    );
    for (const r of chunk) if (r) results.push(r);
  }
  results.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return results;
}
