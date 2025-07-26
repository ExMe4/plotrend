import Image from "next/image";
import RatingToggle from "./RatingToggle.tsx";
import EpisodeGrid from "./EpisodeGrid";
import CastList from "./CastList";
import EpisodeTable from "./EpisodeTable";

export default function ShowDetails() {
  return (
    <div className="space-y-10">
      {/* Show header */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Image
          src="/placeholder-cover.jpg"
          alt="Show Cover"
          width={200}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold">Breaking Bad</h2>
          <p className="text-gray-600">2008 – 2013</p>
          <p className="text-lg font-semibold mt-2">IMDb Rating: 9.5</p>
        </div>
      </div>

      {/* Grid/Graph Toggle */}
      <RatingToggle />

      {/* Episode Grid (default view) */}
      <EpisodeGrid />

      {/* Cast */}
      <CastList />

      {/* Episodes Table */}
      <EpisodeTable />
    </div>
  );
}
