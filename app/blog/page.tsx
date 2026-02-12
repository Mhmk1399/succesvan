import { Metadata } from "next";
import BlogListing from "@/components/global/blogListing";
import Script from "next/script";
import { blogSchema } from "@/lib/schema";

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

export default function Blog() {
  return (
    <>
      {/* ✅ Schema.org JSON-LD */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <BlogListing />
    </>
  );
}
