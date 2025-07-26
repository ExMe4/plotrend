export async function getAllShows() {
  const res = await fetch("http://localhost:8080/api/shows");
  if (!res.ok) throw new Error("Failed to fetch shows");
  return res.json();
}

export async function getShowDetails(id: string | number) {
  const res = await fetch(`http://localhost:8080/api/shows/${id}`);
  if (!res.ok) throw new Error("Failed to fetch show details");
  return res.json();
}

export async function getEpisodes(showId: string | number) {
  const res = await fetch(`http://localhost:8080/api/shows/${showId}/episodes`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

export async function getCast(showId: string | number) {
  const res = await fetch(`http://localhost:8080/api/shows/${showId}/cast`);
  if (!res.ok) throw new Error("Failed to fetch cast");
  return res.json();
}
