"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import RatingToggle from "./RatingToggle";
import EpisodeGrid from "./EpisodeGrid";
import CastList from "./CastList";
import EpisodeTable from "./EpisodeTable";
import { getShowDetails } from "@/lib/api";

export default function ShowDetails() {
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShowDetails("breaking-bad") // example
      .then((data) => setShow(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!show) return <p>Failed to load show data.</p>;

  return (
    <div className="space-y-10">
      {/* Show header */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Image
          src={show.coverImage || "/placeholder-cover.jpg"}
          alt={show.title}
          width={200}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold">{show.title}</h2>
          <p className="text-gray-600">
            {show.startYear} – {show.endYear}
          </p>
          <p className="text-lg font-semibold mt-2">
            IMDb Rating: {show.rating}
          </p>
        </div>
      </div>

      <RatingToggle />

      {/* Pass episodes and cast */}
      <EpisodeGrid episodes={show.episodes} />
      <CastList cast={show.cast} />
      <EpisodeTable episodes={show.episodes} />
    </div>
  );
}
