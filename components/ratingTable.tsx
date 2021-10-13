import React, {useState} from 'react';
import {Table} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import {IRating} from '../types';
import {sortRatings} from '../util/sortRatings';
import styles from '../styles/ratingsTable.module.css'
import { averageRating } from '../util/averageRating';
import {useRouter} from 'next/router'

interface IProps {
  ratings: IRating[];
  isMobile: boolean;
  title: string;
  movie: boolean;
}

const RatingTable = ({ratings, isMobile, title, movie}: IProps) => {
  const [sortBest, setSortBest] = useState<boolean>(true);
  const [sortType, setSortType] = useState<'name' | 'score'>('score');
  const path = movie ? '/movies/' : '/viewers/';
  const history = useRouter();
  const changeSort = (type: 'name' | 'score') => {
    if (type === sortType) {
      setSortBest(!sortBest);
    } else {
      setSortType(type);
    }
  };
  return (
    <div className={styles.ratingTable}>
      <div className={styles.ratingTitle}>{title}</div>
      <Table size="sm" hover variant="dark" className={styles.tableOfRatings}>
        <tbody>
          <tr>
            <th onClick={() => changeSort('name')}>Name</th>
            <th onClick={() => changeSort('score')}>Score</th>
          </tr>
          {ratings
            .sort((a, b) => sortRatings(a, b, sortType, sortBest))
            .map((rating, i) => (
              <tr key={i}>
                <td
                  data-testid="ratingName"
                  className={styles.ratingName}
                  onClick={() => history.push(`${path}${rating.id}`)}
                >
                  {rating.name}
                </td>
                <td>
                  <StarRatings
                    rating={rating.score / 2}
                    starRatedColor="rgb(255,223,0)"
                    starEmptyColor="rgb(30,30,30)"
                    starDimension={!isMobile ? '35px' : '30px'}
                    starSpacing={!isMobile ? '2px' : '0px'}
                    name="starRating"
                  />
                  {` ${rating.score.toFixed(1)}/10`}
                </td>
              </tr>
            ))}
            <tr><td></td><td></td></tr>
          <tr>
            <td className={styles.ratingsAverage}>Average ({ratings.length} ratings)</td>
            <td>
                  <StarRatings
                    rating={averageRating(ratings) / 2}
                    starRatedColor="rgb(255,223,0)"
                    starEmptyColor="rgb(30,30,30)"
                    starDimension={!isMobile ? '35px' : '30px'}
                    starSpacing={!isMobile ? '2px' : '0px'}
                    name="starRating"
                  />
                  {` ${averageRating(ratings).toFixed(1)}/10`}
                </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default RatingTable;
