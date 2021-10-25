import React, {useContext, useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {AuthContext} from '../firebase/authProvider';
import {FirebaseContext} from '../firebase/provider';
import style from '../styles/profile.module.css';
import {averageRating} from '../util/averageRating';
import ChangeProfileInfo from '../components/changeProfileInfo';
import RatingTable from '../components/ratingTable';
import {Button} from 'react-bootstrap';
import { useRouter } from 'next/router';

const Profile = () => {
  const [showChange, setShowChange] = useState<
    'Password' | 'Name' | 'Email' | 'Delete' | null
  >(null);
  const user = useContext(AuthContext);
  
  const router = useRouter();
  const isMobile = useMediaQuery({maxWidth: 700});
  const userMovies = useContext(FirebaseContext).userMovie;
  const highestRated = userMovies.length
    ? userMovies.reduce((accumulator, current) =>
        accumulator.score > current.score ? accumulator : current
      )
    : null;
  const lowestRated = userMovies.length
    ? userMovies.reduce((accumulator, current) =>
        accumulator.score < current.score ? accumulator : current
      )
    : null;

    useEffect(()=>{
      if (!user){
        router.replace('/')
      }
    }, [user])
  return (
    <div className={style.profile}>
      {showChange && (
        <ChangeProfileInfo
          type={showChange}
          currentEmail={user!.email!}
          currentName={user!.displayName!}
          back={() => setShowChange(null)}
        />
      )}
      <div className={style.settings}>
        <div className={style.settingsTitle}>Account Settings</div>
        <div className={style.settingsBody}>
          <div className={style.settingsInfo}>
            <table className={style.infoTable}>
              <tbody>
                <tr data-testid = 'email'>
                  <td>Email</td>
                  <td>{user?.email}</td>
                  <td className={style.change} onClick={() => setShowChange('Email')}>
                    Change
                  </td>
                </tr>
                <tr data-testid = 'name'>
                  <td>Display Name</td>
                  <td>{user?.displayName}</td>
                  <td className={style.change} onClick={() => setShowChange('Name')}>
                    Change
                  </td>
                </tr>
                <tr data-testid = 'password'>
                  <td>Password</td>
                  <td>N/A</td>
                  <td
                    className={style.change}
                    onClick={() => setShowChange('Password')}
                  >
                    Change
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={style.settings}>
        <div className={style.settingsTitle}>My Ratings</div>
        <div className={style.settingsBody}>
          <table className={style.ratingInfo}>
            <tbody>
              <tr>
                <td>Movies Watched:</td>
                <td>{userMovies.length}</td>
              </tr>
              <tr data-testid = 'avg'>
                <td>Average Rating:</td>
                <td>
                  {userMovies.length
                    ? `${averageRating(userMovies)}/10`
                    : 'N/A'}
                </td>
              </tr>
              <tr data-testid = 'highest'>
                <td>Highest Rated:</td>
                <td>
                  {highestRated
                    ? `${highestRated.name} (${highestRated.score}/10)`
                    : 'N/A'}
                </td>
              </tr>
              <tr data-testid = 'lowest'>
                <td>Lowest Rated:</td>
                <td>
                  {lowestRated
                    ? `${lowestRated.name} (${lowestRated.score}/10)`
                    : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
          {!!userMovies.length && (
            <RatingTable
              movie
              ratings={userMovies}
              isMobile={isMobile}
              title=""
            />
          )}
        </div>
      </div>
      <div className={style.delete}>
        <Button variant="danger" onClick={() => setShowChange('Delete')}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Profile;
