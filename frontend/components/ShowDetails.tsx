"use client";
import { useEffect, useState } from "react";
import { getShowDetails, getEpisodes, getCast } from "@/lib/api";
import EpisodeGrid from "./EpisodeGrid";
import Highlights from "@/components/Highlights";
import EpisodeList from "@/components/EpisodeList";
import RatingGraph from "./RatingGraph";
import RatingToggle from "./RatingToggle";
import Image from "next/image";

export default function ShowDetails({ id }: { id: string }) {
  const [show, setShow] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"grid" | "graph">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("ratingView") as "grid" | "graph") || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    localStorage.setItem("ratingView", view);
  }, [view]);

  function getAERStyle(rating: number): string {
    if (rating >= 9.0) {
      return "text-purple-700";
    }

    if (rating >= 8.5) {
      return "text-green-700";
    }

    if (rating >= 8.0) {
      return "text-green-600";
    }

    if (rating >= 7.5) {
      return "text-green-500";
    }

    if (rating >= 6.0) {
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

  function Spinner() {
    return (
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
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

    window.scrollTo(0, 0);

    fetchData();
  }, [id]);

  if (!show && !loading) {
      return <p className="p-6">Show not found.</p>;
    }

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
    <div className="relative bg-white min-h-screen text-gray-900">
        {/* Overlay spinner while fetching */}
        {loading && (
          <div className="absolute inset-3 flex items-start justify-center bg-white/70 z-50">
            <Spinner />
          </div>
        )}

        <div className="max-w-5xl mx-auto p-6">
          {show && (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Cover Image */}
                {show.coverImageUrl ? (
                  <Image
                    src={show.coverImageUrl}
                    alt={show.title}
                    width={200}
                    height={300}
                    className="rounded-lg shadow"
                  />
                ) : (
                  <Image
                    src="/no-image.png"
                    alt="No cover"
                    width={200}
                    height={300}
                    className="rounded-lg shadow"
                  />
                )}

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

        {/* Highlights Section */}
        <Highlights episodes={episodes} />

        {/* Cast Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cast.map((c) => (
            <div key={c.id} className="text-center">
              {c.imageUrl ? (
                      <Image
                        src={c.imageUrl}
                        alt={c.actorName}
                        width={120}
                        height={160}
                        className="mx-auto rounded-md shadow"
                      />
                    ) : (
                      <Image
                        src="/no-image.png"
                        alt="No image"
                        width={120}
                        height={160}
                        className="mx-auto rounded-md shadow"
                      />
                    )}
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
        <EpisodeList episodes={episodes} />
          </>
        )}
      </div>
    </div>
  );
}