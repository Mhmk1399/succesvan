"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import TableOfContents from "./TableOfContents";
import { VanData } from "@/types/type";

// Dynamically import VanListing to avoid SSR issues
const VanListing = dynamic(
  () => import("@/components/global/vanListing.backup").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-800 rounded-xl"></div>
        ))}
      </div>
    ),
  },
);

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

interface VanListingContextType {
  categories: VanData[];
  isLoading: boolean;
}

const VanListingContext = createContext<VanListingContextType>({
  categories: [],
  isLoading: true,
});

// Inline Van Listing Component
function InlineVanListing({
  config,
  index,
}: {
  config: VanListConfig;
  index: number;
}) {
  const { categories } = useContext(VanListingContext);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter categories based on selectedVans
  const filteredVans = config.selectedVans && config.selectedVans.length > 0
    ? categories.filter((cat) => cat._id && config.selectedVans.includes(cat._id))
    : categories;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="van-list-inline my-6">
      {/* Section header */}
      {config.title && (
        <div className="mb-4">
          <h3 className="font-bold text-xl text-white">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-slate-400 mt-1">{config.subtitle}</p>
          )}
        </div>
      )}
      {/* Van listing */}
      <VanListing vans={filteredVans as any} showHeader={false} />
      {/* Reservation panel placeholder */}
      {config.showReservation && filteredVans.length > 0 && (
        <div className="reservation-panel-placeholder mt-4 p-4 bg-slate-800/50 rounded-lg text-center">
          <p className="text-sm text-slate-400 mb-3">
            Ready to book? Select your van above and complete your reservation.
          </p>
          <button className="px-5 py-2 bg-[#fe9a00] text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
            Start Reservation
          </button>
        </div>
      )}
    </div>
  );
}

// Van Listing Placeholder that will be replaced
function VanListingPlaceholder({
  index,
}: {
  index: number;
}) {
  return <div className="van-listing-placeholder" data-index={index} />;
}

export default function BlogDetailClient({ content }: BlogDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [mounted, setMounted] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [vanListConfigs, setVanListConfigs] = useState<VanListConfig[]>([]);
  const [categories, setCategories] = useState<VanData[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  // Parse van-list configs from content
  const parseVanListConfigs = (html: string) => {
    const configs: VanListConfig[] = [];
    const regex =
      /<div[^>]*class="van-listing-container"[^>]*data-van-config='([^']*)'/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      try {
        const config = JSON.parse(match[1]);
        configs.push(config);
      } catch (e) {
        console.log("Failed to parse van config:", e);
      }
    }
    return configs;
  };

  // Fetch van categories
  useEffect(() => {
    setIsLoadingCategories(true);
    fetch("/api/categories?status=active")
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.data?.data || data?.data || data?.categories || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => console.log("Failed to fetch categories:", err))
      .finally(() => setIsLoadingCategories(false));
  }, []);

  // Sanitize HTML content to prevent XSS
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("dompurify").then((module) => {
        const DOMPurify = module.default;

        // Extract van-list configs before sanitization
        const configs = parseVanListConfigs(content);
        setVanListConfigs(configs);

        // Replace van-listing-container divs with placeholders
        let contentToSanitize = content.replace(
          /<div[^>]*class="van-listing-container"[^>]*>[\s\S]*?<\/div>/g,
          (match) => {
            return '<div class="van-listing-placeholder"></div>';
          },
        );

        // Also handle self-closing or different formats
        contentToSanitize = contentToSanitize.replace(
          /<div[^>]*class="van-listing-container"[^>]*\/>/g,
          '<div class="van-listing-placeholder"></div>',
        );

        const sanitized = DOMPurify.sanitize(contentToSanitize, {
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
            "data-van-config",
            "id",
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
            if (
              match.includes('loading="') ||
              match.includes("loading='")
            ) {
              return match;
            }
            return `<img${before}src="${src}" loading="lazy" decoding="async"${after}>`;
          },
        );

        setSanitizedContent(processed);
        setContentKey((prev) => prev + 1);
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
  }, [mounted, contentKey]);

  // Render van listings inline by replacing placeholders
  const renderVanListings = () => {
    if (vanListConfigs.length === 0 || !mounted) return null;

    return vanListConfigs.map((config, index) => (
      <InlineVanListing key={`van-${index}`} config={config} index={index} />
    ));
  };

  return (
    <VanListingContext.Provider
      value={{ categories, isLoading: isLoadingCategories }}
    >
      <>
        {/* Static heading styles */}
        <style>{`
          @media (prefers-color-scheme: dark) {
            .blog-content p:not([style*="color"]),
            .blog-content span:not([style*="color"]),
            .blog-content li:not([style*="color"]) {
              color: #d1d5db !important;
            }
          }
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
          .blog-content hr {
            border-color: #e4e4e !important;
            margin: 1.5rem 0 !important;
          }
          .blog-content mark {
            color: inherit !important;
            padding: 0.125rem 0.25rem !important;
            border-radius: 0.25rem !important;
          }
          .blog-content [style*="background"],
          .blog-content [style*="background-color"] {
            display: inline-block !important;
          }
          /* Van List Inline styling */
          .van-list-inline > section {
            background: transparent !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            position: relative !important;
          }
          .van-list-inline section .absolute {
            display: none !important;
          }
          .van-list-inline section .grid {
            gap: 0.75rem !important;
          }
          .van-list-inline section .rounded-xl {
            border-radius: 0.5rem !important;
          }
          .van-list-inline section .max-w-7xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* CTA Block styling */
          .cta-block {
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            margin: 2rem 0;
            transition: transform 0.2s ease;
          }
          .cta-block:hover {
            transform: scale(1.02);
          }
          .cta-block h2 {
            margin: 0 0 0.75rem 0 !important;
            font-size: 1.5rem !important;
            font-weight: 700 !important;
          }
          .cta-block p {
            margin: 0 0 1.5rem 0 !important;
            font-size: 0.875rem !important;
            opacity: 0.9;
          }
          .cta-block a {
            display: inline-block;
            padding: 0.75rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.875rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-decoration: none !important;
          }
          .cta-block a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .cta-block .cta-phone {
            display: block;
            margin-top: 1rem;
            font-size: 0.75rem;
            opacity: 0.8;
          }
        `}</style>

        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative"
          key={contentKey}
        >
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

          {/* Render Van List blocks inline */}
          {renderVanListings()}

          {/* Mobile TOC - Only on small screens */}
          <div className="lg:hidden">
            <TableOfContents contentRef={contentRef} />
          </div>
        </div>
      </>
    </VanListingContext.Provider>
  );
}
