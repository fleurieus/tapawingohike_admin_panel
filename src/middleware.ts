import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {jwtDecode} from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decodedToken: any = jwtDecode(token.value);
  if (!decodedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const roles: string[] = decodedToken.Claim ? decodedToken.Claim.split(',') : [];
  const normalizedRoles = roles.map(role => role.includes(':') ? role.split(':')[1] : role);
  const restrictedPaths = {
    '/organisations': ['SuperAdmin',],
    '/events': ['SuperAdmin', 'OrganisationManager', 'OrganisationUser'],
    '/editions': ['SuperAdmin', 'OrganisationManager', 'OrganisationUser', 'EventUser'],
  };

  for (const [path, allowedRoles] of Object.entries(restrictedPaths)) {
    if (request.nextUrl.pathname.startsWith(path) && !normalizedRoles.some(role => allowedRoles.includes(role))) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  return NextResponse.next();
}

//Here we add all the routes that we want to protect with the middleware
export const config = {
  matcher: [
      '/organisations',
      '/events',
      '/editions',
  ]
};
