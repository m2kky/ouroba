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

const getAttributeValue = (attributes, name) => {
  const match = attributes.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  );

  return match ? match[2] || match[3] || match[4] || "" : "";
};

const toReactStyleName = (property) =>
  property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const parseStyleAttribute = (styleText) =>
  styleText
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .reduce((styles, declaration) => {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) return styles;

      const property = toReactStyleName(declaration.slice(0, separatorIndex));
      const value = declaration.slice(separatorIndex + 1).trim();

      if (property && value) {
        styles[property] = value;
      }

      return styles;
    }, {});

const getSingleParagraph = (content) => {
  const match = content.match(/^<p([^>]*)>([\s\S]*)<\/p>$/i);
  if (!match || /<\/?p(?:\s|>)/i.test(match[2])) return null;

  return {
    attributes: match[1] || "",
    body: match[2],
  };
};

const getSingleBlock = (content) => {
  const match = content.match(/^<(p|h[1-6])([^>]*)>([\s\S]*)<\/\1>$/i);
  if (!match || /<\/?(?:p|h[1-6])(?:\s|>)/i.test(match[3])) return null;

  return {
    tag: match[1].toLowerCase(),
    attributes: match[2] || "",
    body: match[3],
  };
};

export default function RichText({ html, as: Tag = "div", className = "", style }) {
  const content = richTextToHtml(html);

  if (!content) return null;

  const isHeading = /^h[1-6]$/i.test(String(Tag));
  const singleBlock = isHeading ? getSingleBlock(content) : null;
  const singleParagraph = Tag === "p" ? getSingleParagraph(content) : null;

  if (isHeading && singleBlock) {
    const blockClassName = getAttributeValue(singleBlock.attributes, "class");
    const blockStyle = parseStyleAttribute(getAttributeValue(singleBlock.attributes, "style"));
    const blockDir = getAttributeValue(singleBlock.attributes, "dir");
    const HeadingTag = Tag;

    return (
      <HeadingTag
        className={["rich-text-content", className, blockClassName]
          .filter(Boolean)
          .join(" ")}
        style={{ ...(style || {}), ...blockStyle }}
        dir={blockDir || undefined}
        dangerouslySetInnerHTML={{ __html: singleBlock.body }}
      />
    );
  }

  if (singleParagraph) {
    const paragraphClassName = getAttributeValue(singleParagraph.attributes, "class");
    const paragraphStyle = parseStyleAttribute(
      getAttributeValue(singleParagraph.attributes, "style")
    );
    const paragraphDir = getAttributeValue(singleParagraph.attributes, "dir");

    return (
      <p
        className={["rich-text-content", className, paragraphClassName]
          .filter(Boolean)
          .join(" ")}
        style={{ ...(style || {}), ...paragraphStyle }}
        dir={paragraphDir || undefined}
        dangerouslySetInnerHTML={{ __html: singleParagraph.body }}
      />
    );
  }

  const RenderTag = Tag === "p" || isHeading ? "div" : Tag;

  return (
    <RenderTag
      className={`rich-text-content ${className}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
