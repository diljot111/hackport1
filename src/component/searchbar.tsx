"use client";
import { useState } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react"; // Lucide icons for a professional look

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={clsx(
        "fixed top-16 left-0 w-full px-6 py-4 border-b transition-all duration-300 z-50",
        isFocused ? "bg-gray-800 shadow-xl" : "bg-gray-900 shadow-lg"
      )}
    >
      <div className="relative max-w-2xl mx-auto">
        <div
          className={clsx(
            "flex items-center bg-gray-700 text-white rounded-full px-5 py-3 transition-all border border-gray-600 shadow-md",
            isFocused ? "ring-2 ring-blue-500 bg-gray-600" : ""
          )}
        >
          {/* Search Icon */}
          <Search className="h-5 w-5 text-gray-400 transition-all duration-300" />

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className={clsx(
              "bg-transparent outline-none w-full px-3 text-base transition-all duration-300",
              query ? "text-white" : "text-gray-400"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
