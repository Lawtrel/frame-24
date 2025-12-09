"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogService } from "@/services/catalog-service";
import { SuppliersService } from "@/services/suppliers-service";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Estados para as listas de seleção
  const [distributors, setDistributors] = useState<any[]>([]);
  const [ageRatings, setAgeRatings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    original_title: "",
    brazil_title: "",
    distributor_id: "",
    duration_minutes: 0,
    production_year: new Date().getFullYear(),
    national: false,
    age_rating: "",
    synopsis: "",
    category_ids: [] as string[],
  });

  // Carregar dados iniciais
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [dist, ratings, cats] = await Promise.all([
          SuppliersService.getDistributors(),
          CatalogService.getAgeRatings(),
          CatalogService.getCategories(),
        ]);
        setDistributors(dist);
        setAgeRatings(ratings);
        setCategories(cats);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares", error);
      } finally {
        setInitializing(false);
      }
    };
    loadDependencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await CatalogService.createMovie({
        ...formData,
        // Garante que números sejam enviados como números
        duration_minutes: Number(formData.duration_minutes),
        production_year: Number(formData.production_year),
      });
      
      router.push("/catalog");
    } catch (error) {
      console.error("Erro ao criar filme:", error);
      alert("Erro ao criar filme. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => {
      const exists = prev.category_ids.includes(catId);
      if (exists) {
        return { ...prev, category_ids: prev.category_ids.filter(id => id !== catId) };
      }
      return { ...prev, category_ids: [...prev.category_ids, catId] };
    });
  };

  if (initializing) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-red" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/catalog" 
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Filme</h1>
          <p className="text-sm text-zinc-400">Preencha os dados do filme para o catálogo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção Principal */}
        <div className="bg-zinc-900/50 border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-200">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Título Original *</label>
              <input
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:ring-1 focus:ring-accent-red focus:border-accent-red outline-none"
                value={formData.original_title}
                onChange={e => setFormData({...formData, original_title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Título no Brasil</label>
              <input
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:ring-1 focus:ring-accent-red focus:border-accent-red outline-none"
                value={formData.brazil_title}
                onChange={e => setFormData({...formData, brazil_title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Distribuidor *</label>
              <select
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:ring-1 focus:ring-accent-red outline-none"
                value={formData.distributor_id}
                onChange={e => setFormData({...formData, distributor_id: e.target.value})}
              >
                <option value="">Selecione...</option>
                {distributors.map(d => (
                  <option key={d.id} value={d.id}>{d.trade_name || d.corporate_name}</option>
                ))}
              </select>
              {distributors.length === 0 && (
                <p className="text-xs text-yellow-500">Nenhum distribuidor encontrado. Cadastre um em Fornecedores.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Duração (min) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-accent-red"
                  value={formData.duration_minutes}
                  onChange={e => setFormData({...formData, duration_minutes: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Ano *</label>
                <input
                  type="number"
                  required
                  min="1900"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-accent-red"
                  value={formData.production_year}
                  onChange={e => setFormData({...formData, production_year: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="national"
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-accent-red focus:ring-accent-red"
              checked={formData.national}
              onChange={e => setFormData({...formData, national: e.target.checked})}
            />
            <label htmlFor="national" className="text-sm text-zinc-300">Produção Nacional</label>
          </div>
        </div>

        {/* Detalhes e Categorias */}
        <div className="bg-zinc-900/50 border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-200">Classificação e Gêneros</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Classificação Indicativa</label>
              <div className="flex flex-wrap gap-2">
                {ageRatings.map(rating => (
                  <button
                    type="button"
                    key={rating.id}
                    onClick={() => setFormData({...formData, age_rating: rating.id})}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      formData.age_rating === rating.id
                        ? "bg-accent-red text-white border-accent-red"
                        : "bg-zinc-950 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {rating.code || rating.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Categorias</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-zinc-800 rounded-lg">
                {categories.length === 0 ? (
                  <p className="text-xs text-zinc-500">Nenhuma categoria cadastrada.</p>
                ) : (
                  categories.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        formData.category_ids.includes(cat.id)
                          ? "bg-white text-black border-white font-medium"
                          : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Sinopse</label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:ring-1 focus:ring-accent-red focus:border-accent-red outline-none resize-none"
                value={formData.synopsis}
                onChange={e => setFormData({...formData, synopsis: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/catalog"
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Filme
          </button>
        </div>
      </form>
    </div>
  );
}