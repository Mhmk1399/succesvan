/**
 * Shared Blog Generation Utilities
 * 
 * Common functions and configurations used by both:
 * - blog-generator.ts (full generation)
 * - blog-step-generator.ts (step-by-step generation)
 */

import OpenAI from "openai";

// ============================================================================
// OPENAI CLIENT
// ============================================================================

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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

// Helper function to extract first image from HTML content
export const extractImageFromContent = (content: string): string => {
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/;
  const match = content.match(imgRegex);
  return match ? match[1] : "/assets/images/van.png";
};

// Helper function to estimate read time from content
export const estimateReadTime = (content: string): number => {
  const textOnly = content.replace(/<[^>]*>/g, "");
  const words = textOnly.split(/\s+/).length;
  return Math.ceil(words / 200); // Average 200 words per minute
};

// Helper function to strip HTML tags and get plain text
export const stripHtmlTags = (html: string): string => {
  return html
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
  content: string,
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

  return {
    id: apiData.id || "",
    _id: apiData._id || "",
    title: apiData.title || "",
    slug: generateSlug(apiData.title || ""),
    excerpt: getExcerpt(apiData.content || apiData.description || "", 160),
    content: apiData.content || "",
    image: extractImageFromContent(apiData.content) || "/assets/images/van.png",
    author: "Success Van",
    category: "Blog",
    date: date,
    readTime: Math.max(1, estimateReadTime(apiData.content || "")),
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

// Fetch a single blog by slug
export const fetchBlogBySlug = async (
  slug: string,
): Promise<BlogPostFormatted | null> => {
  try {
    console.log("[Blog Utils] Fetching blog by slug:", slug);
    const blogs = await fetchAllBlogs();

    const blog = blogs.find((blog) => {
      const match = blog.slug === slug;
      console.log(
        `[Blog Utils] Checking slug: "${blog.slug}" === "${slug}" => ${match}`,
      );
      return match;
    });

    if (!blog) {
      console.warn(`[Blog Utils] No blog found for slug: ${slug}`);
      console.log(
        "[Blog Utils] Available slugs:",
        blogs.map((b) => b.slug),
      );
    }

    return blog || null;
  } catch (error) {
    console.error("[Blog Utils] Error fetching blog by slug:", error);
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
