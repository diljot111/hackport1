import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = (await cookies()).get("authToken")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify<JWTPayload & { userId: string }>(token, secret);

    return payload.userId ?? null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

// ✅ GET request: Fetch user data
export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,  // 🔥 Ensure the ID is returned
        profilePic: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT request: Update profile picture
export async function PUT(req: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse request body
    const { profilePic } = await req.json();
    if (!profilePic) return NextResponse.json({ error: "No profilePic provided" }, { status: 400 });

    // Update user profile picture
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePic },
    });

    return NextResponse.json({ success: true, profilePic: updatedUser.profilePic });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
