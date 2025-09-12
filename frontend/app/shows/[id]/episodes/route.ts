import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const showRes = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.TMDB_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!showRes.ok) {
    return NextResponse.json({ error: "Failed to fetch show seasons" }, { status: 500 });
  }

  const showData = await showRes.json();
  const totalSeasons = showData.number_of_seasons;

  const allEpisodes: any[] = [];

  for (let season = 1; season <= totalSeasons; season++) {
    const seasonRes = await fetch(
      `https://api.themoviedb.org/3/tv/${params.id}/season/${season}?api_key=${process.env.TMDB_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (seasonRes.ok) {
      const seasonData = await seasonRes.json();
      const episodes = seasonData.episodes.map((ep: any) => ({
        id: ep.id,
        seasonNumber: season,
        episodeNumber: ep.episode_number,
        title: ep.name,
        description: ep.overview,
        airDate: ep.air_date,
        rating: ep.vote_average || null,
      }));
      allEpisodes.push(...episodes);
    }
  }

  return NextResponse.json(allEpisodes);
}
