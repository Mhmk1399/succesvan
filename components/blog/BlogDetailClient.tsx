"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import TableOfContents from "./TableOfContents";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogDetailClientProps {
  content: string;
}

export default function BlogDetailClient({ content }: BlogDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [mounted, setMounted] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");

  // Sanitize HTML content to prevent XSS
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("dompurify").then((module) => {
        const DOMPurify = module.default;
        const sanitized = DOMPurify.sanitize(content, {
          ALLOWED_TAGS: [
            "p",
            "br",
            "img",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "strong",
            "em",
            "u",
            "s",
            "span",
            "a",
            "ul",
            "ol",
            "li",
            "blockquote",
            "code",
            "pre",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
            "figure",
            "figcaption",
          ],
          ALLOWED_ATTR: [
            "class",
            "style",
            "src",
            "alt",
            "title",
            "href",
            "dir",
            "width",
            "height",
            "loading",
            "decoding",
          ],
          ALLOW_DATA_ATTR: false,
        });
        setSanitizedContent(sanitized);
        setMounted(true);
      });
    }
  }, [content]);

  // Animation effect for content
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [mounted]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
      {/* TOC Sidebar - Only on large screens */}
      <div className="lg:col-span-1">
        <TableOfContents contentRef={contentRef} />
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-200 prose-a:text-[#fe9a00] hover:prose-a:text-white prose-a:transition-colors prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8 prose-code:bg-slate-800 prose-code:text-[#fe9a00] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-[#fe9a00] prose-blockquote:text-gray-300 lg:col-span-3"
        dangerouslySetInnerHTML={{
          __html: sanitizedContent,
        }}
      />

      {/* Mobile TOC - Only on small screens */}
      <div className="lg:hidden">
        <TableOfContents contentRef={contentRef} />
      </div>
    </div>
  );
}
