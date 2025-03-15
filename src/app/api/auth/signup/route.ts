import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // ✅ Using `jose` for JWT
import { cookies } from "next/headers"; // ✅ Managing cookies

export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password } = await req.json();

    // ❌ Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    // 🔥 Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // 🍪 Set token in HTTP-Only Cookie
    const response = NextResponse.json(
      { message: "User created successfully", user: { id: user.id, firstname, lastname, email } },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
