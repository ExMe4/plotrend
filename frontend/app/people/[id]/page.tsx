import PersonDetails from "@/components/PersonDetails";

export default function PersonPage({ params }: { params: { id: string } }) {
  return <PersonDetails id={params.id} />;
}