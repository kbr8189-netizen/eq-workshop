import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GrowGuide } from "@/components/ResultView";
import { DIAGNOSTIC } from "@/lib/diagnostic";

export const metadata: Metadata = { title: `감성지능 기르는 방법 · ${DIAGNOSTIC.title}` };

export default function GrowPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <Link
        href="/"
        className="no-print inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
      >
        <ChevronLeft className="h-4 w-4" /> 진단으로 돌아가기
      </Link>
      <header className="mb-6 mt-5">
        <div className="text-xs font-bold tracking-wide text-indigo-600">{DIAGNOSTIC.courseTitle}</div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">감성지능 기르는 방법</h1>
      </header>
      <GrowGuide />
    </main>
  );
}
