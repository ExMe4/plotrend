"use client";
import Image from "next/image";
import Link from "next/link";

interface CastMember {
  id: string;
  actorName: string;
  characterName?: string;
  imageUrl?: string;
}

export default function CastSection({ cast }: { cast: CastMember[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-left">Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cast.map((c) => (
          <Link
            key={c.id}
            href={`/people/${c.id}`}
            className="text-center hover:opacity-80 transition"
          >
            {c.imageUrl ? (
              <Image
                src={c.imageUrl}
                alt={c.actorName}
                width={120}
                height={160}
                className="mx-auto rounded-md shadow"
              />
            ) : (
              <Image
                src="/no-image.png"
                alt="No image"
                width={120}
                height={160}
                className="mx-auto rounded-md shadow"
              />
            )}
            <p className="font-semibold mt-2">{c.actorName}</p>
            {c.characterName && (
              <p className="text-sm text-gray-500">{c.characterName}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}