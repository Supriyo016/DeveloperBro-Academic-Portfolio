import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, securityHeaders } from "@/lib/security/headers";

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto === "https" || request.nextUrl.protocol === "https:";
  const csp = buildCsp({ nonce, isDev, upgradeInsecure: isHttps });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  for (const [name, value] of Object.entries(securityHeaders({ hsts: isHttps && !isDev }))) {
    response.headers.set(name, value);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|images/|documents/|robots.txt|sitemap.xml).*)"],
};
