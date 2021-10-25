import {IMovie, IViewer, Option} from '../types';

import {averageRating} from './averageRating';

export const sortMovies = (
  a: IMovie,
  b: IMovie,
  sort: Option
): number => {
  switch (sort.value) {
    case 'dateA':
      return a.date.getTime() - b.date.getTime();
    case 'dateD':
      return b.date.getTime() - a.date.getTime();
    case 'rateA':
      return averageRating(a.ratings) - averageRating(b.ratings);
    case 'rateD':
      return averageRating(b.ratings) - averageRating(a.ratings);
    case 'titleA':
      if (a.title > b.title) {
        return 1;
      } else if (a.title < b.title) {
        return -1;
      }
      return 0;
    case 'titleD':
      if (a.title > b.title) {
        return -1;
      } else if (a.title < b.title) {
        return 1;
      }
      return 0;
    default:
      return b.date.getTime() - a.date.getTime();
  }
};
// exact same thing but with Viewers
export const sortViewers = (
  a: IViewer,
  b: IViewer,
  sort: Option
): number => {
  switch (sort.value) {
    case 'rateA':
      return averageRating(a.ratings) - averageRating(b.ratings);
    case 'rateD':
      return averageRating(b.ratings) - averageRating(a.ratings);
    case 'titleA':
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }
      return 0;
    case 'titleD':
      if (a.name > b.name) {
        return -1;
      } else if (a.name < b.name) {
        return 1;
      }
      return 0;
    default:
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }
      return 0;
  }
};
