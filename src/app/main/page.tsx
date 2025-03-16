import Navbar from "@/component/navbar";
import SearchBar from "@/component/searchbar";
import TopNav from "@/component/topnav";
// import { CardBody, CardContainer, CardItem, HackathonCards } from "@/components/ui/3d-card";
import { CardContainer,HackathonCards } from "@/components/ui/3d-card";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const items = [
  {
    title: "Card 1",
    description: "This is card 1",
    quote: "Quote 1",
    name: "Name 1",
    image: "https://imgs.search.brave.com/ED7-N-pwRfYGQ7i5_3SDKOF-lD6nHxbUYfquF2-6zBI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bG9nb2FpLmNvbS91/cGxvYWRzL291dHB1/dC8yMDIxLzA1LzE3/LzlhMTZiZGM5Njgx/MTVmNTg2NjhmMzVk/ZDRiZjI2MTU4Lmpw/Zz90PTE2MjEyMTk2/MjQ", // Replace with actual image URL
  },
  {
    title: "Card 2",
    description: "This is card 2",
    quote: "Quote 2",
    name: "Name 2",
    image: "https://imgs.search.brave.com/FT68fDwTt0qA9xbBWQxpT2JrW61M8Fg5meWZH80YtKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWRzLnR1cmJvbG9n/by5jb20vdXBsb2Fk/cy9kZXNpZ24vcHJl/dmlld19pbWFnZS82/ODQ2NjU1MS9wcmV2/aWV3X2ltYWdlMjAy/NDExMzAtMS0xYWI0/NHd0LnBuZw",
  },
  {
    title: "Card 3",
    description: "This is card 3",
    quote: "Quote 3",
    name: "Name 3",
    image: "https://imgs.search.brave.com/1WlN6kc8Bi1R0hazHJ4pgbjzLPVgEgbJin-0tHeq0C8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWRzLnR1cmJvbG9n/by5jb20vdXBsb2Fk/cy9kZXNpZ24vcHJl/dmlld19pbWFnZS82/ODQ2NjU1NS9wcmV2/aWV3X2ltYWdlMjAy/NDExMzAtMS13bjl0/cHIucG5n",
  },
];

export default function Main() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-[120px]">
      {/* Fixed Search Bar */}
      <div className="fixed top-0 w-full z-50">
        <SearchBar />
      </div>

      {/* Fixed Infinite Moving Cards just below SearchBar */}
      <div className="top-[72px] w-full z-50 mt-10">
        <InfiniteMovingCards items={items} />
      </div>

      {/* Content Below (Dummy Section for Scroll) */}
      <div className="mt-[200px] p-4">
        <h1 className="text-2xl font-bold">Scrollable Content</h1>
        <p>Lorem i
          psum dolor sit amet, consectetur adipiscing elit...</p>
      </div>

      <HackathonCards />
    </div>
  );

      {/* Static 3D Card */}
      {/* <HackathonCards />
      <CardContainer className="h-screen flex items-center justify-center">
        <CardBody className="bg-gray-800 shadow-lg rounded-xl p-6">
          <CardItem as="div" className="w-24 h-24 mx-auto" translateZ={50}>
            <img
              src="https://imgs.search.brave.com/n_0YUSFwAjVVq6TtIgh7i77NPD3lV6pK2JUE1xPfSbA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJzLzU3NjI1/My9zY3JlZW5zaG90/cy8yNzQwOTc0L2F0/dGFjaG1lbnRzLzU1/NjQwMi9oYWNrYXRo/b25fMDQucG5nP3Jl/c2l6ZT00MDB4MzAw/JnZlcnRpY2FsPWNl/bnRlcg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </CardItem>

          <CardItem as="h2" className="text-xl font-bold text-center text-white mt-4" translateZ={20}>
            Interactive 3D Card
          </CardItem>

          <CardItem as="p" className="text-sm text-gray-400 text-center mt-2" translateZ={10}>
            Hover over this card to see the 3D effect in action!
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  ); */}
  
}
