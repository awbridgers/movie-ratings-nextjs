import React, {useContext, useState} from 'react';
import {FirebaseContext} from '../firebase/provider';
// import MovieCard from '../components/movieCard';
import Select from 'react-select';
import {sortMovies} from '../util/sortMovies';
import Switch from 'react-switch';
import {IMovie, Option} from '../types';
import homeStyle from '../styles/App.module.css';
import {GetStaticProps} from 'next';
import {db} from '../firebase/config';
import {get, ref, child} from 'firebase/database';
import {getAllMovies} from '../util/getAllMovies';
import MovieCard from '../components/movieCard';
import Head from 'next/head';
import { averageRating } from '../util/averageRating';

interface Props {
  movies: IMovie[];
}
interface MovieImage extends IMovie {
  image: string;
}

const options: Option[] = [
  {value: 'dateA', label: 'Date (Ascending)'},
  {value: 'dateD', label: 'Date (Descending)'},
  {value: 'rateA', label: 'Rating (Ascending)'},
  {value: 'rateD', label: 'Rating (Descending)'},
  {value: 'titleA', label: 'Title (Ascending)'},
  {value: 'titleD', label: 'Title (Descending)'},
];

const Home = () => {
  const [sortType, setSortType] = useState<Option>(options[1]);
  const [cageFilter, setCageFilter] = useState<boolean>(false);
  const movies = useContext(FirebaseContext).movie
  return (
    <>
    <Head>
      <title>Movie Ratings</title>
      <meta name = 'description' content = 'Movie Rankings for Cage Club'/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    </Head>
      <div className={homeStyle.homePage} data-testid="homePage">
        <div className={homeStyle.sort}>
          <div className={homeStyle.cageFilter}>
            <div className={homeStyle.filterTitle}>Cage Filter</div>
            <Switch
              onColor="#03AC13"
              uncheckedIcon={false}
              checked={cageFilter}
              onChange={(checked) => setCageFilter(checked)}
            />
          </div>
          <label style={{display: 'none'}} htmlFor="sort">
            Sort
          </label>
          <Select
            isSearchable={false}
            className="select"
            options={options}
            value={sortType}
            onChange={(option: Option | null) =>
              setSortType(option ? option : sortType)
            }
            inputId="sort"
            instanceId="sort"
          />
        </div>
        <div className={homeStyle.home}>
          {movies
            .filter((x) => (cageFilter ? x.cage === true : x))
            .sort((a, b) => sortMovies(a, b, sortType))
            .map((movie, i) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                date={movie.date}
                id={movie.id}
                averageRating={averageRating(movie.ratings)}
                cage={movie.cage}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;


