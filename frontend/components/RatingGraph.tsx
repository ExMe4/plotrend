"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Season color palette
const seasonColors = [
  "#3b82f6", // blue
  "#f97316", // orange
  "#10b981", // emerald
  "#ef4444", // red
  "#22d3ee", // cyan
  "#a855f7", // purple
  "#14b8a6", // teal
];

export default function RatingGraph({ episodes }: { episodes: any[] }) {
  // Sort episodes
  const sorted = [...episodes].sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) {
      return a.seasonNumber - b.seasonNumber;
    }
    return a.episodeNumber - b.episodeNumber;
  });

  const seasonNumbers = [...new Set(sorted.map((ep) => ep.seasonNumber))];

  // Initialize data points
  const data = sorted.map((ep) => {
    const entry: any = {
      name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
      rating: ep.rating ?? null,
      season: ep.seasonNumber,
    };
    // Add season-specific rating key (e.g., season1, season2...)
    seasonNumbers.forEach((sNum, idx) => {
      const prevSeason = seasonNumbers[idx - 1];

      // Include episode if it belongs to the current season
      // OR if it's the first episode of the season (to connect lines)
      const isInSeason = ep.seasonNumber === sNum;
      const isFirstOfSeason =
        idx > 0 &&
        ep.seasonNumber === prevSeason &&
        sorted.findIndex((e) => e.seasonNumber === sNum) ===
          sorted.indexOf(ep) - 1;

      entry[`season${sNum}`] =
        isInSeason || isFirstOfSeason ? ep.rating ?? null : null;
    });

    return entry;
  });

  // X-axis labels
  const seasonLabels: { index: number; label: string }[] = [];
  seasonNumbers.forEach((season) => {
    const indices = data
      .map((d, i) => (d.season === season ? i : -1))
      .filter((i) => i !== -1);
    const mid = Math.floor((indices[0] + indices[indices.length - 1]) / 2);
    seasonLabels.push({ index: mid, label: `Season ${season}` });
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            tickFormatter={(_, index) => {
              const match = seasonLabels.find((l) => l.index === index);
              return match ? match.label : "";
            }}
            interval={0}
            angle={0}
            textAnchor="middle"
            height={40}
          />
          <YAxis domain={[0, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
          <Tooltip />

          {/* Main continuous line */}
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#ccc"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />

          {/* Colored overlays per season */}
          {seasonNumbers.map((seasonNum) => (
            <Line
              key={seasonNum}
              type="monotone"
              dataKey={`season${seasonNum}`}
              stroke={seasonColors[(seasonNum - 1) % seasonColors.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}