import React, {useEffect, useState} from 'react';
import {IMovie, IMovieData} from '../types';
import {Card} from 'react-bootstrap';
import {getMovie} from '../util/getMovie';
import {averageRating} from '../util/averageRating';
import StarRatings from 'react-star-ratings';
import Link from 'next/link'
import cardStyle from '../styles/movieCard.module.css'

interface Props extends IMovie {}

const MovieCard = ({title, id, date, averageRating}: Props) => {
  const [movieData, setMovieData] = useState<IMovieData>();
  useEffect(() => {
    let mounted = true;
    const getMovieData = async () => {
      const movie = await getMovie(id);
      if (mounted) {
        setMovieData(movie);
      }
    };
    getMovieData();
    return ()=> {mounted = false}
  }, [id]);
  return (
    <Card bg="dark" className={cardStyle.movieCard} data-testid="movieCard">
      <div className={cardStyle.imageWrapper}>
        <div className={cardStyle.image}>
          <img
            className={cardStyle.cardImage}
            src={movieData?.poster_path}
            alt={`${title} Poster`}
          />
        </div>
      </div>
      <div className={cardStyle.bodyWrapper}>
        <div className={cardStyle.body}>
          <div className={cardStyle.title}>
            <Link href={`/movies/${title.replace(/ /g,'-')}`} passHref>
              <a className={cardStyle.link}>
              <Card.Title data-testid={title}>{movieData?.title}</Card.Title>
              </a>
            </Link>
          </div>
          <div className={cardStyle.averageRating}>
            <div className={cardStyle.stars}>
              <StarRatings
                rating={averageRating / 10}
                starRatedColor="rgb(255,223,0)"
                numberOfStars={1}
                starEmptyColor={'rgb(30,30,30)'}
                starDimension="50px"
                starSpacing="0px"
              />
            </div>
            <div className={cardStyle.score}>{averageRating.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
