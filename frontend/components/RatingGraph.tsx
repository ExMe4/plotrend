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

function computeTrendLine(episodes: any[]) {
  const valid = episodes
    .map((ep, i) => ({ x: i + 1, y: ep.rating }))
    .filter((p) => typeof p.y === "number" && !isNaN(p.y));

  if (valid.length < 2) return { slope: 0, intercept: valid[0]?.y ?? 0 };

  const n = valid.length;
  const sumX = valid.reduce((acc, p) => acc + p.x, 0);
  const sumY = valid.reduce((acc, p) => acc + p.y, 0);
  const sumXY = valid.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = valid.reduce((acc, p) => acc + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export default function RatingGraph({ episodes }: { episodes: any[] }) {
  if (!episodes?.length) return null;

  // Sort episodes
  const sorted = [...episodes].sort((a, b) =>
    a.seasonNumber !== b.seasonNumber
      ? a.seasonNumber - b.seasonNumber
      : a.episodeNumber - b.episodeNumber
  );

  const seasonNumbers = [...new Set(sorted.map((ep) => ep.seasonNumber))];
  const { slope, intercept } = computeTrendLine(sorted);

  const handleDotClick = (ep: any) => {
    window.dispatchEvent(
      new CustomEvent("scrollToEpisode", {
        detail: {
          seasonNumber: ep.seasonNumber,
          episodeNumber: ep.episodeNumber,
        },
      })
    );
  };

    // Prepare data
  const data = sorted.map((ep, idx) => {
    const entry: any = {
      index: idx + 1,
      name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
      rating: ep.rating ?? null,
      trend: intercept + slope * (idx + 1),
      season: ep.seasonNumber,
      title: ep.title,
      airDate: ep.airDate,
      seasonNumber: ep.seasonNumber,
      episodeNumber: ep.episodeNumber,
    };

    seasonNumbers.forEach((sNum) => {
      entry[`season${sNum}`] =
        ep.seasonNumber === sNum ? ep.rating ?? null : null;
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
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10}}
          >
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

            {/* Trend line */}
            <Line
              type="linear"
              dataKey="trend"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
              activeDot={false}
            />

            {/* Season lines */}
            {seasonNumbers.map((seasonNum, idx) => (
              <Line
                key={seasonNum}
                type="monotone"
                dataKey={`season${seasonNum}`}
                stroke={seasonColors[idx % seasonColors.length]}
                strokeWidth={3}
                isAnimationActive={false}
                strokeOpacity={1}
                style={{ pointerEvents: "none" }}
                dot={(props: any) => {
                  const { cx, cy, payload, index, value } = props;

                  if (value == null) return null;

                  return (
                    <circle
                      key={`dot-${seasonNum}-${index}`}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={seasonColors[idx % seasonColors.length]}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ cursor: "pointer", pointerEvents: "all" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDotClick(payload);
                      }}
                    />
                  );
                }}
                activeDot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}