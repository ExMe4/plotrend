"use client";
import { useEffect, useRef, useState } from "react";
import { searchShows } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

let debounceTimer: ReturnType<typeof setTimeout>;

export default function NavBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setLoading(true);
      searchShows(search)
        .then((res) => {
          setResults(res);
          setShowDropdown(true);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 py-6 relative min-h-[80px]">
      {/* Logo */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
        <h1 className="text-2xl font-bold text-blue-600 px-2 py-1">Plotrend</h1>
      </div>

      {/* Search box */}
      <div className="relative flex justify-center">
        <div className="absolute left-1/2 transform -translate-x-1/2" ref={containerRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV show..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search.length > 1 && setShowDropdown(true)}
              className="text-black border border-gray-300 rounded-lg px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />

            {/* Spinner */}
            {loading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Search results */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                {results.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/shows/${s.id}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSearch("");
                        setShowDropdown(false);
                      }}
                    >
                      <Image
                        src={s.coverImageUrl || "/placeholder.jpg"}
                        alt={s.title}
                        width={32}
                        height={48}
                        className="rounded object-cover flex-shrink-0"
                      />
                      <span className="truncate max-w-[220px]">{s.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}