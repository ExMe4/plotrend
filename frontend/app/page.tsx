"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { getAllShows } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllShows()
      .then((data) => setShows(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Explore TV Shows</h2>
        {loading ? (
          <p>Loading shows...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shows.map((show) => (
              <Link
                href={`/shows/${show.id}`}
                key={show.id}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <h3 className="font-semibold">{show.title}</h3>
                <p className="text-sm text-gray-500">
                  {show.startYear} – {show.endYear || "Ongoing"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
