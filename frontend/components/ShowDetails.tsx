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

        {/* Highlights Section */}
        {ratedEpisodes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Highlights</h2>
            <div className="flex flex-col gap-4">

              {/* Best Episode */}
              {(() => {
                const bestEp = ratedEpisodes.reduce((max, ep) =>
                  ep.rating > max.rating ? ep : max
                );
                return (
                  <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                    <div className="bg-purple-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                      Best Episode
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-4 py-3 flex-1">
                      <span className="font-semibold">
                        S{bestEp.seasonNumber}E{bestEp.episodeNumber} - {bestEp.title}
                      </span>
                      <span className="ml-2">({bestEp.rating.toFixed(1)}/10)</span>
                      <div className="text-sm text-purple-600 mt-1">{bestEp.airDate}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Worst Episode */}
              {(() => {
                const worstEp = ratedEpisodes.reduce((min, ep) =>
                  ep.rating < min.rating ? ep : min
                );
                return (
                  <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                    <div className="bg-red-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                      Worst Episode
                    </div>
                    <div className="bg-red-100 text-red-800 px-4 py-3 flex-1">
                      <span className="font-semibold">
                        S{worstEp.seasonNumber}E{worstEp.episodeNumber} - {worstEp.title}
                      </span>
                      <span className="ml-2">({worstEp.rating.toFixed(1)}/10)</span>
                      <div className="text-sm text-red-600 mt-1">{worstEp.airDate}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Best & Worst Season */}
              {(() => {
                const grouped = episodes.reduce((acc: any, ep) => {
                  if (ep.rating) {
                    if (!acc[ep.seasonNumber]) acc[ep.seasonNumber] = [];
                    acc[ep.seasonNumber].push(ep);
                  }
                  return acc;
                }, {});

                const seasons = Object.keys(grouped).map((s) => {
                  const eps = grouped[s];
                  const avg =
                    eps.reduce((sum, ep) => sum + ep.rating, 0) / eps.length;

                  // Extract just years
                  const firstYear = eps[0].airDate ? new Date(eps[0].airDate).getFullYear() : null;
                  const lastYear = eps[eps.length - 1].airDate
                    ? new Date(eps[eps.length - 1].airDate).getFullYear()
                    : null;

                  let yearLabel = "";
                  if (firstYear && lastYear) {
                    yearLabel = firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`;
                  }

                  return { season: Number(s), avg, yearLabel };
                });

                if (seasons.length <= 1) return null;

                const bestSeason = seasons.reduce((max, s) => (s.avg > max.avg ? s : max));
                const worstSeason = seasons.reduce((min, s) => (s.avg < min.avg ? s : min));

                return (
                  <>
                    <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                      <div className="bg-green-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                        Best Season
                      </div>
                      <div className="bg-green-100 text-green-800 px-4 py-3 flex-1">
                        <span className="font-semibold">Season {bestSeason.season}</span>
                        <span className="ml-2">({bestSeason.avg.toFixed(2)}/10)</span>
                        {bestSeason.yearLabel && (
                          <div className="text-sm text-green-600 mt-1">{bestSeason.yearLabel}</div>
                        )}
                      </div>
                    </div>

                    {/* Worst Season */}
                    <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                      <div className="bg-red-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                        Worst Season
                      </div>
                      <div className="bg-red-100 text-red-800 px-4 py-3 flex-1">
                        <span className="font-semibold">Season {worstSeason.season}</span>
                        <span className="ml-2">({worstSeason.avg.toFixed(2)}/10)</span>
                        {worstSeason.yearLabel && (
                          <div className="text-sm text-red-600 mt-1">{worstSeason.yearLabel}</div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Top 5 / Best Run / Worst Run */}
              {(() => {
                if (
                  ratedEpisodes.length < 5 ||
                  new Set(ratedEpisodes.map((ep) => ep.seasonNumber)).size <= 1
                ) {
                  return null;
                }

                const top5 = [...ratedEpisodes].sort((a, b) => b.rating - a.rating).slice(0, 5);

                let bestRun: any = null;
                let worstRun: any = null;
                for (let i = 0; i <= ratedEpisodes.length - 3; i++) {
                  const window = ratedEpisodes.slice(i, i + 3);
                  const avg = window.reduce((s, ep) => s + ep.rating, 0) / 3;
                  if (!bestRun || avg > bestRun.avg) bestRun = { eps: window, avg };
                  if (!worstRun || avg < worstRun.avg) worstRun = { eps: window, avg };
                }

                const EpisodeBox = ({ ep }: { ep: any }) => (
                  <div className="bg-white rounded-lg shadow p-2 w-32 flex-shrink-0">
                    <div className="text-[10px] font-semibold text-gray-600 mb-1">
                      S{ep.seasonNumber}E{ep.episodeNumber}
                    </div>
                    <div className="font-semibold text-xs truncate">{ep.title}</div>
                    <div className="text-[10px] text-gray-500 truncate">{ep.airDate}</div>
                    <div className="mt-1 font-bold text-base">{ep.rating.toFixed(1)}</div>
                  </div>
                );

                return (
                  <>
                    <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                      <div
                        className="px-4 py-3 font-bold min-w-[140px] flex items-center"
                        style={{ backgroundColor: "#FFD700", color: "#4a3500" }}
                      >
                        Top 5
                      </div>
                      <div className="bg-yellow-50 text-yellow-900 px-4 py-3 flex-1 flex gap-3 flex-wrap">
                        {top5.map((ep) => (
                          <EpisodeBox key={ep.id} ep={ep} />
                        ))}
                      </div>
                    </div>

                    {bestRun && (
                      <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                        <div className="bg-green-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                          Best Run
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-3 flex-1 flex gap-3 flex-wrap">
                          {bestRun.eps.map((ep: any) => (
                            <EpisodeBox key={ep.id} ep={ep} />
                          ))}
                        </div>
                      </div>
                    )}

                    {worstRun && (
                      <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
                        <div className="bg-red-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                          Worst Run
                        </div>
                        <div className="bg-red-100 text-red-800 px-4 py-3 flex-1 flex gap-3 flex-wrap">
                          {worstRun.eps.map((ep: any) => (
                            <EpisodeBox key={ep.id} ep={ep} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

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
          </>
        )}
      </div>
    </div>
  );
}