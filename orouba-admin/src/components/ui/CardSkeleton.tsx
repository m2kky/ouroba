"use client";

import Image from "next/image";

interface CardSkeletonProps {
  count?: number;
}

export default function CardSkeleton({ count = 4 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center justify-between rounded-[2.5rem] overflow-hidden w-full max-w-[300px] mx-auto h-[380px] bg-gray-100"
        >
          {/* Image area with logo loader */}
          <div className="w-full flex-grow flex items-center justify-center p-6">
            <div className="relative flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute w-20 h-20 rounded-full border-4 border-transparent border-t-orouba-yellow border-r-orouba-yellow animate-spin opacity-60" />
              {/* Logo */}
              <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center animate-bounce-slow">
                <Image
                  src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"
                  alt="Loading"
                  width={40}
                  height={40}
                  className="object-contain opacity-50"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Bottom text placeholder */}
          <div className="w-full bg-white rounded-t-[2.5rem] p-6 flex flex-col items-center gap-3">
            <div className="h-5 w-3/4 rounded-full animate-shimmer" />
            <div className="h-4 w-1/2 rounded-full animate-shimmer" />
          </div>
        </div>
      ))}
    </>
  );
}
