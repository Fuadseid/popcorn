import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalstorageState } from "./useLocalstorageState";
const KEY = "2c37991c";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
 
  const [selectedId, setSelectedId] = useState(null);
   const [watched,setWatched]= useLocalstorageState([],'watched')
  function handleselect(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
    console.log(id);
  }


  function handleback() {
    setSelectedId(null);
  }
  function handleAddItem(movie) {
    setWatched([...watched, movie]);
  }
  function handledelate(id) {
    setWatched(watched.filter((movies) => id !== movies.imdbID));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  const {movies,IsLoading,error}=useMovies(query)

  // const quiry = `interstellar`;

 

  return (
    <>
      <Navbar>
        {" "}
        <Input setQuery={setQuery} query={query}/>
        <Result>
          Found <strong>{movies.length}</strong> results
        </Result>
      </Navbar>
      <Main
        selectedId={selectedId}
        onSelectedId={handleselect}
        handleback={handleback}
        movies={movies}
        watched={watched}
        onAddItem={handleAddItem}
        handledelate={handledelate}
      >
        <Box1 movies={movies}>
          {IsLoading && <Loder />}
          {!IsLoading &&
            !error &&
            movies?.map((movie) => (
              <Movielist movie={movie} onSelectedId={handleselect} />
            ))}
          {error && <Errorpage message={error} />}
        </Box1>
      </Main>
    </>
  );
}
function Input({query,setQuery}) {
  const focuses = useRef(null);
  useEffect(function () {
    function callback(e) {
      if(document.activeElement===focuses.current) return;
      if (e.code === "Enter") {
        focuses.current.focus();
        setQuery('');
      }
    }
    document.addEventListener("keydown", callback);

    return ()=> document.removeEventListener("keydown", callback);
  }, [setQuery]);
  return (
    <input
      ref={focuses}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Movielist({ movie, onSelectedId }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function Errorpage({ message }) {
  return (
    <p className="error">
      <span>💀</span>
      {message}
    </p>
  );
}
function Loder() {
  return <p className="loader">Loding...</p>;
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Result({ children }) {
  return <p className="num-results">{children}</p>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Box1({ children }) {
  return <div className="box">{children}</div>;
}
function Main({
  children,
  selectedId,
  handleback,
  watched,
  onAddItem,
  handledelate,
}) {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <main className="main">
      <Box1>
        <button
          className="btn-toggle"
          onClick={() => setIsOpen1((open) => !open)}
        >
          {isOpen1 ? "–" : "+"}
        </button>
        {isOpen1 && <ul className="list list-movies ">{children}</ul>}
      </Box1>

      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen2((open) => !open)}
        >
          {isOpen2 ? "–" : "+"}
        </button>
        {isOpen2 && (
          <>
            {selectedId ? (
              <Moviedetail
                selectedId={selectedId}
                onAddItem={onAddItem}
                handleback={handleback}
                watched={watched}
              />
            ) : (
              <>
                {" "}
                <div className="summary">
                  <h2>Movies you that watched</h2>
                  <div>
                    <p>
                      <span>#️⃣</span>
                      <span>{watched.length} movies</span>
                    </p>
                    <p>
                      <span>⭐️</span>
                      <span>{avgImdbRating.toFixed(2)}</span>
                    </p>
                    <p>
                      <span>🌟</span>
                      <span>{avgUserRating.toFixed(2)}</span>
                    </p>
                    <p>
                      <span>⏳</span>
                      <span>{avgRuntime.toFixed(2)} min</span>
                    </p>
                  </div>
                </div>
                <ul className="list">
                  {watched.map((movie) => (
                    <li key={movie.imdbID}>
                      <img src={movie.poster} alt={`${movie.title} poster`} />
                      <h3>{movie.title}</h3>
                      <div>
                        <p>
                          <span>⭐️</span>
                          <span>{movie.imdbRating}</span>
                        </p>
                        <p>
                          <span>🌟</span>
                          <span>{movie.userRating}</span>
                        </p>
                        <p>
                          <span>⏳</span>
                          <span>{movie.runtime} min</span>
                          <button
                            onClick={() => handledelate(movie.imdbID)}
                            className="btn-delete"
                          >
                            X
                          </button>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>{" "}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
function Moviedetail({ selectedId, handleback, onAddItem, watched }) {
  const [movie, setMovie] = useState({});
  const [IsLoading, setisLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const count =useRef(0);
  useEffect(function(){
   if(userRating) count.current=count.current+1;
  },[userRating])
  const WatchedUserRating = watched.find(
    (movie) => selectedId === movie.imdbID
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actor,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      userRating,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      countRating:count.current,
    };
    onAddItem(newWatchedMovie);
    handleback();
  }
  useEffect(
    function () {
      document.title = `${title}`;
      console.log(title);
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  useEffect(function () {
    const callback = document.addEventListener("keydown", function (e) {
      if (e.code === "Escape") {
        handleback();
      }
    });
    return function () {
      document.removeEventListener("keydown", function (e) {
        if (e.code === "Escape") {
          handleback();
        }
      });
    };
  }, []);
  useEffect(
    function () {
      async function getMoviedetail() {
        setisLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        console.log(data);
        setisLoading(false);
      }
      getMoviedetail();
    },
    [selectedId]
  );
  return (
    <div className="details">
      {IsLoading ? (
        <Loder />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleback}>
              &larr;
            </button>
            <img src={poster} alt={`Photo of ${poster}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxrate={10}
                    size={24}
                    onSetrating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAdd} className="btn-add">
                      Add to watched list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated This Movie {WatchedUserRating}
                  <span>⭐</span>{" "}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>{actor}</p>
            <p>{director}</p>
          </section>
        </>
      )}
    </div>
  );
}
