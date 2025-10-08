export async function getPopularShows() {
  const res = await fetch("/api/shows/popular");
  if (!res.ok) throw new Error("Failed to fetch popular shows");
  return res.json();
}

export async function getLatestEpisode(tvId: number) {
  const res = await fetch(`/api/shows/${tvId}/latest-episode`);
  if (!res.ok) throw new Error("Failed to fetch latest episode");
  return res.json();
}

export async function getShowDetails(id: string | number) {
  const res = await fetch(`/api/shows/${id}`);
  if (!res.ok) throw new Error("Failed to fetch show details");
  return res.json();
}

export async function getEpisodes(showId: string | number) {
  const res = await fetch(`/api/shows/${showId}/episodes`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

export async function getCast(showId: string | number) {
  const res = await fetch(`/api/shows/${showId}/cast`);
  if (!res.ok) throw new Error("Failed to fetch cast");
  return res.json();
}

export async function searchShows(query: string) {
  const res = await fetch(`/api/shows/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search shows");
  return res.json();
}

export async function getCreators(id: string) {
  const res = await fetch(`/api/shows/${id}/creators`);
  if (!res.ok) throw new Error("Failed to fetch creators");
  return res.json();
}

export async function getPersonDetails(id: string | number) {
  const res = await fetch(`/api/people/${id}`);
  if (!res.ok) throw new Error("Failed to fetch person details");
  return res.json();
}