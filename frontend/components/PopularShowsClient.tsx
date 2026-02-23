"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPopularShows, getLatestEpisode } from "@/lib/api";

type Show = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string | null;
};

type Episode = {
  id: number;
  name: string;
  air_date: string | null;
};

export default function PopularShowsClient() {
  const [popular, setPopular] = useState<Show[]>([]);
  const [latestEpisodes, setLatestEpisodes] = useState<
    Record<number, Episode | undefined>
  >({});

  useEffect(() => {
    async function loadData() {
      const pop: Show[] = await getPopularShows();
      setPopular(pop);

      const episodes = await Promise.all(
        pop.map((show) => getLatestEpisode(show.id))
      );

      const latestMap: Record<number, Episode | undefined> = {};
      pop.forEach((show, i) => {
        latestMap[show.id] = episodes[i];
      });

      setLatestEpisodes(latestMap);
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