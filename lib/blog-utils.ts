/**
 * Shared Blog Generation Utilities
 * 
 * Common functions and configurations used by both:
 * - blog-generator.ts (full generation)
 * - blog-step-generator.ts (step-by-step generation)
 */

// OpenAI client should be used via `lib/openai.ts` which provides a server-only factory (`getOpenAI`).
// Do NOT initialize OpenAI here to avoid constructing it in client-side bundles.


// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate a unique ID with timestamp and random suffix
 * @returns Unique identifier string
 */
export const generateId = (): string =>
  `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Get current year for SEO title generation
 * @returns Current year as number
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// ============================================================================
// TEXT UTILITIES (Blog generation)
// ============================================================================

/**
 * Calculate reading time based on word count (200 words/minute)
 * @param text - Text content to analyze
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Strip HTML tags from text
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

/**
 * Count words in text
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

// ============================================================================
// SLUG & URL UTILITIES (Legacy blog utilities)
// ============================================================================

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Helper function to safely coerce content to string (supports string or structured content)
function coerceContentToString(content: any): string {
  if (!content && content !== 0) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    // Prefer compiledHtml, summary, or fallback to JSON string (concise)
    return (
      (content.compiledHtml as string) ||
      (content.summary as string) ||
      JSON.stringify(content)
    );
  }
  return String(content);
}

// Helper function to extract first image from HTML content
export const extractImageFromContent = (content: any): string => {
  const contentStr = coerceContentToString(content);
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/;
  const match = contentStr.match(imgRegex);
  return match ? match[1] : "/assets/images/van.png";
};

// Assemble structured content object into a single HTML string
function assembleContentFromObject(contentObj: any): string {
  if (!contentObj) return "";
  // If compiledHtml exists, prefer it
  if (typeof contentObj === "string") return contentObj;
  if (contentObj.compiledHtml && contentObj.compiledHtml.trim() !== "") {
    return contentObj.compiledHtml;
  }

  const parts: string[] = [];

  if (contentObj.summary) {
    parts.push(`<div class="lead">${contentObj.summary}</div>`);
  }

  if (Array.isArray(contentObj.headings)) {
    contentObj.headings.forEach((h: any) => {
      const level = h.level && Number.isFinite(h.level) ? h.level : 2;
      const idAttr = h.id ? ` id="${h.id}"` : "";
      parts.push(`<h${level}${idAttr}>${h.text}</h${level}>`);
      if (h.content) parts.push(`<div>${h.content}</div>`);
    });
  }

  if (contentObj.conclusion) {
    parts.push(`<div class="conclusion">${contentObj.conclusion}</div>`);
  }

  return parts.join("\n");
}

// Helper function to estimate read time from content
export const estimateReadTime = (content: any): number => {
  const contentStr = coerceContentToString(content);
  const textOnly = contentStr.replace(/<[^>]*>/g, "");
  const words = textOnly.trim() === "" ? 0 : textOnly.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)); // Average 200 words per minute
};

// Helper function to strip HTML tags and get plain text
export const stripHtmlTags = (html: any): string => {
  const contentStr = coerceContentToString(html);
  return contentStr
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

// Get excerpt from content (first 160 chars for meta description)
export const getExcerpt = (
  content: any,
  maxLength: number = 160,
): string => {
  const plainText = stripHtmlTags(content);
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
};

export interface BlogPost {
  _id: string;
  id: string;
  title: string;
  description: string;
  content: string;
  seoTitle?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface BlogPostFormatted {
  id: string;
  _id: string;
  title: string;
  slug: string;
  canonicalUrl?: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  date: string;
  readTime: number;
  seoTitle?: string;
  createdAt: string;
  updatedAt: string;
}

// Convert API data to formatted blog post
export const convertApiToBlogPost = (apiData: BlogPost): BlogPostFormatted => {
  const date = new Date(apiData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Support both string and structured content objects
  const rawContent: any = (apiData as any).content;
  let contentStr = "";
  if (typeof rawContent === "string") {
    contentStr = rawContent;
  } else if (rawContent && typeof rawContent === "object") {
    // Assemble from structured content when compiledHtml is missing
    contentStr = assembleContentFromObject(rawContent);
  } else {
    contentStr = String(rawContent || "");
  }

  const featured = (apiData as any).media?.featuredImage || "";
  const image = featured || extractImageFromContent(contentStr) || "/assets/images/van.png";

  const computedSlug = (apiData as any).slug || generateSlug(apiData.title || "");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://successvanhire.co.uk").replace(/\/$/, "");
  const canonicalFromApi = (apiData as any).seo?.canonicalUrl || (apiData as any).canonicalUrl || "";
  const canonicalUrl = canonicalFromApi || `${siteUrl}/blog/${computedSlug}`;

  return {
    id: apiData.id || "",
    _id: apiData._id || "",
    title: apiData.title || "",
    slug: computedSlug,
    canonicalUrl,
    excerpt: getExcerpt(contentStr || apiData.description || "", 160),
    content: contentStr || apiData.content || "",
    image,
    author: (apiData as any).author || "Success Van",
    category: (apiData as any).category || "Blog",
    date: date,
    readTime: (apiData as any).readingTime || Math.max(1, estimateReadTime(contentStr || "")),
    seoTitle: apiData.seoTitle,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
};

// Fetch all blogs from API
export const fetchAllBlogs = async (): Promise<BlogPostFormatted[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/blog`;

    console.log("[Blog Utils] Fetching from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch blogs: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("[Blog Utils] API Response:", data);

    const blogs = (data.blogs || []).map((blog: BlogPost) =>
      convertApiToBlogPost(blog),
    );
    console.log(
      "[Blog Utils] Converted blogs:",
      blogs.map((b: { title: string; slug: string }) => ({
        title: b.title,
        slug: b.slug,
      })),
    );

    return blogs;
  } catch (error) {
    console.error("[Blog Utils] Error fetching blogs:", error);
    return [];
  }
};

