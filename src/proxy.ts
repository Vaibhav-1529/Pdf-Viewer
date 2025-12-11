import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl;
  const path = url.pathname;
  if (userId && path === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  const protectedRoutes = ["/home", "/dashboard", "/profile", "/viewer"];
  if (!userId && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
});
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|svg|gif)).*)",
  ],
};
