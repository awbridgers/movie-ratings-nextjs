import { IMovieData } from '../types';

export const getMovie = async (id: string) : Promise<IMovieData> => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  const getMovie = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
  );
  const {
    budget,
    genres,
    imdb_id,
    overview,
    poster_path,
    backdrop_path,
    revenue,
    runtime,
    title,
    vote_average,
    vote_count,
    release_date,
    tagline
  } = await getMovie.json();
  return {
    budget,
    genres,
    imdb_id,
    overview,
    poster_path: `https://image.tmdb.org/t/p/w500${poster_path}`,
    backdrop_path:`https://image.tmdb.org/t/p/w1280${backdrop_path}`,
    revenue,
    runtime,
    title,
    vote_average,
    vote_count,
    tagline,
    release_date
  };
};
