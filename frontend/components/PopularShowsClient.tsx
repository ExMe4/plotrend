"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPopularShows, getLatestEpisode } from "@/lib/api";

export default function PopularShowsClient() {
  const [popular, setPopular] = useState([]);
  const [latestEpisodes, setLatestEpisodes] = useState({});

  useEffect(() => {
    async function loadData() {
      const pop = await getPopularShows();
      setPopular(pop);

      for (const show of pop) {
        const ep = await getLatestEpisode(show.id);
        setLatestEpisodes((prev) => ({ ...prev, [show.id]: ep }));
      }
    }

    loadData();
  }, []);

  return (
    <div className="grid gap-4">
      {popular.map((s) => {
        const ep = latestEpisodes[s.id];

        const startYear =
          s.first_air_date ? s.first_air_date.slice(0, 4) : null;

        return (
          <Link
            key={s.id}
            href={`/shows/${s.id}`}
            className="flex items-center justify-between gap-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {s.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w200${s.poster_path}`}
                  alt={s.name}
                  width={64}
                  height={96}
                  className="rounded object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{s.name}</h3>
                <p className="text-sm text-gray-600">
                  ⭐ {s.vote_average.toFixed(1)} ·{" "}
                  {startYear ? `${startYear}` : "N/A"}
                </p>
              </div>
            </div>

            <div className="text-right text-sm text-gray-600">
              {ep ? (
                <>
                  <p className="font-medium text-gray-800">Latest episode:</p>
                  <p>{ep.name}</p>
                  <p>{ep.air_date}</p>
                </>
              ) : (
                <p className="text-gray-500">No episode info</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}