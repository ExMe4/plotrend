"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EpisodeTooltip from "./EpisodeTooltip";

// Season color palette
const seasonColors = [
  "#3b82f6", // blue
  "#f97316", // orange
  "#10b981", // emerald
  "#ef4444", // red
  "#22d3ee", // cyan
  "#a855f7", // purple
  "#14b8a6", // teal
  "#eab308", // amber
  "#ec4899", // pink
];

export default function RatingGraph({ episodes }: { episodes: any[] }) {
  if (!episodes?.length) return null;

  // Sort episodes
  const sorted = [...episodes].sort((a, b) =>
    a.seasonNumber !== b.seasonNumber
      ? a.seasonNumber - b.seasonNumber
      : a.episodeNumber - b.episodeNumber
  );

  const seasonNumbers = [...new Set(sorted.map((ep) => ep.seasonNumber))];

  // Prepare data
  const data = sorted.map((ep) => {
    const entry: any = {
      name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
      rating: ep.rating ?? null,
      season: ep.seasonNumber,
      title: ep.title,
      airDate: ep.airDate,
      seasonNumber: ep.seasonNumber,
      episodeNumber: ep.episodeNumber,
    };

    seasonNumbers.forEach((sNum) => {
      entry[`season${sNum}`] = ep.seasonNumber === sNum ? ep.rating ?? null : null;
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
    const label =
      seasonNumbers.length < 10
        ? `Season ${season}`
        : seasonNumbers.length <= 25
        ? `S${season}`
        : `${season}`;
    seasonLabels.push({ index: mid, label });
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1600px] h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* X-Axis */}
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
              label={{
                value: "Episode",
                position: "insideBottom",
                style: { fill: "#374151", fontSize: 14, fontWeight: 500 },
              }}
            />

            {/* Y-Axis */}
            <YAxis
              domain={[0, 10]}
              ticks={Array.from({ length: 21 }, (_, i) => i * 0.5)}
              tickFormatter={(val) => (Number.isInteger(val) ? val.toString() : "")}
              allowDecimals={true}
              label={{
                value: "Rating",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "#374151", fontSize: 14, fontWeight: 500 },
              }}
            />

            {/* Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const ep = payload[0].payload;
                  return <EpisodeTooltip ep={ep} />;
                }
                return null;
              }}
            />

            {/* One colored line per season + visible dots */}
            {seasonNumbers.map((seasonNum, idx) => (
              <Line
                key={seasonNum}
                type="monotone"
                dataKey={`season${seasonNum}`}
                stroke={seasonColors[idx % seasonColors.length]}
                strokeWidth={3}
                isAnimationActive={false}
                dot={{
                  r: 5,
                  stroke: seasonColors[idx % seasonColors.length],
                  fill: seasonColors[idx % seasonColors.length],
                  strokeWidth: 2,
                  cursor: "pointer",
                  onMouseEnter: (e: any) => {
                    e.target.setAttribute(
                      "fill",
                      seasonColors[idx % seasonColors.length]
                    );
                    e.target.setAttribute("r", "7");
                  },
                  onMouseLeave: (e: any) => {
                    e.target.setAttribute(
                      "fill",
                      seasonColors[idx % seasonColors.length]
                    );
                    e.target.setAttribute("r", "5");
                  },
                }}
                activeDot={{
                  r: 7,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}