"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion, useScroll, useTransform, useSpring as useFramerSpring, useMotionValue } from "framer-motion";
import Link from "next/link";

export default function GlobeScrollSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive dragging state
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const r = useMotionValue(0);
  const rs = useFramerSpring(r, {
      mass: 1,
      damping: 30,
      stiffness: 100,
  });

  // Scroll tracking for the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animations based on scroll
  const globeScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 3.5]);
  const globeX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]); // Move slightly left
  
  const blurOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.7], [50, 0]);

  const updatePointerInteraction = (value: number | null) => {
      pointerInteracting.current = value;
      if (canvasRef.current) {
          canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
      }
  };

  const updateMovement = (clientX: number) => {
      if (pointerInteracting.current !== null) {
          const delta = clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta;
          r.set(r.get() + delta / 1400); // Damping factor
      }
  };

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 0, 
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1], // White oceans
      markerColor: [0, 0.29, 0.6], // Orouba Blue
      glowColor: [1, 1, 1],
      markers: [
        { location: [26.8206, 30.8025], size: 0.08 },
        { location: [51.1657, 10.4515], size: 0.06 },
        { location: [37.0902, -95.7129], size: 0.07 },
        { location: [36.2048, 138.2529], size: 0.06 },
        { location: [-25.2744, 133.7751], size: 0.06 },
      ],
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, [rs]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-gray-50" dir="rtl">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Globe Container */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          style={{ scale: globeScale, x: globeX }}
        >
          <div className="relative w-[800px] h-[800px]">
             {/* Yellow tint overlay on the globe itself to match brand */}
             <div className="absolute inset-0 bg-orouba-yellow mix-blend-multiply opacity-20 rounded-full z-10 pointer-events-none"></div>
             <canvas
              ref={canvasRef}
              style={{ width: 800, height: 800, maxWidth: "100%", aspectRatio: 1 }}
              className="relative z-0 drop-shadow-2xl cursor-grab"
              onPointerDown={(e) => {
                  pointerInteracting.current = e.clientX;
                  updatePointerInteraction(e.clientX);
              }}
              onPointerUp={() => updatePointerInteraction(null)}
              onPointerOut={() => updatePointerInteraction(null)}
              onMouseMove={(e) => updateMovement(e.clientX)}
              onTouchMove={(e) =>
                  e.touches[0] && updateMovement(e.touches[0].clientX)
              }
            />
          </div>
        </motion.div>

        {/* Blur Overlay */}
        <motion.div 
          className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 pointer-events-none"
          style={{ opacity: blurOpacity }}
        />

        {/* Text Content */}
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 relative z-30 pointer-events-auto">
          <motion.div 
            className="w-full md:w-1/2"
            style={{ opacity: textOpacity, y: textY }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-orouba-blue">العروبة حول العالم</h2>
            <p className="text-2xl text-gray-800 leading-loose mb-10 text-justify font-medium drop-shadow-sm">
              تلتزم العروبة بتوسيع نطاق انتشارها عالميًا، حيث توفر منتجاتها عالية الجودة لمختلف موائد العالم. تضمن شبكتنا الواسعة إيصال منتجاتنا طوال العام لأكثر من ٥٠ دولة حول العالم. أنطلقت رحلتنا من مصر، والآن نحن نتواجد في الشرق الأوسط ،أوروبا ،اليابان ،الولايات المتحدة الأمريكية ، كندا وأستراليا.
            </p>
            <Link href="/export" className="inline-block bg-orouba-yellow text-orouba-blue font-bold px-12 py-5 rounded-full text-xl hover:bg-yellow-400 transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
              المزيد
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
