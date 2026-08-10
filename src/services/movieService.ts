import axios from "axios";
import type { MoviesResponse } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesResponse> => {
  const response = await axiosInstance.get<MoviesResponse>("/search/movie", {
    params: {
      query,
      page,
    },
  });
  return response.data;
};
