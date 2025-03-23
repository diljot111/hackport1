import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma client

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ users: [], projects: [], articles: [], hackathons: [] });

  try {
    const users = await prisma.user.findMany({
      where: { firstname: { contains: query, mode: "insensitive" } },
      select: { id: true, firstname: true, profilePic: true },
    });

    // const projects = await prisma.project.findMany({
    //   where: { title: { contains: query, mode: "insensitive" } },
    //   select: { id: true, title: true, description: true },
    // });

    // const articles = await prisma.article.findMany({
    //   where: { title: { contains: query, mode: "insensitive" } },
    //   select: { id: true, title: true, excerpt: true },
    // });

    const hackathons = await prisma.hackathon.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true, startDate: true , endDate: true},
    });

    return NextResponse.json({ users, hackathons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
