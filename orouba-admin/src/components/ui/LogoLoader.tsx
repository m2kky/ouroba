"use client";

import Image from "next/image";

interface LogoLoaderProps {
  size?: "sm" | "md" | "lg" | "full";
  text?: string;
  transparent?: boolean;
}

export default function LogoLoader({ size = "md", text, transparent = false }: LogoLoaderProps) {
  const sizes = {
    sm: { logo: 48, container: "w-full h-full min-h-[80px]" },
    md: { logo: 80, container: "w-full h-full min-h-[160px]" },
    lg: { logo: 120, container: "w-full min-h-[300px]" },
    full: { logo: 140, container: "fixed inset-0 z-[9999]" },
  };

  const { logo, container } = sizes[size];

  return (
    <div
      className={`${container} flex flex-col items-center justify-center ${
        transparent ? "bg-transparent" : size === "full" ? "bg-white" : "bg-white/90"
      }`}
    >
      {/* Animated logo wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div
          className="absolute rounded-full border-4 border-transparent border-t-orouba-yellow border-r-orouba-yellow animate-spin"
          style={{ width: logo + 32, height: logo + 32 }}
        />
        {/* Middle pulsing ring */}
        <div
          className="absolute rounded-full border-2 border-orouba-blue/20 animate-ping"
          style={{ width: logo + 16, height: logo + 16, animationDuration: "1.5s" }}
        />
        {/* Logo image with gentle bounce */}
        <div
          className="relative rounded-full bg-white shadow-lg flex items-center justify-center animate-bounce-slow"
          style={{ width: logo, height: logo, animationDuration: "2s" }}
        >
          <Image
            src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"
            alt="Orouba Logo"
            width={logo - 12}
            height={logo - 12}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Optional text */}
      {text && (
        <p className="mt-6 text-orouba-blue font-bold text-sm animate-pulse tracking-widest uppercase">
          {text}
        </p>
      )}

      {/* Dots indicator */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orouba-yellow"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
