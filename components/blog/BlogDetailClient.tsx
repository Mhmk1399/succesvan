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
  const contentRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
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
            "div",
            "hr",
            "mark",
            "script",
          ],
          ALLOWED_ATTR: [
            "class",
            "style",
            "src",
            "alt",
            "title",
            "href",
            "target",
            "rel",
            "dir",
            "width",
            "height",
            "loading",
            "decoding",
            "bgcolor",
            "background",
            "data-color",
          ],
          ALLOW_DATA_ATTR: false,
        });

        // Process mark elements to apply background-color from data-color attribute
        let processed = sanitized.replace(
          /<mark\s+data-color="([^"]*)"[^>]*>/gi,
          (match, color) => {
            return `<mark style="background-color: ${color};" data-color="${color}">`;
          },
        );

        // Add loading="lazy" and decoding="async" to img tags that don't have them
        processed = processed.replace(
          /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
          (match, before, src, after) => {
            // Check if loading or decoding attributes already exist
            if (match.includes('loading="') || match.includes("loading='")) {
              return match;
            }
            // Add loading and decoding attributes
            return `<img${before}src="${src}" loading="lazy" decoding="async"${after}>`;
          },
        );

        setSanitizedContent(processed);
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
          },
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <>
      {/* Static heading styles */}
      <style>{`
        /* Prevent black text in dark mode - only override if text would be black */
        @media (prefers-color-scheme: dark) {
          .blog-content p:not([style*="color"]),
          .blog-content span:not([style*="color"]),
          .blog-content li:not([style*="color"]) {
            color: #d1d5db !important;
          }
        }
        /* Image CLS prevention */
        .blog-content img {
          aspect-ratio: 16 / 9;
          width: 100%;
          height: auto;
          object-fit: cover;
          min-height: 200px;
          background-color: #1e293b;
        }
        .blog-content img[src*=".svg"],
        .blog-content img[style*="width"],
        .blog-content img[style*="height"] {
          aspect-ratio: unset;
          min-height: unset;
        }
        .blog-content h1 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.875rem !important;
          margin-bottom: 1rem !important;
          margin-top: 2rem !important;
          line-height: 1.2 !important;
        }
        .blog-content h2 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1.5rem !important;
          line-height: 1.3 !important;
        }
        .blog-content h3 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.25rem !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1.25rem !important;
          line-height: 1.4 !important;
        }
        .blog-content h4 {
          color: white !important;
          font-weight: 600 !important;
          font-size: 1.125rem !important;
          margin-bottom: 0.5rem !important;
          margin-top: 1rem !important;
          line-height: 1.4 !important;
        }
        .blog-content h5 {
          color: white !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          margin-bottom: 0.5rem !important;
          margin-top: 0.75rem !important;
          line-height: 1.5 !important;
        }
        .blog-content h6 {
          color: white !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
          margin-bottom: 0.5rem !important;
          margin-top: 0.5rem !important;
          line-height: 1.5 !important;
        }
        /* Horizontal line styling */
        .blog-content hr {
          border-color: #e4e4e !important;
          margin: 1.5rem 0 !important;
        }
        /* Highlight/mark styling */
        .blog-content mark {
           color: inherit !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
        }
        /* Allow inline background colors */
        .blog-content [style*="background"],
        .blog-content [style*="background-color"] {
          display: inline-block !important;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        {/* TOC Sidebar - Only on large screens */}
        <div className="lg:col-span-1">
          <TableOfContents contentRef={contentRef} />
        </div>

        {/* Main Content */}

        <div
          ref={contentRef}
          className="blog-content prose prose-invert max-w-none lg:col-span-3
            prose-a:text-[#fe9a00] hover:prose-a:text-white prose-a:transition-colors
            prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
            prose-code:bg-slate-800 prose-code:text-[#fe9a00] prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10
            prose-blockquote:border-[#fe9a00]"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />

        {/* Mobile TOC - Only on small screens */}
        <div className="lg:hidden">
          <TableOfContents contentRef={contentRef} />
        </div>
      </div>
    </>
  );
}
