import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Function to generate a username from email
async function generateUniqueUsername(email: string) {
  let baseUsername = email.split("@")[0]; // Get the part before "@"
  baseUsername = baseUsername.slice(0, 6); // Limit length (max 6 chars)

  let username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`; // Add a 4-digit random number

  // Ensure uniqueness in the database
  let existingUser = await prisma.user.findUnique({ where: { username } });

  while (existingUser) {
    username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`; // Regenerate if taken
    existingUser = await prisma.user.findUnique({ where: { username } });
  }

  return username;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Data:", body); // 🔍 Debugging

    const { email, otp, password, role, profilePic, firstname, lastname } = body;

    if (!email || !otp || !password || !role || !firstname || !lastname) {
      console.error("❌ Missing fields:", { email, otp, password, role, firstname, lastname });
      return NextResponse.json({ error: "All fields are required (email, otp, password, role, firstname, lastname)" }, { status: 400 });
    }

    // ✅ Ensure role is valid
    const validRoles = ["participant", "organizer", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    console.log("Role received from frontend:", role); // 🔍 Debugging

    // ✅ Check if OTP exists and is valid
    const storedOtp = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }, // Ensure we're checking the latest OTP
    });

    console.log("Stored OTP:", storedOtp); // Debugging

    if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
      // ✅ Delete failed OTP attempt
      await prisma.otp.deleteMany({ where: { email } });

      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate a unique username based on email
    const uniqueUsername = await generateUniqueUsername(email);

    // ✅ Create user in the database with actual name
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        role,
        username: uniqueUsername, // ✅ Partial email + random number
        profilePic: profilePic || "/userimage.webp",
      },
    });

    console.log("User Created:", user); // Debugging

    // ✅ Delete all OTPs related to this email (Cleanup)
    await prisma.otp.deleteMany({ where: { email } });

    console.log("✅ All OTPs cleared for:", email);

    // ✅ Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // ✅ Set token in HTTP-Only Cookie
    const response = NextResponse.json(
      { message: "OTP verified! User registered successfully!", user: { id: user.id, email, role, username: user.username, profilePic: user.profilePic } },
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
