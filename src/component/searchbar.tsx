"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { Search, X } from "lucide-react"; // Lucide icons for a professional look

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full bg-gray-900 py-4 px-6 shadow-lg border-b border-gray-700 mt-40">
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center bg-gray-800 text-white rounded-full px-4 py-3 shadow-md transition-all border border-gray-700">
          {/* Search Icon */}
          <Search className="h-5 w-5 text-gray-400" />

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className={clsx(
              "bg-transparent outline-none w-full px-3 text-base",
              query ? "text-white" : "text-gray-400"
            )}
          />

          {/* Clear Button */}
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
