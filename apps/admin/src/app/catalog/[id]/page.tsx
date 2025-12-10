"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CatalogService } from "@/services/catalog-service";
import { MovieForm } from "@/components/catalog/movie-form";
import { Loader2 } from "lucide-react";

export default function EditMoviePage() {
  const params = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Log para ver o que estamos a receber
        console.log("🛠️ Edit Page Params:", params);

        const movieId = params?.id;

        // Verificação robusta do ID
        if (!movieId || typeof movieId !== 'string') {
          console.warn("⚠️ ID do filme inválido ou não encontrado nos params.");
          return;
        }

        console.log("📥 Buscando filme com ID:", movieId);
        const data = await CatalogService.getMovieById(movieId);
        
        if (data) {
            setMovie(data);
        } else {
            setErrorMsg("Filme não encontrado na API.");
        }

      } catch (error: any) {
        console.error("❌ Erro ao buscar filme:", error);
        setErrorMsg("Erro ao carregar filme. Verifique o console.");
      } finally {
        setLoading(false);
      }
    };

    // Só executa se params estiver disponível
    if (params) {
        fetchMovie();
    }
  }, [params]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-red" />
      </div>
    );
  }

  if (errorMsg || !movie) {
    return <div className="p-8 text-center text-zinc-500">{errorMsg || "Filme não encontrado."}</div>;
  }

  return <MovieForm initialData={movie} isEditing={true} />;
}