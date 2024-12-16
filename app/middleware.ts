import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Log the current path for debugging
  console.log("Current path:", url.pathname);

  // Allow specific paths
  const allowedPaths = ['/connect', '/chat', '/api'];
  if (allowedPaths.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If you want to redirect from root to connect when not connected
  if (url.pathname === '/') {
    url.pathname = '/connect';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/connect', '/chat', '/api/:path*'],
};