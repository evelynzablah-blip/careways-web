import sanitizeHtml from "sanitize-html";

/** Allow-list for rich text written in the admin editor. */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "blockquote", "hr", "img", "figure", "figcaption", "code", "pre", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      iframe: ["src", "title", "allow", "allowfullscreen", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: ["www.youtube-nocookie.com", "www.youtube.com", "player.vimeo.com"],
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
        };
      },
    },
  });
}

/** Policy HTML served by Termageddon (the provider used on careways.world today). */
export function sanitizePolicy(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "h4", "h5"]),
    allowedAttributes: { a: ["href", "target", "rel"], "*": ["id"] },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
