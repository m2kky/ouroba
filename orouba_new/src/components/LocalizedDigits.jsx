"use client";

import { useEffect } from "react";

const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const skipTags = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
]);

const toArabicDigits = (value) =>
  String(value).replace(/[0-9]/g, (digit) => arabicDigits[Number(digit)]);

const toEnglishDigits = (value) =>
  String(value)
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));

const localizeDigits = (value, locale) =>
  locale === "ar" ? toArabicDigits(value) : toEnglishDigits(value);

const shouldSkip = (node) => {
  const parent = node.parentElement;
  if (!parent) return true;
  if (skipTags.has(parent.tagName)) return true;
  return Boolean(parent.closest("[contenteditable='true']"));
};

const normalizeTextNode = (node, locale) => {
  if (shouldSkip(node)) return;

  const nextValue = localizeDigits(node.nodeValue || "", locale);
  if (nextValue !== node.nodeValue) {
    node.nodeValue = nextValue;
  }
};

const normalizeTree = (root, locale) => {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    normalizeTextNode(node, locale);
    node = walker.nextNode();
  }
};

export default function LocalizedDigits({ locale }) {
  useEffect(() => {
    const language = locale === "ar" ? "ar" : "en";
    let frameId = 0;

    const scheduleNormalize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => normalizeTree(document.body, language));
    };

    scheduleNormalize();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          normalizeTextNode(mutation.target, language);
        }
      });

      if (mutations.some((mutation) => mutation.type === "childList")) {
        scheduleNormalize();
      }
    });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [locale]);

  return null;
}
