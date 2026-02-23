import PopularShowsClient from "@/components/PopularShowsClient";

export const metadata = {
  title: "Plotrend",
  description: "Discover the most popular TV shows and episode ratings on Plotrend.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/` },
  openGraph: {
    title: "Plotrend — TV show ratings & trends",
    description: "Discover the most popular TV shows and episode ratings on Plotrend.",
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/og-popular.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/og-popular.png`],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">Most Popular Shows</h2>

          <PopularShowsClient />
        </section>
      </main>
    </div>
  );
}