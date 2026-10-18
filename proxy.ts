import { NextResponse, type NextRequest } from "next/server";
import { BY } from "@/lib/lines";

/* case pages stream through <Suspense>, so a notFound() inside them can only send 200 + noindex.
   Catch unknown slugs here, before rendering, and rewrite to a missing path so the app's
   not-found page is served with a real 404. */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (BY[slug]) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_no-such-stop", request.url));
}

export const config = {
  matcher: "/work/:slug",
};
