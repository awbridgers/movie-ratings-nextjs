import { IRating } from '../types';

export const averageRating = (ratings: IRating[]) => {
  let total = 0;
  ratings.forEach((rating)=>{
    total += rating.score;
  })
  return ratings.length !== 0 ? total/ratings.length : 0;
}
