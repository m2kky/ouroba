import sanitize from "sanitize-html";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Removes dangerous tags like <script>, event handlers (onclick, etc.),
 * while allowing safe formatting tags.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  
  return sanitize(dirty, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "b", "i", "u", "strong", "em", "s", "del",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
      "blockquote", "pre", "code",
      "span", "div", "sub", "sup",
    ],
    allowedAttributes: {
      "a": ["href", "target", "rel"],
      "img": ["src", "alt", "width", "height"],
      "*": ["class", "style"],
    },
    // Strip all tags that aren't in the whitelist
    disallowedTagsMode: "discard",
  });
}
