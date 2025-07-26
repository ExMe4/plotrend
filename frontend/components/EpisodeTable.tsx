"use client";
import { useEffect, useState } from "react";
import { getEpisodes } from "@/lib/api";

export default function EpisodeTable({ showId }: { showId: string | number }) {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEpisodes(showId)
      .then((data) => setEpisodes(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [showId]);

  if (loading) return <p>Loading episodes...</p>;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Episodes</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Air Date</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((ep, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{ep.title}</td>
              <td className="p-2 border">{ep.airDate}</td>
              <td className="p-2 border">{ep.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
