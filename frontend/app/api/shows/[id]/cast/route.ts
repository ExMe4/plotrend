import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}/aggregate_credits?api_key=${process.env.TMDB_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch cast" }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json(
    data.cast?.slice(0, 12).map((c: any) => ({
      id: c.id,
      actorName: c.name,
      characterName: c.roles?.[0]?.character ?? "",
      imageUrl: c.profile_path
        ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
        : null,
    })) ?? []
  );
}
