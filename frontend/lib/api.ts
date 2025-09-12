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
