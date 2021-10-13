import { IRating } from '../types';

export const sortRatings = (a: IRating, b: IRating, sortType: 'name'|'score', sortBest: boolean) => {
  if (sortType === 'score') {
    if (sortBest) {
      return b.score - a.score;
    }
    return a.score - b.score;
  } else {
    if (sortBest) {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    }
    else{
      if (a.name > b.name) {
        return -1;
      } else if (a.name < b.name) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};