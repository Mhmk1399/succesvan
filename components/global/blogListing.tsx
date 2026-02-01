"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiCalendar,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { convertApiToBlogPost, BlogPostFormatted } from "@/lib/blog-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogListingProps {
  posts?: BlogPostFormatted[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostFormatted[]>(posts || []);
  const [loading, setLoading] = useState(!posts);
  const [error, setError] = useState<string | null>(null);
  const [missingSlugs, setMissingSlugs] = useState<string[]>([]);

  // Track posts missing slugs for telemetry and UI warning
  useEffect(() => {
    if (!blogPosts || blogPosts.length === 0) {
      setMissingSlugs([]);
      return;
    }

    const missing = blogPosts
      .filter((p) => !p.slug || p.slug.trim() === "")
      .map((p) => p._id || p.id || "unknown");

    if (missing.length > 0) {
      console.warn(`[BlogListing] ${missing.length} posts missing slug:`, missing);
    }

    setMissingSlugs(missing);
  }, [blogPosts]);

  // Fetch blogs from API if not provided as props
  useEffect(() => {
    if (posts) {
      setBlogPosts(posts);
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        const convertedBlogs = (data.blogs || []).map((blog: any) =>
          convertApiToBlogPost(blog)
        );
        setBlogPosts(convertedBlogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [posts]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [blogPosts]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-linear-to-br from-[#0f172b] via-slate-900 to-[#0f172b] py-20  "
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#fe9a00] mb-2">
            Latest Blog Posts
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tips, guides, and insights for your moving journey
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400">
            Error loading blogs: {error}
          </div>
        )}

        {missingSlugs.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 flex items-center justify-between">
            <div>
              <div className="font-semibold">⚠️ {missingSlugs.length} post(s) missing slug</div>
              <div className="text-sm text-gray-300">Clicking a post will fall back to using its ID in the URL.</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log("[BlogListing] Missing slugs:", missingSlugs);
                  // Lightweight UX hint for admins during dev
                  try {
                    // eslint-disable-next-line no-alert
                    alert(`Missing slugs for ${missingSlugs.length} posts. Check console for IDs.`);
                  } catch (e) {
                    // ignore
                  }
                }}
                className="px-3 py-2 rounded-lg bg-yellow-600/80 text-white text-sm font-semibold"
              >
                Log IDs
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-400">Loading blogs...</div>
          </div>
        ) : (
          <>
            {blogPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {blogPosts.map((post, index) => (
                  <div
                    key={post.id}
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPostFormatted }) {
  return (
    <Link href={`/blog/${encodeURIComponent(post.slug || post._id)}`}>
      <div className="group relative h-125 rounded-3xl overflow-hidden cursor-pointer">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 brightness-75 group-hover:blur-sm transition-all duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/85 transition-all duration-500"></div>
        </div>

        <div className="relative h-full flex flex-col p-6 justify-between">
          <div>
            <h3 className="text-xl font-black text-white line-clamp-1 leading-tight">
              {post.title}
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm line-clamp-2">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-white/30">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-[#fe9a00]" />
                {post.date}
              </div>
              <div className="flex items-center gap-1.5">
                <FiUser className="text-[#fe9a00]" />
                {post.author}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="group/btn relative px-4 py-2 rounded-xl bg-[#fe9a00] text-white font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-[#fe9a00]/50">
                <span className="relative z-10 flex items-center gap-2">
                  Read More
                  <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
