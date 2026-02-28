"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";

type Episode = {
  seasonNumber: number;
  episodeNumber: number;
  airDate: string;
  rating: number | null;
  title: string;
  description?: string;
};

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Episode>("seasonNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 700);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScrollToEpisode = (e: any) => {
      const { seasonNumber, episodeNumber } = e.detail;

      setOpen(true);

      setTimeout(() => {
        const el = document.getElementById(
          `episode-${seasonNumber}-${episodeNumber}`
        );

        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });

          el.classList.add("bg-yellow-50");
          setTimeout(() => {
            el.classList.remove("bg-yellow-50");
          }, 8000);
        }
      }, 150);
    };

    window.addEventListener("scrollToEpisode", handleScrollToEpisode);

    return () => {
      window.removeEventListener("scrollToEpisode", handleScrollToEpisode);
    };
  }, []);

  const toggleSort = (field: keyof Episode) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedEpisodes = [...episodes].sort((a, b) => {
    const valA = a[sortBy] ?? "";
    const valB = b[sortBy] ?? "";
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const DescriptionCell = ({ text }: { text?: string }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const [hovered, setHovered] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      const el = textRef.current;
      if (!el) return;

      // Detect truncation
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }, [text]);

    if (!text) return <p>—</p>;

    return (
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p ref={textRef} className="line-clamp-3">
          {text}
        </p>

        {hovered && isTruncated && (
          <div className="absolute z-50 top-full left-0 mt-2 w-[400px] max-w-[90vw] bg-white shadow-xl rounded-lg p-3 text-sm text-gray-800 border border-gray-200">
            {text}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="my-8">
      {/* Title + Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Episodes</h2>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow hover:bg-gray-50 transition"
        >
          {open ? (
            <ChevronUp className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Dropdown Panel */}
      {open && isVisible && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed top-[100px] right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition cursor-pointer z-50"
        >
          <ArrowUp className="w-5 h-5 text-gray-700" />
        </button>
      )}
        {open && (
          <div className="mt-4 bg-white rounded-xl shadow-lg">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 shadow-sm">
                  <tr>
                    {[
                      { key: "seasonNumber", label: "Season" },
                      { key: "episodeNumber", label: "Episode" },
                      { key: "airDate", label: "Air Date" },
                      { key: "rating", label: "Rating" },
                      { key: "title", label: "Title" },
                      { key: "description", label: "Description" },
                    ].map((col, idx) => (
                      <th
                        key={col.key}
                        className={`md:sticky top-16 z-10 bg-gray-50 px-4 py-2 border-b border-gray-200 cursor-pointer select-none ${
                          idx > 0 ? "border-l border-gray-200" : ""
                        }`}
                        onClick={() => toggleSort(col.key as keyof Episode)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEpisodes.map((ep, i) => (
                    <tr
                      key={i}
                      id={`episode-${ep.seasonNumber}-${ep.episodeNumber}`}
                      className="hover:bg-gray-50 transition scroll-mt-32"
                    >
                      <td className="px-4 py-2 border-t border-gray-200">{ep.seasonNumber}</td>
                      <td className="px-4 py-2 border-t border-l border-gray-200">{ep.episodeNumber}</td>
                      <td className="px-4 py-2 border-t border-l border-gray-200">{ep.airDate || "N/A"}</td>
                      <td className="px-4 py-2 border-t border-l border-gray-200">{ep.rating ?? "N/A"}</td>
                      <td className="px-4 py-2 border-t border-l border-gray-200">{ep.title}</td>
                      <td className="px-4 py-2 border-t border-l border-gray-200 max-w-[500px]">
                        <DescriptionCell text={ep.description} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      )}
    </div>
  );
}