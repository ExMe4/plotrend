import ShowDetails from "@/components/ShowDetails";
import ShowExtras from "@/components/ShowExtras";
import {
  getTMDBShowDetails,
  getTMDBEpisodes,
  getTMDBCast,
  getTMDBCreators,
} from "@/lib/tmdb";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Params = { id: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const show = await getTMDBShowDetails(id);

  const title = show.title ?? "Show";
  const yearRange = show.startYear ? (show.endYear ? `${show.startYear}–${show.endYear}` : show.startYear) : "";
  const fullTitle = `${title} `;

  const image = show.backdropUrl ?? show.coverImageUrl ?? `${SITE_URL}/og-default.png`;
  const canonical = `${SITE_URL}/shows/${id}`;

  return {
    title: fullTitle,
    description: show.overview ?? `Ratings and episode trends for ${title}`,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: show.overview ?? "",
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} cover` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: show.overview ?? "",
      images: [image],
    },
  };
}

export default async function ShowPage(
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const show = await getTMDBShowDetails(id);

  // JSON-LD structured data for TVSeries
  const canonical = `${SITE_URL}/shows/${id}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.title,
    url: canonical,
    description: show.overview,
    image: show.backdropUrl ?? show.coverImageUrl,
    datePublished: show.startYear ? `${show.startYear}` : undefined,
    aggregateRating: show.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: show.rating,
          bestRating: "10",
          ratingCount: show.vote_count ?? undefined,
        }
      : undefined,
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* JSON-LD: server component can render Script */}
      <Script id="ld-tvseries" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Suspense fallback={<Spinner />}>
        <AsyncShowExtras id={id} show={show} />
      </Suspense>
    </div>
  );
}

async function AsyncShowExtras({ id, show }: { id: string; show: any }) {
  const [episodesRaw, castRaw, creatorsRaw] = await Promise.all([
    getTMDBEpisodes(id),
    getTMDBCast(id),
    getTMDBCreators(id),
  ]);

  const episodes = (episodesRaw ?? []).sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });

  const ratedEpisodes = episodes.filter((ep) => ep.rating);
  const averageRating =
    ratedEpisodes.length > 0
      ? (
          ratedEpisodes.reduce((sum, ep) => sum + ep.rating, 0) /
          ratedEpisodes.length
        ).toFixed(2)
      : "N/A";

  const cast = castRaw.map((c: any) => ({
    id: c.id,
    actorName: c.name,
    characterName: c.character,
    imageUrl: c.profileImageUrl,
  }));

  const creators = creatorsRaw.map((c: any) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.profileImageUrl,
    job: "Creator",
  }));

  return (
    <>
      <ShowDetails show={show} averageRating={averageRating} />
      <ShowExtras
        episodes={episodes}
        cast={cast}
        creators={creators}
        showOverview={show.overview}
      />
    </>
  );
}