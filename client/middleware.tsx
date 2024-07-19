import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Kullanıcı oturum açmamışsa ve oturum gerektiren bir sayfaya gitmeye çalışıyorsa
    if (!token && (pathname.startsWith('/dashboard') || pathname === "/")) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }



    // Kullanıcı oturum açmışsa ve kök dizine gitmeye çalışıyorsa
    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};
