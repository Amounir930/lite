import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/infra/auth/session";

// 🛡️ Advanced Rate Limiter (Aligned with Guide Section 5.3)
const rateLimitMap = new Map();

export async function middleware(req: NextRequest) {
  const session = await getSession();
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const now = Date.now();
  
  // ⚙️ Rate Limit Settings from docs/01-implementation-guide.txt
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = session.isLoggedIn ? 1000 : 100; // 1000 for Pro, 100 for Basic/Public

  const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - rateData.lastReset > windowMs) {
    rateData.count = 1;
    rateData.lastReset = now;
  } else {
    rateData.count++;
  }

  rateLimitMap.set(ip, rateData);

  if (rateData.count > maxRequests) {
    return new NextResponse("Security Check: Too Many Requests. Try again in a minute.", { status: 429 });
  }

  // 🌍 i18n Logic
  const { pathname } = req.nextUrl;
  const locales = ["ar", "en"];
  const defaultLocale = "ar";
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    req.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(req.nextUrl);
  }

  // Auth Guard
  if (pathname.includes("/(dashboard)") && !session.isLoggedIn) {
    return NextResponse.redirect(new URL("/ar/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
