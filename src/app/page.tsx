import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Intro Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to HACKPORT</h1>
        <p className="text-lg text-gray-400">
          Your one-stop platform to explore, organize, and participate in hackathons worldwide. 
          Whether you're a participant looking to compete or an organizer ready to host, 
          HackPort has got you covered!
        </p>
      </div>

      {/* Role Selection Buttons */}
      <div className="mt-8 flex gap-6">
        <Link href="/login?role=admin">
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold">
            Admin
          </button>
        </Link>
        <Link href="/login?role=participant">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold">
            Participant
          </button>
        </Link>
        <Link href="/login?role=organizer">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold">
            Organizer
          </button>
        </Link>
      </div>
    </div>
  );
}
