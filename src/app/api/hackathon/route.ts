import { NextResponse } from "next/server";

// Mock Hackathon Data (Replace with Database Fetch)
const hackathons = [
  {
    id: "1",
    name: "CodeFest 2025",
    date: "April 15, 2025",
    location: "Online",
    image: "https://images.pexels.com/photos/5380644/pexels-photo-5380644.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "/",
  },
  {
    id: "2",
    name: "HackMania",
    date: "May 5, 2025",
    location: "New York",
    image: "/images/hackmania.png",
    link: "https://hackathon.com/hackmani",
  },
];

export async function GET() {
  return NextResponse.json(hackathons);
}



// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const hackathons = await prisma.hackathon.findMany(); // Fetch hackathons from MongoDB
//     return NextResponse.json(hackathons);
//   } catch (error) {
//     console.error("Error fetching hackathons:", error);
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }

