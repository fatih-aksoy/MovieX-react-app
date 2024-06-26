import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const MovieContext = createContext();

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;

const MovieContextProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMovies(FEATURED_API); // hangi api ye istek aticaksam onu cagiricam; FEATURED_API
  }, []);

  // ! FIRST CHECK ABOUT DATA
  //   const getMovies = (API) => {
  //     axios
  //       .get(API)
  //       .then((res) => console.log(res.data.results))
  //       .catch((err) => console.log(err));
  //   };

  const getMovies = (API) => {
    setLoading(true);
    axios
      .get(API)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <MovieContext.Provider value={{ movies, getMovies, loading }}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContextProvider;
