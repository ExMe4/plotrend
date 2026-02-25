"use client";
import React, { useRef, useState } from "react";
import TooltipPortal from "./TooltipPortal";
import EpisodeTooltip from "./EpisodeTooltip";

function getRatingStyle(rating: number): React.CSSProperties {
  if (rating >= 9.8) {
    // Purple gradient: 9.8 = bright, 10 = dark
    const percent = (rating - 9.8) / 0.2;
    const purple = Math.floor(255 - percent * 55);
    return {
      backgroundColor: `rgb(${purple}, ${purple * 0.6}, 255)`,
      boxShadow: "0 0 6px rgba(150, 0, 255, 0.4)",
      color: "#fff",
    };
  }

  if (rating >= 8.0) {
    // Green gradient: 8.0 = bright, 9.7 = dark
    const percent = (rating - 8.0) / (9.7 - 8.0);
    const green = Math.floor(255 - percent * 75);
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
  const green = Math.floor(50 + percent * 50);
  const red = Math.floor(200 + percent * 55);
  return { backgroundColor: `rgb(${red}, ${green}, ${green / 2})`, color: "#fff" };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function EpisodeCell({ ep }: { ep: any }) {
  const [hovered, setHovered] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null);

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("scrollToEpisode", {
        detail: {
          seasonNumber: ep.seasonNumber,
          episodeNumber: ep.episodeNumber,
        },
      })
    );
  };

  return (
    <td
      ref={cellRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={getRatingStyle(ep.rating ?? 0)}
      className="w-12 h-12 text-xs font-bold text-center align-middle rounded relative cursor-pointer"
    >
      {ep.rating?.toFixed(1) ?? "N/A"}

      {hovered && (
        <TooltipPortal targetRef={cellRef}>
          <EpisodeTooltip ep={ep} />
        </TooltipPortal>
      )}
    </td>
  );
}

export default function EpisodeGrid({ episodes }: { episodes: any[] }) {
  const seasons: { [season: number]: any[] } = {};
  for (const ep of episodes) {
    if (!seasons[ep.seasonNumber]) seasons[ep.seasonNumber] = [];
    seasons[ep.seasonNumber].push(ep);
  }

  let maxCols = 0;
  const chunkedSeasons: { [season: number]: any[][] } = {};
  for (const [seasonNumber, eps] of Object.entries(seasons)) {
    const chunks = chunkArray(eps, 32);
    chunkedSeasons[Number(seasonNumber)] = chunks;
    for (const chunk of chunks) {
      if (chunk.length > maxCols) maxCols = chunk.length;
    }
  }

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <table className="table-fixed border-separate border-spacing-1 mx-auto">
        <thead>
          <tr>
            <th className="w-16"></th>
            {Array.from({ length: maxCols }).map((_, i) => (
              <th key={i} className="text-xs text-center w-12 p-1">
                Ep {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(chunkedSeasons).map(([seasonNumber, chunks]) =>
            chunks.map((chunk, rowIndex) => (
              <tr key={`${seasonNumber}-${rowIndex}`}>
                {rowIndex === 0 && (
                  <td
                    rowSpan={chunks.length}
                    className="text-right pr-2 font-semibold text-sm align-middle"
                  >
                    S{seasonNumber}
                  </td>
                )}
                {Array.from({ length: maxCols }).map((_, i) => {
                  const ep = chunk[i];
                  if (!ep) return <td key={i} className="w-12 h-12"></td>;

                  return <EpisodeCell key={ep.id} ep={ep} />;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}