import React from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { circleColor } from '../util/circleColor';

interface Props {
  rating: number;
}



const RatingCircle = ({rating}: Props) => {
  const style = circleColor(rating)
  return (
    <div>
      <CircularProgressbar
        value={rating}
        text={`${rating.toFixed(1)}`}
        maxValue={10}
        strokeWidth = {12}
        styles = {buildStyles({
          pathColor: style.path,
          trailColor: style.trail,
          textColor: 'white',
          
        })}
      />
    </div>
  );
};

export default RatingCircle;
