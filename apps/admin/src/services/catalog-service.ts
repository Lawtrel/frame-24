import { MoviesApi, ProductsApi, MovieCategoriesApi } from "@repo/api-types";
import { apiConfig } from "./api-config";

const moviesApi = new MoviesApi(apiConfig);
const productsApi = new ProductsApi(apiConfig);
const categoriesApi = new MovieCategoriesApi(apiConfig);

export const CatalogService = {
  // --- FILMES ---
  getMovies: async () => {
    const response = await moviesApi.moviesControllerFindAllV1();
    return response.data;
  },

  getMovieById: async (id: string) => {
    if (!id) throw new Error("ID é obrigatório para getMovieById");
    const response = await moviesApi.moviesControllerFindOneV1({ id });
    return response.data;
  },

  createMovie: async (data: any) => {
    // CORREÇÃO FINAL: Envolver no objeto { createMovieDto: data }
    return moviesApi.moviesControllerCreateV1({ createMovieDto: data });
  },

  updateMovie: async (id: string, data: any) => {
    return moviesApi.moviesControllerUpdateV1({ id, updateMovieDto: data });
  },

  deleteMovie: async (id: string) => {
    return moviesApi.moviesControllerDeleteV1({ id });
  },

  // --- DADOS AUXILIARES ---
  getAgeRatings: async () => {
    const response = await moviesApi.moviesControllerGetAgeRatingsV1();
    return response.data;
  },

  getCastTypes: async () => {
    const response = await moviesApi.moviesControllerGetCastTypesV1();
    return response.data;
  },

  getMediaTypes: async () => {
    const response = await moviesApi.moviesControllerGetMediaTypesV1();
    return response.data;
  },

  getCategories: async () => {
    const response = await categoriesApi.movieCategoriesControllerFindAllV1();
    return response.data;
  },

  // --- PRODUTOS ---
  getProducts: async (active = 'true') => {
    const response = await productsApi.productsControllerFindAllV1({ active });
    return response.data;
  }
};