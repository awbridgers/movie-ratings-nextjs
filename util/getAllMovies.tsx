import { IMovie } from '../types';
import {db} from '../firebase/config'
import {get, ref} from 'firebase/database'
import { ratingsArray } from './ratingsArray';
import { averageRating } from './averageRating';

export const getAllMovies = async () => {
  let tempMovieArray: IMovie[] = [];
  try {
    const movies = await get(ref(db, 'movies')); //await db.ref('movies').once('value');
    movies.forEach((snapshot) => {
      tempMovieArray.push({
        title: snapshot.key!,
        date: snapshot.val().date,
        ratings: ratingsArray(snapshot.child('/ratings'), true),
        id: snapshot.val().id,
        cage: snapshot.val().cage,
      });
    });
    return tempMovieArray
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      
    }
    return []
  }
};

