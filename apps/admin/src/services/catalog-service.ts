import { apiConfig } from "./api-config";
import { MoviesApi } from "@repo/api-types";

const moviesApi = new MoviesApi(apiConfig);

export const CatalogService = {
  async getMovies() {
    // A chamada deve ser findAllV1 e passar um objeto vazio {} se necessário
    const response = await moviesApi.moviesControllerFindAllV1();
    return response.data;
  },

  async getMovieById(id: string) {
    const response = await moviesApi.moviesControllerFindOneV1(id);
    return response.data;
  },

  async createMovie(data: any) {
    return await moviesApi.moviesControllerCreateV1({ createMovieDto: data });
  },

  async updateMovie(id: string, data: any) {
    return await moviesApi.moviesControllerUpdateV1({ id, updateMovieDto: data });
  },

  async deleteMovie(id: string) {
    return await moviesApi.moviesControllerDeleteV1(id);
  }
};