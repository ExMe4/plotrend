"use client";
import { useEffect, useState } from "react";
import { getShowDetails, getEpisodes, getCast } from "@/lib/api";
import EpisodeGrid from "./EpisodeGrid";
import RatingGraph from "./RatingGraph";
import RatingToggle from "./RatingToggle";
import Image from "next/image";

export default function ShowDetails({ id }: { id: string }) {
  const [show, setShow] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "graph">("grid");

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!show) return <p className="p-6">Show not found.</p>;

  const averageRating =
    episodes.length > 0
      ? (episodes.reduce((sum, ep) => sum + (ep.rating || 0), 0) / episodes.length).toFixed(2)
      : "N/A";

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Image
            src={show.coverImageUrl || "/placeholder.jpg"}
            alt={show.title}
            width={200}
            height={300}
            className="rounded-lg shadow"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
            <p className="text-gray-600 mb-1">
              {show.startYear} – {show.endYear || "Ongoing"}
            </p>
            <p className="text-gray-700 mb-1">IMDb Rating: {show.rating}</p>
            <p className="text-gray-700">Average Episode Rating: {averageRating}</p>
          </div>
        </div>

        {/* Toggle & View */}
        <div className="mt-10">
          <RatingToggle view={view} setView={setView} />
          <div className="mt-6">
            {view === "grid" ? (
              <EpisodeGrid episodes={episodes} />
            ) : (
              <RatingGraph episodes={episodes} />
            )}
          </div>
        </div>

        {/* Cast Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cast.map((c) => (
            <div key={c.id} className="text-center">
              <Image
                src={c.imageUrl || "/placeholder.jpg"}
                alt={c.actorName}
                width={120}
                height={160}
                className="mx-auto rounded-md shadow"
              />
              <p className="font-semibold mt-2">{c.actorName}</p>
              <p className="text-sm text-gray-500">{c.characterName}</p>
            </div>
          ))}
        </div>

        {/* Episode Table */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">Episodes</h2>
        <table className="w-full table-auto border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">S</th>
              <th className="p-2 border">Ep</th>
              <th className="p-2 border">Air Date</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((ep) => (
              <tr key={ep.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{ep.seasonNumber}</td>
                <td className="p-2 border text-center">{ep.episodeNumber}</td>
                <td className="p-2 border text-center">{ep.airDate}</td>
                <td className="p-2 border text-center">{ep.rating}</td>
                <td className="p-2 border">{ep.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}