import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { hackathonId: string } }) {
  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: params.hackathonId },
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
