"use client";
import { useEffect, useState } from "react";
import { searchShows } from "@/lib/api";
import Link from "next/link";

let debounceTimer: ReturnType<typeof setTimeout>;

export default function NavBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setLoading(true);
      searchShows(search)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
  }, [search]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 py-6 relative min-h-[80px]">
      {/* Logo */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
        <h1 className="text-2xl font-bold text-blue-600 px-2 py-1">Plotrend</h1>
      </div>

      {/* Search box */}
      <div className="relative flex justify-center">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV show..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-black border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />

            {/* Spinner */}
            {loading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {results.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                {results.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/shows/${s.id}`}
                      className="block px-3 py-2 hover:bg-gray-100 text-black"
                      onClick={() => setSearch("")}
                    >
                      {s.title}
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