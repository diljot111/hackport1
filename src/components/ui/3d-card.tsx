"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

// Context for Mouse Interaction
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

// Define Hackathon Type
interface Hackathon {
  id: string;
  image: string;
  name: string;
  date: string;
  location: string;
  link: string;
}

// Fetch Hackathon Data from API
const fetchHackathons = async (): Promise<Hackathon[]> => {
  try {
    const response = await fetch("/api/hackathon", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return [];
  }
};

export const HackathonCards = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchHackathons();
      setHackathons(data);
      setLoading(false);
    };

    getData();
    const interval = setInterval(getData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 py-10">
      {loading ? (
        <p className="text-white text-lg">Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <p className="text-gray-400">No hackathons available.</p>
      ) : (
        hackathons.map((hackathon) => (
          <CardContainer key={hackathon.id}>
            <CardBody>
              <CardItem translateZ={50}>
                <Image
                  src={hackathon.image}
                  alt={hackathon.name}
                  width={350}
                  height={250}
                  className="rounded-lg border border-gray-600 shadow-xl h-[250px] object-cover"
                />
              </CardItem>
              <CardItem translateZ={20} className="text-white text-lg font-bold">
                {hackathon.name}
              </CardItem>
              <CardItem translateZ={10} className="text-gray-400">
                {hackathon.date}
              </CardItem>
              <CardItem translateZ={5} className="text-gray-500">
                {hackathon.location}
              </CardItem>
              <CardItem translateZ={30}>
                <a
                  href={hackathon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition"
                >
                  Register Now
                </a>
              </CardItem>
            </CardBody>
          </CardContainer>
        ))
      )}
    </div>
  );
};

// 🎯 3D Card Wrapper with Hover Effect
export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => setIsMouseEntered(true);
  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className="py-10 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "h-96 w-80 [transform-style:preserve-3d] flex flex-col items-center text-center bg-gray-900 p-5 rounded-lg shadow-lg",
      className
    )}
  >
    {children}
  </div>
);

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateZ = 0,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateZ(${translateZ}px)`
      : "translateZ(0px)";
  }, [isMouseEntered]);

  return (
    <Tag
      ref={ref}
      className={cn("transition duration-300", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </Tag>
  );
};

// Hook for Mouse Enter State
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (!context)
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  return context;
};
