import PersonPage from "@/app/personPage";

export default function PersonRoute({ params }: { params: { id: string } }) {
  return <PersonPage id={params.id} />;
}