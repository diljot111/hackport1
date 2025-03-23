import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await Promise.resolve(params); // ✅ Ensure `params` is awaited properly

  // ✅ Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      profilePic: true,
      role: true,
      username: true,
    },
  });

  if (!user) return notFound();

  return (
    <div className="flex flex-col items-center p-6 text-white mt-15">
      <img
        src={user.profilePic || "/userimage.webp"}
        alt="Profile Picture"
        className="w-32 h-32 rounded-full border-2 border-gray-300"
      />
      <h2 className="text-lg mt-4">@{user.username}</h2>
      <h1 className="text-2xl font-bold mt-4">{user.firstname} {user.lastname}</h1>
      <p className="text-gray-400">E-mail - @{user.email}</p>
      <p className="mt-2 bg-gray-700 px-3 py-1 rounded-md">{user.role.toUpperCase()}</p>
    </div>
  );
}
