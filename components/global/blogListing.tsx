"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  date: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Tips for Choosing the Right Van for Your Move",
    slug: "tips-choosing-right-van",
    excerpt:
      "Learn how to select the perfect van size and features for your moving needs.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "John Smith",
    category: "Moving Tips",
    date: "2024-01-15",
    readTime: 5,
  },
  {
    id: 2,
    title: "Van Rental Safety: What You Need to Know",
    slug: "van-rental-safety",
    excerpt:
      "Essential safety tips and guidelines for renting and driving a van.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "Sarah Johnson",
    category: "Safety",
    date: "2024-01-10",
    readTime: 7,
  },
  {
    id: 3,
    title: "Budget-Friendly Moving Hacks",
    slug: "budget-moving-hacks",
    excerpt:
      "Discover cost-effective strategies to make your move more affordable.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "Mike Davis",
    category: "Budget Tips",
    date: "2024-01-05",
    readTime: 6,
  },
  {
    id: 4,
    title: "Packing Tips for Long Distance Moves",
    slug: "packing-long-distance",
    excerpt:
      "Master the art of packing for a smooth long-distance moving experience.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "Emma Wilson",
    category: "Packing",
    date: "2023-12-28",
    readTime: 8,
  },
  {
    id: 5,
    title: "Commercial Van Rental Guide",
    slug: "commercial-van-rental",
    excerpt:
      "Everything you need to know about renting vans for business purposes.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "James Brown",
    category: "Business",
    date: "2023-12-20",
    readTime: 9,
  },
  {
    id: 6,
    title: "Seasonal Moving: Best Times to Rent",
    slug: "seasonal-moving-guide",
    excerpt: "Understand seasonal trends and find the best time to rent a van.",
    content: "Full blog content here...",
    image: "/assets/images/van.png",
    author: "Lisa Anderson",
    category: "Planning",
    date: "2023-12-15",
    readTime: 5,
  },
];

interface BlogListingProps {
  posts?: BlogPost[];
  showFilters?: boolean;
}

export default function BlogListing({
  posts = blogPosts,
  showFilters = true,
}: BlogListingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category))),
  ];

  useEffect(() => {
    let filtered = [...posts];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (sortBy === "recent") {
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sortBy === "readtime") {
      filtered.sort((a, b) => a.readTime - b.readTime);
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, sortBy, posts]);

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
  }, [filteredPosts]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-linear-to-br from-[#0f172b] via-slate-900 to-[#0f172b] py-20  "
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#fe9a00]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Latest
            <br />
            <span className="text-[#fe9a00]">Blog Posts</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tips, guides, and insights for your moving journey
          </p>
        </div>

        {showFilters && (
          <div className="mb-8">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full px-6 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FiFilter className="text-[#fe9a00]" />
                  Filters & Sort
                </span>
                <FiChevronDown
                  className={`transition-transform duration-300 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`${
                isFilterOpen ? "block" : "hidden"
              } lg:block transition-all duration-300`}
            >
              <div className="flex flex-col lg:flex-row gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex-1">
                  <label className="block text-white text-sm font-semibold mb-3">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-[#fe9a00] text-white shadow-lg shadow-[#fe9a00]/50"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:w-64">
                  <label className="block text-white text-sm font-semibold mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold focus:outline-none focus:border-[#fe9a00] transition-all duration-300"
                  >
                    <option value="recent" className="bg-slate-800">
                      Most Recent
                    </option>
                    <option value="oldest" className="bg-slate-800">
                      Oldest First
                    </option>
                    <option value="readtime" className="bg-slate-800">
                      Read Time
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 text-gray-400">
          Showing{" "}
          <span className="text-[#fe9a00] font-bold">
            {filteredPosts.length}
          </span>{" "}
          {filteredPosts.length === 1 ? "post" : "posts"}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post, index) => (
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
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer">
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
            <span className="inline-block px-3 py-1 rounded-full bg-[#fe9a00]/30 text-[#fe9a00] text-xs font-bold mb-3">
              {post.category}
            </span>
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
              <span className="text-sm text-gray-400">
                {post.readTime} min read
              </span>
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
