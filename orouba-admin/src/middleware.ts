import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isAuthPage = pathname.startsWith("/admin/login");
    const isAdminRoute = pathname.startsWith("/admin");

    // Locale routing for public pages
    const locales = ['ar', 'en'];
    const pathnameHasLocale = locales.some(
      (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );
    const isStaticFile = pathname.match(/\.[^/]+$/);

    if (!isAdminRoute && !pathnameHasLocale && !isStaticFile) {
      const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
      const locale = cookieLocale === 'en' ? 'en' : 'ar';
      
      const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, req.url);
      if (req.nextUrl.search) {
        newUrl.search = req.nextUrl.search;
      }
      return NextResponse.redirect(newUrl);
    }

    // Add pathname to headers so layout.tsx can read it to determine locale (LTR/RTL)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', pathname);

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (!isAuth && isAdminRoute) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
