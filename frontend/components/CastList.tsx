import Image from "next/image";

export default function CastList() {
  const cast = [
    { name: "Bryan Cranston", character: "Walter White" },
    { name: "Aaron Paul", character: "Jesse Pinkman" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Cast</h3>
      <div className="flex gap-4">
        {cast.map((c, i) => (
          <div key={i} className="text-center">
            <Image
              src="/placeholder-cast.jpg"
              alt={c.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <p className="text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-gray-500">{c.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
