import {get, ref} from 'firebase/database'
import { db } from '../firebase/config';
import { IViewer } from '../types';
import { ratingsArray } from './ratingsArray';
export const getAllViewers = async () => {
  try {
    let tempViewerArray: IViewer[] = [];
    const viewers = await get(ref(db, 'users'));
    viewers.forEach((snapshot) => {
      if (snapshot.val().ratings) {
        tempViewerArray.push({
          name: snapshot.val().displayName,
          ratings: ratingsArray(snapshot.child('/ratings'), false),
          id: snapshot.key!,
        });
      }
    });
    return tempViewerArray
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return [];
  }
};