import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ✅ Using `jose` instead of `jsonwebtoken`

export const config = {
  matcher: ["/main", "/dashboard", "/profile", "/login", "/signup","/hackathon  "], // ✅ Protect these routes
};

// ✅ Tell Next.js to run middleware in Node.js runtime instead of Edge
export const runtime = "nodejs";

// 🔒 Function to verify JWT using jose
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  console.log("Middleware Triggered!");

  const token = req.cookies.get("authToken")?.value;
  console.log("Token Found:", token);

  const isAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup";

  if (!token) {
    if (isAuthPage) {
      console.log("User is on Auth Page (Allowing Access)");
      return NextResponse.next();
    }
    console.log("Redirecting to /login (No Token)");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    console.log("Invalid Token, Redirecting to /login");
    
    // ❌ Clear invalid token
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("authToken", "", { expires: new Date(0) });
    return response;
  }

  console.log("Token Valid, Allowing Access");

  // 🔥 Prevent logged-in users from accessing login or signup pages
  if (isAuthPage) {
    console.log("User already logged in, Redirecting to /main");
    return NextResponse.redirect(new URL("/main", req.url));
  }

  return NextResponse.next();
}
