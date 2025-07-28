// frontend/components/ShowDetails.tsx
"use client";
import { useEffect, useState } from "react";
import { getShowDetails, getEpisodes, getCast } from "@/lib/api";

export default function ShowDetails({ id }: { id: string }) {
  const [show, setShow] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [showData, epData, castData] = await Promise.all([
          getShowDetails(id),
          getEpisodes(id),
          getCast(id),
        ]);
        setShow(showData);
        setEpisodes(epData);
        setCast(castData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!show) return <p>Show not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
      <p className="text-gray-600 mb-4">
        {show.startYear} – {show.endYear || "Ongoing"} | IMDb: {show.rating}
      </p>

      {/* Grid or Graph placeholder */}
      <div className="my-8">
        <p>Episode Grid or Trend Graph will go here</p>
      </div>

      {/* Cast section */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cast.map((c) => (
          <div key={c.id} className="text-center">
            <img
              src={c.imageUrl || "/placeholder.jpg"}
              alt={c.actorName}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <p className="font-semibold">{c.actorName}</p>
            <p className="text-sm text-gray-500">{c.characterName}</p>
          </div>
        ))}
      </div>

      {/* Episode Table */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Episodes</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">S</th>
            <th className="p-2 border">Ep</th>
            <th className="p-2 border">Air Date</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((ep) => (
            <tr key={ep.id} className="hover:bg-gray-50">
              <td className="p-2 border">{ep.seasonNumber}</td>
              <td className="p-2 border">{ep.episodeNumber}</td>
              <td className="p-2 border">{ep.airDate}</td>
              <td className="p-2 border">{ep.rating}</td>
              <td className="p-2 border">{ep.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}