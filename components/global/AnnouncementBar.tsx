"use client";

import useSWR from "swr";
import { FiAlertCircle, FiExternalLink, FiChevronRight } from "react-icons/fi";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { usePathname } from "next/navigation";

interface Announcement {
  _id: string;
  text: string;
  link?: string;
  textColor: string;
  backgroundColor: string;
  isActive: boolean;
  type?: "info" | "warning" | "success" | "promo" | "urgent";
  emoji?: string;
}

interface AnnouncementContextType {
  hasAnnouncement: boolean;
}

const AnnouncementContext = createContext<AnnouncementContextType>({
  hasAnnouncement: true,
});

export function useAnnouncement() {
  return useContext(AnnouncementContext);
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ErrorState() {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-red-600/20 via-red-500/20 to-red-600/20" />
      <div className="relative py-3 px-4 md:px-6 flex items-center justify-center gap-3 border-b border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
          <FiAlertCircle className="text-red-400 animate-pulse" size={18} />
          <span className="text-red-300 text-sm font-medium">
            Configuration Error
          </span>
        </div>
        <p className="text-red-200/80 text-sm">
          Multiple announcements are active. Only one should be active at a
          time.
        </p>
      </div>
    </div>
  );
}

export default function AnnouncementBar() {
  const { data, isLoading } = useSWR<{ data: Announcement[] }>(
    "/api/announcements",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );
  const pathname = usePathname();

  const [dismissed, setDismissed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("dismissedAnnouncements");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDismissed(parsed);
        } else {
          const validDismissals = Object.keys(parsed);
          setDismissed(validDismissals);
        }
      } catch {
        setDismissed([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function LoadingState() {
    return (
      <div className="w-full relative bg-[#fe9a00] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20" />
        <div className="relative py-1 px-4 md:px-6 flex items-center justify-center gap-3 border-b border-gray-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-1   rounded-full">
            <div className="w-4 h-4 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const announcements = data?.data || [];
  const activeAnnouncements = announcements.filter(
    (a: Announcement) => a.isActive,
  );
  const active = activeAnnouncements.filter(
    (a: Announcement) => !dismissed.includes(a._id),
  );

  if (!mounted || isLoading) {
    return <LoadingState />;
  }

  if (activeAnnouncements.length > 1) {
    return <ErrorState />;
  }

  if (active.length === 0) {
    return (
      <AnnouncementContext.Provider value={{ hasAnnouncement: false }}>
        {null}
      </AnnouncementContext.Provider>
    );
  }

  const announcement = active[0];

  const textContent = (
    <span className="flex items-center gap-2">
      {announcement.link ? (
        <a
          href={announcement.link}
          id="gtm-announcement-learn-more"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-white text-sm md:text-base font-medium hover:text-white/90 transition-colors"
        >
          <span className="border-b border-white/30 group-hover:border-white/60 transition-colors">
            {announcement.text}
          </span>
          <FiExternalLink
            size={14}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </a>
      ) : (
        <span className="text-white text-sm md:text-base font-medium">
          {announcement.text}
        </span>
      )}
    </span>
  );

  if (
    pathname === "/dashboard" ||
    pathname === "/customerDashboard" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <AnnouncementContext.Provider value={{ hasAnnouncement: true }}>
      <div
        ref={barRef}
        className={`
          w-full relative overflow-hidden transition-all duration-300 ease-out
          ${
            !isVisible
              ? "opacity-0 -translate-y-full"
              : "opacity-100 translate-y-0"
          }
        `}
        style={{
          animation: isVisible ? "slideDown 0.4s ease-out" : undefined,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: announcement.backgroundColor }}
        />

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[16px_16px]" />

        <div className="relative py-1 px-4 md:px-6 flex items-center gap-4">
          {announcement.emoji && (
            <span className="text-xl hidden sm:block shrink-0">
              {announcement.emoji}
            </span>
          )}

          <div
            className="flex-1 overflow-hidden scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`
                inline-flex items-center gap-8 whitespace-nowrap
                ${!isPaused ? "animate-marquee" : ""}
              `}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {textContent}
              <span className="text-white/40 mx-4">•</span>
              {textContent}
              <span className="text-white/40 mx-4">•</span>
              {textContent}
            </div>
          </div>

          {announcement.link && (
            <a
              href={announcement.link}
              id="gtm-announcement-learn-more"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Learn more about ${announcement.text}`}
              className="
                hidden md:flex items-center gap-1.5
                px-4 py-1.5 rounded-full
                bg-white/20 hover:bg-white/30
                backdrop-blur-sm
                text-white text-sm font-semibold
                transition-all duration-200
                hover:scale-105 active:scale-95
                border border-white/20
                group shrink-0
              "
            >
              <span>Learn More</span>
              <FiChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </AnnouncementContext.Provider>
  );
}
