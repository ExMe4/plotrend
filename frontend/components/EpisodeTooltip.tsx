"use client";

export default function EpisodeTooltip({ ep }: { ep: any }) {
  if (!ep) return null;

  return (
    <div className="bg-white p-2 border rounded shadow text-xs max-w-xs">
      <div className="font-semibold text-black">
        S{ep.seasonNumber}E{ep.episodeNumber}
      </div>
      <div className="text-sm text-gray-700">{ep.title}</div>
      <div className="text-xs text-gray-600">{ep.airDate}</div>
      <div className="mt-1 font-medium text-black">
        Rating: {ep.rating ?? "N/A"}
      </div>
    </div>
  );
}