import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password, otp, step } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Step 1: Send OTP
    if (step === "send_otp") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.otp.create({ data: { email, otp: generatedOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });

      // Send OTP via Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${generatedOtp}`,
      });

      return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    }

    // Step 2: Verify OTP and Create Account
    if (step === "verify_otp") {
      const storedOtp = await prisma.otp.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
      if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await prisma.user.create({
        data: { firstname, lastname, email, password: hashedPassword },
      });

      // Generate JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

      // Set token in HTTP-Only Cookie
      const response = NextResponse.json({ message: "User created successfully", user: { id: user.id, firstname, lastname, email } }, { status: 200 });
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      
      return response;
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
