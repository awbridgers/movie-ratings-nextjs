import {DataSnapshot} from 'firebase/database'
import 'firebase/database';
import {IRating} from '../types';

export const ratingsArray = (
  ratings: DataSnapshot,
  movie: boolean
): IRating[] => {
  let ratingsArray: IRating[] = [];
  ratings.forEach((snapshot) => {
    ratingsArray.push({
      name: movie ? snapshot.val().displayName : snapshot.key!,
      score: movie ? snapshot.val().score : snapshot.val(),
      id: movie ? snapshot.key! : snapshot.key!.replace(/ /g, '-')
    });
  });
  return ratingsArray;
};
