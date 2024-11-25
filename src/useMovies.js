import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [IsLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const KEY = "2c37991c";
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          setisLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong on fetching a Movie");
          const data = await res.json();
          console.log(data);
          if (data.Response === "False")
            throw new Error("Movie that is not Found");
          setMovies(data.Search);
          console.log(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setisLoading(false);
        }
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      }
      /*  .then((res) => res.json())
            .then((data) => setMovies(
              )); */
    //   handleback();
      fetchMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {movies,IsLoading,error}
}
