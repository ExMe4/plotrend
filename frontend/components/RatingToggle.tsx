"use client";
import { useState } from "react";

export default function RatingToggle() {
  const [view, setView] = useState<"grid" | "graph">("grid");

  return (
    <div className="flex gap-4 items-center">
      <button
        className={`px-4 py-2 rounded-lg border ${view === "grid" ? "bg-blue-500 text-white" : "bg-white"}`}
        onClick={() => setView("grid")}
      >
        Grid
      </button>
      <button
        className={`px-4 py-2 rounded-lg border ${view === "graph" ? "bg-blue-500 text-white" : "bg-white"}`}
        onClick={() => setView("graph")}
      >
        Graph
      </button>
    </div>
  );
}