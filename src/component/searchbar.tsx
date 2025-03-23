"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaTrophy } from "react-icons/fa";
import { IoSadOutline } from "react-icons/io5";

interface SearchBarProps {
  onSearch?: (query: string, results: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/search?q=${search}`);
        const data = await res.json();
        console.log("Search Results:", data);

        // Filter out hackathons that have already ended
        const upcomingHackathons = data.hackathons.filter(
          (hackathon: any) => new Date(hackathon.endDate) >= new Date()
        );

        const combinedResults = [...data.users, ...upcomingHackathons];
        setResults(combinedResults);
        setShowDropdown(true);

        if (onSearch) {
          onSearch(search, combinedResults);
        }
      } catch (error) {
        console.error("Search Error:", error);
      }
    };

    const timeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeout);
  }, [search, onSearch]);

  const handleSelect = (item: any) => {
    if (item.firstname) {
      router.push(`/profile/${item.id}`);
    } else {
      router.push(`/main/${encodeURIComponent(item.name)}`);
    }
    setShowDropdown(false);
    setSearch("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search Hackathons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search.trim() && setShowDropdown(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900"
      />

      {/* 🔽 Dropdown for Search Results */}
      {showDropdown && (
        <ul className="absolute left-0 right-0 bg-black text-white border border-gray-600 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 flex items-center gap-3 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {item.firstname ? (
                  <>
                    <FaUser className="text-blue-400" />
                    <span>{item.firstname}</span>
                  </>
                ) : (
                  <>
                    <FaTrophy className="text-yellow-400" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 flex items-center gap-3 text-gray-400">
              <IoSadOutline className="text-2xl" />
              <span>No results found</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
