import React, {useContext} from 'react';
import {IRating} from '../types';
import RatingCircle from './ratingCircle';
import {averageRating} from '../util/averageRating';
import {getDate} from '../util/getDate';
import {ImCross, ImCheckmark} from 'react-icons/im';
import styles from '../styles/movieDetails.module.css'
import {Button} from 'react-bootstrap';
import {AuthContext} from '../firebase/authProvider';

interface Props {
  date: Date;
  ratings: IRating[];
  vote_average: number;
  vote_count: number;
  overview: string;
  budget: number;
  revenue: number;
  cage: boolean;
  addRating: () => void;
  deleteRating:()=>void;
  userRating: IRating | undefined;
}

const MovieDetails = ({
  date,
  ratings,
  vote_average,
  vote_count,
  overview,
  budget,
  revenue,
  cage,
  addRating,
  userRating,
  deleteRating
}: Props) => {
  const user = useContext(AuthContext);
  return (
    <div className={styles.detailsPage}>
      <div className={styles.movieRatings}>
        <div className={styles.ourRating}>
          <div>Our Rating ({ratings.length})</div>
          <div className={styles.ratingSize}>
            <RatingCircle rating={averageRating(ratings)} />
          </div>
        </div>
        <div className={styles.fanRating}>
          <div>TMDB Rating ({vote_count.toLocaleString('en')})</div>
          <div className={styles.ratingSize}>
            <RatingCircle rating={vote_average} />
          </div>
        </div>
      </div>
      <div className={styles.movieDetails}>
        <div className={styles.cage}>
          <div className={styles.heading}>Nic Cage</div>
          <div className={styles.detailsBody}>
            {cage ? (
              <ImCheckmark size={20} color="#03AC13" data-testid="check" />
            ) : (
              <ImCross size={20} color="#FF0800" data-testid="x" />
            )}
          </div>
        </div>
        <div className={styles.overview}>
          <div className={styles.heading}>Plot</div>
          <div className={styles.detailsBody}>{overview}</div>
        </div>
        <div className={styles.budget}>
          <div className={styles.heading}>Budget</div>
          <div className={styles.detailsBody}>${budget.toLocaleString('en')}</div>
        </div>
        <div className={styles.revenue}>
          <div className={styles.heading}>Revenue</div>
          <div className={styles.detailsBody}>${revenue.toLocaleString('en')}</div>
        </div>
        <div className={styles.revenue}>
          <div className={styles.heading}>Date Watched</div>
          <div className={styles.detailsBody}>{getDate(date)}</div>
        </div>
        {user && (
          <div className={styles.revenue}>
            <div className={styles.heading}>Your Rating</div>
            {userRating ? (
              <div className={styles.detailBody}>
                {userRating.score}/10 |{' '}
                <div
                  className = {styles.changeRating}
                  onClick={addRating}
                >
                  Change
                </div>
                <div style = {{display: 'inline'}} className = {styles.detailBody}> | </div>
                <div className = {styles.changeRating} onClick = {deleteRating}>Delete</div>
              </div>
            ) : (
              <Button size="sm" variant="secondary" onClick={addRating}>
                Add Rating
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
