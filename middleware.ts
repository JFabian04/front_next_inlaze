import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    console.log('TOKEN:_', token);
    
    const path = request.nextUrl.pathname;

    if (path === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (path.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*']
};