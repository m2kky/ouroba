"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Controls the "heaviness" or smoothness duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // A nice exponential easing
      wheelMultiplier: 0.8, // Slightly slows down mouse wheel to feel heavier/magnetic
      touchMultiplier: 2, 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
