"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "right",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    image: string;
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    setStart(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
      )}
    >
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `scroll ${
            speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s"
          } linear infinite ${direction === "right" ? "reverse" : "forwards"}`,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] max-w-full relative rounded-2xl border border-blue-500 shadow-lg shrink-0 px-8 py-6 md:w-[450px]"
            style={{
              background: "linear-gradient(180deg, #1e3a8a, #111827)", // Updated color
            }}
          >
            <blockquote>
              {/* Image */}
              <div className="w-full flex justify-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-50 rounded-md object-cover border-2 border-gray-300 shadow-2xl"
                />
              </div>

              {/* Quote */}
              <span className="relative z-20 text-sm leading-[1.6] text-white font-normal">
                {item.quote}
              </span>

              {/* Name and Title */}
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-300 font-normal">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-gray-300 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>

      {/* CSS for smooth infinite scrolling */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
