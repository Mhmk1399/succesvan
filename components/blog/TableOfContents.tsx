"use client";

import { useEffect, useState } from "react";
import { FiList, FiChevronDown } from "react-icons/fi";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    // Extract H2 and H3 headings from the content
    const elements = contentRef.current.querySelectorAll("h2, h3");
    const extractedHeadings: Heading[] = [];

    elements.forEach((element, index) => {
      const level = parseInt(element.tagName[1]);
      const text =
        element.textContent || `Heading ${index + 1}`;

      // Create or use existing ID
      if (!element.id) {
        element.id = `heading-${index}`;
      }

      extractedHeadings.push({
        id: element.id,
        text,
        level,
      });
    });

    setHeadings(extractedHeadings);
  }, [contentRef]);

  // Handle scroll to heading
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
    <div className="sticky top-24 max-w-xs">
      {/* Mobile Collapsible */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#fe9a00]/20 to-[#fe9a00]/10 border border-[#fe9a00]/30 rounded-xl text-white font-semibold hover:border-[#fe9a00]/50 transition-colors"
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
              <button
                key={heading.id}
                onClick={() => handleHeadingClick(heading.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                  activeId === heading.id
                    ? "bg-[#fe9a00] text-white font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                } ${heading.level === 3 ? "ml-4 text-sm" : "text-base"}`}
              >
                {heading.text}
              </button>
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
            <button
              key={heading.id}
              onClick={() => handleHeadingClick(heading.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm leading-relaxed ${
                activeId === heading.id
                  ? "bg-[#fe9a00]/20 text-[#fe9a00] border-l-2 border-[#fe9a00] pl-2 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              } ${heading.level === 3 ? "ml-3" : ""}`}
            >
              {heading.text}
            </button>
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
            className="mt-5 pt-5 border-t border-white/10 w-full py-2 px-3 text-sm text-[#fe9a00] hover:text-white hover:bg-white/5 rounded-lg transition-colors font-semibold"
          >
            ↑ Back to top
          </button>
        )}
      </div>
    </div>
  );
}
