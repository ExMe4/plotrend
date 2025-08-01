"use client";
import React from "react";

function getRatingStyle(rating: number): React.CSSProperties {
  if (rating >= 9.8) {
    // Purple gradient: 9.8 = bright, 10 = dark
    const percent = (rating - 9.8) / 0.2;
    const purple = Math.floor(255 - percent * 55); // 255 → 200
    return {
      backgroundColor: `rgb(${purple}, ${purple * 0.6}, 255)`,
      boxShadow: "0 0 6px rgba(150, 0, 255, 0.4)",
      color: "#fff",
    };
  }

  if (rating >= 8.0) {
    // Green gradient: 8.0 = bright, 9.7 = dark
    const percent = (rating - 8.0) / (9.7 - 8.0);
    const green = Math.floor(255 - percent * 75); // 255 → 180
    return {
      backgroundColor: `rgb(0, ${green}, 100)`,
      color: "#fff",
    };
  }

  if (rating >= 5.0) {
    // Yellow gradient: 5.0 = dark, 7.9 = bright
    const percent = (rating - 5.0) / (7.9 - 5.0); // 0 at 5.0, 1 at 7.9
    const green = Math.floor(160 + percent * 70); // 160 → 230
    return {
      backgroundColor: `rgb(255, ${green}, 0)`,
      color: "#fff",
    };
  }

  // Red gradient: 0 = dark, 4.9 = bright
  const percent = rating / 4.9;
  const green = Math.floor(50 + percent * 50); // 50 → 100
  const red = Math.floor(200 + percent * 55);  // 200 → 255
  return {
    backgroundColor: `rgb(${red}, ${green}, ${green / 2})`,
    color: "#fff",
  };
}

export default function EpisodeGrid({ episodes }: { episodes: any[] }) {
  const seasons: { [season: number]: any[] } = {};
  for (const ep of episodes) {
    if (!seasons[ep.seasonNumber]) seasons[ep.seasonNumber] = [];
    seasons[ep.seasonNumber].push(ep);
  }

  const maxEpisodes = Math.max(...Object.values(seasons).map((eps) => eps.length));

  return (
    <div className="overflow-auto">
      <table className="table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-16"></th>
            {Array.from({ length: maxEpisodes }).map((_, i) => (
              <th key={i} className="text-xs text-center w-12 p-1">
                Ep {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(seasons).map(([seasonNumber, eps]) => (
            <tr key={seasonNumber}>
              <td className="text-right pr-2 font-semibold text-sm">S{seasonNumber}</td>
              {Array.from({ length: maxEpisodes }).map((_, i) => {
                const ep = eps[i];
                if (!ep) {
                  return <td key={i} className="w-12 h-12"></td>;
                }
                return (
                  <td
                    key={ep.id}
                    style={getRatingStyle(ep.rating ?? 0)}
                    className="w-12 h-12 text-xs font-bold text-center align-middle rounded"
                  >
                    {ep.rating?.toFixed(1) ?? "N/A"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}