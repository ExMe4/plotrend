import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}&append_to_response=tv_credits`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch person" }, { status: 500 });

  const data = await res.json();

  const shows =
    data.tv_credits?.cast
      ?.map((s: any) => ({
        id: s.id,
        title: s.name,
        popularity: s.popularity,
        coverImageUrl: s.poster_path
          ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
          : null,
      }))
      ?.sort((a: any, b: any) => b.popularity - a.popularity) ?? [];

  return NextResponse.json({
    id: data.id,
    name: data.name,
    biography: data.biography || null,
    profileImageUrl: data.profile_path
      ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
      : null,
    knownFor: data.known_for_department,
    shows,
  });
}