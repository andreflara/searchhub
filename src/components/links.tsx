"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LinksGroup() {
  const [links, setLinks] = useState<
    {
      id: number;
      title: string;
      description: string;
      link: string;
      image: string;
    }[]
  >([]);

  const [newLink, setNewLink] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
  });

  const [showForm, setShowForm] = useState(false); // Estado para controlar a visibilidade do formulário

  // Carregar os links do localStorage ao montar o componente
  useEffect(() => {
    const storedLinks = localStorage.getItem("userLinks");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  // Salvar os links no localStorage sempre que forem alterados
  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem("userLinks", JSON.stringify(links));
    }
  }, [links]);

  const addLink = () => {
    if (!newLink.title || !newLink.link) {
      alert("Título e URL são obrigatórios!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...newLink,
    };

    const updatedLinks = [...links, newEntry];
    setLinks(updatedLinks);
    setNewLink({ title: "", description: "", link: "", image: "" });
    setShowForm(false); // Fecha o formulário após adicionar o link
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white py-6 min-h-screen relative">
      <div className="mx-auto w-full">
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="rounded-xl bg-black border border-gray-700 shadow-lg transition-shadow duration-300 overflow-hidden h-[250px]  flex flex-col">
                <div className="relative w-full h-40">
                  <Image
                    src={link.image || "/placeholder.png"}
                    alt={link.title}
                    className="object-cover w-full h-full"
                    width={600}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {link.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Botão flutuante para abrir/fechar o formulário */}
      <button
        type="button"
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Formulário flutuante */}
      <div
        className={`fixed bottom-16 right-6 bg-gray-800 p-6 rounded-lg shadow-xl transition-transform duration-300 ${
          showForm
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Link</h2>
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newLink.description}
          onChange={(e) =>
            setNewLink({ ...newLink, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newLink.link}
          onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL da Imagem (opcional)"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={newLink.image}
          onChange={(e) => setNewLink({ ...newLink, image: e.target.value })}
        />
        <button
          type="button"
          onClick={addLink}
          className="bg-primary text-white px-4 py-2 rounded w-full"
        >
          Adicionar Link
        </button>
      </div>
    </div>
  );
}