// Fetch a single blog by slug or id
export const fetchBlogBySlug = async (
  slugOrId: string,
): Promise<BlogPostFormatted | null> => {
  try {
    // Normalize input: remove query/hash and trim
    const cleanedId = (slugOrId || "").split(/[?#]/)[0].trim();
    console.log("[Blog Utils] Fetching blog by identifier:", cleanedId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Try single-blog endpoint first (works with both Mongo _id, slug, and canonicalUrl)
    try {
      // Normalize possible canonical URL input: if it's a full URL, try the pathname as an alternative identifier
      const candidates = [slugOrId];
      try {
        if (/^https?:\/\//i.test(slugOrId)) {
          const u = new URL(slugOrId);
          candidates.push(u.pathname, u.pathname.replace(/\/$/, ""));

          const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
          if (siteUrl) candidates.push(`${siteUrl}${u.pathname}`);
        }
      } catch (e) {
        // not a full URL
      }

      let found: BlogPostFormatted | null = null;

      for (const candidate of Array.from(new Set(candidates))) {
        const res = await fetch(`${baseUrl}/api/blog/${encodeURIComponent(candidate)}`, {
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          // try next candidate
          console.debug(`[Blog Utils] Candidate ${candidate} returned ${res.status}`);
          continue;
        }

        const data = await res.json();
        console.log(`[Blog Utils] Single blog API response for ${candidate}:`, data);

        if (data?.success && data?.blog) {
          const b: any = data.blog;
          // Normalize structured content and assemble if needed
          const rawContent = b.content;
          let contentStr = "";
          if (typeof rawContent === "string") contentStr = rawContent;
          else if (rawContent && typeof rawContent === "object") contentStr = assembleContentFromObject(rawContent);

          const image = b.media?.featuredImage || extractImageFromContent(contentStr || "") || "/assets/images/van.png";

          found = {
            id: b.id || b._id || "",
            _id: b._id || "",
            title: b.title || "",
            slug: b.slug || generateSlug(b.title || ""),
            excerpt: getExcerpt(contentStr || b.excerpt || "", 160),
            content: contentStr || b.content || "",
            image,
            author: b.author || "Success Van",
            category: b.category || "Blog",
            date: new Date(b.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            readTime: b.readingTime || Math.max(1, estimateReadTime(contentStr || "")),
            seoTitle: b.seo?.seoTitle || b.seoTitle,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
          };

          return found;
        }
      }

      if (!found) console.warn(`[Blog Utils] Single-blog endpoint did not find blog for any candidate: ${candidates.join(", ")}`);
    } catch (err) {
      console.warn("[Blog Utils] Single blog fetch failed:", err);
    }

    // Fallback - fetch all blogs and try matching by slug or _id
    console.log("[Blog Utils] Falling back to fetching all blogs for lookup:", slugOrId);
    const blogs = await fetchAllBlogs();
    const bySlug = blogs.find((blog) => blog.slug === slugOrId);
    if (bySlug) return bySlug;
    const byId = blogs.find((blog) => blog._id === slugOrId || blog.id === slugOrId);
    if (byId) return byId;

    console.warn(`[Blog Utils] No blog found for identifier: ${slugOrId}`);
    return null;
  } catch (error) {
    console.error("[Blog Utils] Error fetching blog by identifier:", error);
    return null;
  }
};

// Generate JSON-LD schema for blog post
export const generateBlogSchema = (
  blog: BlogPostFormatted,
  siteUrl: string,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${blog.slug}#BlogPosting`,
    headline: blog.seoTitle || blog.title,
    description: blog.excerpt,
    image: {
      "@type": "ImageObject",
      url: blog.image,
      width: 1200,
      height: 630,
    },
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: blog.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Success Van Hire",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/logo.png`,
        width: 250,
        height: 60,
      },
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${blog.slug}`,
    },
  };
};

// Generate JSON-LD schema for breadcrumb navigation
export const generateBreadcrumbSchema = (
  siteUrl: string,
  blogTitle: string,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blogTitle,
        item: `${siteUrl}/blog`,
      },
    ],
  };
};

// Generate JSON-LD schema for organization
export const generateOrganizationSchema = (siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Success Van Hire",
    url: siteUrl,
    logo: `${siteUrl}/assets/logo.png`,
    description: "Professional van hire services in London",
    sameAs: [
      "https://www.facebook.com/successvanhire",
      "https://www.twitter.com/successvanhire",
      "https://www.instagram.com/successvanhire",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Success Van, North West London",
      addressLocality: "London",
      addressRegion: "England",
      postalCode: "NW",
      addressCountry: "GB",
    },
  };
};
