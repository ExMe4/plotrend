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
    <nav className="w-full bg-white shadow-md px-6 py-4 relative">
      <h1 className="text-2xl font-bold text-blue-600">Plotrend</h1>
      <div className="relative inline-block ml-6">
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
                  href={`/shows/${s.id}`} // use slug if implemented
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
    </nav>
  );
}