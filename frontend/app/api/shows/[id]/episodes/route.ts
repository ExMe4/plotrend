import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Fetch all seasons first
  const showRes = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.TMDB_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!showRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch show details" },
      { status: 500 }
    );
  }

  const show = await showRes.json();

  // Filter out season 0 (specials)
  const validSeasons = show.seasons.filter((s: any) => s.season_number > 0);

  // For each valid season, fetch its episodes
  const seasonRequests = validSeasons.map((s: any) =>
    fetch(
      `https://api.themoviedb.org/3/tv/${params.id}/season/${s.season_number}?api_key=${process.env.TMDB_KEY}`,
      { next: { revalidate: 86400 } }
    ).then((res) => res.json())
  );

  const seasonData = await Promise.all(seasonRequests);

  // Flatten all episodes
  const episodes = seasonData.flatMap((season) =>
    season.episodes.map((ep: any) => ({
      id: ep.id,
      seasonNumber: season.season_number,
      episodeNumber: ep.episode_number,
      title: ep.name,
      description: ep.overview,
      airDate: ep.air_date,
      rating: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : null,
    }))
  );

  return NextResponse.json(episodes);
}
