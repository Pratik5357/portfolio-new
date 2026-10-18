import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudy } from "@/components/case-study";
import { HAS_RESUME } from "@/lib/has-resume";
import { BY, LINES } from "@/lib/lines";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LINES.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = BY[(await params).slug];
  /* unknown slug: 404 here, before the page streams, so the response status is a real 404 */
  if (!l) notFound();
  return { title: `${l.name} · Pratik Kumbhar`, description: l.one };
}

/* reading params is URL data, so it sits inside Suspense to keep the route's shell instant;
   case-study links prefetch with prefetch={true}, so the fallback is normally never seen */
export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main id="detail" style={{ minHeight: "100svh" }} />}>
      <CaseFromParams params={params} />
    </Suspense>
  );
}

async function CaseFromParams({ params }: Props) {
  const l = BY[(await params).slug];
  if (!l) notFound();
  return <CaseStudy line={l} hasResume={HAS_RESUME} />;
}
