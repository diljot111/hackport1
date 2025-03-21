import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

/**
 * Generate a unique username based on email
 */
async function generateUniqueUsername(email: string) {
  const emailPrefix = email.split("@")[0];
  let username = "";
  let isUnique = false;

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    username = `${emailPrefix}${randomNum}`;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (!existingUser) isUnique = true;
  }

  return username;
}

/**
 * Handle user signup API
 */
export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password, otp, step, role, profilePic } = await req.json();
    console.log("Received role:", role);

    // ✅ Validate Role
    if (!["participant", "organizer", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    // ✅ Check if user already exists with same email & role
    const existingUser = await prisma.user.findFirst({ where: { email, role } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // ✅ Handle OTP Sending
    if (step === "send_otp") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in the database with expiry (10 min)
      await prisma.otp.create({ data: { email, otp: generatedOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });

      // Send OTP via email
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

    // ✅ Handle OTP Verification & User Registration
    if (step === "verify_otp") {
      // Get the latest OTP
      const storedOtp = await prisma.otp.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });

      if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Use Cloudinary URL directly (no re-upload needed)
      const profilePicUrl = profilePic ? profilePic : "";

      // Generate a unique username
      const uniqueUsername = await generateUniqueUsername(email);

      // Create User
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          role,
          username: uniqueUsername,
          profilePic: profilePicUrl, // ✅ Save Cloudinary URL
        },
      });

      // Generate JWT Token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

      // ✅ Set HTTP-only Cookie
      const response = NextResponse.json(
        { message: "User created successfully", user: { id: user.id, firstname, lastname, email, username: uniqueUsername } },
        { status: 200 }
      );

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
