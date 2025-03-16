
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hackathons = await prisma.hackathon.findMany(); // Fetch hackathons from MongoDB
    return NextResponse.json(hackathons);
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

