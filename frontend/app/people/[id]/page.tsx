import PersonDetails from "@/components/PersonDetails";

export default async function PersonPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}&append_to_response=tv_credits`,
    { next: { revalidate: 86400 } } // 24h cache
  );

  if (!res.ok) {
    throw new Error("Failed to fetch person data");
  }

  const data = await res.json();

  // Filter out irrelevant shows
  const excludedKeywords = [
    "Tonight Show",
    "Late Show",
    "Late Night",
    "Jimmy Kimmel",
    "Stephen Colbert",
    "Conan",
    "Golden Globe Awards",
    "The Emmy Awards",
    "Tony Awards",
    "The Oscars",
    "Kids' Choice Awards",
    "MTV Movie & TV Awards",
  ];

  const uniqueShowsMap = new Map();

  data.tv_credits?.cast?.forEach((s: any) => {
    if (!uniqueShowsMap.has(s.id)) {
      uniqueShowsMap.set(s.id, s);
    }
  });

  const uniqueShows = Array.from(uniqueShowsMap.values());

  const filteredShows =
    uniqueShows
      ?.filter((s: any) => {
        const title = (s.name || "").toLowerCase();
        const hasExcludedWord = excludedKeywords.some((word) =>
          title.includes(word.toLowerCase())
        );

        const hasExcludedGenre =
          s.genre_ids?.some((g: number) => [99, 10763, 10767].includes(g)) ?? false;

        return !hasExcludedWord && !hasExcludedGenre;
      })
      ?.map((s: any) => ({
        id: s.id,
          title: s.name,
          popularity: s.popularity,
          rating: s.vote_average ?? null,
          first_air_date: s.first_air_date ?? null,
          coverImageUrl: s.poster_path
          ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
          : null,
      }))
      ?.sort((a: any, b: any) => b.popularity - a.popularity) ?? [];

  const person = {
    id: data.id,
    name: data.name,
    biography: data.biography || null,
    profileImageUrl: data.profile_path
      ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
      : null,
    knownFor: data.known_for_department,
    shows: filteredShows,
  };

  return <PersonDetails person={person} />;
}