"use client";
import { useEffect, useState } from "react";
import { getAllShows } from "@/lib/api";
import Link from "next/link";

export default function NavBar() {
  const [search, setSearch] = useState("");
  const [shows, setShows] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    getAllShows().then(setShows).catch(console.error);
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFiltered(
        shows.filter((s) =>
          s.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFiltered([]);
    }
  }, [search, shows]);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-6 relative min-h-[80px]">
      {/* Logo flush left with padding and vertically centered */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
        <h1 className="text-2xl font-bold text-blue-600 px-2 py-1">Plotrend</h1>
      </div>

      {/* Search box centered */}
      <div className="relative flex justify-center">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV show..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filtered.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/shows/${s.id}`}
                      className="block px-3 py-2 hover:bg-gray-100"
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