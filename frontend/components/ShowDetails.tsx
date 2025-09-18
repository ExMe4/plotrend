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

  function getAERStyle(rating: number): string {
    if (rating >= 9.5) {
      return "text-purple-700";
    }

    if (rating >= 8.5) {
      return "text-green-700";
    }

    if (rating >= 8.0) {
      return "text-green-600";
    }

    if (rating >= 7.0) {
      return "text-yellow-500";
    }

    if (rating >= 5.0) {
      return "text-yellow-600";
    }

    return "text-red-600";
  }

  function getPopularityStyle(pop: number): string {
    if (pop >= 200) return "text-purple-700";
    if (pop >= 140) return "text-green-800";
    if (pop >= 100) return "text-green-600";
    if (pop >= 50) return "text-yellow-500";
    return "text-red-600";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [showData, epData, castData] = await Promise.all([
          getShowDetails(id),
          getEpisodes(id),
          getCast(id),
        ]);

        setShow(showData);

        // Sort all episodes by season & episode number
        epData.sort((a, b) => {
          if (a.seasonNumber !== b.seasonNumber) {
            return a.seasonNumber - b.seasonNumber;
          }
          return a.episodeNumber - b.episodeNumber;
        });

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

  const ratedEpisodes = episodes.filter(
    (ep) => ep.rating !== null && ep.rating !== undefined && ep.rating > 0
  );

  const averageRating =
    ratedEpisodes.length > 0
      ? (
          ratedEpisodes.reduce((sum, ep) => sum + ep.rating, 0) /
          ratedEpisodes.length
        ).toFixed(2)
      : "N/A";

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover Image */}
          <Image
            src={show.coverImageUrl || "/placeholder.jpg"}
            alt={show.title}
            width={200}
            height={300}
            className="rounded-lg shadow"
          />

          {/* Show Info and Ratings */}
          <div className="flex flex-col md:flex-row justify-between w-full">

            {/* Title and Years */}
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{show.title}</h1>

              {/* Status Button */}
              {show.status && (
                <div className="mt-2 mb-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      ["Ended", "Canceled", "Cancelled"].includes(show.status)
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {show.status}
                  </span>
                </div>
              )}

              <p className="text-gray-600 mb-2">
                {show.startYear} – {show.endYear || "Ongoing"}
              </p>

              {/* Episode Count */}
              {show.episodeCount && (
                <p className="text-gray-600 mb-1">{show.episodeCount} Episodes</p>
              )}

              {/* Runtime */}
              {show.runtime && <p className="text-gray-700">{show.runtime} min</p>}

              {/* Networks */}
              {show.networks?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {show.networks.map((net: any) =>
                    net.logoUrl ? (
                      <Image
                        key={net.id}
                        src={net.logoUrl}
                        alt={net.name}
                        width={70}
                        height={40}
                        className="object-contain bg-white p-1 rounded shadow"
                      />
                    ) : (
                      <span key={net.id} className="text-sm text-gray-700">
                        {net.name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Ratings Display */}
            <div className="flex gap-10 md:ml-auto mt-4 md:mt-0 items-center">

              {/* Popularity */}
              <div className="text-center">
                <div
                  className={`pt-6 text-[5.5rem] leading-none font-tall font-bold tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom ${getPopularityStyle(
                    Math.round(show.popularity)
                  )}`}
                >
                  {show.popularity ? Math.round(show.popularity) : "N/A"}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
                  Popularity
                  <div className="relative group cursor-pointer">
                    <span className="text-[10px] bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      i
                    </span>
                    <div className="absolute bottom-full mb-2 w-60 text-[12px] text-white bg-black rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Popularity is a TMDB metric that combines page views, search traffic,
                      votes, and trending activity. It’s dynamic and updates daily. The
                      higher the number is, the more popular the show is
                    </div>
                  </div>
                </div>
              </div>

              {/* TMDB Rating */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="pt-6 text-[5.5rem] leading-none font-tall font-bold text-black tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom">
                    {show.rating || "N/A"}
                  </div>
                  {show.rating && (
                    <span className="absolute bottom-0 right-0 text-xs text-gray-500">/10</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
                  TMDB Rating
                </div>
              </div>

              {/* Average Episode Rating */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div
                    className={`pt-6 text-[5.5rem] leading-none font-tall font-bold tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom ${getAERStyle(
                      Number(averageRating)
                    )}`}
                  >
                    {averageRating}
                  </div>
                  {averageRating !== "N/A" && (
                    <span className="absolute bottom-0 right-0 text-xs text-gray-500">/10</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1 mt-1">
                  AER
                  <div className="relative group cursor-pointer">
                    <span className="text-[10px] bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      i
                    </span>
                    <div className="absolute bottom-full mb-2 w-52 text-[12px] text-white bg-black rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      AER stands for "Average Episode Rating" and is calculated by averaging all episodes with a rating.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle & View */}
        <div className="mt-10">
          <RatingToggle view={view} setView={setView} />
          <div className="mt-6 -mx-6">
            {view === "grid" ? (
              <EpisodeGrid episodes={ratedEpisodes} />
            ) : (
              <RatingGraph episodes={ratedEpisodes} />
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

        {/* Synopsis Section */}
        {show.overview && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
            <p className="text-gray-800 text-sm leading-relaxed max-w-5xl mx-auto">
              {show.overview}
            </p>
          </div>
        )}

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