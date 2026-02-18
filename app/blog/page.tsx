/**
 * BlogListing Server Component
 * Fetches initial blog data on the server for better SEO and performance
 */

import { Metadata } from "next";
import Script from "next/script";
import { blogSchema } from "@/lib/schema";
import BlogListingClient from "./BlogListingClient";
 
interface BlogPost {
  _id: string;
  slug: string;
  seo?: {
    seoTitle?: string;
    canonicalUrl?: string;
  };
  content?: {
    topic?: string;
    summary?: string;
  };
  media?: {
    featuredImage?: string;
  };
  readingTime?: number;
  createdAt: string;
}

interface BlogApiResponse {
  blogs: BlogPost[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Fetch blogs from API on the server
 */
async function getBlogs(page: number = 1, limit: number = 9): Promise<BlogApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://successvanhire.co.uk';
  
  try {
    const response = await fetch(
      `${baseUrl}/api/blog?page=${page}&limit=${limit}&fields=_id,slug,seo.seoTitle,content.topic,content.summary,media.featuredImage,readingTime,createdAt&status=published`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    return {
      blogs: data.blogs || [],
      total: data.total || 0,
      page: data.page || page,
      pages: data.pages || 1,
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      blogs: [],
      total: 0,
      page: 1,
      pages: 1,
    };
  }
}

export const metadata: Metadata = {
  title: "Blog - Success Van Hire | Van Rental Tips & Guides London",
  description:
    "Read our latest blog posts about van rental tips, moving guides, and transport solutions in London. Expert advice from Success Van Hire professionals.",
  keywords:
    "van rental blog, moving tips london, van hire guides, transport advice, success van hire blog, london moving tips",
  openGraph: {
    title: "Success Van Hire Blog - Van Rental Tips & Guides",
    description:
      "Expert tips and guides for van rental, moving, and transport in London. Stay informed with our latest blog posts.",
    type: "website",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  
  // Fetch initial data on the server
  const { blogs, total, pages } = await getBlogs(currentPage);

  return (
    <>
      {/* ✅ Schema.org JSON-LD */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      
      {/* Pass initial server-fetched data to client component */}
      <BlogListingClient 
        initialBlogs={blogs}
        initialPage={currentPage}
        initialTotal={total}
        initialTotalPages={pages}
      />
    </>
  );
}
