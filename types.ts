export interface IRating {
  name: string;
  score: number;
  id: string;

}
export interface IViewer {
  name: string;
  ratings : IRating[];
  id: string;
}
export interface IMovie {
  title: string,
  date: Date,
  ratings: IRating[],
  id: string,
  cage: boolean
}
export interface MovieContext {
    movie: IMovie[];
    viewer: IViewer[];
    userMovie: IRating[];
    displayName: string | null;
}

export interface IMovieData {
  budget: number,
  genres: {id:number, name: string}[],
  imdb_id: string,
  overview: string,
  poster_path: string,
  backdrop_path: string,
  revenue: number,
  release_date: string,
  runtime: number,
  title: string,
  vote_average: number,
  vote_count: number,
  tagline: string
}
declare global {
  interface Window { recaptchaVerifier: any; }
}
export interface Option {
  value: string;
  label: string;

}