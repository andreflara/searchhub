"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Plus, X, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Definindo o tipo do Link
type LinkType = {
  id: number | null;
  title: string;
  description: string;
  link: string;
  image: string;
};

export default function LinksGroup() {
  // Definindo o estado de links com o tipo LinkType[]
  const [links, setLinks] = useState<LinkType[]>([]);

  // Definindo o estado do link atual com o tipo LinkType
  const [currentLink, setCurrentLink] = useState<LinkType>({
    id: null,
    title: "",
    description: "",
    link: "",
    image: "",
  });

  const [showForm, setShowForm] = useState(false);

  // Carregando os links do localStorage
  useEffect(() => {
    const storedLinks = localStorage.getItem("userLinks");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  // Salvando os links no localStorage
  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem("userLinks", JSON.stringify(links));
    }
  }, [links]);

  // Função para salvar ou editar o link
  const handleSave = () => {
    if (!currentLink.title || !currentLink.link) {
      alert("Título e URL são obrigatórios!");
      return;
    }

    if (currentLink.id !== null) {
      // Editando link existente
      setLinks(
        links.map((link) => (link.id === currentLink.id ? currentLink : link))
      );
    } else {
      // Adicionando um novo link
      setLinks([...links, { ...currentLink, id: Date.now() }]);
    }

    setCurrentLink({
      id: null,
      title: "",
      description: "",
      link: "",
      image: "",
    });
    setShowForm(false);
  };

  // Função para editar um link
  const handleEdit = (link: LinkType) => {
    setCurrentLink(link);
    setShowForm(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white py-6 min-h-screen relative">
      <div className="mx-auto w-full">
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {links.map((link) => (
            <div key={link.id} className="relative group">
              <Link
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="rounded-xl bg-black border border-gray-700 shadow-lg transition-shadow duration-300 overflow-hidden h-[250px] flex flex-col">
                  <div className="relative w-full h-40">
                    <Image
                      src={link.image || "/placeholder.png"}
                      alt={link.title}
                      className="object-cover mx-auto"
                      width={200}
                      height={200}
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
              {/* O botão agora só aparecerá quando o mouse estiver sobre o link */}
              <button
                type="button"
                onClick={() => handleEdit(link)}
                className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full hover:bg-gray-600 transition opacity-0 group-hover:opacity-100"
              >
                <Edit className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      <div
        className={`fixed bottom-16 right-6 bg-gray-800 p-6 rounded-lg shadow-xl transition-transform duration-300 ${
          showForm
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {currentLink.id ? "Editar Link" : "Adicionar Novo Link"}
        </h2>
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={currentLink.title}
          onChange={(e) =>
            setCurrentLink({ ...currentLink, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Descrição"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={currentLink.description}
          onChange={(e) =>
            setCurrentLink({ ...currentLink, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={currentLink.link}
          onChange={(e) =>
            setCurrentLink({ ...currentLink, link: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL da Imagem (opcional)"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={currentLink.image}
          onChange={(e) =>
            setCurrentLink({ ...currentLink, image: e.target.value })
          }
        />
        <button
          type="button"
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded w-full"
        >
          {currentLink.id ? "Salvar Alterações" : "Adicionar Link"}
        </button>
      </div>
    </div>
  );
}
