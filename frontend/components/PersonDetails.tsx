"use client";
import Image from "next/image";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import PersonRatingsGraph from "./PersonRatingsGraph";
import { useEffect } from "react";

export default function PersonDetails({ person }: { person: any }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!person) return <p className="p-6">Person not found.</p>;

  const validShows =
    person.shows?.filter(
      (show: any) => show.id && show.coverImageUrl && show.title
    ) ?? [];

  return (
    <div className="relative bg-white min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Image */}
          {person.profileImageUrl ? (
            <Image
              src={person.profileImageUrl}
              alt={person.name}
              width={200}
              height={300}
              className="rounded-lg shadow"
            />
          ) : (
            <Image
              src="/no-image.png"
              alt="No image"
              width={200}
              height={300}
              className="rounded-lg shadow"
            />
          )}

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{person.name}</h1>
            {person.knownFor && (
              <p className="text-gray-600 mb-4">{person.knownFor}</p>
            )}
            {person.biography && (
              <p className="text-gray-700 text-sm leading-relaxed max-w-2xl line-clamp-9">
                {person.biography}
              </p>
            )}
          </div>
        </div>

        {/* Shows Rating Graph */}
        <PersonRatingsGraph shows={validShows} />

        {/* Shows Carousel */}
        {validShows.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-left">Shows</h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                {validShows.map((show: any) => (
                  <Link
                    key={show.id}
                    href={`/shows/${show.id}`}
                    className="flex-shrink-0 w-36"
                  >
                    <Image
                      src={show.coverImageUrl || "/no-image.png"}
                      alt={show.title}
                      width={144}
                      height={216}
                      className="rounded-md shadow object-cover"
                    />
                    <p className="text-center text-sm mt-2 truncate">
                      {show.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <p className="mt-12 text-gray-500 italic">
            No relevant shows found for this person.
          </p>
        )}
      </div>
    </div>
  );
}