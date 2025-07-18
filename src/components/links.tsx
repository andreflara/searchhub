import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Plus,
  X,
  Edit,
  Trash2,
  Loader2,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  Calendar,
  Tag,
  Link2,
} from "lucide-react";

type LinkType = {
  id: number | null;
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  createdAt: Date;
  visits: number;
  isFavorite: boolean;
};

type PlaceholderImageProps = {
  title: string;
};

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ title }) => {
  const colors = [
    "bg-gradient-to-br from-purple-600 to-blue-600",
    "bg-gradient-to-br from-pink-600 to-purple-600",
    "bg-gradient-to-br from-blue-600 to-cyan-600",
    "bg-gradient-to-br from-green-600 to-teal-600",
    "bg-gradient-to-br from-orange-600 to-red-600",
    "bg-gradient-to-br from-yellow-600 to-orange-600",
  ];

  const colorIndex = title.length % colors.length;
  const initials = title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${colors[colorIndex]} text-white font-bold text-2xl`}
    >
      {initials || title[0]?.toUpperCase()}
    </div>
  );
};

export default function LinksGroup() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [currentLink, setCurrentLink] = useState<LinkType>({
    id: null,
    title: "",
    description: "",
    link: "",
    image: "",
    tags: [],
    createdAt: new Date(),
    visits: 0,
    isFavorite: false,
  });
  const [currentTag, setCurrentTag] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "recent" | "title" | "visits" | "favorites"
  >("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const storedLinks = localStorage.getItem("userLinks");
    if (storedLinks) {
      const parsed = JSON.parse(storedLinks);
      setLinks(
        parsed.map((link: any) => ({
          ...link,
          createdAt: new Date(link.createdAt || Date.now()),
          visits: link.visits || 0,
          isFavorite: link.isFavorite || false,
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userLinks", JSON.stringify(links));
  }, [links]);

  const handleAddTag = () => {
    if (currentTag.trim() && !currentLink.tags.includes(currentTag.trim())) {
      setCurrentLink({
        ...currentLink,
        tags: [...currentLink.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentLink({
      ...currentLink,
      tags: currentLink.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const fetchUrlMetadata = async (url: string) => {
    try {
      setIsLoading(true);
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

      // Simulando API call - substitua pela sua implementação real
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const domain = new URL(formattedUrl).hostname.replace("www.", "");
      setCurrentLink((prev) => ({
        ...prev,
        link: formattedUrl,
        title: prev.title || domain,
        description: prev.description || `Content from ${domain}`,
        image: prev.image || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar metadados :", error);
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
      alert("Title and URL are required!");
      return;
    }

    if (currentLink.id !== null) {
      setLinks(
        links.map((link) => (link.id === currentLink.id ? currentLink : link))
      );
    } else {
      setLinks([
        ...links,
        { ...currentLink, id: Date.now(), createdAt: new Date() },
      ]);
    }

    setCurrentLink({
      id: null,
      title: "",
      description: "",
      link: "",
      image: "",
      tags: [],
      createdAt: new Date(),
      visits: 0,
      isFavorite: false,
    });
    setShowForm(false);
  };

  const handleEdit = (link: LinkType) => {
    setCurrentLink(link);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  const handleLinkClick = (link: LinkType) => {
    setLinks(
      links.map((l) => (l.id === link.id ? { ...l, visits: l.visits + 1 } : l))
    );
  };

  const toggleFavorite = (id: number) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, isFavorite: !link.isFavorite } : link
      )
    );
  };
  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getAllTags = () => {
    const allTags = links.flatMap((link) => link.tags);
    return [...new Set(allTags)];
  };

  const filteredAndSortedLinks = () => {
    let filtered = links.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => link.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "visits":
          return b.visits - a.visits;
        case "favorites":
          return Number(b.isFavorite) - Number(a.isFavorite);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  };

  const LinkCard = ({ link }: { link: LinkType }) => (
    <div className="relative group">
      <div className="rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-600/50 overflow-hidden h-[280px] flex flex-col">
        <div className="relative w-full h-[150px]">
          <a
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(link)}
          >
            {link.image ? (
              <img
                src={link.image}
                alt={link.title}
                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <PlaceholderImage title={link.title} />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(link.id!);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  link.isFavorite
                    ? "bg-yellow-500/90 text-white"
                    : "bg-black/50 text-gray-300 hover:bg-yellow-500/90 hover:text-white"
                }`}
              >
                <Star className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-3 left-3 flex gap-2">
              <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {link.visits}
              </div>
            </div>
          </a>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
              >
                {link.title}
              </a>
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEdit(link);
                }}
                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(link.id!);
                }}
                className="p-1.5 rounded-lg bg-red-800/80 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-sm line-clamp-2 mb-3 flex-grow">
            {link.description}
          </p>

          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {link.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700/80 text-gray-300 px-2 py-1 rounded-full text-xs backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {link.tags.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{link.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(link.createdAt).toLocaleDateString()}
            </span>

            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              <span>Open</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== "") {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Links
          </h1>
          <p className="text-gray-400">
            Organize and access your favorite links
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <form
                onSubmit={handleSubmit}
                className="flex w-full"
                role="search"
                aria-label="Formulário de pesquisa"
              >
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm && query}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setQuery(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </form>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="recent">Recent</option>
                <option value="title">Title</option>
                <option value="visits">Most Visited</option>
                <option value="favorites">Favorites</option>
              </select>

              <div className="flex border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">
                  Filter by tags:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getAllTags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Links Grid */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredAndSortedLinks().map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {filteredAndSortedLinks().length === 0 && (
          <div className="text-center py-12">
            <Link2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm || selectedTags.length > 0
                ? "No links found matching your criteria"
                : "No links yet. Add your first link!"}
            </p>
          </div>
        )}
      </div>

      {/* Add Link Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25"
      >
        {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentLink.id ? "Edit Link" : "Add New Link"}
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  value={currentLink.link}
                  onChange={handleUrlChange}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={currentLink.title}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description (optional)"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                value={currentLink.description}
                onChange={(e) =>
                  setCurrentLink({
                    ...currentLink,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={currentLink.image}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, image: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  className="flex-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white font-medium"
                >
                  Add
                </button>
              </div>

              {currentLink.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentLink.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={currentLink.isFavorite}
                  onChange={(e) =>
                    setCurrentLink({
                      ...currentLink,
                      isFavorite: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="favorite"
                  className="text-gray-300 flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Mark as favorite
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-white font-medium"
                >
                  {currentLink.id ? "Save Changes" : "Add Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
