import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.TMDB_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch creators" }, { status: 500 });
  }

  const data = await res.json();

  const creators = data.created_by?.map((c: any) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.profile_path
      ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
      : null,
  })) ?? [];

  return NextResponse.json(creators);
}