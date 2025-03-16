import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    let { name, description, startDate, endDate, prizePool, location, organizerId, image } = body;

    // ✅ Convert prizePool to a number
    // prizePool = Number(prizePool);
    
    // console.log("Parsed prizePool:", prizePool);

    // 🛑 Validate missing required fields
    if (!name || !description || !startDate || !endDate || !prizePool || !organizerId || !image) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🛑 Validate startDate and endDate
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    console.log("Parsed Dates:", parsedStartDate, parsedEndDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      console.log("Invalid Date format");
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // ✅ Save hackathon to database
    const newHackathon = await prisma.hackathon.create({
      data: {
        name,
        description,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        prizePool: String(prizePool), // ✅ Convert to string
        location,
        organizerId,
        image,
      },
    });
    
    console.log("Hackathon created successfully:", newHackathon);
    return NextResponse.json(newHackathon, { status: 201 });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
