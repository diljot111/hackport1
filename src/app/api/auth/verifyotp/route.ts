import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // ✅ Using jose for JWT
import { cookies } from "next/headers"; // ✅ Managing cookies

export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log("Received Data:", body); // 🔍 Debugging
  
      const { email, otp, password } = body;
  
      if (!email || !otp || !password) {
        console.error("❌ Missing fields:", { email, otp, password });
        return NextResponse.json({ error: "All fields are required (email, otp, password)" }, { status: 400 });
      }
  
      // ✅ Continue with OTP verification process...
  

    // ✅ Check if OTP exists and is valid
    const storedOtp = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }, // Ensure we're checking the latest OTP
    });

    console.log("Stored OTP:", storedOtp); // Debugging

    if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname: "DefaultFirstName", // Replace with actual first name if available
        lastname: "DefaultLastName", // Replace with actual last name if available
      },
    });

    console.log("User Created:", user); // Debugging

    // ✅ Remove OTP from database after successful verification
    await prisma.otp.delete({ where: { id: storedOtp.id } });

    // ✅ Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // ✅ Set token in HTTP-Only Cookie
    const response = NextResponse.json(
      { message: "OTP verified! User registered successfully!", user: { id: user.id, email } },
      { status: 201 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
