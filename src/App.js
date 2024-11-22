import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY = "2c37991c";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [IsLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState([]);
  function handleselect(id) {
    setSelectedId((selectedId)=>id===selectedId?null:id);
    console.log(id);
  }
  function handleback() {
    setSelectedId(null);
  }
function handleAddItem(movie){
  setWatched([...watched,movie])
}

  // const quiry = `interstellar`;
  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setisLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
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
          setError(err.message);
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
      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        {" "}
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
function Main({ children, selectedId, handleback,watched,onAddItem }) {
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
            {
            
            selectedId ? (
               <Moviedetail selectedId={selectedId} onAddItem={onAddItem}  handleback={handleback} />
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
                      <span>{avgImdbRating}</span>
                    </p>
                    <p>
                      <span>🌟</span>
                      <span>{avgUserRating}</span>
                    </p>
                    <p>
                      <span>⏳</span>
                      <span>{avgRuntime} min</span>
                    </p>
                  </div>
                </div>
                <ul
                  className="list">
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
function Moviedetail({ selectedId, handleback,onAddItem }) {
  const [movie, setMovie] = useState({});
  const [IsLoading, setisLoading] = useState(false);
  const[userRating,setUserRating] =useState('');

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
function handleAdd(){
  const newWatchedMovie ={
   imdbID:selectedId,
   title,
   userRating,
   poster,
   imdbRating:Number(imdbRating),
   runtime:Number(runtime.split(' ').at(0)),

  }
  onAddItem(newWatchedMovie);
  handleback();
}

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
    {IsLoading ?  <Loder/> :
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
      <StarRating maxrate={10} size={24} onSetrating={setUserRating}/>
      { userRating>0&&
      <button onClick={handleAdd} className="btn-add">Add to watched list</button>
      }
      </div>
      <p>
      <em>{plot}</em>
      </p>
      <p>{actor}</p>
      <p>{director}</p>
      </section>
</>
    }
      </div>
    );
  }
  