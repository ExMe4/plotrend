"use client";

import Image from "next/image";

export default function ShowTooltip({ show }: { show: any }) {
  if (!show) return null;

  return (
    <div className="bg-white p-2 border rounded shadow text-xs max-w-xs">
      <div className="flex items-center gap-2">
        {show.coverImageUrl && (
          <Image
            src={show.coverImageUrl}
            alt={show.title}
            width={40}
            height={60}
            className="rounded"
          />
        )}
        <div>
          <div className="font-semibold text-black">{show.title}</div>
          {show.year && (
            <div className="text-xs text-gray-600">{show.year}</div>
          )}
          <div className="mt-1 font-medium text-black">
            Rating: {show.rating ?? "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}