import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } } // cache 1h
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch popular shows" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data.results.slice(0, 10)); // only top 10
}