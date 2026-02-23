const TMDB_API = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;
const IMG = "https://image.tmdb.org/t/p/original";

async function fetchTMDB(endpoint: string) {
  const url = `${TMDB_API}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=en-US`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("TMDB fetch failed:", url, res.status);
    throw new Error(`TMDB fetch failed: ${endpoint}`);
  }

  return res.json();
}

// SHOW DETAILS
export async function getTMDBShowDetails(id: string | number) {
  const show = await fetchTMDB(`/tv/${id}`);

  return {
    id: show.id,
    title: show.name,
    overview: show.overview,
    coverImageUrl: show.poster_path ? `${IMG}${show.poster_path}` : null,
    backdropUrl: show.backdrop_path ? `${IMG}${show.backdrop_path}` : null,
    rating: show.vote_average ? show.vote_average.toFixed(1) : null,
    popularity: show.popularity,
    vote_count: show.vote_count ?? null,
    startYear: show.first_air_date ? show.first_air_date.slice(0, 4) : null,
    endYear: show.last_air_date ? show.last_air_date.slice(0, 4) : null,
    status: show.status,
    episodeCount: show.number_of_episodes,
    runtime: show.episode_run_time?.[0] || null,
    networks: (show.networks || []).map((n: any) => ({
      id: n.id,
      name: n.name,
      logoUrl: n.logo_path ? `${IMG}${n.logo_path}` : null,
    })),
  };
}

// EPISODES
export async function getTMDBEpisodes(id: string | number) {
  const show = await fetchTMDB(`/tv/${id}`);

  const validSeasons = (show.seasons || []).filter(
    (s: any) => s.season_number > 0
  );

  const seasonPromises = validSeasons.map((s: any) =>
    fetchTMDB(`/tv/${id}/season/${s.season_number}`)
  );
  const seasons = await Promise.all(seasonPromises);

  const episodes = seasons.flatMap((s) =>
    (s.episodes || []).map((ep: any) => ({
      id: ep.id,
      title: ep.name,
      description: ep.overview,
      rating: ep.vote_average || null,
      airDate: ep.air_date || null,
      stillUrl: ep.still_path ? `${IMG}${ep.still_path}` : null,
      seasonNumber: s.season_number,
      episodeNumber: ep.episode_number,
    }))
  );

  // sort by season and episode number
  return episodes.sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber)
      return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });
}

// CAST
export async function getTMDBCast(id: string | number) {
  const data = await fetchTMDB(`/tv/${id}/credits`);
  return (data.cast || []).slice(0, 30).map((person: any) => ({
    id: person.id,
    name: person.name,
    character: person.character,
    profileImageUrl: person.profile_path ? `${IMG}${person.profile_path}` : null,
  }));
}

// CREATORS
export async function getTMDBCreators(id: string | number) {
  const show = await fetchTMDB(`/tv/${id}`);
  return (show.created_by || []).map((creator: any) => ({
    id: creator.id,
    name: creator.name,
    profileImageUrl: creator.profile_path ? `${IMG}${creator.profile_path}` : null,
  }));
}