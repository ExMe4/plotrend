"use client";
type Props = {
  view: "grid" | "graph";
  setView: (v: "grid" | "graph") => void;
};

export default function RatingToggle({ view, setView }: Props) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        className={`px-4 py-2 rounded-lg border transition cursor-pointer ${
          view === "grid"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800"
        }`}
        onClick={() => setView("grid")}
      >
        Grid
      </button>

      <span className="text-gray-400">|</span>

      <button
        className={`px-4 py-2 rounded-lg border transition cursor-pointer ${
          view === "graph"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800"
        }`}
        onClick={() => setView("graph")}
      >
        Graph
      </button>
    </div>
  );
}