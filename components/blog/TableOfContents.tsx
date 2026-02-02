"use client";

import { useEffect, useState } from "react";
import { FiList, FiChevronDown } from "react-icons/fi";

interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!contentRef.current) return;

    const extract = () => {
      // Extract H2-H5 headings from the content
      const elements = contentRef.current!.querySelectorAll("h2, h3, h4, h5");
      const flatHeadings: Heading[] = [];

      elements.forEach((element, index) => {
        const level = parseInt(element.tagName[1]);
        const text = element.textContent || `Heading ${index + 1}`;
        if (!element.id) {
          // Create stable ID
          element.id = `heading-${index}-${Math.random().toString(36).substr(2, 4)}`;
        }
        flatHeadings.push({ id: element.id, text, level });
      });

      // Group headings: h2 as parent, h3-h5 as children
      const nestedHeadings: Heading[] = [];
      let currentH2: Heading | null = null;
      flatHeadings.forEach((heading) => {
        if (heading.level === 2) {
          currentH2 = { ...heading, children: [] };
          nestedHeadings.push(currentH2);
        } else if (heading.level > 2 && currentH2) {
          currentH2.children!.push(heading);
        } else {
          // If no H2 parent found, push as top-level
          nestedHeadings.push({ ...heading, children: [] });
          currentH2 = null;
        }
      });

      setHeadings(nestedHeadings);
    };

    // Run once to extract immediately
    extract();

    // Observe changes to content (e.g., sanitized HTML being set) and re-extract
    const observer = new MutationObserver(() => {
      extract();
    });

    observer.observe(contentRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [contentRef]);

  // Handle scroll to heading
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Use different scroll alignment for mobile vs desktop
      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 1024;
      element.scrollIntoView({
        behavior: "smooth",
        block: isMobile ? "end" : "center",
      });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let current = "";

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 max-w-sm">
      {/* Mobile Collapsible */}
      <div className="lg:hidden  ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3   border border-gray-700 rounded-xl text-white font-semibold hover:border-[#fe9a00]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FiList className="w-5 h-5" />
            <span>Table of Contents</span>
          </div>
          <FiChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 animate-in fade-in duration-200">
            {headings.map((heading) => (
              <div key={heading.id}>
                <button
                  onClick={() => handleHeadingClick(heading.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                    activeId === heading.id
                      ? "bg-[#fe9a00] text-white font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  } text-base`}
                >
                  {heading.text}
                </button>
                {heading.children && heading.children.length > 0 && (
                  <ul className="ml-5 mt-1 space-y-1 list-disc">
                    {heading.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => handleHeadingClick(child.id)}
                          className={`block w-full text-left px-3 py-1 rounded transition-all text-sm ${
                            activeId === child.id
                              ? "bg-[#fe9a00] text-white font-semibold"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {child.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sticky */}
      <div className="hidden lg:block p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <FiList className="w-5 h-5 text-[#fe9a00]" />
          <h3 className="text-white font-bold text-lg">On this page</h3>
        </div>

        <nav className="space-y-2">
          {headings.map((heading) => (
            <div key={heading.id}>
              <button
                onClick={() => handleHeadingClick(heading.id)}
                className={`block w-full text-left px-3 py-2 rounded-sm transition-all duration-200 text-sm leading-relaxed ${
                  activeId === heading.id
                    ? "  text-[#fe9a00] border-l-2 border-[#fe9a00] pl-2 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                {heading.text}
              </button>
              {heading.children && heading.children.length > 0 && (
                <ul className="ml-5 mt-1 space-y-1 list-disc">
                  {heading.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => handleHeadingClick(child.id)}
                        className={`block w-full text-left px-3 py-1 rounded transition-all text-sm ${
                          activeId === child.id
                            ? "bg-[#fe9a00]/20 text-[#fe9a00] font-semibold"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {child.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Scroll to top button */}
        {activeId && (
          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setActiveId("");
            }}
            className="mt-5   border-t border-white/5 w-full py-2 px-3 text-sm text-[#fe9a00] hover:text-white hover:bg-white/5 rounded-lg transition-colors font-semibold"
          >
            ↑ Back to top
          </button>
        )}
      </div>
    </div>
  );
}
