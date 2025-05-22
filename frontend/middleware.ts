import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Nếu không có prefix ngôn ngữ (/en, /vi...) → redirect
  const pathnameIsMissingLocale = /^\/(?!en|vi)(.*)$/.test(pathname);

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/vi${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

// Cấu hình matcher nếu cần chỉ áp dụng cho 1 số route
export const config = {
  matcher: ['/((?!_next|favicon.ico|api|fonts|.*\\..*).*)'],
};
