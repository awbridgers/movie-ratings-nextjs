import React, {useContext, useEffect, useState} from 'react';
import {IMovieData, IRating} from '../../types';
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

interface Props {
  title: string;
  id: string;
  date: string;
  ratings: IRating[];
  cage: boolean;
  movieData: IMovieData;
}

const Movie = ({title, id, ratings, cage, date}: Props) => {
  const [addRating, setAddRating] = useState<boolean>(false);
  const [deleteRating, setDeleteRating] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<IMovieData>()
  const isMobile = useMediaQuery({maxWidth: 700});
  // const userMovie = useContext(FirebaseContext).userMovie;
  // const userScore = userMovie.find(x=>x.name===title);
  useEffect(()=>{
    const loadData = async()=>{
      const data = await getMovie(id);
      setMovieData(data)
    }
    let isMounted = true;
    if(isMounted){
      loadData();
    }
    return ()=>{isMounted = false}
  })
  if (movieData) {
    const details = (
      <MovieDetails
        date={new Date(date)}
        ratings={ratings}
        vote_average={movieData.vote_average}
        vote_count={movieData.vote_count}
        overview={movieData.overview}
        budget={movieData.budget}
        revenue={movieData.revenue}
        cage={cage}
        addRating={() => setAddRating(true)}
        deleteRating={() => {
          setDeleteRating(true);
          setAddRating(true);
        }}
        userRating={undefined}
      />
    );
    return (
      <>
      <Head>
        <title>{title}</title>
        <meta name = 'description' content = {`Movie information for ${title}`}/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>
      <div className={styles.moviePage}>
        {/* {addRating && (
          <AddRating
            back={() => {setAddRating(false); setDeleteRating(false)}}
            title={title}
            userScore= {userScore}
            deleteRating = {deleteRating}
          />
        )} */}

        <div
          className={styles.info}
          style={{backgroundImage: `url(${movieData.backdrop_path})`}}
        >
          <div className={styles.overlay}></div>
          <div className={styles.moviePoster}>
            <img src={movieData.poster_path} alt="" />
          </div>
          <div className={styles.movieInfo} data-testid="movieDetails">
            <div className={styles.titleDiv}>
              <div className={styles.movieTitle}>
                {`${movieData.title} (${new Date(movieData.release_date).getFullYear()})`}
                <div className={styles.movieTitleInfo}>
                  {movieData &&
                    infoString(
                      new Date(movieData.release_date),
                      movieData.genres,
                      movieData.runtime
                    )}
                </div>
              </div>

              <div className={styles.tagline}>{movieData.tagline}</div>
            </div>
            {!isMobile && details}
          </div>
        </div>
        {isMobile && details}
        {/* <RatingTable movie = {false} title="Ratings" ratings={ratings} isMobile={isMobile} /> */}
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
  const paths = movies.map((x) => ({params: {title: x.title.replace(/ /g, '-')}}));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const movie = await get(ref(db,`movies/${(params!.title! as string).replace(/-/g, ' ')}`));
  return {
    props: {
      title: movie.key!,
      cage: movie.val().cage,
      date: movie.val().date,
      ratings: ratingsArray(movie.child('/ratings'),true),
      id: movie.val().id
    },
  };
};
export default Movie;
