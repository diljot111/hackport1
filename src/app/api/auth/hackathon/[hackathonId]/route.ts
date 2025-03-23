import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { hackathonId: string } }) {
  try {
    const hackathonId = params.hackathonId; // ✅ Ensure params are correctly accessed

    if (!hackathonId) {
      return NextResponse.json({ error: "Hackathon ID is required" }, { status: 400 });
    }

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    return NextResponse.json(hackathon, { status: 200 });
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
