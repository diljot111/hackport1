import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔍 Received body:", body);

    const { userId, hackathonId } = body;

    if (!userId || !hackathonId) {
      console.error("🛑 Missing required fields:", { userId, hackathonId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check if hackathon exists
    const hackathonExists = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathonExists) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    // ✅ Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check if the user is already registered
    const existingRegistration = await prisma.participant.findFirst({
      where: { userId, hackathonId },
    });

    if (existingRegistration) {
      return NextResponse.json({ error: "User already registered" }, { status: 400 });
    }

    // ✅ Register the user (without team)
    await prisma.participant.create({
      data: {
        user: { connect: { id: userId } },
        hackathon: { connect: { id: hackathonId } },
      },
    });

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
