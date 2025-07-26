import NavBar from "@/components/NavBar";
import ShowDetails from "@/components/ShowDetails";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="max-w-6xl mx-auto p-6">
        <ShowDetails />
      </main>
    </div>
  );
}
