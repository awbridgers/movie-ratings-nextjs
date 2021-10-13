import React, {useContext, useState} from 'react';
import ViewerCard from '../../components/viewerCard';
import Select from 'react-select';
import {sortViewers} from '../../util/sortMovies';
import {FirebaseContext} from '../../firebase/provider';
import {IViewer, Option} from '../../types';
import styles from '../../styles/App.module.css';
import {GetStaticPaths, GetStaticProps} from 'next';
import {getAllMovies} from '../../util/getAllMovies';
import {getAllViewers} from '../../util/getAllViewers';
import Head from 'next/head';

interface IProps {
  viewers: IViewer[];
}

const options = [
  {value: 'rateA', label: 'Rating (Ascending)'},
  {value: 'rateD', label: 'Rating (Descending)'},
  {value: 'titleA', label: 'Name (Ascending)'},
  {value: 'titleD', label: 'Name (Descending)'},
];

const ViewerHome = ({viewers}: IProps) => {
  //const viewers = useContext(FirebaseContext).viewer;
  const [sortType, setSortType] = useState<Option>(options[2]);
  return (
    <>
    <Head>
      <title>Viewers</title>
      <meta name='description' content = 'Viewers for the Cage Club' />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </Head>
      <div className={styles.viewerHomePage}>
        <div className={styles.viewerSort}>
          <label style={{display: 'none'}} htmlFor="sort">
            Sort
          </label>
          <Select
            isSearchable={false}
            className="select"
            options={options}
            value={sortType}
            onChange={(option: Option | null) =>
              setSortType(option ? option : sortType)
            }
            inputId="sort"
          />
        </div>
        <div className={styles.viewerHome}>
          {viewers
            .slice()
            .sort((a, b) => sortViewers(a, b, sortType))
            .map((viewer) => (
              <ViewerCard
                key={viewer.id}
                ratings={viewer.ratings}
                name={viewer.name}
                id={viewer.id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ViewerHome;

export const getStaticProps: GetStaticProps = async (context) => {
  const viewers = await getAllViewers();
  return {
    props: {
      viewers,
    },
  };
};
