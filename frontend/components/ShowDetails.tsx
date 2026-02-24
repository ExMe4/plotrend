"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function ShowDetails({
  show,
  averageRating,
}: {
  show: any;
  averageRating?: string;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!show) return <p className="p-6">Show not found.</p>;

  function getAERStyle(rating: number): string {
    if (rating >= 9.0) return "text-purple-700";
    if (rating >= 8.5) return "text-green-700";
    if (rating >= 8.0) return "text-green-600";
    if (rating >= 7.5) return "text-green-500";
    if (rating >= 6.0) return "text-yellow-500";
    if (rating >= 5.0) return "text-yellow-600";
    return "text-red-600";
  }

  function getPopularityStyle(pop: number): string {
    if (pop >= 200) return "text-purple-700";
    if (pop >= 140) return "text-green-800";
    if (pop >= 100) return "text-green-600";
    if (pop >= 50) return "text-yellow-500";
    return "text-red-600";
  }

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover Image */}
          <Image
            src={show.coverImageUrl || "/no-image.png"}
            alt={show.title}
            width={200}
            height={300}
            className="rounded-lg shadow"
            priority
          />

          {/* Info + Ratings */}
          <div className="flex flex-col md:flex-row justify-between w-full">
            {/* Main info */}
            <div>
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

              {/* Years */}
              <p className="text-gray-600 mb-2">
                {show.startYear}
                {show.endYear && show.endYear !== show.startYear
                  ? ` – ${show.endYear}`
                  : !show.endYear
                  ? " – Ongoing"
                  : ""}
              </p>

              {/* Episodes */}
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

            {/* Ratings */}
            <div className="flex gap-10 md:ml-auto mt-4 md:mt-0 items-right">
              {/* Popularity */}
              <div className="text-center">
                <div
                  className={`pt-6 text-[5.5rem] leading-none font-bold tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom ${getPopularityStyle(
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
                  <div className="pt-6 text-[5.5rem] leading-none font-bold text-black tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom">
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

              {/* AER */}
              {averageRating && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <div
                      className={`pt-6 text-[5.5rem] leading-none font-bold tracking-tighter scale-y-[1.3] scale-x-[0.8] origin-bottom ${getAERStyle(
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
                        AER stands for “Average Episode Rating” and is calculated by averaging all
                        rated episodes.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}