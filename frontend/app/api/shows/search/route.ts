import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_KEY}&query=${encodeURIComponent(q)}`,
    { next: { revalidate: 86400 } } // cache 1 day
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to search shows" }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json(
    data.results.map((s: any) => ({
      id: s.id,
      title: s.name,
      coverImageUrl: s.poster_path
        ? `https://image.tmdb.org/t/p/w185${s.poster_path}`
        : null,
    }))
  );
}
