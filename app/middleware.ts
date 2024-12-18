import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Log the current path for debugging
  console.log("Current path:", url.pathname);

  // Allow specific paths
  const allowedPaths = ['/', '/chat', '/api'];
  if (allowedPaths.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If the path is not allowed, redirect to the home page
  url.pathname = '/';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};

