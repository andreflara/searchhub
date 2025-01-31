"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ExternalLink, Plus, X, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

type LinkType = {
  id: number | null;
  title: string;
  description: string;
  link: string;
  image: string;
};

type PlaceholderImageProps = {
  title: string;
};

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ title }) => (
  <div className="w-full h-full ">{title}</div>
);

export default function LinksGroup() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [currentLink, setCurrentLink] = useState<LinkType>({
    id: null,
    title: "",
    description: "",
    link: "",
    image: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedLinks = localStorage.getItem("userLinks");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userLinks", JSON.stringify(links));
  }, [links]);

  const fetchUrlMetadata = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/preview?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentLink((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        image: data.image || prev.image,
        link: url,
      }));
    } catch (error) {
      console.error("Erro ao buscar metadados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCurrentLink((prev) => ({ ...prev, link: url }));

    if (url?.startsWith("http")) {
      await fetchUrlMetadata(url);
    }
  };

  const handleSave = async () => {
    if (!currentLink.title || !currentLink.link) {
      alert("Título e URL são obrigatórios!");
      return;
    }

    if (currentLink.id !== null) {
      setLinks(
        links.map((link) => (link.id === currentLink.id ? currentLink : link))
      );
    } else {
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

  const handleEdit = (link: LinkType) => {
    setCurrentLink(link);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este link?")) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  return (
    <div className="min-h-screen relative mt-4 ">
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
                <div className="rounded-md bg-black border border-gray-700 shadow-lg transition-shadow duration-300 overflow-hidden h-[250px] flex flex-col">
                  <div className="relative w-full h-40">
                    {link.image ? (
                      <img
                        src={link.image}
                        alt={link.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PlaceholderImage title={link.title} />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <h2 className="text-xl font-semibold group-hover:text-blue-500 transition-colors line-clamp-2">
                      {link.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(link)}
                  className="bg-gray-800 p-1 rounded-full hover:bg-gray-600 transition opacity-0 group-hover:opacity-100"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => link.id && handleDelete(link.id)}
                  className="bg-red-800 p-1 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 bg-gray-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
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
        <div className="relative">
          <input
            type="text"
            placeholder="URL"
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white pr-10"
            value={currentLink.link}
            onChange={handleUrlChange}
          />
          {isLoading && (
            <div className="absolute right-2 top-2">
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          )}
        </div>
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
          className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600 transition-colors"
        >
          {currentLink.id ? "Salvar Alterações" : "Adicionar Link"}
        </button>
      </div>
    </div>
  );
}
