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
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-4 md:px-6 py-4">
      <div className="relative flex items-center mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 z-10">
          <Image
            src="/logo.svg"
            alt="Plotrend Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="hidden sm:block text-2xl font-bold text-blue-600">
            Plotrend
          </h1>
        </Link>

        {/* Search */}
        <div
          ref={containerRef}
          className="
            relative
            ml-4
            w-full
            max-w-xs
            sm:max-w-sm
            md:absolute
            md:left-1/2
            md:-translate-x-1/2
          "
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV show..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search.length > 1 && setShowDropdown(true)}
              className="w-full text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />

            {loading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {showDropdown && results.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow z-20 max-h-60 overflow-y-auto">
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
                        src={s.coverImageUrl || "/no-image.png"}
                        alt={s.title}
                        width={32}
                        height={48}
                        className="rounded object-cover flex-shrink-0"
                      />
                      <span className="truncate">{s.title}</span>
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