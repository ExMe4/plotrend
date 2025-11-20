"use client";
import { useState, useEffect } from "react";
import RatingToggle from "./RatingToggle";
import RatingGraph from "./RatingGraph";
import EpisodeGrid from "./EpisodeGrid";
import Highlights from "./Highlights";
import CreatorsSection from "./CreatorsSection";
import CastSection from "./CastSection";
import EpisodeList from "./EpisodeList";

export default function ShowExtras({
  episodes,
  cast,
  creators,
  showOverview,
}: {
  episodes: any[];
  cast: any[];
  creators: any[];
  showOverview?: string;
}) {
  const [view, setView] = useState<"grid" | "graph">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("ratingView") as "grid" | "graph") || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    localStorage.setItem("ratingView", view);
  }, [view]);

  const ratedEpisodes = episodes.filter(
    (ep) => ep.rating !== null && ep.rating !== undefined && ep.rating > 0
  );

  const hasRatedEpisodes = ratedEpisodes.length > 0;

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-5xl mx-auto p-6">

        {/* Rating Toggle & View */}
        <div>
          {hasRatedEpisodes ? (
            <>
              <RatingToggle view={view} setView={setView} />
              <div className="mt-6 -mx-6">
                {view === "grid" ? (
                  <EpisodeGrid episodes={ratedEpisodes} />
                ) : (
                  <RatingGraph episodes={ratedEpisodes} />
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm py-6">
              No episodes have ratings yet.
            </div>
          )}
        </div>

        <Highlights episodes={episodes} />
        <CreatorsSection creators={creators} />
        <CastSection cast={cast} />

        {/* Synopsis */}
        {showOverview && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
            <p className="text-gray-800 text-sm leading-relaxed max-w-5xl mx-auto">
              {showOverview}
            </p>
          </div>
        )}

        <EpisodeList episodes={episodes} />
      </div>
    </div>
  );
}