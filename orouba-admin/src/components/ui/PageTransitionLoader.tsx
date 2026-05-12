"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "@/components/ui/LogoLoader";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevPath(pathname);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <LogoLoader size="lg" text="جاري التحميل..." />
    </div>
  );
}
