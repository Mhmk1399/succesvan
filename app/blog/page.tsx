import { Metadata } from "next";
import BlogListing from "@/components/global/blogListing";

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
  return <BlogListing showFilters={true} />;
}
