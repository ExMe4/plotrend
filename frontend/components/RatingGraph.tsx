"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RatingGraph({ episodes }: { episodes: any[] }) {
  const data = episodes.map((ep, i) => ({
    name: `S${ep.seasonNumber}E${ep.episodeNumber}`,
    rating: ep.rating,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}