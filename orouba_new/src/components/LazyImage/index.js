"use client";
import React, { useEffect, useRef, useState } from "react";

const PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function LazyImage({
  src,
  rootMargin = "200px",
  threshold = 0,
  eager = false,
  className = "",
  alt = "",
  onLoad,
  onError,
  ...props
}) {
  const imageRef = useRef(null);
  const [canLoad, setCanLoad] = useState(eager);
  const [loadedSrc, setLoadedSrc] = useState("");

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
      { rootMargin, threshold }
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [canLoad, eager, rootMargin, src, threshold]);

  const displaySrc = canLoad && src ? src : PLACEHOLDER_SRC;
  const isLoading = Boolean(src && (!canLoad || loadedSrc !== src));

  const handleLoad = (event) => {
    if (canLoad && src && event.currentTarget.getAttribute("src") === src) {
      setLoadedSrc(src);
      onLoad?.(event);
    }
  };

  const handleError = (event) => {
    if (canLoad && src && event.currentTarget.getAttribute("src") === src) {
      setLoadedSrc(src);
      onError?.(event);
    }
  };

  return (
    <img
      ref={imageRef}
      src={displaySrc}
      alt={alt}
      data-src={!canLoad && src ? src : undefined}
      className={[
        className,
        "mediaLoadTarget",
        isLoading ? "mediaLoadTargetLoading" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

export default LazyImage;
