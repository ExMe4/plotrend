export default function EpisodeTable() {
  const episodes = [
    { title: "Pilot", airDate: "2008-01-20", description: "Walter starts cooking meth." },
    { title: "Cat's in the Bag...", airDate: "2008-01-27", description: "Disposing of bodies." },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Episodes</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Air Date</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((ep, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{ep.title}</td>
              <td className="p-2 border">{ep.airDate}</td>
              <td className="p-2 border">{ep.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
