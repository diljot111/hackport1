"use client"; // ✅ This makes it a Client Component

import Navbar from "@/component/navbar";
import SearchBar from "@/component/searchbar";
import TopNav from "@/component/topnav";
import { HackathonCards } from "@/components/ui/3d-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { useState } from "react";

const items = [
  {
    title: "Card 1",
    description: "This is card 1",
    quote: "Quote 1",
    name: "Name 1",
    image: "https://imgs.search.brave.com/ED7-N-pwRfYGQ7i5_3SDKOF-lD6nHxbUYfquF2-6zBI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cubG9nb2FpLmNvbS91cGxvYWRzL291dHB1dC8yMDIxLzA1LzE3LzlhMTZiZGM5NjgxMTVmNTg2NjhmMzVkZDRiZjI2MTU4LmpwZz90PTE2MjEyMTk2MjQ", // Replace with actual image URL
  },
  {
    title: "Card 2",
    description: "This is card 2",
    quote: "Quote 2",
    name: "Name 2",
    image: "https://imgs.search.brave.com/FT68fDwTt0qA9xbBWQxpT2JrW61M8Fg5meWZH80YtKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxvYWRzLnR1cmJvbG9nby5jb20vdXBsb2Fkcy9kZXNpZ24vcHJldmlld19pbWFnZS82ODQ2NjU1MS9wcmV2aWV3X2ltYWdlMjAyNDExMzAtMS0xYWI0NHd0LnBuZw",
  },
  {
    title: "Card 3",
    description: "This is card 3",
    quote: "Quote 3",
    name: "Name 3",
    image: "https://imgs.search.brave.com/1WlN6kc8Bi1R0hazHJ4pgbjzLPVgEgbJin-0tHeq0C8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxvYWRzLnR1cmJvbG9nby5jb20vdXBsb2Fkcy9kZXNpZ24vcHJldmlld19pbWFnZS82ODQ2NjU1NS9wcmV2aWV3X2ltYWdlMjAyNDExMzAtMS13bjl0cHIucG5n",
  },
];

export default function Main() {
  interface Hackathon {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  }

  const [results, setResults] = useState<Hackathon[]>([]);

  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      setResults([]); // Clear results if query is empty
      return;
    }

    try {
      const res = await fetch(`${window.location.origin}/api/auth/search?q=${query}`);
      const data = await res.json();
      setResults(data.hackathons || []); // ✅ Update state with hackathon results
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-[120px] ">
      {/* Fixed Search Bar */}
      <div className="fixed top-0 w-full z-50 mt-20">
        <SearchBar onSearch={fetchResults} /> {/* ✅ No more error */}
      </div>

      {/* Fixed Infinite Moving Cards just below SearchBar */}
      <div className="top-[72px] w-full z-50 mt-10">
        <InfiniteMovingCards items={items} />
      </div>

      {/* Search Results */}
      {/* <div className="mt-[200px] p-4">
        <h1 className="text-2xl font-bold">Search Results</h1>
        {results.length > 0 ? (
          results.map((hackathon) => (
            <div key={hackathon.id} className="p-2 border-b">
              <h3 className="text-lg font-semibold">{hackathon.name}</h3>
              <p>
                Starts: {new Date(hackathon.startDate).toLocaleDateString()} - 
                Ends: {new Date(hackathon.endDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div> */}

      <HackathonCards />
    </div>
  );
}
