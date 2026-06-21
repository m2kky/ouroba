"use client";

import { useEffect } from "react";

type TrackedMedia = {
  cleanup: () => void;
  overlay: HTMLSpanElement;
  updateOverlay: () => void;
};

const MEDIA_SELECTOR = "img, video";
const MIN_LOADER_SIZE = 56;

function isMediaElement(element: Element): element is HTMLImageElement | HTMLVideoElement {
  return element instanceof HTMLImageElement || element instanceof HTMLVideoElement;
}

function isLoaded(media: HTMLImageElement | HTMLVideoElement) {
  if (media instanceof HTMLImageElement) {
    return !media.dataset.src && media.complete && media.naturalWidth > 0;
  }

  return media.readyState >= 2;
}

function shouldSkip(media: HTMLImageElement | HTMLVideoElement) {
  return Boolean(
    media.closest("[data-orouba-media-loader='off']") ||
      media.hasAttribute("data-orouba-media-loader-off")
  );
}

export default function MediaLoadState() {
  useEffect(() => {
    const tracked = new WeakMap<HTMLImageElement | HTMLVideoElement, TrackedMedia>();

    const removeLoader = (media: HTMLImageElement | HTMLVideoElement) => {
      const state = tracked.get(media);
      if (!state) return;

      state.cleanup();
      tracked.delete(media);
    };

    const updateParentPosition = (parent: HTMLElement) => {
      if (window.getComputedStyle(parent).position === "static") {
        parent.dataset.oroubaMediaHolder = "true";
      }
    };

    const addLoader = (media: HTMLImageElement | HTMLVideoElement) => {
      if (tracked.has(media) || shouldSkip(media) || isLoaded(media)) {
        return;
      }

      const parent = media.parentElement;
      if (!parent) return;

      updateParentPosition(parent);

      const overlay = document.createElement("span");
      overlay.className = "orouba-media-loader";
      overlay.setAttribute("aria-hidden", "true");
      parent.appendChild(overlay);
      media.dataset.oroubaMediaPending = "true";

      let animationFrame = 0;

      const updateOverlay = () => {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(() => {
          const width = media.offsetWidth;
          const height = media.offsetHeight;

          if (width < MIN_LOADER_SIZE || height < MIN_LOADER_SIZE) {
            overlay.hidden = true;
            return;
          }

          overlay.hidden = false;
          overlay.style.left = `${media.offsetLeft}px`;
          overlay.style.top = `${media.offsetTop}px`;
          overlay.style.width = `${width}px`;
          overlay.style.height = `${height}px`;
          overlay.style.borderRadius = window.getComputedStyle(media).borderRadius;
        });
      };

      const finishIfReady = () => {
        if (isLoaded(media)) {
          removeLoader(media);
        } else {
          updateOverlay();
        }
      };
      const finishOnError = () => removeLoader(media);
      const resizeObserver =
        typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOverlay) : null;

      media.addEventListener("load", finishIfReady);
      media.addEventListener("error", finishOnError);
      media.addEventListener("loadeddata", finishIfReady);
      media.addEventListener("canplay", finishIfReady);
      resizeObserver?.observe(media);
      window.addEventListener("resize", updateOverlay);

      tracked.set(media, {
        overlay,
        updateOverlay,
        cleanup: () => {
          window.cancelAnimationFrame(animationFrame);
          media.removeEventListener("load", finishIfReady);
          media.removeEventListener("error", finishOnError);
          media.removeEventListener("loadeddata", finishIfReady);
          media.removeEventListener("canplay", finishIfReady);
          resizeObserver?.disconnect();
          window.removeEventListener("resize", updateOverlay);
          overlay.remove();
          delete media.dataset.oroubaMediaPending;
        },
      });

      updateOverlay();
    };

    const syncMedia = (element: Element) => {
      if (!isMediaElement(element)) return;

      if (shouldSkip(element) || isLoaded(element)) {
        removeLoader(element);
        return;
      }

      addLoader(element);
      tracked.get(element)?.updateOverlay();
    };

    const scan = () => {
      document.querySelectorAll(MEDIA_SELECTOR).forEach(syncMedia);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          syncMedia(mutation.target as Element);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          if (node.matches(MEDIA_SELECTOR)) {
            syncMedia(node);
          }

          node.querySelectorAll(MEDIA_SELECTOR).forEach(syncMedia);
        });
      });
    });

    scan();
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["src", "poster", "data-src"],
      childList: true,
      subtree: true,
    });
    window.addEventListener("load", scan);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", scan);
      document.querySelectorAll(MEDIA_SELECTOR).forEach((element) => {
        if (isMediaElement(element)) {
          removeLoader(element);
        }
      });
    };
  }, []);

  return null;
}
