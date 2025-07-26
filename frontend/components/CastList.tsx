"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getCast } from "@/lib/api";

export default function CastList({ showId }: { showId: string | number }) {
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCast(showId)
      .then((data) => setCast(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [showId]);

  if (loading) return <p>Loading cast...</p>;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Cast</h3>
      <div className="flex gap-4 flex-wrap">
        {cast.map((c, i) => (
          <div key={i} className="text-center">
            <Image
              src={c.image || "/placeholder-cast.jpg"}
              alt={c.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <p className="text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-gray-500">{c.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
