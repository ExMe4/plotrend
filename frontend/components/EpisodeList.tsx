"use client";
import { useState } from "react";
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

  return (
    <div className="my-8">
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
      {open && (
        <div className="mt-4 bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: "seasonNumber", label: "Season" },
                  { key: "episodeNumber", label: "Episode" },
                  { key: "airDate", label: "Air Date" },
                  { key: "rating", label: "Rating" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description" },
                ].map((col, idx, arr) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2 border-b border-gray-200 cursor-pointer select-none ${
                      idx > 0 ? "border-l border-gray-200" : ""
                    } ${idx === arr.length - 1 ? "" : ""}`}
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
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-t border-gray-200">{ep.seasonNumber}</td>
                  <td className="px-4 py-2 border-t border-l border-gray-200">{ep.episodeNumber}</td>
                  <td className="px-4 py-2 border-t border-l border-gray-200">{ep.airDate || "N/A"}</td>
                  <td className="px-4 py-2 border-t border-l border-gray-200">{ep.rating ?? "N/A"}</td>
                  <td className="px-4 py-2 border-t border-l border-gray-200">{ep.title}</td>
                  <td className="px-4 py-2 border-t border-l border-gray-200 max-w-[500px]">
                    <p className="line-clamp-3">{ep.description || "—"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}