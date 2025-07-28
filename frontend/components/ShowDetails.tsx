"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getShowDetails } from "@/lib/api";

export default function ShowDetails() {
  const { slug } = useParams(); // Get slug from the URL
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getShowDetails(slug as string)
        .then((data) => setShow(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!show) return <p>Failed to load show data.</p>;

  return (
    <div>
      <h1>{show.title}</h1>
      {/* other components */}
    </div>
  );
}