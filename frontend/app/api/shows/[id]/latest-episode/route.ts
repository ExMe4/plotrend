import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // fetch show details (to get seasons)
  const showRes = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`,
    { next: { revalidate: 3600 } }
  );

  if (!showRes.ok) {
    return NextResponse.json({ error: "Failed to fetch show" }, { status: 500 });
  }

  const show = await showRes.json();
  const lastSeason = show.seasons?.[show.seasons.length - 1];
  if (!lastSeason) return NextResponse.json(null);

  // fetch last season details
  const seasonRes = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${lastSeason.season_number}?api_key=${process.env.TMDB_KEY}&language=en-US`,
    { next: { revalidate: 3600 } }
  );

  if (!seasonRes.ok) {
    return NextResponse.json({ error: "Failed to fetch season" }, { status: 500 });
  }

  const season = await seasonRes.json();
  const lastEpisode = season.episodes?.[season.episodes.length - 1];

  return NextResponse.json(lastEpisode || null);
}