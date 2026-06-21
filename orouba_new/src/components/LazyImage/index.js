"use client";
import React, { useEffect, useRef, useState } from "react";

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
  const [failedSrc, setFailedSrc] = useState("");

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

  const displaySrc = canLoad && src && failedSrc !== src ? src : undefined;
  const isLoading = Boolean(src && (!canLoad || loadedSrc !== src));
  const shouldShowAlt = Boolean(src && loadedSrc === src);

  const handleLoad = (event) => {
    if (canLoad && src && event.currentTarget.getAttribute("src") === src) {
      setLoadedSrc(src);
      setFailedSrc("");
      onLoad?.(event);
    }
  };

  const handleError = (event) => {
    if (canLoad && src && event.currentTarget.getAttribute("src") === src) {
      setFailedSrc(src);
      onError?.(event);
    }
  };

  return (
    <img
      ref={imageRef}
      src={displaySrc}
      alt={shouldShowAlt ? alt : ""}
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
