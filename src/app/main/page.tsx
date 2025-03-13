import Navbar from "@/component/navbar";
import SearchBar from "@/component/searchbar";
import TopNav from "@/component/topnav";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const items = [
  { title: "Card 1", description: "This is card 1", quote: "Quote 1", name: "Name 1" },
  { title: "Card 2", description: "This is card 2", quote: "Quote 2", name: "Name 2" },
  { title: "Card 3", description: "This is card 3", quote: "Quote 3", name: "Name 3" },
];

export default function Main() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <Navbar /> */}
      <TopNav />
      <SearchBar />
      <InfiniteMovingCards items={items} />
    </div>
  );
}
