"use client";
import Image from "next/image";
import Link from "next/link";

interface Creator {
  id: string;
  name: string;
  imageUrl?: string;
  job?: string;
}

export default function CreatorsSection({ creators }: { creators: Creator[] }) {
  if (!creators || creators.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-left">Created by</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {creators.map((c) => (
          <Link
            key={c.id}
            href={`/people/${c.id}`}
            className="text-center w-40 hover:opacity-80 transition"
          >
            {c.imageUrl ? (
              <Image
                src={c.imageUrl}
                alt={c.name}
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
            <p className="font-semibold mt-2">{c.name}</p>
            {c.job && <p className="text-sm text-gray-500">{c.job}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}