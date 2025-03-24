import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { hackathonId: string } }) {
  try {
    const hackathonId = params.hackathonId;

    if (!hackathonId) {
      return NextResponse.json({ error: "Hackathon ID is required" }, { status: 400 });
    }

    // Fetch hackathon details
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    // Fetch participants and include their user details
    const participants = await prisma.participant.findMany({
      where: { hackathonId },
      include: {
        user: { select: { id: true, firstname: true, email: true } }, // Get user info
      },
    });

    // Format response to send only necessary fields
    const formattedParticipants = participants.map((p) => ({
      id: p.user.id,
      name: p.user.firstname,
      email: p.user.email,
    }));

    return NextResponse.json({ hackathon, participants: formattedParticipants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching hackathon and participants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
