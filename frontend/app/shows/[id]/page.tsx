import ShowDetails from "@/components/ShowDetails";
import {
  getTMDBShowDetails,
  getTMDBEpisodes,
  getTMDBCast,
  getTMDBCreators,
} from "@/lib/tmdb";

export default async function ShowPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [show, episodesRaw, castRaw, creatorsRaw] = await Promise.all([
    getTMDBShowDetails(id),
    getTMDBEpisodes(id),
    getTMDBCast(id),
    getTMDBCreators(id),
  ]);

  const episodes = (episodesRaw ?? []).sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });

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
    <ShowDetails
      show={show}
      episodes={episodes}
      cast={cast}
      creators={creators}
    />
  );
}
