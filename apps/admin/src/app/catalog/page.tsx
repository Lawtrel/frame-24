"use client";

import { useEffect, useState } from "react";
import { CatalogService } from "@/services/catalog-service";
import { Movie } from "@/types/catalog";
import { Plus, Search, Edit2, Trash2, Film, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CatalogPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await CatalogService.getMovies();
      // O Axios retorna os dados, mas precisamos garantir a tipagem.
      // Dependendo de como o DTO foi gerado, pode ser necessário ajustar o map.
      setMovies(data as any); 
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtragem simples no frontend
  const filteredMovies = movies.filter((movie) =>
    movie.original_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movie.brazil_title && movie.brazil_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catálogo de Filmes</h1>
          <p className="text-sm text-zinc-400">Gerencie os títulos disponíveis para exibição.</p>
        </div>
        <Link
          href="/catalog/new"
          className="flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Filme
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-border">
        <Search className="w-5 h-5 text-zinc-500 ml-2" />
        <input
          type="text"
          placeholder="Buscar por título..."
          className="bg-transparent border-none focus:outline-none text-zinc-200 w-full p-2 placeholder:text-zinc-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de Listagem */}
      <div className="rounded-lg border border-border bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Duração</th>
                <th className="px-6 py-4 font-medium">Origem</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Carregando catálogo...
                    </div>
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <Film className="w-8 h-8 opacity-50" />
                      <p>Nenhum filme encontrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200">
                          {movie.brazil_title || movie.original_title}
                        </span>
                        {movie.brazil_title && (
                          <span className="text-xs text-zinc-500">{movie.original_title}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {movie.duration_minutes} min
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        movie.national 
                          ? "bg-green-950 border-green-900 text-green-400" 
                          : "bg-blue-950 border-blue-900 text-blue-400"
                      }`}>
                        {movie.national ? "Nacional" : "Internacional"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${movie.active ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-zinc-400">{movie.active ? "Ativo" : "Inativo"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-950/50 rounded-md text-zinc-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}