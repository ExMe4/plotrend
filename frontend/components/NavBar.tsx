"use client";
import { useState } from "react";

export default function NavBar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600">Plotrend</h1>
      <input
        type="text"
        placeholder="Search TV show..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </nav>
  );
}