"use client";
import React, { useEffect, useRef, useState } from "react";

const PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function LazyImage({ src, rootMargin = "200px", eager = false, ...props }) {
  const imageRef = useRef(null);
  const [canLoad, setCanLoad] = useState(eager);

  useEffect(() => {
    if (eager || canLoad || !src) return;

    const image = imageRef.current;
    if (!image || typeof IntersectionObserver === "undefined") {
      const frameId = window.requestAnimationFrame(() => setCanLoad(true));
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [canLoad, eager, rootMargin, src]);

  return (
    <img
      ref={imageRef}
      src={canLoad && src ? src : PLACEHOLDER_SRC}
      data-src={!canLoad && src ? src : undefined}
      {...props}
    />
  );
}

export default LazyImage;
