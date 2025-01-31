"use client";
import Card from "@/components/clock";
import type React from "react";
import LinksGroup from "@/components/links";
import { useState } from "react";

export default function Projects() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-6 min-h-screen">
      <div className="w-full p-5 rounded-lg font-mono">
        <div className="flex items-center justify-between space-x-4">
          <input
            className="text-lg flex items-center justify-between bg-black text-white border border-gray-800 shadow-lg shadow-black/70 rounded-lg px-4 py-2 w-full"
            placeholder="Pesquisar..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <div className="text-white text-lg">
            <Card />
          </div>
        </div>
        <LinksGroup />
      </div>
     
    </div>
  );
}
