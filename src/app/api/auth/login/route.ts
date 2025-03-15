import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Create a response and set the cookie correctly
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.headers.set(
      "Set-Cookie",
      `authToken=${token}; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; Max-Age=604800; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
