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
  property.trim().startsWith("--")
    ? property.trim()
    : property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());

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

const importantRichTextStyles = {
  fontSize: "--rich-font-size",
  lineHeight: "--rich-line-height",
  letterSpacing: "--rich-letter-spacing",
};

const richTextDashboardClassName = "rich-text-dashboard-style";

const cleanStyleValue = (value) =>
  String(value || "")
    .replace(/\s*!important\s*$/i, "")
    .trim();

const hasImportantRichTextStyle = (styles = {}) =>
  Object.keys(importantRichTextStyles).some((property) => Boolean(styles[property]));

const withDashboardClassName = (className, styles) =>
  [className, hasImportantRichTextStyle(styles) ? richTextDashboardClassName : ""]
    .filter(Boolean)
    .join(" ");

const withImportantRichTextVars = (styles = {}) =>
  Object.entries(styles).reduce((next, [property, value]) => {
    if (value == null || value === "") return next;

    next[property] = value;

    const variableName = importantRichTextStyles[property];
    const variableValue = cleanStyleValue(value);

    if (variableName && variableValue) {
      next[variableName] = variableValue;
    }

    return next;
  }, {});

const addImportantRichTextVarsToStyle = (styleText) => {
  const styles = parseStyleAttribute(styleText);
  const variables = Object.entries(importantRichTextStyles)
    .filter(([property, variableName]) => styles[property] && !styles[variableName])
    .map(([property, variableName]) => {
      const variableValue = cleanStyleValue(styles[property]);
      return variableValue ? `${variableName}: ${variableValue}` : "";
    })
    .filter(Boolean);

  if (!variables.length) return styleText;

  const separator = styleText.trim().endsWith(";") ? " " : "; ";
  return `${styleText}${separator}${variables.join("; ")}`;
};

const addDashboardClassToTag = (tagText) => {
  const classMatch = tagText.match(/\sclass\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);

  if (!classMatch) {
    return tagText.replace(/\s*(\/?)>$/, ` class="${richTextDashboardClassName}"$1>`);
  }

  const classValue = classMatch[2] || classMatch[3] || classMatch[4] || "";
  if (classValue.split(/\s+/).includes(richTextDashboardClassName)) return tagText;

  const quote = classMatch[1].startsWith("'") ? "'" : '"';
  return tagText.replace(
    classMatch[0],
    ` class=${quote}${`${classValue} ${richTextDashboardClassName}`.trim()}${quote}`
  );
};

const addImportantRichTextVarsToHtml = (content) =>
  content.replace(/<([a-z][\w:-]*)([^<>]*\sstyle\s*=\s*("([^"]*)"|'([^']*)')[^<>]*)>/gi, (match, tagName, attributes, quotedValue, doubleValue, singleValue) => {
    const styleText = doubleValue ?? singleValue ?? "";
    const styles = parseStyleAttribute(styleText);
    if (!hasImportantRichTextStyle(styles)) return match;

    const quote = quotedValue.startsWith("'") ? "'" : '"';
    const nextStyle = addImportantRichTextVarsToStyle(styleText);
    const nextTag = match.replace(
      /style\s*=\s*("([^"]*)"|'([^']*)')/i,
      `style=${quote}${nextStyle}${quote}`
    );

    return addDashboardClassToTag(nextTag);
  });

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
  const richTextStyle = withImportantRichTextVars(style || {});

  if (!content) return null;

  const isHeading = /^h[1-6]$/i.test(String(Tag));
  const singleBlock = isHeading ? getSingleBlock(content) : null;
  const singleParagraph = Tag === "p" ? getSingleParagraph(content) : null;

  if (isHeading && singleBlock) {
    const blockClassName = getAttributeValue(singleBlock.attributes, "class");
    const rawBlockStyle = parseStyleAttribute(getAttributeValue(singleBlock.attributes, "style"));
    const blockStyle = withImportantRichTextVars(
      rawBlockStyle
    );
    const blockDir = getAttributeValue(singleBlock.attributes, "dir");
    const HeadingTag = Tag;

    return (
      <HeadingTag
        className={["rich-text-content", withDashboardClassName(className, style), withDashboardClassName(blockClassName, rawBlockStyle)]
          .filter(Boolean)
          .join(" ")}
        style={{ ...richTextStyle, ...blockStyle }}
        dir={blockDir || undefined}
        dangerouslySetInnerHTML={{ __html: addImportantRichTextVarsToHtml(singleBlock.body) }}
      />
    );
  }

  if (singleParagraph) {
    const paragraphClassName = getAttributeValue(singleParagraph.attributes, "class");
    const rawParagraphStyle = parseStyleAttribute(
      getAttributeValue(singleParagraph.attributes, "style")
    );
    const paragraphStyle = withImportantRichTextVars(
      rawParagraphStyle
    );
    const paragraphDir = getAttributeValue(singleParagraph.attributes, "dir");

    return (
      <p
        className={["rich-text-content", withDashboardClassName(className, style), withDashboardClassName(paragraphClassName, rawParagraphStyle)]
          .filter(Boolean)
          .join(" ")}
        style={{ ...richTextStyle, ...paragraphStyle }}
        dir={paragraphDir || undefined}
        dangerouslySetInnerHTML={{ __html: addImportantRichTextVarsToHtml(singleParagraph.body) }}
      />
    );
  }

  const RenderTag = Tag === "p" || isHeading ? "div" : Tag;

  return (
    <RenderTag
      className={["rich-text-content", withDashboardClassName(className, style)]
        .filter(Boolean)
        .join(" ")}
      style={richTextStyle}
      dangerouslySetInnerHTML={{ __html: addImportantRichTextVarsToHtml(content) }}
    />
  );
}
