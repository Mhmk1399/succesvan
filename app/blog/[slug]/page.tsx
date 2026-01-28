import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  fetchBlogBySlug,
  fetchAllBlogs,
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
 } from "@/lib/blog-utils";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from "react-icons/fi";
import Link from "next/link";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const blogs = await fetchAllBlogs();
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch {
    return [];
  }
}

// Generate metadata for blog post
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await fetchBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://successvanhire.co.uk/";
  const canonicalUrl = `${siteUrl}/blog/${blog.slug}`;

  return {
    title: blog.seoTitle || blog.title,
    description: blog.excerpt,
    keywords: [
      "van hire london",
      "moving tips",
      "van rental",
      blog.title,
      ...blog.title.split(" ").slice(0, 3),
    ],
    authors: [{ name: blog.author }],
    creator: blog.author,
    publisher: "Success Van Hire",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: blog.seoTitle || blog.title,
      description: blog.excerpt,
      siteName: "Success Van Hire",
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
          type: "image/jpeg",
        },
        {
          url: blog.image,
          width: 800,
          height: 600,
          alt: blog.title,
          type: "image/jpeg",
        },
      ],
      authors: [blog.author],
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      tags: ["van hire", "moving", blog.category],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.excerpt,
      images: [blog.image],
      creator: "@successvanhire",
      site: "@successvanhire",
    },
     alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL(siteUrl),
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const blog = await fetchBlogBySlug(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://successvanhire.co.uk/";
  const blogSchema = generateBlogSchema(blog, siteUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(siteUrl, blog.title);
  const organizationSchema = generateOrganizationSchema(siteUrl);

  const publishedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const modifiedDate = new Date(blog.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-linear-to-br from-[#0f172b] via-slate-900 to-[#0f172b]">
        {/* Navigation */}
        <div className="  z-40   bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
            <Link
              href="/blog"
              className="inline-flex mt-16 items-center gap-2 text-[#fe9a00] hover:text-white transition-colors duration-300 font-semibold"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Blog Detail Content */}
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
          {/* Header Section */}
          <header className="mb-12">
            <h1 className="text-4xl   lg:text-5xl font-black text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-6 border-b border-white/20">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-[#fe9a00]" />
                <span>
                  Published:{" "}
                  <span className="text-white font-semibold">
                    {publishedDate}
                  </span>
                </span>
              </div>

              {blog.createdAt !== blog.updatedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">•</span>
                  <span>
                    Updated:{" "}
                    <span className="text-white font-semibold">
                      {modifiedDate}
                    </span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FiUser className="w-5 h-5 text-[#fe9a00]" />
                <span>
                  By:{" "}
                  <span className="text-white font-semibold">
                    {blog.author}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-[#fe9a00]" />
                <span>
                  <span className="text-white font-semibold">
                    {blog.readTime}
                  </span>{" "}
                  min read
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              loading="lazy"
            />
          </div>

          {/* Blog Content */}
          <BlogDetailClient content={blog.content} />
        </article>

        {/* Related Articles Section */}
        <section className="bg-white/5 backdrop-blur-xl border-t border-white/10 py-16 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white mb-2">
              More Articles
            </h2>
            <p className="text-gray-400 mb-8">
              Explore more blog posts from our collection
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fe9a00] text-white font-bold hover:bg-[#e68900] transition-colors duration-300"
            >
              Browse All Articles
              <FiArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
