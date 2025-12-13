"use client";

import { use } from "react";
import { blogPosts } from "@/components/global/blogListing";
import { FiCalendar, FiUser, FiArrowLeft, FiShare2 } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f172b] via-slate-900 to-[#0f172b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">
            Post Not Found
          </h1>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 rounded-xl bg-[#fe9a00] text-white font-bold hover:scale-105 transition-transform duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172b] via-slate-900 to-[#0f172b]">
      {/* Hero Image */}
      <div className="relative h-96 lg:h-125 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80"></div>

        {/* Back Button */}
        <Link
          href="/blog"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#fe9a00]/30 text-[#fe9a00] text-xs font-bold mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#fe9a00]" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <FiUser className="text-[#fe9a00]" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              {post.readTime} min read
            </div>
            <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
              <FiShare2 className="text-[#fe9a00]" />
              Share
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-6">
            <p className="text-lg">{post.excerpt}</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 my-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Introduction
              </h2>
              <p>
                This is where the full blog content would be displayed. You can
                add rich text formatting, images, and more detailed information
                about the topic.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Key Points
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#fe9a00] font-bold">•</span>
                <span>First key point about the topic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#fe9a00] font-bold">•</span>
                <span>Second key point about the topic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#fe9a00] font-bold">•</span>
                <span>Third key point about the topic</span>
              </li>
            </ul>

            <div className="bg-[#fe9a00]/10 border border-[#fe9a00]/30 rounded-2xl p-8 my-8">
              <p className="text-[#fe9a00] font-semibold mb-2">💡 Pro Tip</p>
              <p>
                This is a highlighted tip or important information related to
                the blog post content.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Conclusion
            </h2>
            <p>
              Wrap up the blog post with a conclusion that summarizes the key
              takeaways and encourages reader engagement.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-linear-to-r from-[#fe9a00]/20 to-transparent rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to book your van?
            </h3>
            <p className="text-gray-300 mb-6">
              Apply the tips from this article to your next move.
            </p>
            <Link
              href="/vans"
              className="inline-block px-8 py-3 rounded-xl bg-[#fe9a00] text-white font-bold hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#fe9a00]/50"
            >
              Browse Vans
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white mb-8">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter((p) => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fe9a00]/50 transition-all duration-300"
                >
                  <h4 className="text-lg font-bold text-white group-hover:text-[#fe9a00] transition-colors duration-300 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    {relatedPost.excerpt}
                  </p>
                  <span className="text-xs text-[#fe9a00] font-semibold">
                    Read More →
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
