import ShowDetails from "@/components/ShowDetails";

export default function ShowPage({ params }: { params: { id: string } }) {
  return <ShowDetails id={params.id} />;
}
