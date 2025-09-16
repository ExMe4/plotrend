import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_KEY}&append_to_response=aggregate_credits`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch show" }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json({
    id: data.id,
    title: data.name,
    overview: data.overview,
    coverImageUrl: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : null,
    startYear: data.first_air_date?.split("-")[0] ?? null,
    endYear: data.status === "Ended" ? data.last_air_date?.split("-")[0] : null,
    rating: data.vote_average ? data.vote_average.toFixed(1) : null,
  });
}
