import { type NextRequest, NextResponse } from "next/server";

import { isAllowedEmail, parseAllowedEmails } from "@/server/allowed-users";
import { auth } from "@/server/better-auth";

const allowedEmails = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);

const isPublicPath = (pathname: string) => {
  if (pathname === "/sign-in") return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  return false;
};

const redirectToHome = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
};

const redirectToSignIn = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  url.pathname = "/sign-in";
  url.search = "";
  return NextResponse.redirect(url);
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/sign-in") {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user && isAllowedEmail(session.user.email, allowedEmails)) {
      return redirectToHome(req);
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return redirectToSignIn(req);
  }

  if (allowedEmails.length === 0) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "ADMIN_ALLOWED_EMAILS is not configured" },
        { status: 403 },
      );
    }
    return redirectToSignIn(req);
  }

  if (!isAllowedEmail(session.user.email, allowedEmails)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return redirectToSignIn(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
