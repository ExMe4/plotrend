export default function EpisodeGrid() {
  const episodes = [
    { title: "Pilot", rating: 9.0 },
    { title: "Cat's in the Bag...", rating: 8.7 },
    { title: "...And the Bag's in the River", rating: 8.8 },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {episodes.map((ep, i) => (
        <div
          key={i}
          className="bg-white p-4 shadow rounded-lg text-center border"
        >
          <h3 className="font-semibold text-sm">{ep.title}</h3>
          <p className="text-blue-500 text-lg">{ep.rating}</p>
        </div>
      ))}
    </div>
  );
}
