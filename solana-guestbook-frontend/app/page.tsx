"use client"
import AppBar from "./components/AppBar";
import Guestbook from "./components/Guestbook";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <Guestbook />
      </div>
    </main>
  );
}