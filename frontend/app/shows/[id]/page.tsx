import ShowDetails from "@/components/ShowDetails";
import ShowExtras from "@/components/ShowExtras";
import {
  getTMDBShowDetails,
  getTMDBEpisodes,
  getTMDBCast,
  getTMDBCreators,
} from "@/lib/tmdb";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

export default async function ShowPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const show = await getTMDBShowDetails(id);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Suspense fallback={<Spinner />}>
        <AsyncShowExtras id={id} show={show} />
      </Suspense>
    </div>
  );
}

async function AsyncShowExtras({ id, show }: { id: string; show: any }) {
  const [episodesRaw, castRaw, creatorsRaw] = await Promise.all([
    getTMDBEpisodes(id),
    getTMDBCast(id),
    getTMDBCreators(id),
  ]);

  const episodes = (episodesRaw ?? []).sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });

  const ratedEpisodes = episodes.filter((ep) => ep.rating);
  const averageRating =
    ratedEpisodes.length > 0
      ? (
          ratedEpisodes.reduce((sum, ep) => sum + ep.rating, 0) /
          ratedEpisodes.length
        ).toFixed(2)
      : "N/A";

  const cast = castRaw.map((c: any) => ({
    id: c.id,
    actorName: c.name,
    characterName: c.character,
    imageUrl: c.profileImageUrl,
  }));

  const creators = creatorsRaw.map((c: any) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.profileImageUrl,
    job: "Creator",
  }));

  return (
    <>
      <ShowDetails show={show} averageRating={averageRating} />
      <ShowExtras
        episodes={episodes}
        cast={cast}
        creators={creators}
        showOverview={show.overview}
      />
    </>
  );
}