"use client";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ShowTooltip from "./ShowTooltip";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function PersonRatingsGraph({ shows }: { shows: any[] }) {
  const router = useRouter();

  if (!shows?.length) return null;

  // Sort chronologically by first_air_date if available, fallback by title
  const sorted = [...shows].sort((a, b) => {
    const dateA = a.first_air_date ? new Date(a.first_air_date).getTime() : 0;
    const dateB = b.first_air_date ? new Date(b.first_air_date).getTime() : 0;
    if (dateA && dateB) return dateA - dateB;
    return a.title.localeCompare(b.title);
  });

  const data = sorted.map((s) => ({
    id: s.id,
    title: s.title,
    rating: s.rating ?? null,
    year: s.first_air_date ? new Date(s.first_air_date).getFullYear() : null,
    coverImageUrl: s.coverImageUrl,
  }));

  const handleDotClick = useCallback(
    (dotData: any, e: any) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (dotData?.id) {
        router.push(`/shows/${dotData.id}`);
      }
    },
    [router]
  );

  return (
    <div className="w-full flex justify-center mt-10 select-none">
      <div className="w-[1000px] h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10}} >
            <XAxis
              dataKey="year"
              name="Year"
              domain={["auto", "auto"]}
              tickFormatter={(v) => (v ? v.toString() : "")}
              label={{
                value: "Year",
                position: "insideBottom",
                offset: -5,
                style: { fill: "#374151", fontSize: 14, fontWeight: 500 },
              }}
            />
            <YAxis
              dataKey="rating"
              name="Rating"
              domain={[0, 10]}
              ticks={[...Array(11).keys()]}
              label={{
                value: "Rating",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#374151", fontSize: 14, fontWeight: 500 },
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const show = payload[0].payload;
                  return <ShowTooltip show={show} />;
                }
                return null;
              }}
            />

            <Scatter
              data={data}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={1}
             shape={(props) => {
               const {
                 payload,
                 tooltipPayload,
                 tooltipPosition,
                 cx,
                 cy,
                 coverImageUrl,
                 title,
                 id,
                 rating,
                 year,
                 ...svgProps
               } = props;

               return (
                 <circle
                   cx={cx}
                   cy={cy}
                   {...svgProps}
                   r={6}
                   fill="#3b82f6"
                   stroke="#1d4ed8"
                   strokeWidth={1}
                   style={{
                     cursor: "pointer",
                     transition: "all 0.15s ease",
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.setAttribute("fill", "#2563eb");
                     e.currentTarget.setAttribute("r", "8");
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.setAttribute("fill", "#3b82f6");
                     e.currentTarget.setAttribute("r", "6");
                   }}
                   onClick={(e) => handleDotClick(payload, e)}
                   tabIndex={-1}
                 />
               );
             }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}