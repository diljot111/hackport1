"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, Calendar } from "lucide-react";
import { PopupCard } from "./popupcard";// Import PopupCard

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], hackathons: [] });
  const [isFocused, setIsFocused] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null); // State to manage selected hackathon
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setResults({ users: [], hackathons: [] });
      return;
    }

    const fetchResults = async () => {
      const res = await fetch(`/api/auth/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="relative w-full max-w-lg mx-auto mt-5">
      {/* Search Input */}
      <div className="flex items-center bg-gray-800 text-white rounded-full px-5 py-3 border border-gray-600 shadow-md">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or hackathons..."
          className="bg-transparent outline-none w-full px-3 text-base text-white"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && query && (
        <div className="absolute w-full bg-gray-800 rounded-lg mt-2 shadow-lg p-3 z-50">
          {/* Users */}
          {results.users.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Users</p>
              {results.users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                  onMouseDown={() => router.push(`/profile/${user.id}`)}
                >
                  <User className="w-5 h-5 text-blue-400" />
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.firstname} className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      {user.firstname.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-white">{user.firstname}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hackathons */}
          {results.hackathons.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm mt-2 mb-2">Hackathons</p>
              {results.hackathons.map((hackathon: any) => (
                <div
                  key={hackathon.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                  onMouseDown={() => setSelectedHackathon(hackathon)} // Open popup instead of navigating
                >
                  <Calendar className="w-5 h-5 text-red-400" />
                  <span className="text-white">{hackathon.name}</span>
                  <span className="text-gray-400 text-xs ml-auto">{hackathon.startDate}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.users.length === 0 && results.hackathons.length === 0 && (
            <p className="text-gray-400 text-center p-2">No results found</p>
          )}
        </div>
      )}

      {/* Hackathon Popup Modal */}
      {selectedHackathon && <PopupCard hackathon={selectedHackathon} onClose={() => setSelectedHackathon(null)} />}
    </div>
  );
}
