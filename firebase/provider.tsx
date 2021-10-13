import {db} from './config';
import {ref, get, child, onValue, off} from 'firebase/database';
import {createContext, useContext, useEffect, useState} from 'react';
import React from 'react';
import {ratingsArray} from '../util/ratingsArray';
import {IMovie, IRating, IViewer, MovieContext} from '../types';
import {AuthContext} from './authProvider';

interface IProvider {
  children: React.ReactNode;
}

export const FirebaseContext = createContext<MovieContext>({
  movie: [],
  viewer: [],
  userMovie: [],
  displayName: null,
});

const FirebaseProvider = ({children}: IProvider) => {
  const [movieArray, setMovieArray] = useState<IMovie[]>([]);
  const [viewerArray, setViewerArray] = useState<IViewer[]>([]);
  const [userArray, setUserArray] = useState<IRating[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const user = useContext(AuthContext);
  useEffect(() => {
    //if a user is logged in, watch for changes to their db
    if (user) {
      onValue(ref(db, `users/${user.uid}`), (snapshot) => {
        if (!snapshot.val()) {
          setUserArray([]);
          setDisplayName('');
        } else {
          setUserArray(ratingsArray(snapshot.child('/ratings'), false));
          setDisplayName(snapshot.val().displayName);
        }
      });
      // db.ref(`users/${user.uid}`).on('value', (snapshot) => {
      //   if(!snapshot.val()){
      //     setUserArray([]);
      //     setDisplayName('');
      //   }
      //   else{
      //   setUserArray(ratingsArray(snapshot.child('/ratings'), false));
      //   setDisplayName(snapshot.val().displayName);
      //   }
      // });

      return () => off(ref(db, `users/${user.uid}`));
    }
  }, [user]);
  useEffect(() => {
    //load the data initially
    // const getMovieData = async () => {
    //   let tempMovieArray: IMovie[] = [];
    //   try {
    //     const movies = await get(ref(db, 'movies')); //await db.ref('movies').once('value');
    //     movies.forEach((snapshot) => {
    //       tempMovieArray.push({
    //         title: snapshot.key!,
    //         date: new Date(snapshot.val().date),
    //         ratings: ratingsArray(snapshot.child('/ratings'), true),
    //         id: snapshot.val().id,
    //         cage: snapshot.val().cage,
    //       });
    //     });
    //     setMovieArray(tempMovieArray);
    //   } catch (e) {
    //     if (e instanceof Error) {
    //       console.log(e.message);
    //     }
    //   }
    // };
    const getViewerData = async () => {
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
        setViewerArray(tempViewerArray);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    };
    //getMovieData();
    getViewerData();
  }, [userArray, displayName]);
  return (
    <FirebaseContext.Provider
      value={{
        movie: movieArray,
        viewer: viewerArray,
        userMovie: userArray,
        displayName: displayName,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
