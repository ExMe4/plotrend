import PersonDetails from "@/components/PersonDetails";

export default async function PersonPage({ params }: { params: { id: string } }) {
  const { id } = params;

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
    "Documentary",
    "News",
    "Interview",
    "Golden Globe Awards",
    "Tony Awards",
    "The Oscars",
  ];

  const filteredShows =
    data.tv_credits?.cast
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