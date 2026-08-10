import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import css from "./App.module.css";

// Специфічний імпорт ReactPaginate для Vite 8+
type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Використовуємо TanStack Query для запитів
  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query),
    placeholderData: (previousData) => previousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  // Виводимо тост, якщо запит успішний, але нічого не знайдено
  useEffect(() => {
    if (isSuccess && query && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, movies.length, query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery === query) return;
    setQuery(searchQuery);
    setPage(1); // Скидаємо на першу сторінку при новому пошуку
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {/* Помилка або завантаження */}
      {isError && <ErrorMessage />}
      {(isLoading || isFetching) && <Loader />}

      {/* Пагінація рендериться лише тоді, коли сторінок більше ніж 1 */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {/* Галерея фільмів */}
      {!isError && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={handleSelectMovie}
        />
      )}

      {/* Модальне вікно */}
      <MovieModal
        movie={selectedMovie}
        onClose={handleCloseModal}
      />
    </div>
  );
}
