import { type NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  void req;
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
