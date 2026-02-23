"use client";
import React from "react";

type Episode = {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: string;
  rating: number;
  title: string;
};

export default function Highlights({ episodes }: { episodes: Episode[] }) {
  const ratedEpisodes = episodes.filter((ep) => ep.rating && ep.rating > 0);
  if (ratedEpisodes.length === 0) return null;

  // Best Episode
  const bestEp = ratedEpisodes.reduce((max, ep) =>
    ep.rating > max.rating ? ep : max
  );

  // Worst Episode
  const worstEp = ratedEpisodes.reduce((min, ep) =>
    ep.rating < min.rating ? ep : min
  );

  // Group by season
  const grouped = episodes.reduce<Record<number, Episode[]>>((acc, ep) => {
    if (ep.rating) {
      if (!acc[ep.seasonNumber]) acc[ep.seasonNumber] = [];
      acc[ep.seasonNumber].push(ep);
    }
    return acc;
  }, {});

  const seasons = Object.keys(grouped).map((s) => {
    const seasonNumber = Number(s);
    const eps = grouped[seasonNumber];
    const avg = eps.reduce((sum, ep) => sum + ep.rating, 0) / eps.length;

    const firstYear = eps[0].airDate
      ? new Date(eps[0].airDate).getFullYear()
      : null;
    const lastYear = eps[eps.length - 1].airDate
      ? new Date(eps[eps.length - 1].airDate).getFullYear()
      : null;

    let yearLabel = "";
    if (firstYear && lastYear) {
      yearLabel =
        firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`;
    }

    return { season: Number(s), avg, yearLabel };
  });

  const bestSeason =
    seasons.length > 1
      ? seasons.reduce((max, s) => (s.avg > max.avg ? s : max))
      : null;
  const worstSeason =
    seasons.length > 1
      ? seasons.reduce((min, s) => (s.avg < min.avg ? s : min))
      : null;

  // Top 5
  const top5 =
    ratedEpisodes.length >= 10
      ? [...ratedEpisodes].sort((a, b) => b.rating - a.rating).slice(0, 5)
      : [];

  // Best/Worst Run
  let bestRun: any = null;
  let worstRun: any = null;
  if (ratedEpisodes.length > 12) {
    for (let i = 0; i <= ratedEpisodes.length - 3; i++) {
      const window = ratedEpisodes.slice(i, i + 3);
      const avg = window.reduce((s, ep) => s + ep.rating, 0) / 3;
      if (!bestRun || avg > bestRun.avg) bestRun = { eps: window, avg };
      if (!worstRun || avg < worstRun.avg) worstRun = { eps: window, avg };
    }
  }

  const EpisodeBox = ({ ep }: { ep: Episode }) => (
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
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Highlights</h2>
      <div className="flex flex-col gap-4">
        {/* Best Episode */}
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

        {/* Worst Episode */}
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

        {/* Best & Worst Season */}
        {bestSeason && worstSeason && (
          <>
            <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
              <div className="bg-green-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                Best Season
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-3 flex-1">
                <span className="font-semibold">Season {bestSeason.season}</span>
                <span className="ml-2">({bestSeason.avg.toFixed(2)}/10)</span>
                {bestSeason.yearLabel && (
                  <div className="text-sm text-green-600 mt-1">
                    {bestSeason.yearLabel}
                  </div>
                )}
              </div>
            </div>

            <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
              <div className="bg-red-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
                Worst Season
              </div>
              <div className="bg-red-100 text-red-800 px-4 py-3 flex-1">
                <span className="font-semibold">
                  Season {worstSeason.season}
                </span>
                <span className="ml-2">({worstSeason.avg.toFixed(2)}/10)</span>
                {worstSeason.yearLabel && (
                  <div className="text-sm text-red-600 mt-1">
                    {worstSeason.yearLabel}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Top 5  */}
        {top5.length > 0 && (
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
        )}

        {/* Best/Worst Run */}
        {bestRun && (
          <div className="flex overflow-hidden rounded-2xl shadow-lg text-white">
            <div className="bg-green-700 px-4 py-3 font-bold min-w-[140px] flex items-center">
              Best Run
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-3 flex-1 flex gap-3 flex-wrap">
              {bestRun.eps.map((ep: Episode) => (
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
              {worstRun.eps.map((ep: Episode) => (
                <EpisodeBox key={ep.id} ep={ep} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}