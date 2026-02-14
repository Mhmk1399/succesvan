"use client";

import { JSX, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import TableOfContents from "./TableOfContents";
import { VanData } from "@/types/type";
import VanListing, { Category } from "@/components/global/vanListing.backup";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogDetailClientProps {
  content: string;
}

interface VanListConfig {
  title: string;
  subtitle: string;
  selectedVans: string[];
  showReservation: boolean;
}

export default function BlogDetailClient({ content }: BlogDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null!);
  const [mounted, setMounted] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentKey, setContentKey] = useState(0);
  const [vanListings, setVanListings] = useState<
    Array<{ config: VanListConfig; index: number }>
  >([]);

  useEffect(() => {
    fetch("/api/categories?status=active")
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.data?.data || data?.data || data?.categories || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("dompurify").then((module) => {
        const DOMPurify = module.default;

        const configs: VanListConfig[] = [];
        const regex =
          /<div[^>]*class="van-listing-container"[^>]*data-van-config='([^']*)'/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          try {
            configs.push(JSON.parse(match[1]));
          } catch (e) {
            console.error("Failed to parse:", e);
          }
        }

        let processed = content.replace(
          /<div[^>]*class="van-listing-container"[^>]*data-van-config='[^']*'[^>]*>[\s\S]*?<\/div>/g,
          (match) => {
            const idx = configs.findIndex((c, i) =>
              match.includes(JSON.stringify(c)),
            );
            return `<div class="van-placeholder" data-index="${idx >= 0 ? idx : configs.length}"></div>`;
          },
        );

        const sanitized = DOMPurify.sanitize(processed, {
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
            "data-index",
            "id",
          ],
        });

        let final = sanitized.replace(
          /<mark\s+data-color="([^"]*)"[^>]*>/gi,
          (match, color) =>
            `<mark style="background-color: ${color};" data-color="${color}">`,
        );

        final = final.replace(
          /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
          (match, before, src, after) => {
            if (match.includes('loading="')) return match;
            return `<img${before}src="${src}" loading="lazy" decoding="async"${after}>`;
          },
        );

        setSanitizedContent(final);
        setVanListings(configs.map((config, index) => ({ config, index })));
        setContentKey((prev) => prev + 1);
        setMounted(true);
      });
    }
  }, [content]);

  useEffect(() => {
    if (!mounted || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }, contentRef);

    return () => ctx.revert();
  }, [mounted, contentKey]);

  const renderContent = () => {
    if (!sanitizedContent) return null;

    const parts = sanitizedContent.split(
      /<div class="van-placeholder" data-index="(\d+)"><\/div>/,
    );
    const elements: JSX.Element[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i]) {
          elements.push(
            <div
              key={`content-${i}`}
              dangerouslySetInnerHTML={{ __html: parts[i] }}
            />,
          );
        }
      } else {
        const idx = parseInt(parts[i]);
        const listing = vanListings[idx];
        if (listing && categories.length > 0) {
          const filteredVans =
            listing.config.selectedVans &&
            listing.config.selectedVans.length > 0
              ? categories.filter(
                  (cat) =>
                    cat._id && listing.config.selectedVans.includes(cat._id),
                )
              : categories;

          elements.push(
            <div key={`van-${idx}`} className="van-list-wrapper my-6">
              <VanListing vans={filteredVans} showHeader={false} />
            </div>,
          );
        }
      }
    }

    return elements;
  };

  return (
    <>
      <style>{`
        @media (prefers-color-scheme: dark) {
          .blog-content p:not([style*="color"]),
          .blog-content span:not([style*="color"]),
          .blog-content li:not([style*="color"]) {
            color: #d1d5db !important;
          }
        }
        .blog-content > div > img,
        .blog-content > div > p > img,
        .blog-content > div > figure > img {
          aspect-ratio: 16 / 9;
          width: 100%;
          height: auto;
          object-fit: cover;
          min-height: 200px;
          background-color: #1e293b;
        }
        .blog-content h1 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.875rem !important;
          margin-bottom: 1rem !important;
          margin-top: 2rem !important;
        }
        .blog-content h1::before {
          content: attr(data-text);
          display: block;
        }
        .blog-content h2 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1.5rem !important;
        }
        .blog-content h2::before {
          content: attr(data-text);
          display: block;
        }
        .blog-content h3 {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.25rem !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1.25rem !important;
        }
        .blog-content h3::before {
          content: attr(data-text);
          display: block;
        }
        .van-list-wrapper > section {
          background: transparent !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .van-list-wrapper section .grid {
          gap: 0.75rem !important;
          grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
        }
        @media (min-width: 1024px) {
          .van-list-wrapper section .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        .van-list-wrapper section .max-w-7xl {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .cta-block {
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          margin: 2rem 0;
          width: 100%;
        }
      `}</style>

      <div
        className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative"
        key={contentKey}
      >
        <div className="lg:col-span-1">
          <TableOfContents contentRef={contentRef} />
        </div>

        <div
          ref={contentRef}
          className="blog-content prose prose-invert max-w-none lg:col-span-3
            prose-a:text-[#fe9a00] hover:prose-a:text-white
            prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
            prose-code:bg-slate-800 prose-code:text-[#fe9a00]
            prose-blockquote:border-[#fe9a00]"
        >
          {renderContent()}
        </div>

        <div className="lg:hidden">
          <TableOfContents contentRef={contentRef} />
        </div>
      </div>
    </>
  );
}
