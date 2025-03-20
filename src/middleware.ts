import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/main",
    "/dashboard",
    "/profile",
    "/login",
    "/signup",
    "/hackathon",
    "/participant-dashboard", // Add participant pages
    "/apply-hackathon"
  ],
};

// Run middleware in Node.js environment
export const runtime = "nodejs";

// Function to verify JWT
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
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("authToken", "", { expires: new Date(0) });
    return response;
  }

  console.log("Token Valid, Role:", decoded.role);

  // Restrict organizers from accessing participant pages
  const participantRoutes = ["/main", "/apply-hackathon"];
  const organizerRoutes = ["/dashboard", "/profile", "/hackathon"];
  if (decoded.role === "organizer" && participantRoutes.includes(req.nextUrl.pathname)) {
    console.log("Organizer trying to access participant page, Redirecting to /main");
    return NextResponse.redirect(new URL("/hackathon", req.url));
  }
  if (decoded.role === "participant" && organizerRoutes.includes(req.nextUrl.pathname)) {
    console.log("Organizer trying to access participant page, Redirecting to /main");
    return NextResponse.redirect(new URL("/main", req.url));
  }

  // Prevent logged-in users from accessing login or signup pages
  if (isAuthPage) {
    console.log("User already logged in, Redirecting to /main");
    return NextResponse.redirect(new URL("/main", req.url));
  }

  return NextResponse.next();
}
