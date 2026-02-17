import PersonDetails from "@/components/PersonDetails";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Params = { id: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}&append_to_response=tv_credits`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    return {
      title: "Person",
      description: "Person profile",
      alternates: {
        canonical: `${SITE_URL}/people/${id}`,
      },
    };
  }

  const data = await res.json();
  const name = data.name ?? "Person";

  const canonical = `${SITE_URL}/people/${id}`;

  return {
    title: name,
    description: data.biography
      ? data.biography.slice(0, 160)
      : `${name} — filmography and ratings.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: name,
      description: data.biography
        ? data.biography.slice(0, 160)
        : `${name} — filmography and ratings.`,
      url: canonical,
      siteName: "Plotrend",
      type: "profile",
      images: data.profile_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w500${data.profile_path}`,
              width: 500,
              height: 750,
              alt: name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: data.biography
        ? data.biography.slice(0, 160)
        : `${name} — filmography and ratings.`,
      images: data.profile_path
        ? [`https://image.tmdb.org/t/p/w500${data.profile_path}`]
        : [],
    },
  };
}

export default async function PersonPage(
  { params }: { params: Promise<{ id: string }> }
) {
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
    "Larry Sanders",
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

  // JSON-LD for Person
  const canonical = `${SITE_URL}/people/${id}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: canonical,
    image: person.profileImageUrl,
    description: person.biography ? (person.biography.slice(0, 280) || undefined) : undefined,
  };

  return (
    <>
      <Script id="ld-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PersonDetails person={person} />
    </>
  );
}