import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear authToken cookie
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return response;
}
