
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * This is the main middleware entry point for the Next.js application.
 * It calls the updateSession function from the Supabase utility to handle
 * session management and route protection.
 */
export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures the middleware runs on all page navigations and API routes
     * to keep the user session fresh, while the protection logic inside
     * updateSession specifically targets routes like '/admin'.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
