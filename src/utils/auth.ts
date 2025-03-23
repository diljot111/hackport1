import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export const getUserFromToken = async () => {
  try {
    const token = (await cookies()).get("authToken")?.value;
    if (!token) return { error: "Unauthorized", status: 401 };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: { userId: string } };

    if (!payload.userId) return { error: "Invalid token", status: 401 };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, profilePic: true },
    });

    if (!user) return { error: "User not found", status: 404 };

    return { user };
  } catch (error) {
    console.error("Error verifying user token:", error);
    return { error: "Internal Server Error", status: 500 };
  }
};
