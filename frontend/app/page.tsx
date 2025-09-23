"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPopularShows, getLatestEpisode } from "@/lib/api";

export default function Home() {
  const [popular, setPopular] = useState<any[]>([]);
  const [latestEpisodes, setLatestEpisodes] = useState<{ [id: number]: any }>({});

  useEffect(() => {
    async function loadData() {
      const pop = await getPopularShows();
      setPopular(pop);

      // fetch latest episode info for popular shows
      for (const show of pop) {
        const ep = await getLatestEpisode(show.id);
        setLatestEpisodes((prev) => ({ ...prev, [show.id]: ep }));
      }
    }

    window.scrollTo(0, 0);
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Popular */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Most Popular Shows</h2>
          <div className="grid gap-4">
            {popular.map((s) => {
              const ep = latestEpisodes[s.id];

              const startYear = s.first_air_date
                ? s.first_air_date.slice(0, 4)
                : null;

              return (
                <Link
                  key={s.id}
                  href={`/shows/${s.id}`}
                  className="flex items-center justify-between gap-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
                >
                  {/* Left side: show info */}
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

                  {/* Right side: latest episode */}
                  <div className="text-right text-sm text-gray-600">
                    {ep ? (
                      <>
                        <p className="font-medium text-gray-800">Latest episode:</p>
                        <p>{ep.name}</p>
                        <p>
                          {ep.air_date}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">No episode info</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
