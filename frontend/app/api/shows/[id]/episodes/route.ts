import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.TMDB_KEY}&append_to_response=episodes`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
  }

  const data = await res.json();

  // TMDB episodes are grouped by seasons
  const episodes = data.seasons?.flatMap((season: any) =>
    (season.episodes || []).map((ep: any) => ({
      id: ep.id,
      title: ep.name,
      description: ep.overview,
      rating: ep.vote_average || null,
      seasonNumber: ep.season_number,
      episodeNumber: ep.episode_number,
      airDate: ep.air_date,
    }))
  );

  return NextResponse.json(episodes || []);
}
