"use client";

import React from "react";

const hasHtml = (value) => /<[a-z][\s\S]*>/i.test(String(value || ""));

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const richTextToHtml = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";
  if (hasHtml(text)) return text.replace(/&nbsp;/g, " ");

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("")
    .replace(/&nbsp;/g, " ");
};

export const stripRichText = (value) =>
  String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function RichText({ html, as: Tag = "div", className = "", style }) {
  const content = richTextToHtml(html);
  if (!content) return null;

  return (
    <Tag
      className={`rich-text-content ${className}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
