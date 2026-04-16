import { withAuth } from "next-auth/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";

const authProxy = withAuth({
  secret: "dev-secret",
  pages: {
    signIn: "/login"
  }
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authProxy(request as never, event as never);
}

export const config = {
  matcher: ["/dashboard/:path*", "/jnf/:path*"]
};
