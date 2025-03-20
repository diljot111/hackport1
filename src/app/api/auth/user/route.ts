import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; // JWT verification

export async function GET() {
  try {
    const token = (await cookies()).get("authToken")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: { userId: string } };

    if (!payload.userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { profilePic: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
