import React, {useContext, useEffect, useState} from 'react';
import {IMovie, IMovieData, IRating} from '../../types';
import {getMovie} from '../../util/getMovie';
import styles from '../../styles/moviePage.module.css';
import {infoString} from '../../util/infoString';
import MovieDetails from '../../components/movieDetails';
import {useMediaQuery} from 'react-responsive';
//import RatingTable from '../components/ratingTable';
//import AddRating from '../components/addRating';
//import { FirebaseContext } from '../firebase/provider';
import {GetStaticPaths, GetStaticProps} from 'next';
import {db} from '../../firebase/config';
import {get, ref} from 'firebase/database';
import {getAllMovies} from '../../util/getAllMovies';
import { ratingsArray } from '../../util/ratingsArray';
import Head from 'next/head'
import { FirebaseContext } from '../../firebase/provider';
import { useRouter } from 'next/router';
import RatingTable from '../../components/ratingTable';
import AddRating from '../../components/addRating';

interface Props {
  movieInfo: IMovieData
}

const Movie = ({movieInfo}: Props) => {
  const router = useRouter();
  const [addRating, setAddRating] = useState<boolean>(false);
  const [deleteRating, setDeleteRating] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<IMovie | undefined>()
  const [userScore, setUserScore] = useState<IRating | undefined>(undefined)
  const isMobile = useMediaQuery({maxWidth: 700});
  const userMovie = useContext(FirebaseContext).userMovie;
  const movieContext = useContext(FirebaseContext).movie;
  useEffect(()=>{
    const thisMovie = movieContext.find(x=>x.id === router.query.id);
    const score = userMovie.find((x)=>x.name === thisMovie?.title);
    setMovieData(thisMovie)
    setUserScore(score)
  },[movieContext])
  if (movieData) {
    const details = (
      <MovieDetails
        date={new Date(movieData.date)}
        ratings={movieData.ratings}
        vote_average={movieInfo.vote_average}
        vote_count={movieInfo.vote_count}
        overview={movieInfo.overview}
        budget={movieInfo.budget}
        revenue={movieInfo.revenue}
        cage={movieData.cage}
        addRating={() => setAddRating(true)}
        deleteRating={() => {
          setDeleteRating(true);
          setAddRating(true);
        }}
        userRating={userScore}
      />
    );
    return (
      <>
      <Head>
        <title>{movieInfo.title}</title>
        <meta name = 'description' content = {`Movie information for ${movieInfo.title}`}/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>
      <div className={styles.moviePage}>
        {addRating && (
          <AddRating
            back={() => {setAddRating(false); setDeleteRating(false)}}
            title={movieData.title}
            userScore= {userScore}
            deleteRating = {deleteRating}
          />
        )}

        <div
          className={styles.info}
          style={{backgroundImage: `url(${movieInfo.backdrop_path})`}}
        >
          <div className={styles.overlay}></div>
          <div className={styles.moviePoster}>
            <img src={movieInfo.poster_path} alt="" />
          </div>
          <div className={styles.movieInfo} data-testid="movieDetails">
            <div className={styles.titleDiv}>
              <div className={styles.movieTitle}>
                {`${movieInfo.title} (${new Date(movieInfo.release_date).getFullYear()})`}
                <div className={styles.movieTitleInfo}>
                  {movieInfo &&
                    infoString(
                      new Date(movieInfo.release_date),
                      movieInfo.genres,
                      movieInfo.runtime
                    )}
                </div>
              </div>

              <div className={styles.tagline}>{movieInfo.tagline}</div>
            </div>
            {!isMobile && details}
          </div>
        </div>
        {isMobile && details}
        <RatingTable movie = {false} title="Ratings" ratings={movieData.ratings} isMobile={isMobile} />
      </div>
      </>
    );
  }
  return (
    <div className={styles.moviePage} data-testid="loadingMoviePage">
      <div className={styles.info}></div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const movies = await getAllMovies();
  const paths = movies.map((x) => ({params: {id: x.id.toString()}}));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const data = await getMovie(params!.id as string)
  return {
    props: {
      movieInfo: data
    }
  };
};
export default Movie;
