import PersonDetails from "@/components/PersonDetails";

export default function PersonPage({ id }: { id: string }) {
  return <PersonDetails id={id} />;
}