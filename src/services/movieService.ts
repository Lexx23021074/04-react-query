import axios, { type AxiosResponse } from "axios";
import { type Movie } from "../types/movie";

// Інтерфейс для відповіді від API TMDB (те, що приходить у response.data)
interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<MoviesResponse> => {
  const response: AxiosResponse<MoviesResponse> = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page: page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );

  return response.data;
};
